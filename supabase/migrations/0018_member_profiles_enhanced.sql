-- ============================================================
-- Migration: 0018_member_profiles_enhanced
-- Description: Enhanced member profiles, medical questionnaires, membership cards
-- ============================================================

-- Enhance members table (skip columns that already exist)
ALTER TABLE members ADD COLUMN IF NOT EXISTS medical_conditions JSONB DEFAULT '[]';
ALTER TABLE members ADD COLUMN IF NOT EXISTS medications TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]';
ALTER TABLE members ADD COLUMN IF NOT EXISTS staff_notes TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS referral_source TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS id_document_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS gdpr_consent_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS gdpr_marketing_consent BOOLEAN DEFAULT false;

-- Medical questionnaire responses
CREATE TABLE IF NOT EXISTS medical_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  heart_condition BOOLEAN DEFAULT false,
  diabetes BOOLEAN DEFAULT false,
  hypertension BOOLEAN DEFAULT false,
  pregnancy BOOLEAN DEFAULT false,
  musculoskeletal_issues BOOLEAN DEFAULT false,
  respiratory_issues BOOLEAN DEFAULT false,
  recent_surgery BOOLEAN DEFAULT false,
  other_conditions TEXT,
  physician_clearance BOOLEAN DEFAULT false,
  acknowledgment_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Membership cards
CREATE TABLE IF NOT EXISTS membership_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL UNIQUE,
  qr_code_data TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  deactivation_reason TEXT,
  deactivated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE medical_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_cards ENABLE ROW LEVEL SECURITY;

-- Medical data: staff-only access
CREATE POLICY "medical_questionnaires_staff" ON medical_questionnaires FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
);

-- Members can read their own card; staff can read all
CREATE POLICY "membership_cards_read" ON membership_cards FOR SELECT TO authenticated USING (
  member_id IN (SELECT id FROM members WHERE profile_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
);
CREATE POLICY "membership_cards_write" ON membership_cards FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
);

-- Auto-generate card number function
CREATE OR REPLACE FUNCTION generate_card_number() RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  card_num TEXT;
  exists_flag BOOLEAN;
BEGIN
  LOOP
    card_num := 'OMG-' || LPAD(TRUNC(RANDOM() * 999999999)::INTEGER::TEXT, 9, '0');
    SELECT EXISTS(SELECT 1 FROM membership_cards WHERE card_number = card_num) INTO exists_flag;
    EXIT WHEN NOT exists_flag;
  END LOOP;
  RETURN card_num;
END;
$$;

CREATE TRIGGER trg_medical_questionnaires_updated_at
  BEFORE UPDATE ON medical_questionnaires
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

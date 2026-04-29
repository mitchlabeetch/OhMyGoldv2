-- ============================================================
-- Migration: 0017_membership_plans_enhanced
-- Description: Enhanced membership plans with billing, features, history
-- ============================================================

-- Add enhanced columns to membership_plans
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly','quarterly','annual','lifetime'));
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS access_hours_restriction JSONB;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS freeze_duration_max_days INTEGER DEFAULT 30;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS freeze_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS cancellation_notice_days INTEGER DEFAULT 30;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS early_termination_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS trial_duration_days INTEGER DEFAULT 0;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#F5A623';
ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'star';

-- Plan features catalog
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL DEFAULT 'general'
);

-- Plan-feature junction
CREATE TABLE IF NOT EXISTS plan_feature_inclusions (
  plan_id UUID NOT NULL REFERENCES membership_plans(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES plan_features(id) ON DELETE CASCADE,
  quantity INTEGER,
  PRIMARY KEY (plan_id, feature_id)
);

-- Plan history (versioning)
CREATE TABLE IF NOT EXISTS plan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES membership_plans(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  old_data JSONB NOT NULL,
  new_data JSONB NOT NULL,
  reason TEXT
);

ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_feature_inclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_features_read" ON plan_features FOR SELECT USING (true);
CREATE POLICY "plan_features_write" ON plan_features FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "plan_inclusions_read" ON plan_feature_inclusions FOR SELECT USING (true);
CREATE POLICY "plan_inclusions_write" ON plan_feature_inclusions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "plan_history_read" ON plan_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "plan_history_insert" ON plan_history FOR INSERT TO authenticated WITH CHECK (changed_by = auth.uid());

-- Seed basic plan features
INSERT INTO plan_features (name, description, icon, category) VALUES
  ('unlimited_gym', 'Unlimited gym access', 'dumbbell', 'access'),
  ('pool_access', 'Swimming pool access', 'waves', 'access'),
  ('group_classes', 'Group fitness classes included', 'users', 'classes'),
  ('personal_training', 'Personal training sessions', 'user-check', 'coaching'),
  ('guest_passes', 'Guest day passes', 'ticket', 'perks'),
  ('towel_service', 'Towel service included', 'shirt', 'perks'),
  ('locker', 'Dedicated locker', 'lock', 'perks'),
  ('app_access', 'Mobile app premium features', 'smartphone', 'digital'),
  ('nutrition_coaching', 'Nutrition plan access', 'leaf', 'coaching'),
  ('off_peak_only', 'Off-peak hours only (06:00-17:00)', 'clock', 'access')
ON CONFLICT DO NOTHING;

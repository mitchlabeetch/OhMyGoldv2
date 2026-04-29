-- ============================================================
-- Migration: 0004_members
-- Description: Gym members table
-- ============================================================

CREATE TABLE public.members (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id              UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  gym_id                  UUID NOT NULL REFERENCES public.gym_locations(id),
  membership_number       TEXT NOT NULL UNIQUE,
  membership_status       public.membership_status NOT NULL DEFAULT 'pending',
  contract_type           public.contract_type NOT NULL DEFAULT 'monthly',
  contract_start          DATE NOT NULL,
  contract_end            DATE,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  medical_notes           TEXT,
  notes                   TEXT,
  gender                  public.gender,
  date_of_birth           DATE,
  deleted_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_members_profile_id ON public.members (profile_id);
CREATE INDEX idx_members_gym_id ON public.members (gym_id);
CREATE INDEX idx_members_membership_status ON public.members (membership_status);
CREATE INDEX idx_members_membership_number ON public.members (membership_number);
CREATE INDEX idx_members_contract_end ON public.members (contract_end);
CREATE INDEX idx_members_deleted_at ON public.members (deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- Function: Generate membership number ----
CREATE SEQUENCE public.membership_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_membership_number(gym_prefix TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(gym_prefix) || '-' || LPAD(NEXTVAL('public.membership_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ---- RLS ----
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Members can read their own record
CREATE POLICY "members_select_own"
  ON public.members FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid() AND deleted_at IS NULL);

-- Staff can read members of their gym
CREATE POLICY "members_select_staff"
  ON public.members FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'admin', 'receptionist', 'coach')
    )
  );

-- Admins and receptionists can create members
CREATE POLICY "members_insert"
  ON public.members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'admin', 'receptionist')
    )
  );

-- Admins and receptionists can update members
CREATE POLICY "members_update"
  ON public.members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'admin', 'receptionist')
    )
  );

-- Only super_admin and admin can soft-delete members
CREATE POLICY "members_delete"
  ON public.members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'admin')
    )
  );

-- ============================================================
-- Migration: 0009_access_control
-- Description: Gym access logs (badge/QR check-in)
-- ============================================================

CREATE TABLE public.access_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id       UUID NOT NULL REFERENCES public.members(id),
  gym_id          UUID NOT NULL REFERENCES public.gym_locations(id),
  granted         BOOLEAN NOT NULL,
  method          public.access_method NOT NULL DEFAULT 'badge',
  denied_reason   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_logs_member_id ON public.access_logs (member_id);
CREATE INDEX idx_access_logs_gym_id ON public.access_logs (gym_id);
CREATE INDEX idx_access_logs_created_at ON public.access_logs (created_at);
CREATE INDEX idx_access_logs_granted ON public.access_logs (granted);

CREATE TRIGGER trg_access_logs_updated_at
  BEFORE UPDATE ON public.access_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- RLS ----
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Members can view their own access history
CREATE POLICY "access_logs_select_own"
  ON public.access_logs FOR SELECT
  TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
  );

-- Staff can view all access logs for their gym
CREATE POLICY "access_logs_select_staff"
  ON public.access_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

-- Receptionist and admin can create access log entries
CREATE POLICY "access_logs_insert"
  ON public.access_logs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

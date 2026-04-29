-- ============================================================
-- Migration: 0005_membership_plans
-- Description: Membership plans / pricing
-- ============================================================

CREATE TABLE public.membership_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id          UUID NOT NULL REFERENCES public.gym_locations(id),
  name            TEXT NOT NULL,
  description     TEXT,
  price_cents     INTEGER NOT NULL CHECK (price_cents >= 0),
  currency        TEXT NOT NULL DEFAULT 'EUR',
  contract_type   public.contract_type NOT NULL,
  duration_days   INTEGER,   -- NULL for open-ended contracts
  features        TEXT[] NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_membership_plans_gym_id ON public.membership_plans (gym_id);
CREATE INDEX idx_membership_plans_is_active ON public.membership_plans (is_active);

CREATE TRIGGER trg_membership_plans_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- RLS ----
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active plans
CREATE POLICY "membership_plans_select"
  ON public.membership_plans FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Admins can manage plans
CREATE POLICY "membership_plans_write"
  ON public.membership_plans FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- ============================================================
-- Migration: 0008_payments
-- Description: Payment records
-- ============================================================

CREATE TABLE public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id       UUID NOT NULL REFERENCES public.members(id),
  gym_id          UUID NOT NULL REFERENCES public.gym_locations(id),
  amount_cents    INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency        TEXT NOT NULL DEFAULT 'EUR',
  status          public.payment_status NOT NULL DEFAULT 'pending',
  payment_method  TEXT NOT NULL DEFAULT 'card',
  reference       TEXT,
  description     TEXT,
  paid_at         TIMESTAMPTZ,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_member_id ON public.payments (member_id);
CREATE INDEX idx_payments_gym_id ON public.payments (gym_id);
CREATE INDEX idx_payments_status ON public.payments (status);
CREATE INDEX idx_payments_paid_at ON public.payments (paid_at);
CREATE INDEX idx_payments_created_at ON public.payments (created_at);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- RLS ----
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Members can view their own payments
CREATE POLICY "payments_select_own"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
  );

-- Staff (admin, receptionist) can view all payments
CREATE POLICY "payments_select_staff"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

-- Staff can create payments
CREATE POLICY "payments_insert"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

-- Admins can update payments (for refunds, status changes)
CREATE POLICY "payments_update"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

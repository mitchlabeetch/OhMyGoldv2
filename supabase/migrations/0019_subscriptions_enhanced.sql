-- ============================================================
-- Migration: 0019_subscriptions_enhanced
-- Description: Subscriptions table and lifecycle event tracking
-- ============================================================

-- Create subscriptions table if it doesn't already exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  location_id UUID NOT NULL REFERENCES gym_locations(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','frozen','cancelled','expired','grace_period')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  next_billing_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced subscription fields
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS freeze_until DATE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS freeze_reason TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS grace_period_until DATE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_billing_attempt_at TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS discount_pct INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS discount_until DATE;

-- Subscription lifecycle event log
CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created','activated','frozen','unfrozen','upgraded','downgraded','cancelled','renewed','payment_failed','payment_succeeded','grace_period')),
  old_plan_id UUID REFERENCES membership_plans(id),
  new_plan_id UUID REFERENCES membership_plans(id),
  reason TEXT,
  performed_by UUID REFERENCES auth.users(id),
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prorated_amount NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Members can view their own subscriptions; staff can view all
CREATE POLICY "subscriptions_read_own" ON subscriptions FOR SELECT TO authenticated USING (
  member_id IN (SELECT id FROM members WHERE profile_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
);
CREATE POLICY "subscriptions_write" ON subscriptions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);

CREATE POLICY "subscription_events_read" ON subscription_events FOR SELECT TO authenticated USING (
  subscription_id IN (
    SELECT id FROM subscriptions
    WHERE member_id IN (SELECT id FROM members WHERE profile_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "subscription_events_insert" ON subscription_events FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
  OR performed_by = auth.uid()
);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

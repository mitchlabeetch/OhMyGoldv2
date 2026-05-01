-- ============================================================
-- 0023_missing_tables.sql
-- Missing tables identified in Phase 4 audit
-- All tables use RLS with helpers from 0022_rls_helpers.sql
-- ============================================================

-- Required for room overlap exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ---- Shared updated_at trigger ----
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. rooms — Physical rooms in a gym location
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.room_type_enum AS ENUM (
    'studio', 'pool', 'court', 'training_floor', 'office', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES public.gym_locations(id) ON DELETE CASCADE,
  name        text NOT NULL,
  room_type   public.room_type_enum NOT NULL DEFAULT 'studio',
  capacity    int NOT NULL DEFAULT 0,
  floor_number int,
  amenities   text[] DEFAULT '{}',
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_select_authenticated" ON public.rooms
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "rooms_insert_staff" ON public.rooms
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "rooms_update_manager" ON public.rooms
  FOR UPDATE TO authenticated USING (public.is_manager());

-- ============================================================
-- 2. room_bookings — Prevents room double-booking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.room_bookings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  class_id    uuid REFERENCES public.gym_classes(id) ON DELETE SET NULL,
  event_title text,
  start_time  timestamptz NOT NULL,
  end_time    timestamptz NOT NULL,
  booked_by   uuid NOT NULL REFERENCES public.user_profiles(id),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT room_no_overlap EXCLUDE USING gist (
    room_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  )
);

ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "room_bookings_select" ON public.room_bookings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_bookings_insert_staff" ON public.room_bookings
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "room_bookings_delete_manager" ON public.room_bookings
  FOR DELETE TO authenticated USING (public.is_manager());

-- ============================================================
-- 3. staff_members — Extended profile for staff users
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.employment_type_enum AS ENUM (
    'full_time', 'part_time', 'contractor', 'volunteer'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.staff_members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  location_id      uuid REFERENCES public.gym_locations(id) ON DELETE SET NULL,
  role             text NOT NULL,
  employment_type  public.employment_type_enum NOT NULL DEFAULT 'full_time',
  hire_date        date,
  hourly_rate      numeric(10, 2),
  specialties      text[] DEFAULT '{}',
  bio              text,
  photo_url        text,
  is_active        boolean NOT NULL DEFAULT true,
  emergency_contact jsonb,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER staff_members_updated_at BEFORE UPDATE ON public.staff_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_members_select_own" ON public.staff_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_manager());
CREATE POLICY "staff_members_insert_manager" ON public.staff_members
  FOR INSERT TO authenticated WITH CHECK (public.is_manager());
CREATE POLICY "staff_members_update_manager" ON public.staff_members
  FOR UPDATE TO authenticated USING (public.is_manager());

-- ============================================================
-- 4. certifications — Staff certifications with expiry tracking
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.certification_status_enum AS ENUM (
    'valid', 'expired', 'pending_renewal', 'revoked'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.certifications (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_member_id  uuid NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  name             text NOT NULL,
  issuing_body     text,
  issued_date      date,
  expiry_date      date,
  certificate_number text,
  document_url     text,
  status           public.certification_status_enum NOT NULL DEFAULT 'valid',
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER certifications_updated_at BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certifications_select_own" ON public.certifications
  FOR SELECT TO authenticated
  USING (
    staff_member_id IN (SELECT id FROM public.staff_members WHERE user_id = auth.uid())
    OR public.is_manager()
  );
CREATE POLICY "certifications_insert_manager" ON public.certifications
  FOR INSERT TO authenticated WITH CHECK (public.is_manager());
CREATE POLICY "certifications_update_manager" ON public.certifications
  FOR UPDATE TO authenticated USING (public.is_manager());
CREATE POLICY "certifications_delete_admin" ON public.certifications
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- 5. waitlist_promotions — Audit log for waitlist promotions
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.promotion_method_enum AS ENUM ('auto', 'manual');
  CREATE TYPE public.promotion_status_enum AS ENUM ('pending_confirmation', 'confirmed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.waitlist_promotions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id           uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  class_id             uuid NOT NULL REFERENCES public.gym_classes(id) ON DELETE CASCADE,
  member_id            uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  promoted_at          timestamptz NOT NULL DEFAULT now(),
  held_until           timestamptz,
  confirmed_at         timestamptz,
  expired_at           timestamptz,
  notification_sent_at timestamptz,
  promotion_method     public.promotion_method_enum NOT NULL DEFAULT 'auto',
  status               public.promotion_status_enum NOT NULL DEFAULT 'pending_confirmation',
  created_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_promotions_select_own" ON public.waitlist_promotions
  FOR SELECT TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_staff()
  );

-- ============================================================
-- 6. invoices — NF 525 compliant invoice records
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.invoice_status_enum AS ENUM (
    'draft', 'issued', 'sent', 'paid', 'overdue', 'voided'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.invoices (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number   text UNIQUE NOT NULL,
  location_id      uuid REFERENCES public.gym_locations(id) ON DELETE SET NULL,
  member_id        uuid REFERENCES public.members(id) ON DELETE SET NULL,
  subscription_id  uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  issued_at        timestamptz NOT NULL DEFAULT now(),
  due_date         date,
  status           public.invoice_status_enum NOT NULL DEFAULT 'draft',
  subtotal_cents   bigint NOT NULL DEFAULT 0,
  tax_rate         numeric(5, 4) NOT NULL DEFAULT 0.2000,
  tax_amount_cents bigint NOT NULL DEFAULT 0,
  total_cents      bigint NOT NULL DEFAULT 0,
  currency         char(3) NOT NULL DEFAULT 'EUR',
  payment_method   text,
  paid_at          timestamptz,
  notes            text,
  pdf_url          text,
  hash             text,
  sequence_number  bigint,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_own" ON public.invoices
  FOR SELECT TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_staff()
  );
CREATE POLICY "invoices_insert_staff" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "invoices_update_manager" ON public.invoices
  FOR UPDATE TO authenticated USING (public.is_manager());

-- ============================================================
-- 7. invoice_items — Invoice line items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description     text NOT NULL,
  quantity        numeric(10, 2) NOT NULL DEFAULT 1,
  unit_price_cents bigint NOT NULL,
  discount_percent numeric(5, 2) NOT NULL DEFAULT 0,
  tax_rate        numeric(5, 4) NOT NULL DEFAULT 0.2000,
  line_total_cents bigint NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_items_select" ON public.invoice_items
  FOR SELECT TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices
      WHERE member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
        OR public.is_staff()
    )
  );
CREATE POLICY "invoice_items_insert_staff" ON public.invoice_items
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

-- ============================================================
-- 8. credit_notes — Refund / adjustment credit notes
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.credit_note_status_enum AS ENUM ('issued', 'applied', 'voided');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.credit_notes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_number    text UNIQUE NOT NULL,
  invoice_id            uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  member_id             uuid REFERENCES public.members(id) ON DELETE SET NULL,
  amount_cents          bigint NOT NULL,
  reason                text NOT NULL,
  issued_at             timestamptz NOT NULL DEFAULT now(),
  status                public.credit_note_status_enum NOT NULL DEFAULT 'issued',
  applied_to_invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  created_by            uuid NOT NULL REFERENCES public.user_profiles(id),
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_notes_select_own" ON public.credit_notes
  FOR SELECT TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_manager()
  );
CREATE POLICY "credit_notes_insert_manager" ON public.credit_notes
  FOR INSERT TO authenticated WITH CHECK (public.is_manager());
CREATE POLICY "credit_notes_update_manager" ON public.credit_notes
  FOR UPDATE TO authenticated USING (public.is_manager());

-- ============================================================
-- 9. dunning_log — Overdue reminder history
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.dunning_channel_enum AS ENUM ('email', 'sms', 'push', 'phone', 'letter');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.dunning_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  member_id     uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  dunning_stage int NOT NULL,
  channel       public.dunning_channel_enum NOT NULL DEFAULT 'email',
  sent_at       timestamptz NOT NULL DEFAULT now(),
  response_at   timestamptz,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dunning_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dunning_log_select_manager" ON public.dunning_log
  FOR SELECT TO authenticated USING (public.is_manager());
CREATE POLICY "dunning_log_insert_manager" ON public.dunning_log
  FOR INSERT TO authenticated WITH CHECK (public.is_manager());

-- ============================================================
-- 10. fiscal_closures — Daily Z-ticket records (NF 525)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.fiscal_closures (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id          uuid NOT NULL REFERENCES public.gym_locations(id) ON DELETE CASCADE,
  closure_date         date NOT NULL,
  opened_at            timestamptz NOT NULL,
  closed_at            timestamptz,
  total_revenue_cents  bigint NOT NULL DEFAULT 0,
  total_refunds_cents  bigint NOT NULL DEFAULT 0,
  total_invoices       int NOT NULL DEFAULT 0,
  sequence_number      bigint NOT NULL,
  signed_hash          text,
  closed_by            uuid REFERENCES public.user_profiles(id),
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (location_id, closure_date)
);

ALTER TABLE public.fiscal_closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fiscal_closures_manager" ON public.fiscal_closures
  FOR ALL TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());

-- ============================================================
-- 11. inventory_transactions — Append-only stock ledger
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.inventory_txn_type_enum AS ENUM (
    'purchase', 'sale', 'adjustment', 'return', 'waste', 'transfer'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES public.pos_products(id) ON DELETE CASCADE,
  location_id      uuid NOT NULL REFERENCES public.gym_locations(id) ON DELETE CASCADE,
  transaction_type public.inventory_txn_type_enum NOT NULL DEFAULT 'adjustment',
  quantity_change  int NOT NULL,
  quantity_before  int NOT NULL,
  quantity_after   int NOT NULL,
  unit_cost_cents  bigint,
  reference_id     uuid,
  reference_type   text,
  notes            text,
  performed_by     uuid REFERENCES public.user_profiles(id),
  created_at       timestamptz NOT NULL DEFAULT now()
  -- No updated_at: append-only ledger, no updates allowed
);

ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_txn_select_staff" ON public.inventory_transactions
  FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "inventory_txn_insert_staff" ON public.inventory_transactions
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
-- No UPDATE or DELETE policies — append-only

-- ============================================================
-- 12. purchase_orders — Supplier purchase orders
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.purchase_order_status_enum AS ENUM (
    'draft', 'sent', 'partially_received', 'received', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id        uuid NOT NULL REFERENCES public.gym_locations(id) ON DELETE CASCADE,
  supplier_id        uuid,
  supplier_name      text NOT NULL,
  po_number          text UNIQUE NOT NULL,
  status             public.purchase_order_status_enum NOT NULL DEFAULT 'draft',
  ordered_at         timestamptz,
  expected_at        date,
  received_at        timestamptz,
  subtotal_cents     bigint NOT NULL DEFAULT 0,
  tax_amount_cents   bigint NOT NULL DEFAULT 0,
  total_cents        bigint NOT NULL DEFAULT 0,
  notes              text,
  created_by         uuid NOT NULL REFERENCES public.user_profiles(id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_orders_manager" ON public.purchase_orders
  FOR ALL TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());

-- ============================================================
-- 13. suppliers — Supplier directory
-- ============================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  contact_name       text,
  email              text,
  phone              text,
  address            jsonb,
  siret              text,
  payment_terms_days int NOT NULL DEFAULT 30,
  is_active          boolean NOT NULL DEFAULT true,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Add deferred FK from purchase_orders to suppliers
ALTER TABLE public.purchase_orders
  ADD CONSTRAINT purchase_orders_supplier_fk
  FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL
  NOT VALID;

CREATE TRIGGER suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_manager" ON public.suppliers
  FOR ALL TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());

-- ============================================================
-- 14. stock_counts — Physical inventory count records
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stock_counts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id      uuid NOT NULL REFERENCES public.gym_locations(id) ON DELETE CASCADE,
  product_id       uuid NOT NULL REFERENCES public.pos_products(id) ON DELETE CASCADE,
  counted_at       timestamptz NOT NULL DEFAULT now(),
  system_quantity  int NOT NULL,
  counted_quantity int NOT NULL,
  variance         int GENERATED ALWAYS AS (counted_quantity - system_quantity) STORED,
  notes            text,
  counted_by       uuid NOT NULL REFERENCES public.user_profiles(id),
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_counts_insert_staff" ON public.stock_counts
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "stock_counts_select_manager" ON public.stock_counts
  FOR SELECT TO authenticated USING (public.is_manager());

-- ============================================================
-- 15. campaigns — Marketing campaigns
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.campaign_type_enum AS ENUM ('email', 'sms', 'push', 'mixed');
  CREATE TYPE public.campaign_status_enum AS ENUM (
    'draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.campaigns (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id         uuid REFERENCES public.gym_locations(id) ON DELETE SET NULL,
  name                text NOT NULL,
  description         text,
  campaign_type       public.campaign_type_enum NOT NULL DEFAULT 'email',
  status              public.campaign_status_enum NOT NULL DEFAULT 'draft',
  scheduled_at        timestamptz,
  sent_at             timestamptz,
  subject             text,
  body_html           text,
  body_text           text,
  target_segment_id   uuid,
  created_by          uuid NOT NULL REFERENCES public.user_profiles(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_manager" ON public.campaigns
  FOR ALL TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());

-- ============================================================
-- 16. campaign_segments — Target audience definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaign_segments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  description         text,
  criteria            jsonb NOT NULL DEFAULT '{}',
  member_count        int NOT NULL DEFAULT 0,
  last_calculated_at  timestamptz,
  created_by          uuid NOT NULL REFERENCES public.user_profiles(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Deferred FK from campaigns to segments
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_segment_fk
  FOREIGN KEY (target_segment_id) REFERENCES public.campaign_segments(id) ON DELETE SET NULL
  NOT VALID;

CREATE TRIGGER campaign_segments_updated_at BEFORE UPDATE ON public.campaign_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.campaign_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_segments_manager" ON public.campaign_segments
  FOR ALL TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());

-- ============================================================
-- 17. campaign_analytics — Delivery and engagement tracking
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.campaign_analytics_channel_enum AS ENUM ('email', 'sms', 'push');
  CREATE TYPE public.campaign_analytics_status_enum AS ENUM (
    'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.campaign_analytics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  member_id    uuid REFERENCES public.members(id) ON DELETE SET NULL,
  channel      public.campaign_analytics_channel_enum NOT NULL,
  status       public.campaign_analytics_status_enum NOT NULL DEFAULT 'queued',
  sent_at      timestamptz,
  delivered_at timestamptz,
  opened_at    timestamptz,
  clicked_at   timestamptz,
  error_message text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_analytics_select_manager" ON public.campaign_analytics
  FOR SELECT TO authenticated USING (public.is_manager());

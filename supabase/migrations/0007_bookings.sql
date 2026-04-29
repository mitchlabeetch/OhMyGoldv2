-- ============================================================
-- Migration: 0007_bookings
-- Description: Class bookings and waitlist
-- ============================================================

CREATE TABLE public.bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id        UUID NOT NULL REFERENCES public.gym_classes(id) ON DELETE CASCADE,
  member_id       UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  status          public.booking_status NOT NULL DEFAULT 'booked',
  booked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at    TIMESTAMPTZ,
  attended_at     TIMESTAMPTZ,
  waitlist_position INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_id, member_id)
);

CREATE INDEX idx_bookings_class_id ON public.bookings (class_id);
CREATE INDEX idx_bookings_member_id ON public.bookings (member_id);
CREATE INDEX idx_bookings_status ON public.bookings (status);
CREATE INDEX idx_bookings_booked_at ON public.bookings (booked_at);

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- Function: Update class booking count on insert/update ----
CREATE OR REPLACE FUNCTION public.update_class_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'booked' THEN
    UPDATE public.gym_classes SET current_bookings = current_bookings + 1 WHERE id = NEW.class_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE public.gym_classes SET current_bookings = GREATEST(0, current_bookings - 1) WHERE id = NEW.class_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'booked' THEN
      UPDATE public.gym_classes SET current_bookings = current_bookings + 1 WHERE id = NEW.class_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'booked' THEN
    UPDATE public.gym_classes SET current_bookings = GREATEST(0, current_bookings - 1) WHERE id = OLD.class_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_booking_count
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_class_booking_count();

-- ---- RLS ----
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Members can view their own bookings
CREATE POLICY "bookings_select_own"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
  );

-- Staff can view all bookings for their classes
CREATE POLICY "bookings_select_staff"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist', 'coach'))
  );

-- Members can book classes
CREATE POLICY "bookings_insert_member"
  ON public.bookings FOR INSERT
  WITH CHECK (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid() AND membership_status = 'active')
  );

-- Staff can also book on behalf of members
CREATE POLICY "bookings_insert_staff"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

-- Members can cancel their own bookings
CREATE POLICY "bookings_update_own"
  ON public.bookings FOR UPDATE
  USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
  );

-- Staff can update any booking
CREATE POLICY "bookings_update_staff"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist', 'coach'))
  );

-- ============================================================
-- 0024_booking_atomic_fn.sql
-- Atomic booking stored functions with waitlist auto-promotion
-- ============================================================

-- Add 'held' status to booking_status enum (for 24-hour hold)
-- ADD VALUE IF NOT EXISTS is safe; we only catch the specific
-- duplicate_object exception for older Postgres compatibility.
DO $$
BEGIN
  ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'held';
EXCEPTION WHEN duplicate_object THEN
  -- 'held' already exists; safe to continue
  NULL;
END $$;

-- ============================================================
-- update_class_booking_count (replacement, held-aware)
--
-- Replaces the version in 0007_bookings.sql to correctly
-- handle the 'held' status (promoted from waitlist, spot not
-- yet counted in current_bookings until confirmed):
--   • 'booked' INSERT           → increment
--   • 'booked' → 'cancelled'   → decrement
--   • 'held'   → 'booked'      → increment (confirmed hold)
--   • 'held'   → 'cancelled'   → no-op (was never counted)
--   • 'waitlisted' → anything  → no-op
--   • 'cancelled'  → 'booked'  → increment (re-booking)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_class_booking_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'booked' THEN
    UPDATE public.gym_classes
       SET current_bookings = current_bookings + 1
     WHERE id = NEW.class_id;

  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'booked' AND NEW.status = 'cancelled' THEN
      -- Confirmed seat cancelled → free the spot
      UPDATE public.gym_classes
         SET current_bookings = GREATEST(0, current_bookings - 1)
       WHERE id = NEW.class_id;
    ELSIF OLD.status IN ('held', 'cancelled') AND NEW.status = 'booked' THEN
      -- Held slot confirmed, or cancelled booking reinstated
      UPDATE public.gym_classes
         SET current_bookings = current_bookings + 1
       WHERE id = NEW.class_id;
    END IF;
    -- 'held' → 'cancelled': no-op (slot was never counted)
    -- 'waitlisted' → anything: no-op

  ELSIF TG_OP = 'DELETE' AND OLD.status = 'booked' THEN
    UPDATE public.gym_classes
       SET current_bookings = GREATEST(0, current_bookings - 1)
     WHERE id = OLD.class_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ============================================================
-- book_class_atomic(p_class_id, p_member_id) → jsonb
--
-- SECURITY DEFINER: runs with definer privileges to bypass RLS
-- during row-lock. Enforces authorization explicitly:
--   • Staff roles may book on behalf of any member.
--   • Non-staff callers must be the member themselves AND the
--     membership must be active.
-- Returns: { status: 'booked'|'waitlisted', booking_id, waitlist_position }
-- ============================================================
CREATE OR REPLACE FUNCTION public.book_class_atomic(
  p_class_id  uuid,
  p_member_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_uid      uuid := auth.uid();
  v_is_staff        boolean := false;
  v_class           record;
  v_existing        uuid;
  v_booking_id      uuid;
  v_waitlist_pos    int;
  v_status          text;
BEGIN
  -- ---- Authorization check ----
  SELECT public.is_staff()
    INTO v_is_staff;

  IF NOT COALESCE(v_is_staff, false) THEN
    -- Non-staff: must be booking for their own active member record
    PERFORM 1
      FROM public.members
     WHERE id               = p_member_id
       AND profile_id       = v_caller_uid
       AND membership_status = 'active';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Unauthorized: cannot book for this member or membership is not active';
    END IF;
  END IF;

  -- Lock the class row to prevent concurrent overbooking
  SELECT id, max_capacity, current_bookings, status
    INTO v_class
    FROM public.gym_classes
   WHERE id = p_class_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class % not found', p_class_id;
  END IF;

  IF v_class.status = 'cancelled' THEN
    RAISE EXCEPTION 'Class has been cancelled';
  END IF;

  -- Check for duplicate active booking
  SELECT id INTO v_existing
    FROM public.bookings
   WHERE class_id  = p_class_id
     AND member_id = p_member_id
     AND status IN ('booked', 'waitlisted', 'held');

  IF FOUND THEN
    RAISE EXCEPTION 'Member already has an active booking for this class';
  END IF;

  IF v_class.current_bookings < v_class.max_capacity THEN
    -- ---- Confirmed booking ----
    -- trg_booking_count will increment current_bookings on INSERT
    v_status := 'booked';

    INSERT INTO public.bookings (class_id, member_id, status)
    VALUES (p_class_id, p_member_id, 'booked')
    RETURNING id INTO v_booking_id;

    v_waitlist_pos := NULL;
  ELSE
    -- ---- Waitlisted booking ----
    v_status := 'waitlisted';

    SELECT COALESCE(MAX(waitlist_position), 0) + 1
      INTO v_waitlist_pos
      FROM public.bookings
     WHERE class_id = p_class_id
       AND status   = 'waitlisted';

    INSERT INTO public.bookings (class_id, member_id, status, waitlist_position)
    VALUES (p_class_id, p_member_id, 'waitlisted', v_waitlist_pos)
    RETURNING id INTO v_booking_id;
  END IF;

  RETURN jsonb_build_object(
    'status',            v_status,
    'booking_id',        v_booking_id,
    'waitlist_position', v_waitlist_pos
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_class_atomic(uuid, uuid) TO authenticated;

-- ============================================================
-- promote_next_waitlisted(p_class_id) → void
--
-- Finds the next waitlisted booking (lowest position) and
-- sets it to 'held' for 24 hours with an audit record.
-- Acquires the gym_classes row lock so inserts/promotions for the
-- same class are serialized with book_class_atomic().
-- Intended for internal trigger/service-role use only.
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_next_waitlisted(p_class_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_booking record;
  v_hold_until   timestamptz;
BEGIN
  -- Serialize all waitlist mutations for a class with the same lock
  -- used by book_class_atomic().
  PERFORM 1
    FROM public.gym_classes
   WHERE id = p_class_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class % not found', p_class_id;
  END IF;

  SELECT b.id, b.member_id
    INTO v_next_booking
    FROM public.bookings b
   WHERE b.class_id = p_class_id
     AND b.status   = 'waitlisted'
   ORDER BY b.waitlist_position ASC
   LIMIT 1
     FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  v_hold_until := now() + interval '24 hours';

  -- Promote to 'held' — note: current_bookings is NOT incremented here;
  -- it increments only when the member confirms ('held' → 'booked').
  UPDATE public.bookings
     SET status            = 'held',
         waitlist_position = NULL
   WHERE id = v_next_booking.id;

  INSERT INTO public.waitlist_promotions (
    booking_id, class_id, member_id, promoted_at, held_until,
    promotion_method, status
  )
  VALUES (
    v_next_booking.id, p_class_id, v_next_booking.member_id,
    now(), v_hold_until, 'auto', 'pending_confirmation'
  );

  -- Compact remaining waitlist positions
  UPDATE public.bookings
     SET waitlist_position = waitlist_position - 1
   WHERE class_id          = p_class_id
     AND status            = 'waitlisted'
     AND waitlist_position IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.promote_next_waitlisted(uuid) FROM PUBLIC, anon, authenticated;

-- ============================================================
-- trigger_promote_on_cancel()
--
-- Fires AFTER UPDATE OF status ON bookings.
-- When a 'booked' booking is cancelled, promotes the next
-- waitlisted member to 'held'.
-- Counter management is fully delegated to trg_booking_count
-- (update_class_booking_count) — no manual counter update here.
-- ============================================================
CREATE OR REPLACE FUNCTION public.trigger_promote_on_cancel()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only promote when a real confirmed seat is freed
  IF OLD.status = 'booked' AND NEW.status = 'cancelled' THEN
    PERFORM public.promote_next_waitlisted(NEW.class_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS booking_cancel_trigger ON public.bookings;
CREATE TRIGGER booking_cancel_trigger
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_promote_on_cancel();

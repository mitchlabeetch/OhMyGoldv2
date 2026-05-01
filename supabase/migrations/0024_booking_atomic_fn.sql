-- ============================================================
-- 0024_booking_atomic_fn.sql
-- Atomic booking stored functions with waitlist auto-promotion
-- ============================================================

-- Add 'held' status to booking_status enum (for 24-hour hold)
DO $$
BEGIN
  ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'held';
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================================
-- book_class_atomic(p_class_id, p_member_id) → jsonb
--
-- Row-locks the class record to prevent race conditions.
-- Returns: { status: 'confirmed'|'waitlisted', booking_id, waitlist_position }
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
  v_class           record;
  v_existing        uuid;
  v_booking_id      uuid;
  v_waitlist_pos    int;
  v_status          text;
BEGIN
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

  -- Check if member already has an active booking
  SELECT id INTO v_existing
    FROM public.bookings
   WHERE class_id  = p_class_id
     AND member_id = p_member_id
     AND status IN ('confirmed', 'waitlisted', 'held');

  IF FOUND THEN
    RAISE EXCEPTION 'Member already has an active booking for this class';
  END IF;

  IF v_class.current_bookings < v_class.max_capacity THEN
    -- ---- Confirmed booking ----
    v_status := 'confirmed';

    INSERT INTO public.bookings (class_id, member_id, status)
    VALUES (p_class_id, p_member_id, 'confirmed')
    RETURNING id INTO v_booking_id;

    -- Increment booking counter
    UPDATE public.gym_classes
       SET current_bookings = current_bookings + 1
     WHERE id = p_class_id;

    v_waitlist_pos := NULL;
  ELSE
    -- ---- Waitlisted booking ----
    v_status := 'waitlisted';

    -- Calculate next waitlist position
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
-- Finds the next waitlisted booking (lowest position),
-- sets it to 'held' for 24 hours, and records the promotion.
-- Called automatically by the booking_cancel_trigger below.
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
  -- Find the next waitlisted booking (SKIP LOCKED prevents race conditions)
  SELECT b.id, b.member_id
    INTO v_next_booking
    FROM public.bookings b
   WHERE b.class_id = p_class_id
     AND b.status   = 'waitlisted'
   ORDER BY b.waitlist_position ASC
   LIMIT 1
     FOR UPDATE SKIP LOCKED;

  -- No one on waitlist — nothing to do
  IF NOT FOUND THEN
    RETURN;
  END IF;

  v_hold_until := now() + interval '24 hours';

  -- Promote to 'held' with a 24-hour confirmation window
  UPDATE public.bookings
     SET status            = 'held',
         waitlist_position = NULL
   WHERE id = v_next_booking.id;

  -- Insert waitlist_promotions audit record
  INSERT INTO public.waitlist_promotions (
    booking_id,
    class_id,
    member_id,
    promoted_at,
    held_until,
    promotion_method,
    status
  )
  VALUES (
    v_next_booking.id,
    p_class_id,
    v_next_booking.member_id,
    now(),
    v_hold_until,
    'auto',
    'pending_confirmation'
  );

  -- Decrement remaining waitlist positions for all entries below
  UPDATE public.bookings
     SET waitlist_position = waitlist_position - 1
   WHERE class_id          = p_class_id
     AND status            = 'waitlisted'
     AND waitlist_position IS NOT NULL;

END;
$$;

GRANT EXECUTE ON FUNCTION public.promote_next_waitlisted(uuid) TO authenticated;

-- ============================================================
-- trigger_promote_on_cancel() — trigger function
--
-- Fires AFTER UPDATE OF status ON bookings.
-- When a confirmed/held booking is cancelled, promotes next
-- waitlisted member and frees one confirmed slot.
-- ============================================================
CREATE OR REPLACE FUNCTION public.trigger_promote_on_cancel()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('confirmed', 'held') AND NEW.status = 'cancelled' THEN
    -- Free up one spot on the class
    UPDATE public.gym_classes
       SET current_bookings = GREATEST(0, current_bookings - 1)
     WHERE id = NEW.class_id;

    -- Promote next person on waitlist
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

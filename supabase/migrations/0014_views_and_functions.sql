-- ============================================================
-- Migration: 0014_views_and_functions
-- Description: Useful views and helper functions
-- ============================================================

-- ---- View: member_details (joins profile + member) ----
CREATE OR REPLACE VIEW public.member_details AS
SELECT
  m.id,
  m.profile_id,
  m.gym_id,
  m.membership_number,
  m.membership_status,
  m.contract_type,
  m.contract_start,
  m.contract_end,
  m.gender,
  m.date_of_birth,
  m.notes,
  m.deleted_at,
  m.created_at,
  m.updated_at,
  up.email,
  up.first_name,
  up.last_name,
  up.phone,
  up.avatar_url,
  up.language,
  gl.name AS gym_name,
  gl.city AS gym_city
FROM public.members m
JOIN public.user_profiles up ON up.id = m.profile_id
JOIN public.gym_locations gl ON gl.id = m.gym_id
WHERE m.deleted_at IS NULL;

-- ---- View: class_details (joins class + coach) ----
CREATE OR REPLACE VIEW public.class_details AS
SELECT
  gc.id,
  gc.gym_id,
  gc.coach_id,
  gc.name,
  gc.description,
  gc.category,
  gc.duration_minutes,
  gc.max_capacity,
  gc.current_bookings,
  gc.max_capacity - gc.current_bookings AS available_spots,
  gc.scheduled_at,
  gc.status,
  gc.room,
  gc.is_recurring,
  gc.recurrence_rule,
  gc.created_at,
  up.first_name AS coach_first_name,
  up.last_name AS coach_last_name,
  up.avatar_url AS coach_avatar_url,
  gl.name AS gym_name
FROM public.gym_classes gc
LEFT JOIN public.user_profiles up ON up.id = gc.coach_id
JOIN public.gym_locations gl ON gl.id = gc.gym_id;

-- ---- View: daily_stats ----
CREATE OR REPLACE VIEW public.daily_stats AS
SELECT
  gl.id AS gym_id,
  gl.name AS gym_name,
  DATE(NOW() AT TIME ZONE 'Europe/Paris') AS stat_date,
  COUNT(DISTINCT al.member_id) FILTER (WHERE al.granted = TRUE AND DATE(al.created_at AT TIME ZONE 'Europe/Paris') = DATE(NOW() AT TIME ZONE 'Europe/Paris')) AS access_count_today,
  COUNT(DISTINCT gc.id) FILTER (WHERE DATE(gc.scheduled_at AT TIME ZONE 'Europe/Paris') = DATE(NOW() AT TIME ZONE 'Europe/Paris')) AS classes_today,
  COUNT(DISTINCT m.id) FILTER (WHERE m.membership_status = 'active') AS active_members,
  COALESCE(SUM(p.amount_cents) FILTER (WHERE p.status = 'paid' AND DATE(p.paid_at AT TIME ZONE 'Europe/Paris') = DATE(NOW() AT TIME ZONE 'Europe/Paris')), 0) AS revenue_today_cents
FROM public.gym_locations gl
LEFT JOIN public.access_logs al ON al.gym_id = gl.id
LEFT JOIN public.gym_classes gc ON gc.gym_id = gl.id
LEFT JOIN public.members m ON m.gym_id = gl.id AND m.deleted_at IS NULL
LEFT JOIN public.payments p ON p.gym_id = gl.id
WHERE gl.is_active = TRUE
GROUP BY gl.id, gl.name;

-- ---- Function: Check if member can access gym ----
CREATE OR REPLACE FUNCTION public.can_member_access(p_member_id UUID)
RETURNS TABLE (
  granted BOOLEAN,
  reason TEXT
) AS $$
DECLARE
  v_member public.members%ROWTYPE;
BEGIN
  SELECT * INTO v_member FROM public.members WHERE id = p_member_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Member not found';
    RETURN;
  END IF;

  IF v_member.membership_status != 'active' THEN
    RETURN QUERY SELECT FALSE, 'Membership not active: ' || v_member.membership_status::TEXT;
    RETURN;
  END IF;

  IF v_member.contract_end IS NOT NULL AND v_member.contract_end < CURRENT_DATE THEN
    RETURN QUERY SELECT FALSE, 'Contract expired on ' || v_member.contract_end::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, 'Access granted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

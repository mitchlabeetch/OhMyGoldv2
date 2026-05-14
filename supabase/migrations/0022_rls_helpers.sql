-- ============================================================
-- Migration: 0022_rls_helpers
-- Description: Extend app_role enum with roadmap roles, add RLS
--              helper functions, and secure views with security_barrier.
-- ============================================================

-- ---- 1. Extend app_role enum (backward-compatible ADD VALUE) ----
-- PostgreSQL requires each ADD VALUE in a separate statement.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'employee';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- ============================================================
-- 2. RLS Helper Functions (SECURITY DEFINER)
--    These run as the role that defined them (postgres / service_role),
--    so they bypass RLS and can safely read user_profiles.
--    Policies call these instead of embedding raw subqueries.
-- ============================================================

-- Returns the current user's role from user_profiles.
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Returns the current user's assigned location id (for gym-scoped RLS).
-- NOTE: Returns NULL for staff users who may not have a member record.
-- This function is intended for member/client scoping, not staff.
-- For staff, use is_staff() to bypass location checks.
CREATE OR REPLACE FUNCTION public.get_current_user_location_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT gym_id FROM public.members WHERE profile_id = auth.uid() LIMIT 1;
$$;

-- Checks whether the current user is a super_admin.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() = 'super_admin';
$$;

-- Checks whether the current user is an admin or super_admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN ('admin', 'super_admin');
$$;

-- Checks whether the current user is a manager, admin, or super_admin.
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN ('manager', 'admin', 'super_admin');
$$;

-- Checks whether the current user is any staff role.
-- Staff = manager | admin | super_admin | employee | receptionist | coach | teacher
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN (
    'super_admin', 'admin', 'manager',
    'employee', 'receptionist',
    'coach', 'teacher'
  );
$$;

-- Checks whether the current user is a front-desk / check-in staff.
-- Maps both legacy (receptionist) and new (employee) roles.
CREATE OR REPLACE FUNCTION public.is_front_desk()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN (
    'employee', 'receptionist',
    'manager', 'admin', 'super_admin'
  );
$$;

-- Checks whether the current user is a class instructor.
-- Maps both legacy (coach) and new (teacher) roles.
CREATE OR REPLACE FUNCTION public.is_coach()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN (
    'coach', 'teacher',
    'manager', 'admin', 'super_admin'
  );
$$;

-- Checks whether the current user is a paying member.
-- Maps both legacy (member) and new (client) roles.
CREATE OR REPLACE FUNCTION public.is_member()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() IN (
    'member', 'client'
  );
$$;

-- ============================================================
-- 3. Recreate views with security_barrier and access predicates
--    to prevent authenticated users from reading PII they
--    should not see.
-- ============================================================

-- 3a. member_details:
--   - members/clients see only their own record
--   - staff (all non-visitor/non-member roles) see all
DROP VIEW IF EXISTS public.member_details;
CREATE VIEW public.member_details
WITH (security_barrier = true)
AS
SELECT
  m.id,
  m.profile_id,
  m.gym_id,
  m.membership_number,
  m.membership_status,
  m.contract_type,
  m.contract_start,
  m.contract_end,
  m.emergency_contact_name,
  m.emergency_contact_phone,
  m.medical_notes,
  m.notes,
  m.gender,
  m.date_of_birth,
  m.created_at,
  m.updated_at,
  p.first_name,
  p.last_name,
  p.email,
  p.phone,
  p.avatar_url,
  p.language,
  p.timezone
FROM public.members m
JOIN public.user_profiles p ON p.id = m.profile_id
WHERE
  -- Member sees only their own record
  (get_current_user_role() IN ('member', 'client') AND m.profile_id = auth.uid())
  OR
  -- Staff can see all records
  is_staff();

-- 3b. class_details:
--   - all authenticated users see scheduled/published classes
--   - staff see all statuses (including cancelled, draft, etc.)
DROP VIEW IF EXISTS public.class_details;
CREATE VIEW public.class_details
WITH (security_barrier = true)
AS
SELECT
  c.id,
  c.gym_id,
  c.coach_id,
  c.name,
  c.description,
  c.category,
  c.duration_minutes,
  c.max_capacity,
  c.current_bookings,
  c.scheduled_at,
  c.status,
  c.room,
  c.is_recurring,
  c.recurrence_rule,
  c.created_at,
  c.updated_at,
  p.first_name AS coach_first_name,
  p.last_name  AS coach_last_name,
  p.avatar_url AS coach_avatar_url
FROM public.gym_classes c
LEFT JOIN public.user_profiles p ON p.id = c.coach_id
WHERE
  -- Members and visitors only see scheduled classes
  (
    get_current_user_role() IN ('member', 'client', 'visitor')
    AND c.status = 'scheduled'
  )
  OR
  -- Staff see everything
  is_staff();

-- 3c. daily_stats (revenue aggregate — staff only):
DROP VIEW IF EXISTS public.daily_stats;
CREATE VIEW public.daily_stats
WITH (security_barrier = true)
AS
SELECT
  date_trunc('day', p.created_at)::date AS stat_date,
  p.gym_id,
  COUNT(*)                               AS total_transactions,
  SUM(p.amount_cents)                    AS total_revenue_cents,
  COUNT(*) FILTER (WHERE p.status = 'paid')    AS paid_count,
  COUNT(*) FILTER (WHERE p.status = 'refunded') AS refunded_count
FROM public.payments p
WHERE is_staff()  -- non-staff get an empty result set via the security barrier
GROUP BY 1, 2;

-- ============================================================
-- 4. Grant SELECT on views to authenticated role
-- ============================================================
GRANT SELECT ON public.member_details TO authenticated;
GRANT SELECT ON public.class_details  TO authenticated;
GRANT SELECT ON public.daily_stats    TO authenticated;

-- ============================================================
-- 5. Comments documenting the role mapping strategy
-- ============================================================
COMMENT ON FUNCTION public.is_coach()    IS 'Returns true for coach (legacy) and teacher (roadmap) roles plus managers/admins.';
COMMENT ON FUNCTION public.is_front_desk() IS 'Returns true for receptionist (legacy) and employee (roadmap) roles plus managers/admins.';
COMMENT ON FUNCTION public.is_member()   IS 'Returns true for member (legacy) and client (roadmap) roles.';
COMMENT ON FUNCTION public.is_staff()    IS 'Returns true for any non-member, non-visitor role.';
COMMENT ON FUNCTION public.is_manager()  IS 'Returns true for manager, admin, and super_admin.';
COMMENT ON FUNCTION public.is_admin()    IS 'Returns true for admin and super_admin.';
COMMENT ON FUNCTION public.is_super_admin() IS 'Returns true only for super_admin.';
COMMENT ON VIEW public.member_details IS 'Security-barrier view: members see own record only; staff see all.';
COMMENT ON VIEW public.class_details  IS 'Security-barrier view: members/visitors see scheduled only; staff see all.';
COMMENT ON VIEW public.daily_stats    IS 'Security-barrier view: staff-only revenue aggregate.';

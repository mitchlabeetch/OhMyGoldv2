-- ============================================================
-- Migration: 0012_realtime_publications
-- Description: Configure Supabase Realtime publications
-- ============================================================

-- Enable Realtime on relevant tables
BEGIN;

-- Drop existing publication if it exists (idempotent)
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create publication for real-time subscriptions
CREATE PUBLICATION supabase_realtime FOR TABLE
  public.gym_classes,
  public.bookings,
  public.notifications,
  public.access_logs;

COMMIT;

-- ---- Realtime RLS Safety ----
-- These tables already have RLS enabled. Supabase Realtime respects RLS policies
-- when users subscribe to changes, ensuring users only receive their authorized data.

-- Grant realtime schema permissions (required by Supabase)
GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA realtime TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA realtime TO postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA realtime TO postgres;

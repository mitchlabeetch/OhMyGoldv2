-- ============================================================
-- realtime.sql — Supabase Realtime configuration
-- ============================================================

-- Create realtime schema for publication management
CREATE SCHEMA IF NOT EXISTS realtime;

-- Allow authenticated users to access realtime schema
GRANT USAGE ON SCHEMA realtime TO authenticated;

-- Enable logical replication publication for realtime
-- This is the publication that Supabase Realtime listens to
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- ============================================================
-- logs.sql — Logging configuration for Supabase Logflare
-- ============================================================

-- Create logflare extension schema if not present
CREATE SCHEMA IF NOT EXISTS _analytics;

ALTER ROLE supabase_admin SET search_path TO "$user",public,extensions;

-- Log all DDL changes for audit trail
CREATE OR REPLACE FUNCTION extensions.notify_api_restart()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

CREATE EVENT TRIGGER api_restart
ON ddl_command_end
EXECUTE PROCEDURE extensions.notify_api_restart();

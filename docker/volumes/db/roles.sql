-- ============================================================
-- roles.sql — Initial Supabase role grants
-- Run by: postgres (superuser) at container init
-- ============================================================

-- Grant usage on schemas to service roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant basic privileges on all future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO authenticated, service_role;

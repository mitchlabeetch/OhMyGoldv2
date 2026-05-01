-- ============================================================
-- jwt.sql — JWT helper functions for Supabase Auth
-- ============================================================

-- Helper: extract JWT claims from the current request
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    )::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(
      current_setting('request.jwt.claim.role', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
    )::text;
$$;

CREATE OR REPLACE FUNCTION auth.email()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(
      current_setting('request.jwt.claim.email', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'email')
    )::text;
$$;

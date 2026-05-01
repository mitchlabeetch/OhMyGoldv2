-- ============================================================
-- webhooks.sql — Supabase webhook support functions
-- ============================================================

-- Create http extension for webhook calls (if not already present)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Webhook helper function used by Supabase triggers
CREATE OR REPLACE FUNCTION supabase_functions.http_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
  url text := TG_ARGV[0];
  method text := TG_ARGV[1];
  headers jsonb DEFAULT '{}';
  params  jsonb DEFAULT '{}';
  timeout_ms integer DEFAULT 1000;
BEGIN
  IF url IS NULL OR url = 'null' THEN
    RAISE EXCEPTION 'url argument is missing';
  END IF;

  IF method IS NULL OR method = 'null' THEN
    RAISE EXCEPTION 'method argument is missing';
  END IF;

  IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
    headers = '{"Content-Type": "application/json"}'::jsonb;
  ELSE
    headers = TG_ARGV[2]::jsonb;
  END IF;

  IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
    params = '{}'::jsonb;
  ELSE
    params = TG_ARGV[3]::jsonb;
  END IF;

  IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
    timeout_ms = 1000;
  ELSE
    timeout_ms = TG_ARGV[4]::integer;
  END IF;

  CASE
    WHEN method = 'GET' THEN
      SELECT http_get INTO request_id
        FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
    WHEN method = 'POST' THEN
      payload = jsonb_build_object(
        'old_record', OLD,
        'record', NEW,
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA
      );
      SELECT http_post INTO request_id
        FROM net.http_post(
          url,
          payload,
          headers,
          timeout_ms
        );
    ELSE
      RAISE EXCEPTION 'method argument % is invalid', method;
  END CASE;

  INSERT INTO supabase_functions.hooks
    (hook_table_id, hook_name, request_id)
  VALUES
    (TG_RELID, TG_NAME, request_id);

  RETURN NEW;
END;
$$;

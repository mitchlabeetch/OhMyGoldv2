-- ============================================================
-- Migration: 0011_audit_log
-- Description: Security and compliance audit trail (Phase 3.10)
-- ============================================================

CREATE TABLE public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action        public.audit_action NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  ip_address    INET,
  user_agent    TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at: audit logs are immutable
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs (resource_type, resource_id);

-- ---- Function: Insert audit log (callable from application layer) ----
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id       UUID,
  p_action        public.audit_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id   TEXT DEFAULT NULL,
  p_ip_address    TEXT DEFAULT NULL,
  p_user_agent    TEXT DEFAULT NULL,
  p_metadata      JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, metadata)
  VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_ip_address::INET,
    p_user_agent,
    p_metadata
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---- Function: Auto-log profile updates ----
CREATE OR REPLACE FUNCTION public.audit_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.log_audit_event(
    NEW.id,
    'profile_update',
    'user_profiles',
    NEW.id::TEXT,
    NULL,
    NULL,
    jsonb_build_object(
      'changed_fields', (
        SELECT jsonb_object_agg(key, jsonb_build_object('old', old_val, 'new', new_val))
        FROM (
          SELECT key, old_data.value AS old_val, new_data.value AS new_val
          FROM jsonb_each(to_jsonb(OLD)) old_data
          JOIN jsonb_each(to_jsonb(NEW)) new_data USING (key)
          WHERE old_data.value IS DISTINCT FROM new_data.value
            AND key NOT IN ('updated_at', 'metadata')
        ) changes
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_profile_update
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_profile_update();

-- ---- RLS ----
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit events
CREATE POLICY "audit_logs_select_own"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Super admins and admins can view all audit logs
CREATE POLICY "audit_logs_select_admin"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- No direct inserts from client — use log_audit_event() function only
-- The function runs as SECURITY DEFINER (bypasses RLS)

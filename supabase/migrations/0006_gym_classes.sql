-- ============================================================
-- Migration: 0006_gym_classes
-- Description: Gym class schedule and class management
-- ============================================================

CREATE TABLE public.gym_classes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id           UUID NOT NULL REFERENCES public.gym_locations(id),
  coach_id         UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  max_capacity     INTEGER NOT NULL DEFAULT 20 CHECK (max_capacity > 0),
  current_bookings INTEGER NOT NULL DEFAULT 0 CHECK (current_bookings >= 0),
  scheduled_at     TIMESTAMPTZ NOT NULL,
  status           public.class_status NOT NULL DEFAULT 'scheduled',
  room             TEXT,
  is_recurring     BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule  TEXT,  -- RRULE string per RFC 5545
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gym_classes_gym_id ON public.gym_classes (gym_id);
CREATE INDEX idx_gym_classes_coach_id ON public.gym_classes (coach_id);
CREATE INDEX idx_gym_classes_scheduled_at ON public.gym_classes (scheduled_at);
CREATE INDEX idx_gym_classes_status ON public.gym_classes (status);
CREATE INDEX idx_gym_classes_category ON public.gym_classes (category);

CREATE TRIGGER trg_gym_classes_updated_at
  BEFORE UPDATE ON public.gym_classes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enforce: current_bookings cannot exceed max_capacity
ALTER TABLE public.gym_classes
  ADD CONSTRAINT chk_bookings_not_exceed_capacity
  CHECK (current_bookings <= max_capacity);

-- ---- RLS ----
ALTER TABLE public.gym_classes ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view scheduled/completed classes
CREATE POLICY "gym_classes_select"
  ON public.gym_classes FOR SELECT
  TO authenticated
  USING (status IN ('scheduled', 'in_progress', 'completed'));

-- Coaches, admins can manage classes
CREATE POLICY "gym_classes_insert"
  ON public.gym_classes FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coach'))
  );

CREATE POLICY "gym_classes_update"
  ON public.gym_classes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coach'))
  );

CREATE POLICY "gym_classes_delete"
  ON public.gym_classes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

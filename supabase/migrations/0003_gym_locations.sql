-- ============================================================
-- Migration: 0003_gym_locations
-- Description: Gym locations / branches table
-- ============================================================

CREATE TABLE public.gym_locations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,
  postal_code   TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'FR',
  phone         TEXT,
  email         TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gym_locations_is_active ON public.gym_locations (is_active);
CREATE INDEX idx_gym_locations_city ON public.gym_locations (city);

CREATE TRIGGER trg_gym_locations_updated_at
  BEFORE UPDATE ON public.gym_locations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---- RLS ----
ALTER TABLE public.gym_locations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active gym locations
CREATE POLICY "gym_locations_select"
  ON public.gym_locations FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Super admins can manage all gyms
CREATE POLICY "gym_locations_insert_super_admin"
  ON public.gym_locations FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "gym_locations_update_super_admin"
  ON public.gym_locations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ---- Seed Data: Gold's Gym France locations ----
INSERT INTO public.gym_locations (name, address, city, postal_code, country)
VALUES
  ('Gold''s Gym Paris Opéra', '12 Boulevard des Capucines', 'Paris', '75009', 'FR'),
  ('Gold''s Gym Lyon Confluence', '41 Rue de la Charité', 'Lyon', '69002', 'FR'),
  ('Gold''s Gym Marseille Vieux-Port', '15 Quai de Rive Neuve', 'Marseille', '13007', 'FR');

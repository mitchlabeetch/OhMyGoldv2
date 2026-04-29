-- ============================================================
-- Migration: 0016_facility_zones
-- Description: Facility zones, equipment, capacity rules, operating hours
-- ============================================================

CREATE TABLE IF NOT EXISTS facility_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES gym_locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cardio','weights','pool','studio','sauna','reception','locker','other')),
  capacity INTEGER NOT NULL DEFAULT 20,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES facility_zones(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES gym_locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational','maintenance','out_of_order','retired')),
  purchase_date DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS capacity_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES gym_locations(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES facility_zones(id) ON DELETE CASCADE,
  max_capacity INTEGER NOT NULL,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  alert_threshold_pct INTEGER NOT NULL DEFAULT 90,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operating_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES gym_locations(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(location_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS holiday_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES gym_locations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT true,
  open_time TIME,
  close_time TIME,
  UNIQUE(location_id, date)
);

-- RLS
ALTER TABLE facility_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_schedules ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can read; admin/manager can write
CREATE POLICY "facility_zones_read" ON facility_zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "facility_zones_write" ON facility_zones FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "equipment_read" ON equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "equipment_write" ON equipment FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "capacity_read" ON capacity_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "capacity_write" ON capacity_rules FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "operating_hours_read" ON operating_hours FOR SELECT USING (true);
CREATE POLICY "operating_hours_write" ON operating_hours FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "holiday_schedules_read" ON holiday_schedules FOR SELECT USING (true);
CREATE POLICY "holiday_schedules_write" ON holiday_schedules FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);

-- updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_facility_zones_updated_at
  BEFORE UPDATE ON facility_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_capacity_rules_updated_at
  BEFORE UPDATE ON capacity_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

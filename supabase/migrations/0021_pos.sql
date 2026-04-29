-- ============================================================
-- Migration: 0021_pos
-- Description: Point of Sale — products and transactions
-- ============================================================

CREATE TABLE IF NOT EXISTS pos_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES gym_locations(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'supplement' CHECK (category IN ('supplement','equipment','apparel','drink','food','service','other')),
  price NUMERIC(10,2) NOT NULL,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 20.0,
  sku TEXT,
  barcode TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES gym_locations(id),
  member_id UUID REFERENCES members(id),
  cashier_id UUID NOT NULL REFERENCES auth.users(id),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','card','mobile','account_credit')),
  payment_reference TEXT,
  notes TEXT,
  voided_at TIMESTAMPTZ,
  voided_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pos_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pos_products_read" ON pos_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "pos_products_write" ON pos_products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
);
CREATE POLICY "pos_transactions_access" ON pos_transactions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin','manager','employee'))
);

CREATE TRIGGER trg_pos_products_updated_at
  BEFORE UPDATE ON pos_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

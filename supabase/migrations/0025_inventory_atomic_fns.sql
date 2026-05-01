-- ============================================================
-- 0025_inventory_atomic_fns.sql
-- Atomic inventory stock adjustment function
-- ============================================================

-- adjust_stock_quantity: atomically adjusts pos_products.stock_quantity
-- and returns the resulting stock level.
-- Uses FOR UPDATE row-lock to prevent lost-update race conditions
-- when concurrent inventory transactions are processed.
--
-- Returns:
--   new_quantity  — updated stock level
-- Raises EXCEPTION if the adjustment would result in negative stock.
CREATE OR REPLACE FUNCTION public.adjust_stock_quantity(
  p_product_id  uuid,
  p_delta       integer   -- positive = add stock, negative = remove stock
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current integer;
  v_new     integer;
BEGIN
  SELECT stock_quantity
    INTO v_current
    FROM public.pos_products
   WHERE id = p_product_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', p_product_id;
  END IF;

  v_new := v_current + p_delta;

  IF v_new < 0 THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current, -p_delta;
  END IF;

  UPDATE public.pos_products
     SET stock_quantity = v_new,
         updated_at     = now()
   WHERE id = p_product_id;

  RETURN v_new;
END;
$$;

GRANT EXECUTE ON FUNCTION public.adjust_stock_quantity(uuid, integer) TO authenticated;

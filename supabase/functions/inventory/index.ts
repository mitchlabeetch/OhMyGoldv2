import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import {
  buildClient,
  requireAuth,
  requireRole,
  errorResponse,
  json,
} from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);

    // Segment scanning so the function works under both
    // /inventory/... and /functions/v1/inventory/... paths.
    const parts = url.pathname.split("/").filter(Boolean);
    const invIdx = parts.indexOf("inventory");
    const resource = invIdx !== -1 && parts[invIdx + 1] ? parts[invIdx + 1] : null;
    const resourceId = resource && parts[invIdx + 2] ? parts[invIdx + 2] : null;

    // GET /inventory — list products with stock info (admin/manager only)
    if (req.method === "GET" && !resource) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const locationId = url.searchParams.get("location_id");
      const lowStockOnly = url.searchParams.get("low_stock_only") === "true";

      // Use actual pos_products columns: price (NUMERIC), not unit_price_cents
      let query = supabase
        .from("pos_products")
        .select("id, name, sku, barcode, stock_quantity, low_stock_threshold, price, tax_rate, is_active, category, location_id")
        .eq("is_active", true)
        .order("name");

      if (locationId) query = query.eq("location_id", locationId);

      const { data, error } = await query;
      if (error) throw error;

      const result = lowStockOnly
        ? data?.filter((p) => p.low_stock_threshold != null && p.stock_quantity <= p.low_stock_threshold)
        : data;

      return json(result);
    }

    // GET /inventory/low-stock — convenience low-stock alert endpoint
    if (req.method === "GET" && resource === "low-stock") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const locationId = url.searchParams.get("location_id");
      let query = supabase
        .from("pos_products")
        .select("id, name, sku, stock_quantity, low_stock_threshold, location_id")
        .eq("is_active", true)
        .not("low_stock_threshold", "is", null);

      if (locationId) query = query.eq("location_id", locationId);
      const { data, error } = await query;
      if (error) throw error;

      const alerts = (data ?? [])
        .filter((p) => p.stock_quantity <= p.low_stock_threshold)
        .map((p) => ({ ...p, shortage: p.low_stock_threshold - p.stock_quantity }));

      return json(alerts);
    }

    // POST /inventory/transaction — record a stock movement (admin/manager only;
    // RLS on pos_products restricts writes to admin/manager anyway)
    if (req.method === "POST" && resource === "transaction") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const {
        product_id,
        location_id,
        transaction_type,
        quantity_change,
        unit_cost_cents,
        notes,
        reference_id,
        reference_type,
      } = await req.json();

      if (!product_id || !location_id || !transaction_type || quantity_change === undefined) {
        return errorResponse("product_id, location_id, transaction_type, quantity_change are required", 400);
      }

      // Read current stock before adjustment (for the ledger record)
      const { data: product, error: productErr } = await supabase
        .from("pos_products")
        .select("stock_quantity")
        .eq("id", product_id)
        .single();
      if (productErr || !product) return errorResponse("Product not found", 404);

      const quantityBefore = product.stock_quantity ?? 0;

      // Atomically adjust stock via an RPC that uses FOR UPDATE row-lock
      const { data: newQty, error: adjustErr } = await supabase.rpc("adjust_stock_quantity", {
        p_product_id: product_id,
        p_delta: quantity_change,
      });
      if (adjustErr) {
        if (adjustErr.message?.includes("Insufficient")) {
          return errorResponse(adjustErr.message, 400);
        }
        throw adjustErr;
      }

      const quantityAfter = newQty as number;

      // Append-only inventory ledger record
      const { data: txn, error: txnErr } = await supabase
        .from("inventory_transactions")
        .insert({
          product_id,
          location_id,
          transaction_type,
          quantity_change,
          quantity_before: quantityBefore,
          quantity_after: quantityAfter,
          unit_cost_cents: unit_cost_cents ?? null,
          notes: notes ?? null,
          reference_id: reference_id ?? null,
          reference_type: reference_type ?? null,
          performed_by: user.id,
        })
        .select()
        .single();
      if (txnErr) throw txnErr;

      return json({ transaction: txn, new_stock_quantity: quantityAfter }, 201);
    }

    // GET /inventory/transactions — list inventory transactions
    if (req.method === "GET" && resource === "transactions") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const productId = url.searchParams.get("product_id");
      const locationId = url.searchParams.get("location_id");
      const type = url.searchParams.get("transaction_type");
      const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);

      let query = supabase
        .from("inventory_transactions")
        .select("*, pos_products(name, sku)")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (productId) query = query.eq("product_id", productId);
      if (locationId) query = query.eq("location_id", locationId);
      if (type) query = query.eq("transaction_type", type);

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // ---- Suppliers ----

    // GET /inventory/suppliers
    if (req.method === "GET" && resource === "suppliers" && !resourceId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return json(data);
    }

    // POST /inventory/suppliers
    if (req.method === "POST" && resource === "suppliers") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...body, is_active: true })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PATCH /inventory/suppliers/:id
    if (req.method === "PATCH" && resource === "suppliers" && resourceId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("suppliers")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", resourceId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // ---- Purchase orders ----

    // GET /inventory/purchase-orders
    if (req.method === "GET" && resource === "purchase-orders" && !resourceId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const locationId = url.searchParams.get("location_id");
      let query = supabase
        .from("purchase_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (locationId) query = query.eq("location_id", locationId);
      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // POST /inventory/purchase-orders
    if (req.method === "POST" && resource === "purchase-orders") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("purchase_orders")
        .insert({ ...body, status: "draft", created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PATCH /inventory/purchase-orders/:id
    if (req.method === "PATCH" && resource === "purchase-orders" && resourceId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("purchase_orders")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", resourceId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    return errorResponse("Not found", 404);
  } catch (err) {
    console.error("[inventory]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : message.includes("Forbidden") ? 403 : 500;
    return errorResponse(message, status);
  }
});

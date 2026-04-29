import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const path = url.pathname;

    // Route: /pos/products or /pos/transactions
    const isProducts = path.includes("/products");
    const isTransactions = path.includes("/transactions");

    if (isProducts) {
      const productId = parseId(path, "products");

      // GET /pos/products
      if (req.method === "GET" && !productId) {
        const locationId = url.searchParams.get("location_id");
        const category = url.searchParams.get("category");
        const lowStock = url.searchParams.get("low_stock") === "true";

        let query = supabase
          .from("pos_products")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (locationId) query = query.or(`location_id.eq.${locationId},location_id.is.null`);
        if (category) query = query.eq("category", category);

        const { data, error } = await query;
        if (error) throw error;

        // Filter low stock client-side (stock_quantity <= low_stock_threshold)
        const result = lowStock
          ? (data ?? []).filter((p) => p.stock_quantity <= p.low_stock_threshold)
          : data;

        return json(result);
      }

      // GET /pos/products/:id
      if (req.method === "GET" && productId) {
        const { data, error } = await supabase
          .from("pos_products")
          .select("*")
          .eq("id", productId)
          .single();
        if (error) throw error;
        return json(data);
      }

      // POST /pos/products
      if (req.method === "POST") {
        requireRole(user.role, ["admin", "manager"]);
        const body = await req.json();
        const { data, error } = await supabase
          .from("pos_products")
          .insert(body)
          .select()
          .single();
        if (error) throw error;
        return json(data, 201);
      }

      // PUT /pos/products/:id
      if (req.method === "PUT" && productId) {
        requireRole(user.role, ["admin", "manager"]);
        const body = await req.json();
        const { data, error } = await supabase
          .from("pos_products")
          .update(body)
          .eq("id", productId)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }

      // DELETE /pos/products/:id
      if (req.method === "DELETE" && productId) {
        requireRole(user.role, ["admin", "manager"]);
        const { error } = await supabase
          .from("pos_products")
          .update({ is_active: false })
          .eq("id", productId);
        if (error) throw error;
        return json({ success: true });
      }
    }

    if (isTransactions) {
      const txId = parseId(path, "transactions");

      // GET /pos/transactions
      if (req.method === "GET" && !txId) {
        requireRole(user.role, ["admin", "manager", "employee"]);
        const locationId = url.searchParams.get("location_id");
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        let query = supabase
          .from("pos_transactions")
          .select("*, members(user_profiles!profile_id(first_name, last_name))")
          .order("created_at", { ascending: false });

        if (locationId) query = query.eq("location_id", locationId);
        if (from) query = query.gte("created_at", from);
        if (to) query = query.lte("created_at", to);

        const { data, error } = await query;
        if (error) throw error;
        return json(data);
      }

      // GET /pos/transactions/:id
      if (req.method === "GET" && txId) {
        const { data, error } = await supabase
          .from("pos_transactions")
          .select("*, members(*)")
          .eq("id", txId)
          .single();
        if (error) throw error;
        return json(data);
      }

      // POST /pos/transactions — new sale
      if (req.method === "POST") {
        requireRole(user.role, ["admin", "manager", "employee"]);
        const body = await req.json();
        body.cashier_id = user.id;

        const { data, error } = await supabase
          .from("pos_transactions")
          .insert(body)
          .select()
          .single();
        if (error) throw error;

        // Decrement stock atomically for each item via database function
        const items: Array<{ product_id: string; quantity: number }> = body.items ?? [];
        for (const item of items) {
          await supabase.rpc("decrement_stock_qty", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }

        return json(data, 201);
      }

      // POST /pos/transactions/:id?action=void
      if (req.method === "POST" && txId) {
        requireRole(user.role, ["admin", "manager"]);
        const { error } = await supabase
          .from("pos_transactions")
          .update({ voided_at: new Date().toISOString(), voided_by: user.id })
          .eq("id", txId);
        if (error) throw error;
        return json({ success: true });
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

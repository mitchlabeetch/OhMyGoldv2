import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const paymentId = parseId(url.pathname, "payments");
    const action = url.searchParams.get("action");

    // GET /payments — payment history
    if (req.method === "GET" && !paymentId) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const memberId = url.searchParams.get("member_id");
      const locationId = url.searchParams.get("location_id");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const limit = parseInt(url.searchParams.get("limit") ?? "50");
      const offset = parseInt(url.searchParams.get("offset") ?? "0");

      let query = supabase
        .from("payments")
        .select("*, members(user_profiles!profile_id(first_name, last_name, email))", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (memberId) query = query.eq("member_id", memberId);
      if (locationId) query = query.eq("gym_id", locationId);
      if (from) query = query.gte("created_at", from);
      if (to) query = query.lte("created_at", to);

      const { data, error, count } = await query;
      if (error) throw error;
      return json({ data, count });
    }

    // GET /payments/:id
    if (req.method === "GET" && paymentId) {
      const { data, error } = await supabase
        .from("payments")
        .select("*, members(*)")
        .eq("id", paymentId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /payments — record payment
    if (req.method === "POST" && !action) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("payments")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // POST /payments/:id?action=refund — process refund
    if (req.method === "POST" && paymentId && action === "refund") {
      requireRole(user.role, ["admin", "manager"]);
      const { amount_cents, reason } = await req.json();

      // Get original payment
      const { data: original, error: fetchErr } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();
      if (fetchErr) throw fetchErr;

      const refundAmount = amount_cents ?? original.amount_cents;

      // Create refund record as negative payment
      const { data, error } = await supabase
        .from("payments")
        .insert({
          member_id: original.member_id,
          gym_id: original.gym_id,
          amount_cents: -refundAmount,
          currency: original.currency,
          payment_method: original.payment_method,
          status: "refunded",
          notes: `Refund for payment ${paymentId}: ${reason ?? ""}`,
          reference_payment_id: paymentId,
        })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

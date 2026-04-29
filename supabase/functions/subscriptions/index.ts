import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const subId = parseId(url.pathname, "subscriptions");
    const action = url.searchParams.get("action");

    // GET /subscriptions — list subscriptions
    if (req.method === "GET" && !subId) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const memberId = url.searchParams.get("member_id");
      const status = url.searchParams.get("status");

      let query = supabase
        .from("subscriptions")
        .select("*, membership_plans(*), members(*, user_profiles!profile_id(email, first_name, last_name))")
        .order("created_at", { ascending: false });

      if (memberId) query = query.eq("member_id", memberId);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // GET /subscriptions/:id
    if (req.method === "GET" && subId && !action) {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, membership_plans(*), members(*), subscription_events(*)")
        .eq("id", subId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /subscriptions — create subscription
    if (req.method === "POST" && !action) {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(body)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("subscription_events").insert({
        subscription_id: data.id,
        event_type: "created",
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json(data, 201);
    }

    // POST /subscriptions/:id?action=freeze
    if (req.method === "POST" && subId && action === "freeze") {
      requireRole(user.role, ["admin", "manager"]);
      const { freeze_until, reason } = await req.json();
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ status: "frozen", freeze_until, freeze_reason: reason })
        .eq("id", subId)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("subscription_events").insert({
        subscription_id: subId,
        event_type: "frozen",
        reason,
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json(data);
    }

    // POST /subscriptions/:id?action=unfreeze
    if (req.method === "POST" && subId && action === "unfreeze") {
      requireRole(user.role, ["admin", "manager"]);
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ status: "active", freeze_until: null, freeze_reason: null })
        .eq("id", subId)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("subscription_events").insert({
        subscription_id: subId,
        event_type: "unfrozen",
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json(data);
    }

    // POST /subscriptions/:id?action=upgrade
    if (req.method === "POST" && subId && action === "upgrade") {
      requireRole(user.role, ["admin", "manager"]);
      const { new_plan_id, reason, prorated_amount } = await req.json();

      const { data: current } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("id", subId)
        .single();

      const { data, error } = await supabase
        .from("subscriptions")
        .update({ plan_id: new_plan_id })
        .eq("id", subId)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("subscription_events").insert({
        subscription_id: subId,
        event_type: "upgraded",
        old_plan_id: current?.plan_id,
        new_plan_id,
        reason,
        prorated_amount,
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json(data);
    }

    // POST /subscriptions/:id?action=cancel
    if (req.method === "POST" && subId && action === "cancel") {
      requireRole(user.role, ["admin", "manager"]);
      const { reason, immediate } = await req.json();
      const update: Record<string, unknown> = {
        cancellation_requested_at: new Date().toISOString(),
        cancellation_reason: reason,
      };
      if (immediate) update.status = "cancelled";

      const { data, error } = await supabase
        .from("subscriptions")
        .update(update)
        .eq("id", subId)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("subscription_events").insert({
        subscription_id: subId,
        event_type: "cancelled",
        reason,
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json(data);
    }

    // PUT /subscriptions/:id — generic update
    if (req.method === "PUT" && subId) {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("subscriptions")
        .update(body)
        .eq("id", subId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

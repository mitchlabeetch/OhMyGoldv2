import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import {
  buildClient,
  requireAuth,
  requireRole,
  errorResponse,
  json,
  parseId,
} from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

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
        .select(
          "*, membership_plans(*), members(*, user_profiles!profile_id(email, first_name, last_name))",
        )
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
      const { new_plan_id, reason } = await req.json();

      // Fetch current subscription + both plan prices for server-side proration
      const { data: current, error: subErr } = await supabase
        .from("subscriptions")
        .select("plan_id, current_period_start, current_period_end")
        .eq("id", subId)
        .single();
      if (subErr || !current)
        throw subErr ?? new Error("Subscription not found");

      // Fetch old and new plan monthly prices (price_cents per billing cycle)
      const [
        { data: oldPlan, error: oldPlanErr },
        { data: newPlan, error: newPlanErr },
      ] = await Promise.all([
        supabase
          .from("membership_plans")
          .select("price_cents, contract_type, duration_days")
          .eq("id", current.plan_id)
          .single(),
        supabase
          .from("membership_plans")
          .select("price_cents, contract_type, duration_days")
          .eq("id", new_plan_id)
          .single(),
      ]);
      if (oldPlanErr || !oldPlan)
        throw oldPlanErr ?? new Error("Old plan not found");
      if (newPlanErr || !newPlan)
        throw newPlanErr ?? new Error("New plan not found");

      // Server-side proration: (new_price - old_price) * (days_remaining / days_in_cycle)
      // Use current_period_start / current_period_end from the subscription as the billing cycle window.
      let prorated_amount = 0;
      if (oldPlan && newPlan) {
        const now = Date.now();
        const periodStart = current.current_period_start
          ? new Date(current.current_period_start).getTime()
          : now;
        const periodEnd = current.current_period_end
          ? new Date(current.current_period_end).getTime()
          : periodStart + (oldPlan.duration_days ?? 30) * 86_400_000;
        const daysInCycle = Math.max(
          1,
          Math.round((periodEnd - periodStart) / 86_400_000),
        );
        const daysRemaining = Math.max(
          0,
          Math.round((periodEnd - now) / 86_400_000),
        );
        const oldCents = oldPlan.price_cents;
        const newCents = newPlan.price_cents;
        // prorated_amount is stored as NUMERIC(10,2) euros → divide cents by 100
        prorated_amount =
          Math.round((newCents - oldCents) * (daysRemaining / daysInCycle)) /
          100;
      }

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
        old_plan_id: current.plan_id,
        new_plan_id,
        reason,
        prorated_amount,
        performed_by: user.id,
        effective_date: new Date().toISOString().split("T")[0],
      });

      return json({ ...data, prorated_amount });
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

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[subscriptions]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status =
      message === "Unauthorized"
        ? 401
        : message.includes("Forbidden")
          ? 403
          : 500;
    return errorResponse(err, status);
  }
});

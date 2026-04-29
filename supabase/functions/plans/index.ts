import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const planId = parseId(url.pathname, "plans");
    const action = url.searchParams.get("action");

    // GET /plans — list all plans
    if (req.method === "GET" && !planId) {
      const publicOnly = url.searchParams.get("public") === "true";
      let query = supabase
        .from("membership_plans")
        .select("*, plan_feature_inclusions(*, plan_features(*))")
        .order("sort_order");

      if (publicOnly) query = query.eq("is_public", true).eq("is_active", true);

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // GET /plans/:id — get single plan
    if (req.method === "GET" && planId && !action) {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*, plan_feature_inclusions(*, plan_features(*)), plan_history(*)")
        .eq("id", planId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /plans?action=clone&source=:id — clone a plan
    if (req.method === "POST" && action === "clone") {
      requireRole(user.role, ["admin", "manager"]);
      const sourceId = url.searchParams.get("source");
      if (!sourceId) return json({ error: "source plan id required" }, 400);

      const { data: source, error: srcErr } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", sourceId)
        .single();
      if (srcErr) throw srcErr;

      const { id: _id, created_at: _c, updated_at: _u, ...cloneData } = source;
      cloneData.name = `${cloneData.name} (Copy)`;
      cloneData.is_active = false;

      const { data, error } = await supabase
        .from("membership_plans")
        .insert(cloneData)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // POST /plans — create plan
    if (req.method === "POST") {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("membership_plans")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PUT /plans/:id — update plan
    if (req.method === "PUT" && planId) {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();

      // Capture old data for history
      const { data: old } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", planId)
        .single();

      const { data, error } = await supabase
        .from("membership_plans")
        .update(body)
        .eq("id", planId)
        .select()
        .single();
      if (error) throw error;

      // Record history
      if (old) {
        await supabase.from("plan_history").insert({
          plan_id: planId,
          changed_by: user.id,
          old_data: old,
          new_data: data,
          reason: body.change_reason ?? null,
        });
      }

      return json(data);
    }

    // DELETE /plans/:id — deactivate plan
    if (req.method === "DELETE" && planId) {
      requireRole(user.role, ["admin"]);
      const { error } = await supabase
        .from("membership_plans")
        .update({ is_active: false })
        .eq("id", planId);
      if (error) throw error;
      return json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

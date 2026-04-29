import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    requireRole(user.role, ["admin", "manager", "employee"]);

    const url = new URL(req.url);
    const path = url.pathname;
    const isActivities = path.includes("/activities");

    if (!isActivities) {
      const leadId = parseId(path, "crm");

      // GET /crm — list leads
      if (req.method === "GET" && !leadId) {
        const status = url.searchParams.get("status");
        const assignedTo = url.searchParams.get("assigned_to");
        const locationId = url.searchParams.get("location_id");

        let query = supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (assignedTo) query = query.eq("assigned_to", assignedTo);
        if (locationId) query = query.eq("location_id", locationId);

        const { data, error } = await query;
        if (error) throw error;
        return json(data);
      }

      // GET /crm/:id — get lead with activities
      if (req.method === "GET" && leadId) {
        const { data, error } = await supabase
          .from("leads")
          .select("*, lead_activities(*)")
          .eq("id", leadId)
          .single();
        if (error) throw error;
        return json(data);
      }

      // POST /crm — create lead
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error } = await supabase
          .from("leads")
          .insert(body)
          .select()
          .single();
        if (error) throw error;
        return json(data, 201);
      }

      // PUT /crm/:id — update lead
      if (req.method === "PUT" && leadId) {
        const body = await req.json();
        const { data, error } = await supabase
          .from("leads")
          .update(body)
          .eq("id", leadId)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }

      // DELETE /crm/:id — delete lead
      if (req.method === "DELETE" && leadId) {
        requireRole(user.role, ["admin", "manager"]);
        const { error } = await supabase.from("leads").delete().eq("id", leadId);
        if (error) throw error;
        return json({ success: true });
      }
    }

    if (isActivities) {
      const activityId = parseId(path, "activities");

      // GET /crm/:lead_id/activities or /crm/activities
      if (req.method === "GET" && !activityId) {
        const leadId = url.searchParams.get("lead_id");
        let query = supabase
          .from("lead_activities")
          .select("*")
          .order("created_at", { ascending: false });
        if (leadId) query = query.eq("lead_id", leadId);
        const { data, error } = await query;
        if (error) throw error;
        return json(data);
      }

      // POST /crm/activities — log activity
      if (req.method === "POST") {
        const body = await req.json();
        body.performed_by = user.id;
        const { data, error } = await supabase
          .from("lead_activities")
          .insert(body)
          .select()
          .single();
        if (error) throw error;
        return json(data, 201);
      }

      // PUT /crm/activities/:id — update activity
      if (req.method === "PUT" && activityId) {
        const body = await req.json();
        const { data, error } = await supabase
          .from("lead_activities")
          .update(body)
          .eq("id", activityId)
          .select()
          .single();
        if (error) throw error;
        return json(data);
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

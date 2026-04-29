import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const classId = parseId(url.pathname, "classes");

    // GET /classes — list classes / schedule
    if (req.method === "GET" && !classId) {
      const locationId = url.searchParams.get("location_id");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const instructorId = url.searchParams.get("instructor_id");

      let query = supabase
        .from("gym_classes")
        .select("*, bookings(count)")
        .order("scheduled_at");

      if (locationId) query = query.eq("gym_id", locationId);
      if (from) query = query.gte("scheduled_at", from);
      if (to) query = query.lte("scheduled_at", to);
      if (instructorId) query = query.eq("instructor_id", instructorId);

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // GET /classes/:id
    if (req.method === "GET" && classId) {
      const { data, error } = await supabase
        .from("gym_classes")
        .select("*, bookings(*, members(user_profiles!profile_id(first_name, last_name, email)))")
        .eq("id", classId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /classes — create class
    if (req.method === "POST") {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("gym_classes")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PUT /classes/:id — update class
    if (req.method === "PUT" && classId) {
      requireRole(user.role, ["admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("gym_classes")
        .update(body)
        .eq("id", classId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // DELETE /classes/:id — cancel/delete class
    if (req.method === "DELETE" && classId) {
      requireRole(user.role, ["admin", "manager"]);
      const { error } = await supabase
        .from("gym_classes")
        .update({ status: "cancelled" })
        .eq("id", classId);
      if (error) throw error;
      return json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

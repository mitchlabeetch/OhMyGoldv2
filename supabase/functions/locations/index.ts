import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    await requireAuth(supabase);

    const url = new URL(req.url);
    const locationId = parseId(url.pathname, "locations");

    if (req.method === "GET" && !locationId) {
      const { data, error } = await supabase
        .from("gym_locations")
        .select("*, facility_zones(*), operating_hours(*)")
        .order("name");
      if (error) throw error;
      return json(data);
    }

    if (req.method === "GET" && locationId) {
      const { data, error } = await supabase
        .from("gym_locations")
        .select("*, facility_zones(*, equipment(*)), operating_hours(*), holiday_schedules(*), capacity_rules(*)")
        .eq("id", locationId)
        .single();
      if (error) throw error;
      return json(data);
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("gym_locations")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    if (req.method === "PUT" && locationId) {
      const body = await req.json();
      const { data, error } = await supabase
        .from("gym_locations")
        .update(body)
        .eq("id", locationId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    if (req.method === "DELETE" && locationId) {
      const { error } = await supabase
        .from("gym_locations")
        .update({ is_active: false })
        .eq("id", locationId);
      if (error) throw error;
      return json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

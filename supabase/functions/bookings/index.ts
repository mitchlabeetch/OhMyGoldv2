import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const bookingId = parseId(url.pathname, "bookings");
    const action = url.searchParams.get("action");

    // GET /bookings — list bookings
    if (req.method === "GET" && !bookingId) {
      const memberId = url.searchParams.get("member_id");
      const classId = url.searchParams.get("class_id");
      const status = url.searchParams.get("status");

      let query = supabase
        .from("bookings")
        .select("*, gym_classes(*), members(user_profiles!profile_id(first_name, last_name))")
        .order("created_at", { ascending: false });

      if (memberId) query = query.eq("member_id", memberId);
      if (classId) query = query.eq("class_id", classId);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // GET /bookings/:id
    if (req.method === "GET" && bookingId) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, gym_classes(*), members(*)")
        .eq("id", bookingId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /bookings — create booking
    if (req.method === "POST" && !action) {
      const body = await req.json();

      // Check class capacity
      const { data: cls } = await supabase
        .from("gym_classes")
        .select("max_capacity, current_bookings")
        .eq("id", body.class_id)
        .single();

      if (cls && cls.current_bookings >= cls.max_capacity) {
        // Add to waitlist
        const { data, error } = await supabase
          .from("bookings")
          .insert({ ...body, status: "waitlisted" })
          .select()
          .single();
        if (error) throw error;
        return json({ ...data, waitlisted: true }, 201);
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...body, status: "confirmed" })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // POST /bookings/:id?action=cancel
    if (req.method === "POST" && bookingId && action === "cancel") {
      const { reason } = await req.json().catch(() => ({ reason: null }));
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled", cancellation_reason: reason })
        .eq("id", bookingId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // DELETE /bookings/:id — hard cancel (staff)
    if (req.method === "DELETE" && bookingId) {
      requireRole(user.role, ["admin", "manager"]);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);
      if (error) throw error;
      return json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

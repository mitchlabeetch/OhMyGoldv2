import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const memberId = parseId(url.pathname, "members");
    const action = url.searchParams.get("action");

    // GET /members — list members (staff only)
    if (req.method === "GET" && !memberId && !action) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const locationId = url.searchParams.get("location_id");
      const search = url.searchParams.get("q");
      const status = url.searchParams.get("status");
      const limit = parseInt(url.searchParams.get("limit") ?? "50");
      const offset = parseInt(url.searchParams.get("offset") ?? "0");

      let query = supabase
        .from("members")
        .select("*, user_profiles!profile_id(email, first_name, last_name)", { count: "exact" })
        .is("deleted_at", null)
        .range(offset, offset + limit - 1);

      if (locationId) query = query.eq("gym_id", locationId);
      if (status) query = query.eq("membership_status", status);
      if (search) {
        query = query.or(
          `membership_number.ilike.%${search}%`,
        );
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return json({ data, count });
    }

    // GET /members/:id — get single member
    if (req.method === "GET" && memberId && !action) {
      const { data, error } = await supabase
        .from("members")
        .select("*, user_profiles!profile_id(email, first_name, last_name, phone), subscriptions(*, membership_plans(*)), membership_cards(*), access_logs(created_at, granted, method)")
        .eq("id", memberId)
        .is("deleted_at", null)
        .single();
      if (error) throw error;
      return json(data);
    }

    // GET /members/:id?action=gdpr — export GDPR data
    if (req.method === "GET" && memberId && action === "gdpr") {
      requireRole(user.role, ["admin", "manager"]);
      const [memberRes, logsRes, bookingsRes, paymentsRes] = await Promise.all([
        supabase.from("members").select("*").eq("id", memberId).single(),
        supabase.from("access_logs").select("*").eq("member_id", memberId).order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").eq("member_id", memberId).order("created_at", { ascending: false }),
        supabase.from("payments").select("*").eq("member_id", memberId).order("created_at", { ascending: false }),
      ]);
      return json({
        member: memberRes.data,
        access_logs: logsRes.data,
        bookings: bookingsRes.data,
        payments: paymentsRes.data,
        exported_at: new Date().toISOString(),
      });
    }

    // POST /members — create member
    if (req.method === "POST") {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("members")
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PUT /members/:id — update member
    if (req.method === "PUT" && memberId) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("members")
        .update(body)
        .eq("id", memberId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // DELETE /members/:id — soft delete
    if (req.method === "DELETE" && memberId) {
      requireRole(user.role, ["admin", "manager"]);
      const { error } = await supabase
        .from("members")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", memberId);
      if (error) throw error;
      return json({ success: true });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

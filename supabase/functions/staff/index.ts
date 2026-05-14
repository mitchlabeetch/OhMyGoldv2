import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import {
  buildClient,
  requireAuth,
  requireRole,
  errorResponse,
  json,
} from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    // Use segment scanning so the function works under both
    // /staff/... and /functions/v1/staff/... Supabase invocation paths.
    const parts = url.pathname.split("/").filter(Boolean);
    const staffIdx = parts.indexOf("staff");
    const staffId =
      staffIdx !== -1 && parts[staffIdx + 1] ? parts[staffIdx + 1] : null;
    const subResource =
      staffId && parts[staffIdx + 2] ? parts[staffIdx + 2] : null; // "certifications"
    const subId =
      subResource && parts[staffIdx + 3] ? parts[staffIdx + 3] : null;

    // ---- Staff members ----

    // GET /staff — list staff members (admin/manager)
    if (req.method === "GET" && !staffId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const locationId = url.searchParams.get("location_id");
      const role = url.searchParams.get("role");
      const isActive = url.searchParams.get("is_active");

      let query = supabase
        .from("staff_members")
        .select(
          "*, user_profiles!user_id(id, first_name, last_name, email, avatar_url, role)",
        )
        .order("created_at");

      if (locationId) query = query.eq("location_id", locationId);
      if (role) query = query.eq("role", role);
      if (isActive !== null) query = query.eq("is_active", isActive === "true");

      const { data, error } = await query;
      if (error) throw error;
      return json(data);
    }

    // GET /staff/:id — get one staff member
    if (req.method === "GET" && staffId && !subResource) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const { data, error } = await supabase
        .from("staff_members")
        .select(
          "*, user_profiles!user_id(id, first_name, last_name, email, avatar_url, role), certifications(*)",
        )
        .eq("id", staffId)
        .single();
      if (error) throw error;
      return json(data);
    }

    // POST /staff — create staff member
    if (req.method === "POST" && !staffId) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("staff_members")
        .insert({ ...body, is_active: true })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PATCH /staff/:id — update staff member
    if (req.method === "PATCH" && staffId && !subResource) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("staff_members")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", staffId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // DELETE /staff/:id — soft delete
    if (req.method === "DELETE" && staffId && !subResource) {
      requireRole(user.role, ["admin", "super_admin"]);
      const { data, error } = await supabase
        .from("staff_members")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", staffId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // ---- Certifications sub-resource ----

    // GET /staff/:id/certifications
    if (
      req.method === "GET" &&
      staffId &&
      subResource === "certifications" &&
      !subId
    ) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("staff_member_id", staffId)
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return json(data);
    }

    // POST /staff/:id/certifications
    if (req.method === "POST" && staffId && subResource === "certifications") {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("certifications")
        .insert({ ...body, staff_member_id: staffId })
        .select()
        .single();
      if (error) throw error;
      return json(data, 201);
    }

    // PATCH /staff/:id/certifications/:cert_id
    if (
      req.method === "PATCH" &&
      staffId &&
      subResource === "certifications" &&
      subId
    ) {
      requireRole(user.role, ["admin", "super_admin", "manager"]);
      const body = await req.json();
      const { data, error } = await supabase
        .from("certifications")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", subId)
        .eq("staff_member_id", staffId)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    // DELETE /staff/:id/certifications/:cert_id
    if (
      req.method === "DELETE" &&
      staffId &&
      subResource === "certifications" &&
      subId
    ) {
      requireRole(user.role, ["admin", "super_admin"]);
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", subId)
        .eq("staff_member_id", staffId);
      if (error) throw error;
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return errorResponse("Not found", 404);
  } catch (err) {
    console.error("[staff]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    const status =
      message === "Unauthorized"
        ? 401
        : message.includes("not allowed")
          ? 403
          : 500;
    return errorResponse(err, status);
  }
});

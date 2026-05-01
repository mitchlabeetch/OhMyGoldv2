import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import {
  buildClient,
  requireAuth,
  errorResponse,
  json,
  parseId,
} from "../_shared/auth.ts";

const STAFF_ROLES = ["admin", "super_admin", "manager", "employee", "receptionist", "teacher", "coach"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const bookingId = parseId(url.pathname, "booking-atomic");
    const isStaff = STAFF_ROLES.includes(user.role ?? "");

    // POST /booking-atomic — atomic class booking
    if (req.method === "POST" && !bookingId) {
      const body = await req.json();
      const { class_id } = body;

      if (!class_id) {
        return errorResponse("class_id is required", 400);
      }

      // Non-staff: derive member_id from the authenticated user's member record.
      // Staff: may supply an explicit member_id to book on behalf of a member.
      let member_id = isStaff ? (body.member_id ?? null) : null;

      if (!isStaff || !member_id) {
        const { data: member } = await supabase
          .from("members")
          .select("id")
          .eq("profile_id", user.id)
          .single();
        if (!member) return errorResponse("No active member record found for this user", 404);
        member_id = member.id;
      }

      // Authorization is also enforced inside the SQL function (SECURITY DEFINER)
      const { data, error } = await supabase.rpc("book_class_atomic", {
        p_class_id: class_id,
        p_member_id: member_id,
      });

      if (error) {
        if (error.message?.includes("already")) {
          return errorResponse("Member already has a booking for this class", 409);
        }
        if (error.message?.includes("Unauthorized")) {
          return errorResponse(error.message, 403);
        }
        throw error;
      }

      return json(data);
    }

    // GET /booking-atomic?class_id=X — get caller's booking for a class
    if (req.method === "GET" && !bookingId) {
      const classId = url.searchParams.get("class_id");
      if (!classId) return errorResponse("class_id query param is required", 400);

      const memberId = url.searchParams.get("member_id");

      let query = supabase
        .from("bookings")
        .select("*, gym_classes(id, name, scheduled_at, coach_id, max_capacity, current_bookings)")
        .eq("class_id", classId)
        .in("status", ["booked", "waitlisted", "held"]);

      if (isStaff && memberId) {
        query = query.eq("member_id", memberId);
      } else {
        // Non-staff: restrict to own member record
        const { data: member } = await supabase
          .from("members")
          .select("id")
          .eq("profile_id", user.id)
          .single();
        if (!member) return json(null);
        query = query.eq("member_id", member.id);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return json(data);
    }

    // DELETE /booking-atomic/:bookingId — cancel a booking
    if (req.method === "DELETE" && bookingId) {
      // Fetch the booking to verify ownership
      const { data: booking, error: fetchErr } = await supabase
        .from("bookings")
        .select("id, member_id, status, members!inner(profile_id)")
        .eq("id", bookingId)
        .single();

      if (fetchErr || !booking) return errorResponse("Booking not found", 404);

      // Non-staff may only cancel their own bookings
      if (!isStaff) {
        const memberProfileId = (booking.members as { profile_id: string }).profile_id;
        if (memberProfileId !== user.id) {
          return errorResponse("Cannot cancel another member's booking", 403);
        }
      }

      // Only active statuses may be cancelled
      if (!["booked", "waitlisted", "held"].includes(booking.status)) {
        return errorResponse("Booking cannot be cancelled in its current state", 400);
      }

      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .select()
        .single();
      if (error) throw error;

      // DB trigger (booking_cancel_trigger) auto-promotes next waitlisted member
      return json({ ...data, message: "Booking cancelled. Next waitlisted member will be notified." });
    }

    return errorResponse("Method not allowed", 405);
  } catch (err) {
    console.error("[booking-atomic]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : message.includes("Forbidden") ? 403 : 500;
    return errorResponse(message, status);
  }
});

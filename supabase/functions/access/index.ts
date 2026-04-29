import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json, parseId } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    const url = new URL(req.url);
    const logId = parseId(url.pathname, "access");
    const action = url.searchParams.get("action");

    // POST /access?action=checkin — QR / badge check-in
    if (req.method === "POST" && action === "checkin") {
      const { qr_code, card_number, location_id, method } = await req.json();

      // Resolve member from card or QR
      let memberId: string | null = null;

      if (qr_code || card_number) {
        const { data: card } = await supabase
          .from("membership_cards")
          .select("member_id, is_active, expiry_date")
          .or(
            [
              qr_code ? `qr_code_data.eq.${qr_code}` : null,
              card_number ? `card_number.eq.${card_number}` : null,
            ]
              .filter(Boolean)
              .join(","),
          )
          .maybeSingle();

        if (!card || !card.is_active) {
          return json({ granted: false, reason: "invalid_card" });
        }

        if (card.expiry_date && new Date(card.expiry_date) < new Date()) {
          return json({ granted: false, reason: "card_expired" });
        }

        memberId = card.member_id;
      }

      if (!memberId) {
        return json({ granted: false, reason: "member_not_found" }, 404);
      }

      // Check active subscription
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status, end_date, grace_period_until, freeze_until")
        .eq("member_id", memberId)
        .eq("location_id", location_id)
        .in("status", ["active", "grace_period"])
        .maybeSingle();

      const today = new Date().toISOString().split("T")[0];
      let granted = false;
      let denied_reason: string | null = null;

      if (!subscription) {
        denied_reason = "no_active_subscription";
      } else if (subscription.status === "frozen") {
        denied_reason = "subscription_frozen";
      } else if (subscription.end_date && subscription.end_date < today) {
        denied_reason = "subscription_expired";
      } else {
        granted = true;
      }

      // Log access attempt
      const { data: log, error: logErr } = await supabase
        .from("access_logs")
        .insert({
          member_id: memberId,
          gym_id: location_id,
          granted,
          method: method ?? "qr",
          denied_reason,
        })
        .select()
        .single();

      if (logErr) throw logErr;
      return json({ granted, denied_reason, access_log_id: log.id });
    }

    // GET /access — list access logs (staff)
    if (req.method === "GET" && !logId) {
      requireRole(user.role, ["admin", "manager", "employee"]);
      const memberId = url.searchParams.get("member_id");
      const locationId = url.searchParams.get("location_id");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const limit = parseInt(url.searchParams.get("limit") ?? "100");
      const offset = parseInt(url.searchParams.get("offset") ?? "0");

      let query = supabase
        .from("access_logs")
        .select("*, members(user_profiles!profile_id(first_name, last_name))", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (memberId) query = query.eq("member_id", memberId);
      if (locationId) query = query.eq("gym_id", locationId);
      if (from) query = query.gte("created_at", from);
      if (to) query = query.lte("created_at", to);

      const { data, error, count } = await query;
      if (error) throw error;
      return json({ data, count });
    }

    // GET /access/:id — get single log
    if (req.method === "GET" && logId) {
      const { data, error } = await supabase
        .from("access_logs")
        .select("*, members(*)")
        .eq("id", logId)
        .single();
      if (error) throw error;
      return json(data);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

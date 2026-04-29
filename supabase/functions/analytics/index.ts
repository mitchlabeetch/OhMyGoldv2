import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { buildClient, requireAuth, requireRole, errorResponse, json } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = buildClient(req);
    const user = await requireAuth(supabase);
    requireRole(user.role, ["admin", "manager"]);

    const url = new URL(req.url);
    const report = url.searchParams.get("report") ?? "overview";
    const locationId = url.searchParams.get("location_id");
    const from = url.searchParams.get("from") ?? new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    const to = url.searchParams.get("to") ?? new Date().toISOString().split("T")[0];

    if (report === "overview") {
      // Parallel KPI queries
      const [membersRes, paymentsRes, bookingsRes, leadsRes] = await Promise.all([
        supabase
          .from("members")
          .select("membership_status, created_at", { count: "exact" })
          .is("deleted_at", null)
          .gte("created_at", from)
          .lte("created_at", to + "T23:59:59Z"),
        supabase
          .from("payments")
          .select("amount_cents, status, created_at")
          .gte("created_at", from)
          .lte("created_at", to + "T23:59:59Z"),
        supabase
          .from("bookings")
          .select("status, created_at")
          .gte("created_at", from)
          .lte("created_at", to + "T23:59:59Z"),
        supabase
          .from("leads")
          .select("status, created_at")
          .gte("created_at", from)
          .lte("created_at", to + "T23:59:59Z"),
      ]);

      const payments = paymentsRes.data ?? [];
      const totalRevenueCents = payments
        .filter((p) => p.status === "succeeded" || p.status === "paid")
        .reduce((sum: number, p) => sum + (p.amount_cents ?? 0), 0);

      return json({
        period: { from, to },
        members: {
          total: membersRes.count ?? 0,
          new: (membersRes.data ?? []).length,
          by_status: groupBy(membersRes.data ?? [], "membership_status"),
        },
        revenue: {
          total_cents: totalRevenueCents,
          total_eur: (totalRevenueCents / 100).toFixed(2),
          transaction_count: payments.length,
        },
        bookings: {
          total: (bookingsRes.data ?? []).length,
          by_status: groupBy(bookingsRes.data ?? [], "status"),
        },
        leads: {
          total: (leadsRes.data ?? []).length,
          by_status: groupBy(leadsRes.data ?? [], "status"),
          conversion_rate: calcConversionRate(leadsRes.data ?? []),
        },
      });
    }

    if (report === "revenue") {
      let query = supabase
        .from("payments")
        .select("amount_cents, currency, status, created_at, payment_method")
        .gte("created_at", from)
        .lte("created_at", to + "T23:59:59Z")
        .order("created_at");

      if (locationId) query = query.eq("gym_id", locationId);

      const { data, error } = await query;
      if (error) throw error;
      return json({ period: { from, to }, payments: data });
    }

    if (report === "attendance") {
      let query = supabase
        .from("access_logs")
        .select("granted, method, created_at")
        .gte("created_at", from)
        .lte("created_at", to + "T23:59:59Z")
        .order("created_at");

      if (locationId) query = query.eq("gym_id", locationId);

      const { data, error } = await query;
      if (error) throw error;
      return json({ period: { from, to }, access_logs: data });
    }

    if (report === "membership") {
      const { data, error } = await supabase
        .from("members")
        .select("membership_status, contract_type, created_at, contract_end")
        .is("deleted_at", null);
      if (error) throw error;
      return json({
        period: { from, to },
        breakdown: groupBy(data ?? [], "membership_status"),
        by_contract: groupBy(data ?? [], "contract_type"),
      });
    }

    if (report === "classes") {
      let query = supabase
        .from("gym_classes")
        .select("*, bookings(count)")
        .gte("scheduled_at", from)
        .lte("scheduled_at", to + "T23:59:59Z");

      if (locationId) query = query.eq("gym_id", locationId);

      const { data, error } = await query;
      if (error) throw error;
      return json({ period: { from, to }, classes: data });
    }

    return new Response(JSON.stringify({ error: "Unknown report type" }), { status: 400, headers: corsHeaders });
  } catch (err) {
    return errorResponse(err);
  }
});

function groupBy(arr: Array<Record<string, unknown>>, key: string): Record<string, number> {
  return arr.reduce((acc: Record<string, number>, item) => {
    const val = String(item[key] ?? "unknown");
    acc[val] = (acc[val] ?? 0) + 1;
    return acc;
  }, {});
}

function calcConversionRate(leads: Array<Record<string, unknown>>): string {
  if (!leads.length) return "0%";
  const converted = leads.filter((l) => l.status === "converted").length;
  return ((converted / leads.length) * 100).toFixed(1) + "%";
}

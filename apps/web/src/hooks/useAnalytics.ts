import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type KPIOverview = {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  classBookingsToday: number;
  checkInsToday: number;
  activeSubscriptions: number;
};

export function useKPIOverview(locationId?: string) {
  return useQuery({
    queryKey: ["analytics", "kpi", locationId],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const [membersResult, newMembersResult, paymentsResult, bookingsResult, checkInsResult] =
        await Promise.all([
          supabase.from("members").select("id, status", { count: "exact" }),
          supabase
            .from("members")
            .select("id", { count: "exact" })
            .gte("created_at", startOfMonth),
          supabase
            .from("payments")
            .select("amount")
            .eq("status", "completed")
            .gte("created_at", startOfMonth),
          supabase
            .from("bookings")
            .select("id", { count: "exact" })
            .gte("created_at", today),
          supabase
            .from("access_logs")
            .select("id", { count: "exact" })
            .gte("checked_in_at", today),
        ]);

      const totalMembers = membersResult.count ?? 0;
      const activeMembers =
        membersResult.data?.filter((m) => m.status === "active").length ?? 0;
      const newMembersThisMonth = newMembersResult.count ?? 0;
      const revenueThisMonth =
        paymentsResult.data?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;
      const classBookingsToday = bookingsResult.count ?? 0;
      const checkInsToday = checkInsResult.count ?? 0;

      return {
        totalMembers,
        activeMembers,
        newMembersThisMonth,
        revenueThisMonth,
        revenueGrowth: 0,
        classBookingsToday,
        checkInsToday,
        activeSubscriptions: activeMembers,
      } as KPIOverview;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useRevenueChart(period: "week" | "month" | "quarter" | "year" = "month") {
  return useQuery({
    queryKey: ["analytics", "revenue", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("status", "completed")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMembershipBreakdown() {
  return useQuery({
    queryKey: ["analytics", "membership-breakdown"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("status");
      if (error) throw error;
      const breakdown = data.reduce<Record<string, number>>((acc, m) => {
        acc[m.status] = (acc[m.status] ?? 0) + 1;
        return acc;
      }, {});
      return breakdown;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

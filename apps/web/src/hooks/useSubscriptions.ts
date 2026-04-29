import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Subscription = {
  id: string;
  member_id: string;
  plan_id: string;
  status: "active" | "frozen" | "cancelled" | "expired";
  starts_at: string;
  ends_at: string;
  frozen_until?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
};

export function useSubscription(memberId: string) {
  return useQuery({
    queryKey: ["subscriptions", "active", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, membership_plans(*)")
        .eq("member_id", memberId)
        .eq("status", "active")
        .order("starts_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSubscriptionHistory(memberId: string) {
  return useQuery({
    queryKey: ["subscriptions", "history", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, membership_plans(*)")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFreezeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      freezeUntil,
      reason,
    }: {
      subscriptionId: string;
      freezeUntil: string;
      reason?: string;
    }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ status: "frozen", frozen_until: freezeUntil, freeze_reason: reason })
        .eq("id", subscriptionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useUnfreezeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ status: "active", frozen_until: null })
        .eq("id", subscriptionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      reason,
    }: {
      subscriptionId: string;
      reason?: string;
    }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq("id", subscriptionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useUpgradeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subscriptionId,
      newPlanId,
    }: {
      subscriptionId: string;
      newPlanId: string;
    }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ plan_id: newPlanId })
        .eq("id", subscriptionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

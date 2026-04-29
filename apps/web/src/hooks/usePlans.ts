import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type MembershipPlan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  is_public: boolean;
  location_id?: string;
  features: string[];
  created_at: string;
  updated_at: string;
};

export type PlanFilters = {
  isPublic?: boolean;
  locationId?: string;
};

export function useMembershipPlans(filters?: PlanFilters) {
  return useQuery({
    queryKey: ["plans", filters],
    queryFn: async () => {
      let query = supabase.from("membership_plans").select("*").order("price");

      if (filters?.isPublic !== undefined) {
        query = query.eq("is_public", filters.isPublic);
      }
      if (filters?.locationId) {
        query = query.eq("location_id", filters.locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MembershipPlan[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as MembershipPlan;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<MembershipPlan, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("membership_plans")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<MembershipPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from("membership_plans")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["plans"] });
      qc.invalidateQueries({ queryKey: ["plans", id] });
    },
  });
}

export function useClonePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: string) => {
      const { data: source, error: fetchError } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", planId)
        .single();
      if (fetchError) throw fetchError;

      const { id: _id, created_at: _ca, updated_at: _ua, ...planData } = source as MembershipPlan;
      const cloned = { ...planData, name: `${planData.name} (Copy)`, is_public: false };

      const { data, error } = await supabase
        .from("membership_plans")
        .insert(cloned)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Member = {
  id: string;
  user_id: string;
  status: "active" | "inactive" | "suspended" | "pending";
  location_id: string;
  created_at: string;
  updated_at: string;
};

export type MemberFilters = {
  search?: string;
  status?: string;
  locationId?: string;
};

export function useMembers(filters?: MemberFilters) {
  return useQuery({
    queryKey: ["members", filters],
    queryFn: async () => {
      let query = supabase
        .from("members")
        .select("*, user_profiles(*), subscriptions(*), membership_cards(*)")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.locationId) {
        query = query.eq("location_id", filters.locationId);
      }
      if (filters?.search) {
        query = query.or(
          `user_profiles.first_name.ilike.%${filters.search}%,user_profiles.last_name.ilike.%${filters.search}%,user_profiles.email.ilike.%${filters.search}%`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ["members", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(
          "*, user_profiles(*), subscriptions(*, membership_plans(*)), membership_cards(*), access_logs(*, gym_locations(name))",
        )
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Member, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("members")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Member> & { id: string }) => {
      const { data, error } = await supabase
        .from("members")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["members", id] });
    },
  });
}

export function useMemberSearch(query: string) {
  return useQuery({
    queryKey: ["members", "search", query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*, user_profiles(id, first_name, last_name, email, avatar_url)")
        .or(
          `user_profiles.first_name.ilike.%${query}%,user_profiles.last_name.ilike.%${query}%,user_profiles.email.ilike.%${query}%`,
        )
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
}

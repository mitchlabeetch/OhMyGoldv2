import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type GymLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  timezone: string;
  created_at: string;
};

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_locations")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as GymLocation[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gym_locations")
        .select("*, facility_zones(*, equipment(*)), operating_hours(*), capacity_rules(*)")
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

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<GymLocation, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("gym_locations")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<GymLocation> & { id: string }) => {
      const { data, error } = await supabase
        .from("gym_locations")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      qc.invalidateQueries({ queryKey: ["locations", id] });
    },
  });
}

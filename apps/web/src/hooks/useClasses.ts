import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type GymClass = {
  id: string;
  name: string;
  description?: string;
  location_id: string;
  teacher_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  status: "scheduled" | "cancelled" | "completed";
  created_at: string;
};

export type ClassFilters = {
  locationId?: string;
  teacherId?: string;
  date?: string;
};

export function useClasses(filters?: ClassFilters) {
  return useQuery({
    queryKey: ["classes", filters],
    queryFn: async () => {
      let query = supabase
        .from("classes")
        .select("*, gym_locations(name), user_profiles(first_name, last_name)")
        .order("starts_at");

      if (filters?.locationId) {
        query = query.eq("location_id", filters.locationId);
      }
      if (filters?.teacherId) {
        query = query.eq("teacher_id", filters.teacherId);
      }
      if (filters?.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        query = query
          .gte("starts_at", start.toISOString())
          .lte("starts_at", end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select(
          "*, gym_locations(name), user_profiles(first_name, last_name), bookings(*, members(*, user_profiles(first_name, last_name, email)))",
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

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<GymClass, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("classes")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<GymClass> & { id: string }) => {
      const { data, error } = await supabase
        .from("classes")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["classes"] });
      qc.invalidateQueries({ queryKey: ["classes", id] });
    },
  });
}

export function useCancelClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (classId: string) => {
      const { data, error } = await supabase
        .from("classes")
        .update({ status: "cancelled" })
        .eq("id", classId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classes"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type StaffMember = {
  id: string;
  user_id: string;
  location_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export type TimeTrackingRecord = {
  id: string;
  user_id: string;
  clocked_in_at: string;
  clocked_out_at?: string;
  location_id?: string;
  notes?: string;
};

export function useStaffMembers(locationId?: string) {
  return useQuery({
    queryKey: ["staff", "members", locationId],
    queryFn: async () => {
      let query = supabase
        .from("staff_members")
        .select("*, user_profiles(id, first_name, last_name, email, avatar_url)")
        .eq("is_active", true)
        .order("created_at");

      if (locationId) {
        query = query.eq("location_id", locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useStaffSchedule(userId: string) {
  return useQuery({
    queryKey: ["staff", "schedule", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_schedules")
        .select("*, gym_locations(name)")
        .eq("user_id", userId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useTimeTracking(userId?: string) {
  return useQuery({
    queryKey: ["staff", "time-tracking", userId],
    queryFn: async () => {
      let query = supabase
        .from("time_tracking")
        .select("*")
        .order("clocked_in_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClockIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userId: string; locationId?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from("time_tracking")
        .insert({
          user_id: payload.userId,
          location_id: payload.locationId ?? null,
          notes: payload.notes ?? null,
          clocked_in_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "time-tracking"] }),
  });
}

export function useClockOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      timeTrackingId,
      notes,
    }: {
      timeTrackingId: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("time_tracking")
        .update({ clocked_out_at: new Date().toISOString(), notes })
        .eq("id", timeTrackingId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "time-tracking"] }),
  });
}

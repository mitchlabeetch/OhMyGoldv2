import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export type Booking = {
  id: string;
  class_id: string;
  member_id: string;
  status: "confirmed" | "waitlisted" | "cancelled";
  created_at: string;
};

export function useMyBookings() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["bookings", "my", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, classes(*, gym_locations(name)), members!inner(profile_id)")
        .eq("members.profile_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClassBookings(classId: string) {
  return useQuery({
    queryKey: ["bookings", "class", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, members(*, user_profiles(first_name, last_name, email))")
        .eq("class_id", classId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!classId,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("profile_id", user!.id)
        .single();
      if (memberError) throw memberError;

      const { data, error } = await supabase
        .from("bookings")
        .insert({ class_id: classId, member_id: member.id, status: "confirmed" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { classId }) => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["classes", classId] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useWaitlistPosition(classId: string) {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["bookings", "waitlist", classId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, created_at, members!inner(profile_id)")
        .eq("class_id", classId)
        .eq("status", "waitlisted")
        .order("created_at");
      if (error) throw error;

      // Note: we fetch the list to find position
      const position = data.findIndex((b: unknown) => {
        const item = b as { members?: { profile_id: string } | { profile_id: string }[] };
        if (Array.isArray(item.members)) {
          return item.members[0]?.profile_id === user!.id;
        }
        return item.members?.profile_id === user!.id;
      });
      return position === -1 ? null : position + 1;
    },
    enabled: !!classId && !!user,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

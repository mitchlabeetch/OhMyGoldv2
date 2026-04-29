import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type AccessLog = {
  id: string;
  member_id: string;
  location_id: string;
  checked_in_at: string;
  checked_out_at?: string;
  entry_method: "card" | "qr" | "manual";
};

export type AccessFilters = {
  memberId?: string;
  locationId?: string;
  date?: string;
};

export function useAccessLogs(filters?: AccessFilters) {
  return useQuery({
    queryKey: ["access", "logs", filters],
    queryFn: async () => {
      let query = supabase
        .from("access_logs")
        .select(
          "*, members(*, user_profiles(first_name, last_name, avatar_url)), gym_locations(name)",
        )
        .order("checked_in_at", { ascending: false });

      if (filters?.memberId) {
        query = query.eq("member_id", filters.memberId);
      }
      if (filters?.locationId) {
        query = query.eq("location_id", filters.locationId);
      }
      if (filters?.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        query = query
          .gte("checked_in_at", start.toISOString())
          .lte("checked_in_at", end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { cardNumber?: string; qrCodeData?: string; locationId?: string }) => {
      let memberQuery = supabase.from("membership_cards").select("member_id");

      if (payload.cardNumber) {
        memberQuery = memberQuery.eq("card_number", payload.cardNumber);
      } else if (payload.qrCodeData) {
        memberQuery = memberQuery.eq("qr_code", payload.qrCodeData);
      } else {
        throw new Error("cardNumber or qrCodeData is required");
      }

      const { data: cardData, error: cardError } = await memberQuery.single();
      if (cardError) throw cardError;

      const { data, error } = await supabase
        .from("access_logs")
        .insert({
          member_id: cardData.member_id,
          location_id: payload.locationId ?? null,
          checked_in_at: new Date().toISOString(),
          entry_method: payload.cardNumber ? "card" : "qr",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["access", "logs"] });
      qc.invalidateQueries({ queryKey: ["access", "recent"] });
    },
  });
}

export function useRecentCheckIns(locationId: string) {
  const qc = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!locationId) return;

    const channel = supabase
      .channel(`access_logs:${locationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "access_logs",
          filter: `location_id=eq.${locationId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["access", "recent", locationId] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [locationId, qc]);

  return useQuery({
    queryKey: ["access", "recent", locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_logs")
        .select(
          "*, members(*, user_profiles(first_name, last_name, avatar_url))",
        )
        .eq("location_id", locationId)
        .order("checked_in_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!locationId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
}

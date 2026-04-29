import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Payment = {
  id: string;
  member_id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string;
  description?: string;
  created_at: string;
};

export function usePaymentHistory(memberId?: string) {
  return useQuery({
    queryKey: ["payments", "history", memberId],
    queryFn: async () => {
      let query = supabase
        .from("payments")
        .select("*, members(*, user_profiles(first_name, last_name, email))")
        .order("created_at", { ascending: false });

      if (memberId) {
        query = query.eq("member_id", memberId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<Payment, "id" | "created_at" | "status"> & { status?: Payment["status"] },
    ) => {
      const { data, error } = await supabase
        .from("payments")
        .insert({ ...payload, status: payload.status ?? "completed" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

export function useRefundPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason?: string;
    }) => {
      const { data, error } = await supabase
        .from("payments")
        .update({ status: "refunded", description: reason })
        .eq("id", paymentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

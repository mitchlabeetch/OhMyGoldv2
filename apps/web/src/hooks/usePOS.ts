import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type POSProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  location_id?: string;
  stock_quantity?: number;
  is_active: boolean;
};

export type POSTransactionItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type POSTransactionPayload = {
  items: POSTransactionItem[];
  paymentMethod: "cash" | "card" | "account_credit";
  memberId?: string;
  locationId?: string;
};

export function usePOSProducts(locationId?: string) {
  return useQuery({
    queryKey: ["pos", "products", locationId],
    queryFn: async () => {
      let query = supabase
        .from("pos_products")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("name");

      if (locationId) {
        query = query.or(`location_id.eq.${locationId},location_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as POSProduct[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePOSTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: POSTransactionPayload) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Unauthorized");
      if (!payload.locationId)
        throw new Error("A location is required to process POS transactions.");

      const subtotal = payload.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const { data, error } = await supabase
        .from("pos_transactions")
        .insert({
          location_id: payload.locationId,
          cashier_id: user.id,
          items: payload.items,
          payment_method: payload.paymentMethod,
          member_id: payload.memberId ?? null,
          subtotal,
          tax_amount: 0,
          total: subtotal,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pos", "transactions"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function usePOSTransactionHistory(locationId?: string) {
  return useQuery({
    queryKey: ["pos", "transactions", locationId],
    queryFn: async () => {
      let query = supabase
        .from("pos_transactions")
        .select("*, members(*, user_profiles(first_name, last_name))")
        .order("created_at", { ascending: false });

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

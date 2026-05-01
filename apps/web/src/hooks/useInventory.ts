import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type InventoryTransaction = {
  id: string;
  product_id: string;
  location_id: string;
  transaction_type:
    | "purchase"
    | "sale"
    | "adjustment"
    | "return"
    | "waste"
    | "transfer";
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  unit_cost_cents?: number;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  performed_by?: string;
  created_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: Record<string, unknown>;
  siret?: string;
  payment_terms_days: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
};

export type StockCount = {
  id: string;
  location_id: string;
  product_id: string;
  counted_at: string;
  system_quantity: number;
  counted_quantity: number;
  variance: number;
  notes?: string;
  counted_by: string;
  created_at: string;
};

// ---- Products with inventory ----

export function useInventoryProducts(locationId?: string, lowStockOnly = false) {
  return useQuery({
    queryKey: ["inventory", "products", locationId, lowStockOnly],
    queryFn: async () => {
      let query = supabase
        .from("pos_products")
        .select("id, name, sku, barcode, stock_quantity, low_stock_threshold, is_active")
        .eq("is_active", true)
        .order("name");

      if (locationId) query = query.eq("location_id", locationId);

      const { data, error } = await query;
      if (error) throw error;

      // Filter low stock client-side
      if (lowStockOnly && data) {
        return data.filter(
          (p) => p.low_stock_threshold != null && p.stock_quantity <= p.low_stock_threshold
        );
      }
      return data;
    },
    staleTime: 60 * 1000,
  });
}

// ---- Inventory transactions ----

export function useInventoryTransactions(filters?: {
  productId?: string;
  locationId?: string;
  transactionType?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["inventory", "transactions", filters],
    queryFn: async () => {
      let query = supabase
        .from("inventory_transactions")
        .select(
          "*, pos_products(name, sku), user_profiles!performed_by(first_name, last_name)"
        )
        .order("created_at", { ascending: false })
        .limit(filters?.limit ?? 100);

      if (filters?.productId) query = query.eq("product_id", filters.productId);
      if (filters?.locationId) query = query.eq("location_id", filters.locationId);
      if (filters?.transactionType) query = query.eq("transaction_type", filters.transactionType);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000,
  });
}

// ---- Record inventory transaction ----

export function useRecordInventoryTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      product_id: string;
      location_id: string;
      transaction_type: InventoryTransaction["transaction_type"];
      quantity_change: number;
      unit_cost_cents?: number;
      notes?: string;
      reference_id?: string;
      reference_type?: string;
    }) => {
      // Get current stock first
      const { data: product, error: productErr } = await supabase
        .from("pos_products")
        .select("stock_quantity")
        .eq("id", payload.product_id)
        .single();
      if (productErr) throw productErr;

      const quantityBefore = product.stock_quantity ?? 0;
      const quantityAfter = quantityBefore + payload.quantity_change;

      if (quantityAfter < 0) {
        throw new Error(`Insufficient stock. Available: ${quantityBefore}`);
      }

      const { data: { user } } = await supabase.auth.getUser();

      // Insert transaction record
      const { data: txn, error: txnErr } = await supabase
        .from("inventory_transactions")
        .insert({
          product_id: payload.product_id,
          location_id: payload.location_id,
          transaction_type: payload.transaction_type,
          quantity_change: payload.quantity_change,
          quantity_before: quantityBefore,
          quantity_after: quantityAfter,
          unit_cost_cents: payload.unit_cost_cents,
          notes: payload.notes,
          reference_id: payload.reference_id,
          reference_type: payload.reference_type,
          performed_by: user?.id,
        })
        .select()
        .single();
      if (txnErr) throw txnErr;

      // Update product stock
      const { error: updateErr } = await supabase
        .from("pos_products")
        .update({ stock_quantity: quantityAfter })
        .eq("id", payload.product_id);
      if (updateErr) throw updateErr;

      return { transaction: txn, new_stock_quantity: quantityAfter };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["pos"] });
    },
  });
}

// ---- Suppliers ----

export function useSuppliers() {
  return useQuery({
    queryKey: ["inventory", "suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Supplier, "id" | "created_at" | "is_active">) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...payload, is_active: true })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory", "suppliers"] }),
  });
}

// ---- Purchase orders ----

export function usePurchaseOrders(locationId?: string) {
  return useQuery({
    queryKey: ["inventory", "purchase-orders", locationId],
    queryFn: async () => {
      let query = supabase
        .from("purchase_orders")
        .select("*, user_profiles!created_by(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (locationId) query = query.eq("location_id", locationId);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      location_id: string;
      supplier_name: string;
      po_number: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("purchase_orders")
        .insert({ ...payload, status: "draft", created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory", "purchase-orders"] }),
  });
}

// ---- Low-stock alert convenience hook ----

export function useLowStockAlerts(locationId?: string) {
  return useInventoryProducts(locationId, true);
}

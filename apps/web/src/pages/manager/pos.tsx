import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  CheckCircle2,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

interface Product {
  id: string;
  name: string;
  price: number;
  tax_rate: number;
  sku: string;
  stock_quantity: number;
  category: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

export default function ManagerPOS() {
  const { user, profile } = useAuthStore();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["pos-products", search],
    queryFn: async () => {
      let q = supabase
        .from("pos_products")
        .select("id, name, price, tax_rate, sku, stock_quantity, category")
        .eq("is_active", true)
        .order("name");
      if (search) q = q.ilike("name", `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock_quantity) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      if (product.stock_quantity === 0) return prev;
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + delta } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const tax = cart.reduce(
    (sum, i) => sum + i.product.price * i.qty * (i.product.tax_rate / 100),
    0,
  );
  const total = subtotal + tax;

  const processMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Unauthorized");
      }
      if (!profile?.location_id) {
        throw new Error("A location is required to process POS transactions.");
      }
      const lineItems = cart.map((i) => ({
        product_id: i.product.id,
        quantity: i.qty,
        unit_price: i.product.price,
        tax_rate: i.product.tax_rate,
        subtotal: i.product.price * i.qty,
      }));
      const { error } = await supabase.from("pos_transactions").insert({
        location_id: profile.location_id,
        cashier_id: user.id,
        items: lineItems,
        subtotal,
        tax_amount: tax,
        total,
        payment_method: paymentMethod,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSuccess(true);
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="p-5 rounded-full bg-status-success/10">
          <CheckCircle2
            className="w-12 h-12 text-status-success"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-2xl font-bold text-white">Payment Complete</h2>
        <p className="text-text-muted">Transaction recorded successfully.</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gold-500/10">
          <ShoppingCart className="w-5 h-5 text-gold-400" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Point of Sale</h1>
          <p className="text-text-secondary text-sm">
            Select products and process payment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Product catalog */}
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              aria-hidden="true"
            />
            <input
              className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-white placeholder-text-muted focus:ring-2 focus:ring-gold-500/50 outline-none"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(products ?? []).map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="bg-surface-card border border-border rounded-xl p-4 text-left hover:border-gold-500/50 hover:bg-surface-elevated transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-gold-500/10 rounded-lg w-fit mb-3">
                  <Package
                    className="w-5 h-5 text-gold-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="font-semibold text-white text-sm leading-tight mb-1">
                  {product.name}
                </div>
                <div className="text-gold-400 font-bold">
                  {product.price.toFixed(2)} €
                </div>
                <div className="text-xs text-text-muted mt-1">
                  Stock: {product.stock_quantity}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-surface-card rounded-xl border border-border flex flex-col h-fit sticky top-4">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <ShoppingCart
              className="w-4 h-4 text-gold-400"
              aria-hidden="true"
            />
            <span className="font-semibold text-white">
              Cart ({cart.length})
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-text-muted text-sm gap-2">
              <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              No items added
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      {product.price.toFixed(2)} € × {qty}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(product.id, -1)}
                      className="p-1 rounded text-text-muted hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="text-white text-sm w-5 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQty(product.id, +1)}
                      className="p-1 rounded text-text-muted hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 rounded text-status-error hover:bg-status-error/10 transition-colors ml-1"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Tax</span>
              <span>{tax.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-white pt-1 border-t border-border">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="p-4 pt-0 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors ${paymentMethod === "card" ? "bg-gold-500 text-black" : "bg-surface-elevated text-text-secondary border border-border"}`}
              >
                <CreditCard className="w-4 h-4" aria-hidden="true" /> Card
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors ${paymentMethod === "cash" ? "bg-gold-500 text-black" : "bg-surface-elevated text-text-secondary border border-border"}`}
              >
                <Banknote className="w-4 h-4" aria-hidden="true" /> Cash
              </button>
            </div>
            <button
              disabled={cart.length === 0 || processing}
              onClick={() => {
                setProcessing(true);
                processMutation.mutate(undefined, {
                  onSettled: () => setProcessing(false),
                });
              }}
              className="w-full py-3 rounded-lg bg-gold-500 text-black font-bold hover:bg-gold-400 disabled:opacity-50 transition-colors"
            >
              {processing ? "Processing…" : `Charge ${total.toFixed(2)} €`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

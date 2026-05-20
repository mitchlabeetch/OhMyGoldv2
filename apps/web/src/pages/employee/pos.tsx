import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  usePOSProducts,
  usePOSTransaction,
  type POSProduct,
} from "@/hooks/usePOS";
import { useAuthStore } from "@/stores/authStore";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

type CartItem = {
  product: POSProduct;
  quantity: number;
};

const CATEGORIES = ["Tous", "supplement", "equipment", "drink", "other"];

const CATEGORY_LABELS: Record<string, string> = {
  Tous: "Tous",
  supplement: "Suppléments",
  equipment: "Équipement",
  drink: "Boissons",
  other: "Autre",
};

type PaymentMethod = "cash" | "card" | "account_credit";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
}[] = [
  { id: "card", label: "Carte", icon: CreditCard },
  { id: "cash", label: "Espèces", icon: Banknote },
  { id: "account_credit", label: "Compte", icon: User },
];

export default function POSPage() {
  const profile = useAuthStore((s) => s.profile);
  const locationId = profile?.location_id ?? undefined;

  const { data: products, isLoading: productsLoading } =
    usePOSProducts(locationId);
  const { mutateAsync: processTransaction, isPending: processingTx } =
    usePOSTransaction();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [lastTotal, setLastTotal] = useState(0);

  const filteredProducts = (products ?? []).filter(
    (p) => categoryFilter === "Tous" || p.category === categoryFilter,
  );

  const addToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity + delta }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await processTransaction({
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
        paymentMethod,
        locationId,
      });
      setLastTotal(cartTotal);
      setCart([]);
      setReceiptVisible(true);
      setTimeout(() => setReceiptVisible(false), 4000);
    } catch (err) {
      console.error("POS transaction failed:", err);
    }
  };

  return (
    <div
      className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row"
      aria-label="Point de vente"
    >
      {/* Product grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Caisse</h1>
        </div>

        {/* Category tabs */}
        <div
          className="flex gap-1 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Catégories de produits"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-gold-400 text-black"
                  : "bg-surface-card border border-border text-text-secondary hover:text-white"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-neutral-700 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-8">
            Aucun produit dans cette catégorie
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                role="listitem"
                onClick={() => addToCart(product)}
                className="glass-card p-4 text-left hover:border-gold-400/50 transition-all active:scale-95"
                aria-label={`Ajouter ${product.name} au panier — ${formatCurrency(product.price)}`}
              >
                <p className="text-white font-medium text-sm truncate">
                  {product.name}
                </p>
                <p className="text-gold-400 font-bold mt-1">
                  {formatCurrency(product.price)}
                </p>
                {product.stock_quantity !== undefined && (
                  <p className="text-text-muted text-xs mt-0.5">
                    Stock: {product.stock_quantity}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart panel */}
      <div className="lg:w-80 bg-surface-card border-t lg:border-t-0 lg:border-l border-border flex flex-col">
        {/* Cart header */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gold-400" aria-hidden="true" />
          <h2 className="font-semibold text-white">Panier ({cart.length})</h2>
        </div>

        {/* Cart items */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          role="list"
          aria-label="Articles dans le panier"
        >
          {cart.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-8">
              Panier vide
            </p>
          ) : (
            cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                role="listitem"
                className="flex items-center gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{product.name}</p>
                  <p className="text-text-muted text-xs">
                    {formatCurrency(product.price)} / unité
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, -1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={`Retirer un ${product.name}`}
                  >
                    <Minus className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <span
                    className="text-white text-sm w-5 text-center"
                    aria-label={`Quantité: ${quantity}`}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                    aria-label={`Ajouter un ${product.name}`}
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
                <span className="text-gold-400 text-sm font-medium w-16 text-right">
                  {formatCurrency(product.price * quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-text-muted hover:text-status-error transition-colors"
                  aria-label={`Supprimer ${product.name} du panier`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total & payment */}
        <div className="p-4 border-t border-border space-y-4">
          {/* Receipt feedback */}
          {receiptVisible && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-status-success/10 border border-status-success/30"
              role="status"
              aria-live="polite"
            >
              <CheckCircle
                className="w-4 h-4 text-status-success"
                aria-hidden="true"
              />
              <span className="text-status-success text-sm font-medium">
                Paiement encaissé — {formatCurrency(lastTotal)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary font-medium">Total</span>
            <span className="text-xl font-bold text-white">
              {formatCurrency(cartTotal)}
            </span>
          </div>

          {/* Payment methods */}
          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label="Méthode de paiement"
          >
            {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaymentMethod(id)}
                aria-pressed={paymentMethod === id}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  paymentMethod === id
                    ? "border-gold-400 bg-gold-400/10 text-gold-400"
                    : "border-border text-text-secondary hover:text-white hover:border-neutral-500"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* Checkout */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0 || processingTx}
            className="w-full py-3 bg-gold-400 text-black font-bold rounded-xl hover:bg-gold-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            aria-label={`Encaisser ${formatCurrency(cartTotal)}`}
          >
            {processingTx ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <>Encaisser {formatCurrency(cartTotal)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

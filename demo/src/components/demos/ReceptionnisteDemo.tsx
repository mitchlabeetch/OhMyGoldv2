import { useState } from "react";
import {
  QrCode,
  Calendar,
  ShoppingCart,
  Search,
  CheckCircle,
  X,
  Zap,
  Plus,
  Minus,
} from "lucide-react";

const TABS = [
  { id: "checkin", label: "Check-in", icon: QrCode },
  { id: "reservations", label: "Réservations", icon: Calendar },
  { id: "caisse", label: "Caisse", icon: ShoppingCart },
];

const RECENT_CHECKINS = [
  { name: "Marie Laurent", plan: "Premium", time: "14:32", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", plan: "Élite", time: "14:28", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", plan: "Essentiel", time: "14:15", initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", plan: "Premium", time: "14:02", initials: "CG", color: "bg-green-500" },
  { name: "Nathalie Blanc", plan: "Essentiel", time: "13:55", initials: "NB", color: "bg-orange-500" },
  { name: "Julien Fabre", plan: "Premium", time: "13:42", initials: "JF", color: "bg-teal-500" },
  { name: "Amina Diallo", plan: "Élite", time: "13:30", initials: "AD", color: "bg-indigo-500" },
  { name: "Pierre Morel", plan: "Essentiel", time: "13:18", initials: "PM2", color: "bg-red-500" },
  { name: "Claire Vidal", plan: "Premium", time: "13:05", initials: "CV", color: "bg-cyan-500" },
  { name: "Samuel Torres", plan: "Élite", time: "12:50", initials: "ST", color: "bg-yellow-500" },
];

const PRODUCTS = [
  { id: 1, name: "Whey Protéine", category: "Suppléments", price: 39.99, emoji: "💪" },
  { id: 2, name: "BCAA", category: "Suppléments", price: 24.99, emoji: "⚡" },
  { id: 3, name: "Créatine", category: "Suppléments", price: 29.99, emoji: "🔥" },
  { id: 4, name: "Eau 1.5L", category: "Boissons", price: 1.50, emoji: "💧" },
  { id: 5, name: "Boisson Énergisante", category: "Boissons", price: 3.50, emoji: "🥤" },
  { id: 6, name: "Shaker", category: "Équipement", price: 12.99, emoji: "🧴" },
  { id: 7, name: "Gants Musculation", category: "Équipement", price: 19.99, emoji: "🧤" },
  { id: 8, name: "Serviette", category: "Équipement", price: 8.99, emoji: "🏋️" },
];

const RESERVATIONS = [
  { name: "Marie Laurent", class: "Yoga Matinal", date: "Aujourd'hui 15:00", status: "Confirmé", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", class: "CrossFit", date: "Demain 10:30", status: "Confirmé", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", class: "Pilates", date: "Demain 12:00", status: "En attente", initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", class: "HIIT Express", date: "Jeu 17:00", status: "Confirmé", initials: "CG", color: "bg-green-500" },
  { name: "Amina Diallo", class: "Boxe", date: "Ven 18:30", status: "Confirmé", initials: "AD", color: "bg-indigo-500" },
];

interface CartItem { id: number; name: string; category: string; price: number; qty: number; emoji: string }

export default function ReceptionnisteDemo() {
  const [activeTab, setActiveTab] = useState("checkin");
  const [searchValue, setSearchValue] = useState("");
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paid, setPaid] = useState(false);

  const handleSearch = () => {
    const found = RECENT_CHECKINS.find((m) =>
      m.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (found || searchValue.length > 2) {
      setCheckedIn(found ? found.name : searchValue);
      setTimeout(() => setCheckedIn(null), 3000);
      setSearchValue("");
    }
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => { setPaid(false); setCart([]); }, 2500);
  };

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white flex-col">
      {/* Topbar */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 bg-[#111111]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="black" />
          </div>
          <span className="font-black text-sm">Oh<span className="text-gold-400">My</span>Gold</span>
        </div>
        <div className="text-xs text-white/30">Réception · Paris 8e · 14:35</div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          En ligne
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-[#0D0D0D] flex-shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-gold-400 text-gold-400"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "checkin" && (
          <div className="max-w-2xl space-y-6 animate-fade-in">
            {/* Success banner */}
            {checkedIn && (
              <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-3 animate-slide-up">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-green-400">Accès autorisé !</div>
                  <div className="text-xs text-green-300/70">{checkedIn} — Bienvenue chez Gold's Gym</div>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-3">Enregistrer une entrée</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50"
                    placeholder="Nom, numéro de carte ou QR code..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gold-400 hover:bg-gold-300 text-black font-bold text-sm px-4 rounded-lg transition-colors"
                >
                  Check-in
                </button>
              </div>
            </div>

            {/* Recent check-ins */}
            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Entrées récentes</span>
                <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Temps réel
                </div>
              </div>
              {RECENT_CHECKINS.map((member, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full ${member.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{member.name}</div>
                      <div className="text-[10px] text-white/30">{member.plan}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30">{member.time}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "caisse" && (
          <div className="flex gap-6 h-full animate-fade-in">
            {/* Products */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-3">Produits</h3>
              <div className="grid grid-cols-4 gap-3">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-[#1A1A1A] border border-white/5 hover:border-gold-400/40 rounded-xl p-3 text-left transition-all card-hover"
                  >
                    <div className="text-2xl mb-2">{product.emoji}</div>
                    <div className="text-xs font-semibold text-white leading-tight">{product.name}</div>
                    <div className="text-[10px] text-white/30 mb-1">{product.category}</div>
                    <div className="text-sm font-black text-gold-400">{product.price.toFixed(2)} €</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="w-56 flex-shrink-0">
              <h3 className="text-sm font-bold text-white mb-3">Panier</h3>
              <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                {paid ? (
                  <div className="p-6 flex flex-col items-center gap-3 animate-slide-up">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                    <div className="text-sm font-bold text-green-400 text-center">Paiement réussi !</div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="p-6 text-center text-xs text-white/20">
                    Panier vide
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-white truncate">{item.name}</div>
                            <div className="text-[10px] text-white/30">{item.price.toFixed(2)} €</div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10">
                              <Minus className="w-2.5 h-2.5 text-white/60" />
                            </button>
                            <span className="text-xs text-white w-5 text-center">{item.qty}</span>
                            <button onClick={() => addToCart(item)} className="w-5 h-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10">
                              <Plus className="w-2.5 h-2.5 text-white/60" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-white/50">Total</span>
                        <span className="text-sm font-black text-gold-400">{total.toFixed(2)} €</span>
                      </div>
                      <button onClick={handlePay} className="w-full bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs py-2 rounded-lg transition-colors mb-1.5">
                        CB / Sans contact
                      </button>
                      <button onClick={handlePay} className="w-full bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-xs py-2 rounded-lg transition-colors">
                        Espèces
                      </button>
                    </div>
                  </>
                )}
              </div>
              {cart.length > 0 && !paid && (
                <button onClick={() => setCart([])} className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] text-white/30 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                  Vider le panier
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Réservations à venir</h3>
              <span className="text-xs text-white/30">{RESERVATIONS.length} réservations</span>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              {RESERVATIONS.map((res, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${res.color} flex items-center justify-center text-xs font-bold text-white`}>
                      {res.initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{res.name}</div>
                      <div className="text-[10px] text-white/30">{res.class} · {res.date}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    res.status === "Confirmé" ? "bg-green-400/10 text-green-400" : "bg-gold-400/10 text-gold-400"
                  }`}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

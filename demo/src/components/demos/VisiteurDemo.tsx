import { useState } from "react";
import { CheckCircle, Zap, MapPin, Phone, ChevronRight, Star } from "lucide-react";

const PLANS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "29,99",
    color: "border-white/10",
    badge: "",
    features: [
      "Accès 1 club",
      "Équipements de musculation",
      "Vestiaires & douches",
      "Application mobile",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "49,99",
    color: "border-gold-400/40",
    badge: "Populaire",
    features: [
      "Accès multi-clubs",
      "Cours collectifs inclus",
      "Suivi personnalisé",
      "Application mobile",
      "1 bilan mensuel",
    ],
  },
  {
    id: "elite",
    name: "Élite",
    price: "79,99",
    color: "border-purple-400/40",
    badge: "Premium",
    features: [
      "Accès illimité tous clubs",
      "Coaching personnel (4h/mois)",
      "Nutrition sur mesure",
      "Récupération (sauna, spa)",
      "Application mobile VIP",
      "Priorité réservations",
    ],
  },
];

const CLUBS = [
  { name: "Paris 8e — Champs-Élysées", address: "42 Av. des Champs-Élysées, 75008", phone: "01 42 00 00 01", open: "06h – 23h" },
  { name: "Lyon Part-Dieu", address: "17 Rue du Docteur Bouchut, 69003", phone: "04 72 00 00 02", open: "06h – 22h" },
  { name: "Bordeaux Mériadeck", address: "Place Ravezies, 33000", phone: "05 56 00 00 03", open: "07h – 22h" },
];

export default function VisiteurDemo() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCTA, setShowCTA] = useState(false);

  const handleSelectPlan = (id: string) => {
    setSelectedPlan(id);
    setShowCTA(true);
    setTimeout(() => setShowCTA(false), 3000);
  };

  return (
    <div className="min-h-full bg-[#0A0A0A] text-white overflow-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gold-400/10 via-transparent to-transparent border-b border-white/5 px-8 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.08)_0%,_transparent_70%)]" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center gold-glow">
              <Zap className="w-6 h-6 text-black" fill="black" />
            </div>
            <span className="text-2xl font-black">Oh<span className="text-gold-400">My</span>Gold</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Votre transformation<br />
            <span className="text-gold-400">commence ici</span>
          </h1>
          <p className="text-white/50 text-base mb-8 max-w-md mx-auto">
            Rejoignez Gold's Gym France et accédez aux meilleurs équipements, coachs certifiés et cours collectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleSelectPlan("premium")}
              className="bg-gold-400 hover:bg-gold-300 text-black font-black px-8 py-3 rounded-xl transition-all gold-glow-sm text-sm"
            >
              Commencer maintenant
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-all border border-white/10 text-sm">
              Visiter un club
            </button>
          </div>

          {showCTA && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm animate-slide-up">
              <CheckCircle className="w-4 h-4" />
              Plan sélectionné ! Inscription en cours…
            </div>
          )}
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center justify-center gap-8 py-6 border-b border-white/5">
        {[
          { value: "1 842+", label: "Membres actifs" },
          { value: "3", label: "Clubs en France" },
          { value: "4.8/5", label: "Note membres" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl font-black text-gold-400">{stat.value}</div>
            <div className="text-[10px] text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Choisissez votre plan</h2>
          <p className="text-white/40 text-sm">Pas d'engagement — résiliez à tout moment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1A1A1A] rounded-2xl p-6 border-2 transition-all ${
                selectedPlan === plan.id ? "border-gold-400 gold-glow-sm" : plan.color
              } ${plan.badge === "Populaire" ? "scale-105" : ""}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full ${
                  plan.badge === "Populaire" ? "bg-gold-400 text-black" : "bg-purple-500 text-white"
                }`}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-base font-black text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">{plan.price}€</span>
                  <span className="text-xs text-white/40">/mois</span>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-white/70">{feat}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                  plan.badge === "Populaire"
                    ? "bg-gold-400 hover:bg-gold-300 text-black"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {selectedPlan === plan.id ? "✓ Sélectionné" : "Choisir ce plan"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-6 py-10 border-t border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Comment ça marche</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { step: "1", icon: "📋", title: "Choisissez votre plan", desc: "Sélectionnez l'offre adaptée à vos objectifs" },
            { step: "2", icon: "📱", title: "Créez votre compte", desc: "Inscription en 2 minutes, accès immédiat" },
            { step: "3", icon: "🏋️", title: "Commencez", desc: "Accédez aux clubs et cours dès aujourd'hui" },
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 flex items-center justify-center text-2xl mx-auto mb-3">
                {step.icon}
              </div>
              <div className="text-xs font-black text-gold-400 mb-1">Étape {step.step}</div>
              <div className="text-sm font-bold text-white mb-1">{step.title}</div>
              <div className="text-xs text-white/40">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Clubs */}
      <div className="px-6 py-10 border-t border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Nos clubs</h2>
          <p className="text-white/40 text-sm">Accédez à tous nos clubs avec l'abonnement Premium et Élite</p>
        </div>
        <div className="space-y-3 max-w-xl mx-auto">
          {CLUBS.map((club) => (
            <div key={club.name} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 hover:border-gold-400/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{club.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30 mb-1">
                    <MapPin className="w-3 h-3" />
                    {club.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Phone className="w-3 h-3" />
                    {club.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gold-400 font-semibold">{club.open}</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gold-400" fill="#FBBF24" />
          <span className="font-black text-sm">Oh<span className="text-gold-400">My</span>Gold</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px] text-white/20">
          {["CGV", "Confidentialité", "Mentions légales", "Contact"].map((link) => (
            <button key={link} className="hover:text-white/40 transition-colors">{link}</button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1 mt-4">
          <ChevronRight className="w-3 h-3 text-white/10" />
          <span className="text-[10px] text-white/20">© 2025 OhMyGold · Gold's Gym France</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Zap,
  Star,
  CheckCircle,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

// Real Gold's Gym France subscription tiers (goldsgymfrance.fr, 2026)
const PLANS = [
  {
    name: "Basic",
    price: "7,99",
    unit: "/sem",
    monthlyEquiv: "~34,63 €/mois",
    color: "border-white/10",
    badge: null,
    features: [
      "Accès réseau national Gold's Gym France",
      "Accès réseau international Gold's Gym",
      "Suivi & entraînement via l'app",
      "QR code d'accès mobile",
      "Sans engagement · préavis 8 sem.",
    ],
  },
  {
    name: "Flex",
    price: "9,99",
    unit: "/sem",
    monthlyEquiv: "~43,29 €/mois",
    color: "border-gold-400",
    badge: "Populaire",
    features: [
      "Tout Basic inclus",
      "Hydromassage",
      "Balance de composition corporelle",
      "Sportwatter (6 saveurs)",
      "Sans engagement · préavis 8 sem.",
    ],
  },
  {
    name: "Premium",
    price: "10,99",
    unit: "/sem",
    monthlyEquiv: "~47,63 €/mois",
    color: "border-purple-400/50",
    badge: "Best Seller",
    features: [
      "Tout Flex inclus",
      "Cours Hyrox & MMA",
      "Carte partageable (1 membre du foyer)",
      "10% de réduction boutique",
      "Sans engagement · préavis 8 sem.",
    ],
  },
];

// Real Gold's Gym France club locations (2025-2026)
const CLUBS = [
  {
    city: "Gold's Gym — Thiais",
    address: "246 Rue des Alouettes, 94320 Thiais",
    open: "24h/24 · 7j/7",
    env: "Zone Commerciale Belle Épine",
    transport: "Métro L7 direction Villejuif",
    rating: 4.9,
  },
  {
    city: "Gold's Gym — Val d'Europe",
    address: "14 Cours du Danube, 77700 Serris",
    open: "06:00 – 23:00 · 7j/7",
    env: "Val d'Europe · Près de Disneyland Paris",
    transport: "RER A — Val d'Europe / Serris",
    rating: 4.8,
  },
];

const STEPS = [
  { n: "01", title: "Choisissez votre plan", desc: "Basic, Flex ou Premium — sans engagement, préavis 8 semaines." },
  { n: "02", title: "Créez votre compte", desc: "2 minutes. Accès immédiat à l'app Gold's Gym France." },
  { n: "03", title: "Venez vous entraîner", desc: "Carte digitale, QR code unique généré à chaque accès." },
];

const TESTIMONIALS = [
  {
    initials: "SM",
    name: "Sophie M.",
    city: "Thiais · 8 mois",
    color: "bg-purple-500",
    stars: 5,
    quote: "L'application est incroyable, les coachs sont top et l'ambiance est vraiment motivante. Je ne changerais pour rien au monde !",
  },
  {
    initials: "JR",
    name: "Julien R.",
    city: "Val d'Europe · 1 an",
    color: "bg-blue-500",
    stars: 5,
    quote: "Les équipements sont toujours propres et fonctionnels. Le système QR code pour entrer est ultra pratique. Je recommande à 100% !",
  },
  {
    initials: "AK",
    name: "Anna K.",
    city: "Thiais · 4 mois",
    color: "bg-green-600",
    stars: 5,
    quote: "J'ai perdu 8 kg en 4 mois. Le Gold's Queen est un espace parfait. Merci à toute l'équipe de Thiais !",
  },
];

const PARTNER_BADGES = [
  { icon: "🏅", label: "NF Sport Certifié" },
  { icon: "🌱", label: "Éco-responsable" },
  { icon: "📱", label: "App iOS & Android" },
  { icon: "🔒", label: "RGPD Conforme" },
];

export default function VisiteurDemo() {
  const [selectedPlan, setSelectedPlan] = useState("Flex");
  const [formStep, setFormStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormStep(0); setEmail(""); }, 3000);
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-full overflow-auto">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-12 pb-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/8 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-gold-400/10 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full border border-gold-400/20 mb-4">
            <Zap className="w-3 h-3" fill="#FBBF24" />
            Gold's Gym France · OhMyGold
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-3">
            L'héritage de<br />
            <span className="text-gold-400">Venice Beach</span> à Paris
          </h1>
          <p className="text-sm text-white/50 mb-6 max-w-xs mx-auto">
            2 clubs Île-de-France · Accès QR code · Suivi digital — tout pour atteindre tes objectifs.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => document.getElementById("plans-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 bg-gold-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-300 transition-colors"
            >
              Démarrer <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1.5 bg-white/5 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              Visite virtuelle
            </button>
          </div>

          {/* Floating stats card */}
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 mt-6 animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-xs font-semibold text-white">47 check-ins</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-xs text-white/40">aujourd'hui</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-xs text-white/40">Thiais (Belle Épine)</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-3 gap-px bg-white/5 border-y border-white/5">
        {[
          { value: "1 355+", label: "Membres actifs" },
          { value: "2", label: "Clubs France" },
          { value: "98%", label: "Satisfaction" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0A0A0A] py-4 text-center">
            <div className="text-lg font-black text-gold-400">{stat.value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Comment ça marche */}
      <section className="px-6 py-10">
        <div className="text-center mb-6">
          <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-1">Simple & Rapide</div>
          <h2 className="text-lg font-black text-white">Comment ça marche</h2>
        </div>
        <div className="space-y-3">
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-4 items-start">
              <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-xs font-black text-gold-400">
                {step.n}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{step.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 pb-10">
        <div className="text-center mb-6">
          <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-1">Ils en parlent</div>
          <h2 className="text-lg font-black text-white">Nos membres témoignent</h2>
        </div>
        <div className="space-y-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-sm font-black text-white flex-shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-white/40">{t.city}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-gold-400" fill="#FBBF24" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clubs */}
      <section className="px-6 pb-10">
        <div className="text-center mb-6">
          <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-1">Réseau</div>
          <h2 className="text-lg font-black text-white">Nos clubs</h2>
        </div>
        <div className="space-y-3">
          {CLUBS.map((club) => (
            <div key={club.city} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-white">{club.city}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] text-white/40">{club.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold-400" fill="#FBBF24" />
                  <span className="text-xs font-bold text-gold-400">{club.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white/20" />
                  <span className="text-[10px] text-white/40">{club.open}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3 text-white/20" />
                  <span className="text-[10px] text-white/40">{club.env}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-white/25">🚇 {club.transport}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans-section" className="px-6 pb-10">
        <div className="text-center mb-6">
          <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-1">Tarifs</div>
          <h2 className="text-lg font-black text-white">Nos formules</h2>
        </div>
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full text-left bg-[#1A1A1A] rounded-xl p-4 border-2 transition-all ${
                selectedPlan === plan.name ? plan.color : "border-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{plan.name}</span>
                  {plan.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      plan.badge === "Best Seller"
                        ? "bg-gold-400/20 text-gold-400"
                        : plan.badge === "Populaire"
                        ? "bg-blue-400/20 text-blue-400"
                        : "bg-green-400/20 text-green-400"
                    }`}>{plan.badge}</span>
                  )}
                </div>
                <div className="text-right">
                  <div>
                    <span className="text-base font-black text-white">{plan.price} €</span>
                    <span className="text-[10px] text-white/30">{plan.unit}</span>
                  </div>
                  <div className="text-[10px] text-white/25">{plan.monthlyEquiv}</div>
                </div>
              </div>
              <div className="space-y-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 flex-shrink-0 ${selectedPlan === plan.name ? "text-green-400" : "text-white/20"}`} />
                    <span className="text-[11px] text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Equipment features */}
      <section className="px-6 pb-10">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Dumbbell, label: "Gold's Iron Ground", sub: "Free weights · Musculation guidée", color: "text-gold-400" },
            { icon: Users, label: "Gold's Arena", sub: "Boxe · MMA · Combat", color: "text-blue-400" },
            { icon: Clock, label: "Gold's CrossZone", sub: "Entraînement fonctionnel", color: "text-green-400" },
            { icon: Zap, label: "Gold's Pulse", sub: "Cardio · 24h Thiais", color: "text-purple-400" },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.label} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
                <Icon className={`w-5 h-5 ${feat.color} mb-2`} />
                <div className="text-sm font-bold text-white">{feat.label}</div>
                <div className="text-[10px] text-white/40">{feat.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Partners / certifications */}
      <section className="px-6 pb-10">
        <div className="grid grid-cols-2 gap-3">
          {PARTNER_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 bg-[#1A1A1A] border border-white/5 rounded-xl px-3 py-2.5">
              <span className="text-lg">{badge.icon}</span>
              <span className="text-[11px] font-semibold text-white/60">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Signup form */}
      <section className="px-6 pb-10">
        <div className="bg-gradient-to-br from-gold-400/15 to-gold-600/5 rounded-2xl p-6 border border-gold-400/20">
          {submitted ? (
            <div className="text-center py-4 animate-slide-up">
              <div className="text-3xl mb-3">🎉</div>
              <div className="text-base font-black text-white">Bienvenue !</div>
              <div className="text-xs text-white/50 mt-1">Votre compte est prêt. Vérifiez votre email.</div>
            </div>
          ) : formStep === 0 ? (
            <div>
              <h3 className="text-base font-black text-white mb-1">Séance d'essai gratuite</h3>
              <p className="text-xs text-white/40 mb-4">Plan {selectedPlan} · Sans engagement · Accès complet à tous les espaces</p>
              <input
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 mb-3 outline-none focus:border-gold-400/50"
              />
              <button
                onClick={() => email.includes("@") && setFormStep(1)}
                className="w-full bg-gold-400 hover:bg-gold-300 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Commencer gratuitement <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="animate-slide-up">
              <h3 className="text-sm font-black text-white mb-4">Presque prêt !</h3>
              <div className="space-y-3 mb-4">
                {[
                  { placeholder: "Prénom", type: "text" },
                  { placeholder: "Nom", type: "text" },
                  { placeholder: "Téléphone", type: "tel" },
                ].map((f) => (
                  <input
                    key={f.placeholder}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-gold-400/50"
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gold-400 hover:bg-gold-300 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Créer mon compte <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gold-400" fill="#FBBF24" />
          <span className="font-black text-sm text-gold-400">OhMyGold</span>
        </div>
        <p className="text-[10px] text-white/20">© 2025 OhMyGold SAS · Paris, France</p>
        <div className="flex justify-center gap-4 mt-2">
          {["CGU", "Confidentialité", "Contact"].map((link) => (
            <button key={link} className="text-[10px] text-white/20 hover:text-white/40 transition-colors">{link}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}

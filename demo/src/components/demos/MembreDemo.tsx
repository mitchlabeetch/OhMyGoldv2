import { useState } from "react";
import {
  Home,
  Calendar,
  CreditCard,
  FileText,
  User,
  Zap,
  CheckCircle,
  ChevronRight,
  Dumbbell,
  QrCode,
} from "lucide-react";

const TABS = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "booking", icon: Calendar, label: "Cours" },
  { id: "card", icon: QrCode, label: "Ma Carte" },
  { id: "subscription", icon: CreditCard, label: "Abonnement" },
  { id: "profile", icon: User, label: "Profil" },
];

const CLASSES = [
  { time: "09:00", name: "Yoga Matinal", coach: "Claire V.", total: 15, booked: 13, day: "Lun" },
  { time: "10:30", name: "CrossFit", coach: "Lucas B.", total: 20, booked: 20, day: "Lun" },
  { time: "12:00", name: "Pilates", coach: "Sophie M.", total: 12, booked: 9, day: "Mar" },
  { time: "17:00", name: "HIIT Express", coach: "Antoine L.", total: 18, booked: 15, day: "Mar" },
  { time: "18:30", name: "Boxe", coach: "Marc D.", total: 16, booked: 12, day: "Mer" },
  { time: "20:00", name: "Stretching", coach: "Julie R.", total: 10, booked: 6, day: "Mer" },
  { time: "07:30", name: "Boot Camp", coach: "Lucas B.", total: 20, booked: 18, day: "Jeu" },
  { time: "19:00", name: "Zumba", coach: "Ana G.", total: 25, booked: 22, day: "Ven" },
];

const BILLING = [
  { date: "01 jan 2025", amount: "49,99 €", status: "Payé" },
  { date: "01 déc 2024", amount: "49,99 €", status: "Payé" },
  { date: "01 nov 2024", amount: "49,99 €", status: "Payé" },
];

export default function MembreDemo() {
  const [activeTab, setActiveTab] = useState("home");
  const [bookedClasses, setBookedClasses] = useState<string[]>(["CrossFit"]);

  const toggleBook = (name: string) => {
    setBookedClasses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Content */}
      <div className="flex-1 overflow-auto pb-16">
        {activeTab === "home" && (
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Greeting */}
            <div className="bg-gradient-to-br from-gold-400/20 to-gold-600/5 rounded-2xl p-5 border border-gold-400/20">
              <div className="text-xs text-gold-400 font-semibold mb-1">Bonjour 👋</div>
              <h2 className="text-xl font-black text-white">Marie Laurent</h2>
              <p className="text-sm text-white/50 mt-1">Membre Premium · Paris 8e</p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <div className="text-lg font-black text-gold-400">42</div>
                  <div className="text-[10px] text-white/40">Séances ce mois</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-lg font-black text-white">247</div>
                  <div className="text-[10px] text-white/40">Jours membre</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <div className="text-lg font-black text-green-400">98%</div>
                  <div className="text-[10px] text-white/40">Présence</div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: QrCode, label: "Ma Carte", sub: "Accès club", tab: "card", color: "text-gold-400" },
                { icon: Calendar, label: "Réserver", sub: "Cours & créneaux", tab: "booking", color: "text-blue-400" },
                { icon: Dumbbell, label: "Mon Plan", sub: "Programme fitness", tab: "profile", color: "text-purple-400" },
                { icon: CreditCard, label: "Abonnement", sub: "Premium · Jan 2025", tab: "subscription", color: "text-green-400" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => setActiveTab(action.tab)}
                    className="bg-[#1A1A1A] border border-white/5 hover:border-gold-400/20 rounded-xl p-4 text-left transition-all card-hover"
                  >
                    <Icon className={`w-5 h-5 ${action.color} mb-2`} />
                    <div className="text-sm font-bold text-white">{action.label}</div>
                    <div className="text-[10px] text-white/40">{action.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Next class */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Prochain cours</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Yoga Matinal</div>
                  <div className="text-xs text-white/40">Aujourd'hui · 09:00 · Salle A · Claire V.</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gold-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div className="p-4 space-y-4 animate-fade-in">
            <h2 className="text-base font-black text-white">Réserver un cours</h2>
            <div className="space-y-2">
              {CLASSES.map((cls) => {
                const isBooked = bookedClasses.includes(cls.name);
                const isFull = cls.booked === cls.total;
                return (
                  <div key={`${cls.name}-${cls.day}`} className="bg-[#1A1A1A] rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/30 w-6">{cls.day}</span>
                          <span className="text-xs text-gold-400 font-semibold">{cls.time}</span>
                          <span className="text-sm font-bold text-white">{cls.name}</span>
                        </div>
                        <div className="flex items-center gap-3 ml-8">
                          <span className="text-[10px] text-white/30">{cls.coach}</span>
                          <span className="text-[10px] text-white/30">{cls.booked}/{cls.total}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => !isFull && toggleBook(cls.name)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          isBooked
                            ? "bg-green-400/15 text-green-400 border border-green-400/30"
                            : isFull
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : "bg-gold-400/15 text-gold-400 border border-gold-400/30 hover:bg-gold-400/25"
                        }`}
                      >
                        {isBooked ? "✓ Réservé" : isFull ? "Complet" : "Réserver"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "card" && (
          <div className="p-4 space-y-4 animate-fade-in">
            <h2 className="text-base font-black text-white">Ma Carte</h2>
            {/* Membership card */}
            <div className="relative bg-gradient-to-br from-gold-400/30 via-gold-500/20 to-gold-600/10 rounded-2xl p-6 border border-gold-400/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold-400/5 -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-gold-400" fill="#FBBF24" />
                    <span className="font-black text-sm text-gold-400">OhMyGold</span>
                  </div>
                  <span className="text-xs text-gold-300/70 bg-gold-400/10 px-2 py-0.5 rounded-full font-semibold">PREMIUM</span>
                </div>

                {/* QR code */}
                <div className="flex justify-center mb-5">
                  <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-black" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-base font-black text-white">Marie Laurent</div>
                  <div className="text-xs text-white/50 mt-1">#ML-1842 · Paris 8e</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Plan", value: "Premium" },
                  { label: "Statut", value: "Actif" },
                  { label: "Valide jusqu'au", value: "31 jan 2025" },
                  { label: "Accès", value: "Multi-clubs" },
                ].map((info) => (
                  <div key={info.label}>
                    <div className="text-[10px] text-white/30">{info.label}</div>
                    <div className="text-sm font-semibold text-white">{info.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="p-4 space-y-4 animate-fade-in">
            <h2 className="text-base font-black text-white">Mon Abonnement</h2>
            <div className="bg-gradient-to-br from-gold-400/20 to-transparent rounded-xl p-4 border border-gold-400/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-gold-400">PREMIUM</span>
                <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full font-semibold">Actif</span>
              </div>
              <div className="text-2xl font-black text-white mb-1">49,99 €<span className="text-sm font-normal text-white/40">/mois</span></div>
              <div className="text-xs text-white/40">Renouvellement le 1er février 2025</div>
              <div className="mt-3 space-y-1.5">
                {["Accès illimité", "Multi-clubs", "Cours collectifs inclus", "Application mobile", "Suivi personnalisé"].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-white/70">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Historique de facturation</span>
              </div>
              {BILLING.map((bill) => (
                <div key={bill.date} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-xs font-semibold text-white">{bill.amount}</div>
                    <div className="text-[10px] text-white/30">{bill.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full font-semibold">{bill.status}</span>
                    <FileText className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Avatar */}
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-2xl font-black text-white mb-3">
                ML
              </div>
              <div className="text-base font-black text-white">Marie Laurent</div>
              <div className="text-xs text-white/40">membre@ohmygold.fr</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Séances", value: "247" },
                { label: "Calories", value: "48k" },
                { label: "Heures", value: "189" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#1A1A1A] rounded-xl p-3 border border-white/5 text-center">
                  <div className="text-lg font-black text-gold-400">{stat.value}</div>
                  <div className="text-[10px] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              {[
                "Informations personnelles",
                "Objectifs fitness",
                "Préférences de cours",
                "Notifications",
                "Confidentialité",
              ].map((item) => (
                <button key={item} className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <span className="text-xs text-white/70">{item}</span>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111111]/95 backdrop-blur-sm border-t border-white/10 flex" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-all ${
                active ? "text-gold-400" : "text-white/30"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-gold-400" : "text-white/30"}`} />
              <span className="text-[9px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

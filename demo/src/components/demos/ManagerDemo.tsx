import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Zap,
  ChevronRight,
  CheckCircle,
  X,
  ChevronLeft,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "members", icon: Users, label: "Membres" },
  { id: "planning", icon: Calendar, label: "Planning" },
  { id: "billing", icon: CreditCard, label: "Facturation" },
];

const KPI_DATA = [
  { label: "Membres", value: "247", icon: Users, trend: "+8", up: true },
  { label: "Revenus / mois", value: "12 340 €", icon: TrendingUp, trend: "+5.2%", up: true },
  { label: "Abonnements", value: "89", icon: Zap, trend: "+3", up: true },
  { label: "Accès aujourd'hui", value: "43", icon: TrendingUp, trend: "-7", up: false },
];

const CLASSES_TODAY = [
  { time: "06:30", name: "Gold's CrossZone", coach: "Lucas B.", total: 20, booked: 18, color: "bg-orange-500" },
  { time: "09:00", name: "Yoga Matinal", coach: "Claire V.", total: 15, booked: 13, color: "bg-purple-500" },
  { time: "12:00", name: "Pilates", coach: "Sophie M.", total: 12, booked: 9, color: "bg-blue-500" },
  { time: "17:00", name: "HIIT Express", coach: "Antoine L.", total: 18, booked: 15, color: "bg-red-500" },
  { time: "18:30", name: "Boxe MMA (Premium)", coach: "Marc D.", total: 16, booked: 16, color: "bg-gold-500" },
  { time: "20:00", name: "Hyrox Training (Premium)", coach: "Julie R.", total: 10, booked: 6, color: "bg-teal-500" },
];

const CHECKINS = [
  { name: "Marie Laurent", time: "Il y a 2 min", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", time: "Il y a 5 min", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", time: "Il y a 9 min", initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", time: "Il y a 12 min", initials: "CG", color: "bg-green-500" },
  { name: "Nathalie Blanc", time: "Il y a 18 min", initials: "NB", color: "bg-orange-500" },
  { name: "Julien Fabre", time: "Il y a 22 min", initials: "JF", color: "bg-teal-500" },
  { name: "Amina Diallo", time: "Il y a 28 min", initials: "AD", color: "bg-indigo-500" },
  { name: "Pierre Morel", time: "Il y a 31 min", initials: "PM", color: "bg-red-500" },
];

// Real subscription tier names (Basic/Flex/Premium matching goldsgymfrance.fr)
const MEMBERS = [
  { name: "Marie Laurent", plan: "Premium", since: "Jan 2025", status: "Actif", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", plan: "Flex", since: "Mars 2025", status: "Actif", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", plan: "Basic", since: "Juin 2025", status: "Actif", initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", plan: "Premium", since: "Sept 2025", status: "Actif", initials: "CG", color: "bg-green-500" },
  { name: "Nathalie Blanc", plan: "Basic", since: "Déc 2025", status: "Suspendu", initials: "NB", color: "bg-orange-500" },
];

// Real pricing: Basic ~34,63€/mo, Flex ~43,29€/mo, Premium ~47,63€/mo
const LAST_PAYMENTS = [
  { name: "Marie Laurent", amount: "47,63 €", date: "17 jan 2026", plan: "Premium", status: "Payé", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", amount: "43,29 €", date: "17 jan 2026", plan: "Flex", status: "Payé", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", amount: "34,63 €", date: "16 jan 2026", plan: "Basic", status: "Payé", initials: "IR", color: "bg-pink-500" },
  { name: "Nathalie Blanc", amount: "47,63 €", date: "15 jan 2026", plan: "Premium", status: "Échoué", initials: "NB", color: "bg-orange-500" },
  { name: "Samuel Torres", amount: "43,29 €", date: "15 jan 2026", plan: "Flex", status: "Payé", initials: "ST", color: "bg-yellow-500" },
];

const WEEKLY_REVENUE = [2800, 3100, 2950, 3490];

export default function ManagerDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPlan, setFormPlan] = useState("Basic");

  const filteredMembers = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.plan.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMember = () => {
    setShowEnroll(false);
    setFormName("");
    setFormEmail("");
    setFormPlan("Basic");
    setEnrollSuccess(true);
    setTimeout(() => setEnrollSuccess(false), 2500);
  };

  const navLabel = NAV_ITEMS.find((n) => n.id === activeNav)?.label ?? "";

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <div
        className="flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col transition-all duration-200"
        style={{ width: sidebarCollapsed ? "52px" : "208px" }}
      >
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <img src="/assets/logos/golds-gym-logo-primary-small.png" alt="Gold's Gym France logo" className="h-6 object-contain flex-shrink-0" />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors"
            aria-label={sidebarCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
          >
            {sidebarCollapsed ? <Menu className="w-4 h-4 text-white/50" /> : <ChevronLeft className="w-4 h-4 text-white/50" />}
          </button>
        </div>
        {!sidebarCollapsed && (
          <div className="px-3 py-1.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">
            Thiais (Belle Épine)
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                aria-label={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gold-400/15 text-gold-400"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5">
          <div className={`flex items-center gap-2 px-2 py-2 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              SM
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-xs font-semibold text-white">S. Martin</div>
                <div className="text-[10px] text-white/30">Gestionnaire</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 bg-[#0D0D0D]">
          <h1 className="text-sm font-bold text-white">{navLabel}</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
            >
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeNav === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-4">
                {KPI_DATA.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
                      <Icon className="w-4 h-4 text-gold-400 mb-3" />
                      <div className="text-xl font-black text-white">{kpi.value}</div>
                      <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
                      <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                        {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {kpi.trend}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-5 gap-6">
                {/* Classes today */}
                <div className="col-span-3 bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-4">Cours d'aujourd'hui</h3>
                  <div className="space-y-3">
                    {CLASSES_TODAY.map((cls) => (
                      <div key={cls.name} className="flex items-center gap-3">
                        <div className="text-xs text-white/30 w-10">{cls.time}</div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cls.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-white truncate">{cls.name}</span>
                            <span className="text-[10px] text-white/40 ml-2">{cls.booked}/{cls.total}</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full">
                            <div
                              className={`h-full rounded-full ${cls.booked === cls.total ? "bg-green-400" : "bg-gold-400"}`}
                              style={{ width: `${(cls.booked / cls.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-white/30 w-16 text-right">{cls.coach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent check-ins */}
                <div className="col-span-2 bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-bold text-white">Check-ins récents</h3>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="space-y-2.5">
                    {CHECKINS.map((ci, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${ci.color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                          {ci.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white truncate">{ci.name}</div>
                          <div className="text-[10px] text-white/30">{ci.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === "members" && (
            <div className="space-y-4 animate-fade-in">
              {/* Success toast - fixed position */}
              {enrollSuccess && (
                <div className="fixed top-4 right-4 bg-green-400/10 border border-green-400/30 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-slide-in-right z-50">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Membre inscrit avec succès !
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50"
                    placeholder="Rechercher un membre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowEnroll((v) => !v)}
                  className="text-xs bg-gold-400/15 text-gold-400 border border-gold-400/30 px-3 py-2 rounded-lg font-semibold hover:bg-gold-400/25 whitespace-nowrap flex items-center gap-1.5"
                >
                  {showEnroll ? <X className="w-3 h-3" /> : null}
                  {showEnroll ? "Annuler" : "+ Inscrire"}
                </button>
              </div>

              {/* Inline enroll form */}
              {showEnroll && (
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gold-400/20 space-y-3 animate-slide-up">
                  <div className="text-xs font-bold text-white mb-2">Nouveau membre</div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50"
                      placeholder="Prénom Nom"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                    <input
                      className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50"
                      placeholder="Email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                    <select
                      className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400/50"
                      value={formPlan}
                      onChange={(e) => setFormPlan(e.target.value)}
                    >
                      <option>Basic</option>
                      <option>Flex</option>
                      <option>Premium</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddMember}
                    className="bg-gold-400 text-black font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    Confirmer l'inscription
                  </button>
                </div>
              )}

              <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                {filteredMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold text-white`}>
                        {member.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{member.name}</div>
                        <div className="text-[10px] text-white/30">Membre depuis {member.since}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40">{member.plan}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        member.status === "Actif" ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/40"
                      }`}>
                        {member.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "planning" && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-white">Planning de la semaine</h2>
              <div className="grid grid-cols-7 gap-2">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                  <div key={day} className={`rounded-xl border ${i === 0 ? "border-gold-400/30 bg-gold-400/5" : "border-white/5 bg-[#1A1A1A]"} p-2`}>
                    <div className={`text-xs font-bold mb-2 ${i === 0 ? "text-gold-400" : "text-white/40"}`}>{day}</div>
                    {[...Array(i === 6 ? 1 : i === 5 ? 3 : 4)].map((_, j) => (
                      <div key={j} className="mb-1 px-1 py-0.5 rounded bg-white/5 text-[9px] text-white/50 truncate">
                        {["Yoga", "CrossFit", "Pilates", "HIIT", "Boxe"][j % 5]}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "billing" && <BillingTab />}
        </div>
      </div>
    </div>
  );
}

function BillingTab() {
  const weekMax = Math.max(...WEEKLY_REVENUE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
          <CreditCard className="w-4 h-4 text-gold-400 mb-3" />
          <div className="text-2xl font-black text-white">12 340 €</div>
          <div className="text-xs text-white/40 mt-1">Revenus ce mois</div>
          <div className="text-xs text-green-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />+5.2% vs mois dernier
          </div>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
          <Zap className="w-4 h-4 text-blue-400 mb-3" />
          <div className="text-2xl font-black text-white">89</div>
          <div className="text-xs text-white/40 mt-1">Abonnements actifs</div>
          <div className="text-xs text-green-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />+3 ce mois
          </div>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
          <TrendingUp className="w-4 h-4 text-green-400 mb-3" />
          <div className="text-2xl font-black text-white">94%</div>
          <div className="text-xs text-white/40 mt-1">Taux de renouvellement</div>
          <div className="text-xs text-green-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />+1.2% vs mois dernier
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Weekly revenue bar chart */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Revenus par semaine</h3>
          <div className="flex items-end gap-3 h-28">
            {WEEKLY_REVENUE.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] text-white/40">{val.toLocaleString("fr-FR")} €</div>
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-gold-500/60 to-gold-400/80 hover:from-gold-400 hover:to-gold-300 transition-all"
                  style={{ height: `${(val / weekMax) * 80}px` }}
                />
                <div className="text-[10px] text-white/30">S{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions breakdown */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Abonnements actifs</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-semibold text-white/30 pb-2">Plan</th>
                <th className="text-right text-[10px] font-semibold text-white/30 pb-2">Qté</th>
                <th className="text-right text-[10px] font-semibold text-white/30 pb-2">Prix</th>
                <th className="text-right text-[10px] font-semibold text-white/30 pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Basic", count: 42, price: "34,63 €", total: "1 454,46 €" },
                { plan: "Flex", count: 35, price: "43,29 €", total: "1 515,15 €" },
                { plan: "Premium", count: 12, price: "47,63 €", total: "571,56 €" },
              ].map((row) => (
                <tr key={row.plan} className="border-b border-white/5 last:border-0">
                  <td className="py-2 text-xs font-semibold text-white">{row.plan}</td>
                  <td className="py-2 text-xs text-white/50 text-right">{row.count}</td>
                  <td className="py-2 text-xs text-white/50 text-right">{row.price}</td>
                  <td className="py-2 text-xs font-bold text-gold-400 text-right">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last payments */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Derniers paiements</h3>
          <span className="text-[10px] text-white/30">{LAST_PAYMENTS.length} transactions</span>
        </div>
        {LAST_PAYMENTS.map((pay, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${pay.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                {pay.initials}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{pay.name}</div>
                <div className="text-[10px] text-white/30">{pay.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-black text-white">{pay.amount}</div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                pay.status === "Payé" ? "bg-green-400/10 text-green-400" : pay.status === "Échoué" ? "bg-red-400/10 text-red-400" : "bg-gold-400/10 text-gold-400"
              }`}>
                {pay.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

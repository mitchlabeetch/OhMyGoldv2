import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  ChevronRight,
  Circle,
  ChevronLeft,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "clubs", icon: Building2, label: "Clubs" },
  { id: "users", icon: Users, label: "Utilisateurs" },
  { id: "analytics", icon: BarChart3, label: "Analytiques" },
  { id: "audit", icon: FileText, label: "Journal d'audit" },
  { id: "settings", icon: Settings, label: "Paramètres" },
];

const KPI_DATA = [
  { label: "Membres actifs", value: "1 355", icon: Users, trend: "+12%", up: true, color: "text-gold-400", sparkline: [65, 72, 68, 78, 85] },
  { label: "Revenus / mois", value: "35 000 €", icon: TrendingUp, trend: "+8.3%", up: true, color: "text-green-400", sparkline: [70, 75, 68, 82, 90] },
  { label: "Abonnements", value: "98", icon: Zap, trend: "+5%", up: true, color: "text-blue-400", sparkline: [55, 60, 58, 65, 72] },
  { label: "Cours aujourd'hui", value: "18", icon: BarChart3, trend: "-2", up: false, color: "text-orange-400", sparkline: [80, 75, 82, 70, 65] },
  { label: "Accès aujourd'hui", value: "214", icon: Circle, trend: "+34", up: true, color: "text-purple-400", sparkline: [40, 55, 62, 70, 85] },
];

const REVENUE_DATA = [
  1820, 2100, 1950, 2400, 2250, 2800, 2650, 3100, 2900, 3200, 3050, 3400, 3250, 3600,
];

// Real Gold's Gym France clubs (as of 2025-2026)
const CLUBS = [
  { name: "Thiais (Belle Épine)", address: "246 Rue des Alouettes, 94320 Thiais", members: 724, revenue: "19 200 €", status: "Actif", occupancy: 82, hours: "24h/24" },
  { name: "Val d'Europe", address: "14 Cours du Danube, 77700 Serris", members: 631, revenue: "15 800 €", status: "Actif", occupancy: 75, hours: "06:00–23:00" },
];

const USERS = [
  { name: "Sophie Martin", email: "s.martin@goldsgymfrance.fr", role: "Gestionnaire", club: "Thiais (Belle Épine)", status: "Actif", initials: "SM", color: "bg-purple-500" },
  { name: "Lucas Bernard", email: "l.bernard@goldsgymfrance.fr", role: "Coach", club: "Thiais (Belle Épine)", status: "Actif", initials: "LB", color: "bg-blue-500" },
  { name: "Emma Petit", email: "e.petit@goldsgymfrance.fr", role: "Réceptionniste", club: "Val d'Europe", status: "Actif", initials: "EP", color: "bg-green-500" },
  { name: "Thomas Durand", email: "t.durand@goldsgymfrance.fr", role: "Coach", club: "Val d'Europe", status: "Inactif", initials: "TD", color: "bg-orange-500" },
  { name: "Julie Moreau", email: "j.moreau@goldsgymfrance.fr", role: "Gestionnaire", club: "Val d'Europe", status: "Actif", initials: "JM", color: "bg-pink-500" },
  { name: "Antoine Leroy", email: "a.leroy@goldsgymfrance.fr", role: "Réceptionniste", club: "Thiais (Belle Épine)", status: "Actif", initials: "AL", color: "bg-teal-500" },
  { name: "Clara Simon", email: "c.simon@goldsgymfrance.fr", role: "Coach", club: "Thiais (Belle Épine)", status: "Actif", initials: "CS", color: "bg-indigo-500" },
  { name: "Franck Bouchard", email: "f.bouchard@goldsgymfrance.fr", role: "Administrateur", club: "Multi-clubs", status: "Actif", initials: "FB", color: "bg-gold-500" },
];

const TRANSACTIONS = [
  { member: "Marie Laurent", type: "Abonnement Premium", amount: "47,63 €", date: "17 jan · 14:32", icon: "💳", color: "text-blue-400" },
  { member: "Paul Marchetti", type: "Renouvellement Flex", amount: "43,29 €", date: "17 jan · 13:15", icon: "🔄", color: "text-purple-400" },
  { member: "Samuel Torres", type: "Séance d'essai", amount: "0,00 €", date: "17 jan · 12:48", icon: "✨", color: "text-gold-400" },
  { member: "Isabelle Renard", type: "Pass Semaine Basic", amount: "35,00 €", date: "17 jan · 11:20", icon: "🏋️", color: "text-green-400" },
  { member: "Christophe Girard", type: "Abonnement Basic", amount: "34,63 €", date: "17 jan · 10:05", icon: "📋", color: "text-orange-400" },
];

const maxRevenue = Math.max(...REVENUE_DATA);

const CLUB_COMPARISON = [
  { name: "Thiais (Belle Épine)", members: 724, revenue: 19200, satisfaction: 92 },
  { name: "Val d'Europe", members: 631, revenue: 15800, satisfaction: 88 },
];

export default function AdminDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <div
        className="flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col transition-all duration-200"
        style={{ width: sidebarCollapsed ? "52px" : "224px" }}
      >
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <img src="/assets/logos/golds-gym-logo-primary-small.png" alt="Gold's Gym" className="h-6 object-contain flex-shrink-0" />
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
            Administration
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
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gold-400/15 text-gold-400"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    {item.label}
                    {active && <div className="ml-auto w-1 h-4 rounded-full bg-gold-400" />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5">
          <div className={`flex items-center gap-2 px-2 py-2 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              FB
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-xs font-semibold text-white">Franck B.</div>
                <div className="text-[10px] text-white/30">Super Admin</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 bg-[#0D0D0D]">
          <div>
            <h1 className="text-sm font-bold text-white">
              {NAV_ITEMS.find((n) => n.id === activeNav)?.label}
            </h1>
            <div className="text-xs text-white/30">Vendredi 17 janvier 2025</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                aria-label="Rechercher"
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 w-44 focus:outline-none focus:border-gold-400/50"
                placeholder="Rechercher..."
              />
            </div>
            <button
              aria-label="Notifications"
              className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
            >
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeNav === "dashboard" && <DashboardTab />}
          {activeNav === "clubs" && <ClubsTab />}
          {activeNav === "users" && <UsersTab />}
          {activeNav === "analytics" && <AnalyticsTab />}
          {activeNav === "audit" && <AuditTab />}
          {activeNav === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs with sparklines */}
      <div className="grid grid-cols-5 gap-4">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon;
          const sparkMax = Math.max(...kpi.sparkline);
          return (
            <div key={kpi.label} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${kpi.color}`} />
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <div className="text-xl font-black text-white">{kpi.value}</div>
              <div className="text-xs text-white/40 mt-1 mb-2">{kpi.label}</div>
              <svg viewBox="0 0 55 16" className={`w-full h-4 ${kpi.color}`} preserveAspectRatio="none">
                {kpi.sparkline.map((v, i) => {
                  const h = (v / sparkMax) * 14;
                  return (
                    <rect
                      key={i}
                      x={i * 12}
                      y={16 - h}
                      width={8}
                      height={h}
                      rx={1}
                      fill="currentColor"
                      opacity={0.6}
                    />
                  );
                })}
              </svg>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="col-span-2 bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Revenus (14 derniers jours)</h3>
              <p className="text-xs text-white/30">Tous clubs confondus</p>
            </div>
            <span className="text-gold-400 text-xs font-semibold bg-gold-400/10 px-2 py-1 rounded-full">+8.3%</span>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {REVENUE_DATA.map((val, i) => {
              const targetHeight = `${(val / maxRevenue) * 100}%`;
              return (
                <div
                  key={i}
                  ref={(node) => {
                    if (node && !node.dataset.animated) {
                      node.dataset.animated = "true";
                      node.animate([{ height: "0%" }, { height: targetHeight }], {
                        duration: 600,
                        easing: "ease-out",
                        delay: i * 40,
                        fill: "both",
                      });
                    }
                  }}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-gold-500/60 to-gold-400/80 transition-all hover:from-gold-400 hover:to-gold-300"
                  style={{ height: targetHeight }}
                  title={`${val} €`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/20">
            <span>J-14</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Activité temps réel</h3>
          <div className="space-y-3">
            {[
              { label: "En salle maintenant", value: "47", color: "bg-green-400" },
              { label: "Accès cette heure", value: "12", color: "bg-blue-400" },
              { label: "Cours en cours", value: "3", color: "bg-gold-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-xs text-white/50">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-xs text-white/30 mb-2">Taux de remplissage clubs</div>
            {CLUBS.map((club) => (
              <div key={club.name} className="mb-2">
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>{club.name}</span>
                  <span>{club.occupancy}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full">
                  <div
                    className="h-full bg-gold-400 rounded-full transition-all"
                    style={{ width: `${club.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dernières transactions */}
      <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Dernières transactions</h3>
          <button className="text-xs text-gold-400 hover:underline">Voir tout →</button>
        </div>
        <div className="space-y-3">
          {TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-base">
                  {tx.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{tx.member}</div>
                  <div className={`text-[10px] ${tx.color}`}>{tx.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gold-400">{tx.amount}</div>
                <div className="text-[10px] text-white/30">{tx.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Clubs ({CLUBS.length})</h2>
        <button className="text-xs bg-gold-400/15 text-gold-400 border border-gold-400/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-gold-400/25">
          + Ajouter un club
        </button>
      </div>
      {CLUBS.map((club) => (
        <div key={club.name} className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 flex items-center justify-between hover:border-gold-400/20 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{club.name}</div>
              <div className="text-xs text-white/40">{club.members} membres · {club.revenue}/mois</div>
              <div className="text-[10px] text-white/25 mt-0.5">{club.address} · {club.hours}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-white/40">Occupation</div>
              <div className="text-sm font-bold text-white">{club.occupancy}%</div>
            </div>
            <span className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded-full font-semibold">{club.status}</span>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Utilisateurs ({USERS.length})</h2>
        <button className="text-xs bg-gold-400/15 text-gold-400 border border-gold-400/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-gold-400/25">
          + Inviter
        </button>
      </div>
      <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Utilisateur</th>
              <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Rôle</th>
              <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Club</th>
              <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.email} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-xs font-bold text-white`}>
                      {user.initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <div className="text-[10px] text-white/30">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-white/60">{user.role}</td>
                <td className="px-4 py-3 text-xs text-white/60">{user.club}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    user.status === "Actif"
                      ? "bg-green-400/10 text-green-400"
                      : "bg-white/10 text-white/40"
                  }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const maxMembers = Math.max(...CLUB_COMPARISON.map((c) => c.members));
  const maxRevenue = Math.max(...CLUB_COMPARISON.map((c) => c.revenue));
  const maxSatisfaction = Math.max(...CLUB_COMPARISON.map((c) => c.satisfaction));

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-sm font-bold text-white">Analytiques multi-clubs</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Taux de rétention", value: "87.4%", change: "+2.1%", up: true },
          { label: "Durée moy. séance", value: "68 min", change: "+5 min", up: true },
          { label: "NPS Score", value: "72", change: "+3", up: true },
          { label: "Taux d'annulation", value: "4.2%", change: "-0.8%", up: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
            <div className="text-xs text-white/40 mb-2">{stat.label}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className={`text-xs font-semibold mt-1 ${stat.up ? "text-green-400" : "text-red-400"}`}>{stat.change} ce mois</div>
          </div>
        ))}
      </div>

      {/* Comparatif clubs */}
      <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">Comparatif clubs</h3>
        <div className="flex gap-5 mb-5 text-[10px] text-white/50">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gold-400" />Membres</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" />Revenus</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" />Satisfaction</div>
        </div>
        <div className="space-y-5">
          {CLUB_COMPARISON.map((club) => (
            <div key={club.name}>
              <div className="text-xs font-bold text-white mb-2">{club.name}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-[10px] text-white/40 flex-shrink-0">Membres</div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full">
                    <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: `${(club.members / maxMembers) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-white/40 w-10 text-right flex-shrink-0">{club.members}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-[10px] text-white/40 flex-shrink-0">Revenus</div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full">
                    <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${(club.revenue / maxRevenue) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-white/40 w-10 text-right flex-shrink-0">{(club.revenue / 1000).toFixed(1)}k</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-[10px] text-white/40 flex-shrink-0">Satisfaction</div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full">
                    <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${(club.satisfaction / maxSatisfaction) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-white/40 w-10 text-right flex-shrink-0">{club.satisfaction}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const events = [
    { time: "14:32", user: "S. Martin", action: "Modification tarif abonnement Flex → 43,29 €/mois", type: "update" },
    { time: "13:15", user: "F. Bouchard", action: "Ouverture club Val d'Europe — Serris (77700)", type: "create" },
    { time: "12:48", user: "L. Bernard", action: "Annulation cours CrossFit 17h — Gold's CrossZone", type: "delete" },
    { time: "11:20", user: "E. Petit", action: "Création compte membre #1355 — Abonnement Basic", type: "create" },
    { time: "10:05", user: "F. Bouchard", action: "Export données RGPD — Thiais (Belle Épine)", type: "export" },
  ];
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-sm font-bold text-white">Journal d'audit</h2>
      <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-0">
            <div className="text-[10px] text-white/30 w-10 flex-shrink-0">{ev.time}</div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              ev.type === "create" ? "bg-green-400" : ev.type === "delete" ? "bg-red-400" : ev.type === "export" ? "bg-blue-400" : "bg-gold-400"
            }`} />
            <div className="flex-1 text-xs text-white/70">{ev.action}</div>
            <div className="text-[10px] text-white/30">{ev.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOGGLE_ITEMS = new Set(["Authentification 2FA", "Alertes email", "Rapports hebdomadaires", "Alertes critiques"]);
const TOGGLE_DEFAULTS: Record<string, boolean> = {
  "Authentification 2FA": true,
  "Alertes email": true,
  "Rapports hebdomadaires": false,
  "Alertes critiques": true,
};

function SettingsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries([...TOGGLE_ITEMS].map((k) => [k, TOGGLE_DEFAULTS[k] ?? false]))
  );

  const flipToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { section: "Général", items: ["Nom de la plateforme", "Fuseau horaire", "Devise", "Langue"] },
    { section: "Sécurité", items: ["Authentification 2FA", "Politique de mots de passe", "Sessions actives"] },
    { section: "Notifications", items: ["Alertes email", "Rapports hebdomadaires", "Alertes critiques"] },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-sm font-bold text-white">Paramètres système</h2>
      {sections.map((section) => (
        <div key={section.section} className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">{section.section}</span>
          </div>
          {section.items.map((item) => (
            <div key={item} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
              <span className="text-xs text-white/70">{item}</span>
              {TOGGLE_ITEMS.has(item) ? (
                <button
                  onClick={() => flipToggle(item)}
                  className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${toggles[item] ? "bg-gold-400" : "bg-white/20"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggles[item] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              ) : (
                <ChevronRight className="w-4 h-4 text-white/20" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

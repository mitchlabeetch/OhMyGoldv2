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
  { label: "Membres actifs", value: "1 842", icon: Users, trend: "+12%", up: true, color: "text-gold-400" },
  { label: "Revenus / mois", value: "47 830 €", icon: TrendingUp, trend: "+8.3%", up: true, color: "text-green-400" },
  { label: "Abonnements", value: "156", icon: Zap, trend: "+5%", up: true, color: "text-blue-400" },
  { label: "Cours aujourd'hui", value: "24", icon: BarChart3, trend: "-2", up: false, color: "text-orange-400" },
  { label: "Accès aujourd'hui", value: "287", icon: Circle, trend: "+34", up: true, color: "text-purple-400" },
];

const REVENUE_DATA = [
  1820, 2100, 1950, 2400, 2250, 2800, 2650, 3100, 2900, 3200, 3050, 3400, 3250, 3600,
];

const CLUBS = [
  { name: "Paris 8e", members: 724, revenue: "19 200 €", status: "Actif", occupancy: 82 },
  { name: "Lyon Part-Dieu", members: 631, revenue: "15 800 €", status: "Actif", occupancy: 75 },
  { name: "Bordeaux Mériadeck", members: 487, revenue: "12 830 €", status: "Actif", occupancy: 68 },
];

const USERS = [
  { name: "Sophie Martin", email: "s.martin@ohmygold.fr", role: "Gestionnaire", club: "Paris 8e", status: "Actif", initials: "SM", color: "bg-purple-500" },
  { name: "Lucas Bernard", email: "l.bernard@ohmygold.fr", role: "Coach", club: "Paris 8e", status: "Actif", initials: "LB", color: "bg-blue-500" },
  { name: "Emma Petit", email: "e.petit@ohmygold.fr", role: "Réceptionniste", club: "Lyon Part-Dieu", status: "Actif", initials: "EP", color: "bg-green-500" },
  { name: "Thomas Durand", email: "t.durand@ohmygold.fr", role: "Coach", club: "Lyon Part-Dieu", status: "Inactif", initials: "TD", color: "bg-orange-500" },
  { name: "Julie Moreau", email: "j.moreau@ohmygold.fr", role: "Gestionnaire", club: "Bordeaux Mériadeck", status: "Actif", initials: "JM", color: "bg-pink-500" },
  { name: "Antoine Leroy", email: "a.leroy@ohmygold.fr", role: "Réceptionniste", club: "Bordeaux Mériadeck", status: "Actif", initials: "AL", color: "bg-teal-500" },
  { name: "Clara Simon", email: "c.simon@ohmygold.fr", role: "Coach", club: "Paris 8e", status: "Actif", initials: "CS", color: "bg-indigo-500" },
  { name: "Maxime Robert", email: "m.robert@ohmygold.fr", role: "Administrateur", club: "Multi-clubs", status: "Actif", initials: "MR", color: "bg-gold-500" },
];

const maxRevenue = Math.max(...REVENUE_DATA);

export default function AdminDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="font-black text-sm">
              Oh<span className="text-gold-400">My</span>Gold
            </span>
          </div>
          <div className="mt-2 text-[10px] text-white/30 font-medium uppercase tracking-wider">
            Administration
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gold-400/15 text-gold-400"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <div className="ml-auto w-1 h-4 rounded-full bg-gold-400" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-black">
              MR
            </div>
            <div>
              <div className="text-xs font-semibold text-white">M. Robert</div>
              <div className="text-[10px] text-white/30">Super Admin</div>
            </div>
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
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon;
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
              <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
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
            {REVENUE_DATA.map((val, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-gold-500/60 to-gold-400/80 transition-all hover:from-gold-400 hover:to-gold-300"
                style={{
                  height: `${(val / maxRevenue) * 100}%`,
                  animation: `barGrow 0.6s ease-out ${i * 0.04}s both`,
                }}
                title={`${val} €`}
              />
            ))}
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
    </div>
  );
}

function AuditTab() {
  const events = [
    { time: "14:32", user: "S. Martin", action: "Modification tarif abonnement Premium", type: "update" },
    { time: "13:15", user: "M. Robert", action: "Ajout club Bordeaux Mériadeck", type: "create" },
    { time: "12:48", user: "L. Bernard", action: "Annulation cours CrossFit 17h", type: "delete" },
    { time: "11:20", user: "E. Petit", action: "Création compte membre #1842", type: "create" },
    { time: "10:05", user: "M. Robert", action: "Export données RGPD", type: "export" },
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

function SettingsTab() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-sm font-bold text-white">Paramètres système</h2>
      {[
        { section: "Général", items: ["Nom de la plateforme", "Fuseau horaire", "Devise", "Langue"] },
        { section: "Sécurité", items: ["Authentification 2FA", "Politique de mots de passe", "Sessions actives"] },
        { section: "Notifications", items: ["Alertes email", "Rapports hebdomadaires", "Alertes critiques"] },
      ].map((section) => (
        <div key={section.section} className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">{section.section}</span>
          </div>
          {section.items.map((item) => (
            <div key={item} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3">
              <span className="text-xs text-white/70">{item}</span>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

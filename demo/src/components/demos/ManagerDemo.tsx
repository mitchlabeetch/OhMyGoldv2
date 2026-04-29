import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Zap,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "members", icon: Users, label: "Membres" },
  { id: "planning", icon: Calendar, label: "Planning" },
];

const KPI_DATA = [
  { label: "Membres", value: "247", icon: Users, trend: "+8", up: true },
  { label: "Revenus / mois", value: "12 340 €", icon: TrendingUp, trend: "+5.2%", up: true },
  { label: "Abonnements", value: "89", icon: Zap, trend: "+3", up: true },
  { label: "Accès aujourd'hui", value: "43", icon: TrendingUp, trend: "-7", up: false },
];

const CLASSES_TODAY = [
  { time: "09:00", name: "Yoga Matinal", coach: "Claire V.", total: 15, booked: 13, color: "bg-purple-500" },
  { time: "10:30", name: "CrossFit", coach: "Lucas B.", total: 20, booked: 20, color: "bg-orange-500" },
  { time: "12:00", name: "Pilates", coach: "Sophie M.", total: 12, booked: 9, color: "bg-blue-500" },
  { time: "17:00", name: "HIIT Express", coach: "Antoine L.", total: 18, booked: 15, color: "bg-red-500" },
  { time: "18:30", name: "Boxe", coach: "Marc D.", total: 16, booked: 16, color: "bg-gold-500" },
  { time: "20:00", name: "Stretching", coach: "Julie R.", total: 10, booked: 6, color: "bg-teal-500" },
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

const MEMBERS = [
  { name: "Marie Laurent", plan: "Premium", since: "Jan 2023", status: "Actif", initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", plan: "Élite", since: "Mars 2022", status: "Actif", initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", plan: "Essentiel", since: "Juin 2024", status: "Actif", initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", plan: "Premium", since: "Sept 2023", status: "Actif", initials: "CG", color: "bg-green-500" },
  { name: "Nathalie Blanc", plan: "Essentiel", since: "Déc 2023", status: "Suspendu", initials: "NB", color: "bg-orange-500" },
];

export default function ManagerDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");

  const filteredMembers = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.plan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col">
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
            Paris 8e
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
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
              SM
            </div>
            <div>
              <div className="text-xs font-semibold text-white">S. Martin</div>
              <div className="text-[10px] text-white/30">Gestionnaire</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 bg-[#0D0D0D]">
          <h1 className="text-sm font-bold text-white">
            {NAV_ITEMS.find((n) => n.id === activeNav)?.label}
          </h1>
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
              </div>
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
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Star,
  Zap,
  Bell,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "schedule", icon: Calendar, label: "Planning" },
  { id: "roster", icon: Users, label: "Participants" },
];

const STATS = [
  { label: "Cours / semaine", value: "7", icon: Calendar, color: "text-blue-400" },
  { label: "Taux de présence", value: "87%", icon: Star, color: "text-gold-400" },
  { label: "Note moyenne", value: "4.8/5", icon: Star, color: "text-green-400" },
];

const TODAY_CLASSES = [
  { time: "09:00", name: "Yoga Matinal", total: 15, booked: 13, room: "Salle A" },
  { time: "12:00", name: "Pilates Avancé", total: 12, booked: 9, room: "Salle B" },
  { time: "18:30", name: "Yoga Détente", total: 15, booked: 15, room: "Salle A" },
];

const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEK_CLASSES: Record<string, { name: string; time: string }[]> = {
  Lun: [{ name: "Yoga Matinal", time: "09:00" }, { name: "Pilates", time: "12:00" }],
  Mar: [{ name: "Yoga Détente", time: "18:30" }],
  Mer: [{ name: "Yoga Matinal", time: "09:00" }, { name: "Méditation", time: "12:00" }],
  Jeu: [{ name: "Yoga Flow", time: "18:00" }],
  Ven: [{ name: "Yoga Matinal", time: "09:00" }, { name: "Pilates", time: "12:00" }],
  Sam: [{ name: "Yoga Weekend", time: "10:00" }],
  Dim: [],
};

const PARTICIPANTS = [
  { name: "Marie Laurent", class: "Yoga Matinal", attendance: "98%", sessions: 42, initials: "ML", color: "bg-purple-500" },
  { name: "Paul Marchetti", class: "Pilates Avancé", attendance: "85%", sessions: 31, initials: "PM", color: "bg-blue-500" },
  { name: "Isabelle Renard", class: "Yoga Détente", attendance: "92%", sessions: 38, initials: "IR", color: "bg-pink-500" },
  { name: "Christophe Girard", class: "Yoga Matinal", attendance: "76%", sessions: 24, initials: "CG", color: "bg-green-500" },
  { name: "Nathalie Blanc", class: "Pilates Avancé", attendance: "88%", sessions: 19, initials: "NB", color: "bg-orange-500" },
  { name: "Julien Fabre", class: "Yoga Détente", attendance: "95%", sessions: 55, initials: "JF", color: "bg-teal-500" },
];

export default function CoachDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex h-full min-h-full bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="font-black text-sm">Oh<span className="text-gold-400">My</span>Gold</span>
          </div>
          <div className="mt-2 text-[10px] text-white/30 font-medium uppercase tracking-wider">
            Espace Coach
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
                  active ? "bg-gold-400/15 text-gold-400" : "text-white/40 hover:text-white hover:bg-white/5"
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
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
              CV
            </div>
            <div>
              <div className="text-xs font-semibold text-white">C. Vidal</div>
              <div className="text-[10px] text-white/30">Coach Yoga</div>
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
          <button
            aria-label="Voir les notifications"
            className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
          >
            <Bell className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeNav === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5">
                      <Icon className={`w-4 h-4 ${stat.color} mb-3`} />
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Today's schedule */}
              <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Cours d'aujourd'hui</h3>
                <div className="space-y-4">
                  {TODAY_CLASSES.map((cls) => (
                    <div key={cls.name} className="flex items-start gap-4">
                      <div className="text-xs text-white/40 w-12 pt-0.5">{cls.time}</div>
                      <div className="flex-1 bg-[#0A0A0A] rounded-lg p-3 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">{cls.name}</span>
                          <span className="text-[10px] text-white/30">{cls.room}</span>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-white/40">{cls.booked}/{cls.total} participants</span>
                          <span className={`text-[10px] font-semibold ${cls.booked === cls.total ? "text-green-400" : "text-gold-400"}`}>
                            {cls.booked === cls.total ? "Complet" : `${Math.round((cls.booked / cls.total) * 100)}%`}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div
                            className={`h-full rounded-full ${cls.booked === cls.total ? "bg-green-400" : "bg-gold-400"}`}
                            style={{ width: `${(cls.booked / cls.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent feedback */}
              <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Avis récents</h3>
                <div className="space-y-3">
                  {[
                    { name: "M. Laurent", note: 5, comment: "Cours excellent, très apaisant !" },
                    { name: "P. Marchetti", note: 5, comment: "Claire est une coach incroyable." },
                    { name: "I. Renard", note: 4, comment: "Très bon cours, j'adore le rythme." },
                  ].map((review) => (
                    <div key={review.name} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {review.name[0]}{review.name.split(" ")[1]?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-white">{review.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-2.5 h-2.5 ${i < review.note ? "text-gold-400 fill-gold-400" : "text-white/10"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-white/50">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === "schedule" && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-white">Planning de la semaine</h2>
              <div className="grid grid-cols-7 gap-2">
                {WEEK_DAYS.map((day, i) => {
                  const classes = WEEK_CLASSES[day] || [];
                  return (
                    <div key={day} className={`rounded-xl border p-2 min-h-24 ${i === 0 ? "border-gold-400/30 bg-gold-400/5" : "border-white/5 bg-[#1A1A1A]"}`}>
                      <div className={`text-xs font-bold mb-2 ${i === 0 ? "text-gold-400" : "text-white/40"}`}>{day}</div>
                      {classes.map((cls, j) => (
                        <div key={j} className="mb-1 px-1.5 py-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                          <div className="text-[9px] text-gold-400 font-semibold">{cls.time}</div>
                          <div className="text-[9px] text-white/60 truncate">{cls.name}</div>
                        </div>
                      ))}
                      {classes.length === 0 && (
                        <div className="text-[10px] text-white/20 text-center mt-4">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeNav === "roster" && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-sm font-bold text-white">Participants ({PARTICIPANTS.length})</h2>
              <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Participant</th>
                      <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Cours</th>
                      <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Présence</th>
                      <th className="text-left text-xs font-semibold text-white/30 px-4 py-3">Séances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARTICIPANTS.map((p) => (
                      <tr key={p.name} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                              {p.initials}
                            </div>
                            <span className="text-xs font-semibold text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/50">{p.class}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-white/10 rounded-full">
                              <div className="h-full bg-gold-400 rounded-full" style={{ width: p.attendance }} />
                            </div>
                            <span className="text-xs text-gold-400 font-semibold">{p.attendance}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">{p.sessions}</span>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

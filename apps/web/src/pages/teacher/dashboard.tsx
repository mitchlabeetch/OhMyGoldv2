import { Calendar, Users, Star, ChevronRight } from "lucide-react";

const todayClasses = [
  { id: "1", time: "09:00", name: "Yoga Flow", room: "Studio A", booked: 12, capacity: 15 },
  { id: "2", time: "11:30", name: "HIIT Blast", room: "Studio B", booked: 20, capacity: 20 },
  { id: "3", time: "18:00", name: "Pilates", room: "Studio C", booked: 8, capacity: 12 },
];

const upcomingWeek = [
  { id: "4", date: "Demain", time: "09:00", name: "Yoga Flow", room: "Studio A", booked: 10, capacity: 15 },
  { id: "5", date: "Mer", time: "11:30", name: "HIIT Blast", room: "Studio B", booked: 18, capacity: 20 },
  { id: "6", date: "Jeu", time: "18:00", name: "Pilates", room: "Studio C", booked: 6, capacity: 12 },
];

export default function TeacherDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Mon tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Cours cette semaine", value: "7", icon: Calendar },
          { label: "Présence moyenne", value: "87%", icon: Users },
          { label: "Note moyenne", value: "4.8/5", icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface-2 rounded-xl p-4 flex items-center gap-4">
            <Icon className="w-8 h-8 text-gold-400" />
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's classes */}
      <div className="bg-surface-2 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Cours d'aujourd'hui</h2>
        <div className="space-y-3">
          {todayClasses.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div>
                <p className="font-medium text-white">{cls.time} — {cls.name}</p>
                <p className="text-sm text-gray-400">{cls.room}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${cls.booked >= cls.capacity ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
                  {cls.booked}/{cls.capacity}
                </span>
                <button className="text-xs text-gold-400 hover:underline flex items-center gap-1">
                  Roster <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming this week */}
      <div className="bg-surface-2 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Cette semaine</h2>
        <div className="space-y-2">
          {upcomingWeek.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-3 border border-surface-3 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">{cls.date}</p>
                <p className="font-medium text-white">{cls.time} — {cls.name}</p>
                <p className="text-xs text-gray-500">{cls.room}</p>
              </div>
              <span className="text-sm text-gray-400">{cls.booked}/{cls.capacity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button className="btn-primary flex items-center gap-2">
          <Users className="w-4 h-4" /> Voir le roster
        </button>
        <button className="btn-secondary flex items-center gap-2">
          Envoyer une mise à jour
        </button>
      </div>
    </div>
  );
}

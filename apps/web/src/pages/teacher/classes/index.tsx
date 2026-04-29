import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const mockClasses = [
  { id: "1", date: "2025-01-20", time: "09:00", name: "Yoga Flow", room: "Studio A", booked: 12, capacity: 15 },
  { id: "2", date: "2025-01-20", time: "18:00", name: "Pilates", room: "Studio C", booked: 8, capacity: 12 },
  { id: "3", date: "2025-01-21", time: "11:30", name: "HIIT Blast", room: "Studio B", booked: 20, capacity: 20 },
  { id: "4", date: "2025-01-22", time: "09:00", name: "Yoga Flow", room: "Studio A", booked: 10, capacity: 15 },
  { id: "5", date: "2025-01-23", time: "18:00", name: "Pilates", room: "Studio C", booked: 6, capacity: 12 },
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function TeacherClassesPage() {
  const [filter, setFilter] = useState<"week" | "month">("week");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-gold-400" /> Mes cours
        </h1>
        <div className="flex gap-2">
          {(["week", "month"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-gold-400 text-black" : "bg-surface-2 text-gray-300 hover:bg-surface-3"}`}
            >
              {f === "week" ? "Cette semaine" : "Ce mois"}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar header */}
      <div className="bg-surface-2 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-surface-3 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          <span className="text-white font-semibold">Semaine du 20 Jan 2025</span>
          <button className="p-2 hover:bg-surface-3 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium">{d}</div>
          ))}
        </div>
      </div>

      {/* Classes list */}
      <div className="space-y-3">
        {mockClasses.map((cls) => (
          <Link
            key={cls.id}
            to={`/teacher/classes/${cls.id}`}
            className="block bg-surface-2 hover:bg-surface-3 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{cls.date} · {cls.time}</p>
                <p className="font-semibold text-white text-lg">{cls.name}</p>
                <p className="text-sm text-gray-400">{cls.room}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls.booked >= cls.capacity ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
                {cls.booked}/{cls.capacity}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

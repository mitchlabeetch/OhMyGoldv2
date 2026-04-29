import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, Calendar, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/ui/StatusBadge";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function ManagerClassesPage() {
  const { t } = useTranslation(["classes", "common"]);
  const { profile } = useAuthStore();
  const locationId = profile?.location_id ?? undefined;

  const [weekBase, setWeekBase] = useState(new Date());
  const weekDates = getWeekDates(weekBase);

  const { data: classes, isLoading } = useClasses({
    locationId,
    date: weekDates[0].toISOString().split("T")[0],
  });

  // Build a map of date → classes
  const classByDate = (classes ?? []).reduce<Record<string, typeof classes>>((acc, cls) => {
    if (!cls) return acc;
    const day = cls.starts_at.split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day]!.push(cls);
    return acc;
  }, {});

  const prevWeek = () => {
    const d = new Date(weekBase);
    d.setDate(d.getDate() - 7);
    setWeekBase(d);
  };
  const nextWeek = () => {
    const d = new Date(weekBase);
    d.setDate(d.getDate() + 7);
    setWeekBase(d);
  };

  const weekLabel = `${weekDates[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${weekDates[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Planning des cours</h1>
          <p className="text-text-secondary text-sm mt-1">Vue hebdomadaire</p>
        </div>
        <Link
          to="/manager/classes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          aria-label="Ajouter un cours"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Ajouter un cours
        </Link>
      </header>

      {/* Week navigator */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={prevWeek}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Semaine précédente"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="text-white font-medium text-sm">{weekLabel}</span>
        <button
          type="button"
          onClick={nextWeek}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-card border border-border text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Semaine suivante"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto" role="region" aria-label="Planning hebdomadaire">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {/* Day headers */}
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={i} className="text-center">
                <p className={`text-xs font-semibold ${isToday ? "text-gold-400" : "text-text-secondary"}`}>
                  {WEEKDAYS[i]}
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 ${
                    isToday
                      ? "w-7 h-7 rounded-full bg-gold-400 text-black flex items-center justify-center mx-auto"
                      : "text-white"
                  }`}
                >
                  {date.getDate()}
                </p>
              </div>
            );
          })}

          {/* Class blocks */}
          {weekDates.map((date, i) => {
            const dayKey = date.toISOString().split("T")[0];
            const dayClasses = classByDate[dayKey] ?? [];
            return (
              <div key={i} className="min-h-[200px] rounded-xl bg-surface-card/30 border border-border p-2 space-y-2">
                {isLoading ? (
                  <div className="h-16 rounded bg-neutral-700 animate-pulse" />
                ) : dayClasses.length === 0 ? (
                  <p className="text-text-muted text-xs text-center mt-4">—</p>
                ) : (
                  dayClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="rounded-lg bg-gold-400/10 border border-gold-400/20 p-2 cursor-pointer hover:bg-gold-400/20 transition-colors"
                      role="button"
                      tabIndex={0}
                      aria-label={`${cls.name} à ${new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                    >
                      <p className="text-gold-400 text-xs font-semibold truncate">{cls.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-text-muted">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span className="text-[10px]">
                          {new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-text-muted">
                        <Users className="w-3 h-3" aria-hidden="true" />
                        <span className="text-[10px]">0/{cls.capacity}</span>
                      </div>
                      <div className="mt-1">
                        <StatusBadge status={cls.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

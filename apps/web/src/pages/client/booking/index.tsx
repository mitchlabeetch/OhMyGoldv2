import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Users, Clock } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useCreateBooking, useCancelBooking, useMyBookings } from "@/hooks/useBookings";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function ClientBooking() {
  const { t } = useTranslation(["common"]);
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay();
    today.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    return today;
  });
  const [selectedDate, setSelectedDate] = useState(isoDate(new Date()));

  const { data: classes = [] } = useClasses({ date: selectedDate });
  const { data: myBookings = [] } = useMyBookings();
  const createBooking = useCreateBooking();
  const cancelBooking = useCancelBooking();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const myBookingClassIds = new Set((myBookings as Array<{ class_id: string; status: string }>).filter((b) => b.status === "confirmed").map((b) => b.class_id));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("nav.booking")}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="p-2 rounded-lg bg-surface-card border border-neutral-800 text-white hover:border-gold-400/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {days.map((d) => {
            const iso = isoDate(d);
            const isSelected = iso === selectedDate;
            const isToday = iso === isoDate(new Date());
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                  isSelected
                    ? "bg-gold-400 border-gold-400 text-black"
                    : isToday
                    ? "border-gold-400/40 text-gold-400 bg-surface-card"
                    : "border-neutral-800 text-neutral-400 bg-surface-card hover:border-neutral-600"
                }`}
              >
                <span className="text-xs font-medium">
                  {d.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 3)}
                </span>
                <span className="text-sm font-bold">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="p-2 rounded-lg bg-surface-card border border-neutral-800 text-white hover:border-gold-400/40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {(classes as Array<{ id: string; name: string; starts_at: string; duration_minutes: number; max_capacity: number; booked_count?: number; teacher_name?: string }>).length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No classes scheduled for this day.</div>
        ) : (
          (classes as Array<{ id: string; name: string; starts_at: string; duration_minutes: number; max_capacity: number; booked_count?: number; teacher_name?: string }>).map((cls) => {
            const booked = myBookingClassIds.has(cls.id);
            const full = (cls.booked_count ?? 0) >= cls.max_capacity;
            const booking = (myBookings as Array<{ id: string; class_id: string; status: string }>).find((b) => b.class_id === cls.id);
            return (
              <div key={cls.id} className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{cls.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      {" — "}
                      {cls.duration_minutes}min
                    </span>
                    {cls.teacher_name && <span>{cls.teacher_name}</span>}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cls.booked_count ?? 0}/{cls.max_capacity}
                    </span>
                  </div>
                </div>
                {booked ? (
                  <button
                    onClick={() => booking && cancelBooking.mutate({ bookingId: booking.id })}
                    disabled={cancelBooking.isPending}
                    className="px-3 py-1.5 text-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                ) : full ? (
                  <span className="px-3 py-1.5 text-sm text-neutral-500 bg-neutral-800/50 rounded-lg">Full</span>
                ) : (
                  <button
                    onClick={() => createBooking.mutate({ classId: cls.id })}
                    disabled={createBooking.isPending}
                    className="px-3 py-1.5 text-sm bg-gold-400 text-black font-semibold rounded-lg hover:bg-gold-400/90 disabled:opacity-50"
                  >
                    Book
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

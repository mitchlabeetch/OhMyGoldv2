import { useTranslation } from "react-i18next";
import { CalendarDays, Clock, X } from "lucide-react";
import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";

export default function MyBookings() {
  const { t } = useTranslation(["common"]);
  const { data: bookings = [], isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const upcoming = (bookings as Array<{ id: string; status: string; class_id: string; gym_classes?: { name: string; starts_at: string; duration_minutes: number; teacher_name?: string } }>)
    .filter((b) => b.status === "confirmed" && b.gym_classes?.starts_at && new Date(b.gym_classes.starts_at) >= new Date());

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-gold-400" />
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No upcoming bookings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((b) => (
            <div key={b.id} className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">{b.gym_classes?.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {b.gym_classes?.starts_at
                      ? new Date(b.gym_classes.starts_at).toLocaleString("fr-FR", {
                          weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })
                      : ""}
                  </span>
                  {b.gym_classes?.teacher_name && <span>{b.gym_classes.teacher_name}</span>}
                </div>
              </div>
              <button
                onClick={() => cancelBooking.mutate({ bookingId: b.id })}
                disabled={cancelBooking.isPending}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                aria-label="Cancel booking"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

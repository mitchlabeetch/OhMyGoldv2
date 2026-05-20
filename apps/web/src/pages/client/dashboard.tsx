import { useTranslation } from "react-i18next";
import { CreditCard, CalendarDays, TrendingUp, QrCode, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useMyBookings } from "@/hooks/useBookings";

export default function ClientDashboard() {
  const { t } = useTranslation(["dashboard", "common"]);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { data: bookings = [] } = useMyBookings();

  const upcoming = (bookings as Array<{ id: string; status: string; gym_classes?: { name: string; starts_at: string; teacher_name: string } }>)
    .filter((b) => b.status === "confirmed")
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-gold-400/20 to-gold-400/5 rounded-2xl border border-gold-400/20 p-6">
        <p className="text-neutral-400 text-sm">
          {t("dashboard:welcome", { defaultValue: "Welcome back," })}
        </p>
        <h1 className="text-2xl font-bold text-white mt-1">
          {profile?.full_name ?? user?.email}
        </h1>
        <p className="text-gold-400 text-sm mt-1">Gold's Gym Member</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/client/booking"
          className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold-400/40 transition-colors"
        >
          <CalendarDays className="w-8 h-8 text-gold-400" />
          <span className="text-white text-sm font-medium text-center">{t("nav.booking", { ns: "common" })}</span>
        </Link>
        <Link
          to="/client/card"
          className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold-400/40 transition-colors"
        >
          <QrCode className="w-8 h-8 text-gold-400" />
          <span className="text-white text-sm font-medium text-center">{t("nav.myCard", { ns: "common" })}</span>
        </Link>
        <Link
          to="/client/subscription"
          className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold-400/40 transition-colors"
        >
          <CreditCard className="w-8 h-8 text-gold-400" />
          <span className="text-white text-sm font-medium text-center">{t("nav.subscription", { ns: "common" })}</span>
        </Link>
        <Link
          to="/client/profile"
          className="bg-surface-card border border-neutral-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gold-400/40 transition-colors"
        >
          <TrendingUp className="w-8 h-8 text-gold-400" />
          <span className="text-white text-sm font-medium text-center">{t("nav.profile", { ns: "common" })}</span>
        </Link>
      </div>

      <div className="bg-surface-card border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-gold-400" />
          <h2 className="text-white font-semibold">Upcoming Bookings</h2>
        </div>
        {upcoming.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-neutral-500 mb-3">No upcoming bookings.</p>
            <Link
              to="/client/booking"
              className="inline-block bg-gold-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gold-400/90"
            >
              Book a class
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{b.gym_classes?.name ?? "Class"}</p>
                  <p className="text-neutral-400 text-sm">
                    {b.gym_classes?.starts_at
                      ? new Date(b.gym_classes.starts_at).toLocaleString("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </p>
                </div>
                <span className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded-full">Confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

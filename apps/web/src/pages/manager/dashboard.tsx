import { useTranslation } from "react-i18next";
import { Users, TrendingUp, CreditCard, Activity, Calendar } from "lucide-react";
import { useKPIOverview } from "@/hooks/useAnalytics";
import { useClasses } from "@/hooks/useClasses";
import { useRecentCheckIns } from "@/hooks/useAccess";
import { useAuthStore } from "@/stores/authStore";
import { KPICard } from "@/components/ui/KPICard";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export default function ManagerDashboard() {
  const { t } = useTranslation(["dashboard"]);
  const profile = useAuthStore((s) => s.profile);
  const locationId = profile?.location_id ?? "";

  const { data: kpi, isLoading: kpiLoading } = useKPIOverview(locationId || undefined);
  const { data: classes } = useClasses({
    locationId: locationId || undefined,
    date: new Date().toISOString().split("T")[0],
  });
  const { data: recentCheckIns } = useRecentCheckIns(locationId);

  const kpiCards = [
    { title: "Membres actifs", value: kpi?.activeMembers ?? 0, icon: Users, color: "text-gold-400" },
    { title: "Revenus ce mois", value: kpi ? formatCurrency(kpi.revenueThisMonth) : "—", icon: TrendingUp, color: "text-status-success" },
    { title: "Abonnements actifs", value: kpi?.activeSubscriptions ?? 0, icon: CreditCard, color: "text-status-info" },
    { title: "Accès aujourd'hui", value: kpi?.checkInsToday ?? 0, icon: Activity, color: "text-gold-400" },
  ];

  const todayClasses = (classes ?? []).filter((c) => c.status !== "cancelled");

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">{t("dashboard:title")}</h1>
        <p className="text-text-secondary mt-1">Vue d'ensemble de votre club</p>
      </header>

      {/* KPI Grid */}
      <section aria-label="KPI Overview">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              isLoading={kpiLoading}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's classes */}
        <section className="glass-card p-6" aria-label="Today's class schedule">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" aria-hidden="true" />
            Cours aujourd'hui ({todayClasses.length})
          </h2>
          {todayClasses.length === 0 ? (
            <p className="text-text-secondary text-sm">Aucun cours programmé.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {todayClasses.slice(0, 6).map((cls) => (
                <li key={cls.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{cls.name}</p>
                    <p className="text-text-muted text-xs">
                      {new Date(cls.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      {" – "}
                      {new Date(cls.ends_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary">0/{cls.capacity}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent check-ins */}
        <section className="glass-card p-6" aria-label="Recent check-ins" aria-live="polite">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold-400" aria-hidden="true" />
            Accès récents
          </h2>
          {!recentCheckIns || recentCheckIns.length === 0 ? (
            <p className="text-text-secondary text-sm">Aucun accès récent.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {recentCheckIns.slice(0, 8).map((ci) => {
                const profile = (ci as { members?: { user_profiles?: { first_name?: string; last_name?: string } } }).members?.user_profiles;
                return (
                  <li key={ci.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gold-400/15 flex items-center justify-center text-gold-400 text-xs font-bold">
                      {profile?.first_name?.charAt(0) ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {profile?.first_name ?? "—"} {profile?.last_name ?? ""}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(ci.checked_in_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import { Users, TrendingUp, CreditCard, Calendar, Activity, MapPin } from "lucide-react";
import { useKPIOverview, useRevenueChart } from "@/hooks/useAnalytics";
import { useLocations } from "@/hooks/useLocations";
import { KPICard } from "@/components/ui/KPICard";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function RevenueBarChart({ data }: { data: Array<{ amount: number; created_at: string }> }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-32 text-text-secondary text-sm">Aucune donnée</div>;
  }

  // Aggregate by day (last 14 days)
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  const byDay = data.reduce<Record<string, number>>((acc, p) => {
    const day = p.created_at.split("T")[0];
    acc[day] = (acc[day] ?? 0) + (p.amount ?? 0);
    return acc;
  }, {});

  const values = days.map((d) => byDay[d] ?? 0);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-1 h-32" aria-label="Revenue bar chart">
      {days.map((day, i) => {
        const pct = (values[i] / maxVal) * 100;
        const label = new Date(day).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1" title={`${label}: ${formatCurrency(values[i])}`}>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t bg-gold-400/80 transition-all"
                style={{ height: `${Math.max(pct, 2)}%` }}
                role="img"
                aria-label={`${label}: ${formatCurrency(values[i])}`}
              />
            </div>
            {i % 3 === 0 && (
              <span className="text-[9px] text-text-muted" aria-hidden="true">{label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { data: kpi, isLoading: kpiLoading } = useKPIOverview();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart("month");
  const { data: locations } = useLocations();

  const kpiCards = [
    {
      title: t("dashboard:stats.activeMembers"),
      value: kpi?.totalMembers ?? 0,
      change: kpi ? Math.round(((kpi.newMembersThisMonth / Math.max(kpi.totalMembers - kpi.newMembersThisMonth, 1)) * 100)) : undefined,
      icon: Users,
      color: "text-gold-400",
    },
    {
      title: t("dashboard:thisMonth") + " (€)",
      value: kpi ? formatCurrency(kpi.revenueThisMonth) : "—",
      change: kpi?.revenueGrowth,
      icon: TrendingUp,
      color: "text-status-success",
    },
    {
      title: "Abonnements actifs",
      value: kpi?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: "text-status-info",
    },
    {
      title: "Cours aujourd'hui",
      value: kpi?.classBookingsToday ?? 0,
      icon: Calendar,
      color: "text-status-warning",
    },
    {
      title: "Accès aujourd'hui",
      value: kpi?.checkInsToday ?? 0,
      icon: Activity,
      color: "text-gold-400",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">{t("dashboard:title")}</h1>
        <p className="text-text-secondary mt-1">{t("dashboard:overview")}</p>
      </header>

      {/* KPI Grid */}
      <section aria-label="KPI Overview">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((card) => (
            <KPICard
              key={card.title}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              color={card.color}
              isLoading={kpiLoading}
            />
          ))}
        </div>
      </section>

      {/* Revenue Chart */}
      <section className="glass-card p-6" aria-label="Revenue chart">
        <h2 className="text-lg font-semibold text-white mb-4">Revenus — 14 derniers jours</h2>
        {revenueLoading ? (
          <div className="h-32 animate-pulse bg-neutral-700 rounded" aria-busy="true" />
        ) : (
          <RevenueBarChart data={revenueData ?? []} />
        )}
      </section>

      {/* Location Comparison */}
      {locations && locations.length > 0 && (
        <section aria-label="Location comparison">
          <h2 className="text-lg font-semibold text-white mb-4">Clubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-400/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{loc.name}</p>
                    <p className="text-text-muted text-xs">{loc.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>{loc.is_active ? "✅ Actif" : "⛔ Inactif"}</span>
                  <span className="text-gold-400 font-medium">Voir →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity placeholder */}
      <section className="glass-card p-6" aria-label="Recent activity">
        <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              <span className="text-text-secondary">—</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

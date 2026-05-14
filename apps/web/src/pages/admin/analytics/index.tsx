import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, Users, BarChart2 } from "lucide-react";
import { useRevenueChart, useMembershipBreakdown } from "@/hooks/useAnalytics";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function RevenueChart({ data }: { data: Array<{ amount: number; created_at: string }> }) {
  const byMonth = data.reduce<Record<string, number>>((acc, p) => {
    const month = p.created_at.slice(0, 7);
    acc[month] = (acc[month] ?? 0) + p.amount;
    return acc;
  }, {});

  const months = Object.keys(byMonth).sort().slice(-12);
  const values = months.map((m) => byMonth[m]);
  const maxVal = Math.max(...values, 1);

  if (months.length === 0) {
    return <p className="text-text-secondary text-sm text-center py-8">Aucune donnée de revenu</p>;
  }

  return (
    <div className="flex items-end gap-2 h-40" aria-label="Revenue chart by month">
      {months.map((month, i) => {
        const pct = (values[i] / maxVal) * 100;
        const label = new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        return (
          <div key={month} className="flex-1 flex flex-col items-center gap-1" title={`${label}: ${formatCurrency(values[i])}`}>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t bg-gold-400 transition-all"
                style={{ height: `${Math.max(pct, 2)}%` }}
                role="img"
                aria-label={`${label}: ${formatCurrency(values[i])}`}
              />
            </div>
            <span className="text-[9px] text-text-muted" aria-hidden="true">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MemberBreakdown({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  const STATUS_COLORS: Record<string, string> = {
    active: "bg-status-success",
    inactive: "bg-neutral-600",
    suspended: "bg-status-error",
    expired: "bg-status-warning",
    pending: "bg-status-info",
  };

  if (total === 0) {
    return <p className="text-text-secondary text-sm text-center py-4">Aucune donnée membre</p>;
  }

  return (
    <div className="space-y-3" role="list" aria-label="Member breakdown">
      {Object.entries(data).map(([status, count]) => (
        <div key={status} className="flex items-center gap-3" role="listitem">
          <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[status] ?? "bg-neutral-600"}`} aria-hidden="true" />
          <span className="text-sm text-text-secondary capitalize flex-1">{status}</span>
          <span className="text-sm text-white font-medium">{count}</span>
          <div className="w-24 h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${STATUS_COLORS[status] ?? "bg-neutral-600"}`}
              style={{ width: `${(count / total) * 100}%` }}
              aria-label={`${Math.round((count / total) * 100)}%`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { t } = useTranslation(["dashboard"]);
  const { data: revenueData, isLoading: revLoading } = useRevenueChart("year");
  const { data: breakdown, isLoading: breakdownLoading } = useMembershipBreakdown();

  const totalRevenue = useMemo(() => {
    let sum = 0;
    const data = revenueData ?? [];
    for (let i = 0; i < data.length; i++) {
      sum += data[i].amount;
    }
    return sum;
  }, [revenueData]);

  const totalMembers = useMemo(() => {
    let sum = 0;
    const data = breakdown ?? {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sum += data[key];
      }
    }
    return sum;
  }, [breakdown]);

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Analytique</h1>
        <p className="text-text-secondary text-sm mt-1">Indicateurs de performance globaux</p>
      </header>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-status-success" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Revenu total (annuel)</span>
          </div>
          {revLoading ? (
            <div className="h-7 w-32 rounded bg-neutral-700 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
          )}
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-gold-400" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Total membres</span>
          </div>
          {breakdownLoading ? (
            <div className="h-7 w-20 rounded bg-neutral-700 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white">{totalMembers}</p>
          )}
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 className="w-5 h-5 text-status-info" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Taux de rétention</span>
          </div>
          <p className="text-2xl font-bold text-white">—</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <section className="glass-card p-6" aria-label="Revenue chart">
        <h2 className="text-lg font-semibold text-white mb-6">Revenus par mois (12 derniers mois)</h2>
        {revLoading ? (
          <div className="h-40 animate-pulse bg-neutral-700 rounded" aria-busy="true" />
        ) : (
          <RevenueChart data={revenueData ?? []} />
        )}
      </section>

      {/* Member Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-card p-6" aria-label="Member status breakdown">
          <h2 className="text-lg font-semibold text-white mb-6">Répartition des membres</h2>
          {breakdownLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-neutral-700 animate-pulse" />
              ))}
            </div>
          ) : (
            <MemberBreakdown data={breakdown ?? {}} />
          )}
        </section>

        <section className="glass-card p-6" aria-label="Class attendance heatmap">
          <h2 className="text-lg font-semibold text-white mb-4">Fréquentation par heure</h2>
          <div className="grid grid-cols-7 gap-1" aria-label="Attendance heatmap placeholder">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, di) => (
              <div key={di} className="text-center">
                <span className="text-xs text-text-muted">{day}</span>
                <div className="mt-1 space-y-1">
                  {Array.from({ length: 8 }).map((_, hi) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={hi}
                        className="h-3 rounded-sm"
                        style={{ backgroundColor: `rgba(245,166,35,${intensity * 0.8})` }}
                        title={`${day} ${hi + 8}h: ${Math.round(intensity * 20)} check-ins`}
                        role="img"
                        aria-label={`${day} ${hi + 8}h`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3">Répartition typique de fréquentation (placeholder)</p>
        </section>
      </div>
    </div>
  );
}

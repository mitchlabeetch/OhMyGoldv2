import { TrendingUp, AlertTriangle, Clock, CreditCard } from "lucide-react";
import { usePaymentHistory } from "@/hooks/usePayments";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";

type PaymentRow = {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  description?: string;
  created_at: string;
  members?: { user_profiles?: { first_name?: string; last_name?: string } };
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export default function ManagerBillingPage() {
  const { data: payments, isLoading } = usePaymentHistory();

  const rows = (payments ?? []) as PaymentRow[];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthPayments = rows.filter(
    (p) => p.status === "completed" && new Date(p.created_at) >= startOfMonth,
  );
  const revenueThisMonth = thisMonthPayments.reduce((s, p) => s + p.amount, 0);

  const failedPayments = rows.filter((p) => p.status === "failed");
  const pendingPayments = rows.filter((p) => p.status === "pending");

  const columns: Column<PaymentRow>[] = [
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (p) => new Date(p.created_at).toLocaleDateString("fr-FR"),
    },
    {
      key: "member",
      label: "Membre",
      render: (p) =>
        p.members?.user_profiles
          ? `${p.members.user_profiles.first_name ?? ""} ${p.members.user_profiles.last_name ?? ""}`.trim()
          : "—",
    },
    { key: "description", label: "Description", render: (p) => p.description ?? "—" },
    {
      key: "amount",
      label: "Montant",
      sortable: true,
      render: (p) => (
        <span className={p.status === "refunded" ? "line-through text-text-muted" : "text-white font-medium"}>
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: "payment_method",
      label: "Méthode",
      render: (p) => <span className="capitalize">{p.payment_method.replace("_", " ")}</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (p) => <StatusBadge status={p.status} />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Facturation</h1>
        <p className="text-text-secondary text-sm mt-1">Aperçu des paiements de votre club</p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-status-success" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Ce mois-ci</span>
          </div>
          {isLoading ? (
            <div className="h-7 w-28 rounded bg-neutral-700 animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-white">{formatCurrency(revenueThisMonth)}</p>
          )}
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-gold-400" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Transactions</span>
          </div>
          <p className="text-xl font-bold text-white">{thisMonthPayments.length}</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-status-error" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Échecs</span>
          </div>
          <p className="text-xl font-bold text-status-error">{failedPayments.length}</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-status-warning" aria-hidden="true" />
            <span className="text-text-secondary text-sm">En attente</span>
          </div>
          <p className="text-xl font-bold text-status-warning">{pendingPayments.length}</p>
        </div>
      </div>

      {/* Failed payments alerts */}
      {failedPayments.length > 0 && (
        <section className="rounded-xl border border-status-error/30 bg-status-error/5 p-4" aria-label="Alertes paiements échoués">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-status-error" aria-hidden="true" />
            <h2 className="font-semibold text-status-error">Paiements échoués ({failedPayments.length})</h2>
          </div>
          <ul className="space-y-2" role="list">
            {failedPayments.slice(0, 5).map((p) => {
              const profile = p.members?.user_profiles;
              return (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-white">
                    {profile ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() : "—"}
                  </span>
                  <span className="text-status-error font-medium">{formatCurrency(p.amount)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Payments table */}
      <section aria-label="Recent payments">
        <h2 className="text-lg font-semibold text-white mb-4">Paiements récents</h2>
        <DataTable
          columns={columns}
          data={rows.slice(0, 50)}
          isLoading={isLoading}
          emptyMessage="Aucun paiement"
        />
      </section>
    </div>
  );
}

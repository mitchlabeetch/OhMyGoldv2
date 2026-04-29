import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, Users, FileDown } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Column } from "@/components/ui/DataTable";

type MemberRow = {
  id: string;
  status: string;
  created_at: string;
  user_profiles?: { first_name?: string; last_name?: string; email?: string };
  subscriptions?: Array<{ membership_plans?: { name?: string } }>;
};

const STATUS_FILTERS = ["all", "active", "inactive", "suspended", "expired"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function exportCSV(data: MemberRow[]) {
  const header = "name,email,status,join_date";
  const rows = data.map((m) => [
    `${m.user_profiles?.first_name ?? ""} ${m.user_profiles?.last_name ?? ""}`.trim(),
    m.user_profiles?.email ?? "",
    m.status,
    new Date(m.created_at).toLocaleDateString("fr-FR"),
  ].join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `membres_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ManagerMembersPage() {
  const { t } = useTranslation(["members", "common"]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: members, isLoading } = useMembers({
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const rows = (members ?? []) as MemberRow[];

  const columns: Column<MemberRow>[] = [
    {
      key: "first_name",
      label: t("members:table.name"),
      sortable: true,
      render: (m) => (
        <Link
          to={`/manager/members/${m.id}`}
          className="font-medium text-white hover:text-gold-400 transition-colors"
        >
          {m.user_profiles?.first_name ?? "—"} {m.user_profiles?.last_name ?? ""}
        </Link>
      ),
    },
    {
      key: "plan",
      label: t("members:table.plan"),
      render: (m) => m.subscriptions?.[0]?.membership_plans?.name ?? "—",
    },
    {
      key: "status",
      label: t("members:table.status"),
      sortable: true,
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: "created_at",
      label: t("members:table.joinDate"),
      sortable: true,
      render: (m) => new Date(m.created_at).toLocaleDateString("fr-FR"),
    },
    {
      key: "actions",
      label: "",
      render: (m) => (
        <Link
          to={`/manager/members/${m.id}`}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium"
          aria-label={`Voir ${m.user_profiles?.first_name ?? "membre"}`}
        >
          Voir
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("members:title")}</h1>
          <p className="text-text-secondary text-sm mt-1">{rows.length} membre{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportCSV(rows)}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 bg-surface-card border border-border text-sm text-white rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
            aria-label="Exporter la liste en CSV"
          >
            <FileDown className="w-4 h-4" aria-hidden="true" />
            CSV
          </button>
          <Link
            to="/manager/members/enroll"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-semibold rounded-lg hover:bg-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {t("members:newMember")}
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          placeholder={t("members:search")}
          onSearch={handleSearch}
          className="flex-1 max-w-sm"
          aria-label={t("members:search")}
        />
        <div className="flex gap-1 bg-surface-card border border-border rounded-lg p-1" role="group" aria-label="Filtrer par statut">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              aria-pressed={statusFilter === s}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-gold-400 text-black"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t(`members:filters.${s}` as `members:filters.all`)}
            </button>
          ))}
        </div>
      </div>

      {!isLoading && rows.length === 0 && !search && statusFilter === "all" ? (
        <EmptyState
          icon={Users}
          title="Aucun membre"
          description="Inscrivez votre premier membre pour commencer."
          action={{ label: t("members:enroll"), onClick: () => { window.location.href = "/manager/members/enroll"; } }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          emptyMessage="Aucun membre trouvé"
        />
      )}
    </div>
  );
}

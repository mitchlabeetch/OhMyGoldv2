import { useState, useCallback } from "react";
import { FileDown, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";

type AuditLogEntry = {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
};

function useAuditLogEntries(search: string, actionFilter: string, dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: ["admin", "audit-log", search, actionFilter, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from("audit_logs")
        .select("*, user_profiles(first_name, last_name, email)")
        .order("created_at", { ascending: false })
        .limit(200);

      if (actionFilter) {
        query = query.eq("action", actionFilter);
      }
      if (dateFrom) {
        query = query.gte("created_at", `${dateFrom}T00:00:00Z`);
      }
      if (dateTo) {
        query = query.lte("created_at", `${dateTo}T23:59:59Z`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as AuditLogEntry[];
    },
    staleTime: 60 * 1000,
  });
}

const ACTION_OPTIONS = [
  "", "login", "logout", "register", "password_reset", "profile_update",
  "member_create", "member_update", "booking_create", "booking_cancel",
  "payment_process", "payment_refund", "class_create", "class_update",
];

function exportCSV(entries: AuditLogEntry[]) {
  const header = "id,action,resource_type,resource_id,ip_address,created_at";
  const rows = entries.map((e) =>
    [e.id, e.action, e.resource_type ?? "", e.resource_id ?? "", e.ip_address ?? "", e.created_at].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_log_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const inputClass =
  "px-3 py-2 bg-surface-card border border-border rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-colors";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: entries, isLoading } = useAuditLogEntries(search, actionFilter, dateFrom, dateTo);

  const handleSearch = useCallback((val: string) => setSearch(val), []);

  const filtered = (entries ?? []).filter((e) => {
    if (!search) return true;
    return (
      e.action.includes(search) ||
      (e.resource_type ?? "").includes(search) ||
      (e.resource_id ?? "").includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Journal d'audit</h1>
          <p className="text-text-secondary text-sm mt-1">{filtered.length} événement{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => exportCSV(filtered)}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-card border border-border text-sm text-white rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
          aria-label="Exporter en CSV"
        >
          <FileDown className="w-4 h-4" aria-hidden="true" />
          Exporter CSV
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          placeholder="Rechercher..."
          onSearch={handleSearch}
          className="flex-1 max-w-xs"
          aria-label="Rechercher dans le journal"
        />
        <div>
          <label htmlFor="action-filter" className="sr-only">Type d'action</label>
          <select
            id="action-filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={inputClass}
            aria-label="Filtrer par action"
          >
            <option value="">Toutes les actions</option>
            {ACTION_OPTIONS.filter(Boolean).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date-from" className="sr-only">Date de début</label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
            aria-label="Date de début"
          />
        </div>
        <div>
          <label htmlFor="date-to" className="sr-only">Date de fin</label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
            aria-label="Date de fin"
          />
        </div>
      </div>

      {/* Table */}
      {!isLoading && filtered.length === 0 ? (
        <EmptyState icon={List} title="Aucun événement" description="Aucune activité enregistrée pour ces critères." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border" role="region" aria-label="Journal d'audit">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-card/50">
                {["Horodatage", "Action", "Ressource", "Identifiant", "IP"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} aria-hidden="true">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-4 rounded bg-neutral-700 animate-pulse" />
                      </td>
                    </tr>
                  ))
                : filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        {new Date(e.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-400/10 text-gold-400">
                          {e.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-200">{e.resource_type ?? "—"}</td>
                      <td className="px-4 py-3 text-neutral-400 font-mono text-xs">
                        {e.resource_id ? e.resource_id.slice(0, 8) + "…" : "—"}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">{e.ip_address ?? "—"}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

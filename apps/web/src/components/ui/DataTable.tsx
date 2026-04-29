import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export type DataTableProps<T extends { id?: string }> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowKey?: (row: T) => string;
};

function Skeleton() {
  return (
    <tr aria-hidden="true">
      <td colSpan={100} className="px-4 py-3">
        <div className="h-4 rounded bg-neutral-700 animate-pulse w-full" />
      </td>
    </tr>
  );
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data",
  rowKey,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av === bv) return 0;
    const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const getRowKey = (row: T, i: number) => {
    if (rowKey) return rowKey(row);
    if (row.id) return row.id;
    return String(i);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border" role="region" aria-label="Data table">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-card/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider select-none"
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(String(col.key))}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    aria-sort={
                      sortKey === String(col.key)
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {col.label}
                    <span className="flex flex-col" aria-hidden="true">
                      <ChevronUp
                        className={`w-3 h-3 -mb-1 ${sortKey === String(col.key) && sortDir === "asc" ? "text-gold-400" : "text-neutral-600"}`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 ${sortKey === String(col.key) && sortDir === "desc" ? "text-gold-400" : "text-neutral-600"}`}
                      />
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-secondary">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={getRowKey(row, i)}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-neutral-200">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import type { ElementType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export type KPICardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: ElementType;
  color?: string;
  isLoading?: boolean;
};

export function KPICard({ title, value, change, icon: Icon, color = "text-gold-400", isLoading }: KPICardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-pulse" aria-busy="true" aria-label={title}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-700" />
          <div className="w-16 h-4 rounded bg-neutral-700" />
        </div>
        <div className="w-24 h-7 rounded bg-neutral-700 mb-1" />
        <div className="w-32 h-3 rounded bg-neutral-700" />
      </div>
    );
  }

  return (
    <article className="glass-card p-6" aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
        </div>
        {change !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-status-success" : "text-status-error"}`}
            aria-label={`${change >= 0 ? "+" : ""}${change}%`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3 h-3" aria-hidden="true" />
            )}
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-text-secondary text-sm mt-0.5">{title}</p>
    </article>
  );
}

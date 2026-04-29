import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CardProps, MetricCardProps, ProfileCardProps } from "./Card.types";

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  variant = "content",
  padding = "md",
  shadow = false,
  bordered = true,
  hoverable = false,
  isLoading = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "bg-surface-card rounded-2xl",
        bordered ? "border border-border" : "",
        shadow ? "shadow-card" : "",
        hoverable ? "hover:border-border-emphasis transition-colors cursor-pointer" : "",
        isLoading ? "animate-pulse" : "",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
  isLoading = false,
  className = "",
  ...props
}: MetricCardProps) {
  const trendColor =
    trend === undefined ? "" : trend > 0 ? "text-status-success" : trend < 0 ? "text-status-error" : "text-text-muted";
  const TrendIcon =
    trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div
      className={[
        "bg-surface-card rounded-2xl border border-border p-5",
        isLoading ? "animate-pulse" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-text-muted">{icon}</div>
        {TrendIcon && trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {trendLabel ?? `${Math.abs(trend)}%`}
          </div>
        )}
      </div>
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{isLoading ? "—" : value}</p>
    </div>
  );
}

export function ProfileCard({
  avatarUrl,
  firstName,
  lastName,
  role,
  email,
  phone,
  isActive = true,
  actions,
}: ProfileCardProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="bg-surface-card rounded-2xl border border-border p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${firstName} ${lastName}`}
              className="w-14 h-14 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gold-500/20 border-2 border-gold-500/40 flex items-center justify-center text-gold-400 text-lg font-bold">
              {initials}
            </div>
          )}
          {/* Active indicator */}
          <span
            className={[
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface-card",
              isActive ? "bg-status-success" : "bg-neutral-500",
            ].join(" ")}
            aria-label={isActive ? "Actif" : "Inactif"}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">
            {firstName} {lastName}
          </p>
          <p className="text-text-muted text-sm capitalize">{role}</p>
          {email && <p className="text-text-secondary text-xs mt-1 truncate">{email}</p>}
          {phone && <p className="text-text-secondary text-xs truncate">{phone}</p>}
        </div>
      </div>

      {actions && <div className="mt-4 pt-4 border-t border-border flex gap-2">{actions}</div>}
    </div>
  );
}

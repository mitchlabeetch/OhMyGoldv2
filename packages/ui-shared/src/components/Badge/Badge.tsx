import type { BadgeProps, BadgeStatus, BadgeRole } from "./Badge.types";

const statusMap: Record<BadgeStatus, { label: string; className: string }> = {
  active:    { label: "Actif",    className: "bg-status-success/10 text-status-success border-status-success/30" },
  inactive:  { label: "Inactif", className: "bg-neutral-700/50 text-neutral-400 border-neutral-600" },
  pending:   { label: "En attente", className: "bg-status-warning/10 text-status-warning border-status-warning/30" },
  expired:   { label: "Expiré",  className: "bg-status-error/10 text-status-error border-status-error/30" },
  suspended: { label: "Suspendu", className: "bg-status-error/10 text-status-error border-status-error/30" },
};

const roleMap: Record<BadgeRole, { label: string; className: string }> = {
  super_admin:  { label: "Super Admin",  className: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  admin:        { label: "Admin",        className: "bg-status-error/10 text-status-error border-status-error/30" },
  coach:        { label: "Coach",        className: "bg-status-success/10 text-status-success border-status-success/30" },
  receptionist: { label: "Réceptionniste", className: "bg-status-warning/10 text-status-warning border-status-warning/30" },
  member:       { label: "Membre",       className: "bg-gold-500/10 text-gold-400 border-gold-500/30" },
  visitor:      { label: "Visiteur",     className: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  manager:      { label: "Manager",      className: "bg-status-info/10 text-status-info border-status-info/30" },
  teacher:      { label: "Teacher",      className: "bg-status-success/10 text-status-success border-status-success/30" },
  employee:     { label: "Employee",     className: "bg-status-warning/10 text-status-warning border-status-warning/30" },
  client:       { label: "Client",       className: "bg-gold-500/10 text-gold-400 border-gold-500/30" },
};

export function Badge({
  variant = "tag",
  status,
  role,
  label,
  count,
  className = "",
}: BadgeProps) {
  // Count badge
  if (variant === "count" && count !== undefined) {
    return (
      <span
        className={[
          "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1",
          "rounded-full bg-gold-500 text-black text-[10px] font-bold leading-none",
          className,
        ].join(" ")}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  }

  // Status badge
  if (variant === "status" && status) {
    const { label: defaultLabel, className: statusClass } = statusMap[status];
    return (
      <span
        className={[
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold",
          statusClass,
          className,
        ].join(" ")}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
        {label ?? defaultLabel}
      </span>
    );
  }

  // Role badge
  if (variant === "role" && role) {
    const { label: defaultLabel, className: roleClass } = roleMap[role];
    return (
      <span
        className={[
          "inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-semibold",
          roleClass,
          className,
        ].join(" ")}
      >
        {label ?? defaultLabel}
      </span>
    );
  }

  // Default tag
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-md border border-border",
        "bg-surface-elevated text-text-secondary text-xs font-medium",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

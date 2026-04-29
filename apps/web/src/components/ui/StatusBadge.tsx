const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  active:    { bg: "bg-status-success/15", text: "text-status-success", label: "Active" },
  frozen:    { bg: "bg-status-info/15",    text: "text-status-info",    label: "Frozen" },
  expired:   { bg: "bg-status-warning/15", text: "text-status-warning", label: "Expired" },
  cancelled: { bg: "bg-status-error/15",   text: "text-status-error",   label: "Cancelled" },
  pending:   { bg: "bg-neutral-700/50",    text: "text-neutral-400",    label: "Pending" },
  inactive:  { bg: "bg-neutral-700/50",    text: "text-neutral-400",    label: "Inactive" },
  suspended: { bg: "bg-status-error/15",   text: "text-status-error",   label: "Suspended" },
  scheduled: { bg: "bg-status-info/15",    text: "text-status-info",    label: "Scheduled" },
  completed: { bg: "bg-status-success/15", text: "text-status-success", label: "Completed" },
};

type StatusBadgeProps = {
  status: string;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["pending"];
  const displayLabel = label ?? style.label ?? status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      role="status"
      aria-label={displayLabel}
    >
      {displayLabel}
    </span>
  );
}

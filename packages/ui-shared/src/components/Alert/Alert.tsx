import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { AlertProps, AlertType } from "./Alert.types";

const alertConfig: Record<
  AlertType,
  { icon: typeof CheckCircle2; wrapperClass: string; iconClass: string; textClass: string }
> = {
  success: {
    icon: CheckCircle2,
    wrapperClass: "bg-status-success/5 border-status-success/30",
    iconClass: "text-status-success",
    textClass: "text-status-success",
  },
  warning: {
    icon: AlertTriangle,
    wrapperClass: "bg-status-warning/5 border-status-warning/30",
    iconClass: "text-status-warning",
    textClass: "text-status-warning",
  },
  error: {
    icon: XCircle,
    wrapperClass: "bg-status-error/5 border-status-error/30",
    iconClass: "text-status-error",
    textClass: "text-status-error",
  },
  info: {
    icon: Info,
    wrapperClass: "bg-status-info/5 border-status-info/30",
    iconClass: "text-status-info",
    textClass: "text-status-info",
  },
};

export function Alert({
  type,
  variant = "inline",
  title,
  description,
  children,
  dismissible = false,
  onDismiss,
  actions,
  className = "",
}: AlertProps) {
  const { icon: Icon, wrapperClass, iconClass, textClass } = alertConfig[type];

  const variantClass =
    variant === "banner"
      ? "w-full rounded-none border-0 border-b px-6 py-3"
      : variant === "critical"
      ? "rounded-xl border-2"
      : "rounded-xl border";

  return (
    <div
      role="alert"
      aria-live={variant === "critical" ? "assertive" : "polite"}
      className={[
        "flex gap-3 items-start",
        variantClass,
        wrapperClass,
        "p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-sm font-semibold ${textClass} leading-tight`}>{title}</p>
        )}
        {description && (
          <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{description}</p>
        )}
        {children && <div className="mt-1">{children}</div>}
        {actions && <div className="mt-3 flex gap-2">{actions}</div>}
      </div>

      {dismissible && !variant.includes("critical") && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-0.5 rounded text-text-muted hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

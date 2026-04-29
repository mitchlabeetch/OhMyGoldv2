import type { ReactNode } from "react";

export type AlertVariant = "banner" | "inline" | "critical";
export type AlertType = "success" | "warning" | "error" | "info";

export interface AlertProps {
  type: AlertType;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: ReactNode;
  className?: string;
}

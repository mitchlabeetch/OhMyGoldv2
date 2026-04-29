export type BadgeVariant = "status" | "role" | "tag" | "count";
export type BadgeStatus = "active" | "inactive" | "pending" | "expired" | "suspended";
export type BadgeRole = "super_admin" | "admin" | "coach" | "receptionist" | "member" | "visitor";

export interface BadgeProps {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  role?: BadgeRole;
  label?: string;
  count?: number;
  className?: string;
}

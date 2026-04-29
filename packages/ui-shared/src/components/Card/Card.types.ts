import type { ReactNode, HTMLAttributes } from "react";

export type CardVariant = "content" | "metric" | "profile";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: number;         // positive = up, negative = down
  trendLabel?: string;
  isLoading?: boolean;
}

export interface ProfileCardProps {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  actions?: ReactNode;
}

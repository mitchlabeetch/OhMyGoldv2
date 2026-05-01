import type { ReactNode } from "react";

export type DrawerPosition = "right" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
}

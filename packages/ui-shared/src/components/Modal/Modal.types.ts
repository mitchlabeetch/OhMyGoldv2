import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  /** Disable backdrop click to close */
  persistent?: boolean;
}

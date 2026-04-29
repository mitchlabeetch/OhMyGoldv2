import type { InputHTMLAttributes, ReactNode } from "react";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "tel"
  | "date"
  | "url";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  type?: InputType;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  /** Show password toggle (password type only) */
  showPasswordToggle?: boolean;
}

import { forwardRef } from "react";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500 focus-visible:ring-gold-400",
  secondary:
    "bg-surface-elevated text-white border border-border hover:border-border-emphasis hover:bg-surface-card focus-visible:ring-white/20",
  outline:
    "border border-gold-500 text-gold-400 hover:bg-gold-500/10 focus-visible:ring-gold-400 bg-transparent",
  ghost:
    "text-text-secondary hover:text-white hover:bg-surface-elevated focus-visible:ring-white/20 bg-transparent",
  danger:
    "bg-status-error text-white hover:bg-status-error-dark focus-visible:ring-status-error",
  success:
    "bg-status-success text-white hover:bg-status-success-dark focus-visible:ring-status-success",
  "gold-outline":
    "border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black focus-visible:ring-gold-400 bg-transparent font-bold",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-base gap-2 rounded-xl",
  xl: "h-14 px-6 text-base gap-2.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const disabled = isDisabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={isLoading}
        className={[
          "inline-flex items-center justify-center font-semibold transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "active:scale-[0.98]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";

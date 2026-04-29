import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      isLoading = false,
      showPasswordToggle = true,
      className = "",
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const autoId = useId();
    const id = providedId ?? autoId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    const hasError = Boolean(errorMessage);
    const hasSuccess = Boolean(successMessage) && !hasError;

    const borderClass = hasError
      ? "border-status-error focus:border-status-error focus:ring-status-error/20"
      : hasSuccess
      ? "border-status-success focus:border-status-success focus:ring-status-success/20"
      : "border-border focus:border-gold-500 focus:ring-gold-500/20";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && (
              <span className="text-status-error ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="absolute left-3 text-text-muted pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={resolvedType}
            disabled={disabled || isLoading}
            aria-invalid={hasError}
            aria-describedby={
              [helperText && helperId, (errorMessage || successMessage) && errorId]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={[
              "w-full rounded-xl bg-surface-card text-text-primary placeholder:text-text-muted",
              "border py-2.5 px-3.5 text-sm transition-all",
              "focus:outline-none focus:ring-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon ? "pl-10" : "",
              (rightIcon || isLoading || isPassword || hasError || hasSuccess) ? "pr-10" : "",
              borderClass,
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Right icon area */}
          <div className="absolute right-3 flex items-center gap-1" aria-hidden="true">
            {isLoading && <Loader2 className="w-4 h-4 text-text-muted animate-spin" />}
            {!isLoading && hasError && <XCircle className="w-4 h-4 text-status-error" />}
            {!isLoading && hasSuccess && <CheckCircle2 className="w-4 h-4 text-status-success" />}
            {!isLoading && isPassword && showPasswordToggle && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="text-text-muted hover:text-text-secondary transition-colors focus-visible:outline-none"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {!isLoading && rightIcon && !isPassword && !hasError && !hasSuccess && rightIcon}
          </div>
        </div>

        {(helperText || errorMessage || successMessage) && (
          <p
            id={hasError || hasSuccess ? errorId : helperId}
            className={[
              "text-xs",
              hasError ? "text-status-error" : hasSuccess ? "text-status-success" : "text-text-muted",
            ].join(" ")}
            role={hasError ? "alert" : undefined}
          >
            {errorMessage ?? successMessage ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

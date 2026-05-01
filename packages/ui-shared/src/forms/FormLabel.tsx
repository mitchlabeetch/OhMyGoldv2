import React from "react";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
}

export function FormLabel({ htmlFor, required = false, children, className = "", ...props }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-text-primary ${className}`.trim()}
      {...props}
    >
      {children}
      {required && (
        <>
          <span className="ml-0.5 text-status-error" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  );
}

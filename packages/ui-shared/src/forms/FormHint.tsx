import React from "react";

export interface FormHintProps {
  text?: string;
  id?: string;
}

export function FormHint({ text, id }: FormHintProps) {
  if (!text) return null;

  return (
    <p id={id} className="text-sm text-text-muted">
      {text}
    </p>
  );
}

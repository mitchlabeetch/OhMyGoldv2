import React from "react";

export interface SkipToContentProps {
  href?: string;
  label?: string;
}

const baseStyles: React.CSSProperties = {
  position: "absolute",
  top: "-100%",
  left: "1rem",
  zIndex: 9999,
  padding: "0.5rem 1rem",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "0 0 0.375rem 0.375rem",
  textDecoration: "none",
  transition: "top 0.2s ease",
  outline: "none",
};

const focusedStyles: React.CSSProperties = {
  ...baseStyles,
  top: "0",
};

export function SkipToContent({
  href = "#main-content",
  label = "Skip to main content",
}: SkipToContentProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <a
      href={href}
      style={focused ? focusedStyles : baseStyles}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {label}
    </a>
  );
}

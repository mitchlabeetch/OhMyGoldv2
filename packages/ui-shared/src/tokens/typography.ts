/**
 * OhMyGold Design Tokens — Typography
 * Based on Gold's Gym brand identity (see DESIGN.MD §3)
 * Primary: Inter | Mono: JetBrains Mono
 */

export const fontFamily = {
  sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

/** Font sizes in px */
export const fontSize = {
  "2xs": "10px",
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "56px",
} as const;

export const lineHeight = {
  tight: "1.15",
  snug: "1.25",
  normal: "1.4",
  relaxed: "1.6",
  loose: "1.8",
} as const;

export const letterSpacing = {
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

/** Semantic text style tokens matching DESIGN.MD §3 */
export const textStyles = {
  "display.xl": { fontSize: "56px", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-0.03em" },
  "display.lg": { fontSize: "48px", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-0.03em" },
  "heading.xl": { fontSize: "36px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-0.02em" },
  "heading.lg": { fontSize: "30px", fontWeight: "700", lineHeight: "1.25", letterSpacing: "-0.015em" },
  "heading.md": { fontSize: "24px", fontWeight: "600", lineHeight: "1.3", letterSpacing: "-0.01em" },
  "heading.sm": { fontSize: "20px", fontWeight: "600", lineHeight: "1.35" },
  "body.lg": { fontSize: "18px", fontWeight: "400", lineHeight: "1.6" },
  "body.md": { fontSize: "16px", fontWeight: "400", lineHeight: "1.5" },
  "body.sm": { fontSize: "14px", fontWeight: "400", lineHeight: "1.5" },
  "body.xs": { fontSize: "12px", fontWeight: "500", lineHeight: "1.4", letterSpacing: "0.01em" },
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
} as const;

export type Typography = typeof typography;

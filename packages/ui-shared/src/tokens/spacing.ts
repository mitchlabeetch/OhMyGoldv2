/**
 * OhMyGold Design Tokens — Spacing
 * Base unit: 4px
 * (see DESIGN.MD §4)
 */

/** Spacing values in px (base 4px unit) */
export const spacing = {
  px: "1px",
  0: "0px",
  0.5: "2px",
  1: "4px",   // xs
  2: "8px",   // sm
  3: "12px",  // md
  4: "16px",  // base
  5: "20px",
  6: "24px",  // lg
  7: "28px",
  8: "32px",  // xl
  10: "40px",
  12: "48px", // 2xl
  14: "56px",
  16: "64px", // 3xl
  20: "80px",
  24: "96px", // 4xl
  32: "128px",
} as const;

/** Named semantic spacing tokens */
export const spacingTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 96,
} as const;

/** Border radius */
export const borderRadius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

export type Spacing = typeof spacing;
export type SpacingTokens = typeof spacingTokens;

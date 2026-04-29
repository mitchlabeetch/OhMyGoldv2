/**
 * OhMyGold Design Tokens — Shadows
 * Web: CSS box-shadow | Mobile: elevation (flat color adjustments)
 */

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(0, 0, 0, 0.3)",
  sm: "0 2px 4px rgba(0, 0, 0, 0.2)",
  card: "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
  elevated: "0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)",
  modal: "0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)",
  "gold-glow": "0 0 20px rgba(255, 236, 0, 0.15), 0 0 40px rgba(255, 236, 0, 0.08)",
  "gold-glow-lg": "0 0 40px rgba(255, 236, 0, 0.25), 0 0 80px rgba(255, 236, 0, 0.1)",
} as const;

/** React Native elevation levels (Android) */
export const elevation = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  modal: 16,
} as const;

export type Shadow = keyof typeof shadows;

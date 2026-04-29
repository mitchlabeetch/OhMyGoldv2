/**
 * OhMyGold Design Tokens — Animations
 * Duration in ms | Easing cubic-bezier strings
 */

export const duration = {
  instant: 0,
  fast: 100,
  normal: 200,
  medium: 300,
  slow: 400,
  deliberate: 600,
} as const;

export const easing = {
  /** Standard — enters and exits at equal speed */
  standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  /** Decelerate — elements enter from off-screen */
  decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  /** Accelerate — elements exit to off-screen */
  accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
  /** Bounce — playful elements */
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Spring — elastic feel */
  spring: "cubic-bezier(0.5, 1.8, 0.5, 0.8)",
  /** Linear */
  linear: "linear",
} as const;

/** Reduced motion alternatives */
export const reducedMotion = {
  duration: 0,
  easing: "linear",
} as const;

export const animations = {
  duration,
  easing,
  reducedMotion,
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;

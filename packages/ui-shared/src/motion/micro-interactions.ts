import type { MotionProps, Variants } from "framer-motion";

export const buttonPressProps: Pick<MotionProps, "whileTap"> = {
  whileTap: { scale: 0.97 },
};

export const hoverLiftProps: Pick<MotionProps, "whileHover"> = {
  whileHover: { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" },
};

export const checkmarkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const pulseVariants: Variants = {
  rest: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shakeVariants: Variants = {
  rest: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

/**
 * Returns motion props appropriate for the user's motion preference.
 * When `reducedMotion` is true, all animation props are stripped.
 */
export function getMotionProps(reducedMotion: boolean): Partial<MotionProps> {
  if (reducedMotion) return {};
  return {
    ...buttonPressProps,
    ...hoverLiftProps,
  };
}

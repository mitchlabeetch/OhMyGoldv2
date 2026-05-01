import type { Transition } from "framer-motion";

export const fadeTransition: Transition = {
  type: "tween",
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const slideTransition: Transition = {
  type: "tween",
  duration: 0.3,
  ease: [0.0, 0.0, 0.2, 1],
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const quickTransition: Transition = {
  type: "tween",
  duration: 0.1,
};

/** Zero-duration transition for users who prefer reduced motion */
export const reducedTransition: Transition = {
  type: "tween",
  duration: 0,
};

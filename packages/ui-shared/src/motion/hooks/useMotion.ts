import type { Transition, Variants } from "framer-motion";
import { useReducedMotion } from "../../a11y/ReducedMotion";
import {
  fadeTransition,
  slideTransition,
  springTransition,
  quickTransition,
  reducedTransition,
} from "../transitions";
import {
  fadeVariants,
  slideUpVariants,
  slideRightVariants,
  scaleVariants,
  modalVariants,
  toastVariants,
} from "../variants";

type TransitionPreset = "fade" | "slide" | "spring" | "quick";
type VariantPreset = "fade" | "slideUp" | "slideRight" | "scale" | "modal" | "toast";

const transitionMap: Record<TransitionPreset, Transition> = {
  fade: fadeTransition,
  slide: slideTransition,
  spring: springTransition,
  quick: quickTransition,
};

const variantMap: Record<VariantPreset, Variants> = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  modal: modalVariants,
  toast: toastVariants,
};

export interface UseMotionResult {
  reducedMotion: boolean;
  getTransition: (preset: TransitionPreset) => Transition;
  getVariants: (preset: VariantPreset) => Variants;
}

export function useMotion(): UseMotionResult {
  const reducedMotion = useReducedMotion();

  function getTransition(preset: TransitionPreset): Transition {
    if (reducedMotion) return reducedTransition;
    return transitionMap[preset];
  }

  function getVariants(preset: VariantPreset): Variants {
    if (reducedMotion) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 1 },
      };
    }
    return variantMap[preset];
  }

  return { reducedMotion, getTransition, getVariants };
}

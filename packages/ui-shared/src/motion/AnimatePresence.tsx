import React from "react";
import {
  AnimatePresence as FramerAnimatePresence,
  type AnimatePresenceProps,
} from "framer-motion";
import { useReducedMotion } from "../a11y/ReducedMotion";

export interface AccessibleAnimatePresenceProps extends AnimatePresenceProps {
  /** Override the reduced-motion detection. Pass `true` to skip all animations. */
  reducedMotion?: boolean;
}

export function AnimatePresence({
  reducedMotion: reducedMotionOverride,
  children,
  ...props
}: AccessibleAnimatePresenceProps) {
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotionOverride ?? systemReducedMotion;

  return (
    <FramerAnimatePresence
      {...props}
      // When reduced motion is active, children exit immediately
      mode={shouldReduceMotion ? "sync" : props.mode}
      custom={shouldReduceMotion ? { duration: 0 } : props.custom}
    >
      {children}
    </FramerAnimatePresence>
  );
}

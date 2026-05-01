import React, { createContext, useContext, useEffect, useState } from "react";

export const ReducedMotionContext = createContext<boolean>(false);

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

export interface ReducedMotionProps {
  children: ((reducedMotion: boolean) => React.ReactNode) | React.ReactNode;
}

export function ReducedMotion({ children }: ReducedMotionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      {typeof children === "function" ? children(reducedMotion) : children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext(): boolean {
  return useContext(ReducedMotionContext);
}

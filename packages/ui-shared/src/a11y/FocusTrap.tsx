import React, { useRef, useEffect } from "react";

const FOCUSABLE_SELECTORS =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapProps {
  children: React.ReactNode;
  isActive?: boolean;
  restoreFocus?: boolean;
}

export function FocusTrap({
  children,
  isActive = true,
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive) return;

    previousFocusRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusableElements[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const elements = container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      const focusable = Array.from(elements);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, restoreFocus]);

  return <div ref={containerRef}>{children}</div>;
}

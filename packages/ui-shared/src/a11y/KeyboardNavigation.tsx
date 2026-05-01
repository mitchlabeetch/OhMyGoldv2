import { useState, useCallback, KeyboardEvent } from "react";

export type NavigationOrientation = "horizontal" | "vertical" | "grid";

export interface KeyboardNavigationOptions<T> {
  items: T[];
  orientation?: NavigationOrientation;
  loop?: boolean;
  onSelect?: (item: T, index: number) => void;
}

export interface ItemProps {
  onKeyDown: (event: KeyboardEvent) => void;
  tabIndex: number;
  "aria-selected": boolean;
}

export interface KeyboardNavigationResult<T> {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  getItemProps: (index: number) => ItemProps;
}

export function useKeyboardNavigation<T>({
  items,
  orientation = "vertical",
  loop = true,
  onSelect,
}: KeyboardNavigationOptions<T>): KeyboardNavigationResult<T> {
  const [activeIndex, setActiveIndex] = useState(0);

  const movePrev = useCallback(
    (current: number): number => {
      if (current <= 0) return loop ? items.length - 1 : 0;
      return current - 1;
    },
    [items.length, loop]
  );

  const moveNext = useCallback(
    (current: number): number => {
      if (current >= items.length - 1) return loop ? 0 : items.length - 1;
      return current + 1;
    },
    [items.length, loop]
  );

  const getItemProps = useCallback(
    (index: number): ItemProps => ({
      tabIndex: index === activeIndex ? 0 : -1,
      "aria-selected": index === activeIndex,
      onKeyDown: (event: KeyboardEvent) => {
        let nextIndex: number | null = null;

        switch (event.key) {
          case "ArrowUp":
            if (orientation === "vertical" || orientation === "grid") {
              event.preventDefault();
              nextIndex = movePrev(index);
            }
            break;
          case "ArrowDown":
            if (orientation === "vertical" || orientation === "grid") {
              event.preventDefault();
              nextIndex = moveNext(index);
            }
            break;
          case "ArrowLeft":
            if (orientation === "horizontal" || orientation === "grid") {
              event.preventDefault();
              nextIndex = movePrev(index);
            }
            break;
          case "ArrowRight":
            if (orientation === "horizontal" || orientation === "grid") {
              event.preventDefault();
              nextIndex = moveNext(index);
            }
            break;
          case "Home":
            event.preventDefault();
            nextIndex = 0;
            break;
          case "End":
            event.preventDefault();
            nextIndex = items.length - 1;
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            onSelect?.(items[index], index);
            break;
          default:
            break;
        }

        if (nextIndex !== null) {
          setActiveIndex(nextIndex);
          onSelect?.(items[nextIndex], nextIndex);
        }
      },
    }),
    [activeIndex, items, movePrev, moveNext, onSelect, orientation]
  );

  return { activeIndex, setActiveIndex, getItemProps };
}

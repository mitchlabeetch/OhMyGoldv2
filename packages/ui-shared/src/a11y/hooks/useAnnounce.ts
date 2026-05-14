import { useCallback } from "react";
import { ScreenReaderAnnouncer } from "../ScreenReaderAnnouncer";

type Politeness = "polite" | "assertive";

export function useAnnounce(): (message: string, politeness?: Politeness) => void {
  return useCallback((message: string, politeness: Politeness = "polite") => {
    ScreenReaderAnnouncer.announce(message, politeness);
  }, []);
}

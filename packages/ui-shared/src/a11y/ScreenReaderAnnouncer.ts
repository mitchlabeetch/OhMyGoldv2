type Politeness = "polite" | "assertive";

const DEBOUNCE_MS = 150;

class ScreenReaderAnnouncerClass {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  private debounceTimers: Map<Politeness, ReturnType<typeof setTimeout>> = new Map();

  private ensureRegion(politeness: Politeness): HTMLElement {
    const existing = politeness === "polite" ? this.politeRegion : this.assertiveRegion;
    if (existing) return existing;

    const region = document.createElement("div");
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.setAttribute("role", politeness === "assertive" ? "alert" : "status");
    Object.assign(region.style, {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: "0",
    });

    document.body.appendChild(region);

    if (politeness === "polite") {
      this.politeRegion = region;
    } else {
      this.assertiveRegion = region;
    }

    return region;
  }

  announce(message: string, politeness: Politeness = "polite"): void {
    if (typeof document === "undefined") return;

    const existing = this.debounceTimers.get(politeness);
    if (existing !== undefined) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      const region = this.ensureRegion(politeness);
      // Clear then set to ensure re-announcement of same message
      region.textContent = "";
      requestAnimationFrame(() => {
        region.textContent = message;
      });
      this.debounceTimers.delete(politeness);
    }, DEBOUNCE_MS);

    this.debounceTimers.set(politeness, timer);
  }

  clear(): void {
    if (this.politeRegion) this.politeRegion.textContent = "";
    if (this.assertiveRegion) this.assertiveRegion.textContent = "";

    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}

export const ScreenReaderAnnouncer = new ScreenReaderAnnouncerClass();

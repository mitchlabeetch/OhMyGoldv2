import React from "react";

export interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
}

export function LiveRegion({
  children,
  politeness = "polite",
  atomic = false,
}: LiveRegionProps) {
  const role = politeness === "assertive" ? "alert" : "status";

  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic={atomic}
    >
      {children}
    </div>
  );
}

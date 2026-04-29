import { useState } from "react";
import type { AvatarProps, AvatarSize, AvatarShape, AvatarStatus } from "./Avatar.types";

const sizeMap: Record<AvatarSize, { wrapper: string; text: string; status: string }> = {
  xs: { wrapper: "w-6 h-6", text: "text-[10px]", status: "w-2 h-2 -bottom-0.5 -right-0.5" },
  sm: { wrapper: "w-8 h-8", text: "text-xs", status: "w-2.5 h-2.5 -bottom-0.5 -right-0.5" },
  md: { wrapper: "w-12 h-12", text: "text-sm", status: "w-3 h-3 -bottom-0.5 -right-0.5" },
  lg: { wrapper: "w-16 h-16", text: "text-base", status: "w-3.5 h-3.5 bottom-0 right-0" },
  xl: { wrapper: "w-[120px] h-[120px]", text: "text-3xl", status: "w-5 h-5 bottom-1 right-1" },
};

const shapeMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: "bg-status-success",
  away: "bg-status-warning",
  offline: "bg-neutral-500",
};

export function Avatar({
  src,
  alt,
  firstName = "",
  lastName = "",
  size = "md",
  shape = "circle",
  status,
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const { wrapper, text, status: statusSize } = sizeMap[size];
  const shapeClass = shapeMap[shape];

  return (
    <div className={`relative inline-block ${className}`} aria-label={alt ?? `${firstName} ${lastName}`}>
      <div
        className={[
          wrapper,
          shapeClass,
          "overflow-hidden flex items-center justify-center",
          "bg-gold-500/20 border border-gold-500/30",
          "select-none",
        ].join(" ")}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt ?? `${firstName} ${lastName}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={`${text} font-bold text-gold-400`} aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      {status && (
        <span
          className={[
            "absolute rounded-full border-2 border-surface-card",
            statusColorMap[status],
            statusSize,
          ].join(" ")}
          aria-label={status === "online" ? "En ligne" : status === "away" ? "Absent" : "Hors ligne"}
        />
      )}
    </div>
  );
}

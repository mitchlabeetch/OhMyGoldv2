interface SkeletonProps {
  className?: string;
}
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={["bg-surface-elevated animate-pulse rounded-lg", className].join(" ")}
      aria-hidden="true"
    />
  );
}
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}
export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={[
        "bg-surface-card border-border animate-pulse rounded-2xl border p-5",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mb-2 h-3.5 w-full" />
      <Skeleton className="mb-2 h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-4/6" />
    </div>
  );
}
export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return <Skeleton className={`${sizeMap[size]} rounded-full`} aria-hidden="true" />;
}

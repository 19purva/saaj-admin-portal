import { Skeleton } from "@/components/ui/Skeleton";

export function SkeletonStatCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-card"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between p-5">
        <div className="space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-11 w-11 rounded-[10px]" />
      </div>
      <div className="px-5 py-4 border-t border-border">
        <Skeleton className="h-3.5 w-20" />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  title?: boolean;
}

export function SkeletonTable({ rows = 6, columns = 5, title = true }: SkeletonTableProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3.5 w-20" />
        </CardHeader>
      )}
      <CardContent className="p-0 sm:p-0">
        <div className="divide-y divide-border">
          {/* Header row */}
          <div className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-3 flex-1" />
            ))}
          </div>
          {/* Data rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="flex flex-1 items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              {Array.from({ length: columns - 1 }).map((_, j) => (
                <Skeleton key={j} className="h-3.5 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

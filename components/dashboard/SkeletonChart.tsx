import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SkeletonChartProps {
  className?: string;
  variant?: "bar" | "donut";
}

function BarSkeleton() {
  const groups = [
    [62, 78],
    [48, 68],
    [75, 88],
    [58, 52],
    [82, 92],
    [52, 72],
  ];
  return (
    <div className="flex gap-3 h-72 mt-auto">
      {/* Y-axis */}
      <div className="flex flex-col justify-between pb-8 shrink-0 pl-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-7" />
        ))}
      </div>

      {/* Chart area */}
      <div className="flex flex-1 flex-col">
        {/* Bars */}
        <div className="flex flex-1 items-end justify-between gap-0">
          {groups.map((pair, i) => (
            <div key={i} className="flex h-full flex-1 items-end justify-center gap-1.5">
              {pair.map((h, j) => (
                <Skeleton
                  key={j}
                  className="w-9 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* X-axis */}
        <div className="flex justify-between gap-2 pt-3 pb-6">
          {groups.map((_, i) => (
            <div key={i} className="flex flex-1 justify-center">
              <Skeleton className="h-2.5 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutSkeleton() {
  return (
    <>
      <div className="flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <Skeleton className="h-[180px] w-[180px] rounded-full" />
          <div className="absolute h-[90px] w-[90px] rounded-full bg-card" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
            <Skeleton className="h-2.5 flex-1" />
          </div>
        ))}
      </div>
    </>
  );
}

export function SkeletonChart({ className, variant = "bar" }: SkeletonChartProps) {
  return (
    <Card className={cn("p-0", className)}>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </CardHeader>
      <CardContent className="pl-8 pr-6 pt-0 pb-0 sm:pb-0 flex flex-col justify-end">
        {variant === "donut" ? <DonutSkeleton /> : <BarSkeleton />}
      </CardContent>
    </Card>
  );
}

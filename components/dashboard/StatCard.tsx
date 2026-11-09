import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: number;
  trendValue?: string;
  trendLabel?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendValue,
  trendLabel = "vs last period",
  href,
  className,
}: StatCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-card",
        className,
      )}
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Main content */}
      <div className="flex items-start justify-between p-5">
        <div className="space-y-2">
          <p className="text-sm text-muted">
            {label}
          </p>
          <p className="font-heading text-2xl font-medium tabular-nums text-foreground">
            {value}
          </p>
          {trendValue && (
            <p className="text-xs">
              <span
                className={cn(
                  "font-medium",
                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400",
                )}
              >
                {isPositive ? "+" : ""}
                {trendValue}
              </span>
              <span className="text-muted"> {trendLabel}</span>
            </p>
          )}
        </div>

        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
          {icon}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t-[0.5px] border-border">
        <Link
          href={href ?? "#"}
          className="flex items-center justify-between text-sm text-muted transition-colors hover:text-foreground"
        >
          View Details
          <ArrowRight size={20} weight="regular" />
        </Link>
      </div>
    </div>
  );
}

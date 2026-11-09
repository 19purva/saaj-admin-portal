import { cn } from "@/lib/utils";

type ProgressColor = "auto" | "indigo" | "green" | "amber" | "red" | "blue" | "neutral";
type ProgressSize = "sm" | "md";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: ProgressColor;
  variant?: string;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  className?: string;
}

function getAutoColor(pct: number) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

const colorClasses: Record<ProgressColor, string> = {
  auto: "",
  indigo: "bg-indigo-600",
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
};

const variantToColor: Record<string, ProgressColor> = {
  success: "green",
  warning: "amber",
  error: "red",
  default: "indigo",
  info: "blue",
};

export function ProgressBar({
  value,
  max = 100,
  color,
  variant,
  size = "md",
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const resolvedColor: ProgressColor = color ?? (variant ? (variantToColor[variant] ?? "indigo") : "indigo");
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = resolvedColor === "auto" ? getAutoColor(percentage) : colorClasses[resolvedColor];

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showValue && (
            <span className="tabular-nums font-medium text-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full border-[0.5px] border-border bg-surface",
          sizeClasses[size],
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

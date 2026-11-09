import { cn } from "@/lib/utils";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700",
        className,
      )}
      style={style}
    />
  );
}

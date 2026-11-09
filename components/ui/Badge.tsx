import { cn } from "@/lib/utils";

type BadgeVariant =
  | "red"
  | "amber"
  | "green"
  | "emerald"
  | "blue"
  | "indigo"
  | "violet"
  | "neutral"
  | "error"
  | "success"
  | "warning"
  | "default"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  red: "border-red-200 dark:border-red-400/30 bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-400",
  amber: "border-amber-200 dark:border-amber-400/30 bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400",
  green: "border-green-200 dark:border-green-400/30 bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-400",
  emerald: "border-emerald-200 dark:border-emerald-400/30 bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400",
  blue: "border-blue-200 dark:border-blue-400/30 bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-400",
  indigo: "border-indigo-200 dark:border-indigo-400/30 bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-400",
  violet: "border-violet-200 dark:border-violet-400/30 bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-400",
  neutral: "border-border bg-surface text-muted",
  // aliases
  error: "border-red-200 dark:border-red-400/30 bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-400",
  success: "border-green-200 dark:border-green-400/30 bg-green-100 text-green-700 dark:bg-green-400/15 dark:text-green-400",
  warning: "border-amber-200 dark:border-amber-400/30 bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400",
  default: "border-border bg-surface text-muted",
  info: "border-blue-200 dark:border-blue-400/30 bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-400",
};

const dotStyles: Record<BadgeVariant, string> = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-600",
  violet: "bg-violet-500",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
  error: "bg-red-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  default: "bg-neutral-500 dark:bg-neutral-400",
  info: "bg-blue-500",
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-[0.5px] font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}

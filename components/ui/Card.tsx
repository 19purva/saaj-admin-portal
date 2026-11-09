import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, style, ...props }: CardProps & { style?: React.CSSProperties }) {
  return (
    <div
      className={cn("flex h-[76px] items-center justify-between px-5", className)}
      style={{ borderBottom: "0.5px solid var(--border)", ...style }}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        "font-heading text-base font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-border p-4 sm:p-6",
        className
      )}
      {...props}
    />
  );
}

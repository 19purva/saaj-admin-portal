import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableSectionProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}
interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, style, ...props }: TableSectionProps & { style?: React.CSSProperties }) {
  return (
    <thead
      className={cn("bg-neutral-50 dark:bg-neutral-900", className)}
      style={{ borderBottom: "0.5px solid var(--border)", ...style }}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: TableSectionProps) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, style, ...props }: TableRowProps & { style?: React.CSSProperties }) {
  return (
    <tr
      className={cn("border-b-[0.5px] border-border transition-colors hover:bg-surface/50", className)}
      style={style}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-5 text-left align-middle text-xs font-medium text-neutral-400 dark:text-neutral-500",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn("px-5 py-3 align-middle text-sm", className)}
      {...props}
    />
  );
}

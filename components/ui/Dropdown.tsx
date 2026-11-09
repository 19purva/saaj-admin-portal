"use client";

import { useState, useRef } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useClickOutside } from "@/hooks";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  icon,
  size = "md",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size={size}
        onClick={() => setOpen(!open)}
        leftIcon={icon ?? undefined}
        rightIcon={
          <CaretDown
            size={14}
            weight="bold"
            className={cn("transition-transform duration-200", open && "rotate-180")}
          />
        }
        className={className}
      >
        {selected?.label}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg">
          <div className="space-y-0.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  opt.value === value
                    ? "bg-surface font-medium text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const dateRangeOptions: DropdownOption[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
];

export const yearOptions: DropdownOption[] = [
  { label: "This Year", value: "this_year" },
  { label: "Last Year", value: "last_year" },
];

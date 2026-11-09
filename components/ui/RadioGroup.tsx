"use client";

import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name?: string;
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      <div className="space-y-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                checked
                  ? "border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600/40 hover:bg-surface"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  checked
                    ? "border-indigo-600"
                    : "border-neutral-400 dark:border-neutral-500"
                )}
              >
                {checked && (
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                )}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {option.label}
                </p>
                {option.description && (
                  <p className="mt-0.5 text-xs text-muted">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { forwardRef } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, optional, required, icon, options, placeholder, className, id, ...props },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="ml-0.5 text-red-500 dark:text-red-400">*</span>}
            {optional && (
              <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
            )}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-lg border bg-card py-2.5 pr-9 text-sm text-foreground transition-shadow cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
              icon ? "pl-9" : "pl-3",
              error
                ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                : "border-border focus:border-border",
              !props.value && placeholder && "text-neutral-400",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDown
            size={20}
            weight="bold"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

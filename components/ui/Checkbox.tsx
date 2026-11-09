"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, children, className, checked, ...props }, ref) => {
    return (
      <label className="inline-flex cursor-pointer items-start gap-2.5">
        <div className="relative mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
              "border-border bg-card",
              "peer-checked:border-indigo-600 peer-checked:bg-indigo-600",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-600 peer-focus-visible:ring-offset-2",
              className,
            )}
          >
            <Check
              size={12}
              weight="bold"
              className={cn(
                "text-white transition-opacity",
                checked ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </div>
        {(label || description || children) && (
          <div>
            {children ?? (
              <>
                {label && (
                  <span className="text-sm font-medium text-foreground">{label}</span>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-muted">{description}</p>
                )}
              </>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

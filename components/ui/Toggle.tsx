"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled?: boolean;
  checked?: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  align?: "left" | "right";
  className?: string;
}

export function Toggle({
  enabled,
  checked,
  onChange,
  label,
  description,
  disabled,
  align = "left",
  className,
}: ToggleProps) {
  const isEnabled = enabled ?? checked ?? false;

  const switchButton = (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      disabled={disabled}
      onClick={() => onChange(!isEnabled)}
      className={cn(
        "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
        isEnabled ? "bg-indigo-600" : "bg-neutral-200 dark:bg-neutral-700",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out",
          isEnabled ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );

  const labelBlock = (label || description) ? (
    <div className={align === "right" ? "flex-1" : undefined}>
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      {description && (
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      )}
    </div>
  ) : null;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      {align === "right" ? (
        <>{labelBlock}{switchButton}</>
      ) : (
        <>{switchButton}{labelBlock}</>
      )}
    </div>
  );
}

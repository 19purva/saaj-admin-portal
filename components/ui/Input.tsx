"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  prefix?: string;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      required,
      optional,
      prefix,
      icon,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="ml-0.5 text-red-500 dark:text-red-400">*</span>}
            {optional && (
              <span className="ml-1 font-normal text-muted">(optional)</span>
            )}
          </label>
        )}
        <div className="relative">
          {(icon ?? leftIcon) && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon ?? leftIcon}
            </span>
          )}
          {prefix && !leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-neutral-400 transition-shadow focus:outline-none",
              error
                ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--expense)]"
                : "border-border focus:border-border ring-2 ring-transparent focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-card",
              (icon ?? leftIcon ?? prefix) && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

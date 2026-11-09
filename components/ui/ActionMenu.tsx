"use client";

import { useState, useRef, ReactNode } from "react";
import Link from "next/link";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useClickOutside } from "@/hooks";
import { cn } from "@/lib/utils";

interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  className?: string;
}

export function ActionMenu({ items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => setOpen(false));

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 200 ? "top" : "bottom");
    }
    setOpen((v) => !v);
  };

  const itemClass = (variant?: "default" | "danger") =>
    cn(
      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors",
      variant === "danger"
        ? "text-red-500 dark:text-red-400 hover:bg-red-500/10"
        : "text-muted hover:bg-surface hover:text-foreground",
    );

  const itemContent = (item: ActionMenuItem) => (
    <>
      {item.icon && (
        <span className={cn(item.variant === "danger" ? "text-red-500 dark:text-red-400" : "text-muted")}>
          {item.icon}
        </span>
      )}
      {item.label}
    </>
  );

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
      >
        <DotsThreeVertical size={20} weight="bold" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg",
            position === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
          )}
        >
          <div className="space-y-0.5">
            {items.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={itemClass(item.variant)}
                >
                  {itemContent(item)}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={itemClass(item.variant)}
                >
                  {itemContent(item)}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

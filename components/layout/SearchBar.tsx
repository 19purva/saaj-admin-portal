"use client";

import { useEffect } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onOpen: () => void;
  className?: string;
}

export function SearchBar({ onOpen, className }: SearchBarProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);

  return (
    <>
      {/* Mobile: icon only */}
      <button
        onClick={onOpen}
        aria-label="Search"
        className={cn(
          "rounded-lg p-2.5 text-muted transition-colors hover:bg-surface hover:text-foreground md:hidden",
          className
        )}
      >
        <MagnifyingGlass size={20} weight="regular" />
      </button>

      {/* Desktop: full search bar */}
      <button
        onClick={onOpen}
        className={cn(
          "hidden h-10 w-64 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm transition-colors hover:border-indigo-600 md:flex lg:w-80",
          className
        )}
      >
        <MagnifyingGlass
          size={20}
          weight="regular"
          className="shrink-0 text-neutral-400"
        />
        <span className="flex-1 text-left text-neutral-400">
          Search...
        </span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted lg:flex">
          <span>⌘</span>K
        </kbd>
      </button>
    </>
  );
}

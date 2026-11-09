"use client";

import { Moon, Sun, List } from "@phosphor-icons/react";
import { IconButton } from "@/components/ui";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { useHeader } from "./HeaderContext";

export function Header({ className }: { className?: string }) {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const { config } = useHeader();
  const { theme, setTheme } = useTheme();

  return (
    <header className={cn("flex h-20 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-8", className)}>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface lg:hidden"
        style={{ touchAction: "manipulation" }}
      >
        <List size={22} weight="regular" />
      </button>

      <span className="font-heading text-2xl font-semibold text-foreground">{config.title ?? "Dashboard"}</span>

      <div className="flex-1" />

      <IconButton
        size="xl"
        className="rounded-full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        icon={
          <>
            <Sun size={20} weight="regular" className="hidden dark:block" />
            <Moon size={20} weight="regular" className="block dark:hidden" />
          </>
        }
      />
    </header>
  );
}

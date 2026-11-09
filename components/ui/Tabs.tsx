"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type TabsVariant = "pill" | "underline";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within <Tabs>");
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = "pill",
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;
  const setActiveTab = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn("space-y-1", className)} {...props} />
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps) {
  const { variant } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden",
        variant === "pill"
          ? "w-fit gap-1 rounded-lg bg-surface p-1"
          : "gap-0 border-b border-border",
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium transition-colors whitespace-nowrap",
        variant === "pill"
          ? cn(
              "rounded-md px-3 py-1.5",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            )
          : cn(
              "border-b-2 px-4 py-2.5 -mb-px",
              isActive
                ? "border-indigo-500 text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            ),
        className
      )}
      {...props}
    />
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  ...props
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return <div role="tabpanel" className={cn(className)} {...props} />;
}

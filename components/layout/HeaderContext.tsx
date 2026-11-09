"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface HeaderConfig {
  title?: string;
  description?: string;
  backHref?: string;
  breadcrumbLabel?: string;
  actions?: React.ReactNode;
}

interface HeaderContextValue {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
  resetConfig: () => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<HeaderConfig>({});

  const setConfig = useCallback((cfg: HeaderConfig) => {
    setConfigState(cfg);
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState({});
  }, []);

  return (
    <HeaderContext.Provider value={{ config, setConfig, resetConfig }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader(): HeaderContextValue {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within HeaderProvider");
  return ctx;
}

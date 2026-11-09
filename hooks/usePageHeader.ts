"use client";

import { useEffect } from "react";
import { useHeader, type HeaderConfig } from "@/components/layout/HeaderContext";

export function usePageHeader(config: HeaderConfig) {
  const { setConfig, resetConfig } = useHeader();

  useEffect(() => {
    setConfig(config);
    return () => resetConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

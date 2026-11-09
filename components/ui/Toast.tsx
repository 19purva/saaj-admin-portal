"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRefs.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRefs.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      duration = 4000
    ) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timerRefs.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const iconMap: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle size={20} weight="fill" className="text-green-600 dark:text-green-400" />,
    error: <XCircle size={20} weight="fill" className="text-red-500 dark:text-red-400" />,
    info: <CheckCircle size={20} weight="fill" className="text-blue-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg"
      )}
    >
      <span className="shrink-0 mt-0.5">
        {iconMap[item.variant ?? "info"]}
      </span>
      <p className="flex-1 text-sm text-foreground">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 text-neutral-400 dark:text-neutral-500 hover:text-foreground"
      >
        <X size={20} weight="bold" />
      </button>
    </motion.div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

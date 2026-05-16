import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { Toast, ToastContextValue, ToastType } from "./Toast.types";

const ToastContext = createContext<ToastContextValue | null>(null);

const defaultDuration: Record<ToastType, number> = {
  success: 4000,
  warning: 6000,
  error: 0,    // persistent — user must dismiss
  info: 4000,
};

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle2; className: string; iconClass: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-status-success/30 bg-status-success/5",
    iconClass: "text-status-success",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-status-warning/30 bg-status-warning/5",
    iconClass: "text-status-warning",
  },
  error: {
    icon: XCircle,
    className: "border-status-error/30 bg-status-error/5",
    iconClass: "text-status-error",
  },
  info: {
    icon: Info,
    className: "border-status-info/30 bg-status-info/5",
    iconClass: "text-status-info",
  },
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const { icon: Icon, className, iconClass } = toastConfig[t.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = t.duration ?? defaultDuration[t.type];

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(t.id), duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={[
        "w-80 max-w-full bg-surface-card border rounded-xl shadow-elevated p-4",
        "flex gap-3 items-start",
        className,
      ].join(" ")}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{t.title}</p>
        {t.description && (
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{t.description}</p>
        )}
        {t.action && (
          <button
            onClick={() => { t.action!.onClick(); onDismiss(t.id); }}
            className="mt-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 p-0.5 rounded text-text-muted hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback((data: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => {
      const next = [...prev, { ...data, id }];
      // Max 3 visible
      return next.slice(-3);
    });
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-[60] flex flex-col gap-2"
          aria-label="Notifications"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      ) as unknown as ReactNode}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

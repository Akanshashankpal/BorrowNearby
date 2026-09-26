import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/store/ToastProvider";

export function ToastViewport() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:bottom-auto sm:top-20 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3 text-left text-sm font-semibold shadow-card sm:w-80 ${
              toast.tone === "error"
                ? "bg-danger text-white"
                : toast.tone === "success"
                  ? "bg-brand text-white"
                  : "bg-surface text-ink"
            }`}
          >
            {toast.title}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

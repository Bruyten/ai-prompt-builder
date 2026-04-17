import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "../../stores/toastStore";
import { cn } from "../../utils/cn";

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon =
          t.variant === "success"
            ? CheckCircle2
            : t.variant === "error"
              ? AlertCircle
              : Info;
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border px-4 py-3 shadow-lg",
              "bg-white text-slate-900 border-slate-200",
              "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
              t.variant === "success" && "border-emerald-300 dark:border-emerald-700",
              t.variant === "error" && "border-red-300 dark:border-red-700",
            )}
            role="status"
          >
            <Icon
              className={cn(
                "size-5 shrink-0",
                t.variant === "success" && "text-emerald-500",
                t.variant === "error" && "text-red-500",
                t.variant === "info" && "text-brand-500",
              )}
            />
            <p className="text-sm leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

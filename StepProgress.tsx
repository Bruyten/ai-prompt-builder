import { cn } from "../../utils/cn";

interface Props {
  current: number; // 0-indexed
  total: number;
  labels?: string[];
}

export function StepProgress({ current, total, labels }: Props) {
  const pct = total === 0 ? 0 : ((current + 1) / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Step {current + 1} of {total}
        </span>
        <span className="tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {labels && (
        <div className="hidden gap-1 text-[11px] text-slate-500 sm:flex">
          {labels.map((label, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 truncate rounded-md px-2 py-1 text-center",
                i === current
                  ? "bg-brand-100 text-brand-700 font-medium dark:bg-brand-500/15 dark:text-brand-300"
                  : i < current
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-slate-400 dark:text-slate-600",
              )}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

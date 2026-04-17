import { cn } from "../../utils/cn";

interface Props {
  score: number; // 0-100
  label?: string;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function colorFor(score: number): { bar: string; text: string; label: string } {
  if (score >= 80) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      label: "Excellent",
    };
  }
  if (score >= 60) {
    return {
      bar: "bg-brand-500",
      text: "text-brand-600 dark:text-brand-400",
      label: "Good",
    };
  }
  if (score >= 40) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      label: "Fair",
    };
  }
  return {
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    label: "Needs work",
  };
}

export function ScoreBar({
  score,
  label,
  showNumber = true,
  size = "md",
  className,
}: Props) {
  const c = colorFor(score);
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  return (
    <div className={cn("w-full", className)}>
      {(label || showNumber) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            {label ?? "Quality"}
          </span>
          {showNumber && (
            <span className={cn("font-semibold tabular-nums", c.text)}>
              {Math.round(score)} · {c.label}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
          heights[size],
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", c.bar)}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

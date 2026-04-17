import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors",
        "border-slate-300 text-slate-900",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
        "dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100",
        invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});

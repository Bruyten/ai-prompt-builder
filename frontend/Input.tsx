import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors",
        "border-slate-300 placeholder:text-slate-400 text-slate-900",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
        "dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className,
      )}
      {...rest}
    />
  );
});

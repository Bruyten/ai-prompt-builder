import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-900/20 disabled:bg-brand-600/50",
  secondary:
    "bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
  outline:
    "bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-900/20",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-70",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
});

import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  help?: ReactNode;
}

export function Label({ className, children, required, help, ...rest }: Props) {
  return (
    <div className="space-y-1">
      <label
        className={cn(
          "block text-sm font-medium text-slate-800 dark:text-slate-200",
          className,
        )}
        {...rest}
      >
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {help && <p className="text-xs text-slate-500 dark:text-slate-400">{help}</p>}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Container({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 py-8", className)}
      {...rest}
    />
  );
}

export function NarrowContainer({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-3xl px-4 sm:px-6 py-8", className)}
      {...rest}
    />
  );
}

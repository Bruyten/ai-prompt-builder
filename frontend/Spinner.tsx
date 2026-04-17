import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-brand-500", className)} />;
}

export function PageSpinner() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

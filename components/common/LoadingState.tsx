/**
 * Loading indicator used during async operations.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Analysing…",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
    >
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

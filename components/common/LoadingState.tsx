/**
 * Loading indicator used during async operations.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  message?: string;
  subMessage?: string;
  action?: React.ReactNode;
  className?: string;
};

export function LoadingState({
  message = "Analysing…",
  subMessage,
  action,
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
      {subMessage && <p className="text-xs text-muted-foreground">{subMessage}</p>}
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

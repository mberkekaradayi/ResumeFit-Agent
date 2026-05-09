import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className={cn("flex flex-col gap-3", className)}>
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {action && <div className="mt-1">{action}</div>}
    </Alert>
  );
}

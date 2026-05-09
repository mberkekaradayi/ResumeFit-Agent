import { Badge } from "@/components/ui/badge";
import { scoreColorClass, scoreLabel } from "@/lib/utils/formatScore";
import { cn } from "@/lib/utils";

type ScoreBadgeProps = {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function ScoreBadge({
  score,
  showLabel = false,
  size = "md",
  className,
}: ScoreBadgeProps) {
  const sizeClasses = {
    sm: "text-xs h-5 px-2",
    md: "text-sm h-6 px-2.5",
    lg: "text-base h-7 px-3 font-semibold",
  };

  return (
    <Badge
      variant="outline"
      className={cn(sizeClasses[size], scoreColorClass(score), className)}
    >
      {score}%
      {showLabel && <span className="opacity-70 ml-1">· {scoreLabel(score)}</span>}
    </Badge>
  );
}

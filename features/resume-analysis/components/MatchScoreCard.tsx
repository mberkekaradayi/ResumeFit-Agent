"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import type { MatchScore } from "../types/analysis.types";
import { CATEGORY_LABELS } from "../constants/analysis.constants";
import { scoreColorClass } from "@/lib/utils/formatScore";
import { cn } from "@/lib/utils";

type MatchScoreCardProps = {
  matchScore: MatchScore;
};

export function MatchScoreCard({ matchScore }: MatchScoreCardProps) {
  const { overall, categoryScores, explanation } = matchScore;

  const categoryEntries = (
    Object.entries(categoryScores) as [string, number][]
  ).filter(([, v]) => v !== undefined);

  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>Overall match score</CardTitle>
        <CardDescription>
          Estimated alignment based on resume evidence
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Overall score ring + explanation */}
        <div className="flex items-center gap-5">
          <div
            className={cn(
              "flex size-20 shrink-0 items-center justify-center rounded-full border-4 text-2xl font-bold",
              overall >= 80
                ? "border-emerald-400 text-emerald-600 dark:border-emerald-600 dark:text-emerald-400"
                : overall >= 65
                  ? "border-blue-400 text-blue-600 dark:border-blue-600 dark:text-blue-400"
                  : overall >= 45
                    ? "border-amber-400 text-amber-600 dark:border-amber-600 dark:text-amber-400"
                    : "border-red-400 text-red-600 dark:border-red-600 dark:text-red-400",
            )}
          >
            {overall}%
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">{explanation}</p>
            <p className="text-xs text-muted-foreground">
              This is an estimated role alignment score. It is not a guarantee
              of ATS performance or hiring outcome.
            </p>
            <ScoreBadge score={overall} showLabel size="sm" />
          </div>
        </div>

        {/* Category score tiles */}
        {categoryEntries.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categoryEntries.map(([key, score]) => {
              const label =
                CATEGORY_LABELS[key] ??
                key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <div
                  key={key}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", scoreColorClass(score))}
                    >
                      {score}%
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        score >= 80
                          ? "bg-emerald-500"
                          : score >= 65
                            ? "bg-blue-500"
                            : score >= 45
                              ? "bg-amber-500"
                              : "bg-red-500",
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

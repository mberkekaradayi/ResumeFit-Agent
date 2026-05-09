"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MatchScore } from "../types/analysis.types";
import { cn } from "@/lib/utils";

type MatchScoreCardProps = {
  matchScore: MatchScore;
};

export function MatchScoreCard({ matchScore }: MatchScoreCardProps) {
  const { overall, explanation, label } = matchScore;
  const labelClass =
    overall >= 80
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      : overall >= 65
      ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
      : overall >= 45
      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
      : "border-red-500/40 bg-red-500/10 text-red-300";

  return (
    <Card className="gap-0 rf-panel overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-zinc-100">Overall match score</CardTitle>
        <CardDescription>
          Estimated alignment based on resume evidence
        </CardDescription>
        {label && (
          <div>
            <Badge
              variant="outline"
              className={cn("capitalize text-xs", labelClass)}
            >
              {label} fit
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Overall score ring + explanation */}
        <div className="flex items-center gap-6">
          <div
            className={cn(
              "flex size-28 shrink-0 items-center justify-center rounded-full border-[5px] text-4xl font-semibold font-mono",
              overall >= 80
                ? "border-emerald-400 text-emerald-300 shadow-[0_0_36px_rgba(16,185,129,0.28)]"
                : overall >= 65
                  ? "border-blue-400 text-blue-300 shadow-[0_0_36px_rgba(59,130,246,0.24)]"
                  : overall >= 45
                    ? "border-amber-400 text-amber-300 shadow-[0_0_32px_rgba(245,158,11,0.22)]"
                    : "border-red-400 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.2)]",
            )}
          >
            <span className="tracking-tight">{overall}</span>
            <span className="ml-1 text-base text-zinc-500">%</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-zinc-100">{explanation}</p>
            <p className="text-xs text-zinc-500 max-w-xl">
              This is an estimated role alignment score. It is not a guarantee
              of ATS performance or hiring outcome.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

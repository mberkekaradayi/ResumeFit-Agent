"use client";

/**
 * Composes all result sections into a single scrollable view.
 *
 * Sections are rendered in the order recommended by the PRD.
 */

import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, AlertCircle, ListChecks, Dot } from "lucide-react";
import type { AnalyzeResponse } from "@/types/api.types";
import { MatchScoreCard } from "./MatchScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalysisResultsProps = {
  analysis: AnalyzeResponse;
  onReset: () => void;
};

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-zinc-300 mb-1">
            Analysis Results
          </p>
          <h1 className="text-xl font-semibold text-zinc-100">
            Analysis results
          </h1>
          <p className="text-sm text-zinc-200">
            Based on your resume and the provided job description
          </p>
          {analysis.meta.engine === "heuristic_fallback" && (
            <div className="mt-1 space-y-1">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Fallback mode used for reliability. Results are deterministic and may
                be less nuanced than AI mode.
              </p>
              {analysis.meta.warnings.length > 0 && (
                <ul className="space-y-0.5">
                  {analysis.meta.warnings.slice(0, 3).map((warning, index) => (
                    <li key={`${index}-${warning}`} className="text-[11px] text-zinc-300">
                      {warning}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="size-3.5" />
          New analysis
        </Button>
      </div>

      {/* 1. Score */}
      <MatchScoreCard matchScore={analysis.matchScore} />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Strongest fit"
          icon={<CheckCircle2 className="size-4 text-emerald-600" />}
          items={analysis.summary.strongestFit}
          tone="teal"
          emptyMessage="No strong fit signals were identified."
        />
        <SummaryCard
          title="Biggest gaps"
          icon={<AlertCircle className="size-4 text-amber-600" />}
          items={analysis.summary.biggestGaps}
          tone="amber"
          emptyMessage="No major gaps identified."
        />
        <SummaryCard
          title="Next steps"
          icon={<ListChecks className="size-4 text-blue-600" />}
          items={analysis.summary.nextSteps}
          tone="blue"
          emptyMessage="No immediate next steps needed."
        />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  icon,
  items,
  tone,
  emptyMessage,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "teal" | "amber" | "blue";
  emptyMessage: string;
}) {
  const toneClasses =
    tone === "teal"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : tone === "amber"
      ? "border-amber-500/30 bg-amber-500/5"
      : "border-blue-500/30 bg-blue-500/5";

  return (
    <Card className={`gap-0 rf-panel ${toneClasses}`}>
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-base flex items-center gap-2 text-zinc-100">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {items.length === 0 ? (
          <p className="text-xs text-zinc-300">{emptyMessage}</p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item, index) => (
              <li key={`${index}-${item}`} className="flex items-start gap-2">
                <Dot className="mt-0.5 size-4 shrink-0 text-zinc-300" />
                <p className="text-sm text-zinc-100 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

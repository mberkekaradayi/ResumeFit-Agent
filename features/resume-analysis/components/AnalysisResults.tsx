"use client";

/**
 * Composes all result sections into a single scrollable view.
 *
 * Sections are rendered in the order recommended by the PRD.
 */

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { AnalyzeResponse } from "@/types/api.types";
import { MatchScoreCard } from "./MatchScoreCard";
import { RequirementEvidenceMap } from "./RequirementEvidenceMap";
import { GapAnalysisSection } from "./GapAnalysisSection";
import { BulletRewriteSection } from "./BulletRewriteSection";
import { FactualityWarnings } from "./FactualityWarnings";
import { InterviewPrepSection } from "./InterviewPrepSection";

type AnalysisResultsProps = {
  analysis: AnalyzeResponse;
  onReset: () => void;
};

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Analysis results
          </h1>
          <p className="text-sm text-muted-foreground">
            Based on your resume and the provided job description
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="size-3.5" />
          New analysis
        </Button>
      </div>

      {/* 1. Score */}
      <MatchScoreCard matchScore={analysis.matchScore} />

      {/* 2. Factuality warnings — surface high-risk warnings near the top */}
      {analysis.factualityWarnings.some((w) => w.riskLevel === "high") && (
        <FactualityWarnings
          warnings={analysis.factualityWarnings.filter(
            (w) => w.riskLevel === "high"
          )}
        />
      )}

      {/* 3. Gap analysis */}
      <GapAnalysisSection gaps={analysis.gaps} />

      {/* 4. Requirement evidence map */}
      <RequirementEvidenceMap evidenceMap={analysis.evidenceMap} />

      {/* 5. Bullet rewrites */}
      <BulletRewriteSection rewrites={analysis.rewrites} />

      {/* 6. All factuality warnings (medium + low) */}
      {analysis.factualityWarnings.some((w) => w.riskLevel !== "high") && (
        <FactualityWarnings
          warnings={analysis.factualityWarnings.filter(
            (w) => w.riskLevel !== "high"
          )}
        />
      )}

      {/* 7. Interview prep */}
      <InterviewPrepSection questions={analysis.interviewPrep} />
    </div>
  );
}

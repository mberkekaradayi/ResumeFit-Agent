"use client";

/**
 * Top-level feature orchestrator.
 *
 * Owns analysis state via useResumeAnalysis and switches between the input
 * form and the results view. This is the only component that `app/page.tsx`
 * needs to import.
 *
 * The component is intentionally thin — it delegates all rendering to
 * AnalysisInputForm and AnalysisResults, and all logic to useResumeAnalysis.
 */

import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { AnalysisInputForm } from "./AnalysisInputForm";
import { AnalysisResults } from "./AnalysisResults";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

export function ResumeAnalysisView() {
  const {
    analysis,
    isLoading,
    loadingMessage,
    error,
    validationErrors,
    runAnalysis,
    cancelAnalysis,
    reset,
    clearErrors,
  } = useResumeAnalysis();

  if (isLoading) {
    return (
      <LoadingState
        message={loadingMessage || "Running analysis pipeline…"}
        subMessage="Analysis may take up to about 1 minute for longer inputs."
        action={
          <Button variant="outline" size="sm" onClick={cancelAnalysis}>
            Cancel analysis
          </Button>
        }
      />
    );
  }

  if (analysis) {
    return <AnalysisResults analysis={analysis} onReset={reset} />;
  }

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div className="space-y-2">
        <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-300">
          Analysis Workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Resume fit analysis
        </h1>
        <p className="text-sm text-zinc-200 max-w-2xl leading-relaxed">
          Paste your resume and job description. The system estimates alignment,
          highlights strongest fit, surfaces gaps, and recommends next steps in
          a concise executive-style output.
        </p>
      </div>

      {/* Error state from the last analysis attempt */}
      {error && (
        <ErrorState
          title="Analysis failed"
          message={error}
          className="max-w-xl"
        />
      )}

      <AnalysisInputForm
        isAnalysing={isLoading}
        validationErrors={validationErrors}
        onAnalyze={runAnalysis}
        onInputsChange={clearErrors}
      />
    </div>
  );
}

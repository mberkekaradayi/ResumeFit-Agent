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

import { useEffect } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { AnalysisInputForm } from "./AnalysisInputForm";
import { AnalysisResults } from "./AnalysisResults";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

export function ResumeAnalysisView() {
  const {
    analysis,
    isLoading,
    error,
    validationErrors,
    runAnalysis,
    restoreFromStorage,
    reset,
  } = useResumeAnalysis();

  // On mount, try to restore the previous analysis from localStorage
  useEffect(() => {
    restoreFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <LoadingState message="Running analysis pipeline… this may take 15–30 seconds." />
    );
  }

  if (analysis) {
    return <AnalysisResults analysis={analysis} onReset={reset} />;
  }

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Resume fit analysis
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Upload your resume and paste a job description. The AI will map your
          experience to the role requirements and generate an evidence-based fit
          report — without inventing anything.
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
      />
    </div>
  );
}

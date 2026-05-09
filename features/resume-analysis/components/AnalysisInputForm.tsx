"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeUpload } from "./ResumeUpload";
import { ResumeTextEditor } from "./ResumeTextEditor";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { useResumeParser } from "../hooks/useResumeParser";

type AnalysisInputFormProps = {
  isAnalysing: boolean;
  validationErrors: { field: string; message: string }[];
  onAnalyze: (resumeText: string, jobDescription: string) => void;
};

export function AnalysisInputForm({
  isAnalysing,
  validationErrors,
  onAnalyze,
}: AnalysisInputFormProps) {
  const parser = useResumeParser();
  const [jobDescription, setJobDescription] = useState("");

  const resumeError = validationErrors.find(
    (e) => e.field === "resumeText"
  )?.message;
  const jdError = validationErrors.find(
    (e) => e.field === "jobDescription"
  )?.message;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAnalyze(parser.extractedText, jobDescription);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Step 1 — Resume */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step 1 — Resume
          </p>

          <ResumeUpload
            isLoading={parser.isLoading}
            warning={parser.warning}
            error={parser.error}
            onFileSelect={parser.parseFile}
          onRemoveFile={parser.reset}
          />

          <ResumeTextEditor
            value={parser.extractedText}
            onChange={parser.setExtractedText}
          />

          {resumeError && (
            <p className="text-xs text-destructive">{resumeError}</p>
          )}
        </div>

        {/* Step 2 — Job Description */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step 2 — Job Description
          </p>

          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
            error={jdError}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="sticky bottom-0 z-10 -mx-4 border-t bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="mr-auto text-xs text-muted-foreground">
            Your data is not stored on our servers.
          </p>
        <Button
          type="submit"
          disabled={isAnalysing || parser.isLoading}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isAnalysing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Analyse fit
            </>
          )}
        </Button>
        </div>
      </div>
    </form>
  );
}

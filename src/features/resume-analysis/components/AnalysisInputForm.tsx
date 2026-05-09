"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeTextEditor } from "./ResumeTextEditor";
import { JobDescriptionInput } from "./JobDescriptionInput";
import {
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_RESUME_TEXT_LENGTH,
} from "../constants/analysis.constants";

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
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const resumeError = validationErrors.find(
    (e) => e.field === "resumeText"
  )?.message;
  const jdError = validationErrors.find(
    (e) => e.field === "jobDescription"
  )?.message;
  const resumeLength = resumeText.trim().length;
  const jdLength = jobDescription.trim().length;
  const isResumeTooLong = resumeLength > MAX_RESUME_TEXT_LENGTH;
  const isJobDescriptionTooLong = jdLength > MAX_JOB_DESCRIPTION_LENGTH;
  const isBlockedByInputSize = isResumeTooLong || isJobDescriptionTooLong;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAnalyze(resumeText, jobDescription);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Step 1 — Resume */}
        <div className="space-y-4 rf-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
            Step 1 — Resume
          </p>

          <ResumeTextEditor
            value={resumeText}
            onChange={setResumeText}
            placeholder="Paste your resume content here (experience bullets + skills + projects)."
          />

          {resumeError && (
            <p className="text-xs text-destructive">{resumeError}</p>
          )}
          {isResumeTooLong && (
            <p className="text-xs text-destructive">
              Resume is too long ({resumeLength} characters). Keep it under{" "}
              {MAX_RESUME_TEXT_LENGTH} characters to submit.
            </p>
          )}
        </div>

        {/* Step 2 — Job Description */}
        <div className="space-y-4 rf-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
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
      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-black/60 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="mr-auto text-xs text-zinc-300">
            Your data is not stored on our servers.
          </p>
          <Button
            type="submit"
            disabled={isAnalysing || isBlockedByInputSize}
            size="lg"
            className="w-full sm:w-auto min-w-[220px] h-12 px-6 text-sm font-semibold tracking-wide bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)] disabled:shadow-none"
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
        {isJobDescriptionTooLong && (
          <p className="mt-2 text-xs text-destructive">
            Job description is too long ({jdLength} characters). Keep it under{" "}
            {MAX_JOB_DESCRIPTION_LENGTH} characters to submit.
          </p>
        )}
      </div>
    </form>
  );
}

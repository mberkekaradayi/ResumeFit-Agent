"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  MIN_JOB_DESCRIPTION_LENGTH,
  MAX_JOB_DESCRIPTION_LENGTH,
} from "../constants/analysis.constants";

type JobDescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
};

export function JobDescriptionInput({
  value,
  onChange,
  error,
  className,
}: JobDescriptionInputProps) {
  const isTooShort =
    value.trim().length > 0 && value.trim().length < MIN_JOB_DESCRIPTION_LENGTH;
  const length = value.trim().length;
  const isTooLong = length > MAX_JOB_DESCRIPTION_LENGTH;

  const hasError = !!error || isTooShort || isTooLong;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="job-description">Job description</Label>
        <span className="text-xs text-zinc-300">
          {value.length} chars
        </span>
      </div>

      <Textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here…"
        rows={9}
        aria-invalid={hasError}
        className="min-h-32 leading-relaxed border-white/15 bg-zinc-950/70"
      />

      {isTooShort && !error && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          The job description looks short. Paste the full listing for a better
          analysis.
        </p>
      )}

      {isTooLong && !error && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Job description is very long. For faster analysis, keep it under{" "}
          {MAX_JOB_DESCRIPTION_LENGTH} characters by removing repetitive sections.
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {!hasError && (
        <p className="text-xs text-zinc-300">
          Paste the complete job description, including requirements,
          responsibilities, and nice-to-haves. Try to keep it under{" "}
          {MAX_JOB_DESCRIPTION_LENGTH} characters for speed.
        </p>
      )}
    </div>
  );
}

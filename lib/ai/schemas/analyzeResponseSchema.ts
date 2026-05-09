/**
 * Runtime validation schemas for the AI analysis response.
 *
 * These ensure that even when the model returns unexpected output, we either
 * fix it up or fail loudly with a useful error — never silently pass bad data
 * to the UI.
 *
 * TODO: Replace the lightweight hand-rolled validators below with a proper Zod
 * schema once `zod` is added (`npm install zod`). Zod will give you parse
 * errors with field paths, which is very helpful during prompt tuning.
 */

import type { AnalyzeResponse } from "@/types/api.types";

/**
 * Checks that a raw OpenAI JSON response has the minimum required shape.
 * Returns the typed response or throws a descriptive error.
 */
export function validateAnalyzeResponse(raw: unknown): AnalyzeResponse {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI response is not an object.");
  }

  const obj = raw as Record<string, unknown>;

  const requiredKeys: (keyof AnalyzeResponse)[] = [
    "jobRequirements",
    "resumeProfile",
    "matchScore",
    "evidenceMap",
    "gaps",
    "rewrites",
    "factualityWarnings",
    "interviewPrep",
  ];

  for (const key of requiredKeys) {
    if (!(key in obj)) {
      throw new Error(`AI response is missing required field: "${key}".`);
    }
  }

  // TODO: Add per-field deep validation once Zod is available.
  return obj as AnalyzeResponse;
}

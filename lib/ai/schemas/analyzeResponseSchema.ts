/**
 * Runtime validation schemas for the AI analysis response.
 *
 * These ensure that even when the model returns unexpected output, we either
 * fix it up or fail loudly with a useful error — never silently pass bad data
 * to the UI.
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
    "matchScore",
    "summary",
    "meta",
  ];

  for (const key of requiredKeys) {
    if (!(key in obj)) {
      throw new Error(`AI response is missing required field: "${key}".`);
    }
  }

  return obj as AnalyzeResponse;
}

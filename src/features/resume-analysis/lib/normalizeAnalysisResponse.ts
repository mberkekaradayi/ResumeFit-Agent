/**
 * Normalizes the API response into a clean, fully-typed AnalyzeResponse.
 *
 * For AI runs, `matchScore.overall` comes from the model (JSON contract); this
 * layer clamps it to 0–100, fills missing label/summary fields, and sanitizes
 * the explanation text. Heuristic fallback responses are normalized the same way.
 */

import type { AnalyzeResponse } from "@/types/api.types";
/**
 * Takes a potentially partial AI response object and returns a guaranteed
 * complete `AnalyzeResponse` with a bounded score and concise summary.
 */
export function normalizeAnalysisResponse(
  raw: Partial<AnalyzeResponse>
): AnalyzeResponse {
  const overall = clampScore(raw.matchScore?.overall ?? 0);
  const label =
    raw.matchScore?.label ??
    (overall >= 75 ? "strong" : overall >= 50 ? "moderate" : "weak");
  const explanation =
    sanitizeScoreExplanation(raw.matchScore?.explanation) ||
    "Estimated alignment based on role-relevant metrics and requirement match.";
  const summary = {
    strongestFit: (raw.summary?.strongestFit ?? [])
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3),
    biggestGaps: (raw.summary?.biggestGaps ?? [])
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3),
    nextSteps: (raw.summary?.nextSteps ?? [])
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3),
  };

  return {
    matchScore: {
      overall,
      label,
      categoryScores: {},
      explanation,
    },
    summary,
    meta: raw.meta ?? {
      engine: "ai",
      warnings: [],
    },
  };
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function sanitizeScoreExplanation(explanation: string | undefined): string {
  if (!explanation) return "";
  return explanation
    .trim()
    .replace(/^estimated alignment\s*\d+\s*\/\s*100\s*[—:-]?\s*/i, "")
    .replace(/^(score|overall)\s*[—:-]?\s*/i, "")
    .replace(/\s+/g, " ");
}

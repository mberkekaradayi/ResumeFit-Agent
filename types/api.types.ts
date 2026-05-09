/**
 * API-level request and response types shared between the client (hooks)
 * and the server (route handlers). Keep this file free of business logic.
 */

import type {
  MatchScore,
  AnalysisMeta,
  AnalysisSummary,
} from "@/features/resume-analysis/types/analysis.types";

// ─── Requests ────────────────────────────────────────────────────────────────

export type AnalyzeRequest = {
  resumeText: string;
  jobDescription: string;
};

// ─── Responses ───────────────────────────────────────────────────────────────

export type AnalyzeResponse = {
  matchScore: MatchScore;
  summary: AnalysisSummary;
  meta: AnalysisMeta;
};

// ─── Shared error shape ───────────────────────────────────────────────────────

export type ApiError = {
  message: string;
  code?: string;
};

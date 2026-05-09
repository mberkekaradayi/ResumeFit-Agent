/**
 * API-level request and response types shared between the client (hooks)
 * and the server (route handlers). Keep this file free of business logic.
 */

import type {
  GapAnalysis,
  EvidenceMapItem,
  MatchScore,
  BulletRewrite,
  FactualityWarning,
  InterviewQuestion,
  JobRequirements,
  ResumeProfile,
} from "@/features/resume-analysis/types/analysis.types";

// ─── Requests ────────────────────────────────────────────────────────────────

export type ParseResumeRequest = {
  /** Raw PDF file sent as multipart/form-data under the "file" field */
  file: File;
};

export type AnalyzeRequest = {
  resumeText: string;
  jobDescription: string;
};

// ─── Responses ───────────────────────────────────────────────────────────────

export type ParseResumeResponse = {
  extractedText: string;
  /** True when the PDF was image-based or extraction yielded very little text */
  isPartial: boolean;
  warning?: string;
};

export type AnalyzeResponse = {
  jobRequirements: JobRequirements;
  resumeProfile: ResumeProfile;
  matchScore: MatchScore;
  evidenceMap: EvidenceMapItem[];
  gaps: GapAnalysis;
  rewrites: BulletRewrite[];
  factualityWarnings: FactualityWarning[];
  interviewPrep: InterviewQuestion[];
};

// ─── Shared error shape ───────────────────────────────────────────────────────

export type ApiError = {
  message: string;
  code?: string;
};

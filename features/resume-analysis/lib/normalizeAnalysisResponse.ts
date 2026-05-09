/**
 * Normalizes the raw AI response into a clean, fully-typed AnalyzeResponse.
 *
 * The AI may return partial or inconsistent data; this layer fills in safe
 * defaults and recalculates the match score deterministically so we never
 * surface a raw AI-generated score number.
 */

import type { AnalyzeResponse } from "@/types/api.types";
import { calculateMatchScore } from "./calculateMatchScore";

/**
 * Takes a potentially partial AI response object and returns a guaranteed
 * complete `AnalyzeResponse` with a recalculated match score.
 */
export function normalizeAnalysisResponse(
  raw: Partial<AnalyzeResponse>
): AnalyzeResponse {
  const evidenceMap = raw.evidenceMap ?? [];

  // Always recalculate scores from the evidence map — never trust the raw AI score.
  const matchScore = calculateMatchScore(evidenceMap);

  return {
    jobRequirements: raw.jobRequirements ?? {
      mustHave: [],
      niceToHave: [],
      technologies: [],
      responsibilities: [],
      softSkills: [],
      senioritySignals: [],
    },
    resumeProfile: raw.resumeProfile ?? {
      skills: [],
      experience: [],
      projects: [],
      education: [],
      technologies: [],
      metrics: [],
      ownershipSignals: [],
      communicationSignals: [],
      aiLlmSignals: [],
    },
    matchScore,
    evidenceMap,
    gaps: raw.gaps ?? {
      strongAreas: [],
      weakAreas: [],
      missingAreas: [],
    },
    rewrites: raw.rewrites ?? [],
    factualityWarnings: raw.factualityWarnings ?? [],
    interviewPrep: raw.interviewPrep ?? [],
  };
}

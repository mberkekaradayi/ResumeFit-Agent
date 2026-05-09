/**
 * Shared constants for the resume analysis feature.
 * Change weights or thresholds here; the scoring helpers pick them up automatically.
 */

import type {
  EvidenceStrength,
  RequirementPriority,
} from "../types/analysis.types";

// ─── Input validation ─────────────────────────────────────────────────────────

export const MIN_RESUME_TEXT_LENGTH = 200;
export const MIN_JOB_DESCRIPTION_LENGTH = 100;
export const MAX_RESUME_TEXT_LENGTH = 5000;
export const MAX_JOB_DESCRIPTION_LENGTH = 4000;

// ─── Evidence scoring weights ─────────────────────────────────────────────────

/** Raw score contribution for each evidence strength level (0–1 scale) */
export const STRENGTH_SCORES: Record<EvidenceStrength, number> = {
  strong: 1.0,
  medium: 0.65,
  weak: 0.35,
  missing: 0.0,
};

/** Multipliers applied to requirement scores based on priority */
export const PRIORITY_WEIGHTS: Record<RequirementPriority, number> = {
  must_have: 1.5,
  nice_to_have: 1.0,
};

// ─── Category display labels ──────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  experience: "Experience",
  ai_llm: "AI / LLM",
  ownership: "Ownership",
  communication: "Communication",
  domain: "Domain",
  soft_skill: "Soft Skills",
};

// ─── Risk level display ───────────────────────────────────────────────────────

export const RISK_LABELS: Record<string, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

export const RISK_COLOR_CLASSES: Record<string, string> = {
  low: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800",
  medium:
    "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800",
  high: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800",
};

// ─── Strength display ─────────────────────────────────────────────────────────

export const STRENGTH_LABELS: Record<string, string> = {
  strong: "Strong",
  medium: "Medium",
  weak: "Weak",
  missing: "Missing",
};

export const STRENGTH_COLOR_CLASSES: Record<string, string> = {
  strong:
    "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800",
  medium:
    "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-800",
  weak: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800",
  missing:
    "text-zinc-600 bg-zinc-50 border-zinc-200 dark:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-700",
};

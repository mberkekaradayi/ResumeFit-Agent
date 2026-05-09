/**
 * Domain types for the resume analysis feature.
 * These are the canonical types used throughout the entire feature —
 * components, hooks, lib helpers, and API routes all import from here.
 */

// ─── Requirement ─────────────────────────────────────────────────────────────

export type RequirementCategory =
  | "technical"
  | "experience"
  | "ai_llm"
  | "ownership"
  | "communication"
  | "domain"
  | "soft_skill";

export type RequirementPriority = "must_have" | "nice_to_have";

export type Requirement = {
  id: string;
  text: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  keywords: string[];
  /** Why this requirement matters for the role */
  explanation: string;
};

export type JobRequirements = {
  mustHave: Requirement[];
  niceToHave: Requirement[];
  technologies: string[];
  responsibilities: string[];
  softSkills: string[];
  senioritySignals: string[];
};

// ─── Resume Profile ───────────────────────────────────────────────────────────

export type ResumeProfile = {
  skills: string[];
  experience: string[];
  projects: string[];
  education: string[];
  technologies: string[];
  metrics: string[];
  ownershipSignals: string[];
  communicationSignals: string[];
  aiLlmSignals: string[];
};

// ─── Evidence Map ─────────────────────────────────────────────────────────────

export type EvidenceStrength = "strong" | "medium" | "weak" | "missing";

export type EvidenceMapItem = {
  requirementId: string;
  requirement: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  matchingEvidence: string[];
  strength: EvidenceStrength;
  explanation: string;
};

// ─── Match Score ──────────────────────────────────────────────────────────────

export type CategoryScores = {
  technical?: number;
  experience?: number;
  aiLlm?: number;
  ownership?: number;
  communication?: number;
  domain?: number;
};

export type MatchScore = {
  /** 0–100 overall weighted score */
  overall: number;
  categoryScores: CategoryScores;
  explanation: string;
};

// ─── Gap Analysis ─────────────────────────────────────────────────────────────

export type GapItem = {
  label: string;
  explanation: string;
};

export type GapAnalysis = {
  strongAreas: GapItem[];
  weakAreas: GapItem[];
  missingAreas: GapItem[];
};

// ─── Bullet Rewrites ──────────────────────────────────────────────────────────

export type RewriteRisk = "low" | "medium" | "high";

export type BulletRewrite = {
  originalBullet: string;
  improvedBullet: string;
  targetedRequirements: string[];
  supportingEvidence: string[];
  whyBetter: string;
  riskLevel: RewriteRisk;
  factualityNotes: string[];
};

// ─── Factuality Warnings ──────────────────────────────────────────────────────

export type FactualityWarning = {
  claim: string;
  reason: string;
  riskLevel: RewriteRisk;
  /** The original bullet this warning is associated with, if any */
  relatedBullet?: string;
};

// ─── Interview Prep ───────────────────────────────────────────────────────────

export type InterviewQuestion = {
  question: string;
  whyTheyMayAsk: string;
  relevantResumeEvidence: string[];
  suggestedTalkingPoints: string[];
  /** Gap area this question relates to, if applicable */
  relatedGap?: string;
};

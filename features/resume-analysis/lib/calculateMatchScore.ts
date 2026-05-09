/**
 * Client-side (or server-side) scoring helpers.
 *
 * The overall score is calculated deterministically from the evidence map,
 * not guessed by the AI.  This makes scores explainable and reproducible.
 *
 * Scoring formula:
 *   item_score = STRENGTH_SCORES[strength] * PRIORITY_WEIGHTS[priority]
 *   overall    = Σ item_scores / Σ max_possible_item_scores  × 100
 *
 * Category scores follow the same formula, but only include items that belong
 * to that category.
 */

import type {
  EvidenceMapItem,
  MatchScore,
  CategoryScores,
  RequirementCategory,
} from "../types/analysis.types";
import {
  STRENGTH_SCORES,
  PRIORITY_WEIGHTS,
} from "../constants/analysis.constants";

/** All categories we will always try to surface a score for, if data exists */
const SCORED_CATEGORIES: RequirementCategory[] = [
  "technical",
  "experience",
  "ai_llm",
  "ownership",
  "communication",
  "domain",
];

/**
 * Calculates a weighted score (0–100) for a subset of evidence items.
 * Returns `null` if the subset is empty (so the UI can hide the category).
 */
function scoreItems(items: EvidenceMapItem[]): number | null {
  if (items.length === 0) return null;

  let earned = 0;
  let possible = 0;

  for (const item of items) {
    const weight = PRIORITY_WEIGHTS[item.priority];
    earned += STRENGTH_SCORES[item.strength] * weight;
    possible += 1.0 * weight; // 1.0 = max (strong) contribution
  }

  if (possible === 0) return null;
  return Math.round((earned / possible) * 100);
}

/**
 * Derives a full MatchScore from the evidence map returned by the AI.
 *
 * Call this after the AI returns `evidenceMap` so that the score is always
 * grounded in the actual evidence — not a freeform AI number.
 */
export function calculateMatchScore(
  evidenceMap: EvidenceMapItem[]
): MatchScore {
  const overall = scoreItems(evidenceMap) ?? 0;

  const categoryScores: CategoryScores = {};

  for (const category of SCORED_CATEGORIES) {
    const items = evidenceMap.filter((item) => item.category === category);
    const score = scoreItems(items);
    if (score !== null) {
      // TypeScript requires the cast because CategoryScores uses optional keys
      (categoryScores as Record<string, number>)[
        category === "ai_llm" ? "aiLlm" : category
      ] = score;
    }
  }

  const explanation = buildScoreExplanation(overall, evidenceMap);

  return { overall, categoryScores, explanation };
}

function buildScoreExplanation(
  overall: number,
  evidenceMap: EvidenceMapItem[]
): string {
  const strongCount = evidenceMap.filter((i) => i.strength === "strong").length;
  const missingCount = evidenceMap.filter(
    (i) => i.strength === "missing"
  ).length;
  const total = evidenceMap.length;

  return (
    `Overall alignment: ${overall}%. ` +
    `${strongCount} of ${total} requirements have strong resume evidence. ` +
    `${missingCount} requirement${missingCount !== 1 ? "s" : ""} ${missingCount !== 1 ? "are" : "is"} not covered.`
  );
}

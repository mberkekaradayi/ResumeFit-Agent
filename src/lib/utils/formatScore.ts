/**
 * Display formatting helpers for numeric scores (0–100).
 */

/**
 * Converts a 0–1 fractional score to a 0–100 percentage string.
 * e.g. 0.823 → "82%"
 */
export function formatScorePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Returns a semantic label for a 0–100 score.
 */
export function scoreLabel(score: number): "Excellent" | "Good" | "Fair" | "Weak" {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Weak";
}

/**
 * Maps a 0–100 score to a Tailwind colour token for badges and indicators.
 * Tokens correspond to the CSS custom properties defined in globals.css.
 */
export function scoreColorClass(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 65) return "text-blue-600 dark:text-blue-400";
  if (score >= 45) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

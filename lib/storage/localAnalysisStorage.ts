/**
 * localStorage abstraction for persisting the latest analysis result.
 *
 * Only call these functions inside Client Components or hooks — localStorage
 * is not available on the server.
 *
 * The analysis is stored as a single JSON blob under a namespaced key.
 * No user-identifiable resume or job description text is persisted here;
 * only the analysis output is stored, and only in the user's own browser.
 */

import type { AnalyzeResponse } from "@/types/api.types";

const STORAGE_KEY = "resumefit:latest-analysis";

export type StoredAnalysis = {
  analysis: AnalyzeResponse;
  /** ISO timestamp of when the analysis was saved */
  savedAt: string;
};

export function saveAnalysis(analysis: AnalyzeResponse): void {
  try {
    const payload: StoredAnalysis = {
      analysis,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Silently ignore storage errors (e.g. private browsing, quota exceeded).
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAnalysis;
  } catch {
    return null;
  }
}

export function clearAnalysis(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore.
  }
}

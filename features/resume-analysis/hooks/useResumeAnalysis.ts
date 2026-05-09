"use client";

/**
 * Manages the full analysis pipeline call to /api/analyze.
 *
 * Runs input validation client-side before making the request so we avoid
 * round-trips for empty inputs. The hook also saves the result to localStorage
 * so the user can refresh without losing their analysis.
 */

import { useState, useCallback } from "react";
import type { AnalyzeResponse } from "@/types/api.types";
import { validateAnalysisInput } from "../lib/validateAnalysisInput";
import {
  saveAnalysis,
  loadAnalysis,
} from "@/lib/storage/localAnalysisStorage";

export type UseResumeAnalysisState = {
  analysis: AnalyzeResponse | null;
  isLoading: boolean;
  error: string | null;
  /** Field-level validation errors from the pre-request check */
  validationErrors: { field: string; message: string }[];
};

export type UseResumeAnalysisActions = {
  runAnalysis: (resumeText: string, jobDescription: string) => Promise<void>;
  /** Reload the most recently saved analysis from localStorage, if any */
  restoreFromStorage: () => void;
  reset: () => void;
};

const initialState: UseResumeAnalysisState = {
  analysis: null,
  isLoading: false,
  error: null,
  validationErrors: [],
};

export function useResumeAnalysis(): UseResumeAnalysisState &
  UseResumeAnalysisActions {
  const [state, setState] = useState<UseResumeAnalysisState>(initialState);

  const runAnalysis = useCallback(
    async (resumeText: string, jobDescription: string) => {
      // Client-side validation before touching the network
      const validation = validateAnalysisInput(resumeText, jobDescription);
      if (!validation.valid) {
        setState((s) => ({
          ...s,
          validationErrors: validation.errors,
        }));
        return;
      }

      setState((s) => ({
        ...s,
        isLoading: true,
        error: null,
        validationErrors: [],
      }));

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jobDescription }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.message ?? `Analysis failed (${res.status}). Please try again.`
          );
        }

        const analysis: AnalyzeResponse = await res.json();

        // Persist to localStorage so the user can refresh without losing work
        saveAnalysis(analysis);

        setState({ analysis, isLoading: false, error: null, validationErrors: [] });
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "An unknown error occurred. Please try again.",
        }));
      }
    },
    []
  );

  const restoreFromStorage = useCallback(() => {
    const stored = loadAnalysis();
    if (stored) {
      setState((s) => ({ ...s, analysis: stored.analysis }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    runAnalysis,
    restoreFromStorage,
    reset,
  };
}

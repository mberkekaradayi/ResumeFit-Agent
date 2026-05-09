"use client";

/**
 * Manages the full analysis pipeline call to /api/analyze.
 *
 * Runs input validation client-side before making the request so we avoid
 * round-trips for empty inputs.
 */

import { useState, useCallback, useRef } from "react";
import type { AnalyzeResponse } from "@/types/api.types";
import { validateAnalysisInput } from "../lib/validateAnalysisInput";

export type UseResumeAnalysisState = {
  analysis: AnalyzeResponse | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  /** Field-level validation errors from the pre-request check */
  validationErrors: { field: string; message: string }[];
};

export type UseResumeAnalysisActions = {
  runAnalysis: (resumeText: string, jobDescription: string) => Promise<void>;
  cancelAnalysis: () => void;
  reset: () => void;
};

const initialState: UseResumeAnalysisState = {
  analysis: null,
  isLoading: false,
  loadingMessage: "",
  error: null,
  validationErrors: [],
};
const ANALYZE_REQUEST_TIMEOUT_MS = 90000;

export function useResumeAnalysis(): UseResumeAnalysisState &
  UseResumeAnalysisActions {
  const [state, setState] = useState<UseResumeAnalysisState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

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
        loadingMessage: "Running analysis…",
        error: null,
        validationErrors: [],
      }));

      try {
        // Cancel previous in-flight analysis before starting a new one.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), ANALYZE_REQUEST_TIMEOUT_MS);
        let res: Response;
        let stageInterval: ReturnType<typeof setInterval> | undefined;
        try {
          const stageMessages = [
            "Running analysis…",
            "Scoring and mapping evidence…",
            "Finalizing your report…",
          ];
          let idx = 0;
          stageInterval = setInterval(() => {
            idx = Math.min(idx + 1, stageMessages.length - 1);
            setState((s) => ({ ...s, loadingMessage: stageMessages[idx] }));
          }, 7000);

          res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText, jobDescription }),
            signal: controller.signal,
          });
        } finally {
          if (stageInterval) clearInterval(stageInterval);
          clearTimeout(timeout);
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.message ?? `Analysis failed (${res.status}). Please try again.`
          );
        }

        const analysis: AnalyzeResponse = await res.json();

        setState({
          analysis,
          isLoading: false,
          loadingMessage: "",
          error: null,
          validationErrors: [],
        });
      } catch (err) {
        const isTimeout =
          err instanceof DOMException && err.name === "AbortError";

        setState((s) => ({
          ...s,
          isLoading: false,
          loadingMessage: "",
          error:
            isTimeout
              ? "Analysis timed out. Please retry with concise, role-focused resume and job description content."
              : err instanceof Error
              ? err.message
              : "An unknown error occurred. Please try again.",
        }));
      } finally {
        abortRef.current = null;
      }
    },
    []
  );

  const cancelAnalysis = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState((s) => ({
      ...s,
      isLoading: false,
      loadingMessage: "",
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    runAnalysis,
    cancelAnalysis,
    reset,
  };
}

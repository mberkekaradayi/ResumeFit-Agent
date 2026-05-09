"use client";

/**
 * Manages PDF upload and text extraction via the /api/parse-resume route.
 *
 * Keeps all loading, error, and result state in one place so the upload
 * component stays declarative.
 */

import { useState, useCallback } from "react";
import type { ParseResumeResponse } from "@/types/api.types";

export type UseResumeParserState = {
  extractedText: string;
  isLoading: boolean;
  isPartial: boolean;
  warning: string | null;
  error: string | null;
};

export type UseResumeParserActions = {
  parseFile: (file: File) => Promise<void>;
  setExtractedText: (text: string) => void;
  reset: () => void;
};

const initialState: UseResumeParserState = {
  extractedText: "",
  isLoading: false,
  isPartial: false,
  warning: null,
  error: null,
};

export function useResumeParser(): UseResumeParserState & UseResumeParserActions {
  const [state, setState] = useState<UseResumeParserState>(initialState);

  const parseFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setState((s) => ({
        ...s,
        error: "Please upload a PDF file.",
      }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null, warning: null }));

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Server error (${res.status})`);
      }

      const data: ParseResumeResponse = await res.json();

      setState({
        extractedText: data.extractedText,
        isLoading: false,
        isPartial: data.isPartial,
        warning: data.warning ?? null,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "An unknown error occurred while parsing the resume.",
      }));
    }
  }, []);

  const setExtractedText = useCallback((text: string) => {
    setState((s) => ({ ...s, extractedText: text }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    parseFile,
    setExtractedText,
    reset,
  };
}

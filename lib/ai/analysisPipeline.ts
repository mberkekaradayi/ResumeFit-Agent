import type { AnalyzeRequest, AnalyzeResponse } from "@/types/api.types";
import { getOpenAIClient } from "./openaiClient";
import { buildMvpAnalysisPrompt } from "./prompts/analyzeResumePrompt";
import {
  compactForPrompt,
  preprocessJobDescriptionForPrompt,
  preprocessResumeForPrompt,
  RETRY_PROMPT_JOB_DESCRIPTION_CHARS,
  RETRY_PROMPT_RESUME_CHARS,
} from "./pipeline/preprocess";
import { runJsonPrompt } from "./pipeline/jsonRunner";

type SimpleAiOutput = {
  matchScore: {
    overall: number;
    label: "weak" | "moderate" | "strong";
    explanation: string;
  };
  summary: {
    strongestFit: string[];
    biggestGaps: string[];
    nextSteps: string[];
  };
};

export async function runAnalysisPipeline(
  input: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const client = getOpenAIClient();
  const processedResume = preprocessResumeForPrompt(input.resumeText);
  const processedJobDescription = preprocessJobDescriptionForPrompt(
    input.jobDescription
  );

  return runAiOrFallback(
    client,
    processedResume,
    processedJobDescription
  );
}

async function runAiOrFallback(
  client: ReturnType<typeof getOpenAIClient>,
  resumeText: string,
  jobDescription: string
): Promise<AnalyzeResponse> {
  const attemptErrors: string[] = [];

  try {
    const ai = await runJsonPrompt<SimpleAiOutput>(
      client,
      buildMvpAnalysisPrompt({ resumeText, jobDescription })
    );
    if (isValidSimpleOutput(ai)) {
      return {
        matchScore: {
          overall: clampScore(ai.matchScore.overall),
          label: ai.matchScore.label,
          categoryScores: {},
          explanation: ai.matchScore.explanation,
        },
        summary: {
          strongestFit: ai.summary.strongestFit.slice(0, 3),
          biggestGaps: ai.summary.biggestGaps.slice(0, 3),
          nextSteps: ai.summary.nextSteps.slice(0, 3),
        },
        meta: { engine: "ai", warnings: [] },
      };
    }
    attemptErrors.push("Primary AI attempt returned incomplete score/summary.");
  } catch (error) {
    attemptErrors.push(`Primary AI attempt failed: ${toShortError(error)}`);
    console.error("[analysisPipeline] Primary AI attempt failed:", error);
  }

  try {
    const aiRetry = await runJsonPrompt<SimpleAiOutput>(
      client,
      buildMvpAnalysisPrompt({
        resumeText: compactForPrompt(resumeText, RETRY_PROMPT_RESUME_CHARS),
        jobDescription: compactForPrompt(
          jobDescription,
          RETRY_PROMPT_JOB_DESCRIPTION_CHARS
        ),
      })
    );
    if (isValidSimpleOutput(aiRetry)) {
      return {
        matchScore: {
          overall: clampScore(aiRetry.matchScore.overall),
          label: aiRetry.matchScore.label,
          categoryScores: {},
          explanation: aiRetry.matchScore.explanation,
        },
        summary: {
          strongestFit: aiRetry.summary.strongestFit.slice(0, 3),
          biggestGaps: aiRetry.summary.biggestGaps.slice(0, 3),
          nextSteps: aiRetry.summary.nextSteps.slice(0, 3),
        },
        meta: {
          engine: "ai",
          warnings: [
            "AI succeeded on compact-context retry after the primary attempt failed.",
            ...attemptErrors,
          ],
        },
      };
    }
    attemptErrors.push("Compact AI retry returned incomplete score/summary.");
  } catch (error) {
    attemptErrors.push(`Compact AI retry failed: ${toShortError(error)}`);
    console.error("[analysisPipeline] Compact AI retry failed:", error);
  }

  const fallback = runHeuristicSummaryFallback(resumeText, jobDescription);
  return {
    matchScore: {
      overall: fallback.overall,
      label: scoreToLabel(fallback.overall),
      categoryScores: {},
      explanation: fallback.explanation,
    },
    summary: fallback.summary,
    meta: {
      engine: "heuristic_fallback",
      warnings: [
        "Used deterministic fallback because AI attempts failed or were incomplete.",
        ...attemptErrors,
      ],
    },
  };
}

function toShortError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function isValidSimpleOutput(value: SimpleAiOutput): boolean {
  return (
    Number.isFinite(value.matchScore?.overall) &&
    (value.matchScore?.label === "weak" ||
      value.matchScore?.label === "moderate" ||
      value.matchScore?.label === "strong") &&
    typeof value.matchScore?.explanation === "string" &&
    Array.isArray(value.summary?.strongestFit) &&
    Array.isArray(value.summary?.biggestGaps) &&
    Array.isArray(value.summary?.nextSteps)
  );
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function runHeuristicSummaryFallback(resumeText: string, jobDescription: string) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const metricsCount = (resumeText.match(/(\$|%|\d+\+|\d+k|\d+m|\d+b)/gi) ?? []).length;
  const sharedTech = [
    "react",
    "next.js",
    "typescript",
    "javascript",
    "node.js",
    "graphql",
    "aws",
    "python",
    "sql",
    "llm",
    "ai",
  ].filter((term) => resumeLower.includes(term) && jdLower.includes(term));

  const score = clampScore(35 + Math.min(metricsCount * 4, 30) + sharedTech.length * 4);

  const isStrongFit = score >= 85;

  return {
    overall: score,
    explanation:
      "Fallback score based on measurable resume metrics and overlap with role technologies.",
    summary: {
      strongestFit: [
        `Strongest overlap appears in ${sharedTech.slice(0, 3).join(", ") || "core engineering stack"}.`,
        `${metricsCount} metric-bearing resume lines were detected, indicating measurable impact.`,
      ],
      biggestGaps: isStrongFit
        ? []
        : [
            "Role-specific evidence is not explicitly mapped to each listed requirement.",
            "Some required domain context may be implied rather than clearly stated.",
          ],
      nextSteps: isStrongFit
        ? []
        : [
            "Emphasize AI-agent lifecycle ownership in 2-3 core project bullets.",
            "Add explicit outcomes tied to enterprise customer/business impact.",
          ],
    },
  };
}

function scoreToLabel(score: number): "weak" | "moderate" | "strong" {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}

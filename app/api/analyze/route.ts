/**
 * POST /api/analyze
 *
 * Accepts resume text + job description and returns a full structured analysis.
 *
 * Request body: AnalyzeRequest JSON
 * Response:     AnalyzeResponse JSON
 *
 * The AI pipeline steps live in lib/ai — this route is intentionally a thin
 * coordinator. When the OpenAI client is configured, replace the mock response
 * below with real calls to those pipeline functions.
 */

import type { AnalyzeRequest, AnalyzeResponse } from "@/types/api.types";
import { validateAnalysisInput } from "@/features/resume-analysis/lib/validateAnalysisInput";
import { normalizeAnalysisResponse } from "@/features/resume-analysis/lib/normalizeAnalysisResponse";

// TODO: Import and wire up the real AI pipeline once `openai` is installed:
// import { runAnalysisPipeline } from "@/lib/ai/analysisPipeline";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { resumeText, jobDescription } = (body ?? {}) as Partial<AnalyzeRequest>;

  // Server-side validation (defence in depth — the client also validates)
  const validation = validateAnalysisInput(resumeText ?? "", jobDescription ?? "");
  if (!validation.valid) {
    return Response.json(
      { message: validation.errors[0]?.message ?? "Invalid input." },
      { status: 422 }
    );
  }

  try {
    // TODO: Replace mock with the real AI pipeline:
    // const rawAnalysis = await runAnalysisPipeline({ resumeText, jobDescription });
    // const analysis = normalizeAnalysisResponse(rawAnalysis);

    // ── Mock response (safe placeholder so the app compiles & runs) ─────────
    const mockRaw: Partial<AnalyzeResponse> = {
      jobRequirements: {
        mustHave: [],
        niceToHave: [],
        technologies: [],
        responsibilities: [],
        softSkills: [],
        senioritySignals: [],
      },
      resumeProfile: {
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
      evidenceMap: [],
      gaps: {
        strongAreas: [],
        weakAreas: [],
        missingAreas: [],
      },
      rewrites: [],
      factualityWarnings: [],
      interviewPrep: [],
    };

    const analysis = normalizeAnalysisResponse(mockRaw);
    // ────────────────────────────────────────────────────────────────────────

    return Response.json(analysis);
  } catch (err) {
    console.error("[analyze] Pipeline error:", err);
    return Response.json(
      {
        message:
          "The analysis could not be completed. Please try again or check the server logs.",
      },
      { status: 500 }
    );
  }
}

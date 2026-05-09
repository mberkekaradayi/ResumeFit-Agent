/**
 * Prompt builder for the main resume-analysis pipeline.
 *
 * Prompts live here — never inside API route handlers or React components.
 * Each builder accepts typed inputs so typos are caught at compile time.
 *
 * TODO: Implement the full multi-step prompt chain once the OpenAI client is
 * configured.  Consider a sequence such as:
 *   1. extractRequirementsPrompt  – job description → JobRequirements
 *   2. buildResumeProfilePrompt   – resume text → ResumeProfile
 *   3. mapEvidencePrompt          – requirements + profile → EvidenceMapItem[]
 *   4. generateRewritesPrompt     – evidence map + bullets → BulletRewrite[]
 *   5. validateFactualityPrompt   – rewrites + original resume → FactualityWarning[]
 *   6. generateInterviewPrepPrompt – evidence map + gaps → InterviewQuestion[]
 */

export type ExtractRequirementsInput = {
  jobDescription: string;
};

export function buildExtractRequirementsPrompt(
  input: ExtractRequirementsInput
): string {
  // TODO: Replace with a production-quality prompt. The output should be
  // valid JSON matching the `JobRequirements` type.
  return `
You are a senior technical recruiter. Extract the key requirements from the following job description.

Return a JSON object matching this structure:
{
  "mustHave": [...],
  "niceToHave": [...],
  "technologies": [...],
  "responsibilities": [...],
  "softSkills": [...],
  "senioritySignals": [...]
}

Job Description:
${input.jobDescription}
  `.trim();
}

export type BuildResumeProfileInput = {
  resumeText: string;
};

export function buildResumeProfilePrompt(
  input: BuildResumeProfileInput
): string {
  // TODO: Implement with structured output schema enforcement.
  return `
You are a resume parsing expert. Convert this resume into a structured profile.

Return a JSON object matching the ResumeProfile type.

Resume:
${input.resumeText}
  `.trim();
}

export type MapEvidenceInput = {
  resumeText: string;
  jobDescription: string;
};

export function buildMapEvidencePrompt(input: MapEvidenceInput): string {
  // TODO: Implement evidence mapping logic with explicit strength rubric.
  return `
You are an expert at matching resume experience to job requirements.

For each job requirement, identify the matching resume evidence and assign a strength: "strong" | "medium" | "weak" | "missing".

Return a JSON array of EvidenceMapItem objects.

Resume:
${input.resumeText}

Job Description:
${input.jobDescription}
  `.trim();
}

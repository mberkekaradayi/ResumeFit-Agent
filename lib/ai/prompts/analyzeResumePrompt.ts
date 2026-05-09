/**
 * Prompt builder for the main resume-analysis pipeline.
 *
 * Prompts live here — never inside API route handlers or React components.
 * Each builder enforces the PRD principle:
 * "Never invent experience. Ground everything in resume evidence."
 */

export type ExtractRequirementsInput = {
  jobDescription: string;
};

const OUTPUT_RULES = `
IMPORTANT OUTPUT RULES:
- Return JSON only (no markdown, no commentary, no code fences).
- Do not include keys outside the requested schema.
- If uncertain, use empty arrays rather than guessing.
- Keep strings concise and specific.
`.trim();

const FACTUALITY_RULES = `
FACTUALITY RULES:
- Never fabricate technologies, metrics, ownership, or impact.
- Distinguish clearly between evidence-backed signals and missing/weak signals.
- If a requirement is implied but not explicit, treat as medium or weak, not strong.
- Use "missing" when there is no meaningful evidence in the resume.
`.trim();

export function buildExtractRequirementsPrompt(
  input: ExtractRequirementsInput
): string {
  return `
You are a senior technical recruiter. Extract structured role requirements from a job description.

Classify requirements with these enums:
- category: "technical" | "experience" | "ai_llm" | "ownership" | "communication" | "domain" | "soft_skill"
- priority: "must_have" | "nice_to_have"

Return a JSON object exactly matching:
{
  "mustHave": [
    {
      "id": "req_1",
      "text": "string",
      "category": "technical",
      "priority": "must_have",
      "keywords": ["string"],
      "explanation": "string",
      "evidenceFromJobDescription": ["exact phrase from JD"]
    }
  ],
  "niceToHave": [
    {
      "id": "req_2",
      "text": "string",
      "category": "ai_llm",
      "priority": "nice_to_have",
      "keywords": ["string"],
      "explanation": "string",
      "evidenceFromJobDescription": ["exact phrase from JD"]
    }
  ],
  "technologies": [...],
  "responsibilities": [...],
  "softSkills": [...],
  "senioritySignals": [...],
  "domainSignals": [...],
  "aiLlmSignals": [...]
}

Guidance:
- Include only role-relevant requirements (deduplicate overlaps).
- Prefer concrete, testable requirement statements over vague summaries.
- Include AI/LLM signals only if present in the JD.
- IDs must be stable and unique within this response ("req_1", "req_2", ...).
- "evidenceFromJobDescription" must quote exact supporting snippets from the JD.

${OUTPUT_RULES}

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
  return `
You are a resume parsing expert. Convert resume text into a structured evidence profile.

Return JSON exactly matching this TypeScript-like shape:
{
  "skills": string[],
  "experience": string[],
  "projects": string[],
  "education": string[],
  "technologies": string[],
  "metrics": string[],
  "ownershipSignals": string[],
  "communicationSignals": string[],
  "aiLlmSignals": string[]
}

Guidance:
- Extract explicit evidence snippets, not generic summaries.
- Keep each item atomic (one claim per item) and concise.
- Preserve important numbers/scale/impact in metrics (e.g. "$6B+", "99%+").
- Normalize synonyms (e.g. "TS" -> "TypeScript") in technologies/skills.
- Keep ordering meaningful: most recent / most relevant evidence first.
- If a section is absent, return an empty array.

${FACTUALITY_RULES}
${OUTPUT_RULES}

Resume:
${input.resumeText}
  `.trim();
}

export type MapEvidenceInput = {
  resumeText: string;
  resumeProfileJson: string;
  jobRequirementsJson: string;
};

export function buildMapEvidencePrompt(input: MapEvidenceInput): string {
  return `
You are an expert at mapping resume evidence to job requirements.

For each requirement, return an EvidenceMapItem with:
- requirementId
- requirement
- category
- priority
- matchingEvidence
- strength
- explanation

Strength rubric:
- "strong": direct, explicit, requirement-level evidence with clear role relevance AND at least one concrete anchor (technology, scope, metric, ownership, production context).
- "medium": partially supported; relevant but not fully explicit.
- "weak": adjacent/indirect signal with limited support.
- "missing": no meaningful evidence.

Strict "strong" guardrail:
- Do NOT mark "strong" if support depends on inference only.
- Do NOT mark "strong" if evidence is generic without requirement-specific anchors.
- If uncertain between strong and medium, choose medium.

Return JSON array only:
[
  {
    "requirementId": "req_1",
    "requirement": "string",
    "category": "technical",
    "priority": "must_have",
    "matchingEvidence": ["string"],
    "strength": "strong",
    "explanation": "string"
  }
]

Rules:
- Evaluate all requirements provided below.
- Use exact requirement IDs from input.
- If strength is "missing", matchingEvidence must be [].
- If strength is "strong", matchingEvidence must include at least 2 concrete snippets.
- Keep explanation specific and grounded in the resume.

Resume:
${input.resumeText}

Structured Resume Profile (JSON):
${input.resumeProfileJson}

Structured Job Requirements (JSON):
${input.jobRequirementsJson}

${FACTUALITY_RULES}
${OUTPUT_RULES}
  `.trim();
}

/**
 * Prompt builder for the factuality validation step.
 *
 * After bullet rewrites are generated, this prompt asks the model to check
 * whether each improved bullet is supported by the original resume text.
 * Unsupported claims are surfaced as FactualityWarning objects.
 */

export type ValidateFactualityInput = {
  originalResumeText: string;
  improvedBullet: string;
  originalBullet: string;
};

export function buildFactualityPrompt(
  input: ValidateFactualityInput
): string {
  return `
You are a strict factuality auditor for resume rewrites.

Task:
Evaluate whether the improved bullet is fully supported by the original resume text and original bullet.
Do NOT evaluate writing quality. Evaluate factual support only.

Risk rubric:
- "low": Improved bullet is fully supported by explicit resume evidence.
- "medium": Mostly supported, but one or more claims are implied/ambiguous and need user confirmation.
- "high": One or more meaningful claims are unsupported or newly introduced.

Claims that require explicit support:
- new technologies/languages/frameworks/tools
- new metrics, scale, user counts, revenue/business impact
- new scope/ownership (architected, led, owned end-to-end)
- new production context, deployment claims, reliability/performance claims
- new AI/LLM specifics (RAG, vector DB, tool calling, fine-tuning, evals, agent deployment)

Output rules:
- Return JSON only. No markdown or commentary.
- Extract concrete claims from the improved bullet first.
- For each unsupported/ambiguous claim, explain exactly what evidence is missing.
- If all claims are supported, set unsupportedClaims to [].

Original Resume:
${input.originalResumeText}

Original Bullet:
${input.originalBullet}

Improved Bullet:
${input.improvedBullet}

Return JSON exactly matching:
{
  "riskLevel": "low" | "medium" | "high",
  "summary": "string",
  "supportedClaims": [
    {
      "claim": "string",
      "resumeEvidence": ["exact or near-exact snippets from resume"]
    }
  ],
  "unsupportedClaims": [
    {
      "claim": "string",
      "reason": "string"
    }
  ],
  "needsUserConfirmation": [
    {
      "claim": "string",
      "reason": "string"
    }
  ]
}
  `.trim();
}

/**
 * Prompt builder for the factuality validation step.
 *
 * After bullet rewrites are generated, this prompt asks the model to check
 * whether each improved bullet is supported by the original resume text.
 * Unsupported claims are surfaced as FactualityWarning objects.
 *
 * TODO: Implement once the OpenAI client is configured.
 */

export type ValidateFactualityInput = {
  originalResumeText: string;
  improvedBullet: string;
  originalBullet: string;
};

export function buildFactualityPrompt(
  input: ValidateFactualityInput
): string {
  // TODO: Replace with a well-tuned prompt. The model should return a JSON
  // object with: { riskLevel, claims: [{ claim, reason }] }
  return `
You are an expert at detecting unsupported claims in resume rewrites.

Compare the improved bullet to the original resume. Identify any claims in the
improved bullet that are NOT supported by evidence in the original resume.

Original Resume:
${input.originalResumeText}

Original Bullet:
${input.originalBullet}

Improved Bullet:
${input.improvedBullet}

Return a JSON object:
{
  "riskLevel": "low" | "medium" | "high",
  "unsupportedClaims": [
    { "claim": "...", "reason": "..." }
  ]
}
  `.trim();
}

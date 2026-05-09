const MAX_PROMPT_RESUME_CHARS = 3500;
const MAX_PROMPT_JOB_DESCRIPTION_CHARS = 2500;

export const RETRY_PROMPT_RESUME_CHARS = 2200;
export const RETRY_PROMPT_JOB_DESCRIPTION_CHARS = 1600;

export function preprocessResumeForPrompt(text: string): string {
  const cleaned = sanitizeExtractedText(text);
  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/[ \t]{2,}/g, " "));

  const highSignal = lines.filter((line) => isResumeHighSignalLine(line));
  const selected = selectBestLines(lines, highSignal, 14);
  return compactForPrompt(selected.join("\n"), MAX_PROMPT_RESUME_CHARS);
}

export function preprocessJobDescriptionForPrompt(text: string): string {
  const cleaned = sanitizeExtractedText(text);
  const lines = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/[ \t]{2,}/g, " "));

  const highSignal = lines.filter((line) => isJobDescriptionHighSignalLine(line));
  const selected = selectBestLines(lines, highSignal, 16);
  return compactForPrompt(selected.join("\n"), MAX_PROMPT_JOB_DESCRIPTION_CHARS);
}

export function compactForPrompt(text: string, maxChars: number): string {
  const normalized = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars)}\n[TRUNCATED FOR SPEED]`;
}

function sanitizeExtractedText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/[|•●▪◦■□◆◇►▶]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function isResumeHighSignalLine(line: string): boolean {
  const lower = line.toLowerCase();
  if (lower.length < 3) return false;
  if (isMostlyContactLine(lower)) return false;
  if (
    /\b(software engineer|developer|intern|co-?op|work experience|projects?|technical skills?)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (
    /\b(experience|work experience|projects|technical skills|skills|education|backend|frontend|ai|tools)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/^(•|-|\*)\s/.test(line)) return true;
  if (
    /\b(\$|%|k\+|m\+|b\+|users?|latency|throughput|reliability|scale|performance)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (
    /\b(react|next\.?js|typescript|javascript|node\.?js|graphql|aws|python|sql|postgres|redis|llm|prompt|mcp)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

function isJobDescriptionHighSignalLine(line: string): boolean {
  const lower = line.toLowerCase();
  if (lower.length < 3) return false;
  if (
    /\b(equal opportunity|we are an equal|accommodation|privacy policy|benefits|perks|compensation range|salary range)\b/i.test(
      lower
    )
  ) {
    return false;
  }
  if (
    /\b(requirements?|must have|nice to have|responsibilities|what you'll do|qualifications|preferred|experience with|you will|you should)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/^(•|-|\*)\s/.test(line)) return true;
  if (
    /\b(react|next\.?js|typescript|javascript|node\.?js|graphql|aws|python|sql|postgres|redis|llm|ai|ml|prompt)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

function isMostlyContactLine(lowerLine: string): boolean {
  const hasContactToken =
    /\b(@|linkedin|github|portfolio|phone|email|www\.|https?:\/\/)\b/i.test(
      lowerLine
    ) || /\+?\d[\d\s().-]{7,}/.test(lowerLine);
  const hasWorkSignal =
    /\b(experience|project|built|led|developed|improved|reduced|increased|engineer|developer)\b/i.test(
      lowerLine
    );
  return hasContactToken && !hasWorkSignal;
}

function selectBestLines(
  allLines: string[],
  highSignalLines: string[],
  minLineCount: number
): string[] {
  if (highSignalLines.length >= minLineCount) {
    return dedupePreserveOrder(highSignalLines);
  }

  const merged = dedupePreserveOrder([
    ...highSignalLines,
    ...allLines.slice(0, Math.min(allLines.length, minLineCount * 2)),
  ]);

  return merged.length > 0 ? merged : allLines;
}

function dedupePreserveOrder(lines: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of lines) {
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }
  return result;
}

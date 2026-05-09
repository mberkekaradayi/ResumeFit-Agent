import { getOpenAIClient } from "../openaiClient";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_STAGE_TIMEOUT_MS = 60000;

export async function runJsonPrompt<T>(
  client: ReturnType<typeof getOpenAIClient>,
  prompt: string,
): Promise<T> {
  const response = await withTimeout(
    client.responses.create({
      model: DEFAULT_MODEL,
      input: prompt,
    }),
    OPENAI_STAGE_TIMEOUT_MS,
    "OpenAI stage timed out.",
  );

  const text = response.output_text;
  if (!text) throw new Error("Model returned empty output.");

  return safeJsonParse<T>(text);
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error(timeoutMessage)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

function safeJsonParse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) {
      throw new Error("Model output is not valid JSON.");
    }
    return JSON.parse(match[0]) as T;
  }
}

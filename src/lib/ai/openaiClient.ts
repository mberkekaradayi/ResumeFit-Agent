/**
 * OpenAI client factory.
 *
 * Keeps the API key and client config in one place. Import `getOpenAIClient()`
 * in server-only lib functions — never import this in a Client Component or
 * a file that gets bundled for the browser.
 */

import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

/**
 * OpenAI client factory.
 *
 * Keeps the API key and client config in one place. Import `getOpenAIClient()`
 * in server-only lib functions — never import this in a Client Component or
 * a file that gets bundled for the browser.
 *
 * TODO: Run `npm install openai` and uncomment the real implementation below.
 */

// import OpenAI from "openai";

// let _client: OpenAI | null = null;

// export function getOpenAIClient(): OpenAI {
//   if (!_client) {
//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       throw new Error("OPENAI_API_KEY environment variable is not set.");
//     }
//     _client = new OpenAI({ apiKey });
//   }
//   return _client;
// }

/** Placeholder until `openai` package is installed. */
export function getOpenAIClient(): never {
  throw new Error(
    "OpenAI client is not yet configured. Run `npm install openai` and add OPENAI_API_KEY to .env.local."
  );
}

/**
 * PDF text extraction helper (server-side only).
 *
 * TODO: Choose a PDF library and install it:
 *   - `npm install pdf-parse`  (simpler, works for most text-based PDFs)
 *   - `npm install pdfjs-dist` (more robust, handles more edge cases)
 *
 * Once installed, replace the placeholder below with the real implementation.
 */

export type ExtractResult = {
  text: string;
  isPartial: boolean;
  warning?: string;
};

/** Minimum number of characters considered a valid extraction */
const MIN_TEXT_LENGTH = 200;

/**
 * Extracts plain text from a PDF buffer.
 *
 * @param buffer - The raw PDF file as a Buffer or ArrayBuffer.
 * @returns The extracted text, a flag indicating partial extraction, and an
 *          optional human-readable warning.
 */
export async function extractResumeText(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  buffer: Buffer | ArrayBuffer
): Promise<ExtractResult> {
  // TODO: Implement using pdf-parse:
  //
  // import pdfParse from "pdf-parse";
  // const data = await pdfParse(Buffer.from(buffer));
  // const text = data.text.trim();
  // return {
  //   text,
  //   isPartial: text.length < MIN_TEXT_LENGTH,
  //   warning:
  //     text.length < MIN_TEXT_LENGTH
  //       ? "The PDF text appears incomplete. Please paste your resume text manually."
  //       : undefined,
  // };

  const placeholder = "[PDF parsing not yet implemented]";

  return {
    text: placeholder,
    isPartial: true,
    warning:
      "PDF parsing is not yet configured. Please paste your resume text manually in the editor.",
  };
}

export { MIN_TEXT_LENGTH };

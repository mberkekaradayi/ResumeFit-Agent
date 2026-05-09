/**
 * PDF text extraction helper (server-side only).
 *
 * Uses an isolated Node subprocess for PDF extraction to avoid Turbopack
 * module/worker resolution issues in the route runtime.
 */
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type ExtractResult = {
  text: string;
  isPartial: boolean;
  warning?: string;
};

/** Minimum number of characters considered a valid extraction */
const MIN_TEXT_LENGTH = 200;
const MAX_PDF_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const PARSER_TIMEOUT_MS = 15000;

export type PdfExtractionErrorCode =
  | "PDF_TOO_LARGE"
  | "PDF_PARSE_TIMEOUT"
  | "PDF_PARSE_FAILED";

export class PdfExtractionError extends Error {
  constructor(
    message: string,
    public readonly code: PdfExtractionErrorCode
  ) {
    super(message);
    this.name = "PdfExtractionError";
  }
}

/**
 * Extracts plain text from a PDF buffer.
 *
 * @param buffer - The raw PDF file as a Buffer or ArrayBuffer.
 * @returns The extracted text, a flag indicating partial extraction, and an
 *          optional human-readable warning.
 */
export async function extractResumeText(
  buffer: Buffer | ArrayBuffer
): Promise<ExtractResult> {
  const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  if (fileBuffer.byteLength > MAX_PDF_FILE_BYTES) {
    throw new PdfExtractionError(
      `PDF is too large (${Math.ceil(
        fileBuffer.byteLength / (1024 * 1024)
      )}MB). Max allowed size is ${MAX_PDF_FILE_BYTES / (1024 * 1024)}MB.`,
      "PDF_TOO_LARGE"
    );
  }

  try {
    const normalizedText = normalizeExtractedText(
      await extractTextInSubprocess(fileBuffer)
    );
    const isPartial = normalizedText.length < MIN_TEXT_LENGTH;

    return {
      text: normalizedText,
      isPartial,
      warning: isPartial
        ? "We could not extract enough text from this PDF. It may be scanned or image-based. Please review and paste your resume text manually if needed."
        : undefined,
    };
  } catch (error: unknown) {
    if (error instanceof PdfExtractionError) throw error;

    console.error("[extractResumeText] PDF extraction failed:", error);
    throw new PdfExtractionError("Failed to parse PDF text.", "PDF_PARSE_FAILED");
  }
}

export { MIN_TEXT_LENGTH, MAX_PDF_FILE_BYTES };

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractTextInSubprocess(fileBuffer: Buffer): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), "resumefit-pdf-"));
  const tempPdfPath = join(tempDir, "resume.pdf");
  await writeFile(tempPdfPath, fileBuffer);

  const script = `
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { readFile } from "node:fs/promises";

const filePath = process.argv[1];
const data = await readFile(filePath);
const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data), isEvalSupported: false });
const pdfDocument = await loadingTask.promise;

let text = "";
for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum += 1) {
  const page = await pdfDocument.getPage(pageNum);
  const textContent = await page.getTextContent();
  const pageText = textContent.items
    .map((item) => ("str" in item ? item.str : ""))
    .join(" ");
  text += pageText + "\\n\\n";
  page.cleanup();
}

await pdfDocument.destroy();
process.stdout.write(JSON.stringify({ text }));
`;

  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      ["--input-type=module", "-e", script, tempPdfPath],
      {
        maxBuffer: 50 * 1024 * 1024,
        timeout: PARSER_TIMEOUT_MS,
      }
    );

    const parsed = JSON.parse(stdout) as { text?: string };
    return parsed.text ?? "";
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException & { killed?: boolean };
    if (err?.killed || err?.message?.includes("timed out")) {
      throw new PdfExtractionError(
        "PDF parsing timed out. Please try a smaller or simpler PDF.",
        "PDF_PARSE_TIMEOUT"
      );
    }

    throw new PdfExtractionError(
      "Failed to parse PDF in isolated parser process.",
      "PDF_PARSE_FAILED"
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

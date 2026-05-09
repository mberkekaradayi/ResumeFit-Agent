/**
 * POST /api/parse-resume
 *
 * Accepts a PDF file as multipart/form-data and returns extracted plain text.
 *
 * Request: FormData with a "file" field containing the PDF.
 * Response: ParseResumeResponse JSON
 *
 * The actual extraction logic lives in lib/pdf/extractResumeText.ts so this
 * route stays thin and the extractor can be unit tested independently.
 */

import {
  extractResumeText,
  MAX_PDF_FILE_BYTES,
  PdfExtractionError,
} from "@/lib/pdf/extractResumeText";
import type { ParseResumeResponse } from "@/types/api.types";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { message: "Invalid request. Expected multipart/form-data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return Response.json(
      { message: "No file provided. Send a PDF under the 'file' field." },
      { status: 400 }
    );
  }

  if (
    file.type !== "application/pdf" &&
    !(file instanceof File && file.name.toLowerCase().endsWith(".pdf"))
  ) {
    return Response.json(
      { message: "Invalid file type. Only PDF files are accepted." },
      { status: 400 }
    );
  }

  if (file.size > MAX_PDF_FILE_BYTES) {
    return Response.json(
      {
        message: `PDF is too large. Max size is ${MAX_PDF_FILE_BYTES / (1024 * 1024)}MB.`,
        code: "PDF_TOO_LARGE",
      },
      { status: 413 }
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    const result = await extractResumeText(buffer);

    const response: ParseResumeResponse = {
      extractedText: result.text,
      isPartial: result.isPartial,
      warning: result.warning,
    };

    return Response.json(response);
  } catch (err: unknown) {
    console.error("[parse-resume] Extraction error:", err);

    if (err instanceof PdfExtractionError) {
      const status =
        err.code === "PDF_TOO_LARGE"
          ? 413
          : err.code === "PDF_PARSE_TIMEOUT"
          ? 408
          : 422;

      return Response.json(
        {
          message:
            err.code === "PDF_PARSE_TIMEOUT"
              ? "PDF parsing took too long. Please try a smaller PDF or paste resume text manually."
              : err.message,
          code: err.code,
        },
        { status }
      );
    }

    return Response.json(
      {
        message:
          "Failed to extract text from the PDF. Please try a different file or paste your resume text manually.",
        code: "PDF_PARSE_FAILED",
      },
      { status: 500 }
    );
  }
}

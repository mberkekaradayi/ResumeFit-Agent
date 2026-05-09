/**
 * Input validation for the analyze API call.
 *
 * Pure functions — no side effects, no I/O. Easy to unit test.
 */

import {
  MIN_RESUME_TEXT_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
  MAX_RESUME_TEXT_LENGTH,
  MAX_JOB_DESCRIPTION_LENGTH,
} from "../constants/analysis.constants";

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: ValidationError[] };

export type ValidationError = {
  field: "resumeText" | "jobDescription";
  message: string;
};

/**
 * Validates that the analysis inputs meet minimum quality requirements before
 * sending them to the AI pipeline.
 */
export function validateAnalysisInput(
  resumeText: string,
  jobDescription: string,
): ValidationResult {
  const errors: ValidationError[] = [];
  const resumeLength = resumeText.trim().length;
  const jdLength = jobDescription.trim().length;

  if (!resumeText || resumeText.trim().length === 0) {
    errors.push({
      field: "resumeText",
      message: "Resume text is required.",
    });
  } else if (resumeLength < MIN_RESUME_TEXT_LENGTH) {
    errors.push({
      field: "resumeText",
      message: `Resume text is too short (${resumeLength} characters). Please paste the full resume text — at least ${MIN_RESUME_TEXT_LENGTH} characters are needed for a meaningful analysis.`,
    });
  } else if (resumeLength > MAX_RESUME_TEXT_LENGTH) {
    errors.push({
      field: "resumeText",
      message: `Resume text is too long (${resumeLength} characters). Please keep it under ${MAX_RESUME_TEXT_LENGTH} characters for reliable analysis.`,
    });
  }

  if (!jobDescription || jobDescription.trim().length === 0) {
    errors.push({
      field: "jobDescription",
      message: "Job description is required.",
    });
  } else if (jdLength < MIN_JOB_DESCRIPTION_LENGTH) {
    errors.push({
      field: "jobDescription",
      message: `Job description is too short (${jdLength} characters). Please paste the full job description — at least ${MIN_JOB_DESCRIPTION_LENGTH} characters are needed.`,
    });
  } else if (jdLength > MAX_JOB_DESCRIPTION_LENGTH) {
    errors.push({
      field: "jobDescription",
      message: `Job description is too long (${jdLength} characters). Please keep it under ${MAX_JOB_DESCRIPTION_LENGTH} characters. Remove repetitive sections (benefits/company info) and keep role requirements.`,
    });
  }

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true };
}

/**
 * Input validation for the analyze API call.
 *
 * Pure functions — no side effects, no I/O. Easy to unit test.
 */

import {
  MIN_RESUME_TEXT_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
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

  if (!resumeText || resumeText.trim().length === 0) {
    errors.push({
      field: "resumeText",
      message: "Resume text is required.",
    });
  } else if (resumeText.trim().length < MIN_RESUME_TEXT_LENGTH) {
    errors.push({
      field: "resumeText",
      message: `Resume text is too short (${resumeText.trim().length} characters). Please paste the full resume text — at least ${MIN_RESUME_TEXT_LENGTH} characters are needed for a meaningful analysis.`,
    });
  }

  if (!jobDescription || jobDescription.trim().length === 0) {
    errors.push({
      field: "jobDescription",
      message: "Job description is required.",
    });
  } else if (jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
    errors.push({
      field: "jobDescription",
      message: `Job description is too short (${jobDescription.trim().length} characters). Please paste the full job description — at least ${MIN_JOB_DESCRIPTION_LENGTH} characters are needed.`,
    });
  }

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true };
}

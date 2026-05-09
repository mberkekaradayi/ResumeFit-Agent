# ResumeFit Agent — Product Requirements Document (v1, Updated MVP)

## 1. Product Summary

ResumeFit Agent is a lightweight job-search assistant that estimates resume-to-role fit quickly and clearly.

The current MVP is intentionally narrow:
- User pastes resume text
- User pastes job description text
- App returns:
  - one overall fit score
  - one fit label (`weak` / `moderate` / `strong`)
  - one concise summary split into:
    - strongest fit
    - biggest gaps
    - next steps

This version prioritizes reliability, speed, and clarity over depth.

---

## 2. Core Problem

Job seekers need fast signal on whether a resume aligns with a role and what to improve next.

Most tools are either too generic or too slow/noisy for practical iteration.

This MVP solves that by giving a compact, actionable result in one screen.

---

## 3. Target User

Primary:
- Software engineers and technical candidates applying to product, platform, or AI-related roles.

Secondary:
- Career switchers who need clear fit guidance and concrete next steps.

---

## 4. MVP Scope (Current)

### In Scope

1. Manual text input (form-first)
   - Resume text textarea
   - Job description textarea
   - Character limit validation

2. Single analysis API call
   - Returns score + summary only
   - Uses AI first
   - Falls back to deterministic heuristic output if AI fails or is incomplete

3. Results screen
   - Centerpiece score card (percentage + label + explanation)
   - Three summary sections:
     - Strongest fit
     - Biggest gaps
     - Next steps
   - Fallback transparency banner (when heuristic mode is used)

4. Dark, report-style UI
   - Strong visual hierarchy
   - High contrast readability
   - Professional “data report” tone

### Out of Scope (for this MVP)

- PDF upload/parsing
- Detailed requirement evidence map UI
- Category score breakdown UI
- Bullet rewrite generation UI
- Interview prep UI
- Persistent history/database
- ATS prediction claims

---

## 5. Functional Requirements

### 5.1 Input

- User can paste resume text.
- User can paste job description text.
- Submit button is blocked when inputs exceed configured max lengths.
- Validation feedback is shown inline.

### 5.2 Analysis

- Client calls `POST /api/analyze`.
- Server preprocesses text for signal quality and token efficiency.
- Server attempts AI analysis.
- If AI fails/times out/returns insufficient output, server returns heuristic fallback analysis.

### 5.3 Output Contract

Response must include:
- `matchScore.overall` (0-100)
- `matchScore.label` (`weak` | `moderate` | `strong`)
- `matchScore.explanation` (short sentence)
- `summary.strongestFit` (2-3 items)
- `summary.biggestGaps` (2-3 items)
- `summary.nextSteps` (2-3 items)
- `meta.engine` (`ai` | `heuristic_fallback`)
- `meta.warnings` (optional diagnostic context)

---

## 6. API Shape

### Request

```json
{
  "resumeText": "string",
  "jobDescription": "string"
}
```

### Response

```json
{
  "matchScore": {
    "overall": 80,
    "label": "strong",
    "explanation": "Estimated alignment based on role-relevant metrics and stack overlap.",
    "categoryScores": {}
  },
  "summary": {
    "strongestFit": ["string", "string"],
    "biggestGaps": ["string", "string"],
    "nextSteps": ["string", "string"]
  },
  "meta": {
    "engine": "ai",
    "warnings": []
  }
}
```

Notes:
- `categoryScores` is currently empty by design in MVP.
- `meta.engine` is required for transparency.

---

## 7. AI Behavior Requirements

- Output must be factual and evidence-grounded.
- No invented technologies, ownership, scope, or metrics.
- Score is an estimated alignment signal, not certainty.
- Summary should be concise and actionable.

---

## 8. UX Requirements

Input screen:
- Clear step labels
- Legible dark theme
- Fast feedback for invalid lengths

Result screen:
- Score should be visually dominant
- Summary buckets should be easy to scan
- Fallback mode should be visibly indicated

---

## 9. Reliability Requirements

- Never return empty unusable response.
- On AI failure, return heuristic fallback response with same shape.
- Include warnings for fallback diagnostics.
- Timeouts should be bounded and user-visible.

---

## 10. Privacy Principle

- No server-side long-term storage of user resume/JD content in MVP.
- Data used only for immediate analysis request.

---

## 11. Success Criteria (MVP)

MVP is successful if users can:
1. Paste resume + JD and get a result consistently.
2. Understand fit level in under 10 seconds from viewing results.
3. Identify concrete gaps and next actions without reading dense output.
4. Receive meaningful output even when AI path is unavailable (fallback mode).

---

## 12. Future Expansion (Post-MVP)

- Re-enable optional deep analysis modules:
  - evidence map details
  - rewrite suggestions
  - interview prep
- Add async job status with real progress events
- Add role-specific scoring profiles
- Add saved sessions/history

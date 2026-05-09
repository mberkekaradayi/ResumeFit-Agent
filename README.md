# ResumeFit Agent (MVP)

ResumeFit Agent is a form-first resume-to-job fit analyzer built with Next.js.

Current MVP focuses on:

- fast score + summary output
- resilient fallback behavior (AI first, deterministic fallback when needed)
- clean, high-contrast dark UI for quick scanning

## What The App Does

User provides:

- resume text (manual paste)
- job description text (manual paste)

App returns:

- overall fit score (`0-100`)
- fit label (`weak`, `moderate`, `strong`)
- concise summary:
  - strongest fit
  - biggest gaps (optional for strong fit)
  - next steps (optional for strong fit)

The backend always attempts AI first, then falls back to heuristic scoring if AI fails or returns incomplete output.

## Tech Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS + shadcn/ui
- OpenAI Responses API

## Project Structure (Key Paths)

- `src/app/api/analyze/route.ts` — analysis API endpoint
- `src/lib/ai/analysisPipeline.ts` — orchestration (AI attempt + retry + fallback)
- `src/lib/ai/prompts/analyzeResumePrompt.ts` — core prompt builder
- `src/lib/ai/pipeline/` — pipeline modules:
  - `preprocess.ts`
  - `jsonRunner.ts`
  - `heuristicFallback.ts`
- `src/features/resume-analysis/components/` — input + results UI
- `src/features/resume-analysis/hooks/useResumeAnalysis.ts` — client analysis flow
- `src/features/resume-analysis/lib/normalizeAnalysisResponse.ts` — response normalization
- `PRD-v1.md` — MVP product spec

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env:

```bash
cp .env.local.example .env.local
```

3. Set your OpenAI key/model in `.env.local`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run build
npm run lint
```

## MVP Notes

- PDF upload/parsing is intentionally removed from current MVP.
- No database/history is used.
- Score is an estimated alignment signal, not hiring certainty.
- Fallback mode is surfaced in UI via `meta.engine` and `meta.warnings`.

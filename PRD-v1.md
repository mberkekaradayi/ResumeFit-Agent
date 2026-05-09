# ResumeFit Agent — Product Requirements Document (v1)

## 1. Product Summary

ResumeFit Agent is an AI-powered resume analysis tool that compares a user’s resume against a specific job description and generates an evidence-based fit analysis, gap report, and truthful resume rewrite suggestions.

The core workflow is:

**Resume PDF + Job Description → AI extracts job requirements → AI maps resume evidence to those requirements → AI scores role fit → AI identifies gaps → AI suggests factual resume bullet improvements**

ResumeFit Agent is not a generic resume writer. It is an evidence-based resume tailoring agent.

Every recommendation should either be:

- Supported by the user’s existing resume evidence, or
- Clearly marked as a gap, risk, or claim that requires user confirmation.

## 2. Core Problem

Job seekers often struggle to understand how well their resume matches a job description. They may also know they need to tailor their resume, but they are unsure how to improve their wording without exaggerating or inventing experience.

Most resume tools focus on rewriting, but they often introduce unsupported claims, fake metrics, or keywords that are not actually backed by the user’s experience.

ResumeFit Agent solves this by helping users:

- Understand how well their resume matches a role
- See which job requirements are strongly supported by their resume
- Identify weak or missing areas
- Rewrite bullets using only factual, resume-backed evidence
- Prepare for interviews based on the actual role and their resume gaps

## 3. Target User

The MVP is designed for job seekers applying to technical roles, especially:

- Software engineering roles
- AI engineering roles
- Data roles
- Full-stack roles
- Frontend roles
- Backend roles
- Engineering internships or new-grad roles
- Technical product or platform roles

## 4. Product Positioning

ResumeFit Agent should position itself as a truthful resume optimization tool.

The product should **not** say:

- “We guarantee a better ATS score.”

Instead, it should say:

- “We help you understand how your resume aligns with a role and suggest factual improvements based on your existing experience.”

The main differentiator is:

**Requirement → Resume Evidence → Fit Strength → Gap → Rewrite → Factuality Risk**

## 5. MVP Features

### 5.1 Resume Upload

Users can upload a PDF resume.

The app should:

- Accept PDF files
- Extract text from the PDF
- Display the extracted resume text
- Allow the user to manually edit the extracted text before analysis
- Show a warning if the PDF cannot be parsed properly
- Show a warning if the extracted text is too short or incomplete

**Acceptance Criteria**

A user should be able to:

- Upload a resume PDF
- See the extracted text
- Edit the extracted text
- Continue even if PDF parsing is imperfect

### 5.2 Job Description Input

Users can paste a full job description into a text area.

The app should:

- Accept plain text job descriptions
- Validate that enough text was entered
- Allow the user to edit the job description before analysis
- Show a helpful error if the job description is too short

**Acceptance Criteria**

A user should be able to:

- Paste a job description
- Edit it before running analysis
- Receive validation feedback if the input is too short

### 5.3 Job Requirement Extraction

The AI extracts the most important requirements from the job description.

The extracted requirements should include:

- Must-have requirements
- Nice-to-have requirements
- Technologies
- Responsibilities
- Soft skills
- Seniority signals
- Domain-specific signals
- AI/LLM-specific requirements, if present

**Example Extracted Requirements**

Must-have:

- React
- TypeScript
- Production frontend experience
- Ownership of complex features

Nice-to-have:

- LLM experience
- RAG systems
- Customer-facing AI product experience

Soft skills:

- Cross-functional communication
- Product thinking
- Ability to work independently

Each requirement should include:

- Requirement text
- Category
- Priority
- Keywords
- Explanation of why it matters for the role

### 5.4 Resume Profile Extraction

The AI should convert the resume text into a structured profile.

The resume profile may include:

- Work experience
- Projects
- Education
- Technical skills
- Tools and frameworks
- Metrics
- Business impact
- Leadership signals
- Ownership signals
- AI/LLM experience
- Communication or collaboration evidence

This structured profile is used for evidence mapping, scoring, and rewrite suggestions.

### 5.5 Resume Evidence Mapping

The AI compares the resume against the extracted job requirements.

For each job requirement, the app should show:

- Requirement
- Matching resume evidence
- Strength rating
- Explanation
- Missing or weak evidence, if applicable

**Strength levels**

- Strong
- Medium
- Weak
- Missing

**Example**

- **Requirement:** Production systems experience
- **Matching Resume Evidence:** Built Coinbase trading flows; Worked on systems supporting $6B+ trading activity; Improved reliability for user-facing flows; Maintained 99%+ E2E stability
- **Strength:** Strong
- **Explanation:** The resume includes clear production experience, business impact, scale, and reliability metrics.

**Strength Definitions**

- **Strong:** The resume directly supports the requirement with clear experience, technologies, impact, or metrics.
- **Medium:** The resume partially supports the requirement, but the connection is not fully explicit.
- **Weak:** The resume has adjacent experience, but the evidence is limited or indirect.
- **Missing:** The resume does not show meaningful evidence for this requirement.

### 5.6 Fit Scoring

The app generates fit scores based on the evidence map.

The score should be presented as an estimate, not an objective hiring prediction.

The app should generate:

- Overall match score
- Technical fit score
- Experience fit score
- Ownership fit score
- Communication fit score
- AI/LLM fit score, only if relevant to the job description
- Other dynamic category scores when applicable

**Example**

- Overall Match: 82%
- Technical Fit: 90%
- Experience Fit: 84%
- Ownership Fit: 86%
- AI/LLM Fit: 72%
- Communication Fit: 78%

**Scoring Principle**

Scores should be explainable and based on requirement coverage.

**Suggested scoring logic**

- Strong = 1.0
- Medium = 0.65
- Weak = 0.35
- Missing = 0.0

Must-have requirements should have more weight than nice-to-have requirements.

**Example weighting**

- Must-have requirement: 1.5×
- Nice-to-have requirement: 1.0×

The overall score should be calculated from the weighted evidence map rather than generated as a random AI estimate.

**Score Disclaimer**

The app should clearly communicate:

> This score is an estimated role alignment score based on the job description and resume evidence. It is not a guarantee of ATS performance, recruiter response, or hiring outcome.

### 5.7 Gap Analysis

The AI identifies strong, weak, and missing areas.

The goal is to help users understand:

- What their resume already supports well
- What they should clarify
- What they may need to explain in interviews
- What claims they should avoid making
- What skills or project experience they may want to build over time

**Example**

Strong Areas:

- React
- TypeScript
- Production systems
- Ownership
- User-facing engineering work

Weak Areas:

- RAG experience
- Formal LLM evaluation frameworks
- Direct AI agent deployment
- Customer-facing AI product delivery

Missing Areas:

- Tool calling
- Vector databases
- Prompt evaluation workflows

Each gap should include a short explanation.

### 5.8 Bullet Rewrite Suggestions

The AI suggests tailored resume bullet rewrites based on the job description.

Each suggestion should include:

- Original bullet
- Improved bullet
- Targeted job requirements
- Supporting resume evidence
- Why the rewrite is better
- Factuality risk level
- Factuality notes

**Risk Levels**

- **Low:** The rewrite is fully supported by the original resume.
- **Medium:** The rewrite is likely supported, but the user should confirm details.
- **High:** The rewrite introduces unsupported claims or details not found in the resume.

**Example**

- **Original Bullet:** Built frontend components for trading workflows using React and TypeScript.
- **Improved Bullet:** Built production React and TypeScript trading workflows supporting high-volume user activity and reliable end-to-end experiences.
- **Targeted Requirements:** React; TypeScript; Production systems; User-facing engineering
- **Why This Is Better:** The improved bullet connects the technical work to production impact and role-relevant requirements.
- **Risk Level:** Low
- **Factuality Notes:** Supported by resume evidence mentioning React, TypeScript, trading flows, production usage, and reliability.

### 5.9 Factuality Guardrail

The app must not blindly rewrite resume bullets.

Before presenting a rewrite, the AI should check whether the improved bullet is supported by the original resume.

The app should flag rewrites that introduce unsupported claims.

**Claims That Require Resume Evidence**

The AI should flag a rewrite if it introduces new claims related to:

- New technologies
- New programming languages
- New frameworks
- New metrics
- New business impact
- New scale claims
- New AI/LLM techniques
- RAG
- Tool calling
- Fine-tuning
- Vector databases
- Production deployment
- Customer-facing work
- Leadership
- Architecture ownership
- Revenue impact
- User count
- Performance improvements
- Reliability improvements
- Cross-functional ownership

**Example Unsafe Rewrite**

- **Original:** Built React components for dashboard pages.
- **Unsafe rewrite:** Architected a customer-facing AI dashboard used by 100K+ users.

The app should flag this as:

- **Risk Level:** High
- **Reason:** This rewrite introduces architecture ownership, AI experience, customer-facing scope, and a 100K+ user metric that are not supported by the original resume.

### 5.10 Interview Prep

The AI generates likely interview questions based on the resume and job description.

Each interview question should include:

- Question
- Why they may ask it
- Relevant resume evidence
- Suggested talking points
- Related gap, if applicable

**Example**

- **Question:** Can you describe a production system you worked on and how you ensured reliability?
- **Why They May Ask:** The job description emphasizes production ownership and reliable user-facing systems.
- **Relevant Resume Evidence:** Coinbase trading flows; 99%+ E2E stability; High-volume trading activity
- **Suggested Talking Points:** Explain the user-facing workflow; Describe your specific contribution; Mention reliability or testing improvements; Connect the work to business or user impact

## 6. Core AI Workflow

The MVP should use a multi-step AI pipeline.

1. Extract resume text from PDF
2. Let user review and edit extracted resume text
3. Parse job description
4. Extract structured job requirements
5. Normalize resume into a structured resume profile
6. Map resume evidence to each job requirement
7. Calculate fit scores from the evidence map
8. Identify strong, weak, and missing areas
9. Generate bullet rewrite suggestions
10. Validate rewrite factuality against the original resume
11. Generate interview prep questions
12. Return structured analysis to the UI

## 7. Suggested Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### AI

- OpenAI API
- Structured JSON outputs
- Multi-step prompting or server-side pipeline

### PDF Parsing

Use a PDF parser to extract resume text.

Possible options:

- pdf-parse
- pdfjs-dist
- Any reliable PDF text extraction library

### Storage

No database is required for the MVP.

Use:

- React state for current session data
- Optional localStorage for preserving the latest analysis locally

Add a database later only if the product needs:

- User accounts
- Saved resumes
- Saved job descriptions
- Analysis history
- Shareable reports
- Team or recruiter features

## 8. Main Screens

### 8.1 Input Screen

The input screen should include:

- Product title and short explanation
- Resume PDF upload
- Extracted resume text preview
- Editable resume text area
- Job description text area
- Analyze button
- Loading state
- Basic validation messages

**Input Screen User Flow**

User uploads resume PDF → App extracts resume text → User reviews and edits resume text → User pastes job description → User clicks Analyze → App runs AI pipeline → User lands on Results screen

### 8.2 Results Screen

The results screen should include:

- Overall match score
- Category scores
- Score explanation
- Extracted job requirements
- Requirement-to-evidence map
- Gap analysis
- Bullet rewrite suggestions
- Factuality warnings
- Interview prep questions
- Copy buttons for improved bullets
- Optional button to start a new analysis

**Recommended Results Layout**

1. **Summary** — Overall match score; Top strengths; Top gaps
2. **Category Scores** — Technical fit; Experience fit; Ownership fit; Communication fit; AI/LLM fit, if relevant
3. **Requirement Evidence Map** — Requirement; Evidence; Strength; Explanation
4. **Gap Analysis** — Strong areas; Weak areas; Missing areas
5. **Bullet Rewrite Suggestions** — Original bullet; Improved bullet; Targeted requirements; Risk level; Copy button
6. **Factuality Warnings** — Unsupported claims; Claims requiring user confirmation
7. **Interview Prep** — Likely questions; Why they may ask; Suggested talking points

## 9. API Shape

### Request

```ts
type AnalyzeRequest = {
  resumeText: string;
  jobDescription: string;
};
```

### Response

```ts
type AnalyzeResponse = {
  jobRequirements: JobRequirements;
  resumeProfile: ResumeProfile;
  matchScore: MatchScore;
  evidenceMap: EvidenceMapItem[];
  gaps: GapAnalysis;
  rewrites: BulletRewrite[];
  factualityWarnings: FactualityWarning[];
  interviewPrep: InterviewQuestion[];
};
```

### Suggested Type Definitions

```ts
type RequirementCategory =
  | "technical"
  | "experience"
  | "ai_llm"
  | "ownership"
  | "communication"
  | "domain"
  | "soft_skill";

type RequirementPriority = "must_have" | "nice_to_have";

type Requirement = {
  id: string;
  text: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  keywords: string[];
  explanation: string;
};

type JobRequirements = {
  mustHave: Requirement[];
  niceToHave: Requirement[];
  technologies: string[];
  responsibilities: string[];
  softSkills: string[];
  senioritySignals: string[];
};

type ResumeProfile = {
  skills: string[];
  experience: string[];
  projects: string[];
  education: string[];
  technologies: string[];
  metrics: string[];
  ownershipSignals: string[];
  communicationSignals: string[];
  aiLlmSignals: string[];
};

type EvidenceStrength = "strong" | "medium" | "weak" | "missing";

type EvidenceMapItem = {
  requirementId: string;
  requirement: string;
  category: RequirementCategory;
  priority: RequirementPriority;
  matchingEvidence: string[];
  strength: EvidenceStrength;
  explanation: string;
};

type MatchScore = {
  overall: number;
  categoryScores: {
    technical?: number;
    experience?: number;
    aiLlm?: number;
    ownership?: number;
    communication?: number;
    domain?: number;
  };
  explanation: string;
};

type GapAnalysis = {
  strongAreas: string[];
  weakAreas: string[];
  missingAreas: string[];
};

type RewriteRisk = "low" | "medium" | "high";

type BulletRewrite = {
  originalBullet: string;
  improvedBullet: string;
  targetedRequirements: string[];
  supportingEvidence: string[];
  whyBetter: string;
  riskLevel: RewriteRisk;
  factualityNotes: string[];
};

type FactualityWarning = {
  claim: string;
  reason: string;
  riskLevel: RewriteRisk;
  relatedBullet?: string;
};

type InterviewQuestion = {
  question: string;
  whyTheyMayAsk: string;
  relevantResumeEvidence: string[];
  suggestedTalkingPoints: string[];
  relatedGap?: string;
};
```

## 10. Error States

The MVP should handle common errors clearly.

### Resume Errors

- Uploaded file is not a PDF
- PDF text extraction failed
- Extracted resume text is too short
- Resume appears to be image-based or scanned
- User needs to manually paste resume text

### Job Description Errors

- Job description is too short
- Job description appears incomplete
- Job description is not role-related text

### AI Errors

- AI analysis failed
- AI returned invalid structured output
- Request exceeded token limit
- Analysis could not be completed

**UI Error Example**

> We could not extract enough text from this PDF. Please paste your resume text manually or upload a text-based PDF.

## 11. Privacy Principle

The MVP should avoid unnecessary storage of sensitive user data.

ResumeFit Agent should follow this principle:

Resume and job description data should only be processed for the current analysis session. The app should not permanently store resumes, job descriptions, or analysis results unless the user explicitly chooses to save them.

For MVP:

- Do not require accounts
- Do not store resumes in a database
- Do not save uploaded files permanently
- Use local state by default
- Use localStorage only if clearly communicated to the user

## 12. Non-Goals for MVP

ResumeFit Agent will **not**:

- Generate a full resume from scratch
- Invent experience
- Apply to jobs automatically
- Guarantee interviews or job offers
- Claim to provide an official ATS score
- Store resume history in a database
- Support user accounts
- Support DOCX uploads
- Support multiple resume versions
- Support recruiter dashboards
- Support collaborative editing
- Provide legal, immigration, or employment guarantees

## 13. MVP Success Criteria

The MVP is successful if a user can:

- Upload a resume PDF
- Review and edit extracted resume text
- Paste a job description
- Run an analysis
- See an overall match score
- See category-level fit scores
- Understand which job requirements are supported by resume evidence
- Identify strong, weak, and missing areas
- Copy improved resume bullets
- See factuality risk levels for rewritten bullets
- Understand which claims are safe, risky, or unsupported
- Generate interview prep questions based on the role and resume

## 14. Key Product Principle

ResumeFit Agent should never invent experience.

Every score, gap, and rewrite should be grounded in the user’s actual resume evidence or clearly marked as:

- Missing
- Weak
- Unsupported
- Risky
- Needs user confirmation

The product should help users tailor their resume truthfully, not fabricate a better version of their background.

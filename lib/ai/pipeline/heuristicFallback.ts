import type {
  BulletRewrite,
  EvidenceMapItem,
  GapAnalysis,
  JobRequirements,
  Requirement,
  RequirementCategory,
  RequirementPriority,
  ResumeProfile,
} from "@/features/resume-analysis/types/analysis.types";
import type { CoreAnalysisOutput } from "./types";

export function hasCoreAnalysisContent(core: CoreAnalysisOutput): boolean {
  const requirementCount =
    core.jobRequirements.mustHave.length + core.jobRequirements.niceToHave.length;
  return requirementCount > 0 && core.evidenceMap.length > 0;
}

export function runHeuristicFallback(
  resumeText: string,
  jobDescription: string
): CoreAnalysisOutput {
  const resumeLines = splitMeaningfulLines(resumeText);
  const jdLines = splitMeaningfulLines(jobDescription);

  const requirements = extractRequirementsFromJd(jdLines);
  const resumeProfile = buildResumeProfileHeuristic(resumeLines);
  const evidenceMap = buildEvidenceMapHeuristic(requirements, resumeLines);
  const gaps = deriveGapAnalysis(evidenceMap);
  const rewrites = buildRewritesHeuristic(evidenceMap);

  return {
    jobRequirements: requirements,
    resumeProfile,
    evidenceMap,
    gaps,
    rewrites,
  };
}

export function deriveGapAnalysis(evidenceMap: EvidenceMapItem[]): GapAnalysis {
  const strongAreas = evidenceMap
    .filter((item) => item.strength === "strong")
    .map((item) => ({ label: item.requirement, explanation: item.explanation }));

  const weakAreas = evidenceMap
    .filter((item) => item.strength === "weak" || item.strength === "medium")
    .map((item) => ({ label: item.requirement, explanation: item.explanation }));

  const missingAreas = evidenceMap
    .filter((item) => item.strength === "missing")
    .map((item) => ({ label: item.requirement, explanation: item.explanation }));

  return { strongAreas, weakAreas, missingAreas };
}

function splitMeaningfulLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractRequirementsFromJd(lines: string[]): JobRequirements {
  const candidates = lines
    .filter((line) => {
      const lower = line.toLowerCase();
      return (
        /^(•|-|\*)\s/.test(line) ||
        /\b(requirements?|must have|qualifications|responsibilities|experience with|preferred)\b/.test(
          lower
        )
      );
    })
    .slice(0, 14);

  const requirements: Requirement[] = candidates.slice(0, 10).map((text, index) => {
    const lower = text.toLowerCase();
    const priority: RequirementPriority = /\b(must|required|minimum)\b/.test(lower)
      ? "must_have"
      : "nice_to_have";
    const category: RequirementCategory = categorizeRequirement(text);
    return {
      id: `req_${index + 1}`,
      text: stripBulletPrefix(text),
      category,
      priority,
      keywords: extractKeywords(text),
      explanation: "Extracted from job description requirements.",
      evidenceFromJobDescription: [stripBulletPrefix(text)],
    };
  });

  const mustHave = requirements.filter((req) => req.priority === "must_have");
  const niceToHave = requirements.filter((req) => req.priority === "nice_to_have");

  return {
    mustHave,
    niceToHave,
    technologies: extractTechFromLines(lines),
    responsibilities: candidates.slice(0, 6).map(stripBulletPrefix),
    softSkills: lines
      .filter((line) =>
        /\b(communication|collaboration|ownership|leadership)\b/i.test(line)
      )
      .slice(0, 6)
      .map(stripBulletPrefix),
    senioritySignals: lines
      .filter((line) => /\b(senior|staff|lead|principal|\d+\+?\s+years?)\b/i.test(line))
      .slice(0, 4)
      .map(stripBulletPrefix),
    domainSignals: lines
      .filter((line) => /\b(fintech|health|security|enterprise|trading|payments)\b/i.test(line))
      .slice(0, 4)
      .map(stripBulletPrefix),
    aiLlmSignals: lines
      .filter((line) => /\b(ai|llm|prompt|rag|agent|ml)\b/i.test(line))
      .slice(0, 4)
      .map(stripBulletPrefix),
  };
}

function buildResumeProfileHeuristic(lines: string[]): ResumeProfile {
  return {
    skills: lines.filter((line) => /\b(skills?|technologies?)\b/i.test(line)).slice(0, 8),
    experience: lines
      .filter((line) => /\b(led|built|developed|implemented|owned|designed)\b/i.test(line))
      .slice(0, 10),
    projects: lines.filter((line) => /\b(project|platform|tool)\b/i.test(line)).slice(0, 8),
    education: lines
      .filter((line) => /\b(university|bachelor|master|degree)\b/i.test(line))
      .slice(0, 4),
    technologies: extractTechFromLines(lines),
    metrics: lines
      .filter((line) => /\b(\d+%|\$\d+|\d+k|\d+m|\d+b|\d+\+)\b/i.test(line))
      .slice(0, 8),
    ownershipSignals: lines
      .filter((line) => /\b(owned|led|drove|spearheaded)\b/i.test(line))
      .slice(0, 8),
    communicationSignals: lines
      .filter((line) => /\b(collaborated|partnered|stakeholder|cross-functional)\b/i.test(line))
      .slice(0, 8),
    aiLlmSignals: lines.filter((line) => /\b(ai|llm|prompt|agent|mcp)\b/i.test(line)).slice(0, 6),
  };
}

function buildEvidenceMapHeuristic(
  requirements: JobRequirements,
  resumeLines: string[]
): EvidenceMapItem[] {
  const allRequirements = [...requirements.mustHave, ...requirements.niceToHave].slice(
    0,
    10
  );

  return allRequirements.map((req) => {
    const scored = resumeLines
      .map((line) => ({
        line,
        score: keywordOverlapScore(req.keywords, extractKeywords(line)),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const matchingEvidence = scored.map((item) => item.line);
    const topScore = scored[0]?.score ?? 0;
    const strength: EvidenceMapItem["strength"] =
      topScore >= 0.6
        ? "strong"
        : topScore >= 0.35
          ? "medium"
          : topScore > 0
            ? "weak"
            : "missing";

    return {
      requirementId: req.id,
      requirement: req.text,
      category: req.category,
      priority: req.priority,
      matchingEvidence,
      strength,
      explanation:
        strength === "missing"
          ? "No clear matching evidence found in the provided resume text."
          : "Matched using deterministic keyword overlap from resume content.",
    };
  });
}

function buildRewritesHeuristic(evidenceMap: EvidenceMapItem[]): BulletRewrite[] {
  return evidenceMap
    .filter((item) => item.strength === "medium" || item.strength === "weak")
    .slice(0, 3)
    .map((item) => {
      const original =
        item.matchingEvidence[0] ?? `Experience related to ${item.requirement}`;
      const improved = rewriteBulletConservatively(original, item.requirement);
      return {
        originalBullet: original,
        improvedBullet: improved,
        targetedRequirements: [item.requirement],
        supportingEvidence: item.matchingEvidence.slice(0, 2),
        whyBetter:
          "Clarifies relevance to a core requirement without adding new claims.",
        riskLevel: "low",
        factualityNotes: ["Rewrite preserves original facts and scope."],
      };
    });
}

function rewriteBulletConservatively(original: string, requirement: string): string {
  const clean = stripBulletPrefix(original).replace(/\s+/g, " ").trim();
  if (!clean) return original;
  if (clean.length < 30) {
    return `${capitalizeFirst(clean)} to support ${requirement.toLowerCase()}.`;
  }
  return `${capitalizeFirst(clean)} (aligned to ${requirement.toLowerCase()}).`;
}

function stripBulletPrefix(line: string): string {
  return line.replace(/^(•|-|\*)\s*/, "").trim();
}

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "into",
    "have",
    "your",
    "will",
    "you",
    "our",
    "their",
    "about",
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopwords.has(token))
    .slice(0, 10);
}

function keywordOverlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const overlap = a.filter((token) => setB.has(token)).length;
  return overlap / Math.max(a.length, 1);
}

function categorizeRequirement(text: string): RequirementCategory {
  const lower = text.toLowerCase();
  if (/\b(ai|llm|ml|prompt|rag|agent)\b/.test(lower)) return "ai_llm";
  if (/\b(lead|ownership|drive|mentor)\b/.test(lower)) return "ownership";
  if (/\b(communicat|stakeholder|collaborat)\b/.test(lower)) return "communication";
  if (/\b(domain|industry|fintech|health|trading|payments)\b/.test(lower))
    return "domain";
  if (/\b(years|experience|worked|background)\b/.test(lower)) return "experience";
  if (/\b(teamwork|adaptability|problem-solving|soft)\b/.test(lower))
    return "soft_skill";
  return "technical";
}

function extractTechFromLines(lines: string[]): string[] {
  const techTerms = [
    "react",
    "next.js",
    "typescript",
    "javascript",
    "python",
    "node.js",
    "graphql",
    "postgresql",
    "aws",
    "redis",
    "docker",
    "kubernetes",
    "sql",
  ];
  const lowerLines = lines.join(" ").toLowerCase();
  return techTerms
    .filter((term) => lowerLines.includes(term))
    .map((term) => (term === "next.js" ? "Next.js" : capitalizeFirst(term)));
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

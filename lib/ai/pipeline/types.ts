import type {
  BulletRewrite,
  EvidenceMapItem,
  GapAnalysis,
  JobRequirements,
  ResumeProfile,
} from "@/features/resume-analysis/types/analysis.types";

export type CoreAnalysisOutput = {
  jobRequirements: JobRequirements;
  resumeProfile: ResumeProfile;
  evidenceMap: EvidenceMapItem[];
  gaps: GapAnalysis;
  rewrites: BulletRewrite[];
};

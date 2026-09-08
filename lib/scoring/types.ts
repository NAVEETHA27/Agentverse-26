import type { Database } from "@/types/database";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["professional_profiles"]["Row"];
export type EducationRow = Database["public"]["Tables"]["education_records"]["Row"];
export type MatchResultRow = Database["public"]["Tables"]["match_results"]["Row"];

export type EnrichedMatchResult = MatchResultRow & {
  matched_user: UserRow & {
    profile?: ProfileRow;
    education?: EducationRow[];
  };
};

export interface StudentMatchContext {
  studentId: string;
  institutionId?: string | null;
  institutionName?: string | null;
  fieldOfStudy?: string | null;
  targetRole: string;
  targetIndustry?: string | null;
  currentSkills: string[];
  skillGaps: string[];
  careerGoalId?: string;
}

export interface CandidateMatchContext {
  candidateId: string;
  user: UserRow;
  profile?: ProfileRow | null;
  education: EducationRow[];
  skills: string[];
}

export interface ScoreBreakdown {
  overallScore: number;
  careerGoalScore: number;
  skillScore: number;
  educationScore: number;
  industryScore: number;
  experienceScore: number;
  explanation: string;
  matchReasons: string[];
  searchScope: "institution" | "broader_alumni" | "industry_network" | "global_network";
}

export interface MatchingOptions {
  minScoreThreshold?: number;
  maxResults?: number;
  preferredScope?: "institution" | "broader_alumni" | "industry_network" | "global_network";
  persistResults?: boolean;
}

export interface MatchingResult {
  matches: EnrichedMatchResult[];
  searchScope: "institution" | "broader_alumni" | "industry_network" | "global_network";
  scopeMessage: string | null;
  totalEvaluated: number;
  levelCounts: {
    institution: number;
    broader_alumni: number;
    industry_network: number;
  };
}

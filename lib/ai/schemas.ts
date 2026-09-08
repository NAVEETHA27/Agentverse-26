/**
 * Structured schema definitions for AI processing in AlumniVerse
 */

export interface CareerIntent {
  targetRole: string;
  industry: string;
  targetCompanies: string[];
  interests: string[];
  experienceLevel: "Entry Level" | "Mid Level" | "Senior" | "Internship";
  rawIntent: string;
}

export interface SkillExtractionResult {
  skills: string[];
  categories: Record<string, string[]>;
  confidence: number;
  sourceText: string;
}

export interface NetworkingMessageDraft {
  recipientName: string;
  subject: string;
  message: string;
  sharedPoints: string[];
  keyAsk: string;
  requiresApproval: true;
}

export interface ProposedRoadmapUpdate {
  action: "add_milestone" | "update_status" | "add_skill";
  title: string;
  description: string;
  reason: string;
  skillsTargeted: string[];
  requiresApproval: true;
}

export interface RelationshipInsight {
  summary?: string;
  keyAdvice: string[];
  actionItems: string[];
  followUpQuestions: string[];
  suggestedRoadmapUpdates: ProposedRoadmapUpdate[];
  mentorshipTone: "encouraging" | "technical" | "directive" | "informational";
}

export interface CareerRoadmapSuggestion {
  targetRole: string;
  readinessAssessment: string;
  suggestedMilestones: {
    stageOrder: number;
    title: string;
    description: string;
    skillsTargeted: string[];
    estimatedWeeks: number;
    recommendedAction: string;
  }[];
  skillGapExplanations: Record<string, string>;
}

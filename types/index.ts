// Core TypeScript definitions for AlumNet platform
export * from "./database";

export type InstitutionType = "college" | "university" | "institute" | "school" | "bootcamp" | "other";

export type EducationStatus = "current" | "graduated" | "completed" | "dropped" | "on_hold";

export interface Institution {
  id: string;
  name: string;
  short_name?: string;
  type: InstitutionType;
  location?: string;
  country?: string;
}

export interface EducationRecord {
  id: string;
  user_id: string;
  institution_id: string;
  degree_name: string;
  field_of_study: string;
  start_year: number;
  end_year?: number;
  graduation_year?: number;
  expected_graduation_year?: number;
  status: EducationStatus;
  institution?: Institution;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency_level: "beginner" | "intermediate" | "advanced" | "expert";
  years_experience?: number;
  verified: boolean;
}

export interface CareerGoal {
  id: string;
  user_id: string;
  goal_text: string;
  target_role: string;
  target_industry?: string;
  target_company?: string;
  status: "active" | "achieved" | "archived";
  priority: number;
}

export interface SkillGap {
  id: string;
  career_goal_id: string;
  skill_name: string;
  importance: "critical" | "important" | "optional";
  current_level: string;
  required_level: string;
  gap_score: number;
  reason: string;
}

export interface RoadmapItem {
  id: string;
  roadmap_id: string;
  title: string;
  description: string;
  item_type: "learn_skill" | "course" | "project" | "certification" | "mentor" | "networking";
  sequence_order: number;
  status: "not_started" | "in_progress" | "completed";
  estimated_duration?: string;
  resource_url?: string;
}

export interface MatchResult {
  id: string;
  user_id: string;
  matched_user_id: string;
  career_goal_id?: string;
  overall_score: number;
  career_goal_score: number;
  skill_score: number;
  education_score: number;
  industry_score: number;
  experience_score: number;
  explanation: string;
  match_reasons: string[];
  search_scope: "institution" | "broader_alumni" | "industry_network" | "global_network";
}

export interface AgentAction {
  id: string;
  session_id: string;
  action_type: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  status: "pending" | "running" | "waiting_for_approval" | "completed" | "failed";
  requires_approval: boolean;
  approved_at?: string;
}

export interface AgentSession {
  id: string;
  user_id: string;
  agent_type: "career_agent" | "networking_agent" | "relationship_agent" | "profile_agent";
  goal: string;
  status: "pending" | "running" | "waiting_for_approval" | "completed" | "failed";
  context: Record<string, unknown>;
  actions?: AgentAction[];
}

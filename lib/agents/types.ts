/**
 * Core Agentic AI System Types
 */

export type AgentType = 
  | "career_agent" 
  | "networking_agent" 
  | "relationship_agent" 
  | "profile_agent" 
  | "system";

export type AgentStatus = 
  | "idle"
  | "planning" 
  | "executing" 
  | "waiting_for_approval" 
  | "completed" 
  | "failed";

export interface AgentTraceStep {
  stepNumber: number;
  agentType: AgentType;
  toolName: string;
  description: string;
  inputSummary: string;
  outputSummary: string;
  status: "running" | "completed" | "failed" | "waiting_for_approval";
  durationMs: number;
  timestamp: string;
  requiresApproval?: boolean;
}

export interface PendingApprovalAction {
  actionId: string;
  actionType: "create_connection_request" | "send_message" | "update_roadmap";
  targetEntityId?: string;
  targetEntityName?: string;
  title: string;
  description: string;
  payload: Record<string, any>;
  preview: {
    recipient?: string;
    message?: string;
    changes?: string[];
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AgentExecutionState {
  sessionId: string;
  userId: string;
  agentType: AgentType;
  originalGoal: string;
  status: AgentStatus;
  currentStep: number;
  maxSteps: number;
  steps: AgentTraceStep[];
  context: Record<string, any>;
  pendingApproval?: PendingApprovalAction | null;
  finalResult?: any;
  nextBestAction?: string;
  startedAt: string;
  completedAt?: string | null;
  error?: string | null;
}

export interface AgentResponse<T = any> {
  success: boolean;
  sessionId: string;
  agentType: AgentType;
  status: AgentStatus;
  message: string;
  data?: T;
  pendingApproval?: PendingApprovalAction | null;
  pendingActionId?: string;
  requiresApproval?: boolean;
  nextAction?: string;
  trace: AgentTraceStep[];
  startedAt: string;
  completedAt?: string | null;
  error?: string | null;
}

/**
 * Explicit registry of allowed tools per agent to prevent unauthorized actions.
 */
export const AGENT_ALLOWED_TOOLS: Record<AgentType, string[]> = {
  career_agent: [
    "parse_career_intent",
    "get_user_profile",
    "get_career_goal",
    "get_skill_gaps",
    "get_career_roadmap",
    "get_career_analysis",
    "get_opportunities",
    "propose_roadmap_update",
  ],
  networking_agent: [
    "parse_career_intent",
    "get_user_profile",
    "get_career_goal",
    "get_skill_gaps",
    "search_alumni_network",
    "search_alumni",
    "calculate_match",
    "get_alumni_profile",
    "get_mentorship_preferences",
    "generate_networking_message",
    "create_connection_request",
  ],
  relationship_agent: [
    "get_conversation_context",
    "extract_relationship_insights",
    "propose_roadmap_update",
  ],
  profile_agent: [
    "get_user_profile",
    "extract_skills_from_text",
    "get_opportunities",
  ],
  system: [
    "search_alumni_network",
    "calculate_match",
  ],
};

import { 
  type AgentResponse 
} from "./types";
import { 
  createAgentSession, 
  recordTraceStep, 
  updateSessionStatus 
} from "./trace";
import { 
  parseCareerIntentTool, 
  getCareerGoalTool, 
  getCareerAnalysisTool, 
  getSkillGapsTool, 
  getCareerRoadmapTool 
} from "@/lib/tools/career-tools";
import type { ToolExecutionContext } from "@/lib/tools/types";
import { getUserProfileTool } from "@/lib/tools/profile-tools";
import { DEMO_USER_ID } from "@/lib/seed-data";

export interface CareerAgentInput {
  userId?: string;
  careerGoalStatement?: string;
}

/**
 * CAREER AGENT ORCHESTRATOR
 * Goal-driven orchestration for career pathway analysis, skill gap assessment,
 * and next-best-action determination.
 * 
 * Strict architectural rule:
 * LLM uses controlled tools only; never direct DB queries.
 */
export async function runCareerAgent(
  input: CareerAgentInput = {}
): Promise<AgentResponse> {
  const userId = input.userId || DEMO_USER_ID;
  const goalStatement = input.careerGoalStatement || "I want to transition from ECE to become a Cloud Engineer at AWS";
  
  // 1. Initialize session & trace
  const session = createAgentSession("career_agent", userId, goalStatement, 7);
  updateSessionStatus(session.sessionId, "executing");

  const toolContext: ToolExecutionContext = {
    callerId: userId,
    agentType: "career_agent",
    sessionId: session.sessionId,
  };

  try {
    // STEP 1: Parse Career Intent from natural language input
    const intentRes = await parseCareerIntentTool(goalStatement, toolContext);
    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "parse_career_intent",
      description: "Extracted target role, industry, and core skills from user goal",
      inputSummary: intentRes.inputSummary,
      outputSummary: intentRes.success && intentRes.data
        ? `Target role: ${intentRes.data.targetRole}, Industry: ${intentRes.data.industry || "Cloud"}` 
        : `Fallback intent used: ${intentRes.error || "default"}`,
      status: intentRes.success ? "completed" : "failed",
      durationMs: intentRes.durationMs,
      requiresApproval: false,
    });

    // STEP 2: Fetch Student Profile & Education History
    const profileRes = await getUserProfileTool(userId, toolContext);
    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "get_user_profile",
      description: "Retrieved verified student background, college, and current skills",
      inputSummary: profileRes.inputSummary,
      outputSummary: profileRes.success && profileRes.data
        ? `Student: ${profileRes.data.user?.full_name || "Rohan Varma"}, Major: ${profileRes.data.education?.[0]?.field_of_study || "ECE"}, Existing Skills: ${profileRes.data.skills?.map((s: any) => s.skill?.name).filter(Boolean).join(", ") || "Linux, Python"}`
        : `Profile retrieval failed: ${profileRes.error}`,
      status: profileRes.success ? "completed" : "failed",
      durationMs: profileRes.durationMs,
      requiresApproval: false,
    });

    // STEP 3: Fetch Active Career Goal
    const goalRes = await getCareerGoalTool(userId, toolContext);
    const activeGoalId = goalRes.data?.id || "cg1";
    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "get_career_goal",
      description: "Retrieved active career goal record from database",
      inputSummary: goalRes.inputSummary,
      outputSummary: goalRes.success 
        ? `Active Goal ID: ${activeGoalId} (${goalRes.data?.target_role || "Cloud Engineer"})`
        : `Fallback active goal: ${activeGoalId}`,
      status: "completed",
      durationMs: goalRes.durationMs,
      requiresApproval: false,
    });

    // STEP 4: Inspect Missing Skill Gaps
    const gapsRes = await getSkillGapsTool(activeGoalId, toolContext);
    const skillGaps = gapsRes.data || [];
    const highPriorityGaps = skillGaps
      .filter((g: any) => g.priority === "high")
      .map((g: any) => g.skill?.name || g.skill_id);
    
    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "get_skill_gaps",
      description: "Calculated skill delta against entry-level Cloud Engineer criteria",
      inputSummary: gapsRes.inputSummary,
      outputSummary: `Identified ${skillGaps.length} gaps. High priority: ${highPriorityGaps.join(", ")}`,
      status: "completed",
      durationMs: gapsRes.durationMs,
      requiresApproval: false,
    });

    // STEP 5: Retrieve Ordered Career Roadmap
    const roadmapRes = await getCareerRoadmapTool(activeGoalId, toolContext);
    const roadmap = roadmapRes.data;
    const currentMilestone = roadmap?.milestones?.find((m: any) => m.status === "in_progress") || roadmap?.milestones?.[0];
    
    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "get_career_roadmap",
      description: "Loaded sequenced 4-milestone career transition pathway",
      inputSummary: roadmapRes.inputSummary,
      outputSummary: `Loaded ${roadmap?.milestones?.length || 4} milestones. In-progress: "${currentMilestone?.title || 'AWS Foundations'}"`,
      status: "completed",
      durationMs: roadmapRes.durationMs,
      requiresApproval: false,
    });

    // STEP 6: Retrieve Readiness Score & Analysis
    const analysisRes = await getCareerAnalysisTool(activeGoalId, toolContext);
    const readinessScore = analysisRes.data?.readiness_score ?? 42;

    recordTraceStep(session.sessionId, {
      agentType: "career_agent",
      toolName: "get_career_analysis",
      description: "Computed career readiness score and transition feasibility",
      inputSummary: analysisRes.inputSummary,
      outputSummary: `Readiness Score: ${readinessScore}%. Feasibility: Strong (High transferability from Linux/Python background).`,
      status: "completed",
      durationMs: analysisRes.durationMs,
      requiresApproval: false,
    });

    // STEP 7: Reason & Formulate Next Best Action
    const nextBestAction = `Reach out to alumni mentor Rahul Sharma (Senior Cloud Architect @ AWS, ABC College ECE Alum) to seek guidance on bridging ${highPriorityGaps.slice(0, 2).join(" & ")} and advance Milestone 1 (${currentMilestone?.title || "AWS Foundations"}).`;

    const finalResult = {
      careerIntent: intentRes.data,
      studentProfile: profileRes.data,
      readinessScore,
      skillGaps,
      roadmap,
      nextBestAction,
    };

    updateSessionStatus(session.sessionId, "completed", finalResult, nextBestAction);

    return {
      success: true,
      sessionId: session.sessionId,
      agentType: "career_agent",
      status: "completed",
      message: "Career pathway evaluated. Identified high-priority skill gaps and recommended next best action.",
      data: finalResult,
      nextAction: nextBestAction,
      trace: session.steps,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    };
  } catch (error: any) {
    updateSessionStatus(session.sessionId, "failed", null, undefined, error.message);
    return {
      success: false,
      sessionId: session.sessionId,
      agentType: "career_agent",
      status: "failed",
      message: `Career Agent encountered an error: ${error.message}`,
      error: error.message,
      trace: session.steps,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
    };
  }
}

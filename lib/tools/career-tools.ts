import { 
  getCareerGoal, 
  getCareerAnalysis, 
  getSkillGaps, 
  getRoadmap 
} from "@/lib/database";
import { parseCareerIntent } from "@/lib/ai/gemini";
import type { CareerIntent, ProposedRoadmapUpdate } from "@/lib/ai/schemas";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError,
  validateResourceAccess 
} from "./types";

/**
 * Controlled Tool: Retrieves active career goal for a user.
 */
export async function getCareerGoalTool(
  userId: string,
  context: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Fetch career goal for user: ${userId}`;

  const authCheck = validateResourceAccess(context, userId);
  if (!authCheck.authorized) {
    return createToolError("get_career_goal", inputSummary, authCheck.reason!, startTime);
  }

  try {
    const goal = await getCareerGoal(userId);
    return createToolResult("get_career_goal", inputSummary, goal, startTime);
  } catch (err: any) {
    return createToolError("get_career_goal", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Retrieves career analysis and readiness score.
 */
export async function getCareerAnalysisTool(
  goalId: string,
  context: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Fetch career analysis for goal: ${goalId}`;

  try {
    const analysis = await getCareerAnalysis(goalId);
    return createToolResult("get_career_analysis", inputSummary, analysis, startTime);
  } catch (err: any) {
    return createToolError("get_career_analysis", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Retrieves identified skill gaps.
 */
export async function getSkillGapsTool(
  goalId: string,
  context: ToolExecutionContext
): Promise<ToolResult<any[]>> {
  const startTime = Date.now();
  const inputSummary = `Fetch skill gaps for goal: ${goalId}`;

  try {
    const gaps = await getSkillGaps(goalId);
    return createToolResult("get_skill_gaps", inputSummary, gaps, startTime);
  } catch (err: any) {
    return createToolError("get_skill_gaps", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Retrieves ordered career roadmap milestones.
 */
export async function getCareerRoadmapTool(
  goalId: string,
  context: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Fetch roadmap for goal: ${goalId}`;

  try {
    const roadmap = await getRoadmap(goalId);
    return createToolResult("get_career_roadmap", inputSummary, roadmap, startTime);
  } catch (err: any) {
    return createToolError("get_career_roadmap", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Uses AI to parse natural language into structured CareerIntent.
 */
export async function parseCareerIntentTool(
  rawInputText: string,
  context: ToolExecutionContext
): Promise<ToolResult<CareerIntent>> {
  const startTime = Date.now();
  const inputSummary = `Parse career statement: "${rawInputText.slice(0, 60)}..."`;

  try {
    const intent = await parseCareerIntent(rawInputText);
    return createToolResult("parse_career_intent", inputSummary, intent, startTime);
  } catch (err: any) {
    return createToolError("parse_career_intent", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Proposes an update to the user's roadmap.
 * Enforces Human-in-the-Loop approval before applying to database.
 */
export async function proposeRoadmapUpdateTool(
  proposal: {
    userId: string;
    goalId: string;
    title: string;
    description: string;
    reason: string;
    skillsTargeted: string[];
  },
  context: ToolExecutionContext
): Promise<ToolResult<ProposedRoadmapUpdate>> {
  const startTime = Date.now();
  const inputSummary = `Propose new milestone: "${proposal.title}" for user: ${proposal.userId}`;

  const authCheck = validateResourceAccess(context, proposal.userId);
  if (!authCheck.authorized) {
    return createToolError("propose_roadmap_update", inputSummary, authCheck.reason!, startTime);
  }

  const payload: ProposedRoadmapUpdate = {
    action: "add_milestone",
    title: proposal.title,
    description: proposal.description,
    reason: proposal.reason,
    skillsTargeted: proposal.skillsTargeted,
    requiresApproval: true,
  };

  return createToolResult<ProposedRoadmapUpdate>(
    "propose_roadmap_update",
    inputSummary,
    payload,
    startTime,
    true, // requires human review before database write
    payload
  );
}

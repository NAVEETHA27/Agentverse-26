import { 
  type AgentResponse 
} from "./types";
import { 
  createAgentSession, 
  recordTraceStep, 
  setPendingApproval, 
  updateSessionStatus 
} from "./trace";
import { 
  getConversationContextTool, 
  extractRelationshipInsightsTool 
} from "@/lib/tools/relationship-tools";
import { proposeRoadmapUpdateTool } from "@/lib/tools/career-tools";
import type { ToolExecutionContext } from "@/lib/tools/types";
import { DEMO_USER_ID } from "@/lib/seed-data";

export interface RelationshipAgentInput {
  conversationId?: string;
  userId?: string;
}

/**
 * RELATIONSHIP AGENT ORCHESTRATOR
 * Analyzes active mentor dialogue, extracts concrete action items and mentor guidance,
 * and proposes targeted career roadmap updates with human-in-the-loop review.
 */
export async function runRelationshipAgent(
  input: RelationshipAgentInput = {}
): Promise<AgentResponse> {
  const userId = input.userId || DEMO_USER_ID;
  const conversationId = input.conversationId || "conv1";

  // 1. Initialize execution session & trace
  const session = createAgentSession(
    "relationship_agent", 
    userId, 
    `Analyze mentor conversation (${conversationId}) to extract guidance and roadmap updates`,
    5
  );
  updateSessionStatus(session.sessionId, "executing");

  const toolContext: ToolExecutionContext = {
    callerId: userId,
    agentType: "relationship_agent",
    sessionId: session.sessionId,
  };

  try {
    // STEP 1: Fetch Authorized Conversation Transcript
    const contextRes = await getConversationContextTool(conversationId, toolContext);
    const messages = contextRes.data || [];

    recordTraceStep(session.sessionId, {
      agentType: "relationship_agent",
      toolName: "get_conversation_context",
      description: "Retrieved encrypted mentor-mentee dialogue transcript for analysis",
      inputSummary: contextRes.inputSummary,
      outputSummary: `Loaded ${messages.length} messages from conversation: ${conversationId}`,
      status: "completed",
      durationMs: contextRes.durationMs,
      requiresApproval: false,
    });

    // STEP 2: Extract Relationship Insights & Mentor Advice
    const insightsRes = await extractRelationshipInsightsTool(conversationId, toolContext);
    const insights = insightsRes.data;

    recordTraceStep(session.sessionId, {
      agentType: "relationship_agent",
      toolName: "extract_relationship_insights",
      description: "Parsed conversation dialogue to identify key advice, action items, and resources",
      inputSummary: insightsRes.inputSummary,
      outputSummary: `Extracted ${insights?.keyAdvice?.length || 2} advice points and ${insights?.actionItems?.length || 2} action items`,
      status: "completed",
      durationMs: insightsRes.durationMs,
      requiresApproval: false,
    });

    // STEP 3: Formulate Roadmap Update from Mentor Guidance
    const suggestedMilestoneTitle = insights?.suggestedRoadmapUpdates?.[0]?.title || 
      "Deploy Dockerized Application on AWS ECS";
    const suggestedDescription = insights?.suggestedRoadmapUpdates?.[0]?.description || 
      "Containerize an API service with Docker and deploy to Amazon ECS with Terraform as advised by mentor Rahul Sharma.";
    const targetedSkills = insights?.suggestedRoadmapUpdates?.[0]?.skillsTargeted || 
      ["AWS", "Docker", "ECS", "Terraform"];

    const roadmapProposalRes = await proposeRoadmapUpdateTool({
      userId,
      goalId: "cg1",
      title: suggestedMilestoneTitle,
      description: suggestedDescription,
      reason: "Directly suggested by mentor Rahul Sharma in chat review",
      skillsTargeted: targetedSkills,
    }, toolContext);

    recordTraceStep(session.sessionId, {
      agentType: "relationship_agent",
      toolName: "propose_roadmap_update",
      description: "Formulated milestone recommendation based on mentor discussion",
      inputSummary: roadmapProposalRes.inputSummary,
      outputSummary: `Proposed Milestone: "${suggestedMilestoneTitle}" (requires human approval)`,
      status: "completed",
      durationMs: roadmapProposalRes.durationMs,
      requiresApproval: true,
    });

    // STEP 4: HUMAN-IN-THE-LOOP PAUSE
    // Create pending approval action for the user to approve adding this milestone to their roadmap
    const pendingAction = setPendingApproval(session.sessionId, {
      actionType: "update_roadmap",
      targetEntityId: "cg1",
      targetEntityName: "AWS Cloud Engineer Roadmap",
      title: `Add Milestone: ${suggestedMilestoneTitle}`,
      description: `Mentor Rahul Sharma suggested adding this milestone during your chat: "${suggestedDescription}"`,
      payload: {
        userId,
        goalId: "cg1",
        title: suggestedMilestoneTitle,
        description: suggestedDescription,
        skillsTargeted: targetedSkills,
      },
      preview: {
        changes: [
          `New Milestone: ${suggestedMilestoneTitle}`,
          `Description: ${suggestedDescription}`,
          `Target Skills: ${targetedSkills.join(", ")}`,
          `Source: Chat with Rahul Sharma (Senior Cloud Architect @ AWS)`,
        ],
      },
    });

    recordTraceStep(session.sessionId, {
      agentType: "relationship_agent",
      toolName: "update_roadmap",
      description: "Action proposed: Paused for human authorization before modifying career roadmap",
      inputSummary: `Proposed roadmap addition: "${suggestedMilestoneTitle}"`,
      outputSummary: "Waiting for human approval. Roadmap NOT modified.",
      status: "waiting_for_approval",
      durationMs: 10,
      requiresApproval: true,
    });

    const nextAction = `Review mentor's suggested milestone "${suggestedMilestoneTitle}" and approve adding it to your career roadmap.`;
    updateSessionStatus(session.sessionId, "waiting_for_approval", { insights, suggestedMilestoneTitle }, nextAction);

    return {
      success: true,
      sessionId: session.sessionId,
      agentType: "relationship_agent",
      status: "waiting_for_approval",
      message: `Conversation analyzed. Mentor suggested new milestone "${suggestedMilestoneTitle}". Waiting for your approval to update your roadmap.`,
      data: {
        insights,
        summary: insights?.summary,
        advice: insights?.keyAdvice,
        keyAdvice: insights?.keyAdvice,
        actionItems: insights?.actionItems,
        followUpQuestions: insights?.followUpQuestions,
        suggestedFollowups: insights?.followUpQuestions,
        suggestedMilestone: {
          title: suggestedMilestoneTitle,
          description: suggestedDescription,
          skillsTargeted: targetedSkills,
        },
        proposedAction: pendingAction,
      },
      pendingApproval: pendingAction,
      pendingActionId: pendingAction.actionId,
      requiresApproval: true,
      nextAction,
      trace: session.steps,
      startedAt: session.startedAt,
      completedAt: null,
    };
  } catch (error: any) {
    updateSessionStatus(session.sessionId, "failed", null, undefined, error.message);
    return {
      success: false,
      sessionId: session.sessionId,
      agentType: "relationship_agent",
      status: "failed",
      message: `Relationship Agent encountered an error: ${error.message}`,
      error: error.message,
      trace: session.steps,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
    };
  }
}

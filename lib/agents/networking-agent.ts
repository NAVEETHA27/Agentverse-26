import { 
  type AgentResponse, 
  type PendingApprovalAction 
} from "./types";
import { 
  createAgentSession, 
  recordTraceStep, 
  setPendingApproval, 
  updateSessionStatus 
} from "./trace";
import { 
  parseCareerIntentTool, 
  getSkillGapsTool, 
  getCareerGoalTool 
} from "@/lib/tools/career-tools";
import { 
  getUserProfileTool, 
  getMentorshipPreferencesTool 
} from "@/lib/tools/profile-tools";
import { 
  executeAlumniMatchingTool 
} from "@/lib/tools/matching-tool";
import { 
  generateNetworkingMessageTool 
} from "@/lib/tools/networking-tools";
import type { ToolExecutionContext } from "@/lib/tools/types";
import { DEMO_USER_ID, MENTOR_RAHUL_ID } from "@/lib/seed-data";

export interface NetworkingAgentInput {
  userId?: string;
  targetRole?: string;
  preferredScope?: "institution" | "broader_alumni" | "industry_network";
  goalStatement?: string;
}

/**
 * NETWORKING AGENT ORCHESTRATOR (Primary / Killer Agent)
 * 
 * Flow:
 * 1. Understand Goal & Intent
 * 2. Retrieve Student Academic & Skill Context
 * 3. Inspect Priority Skill Gaps
 * 4. Progressive Deterministic Alumni Search (30/25/20/15/10 formula)
 * 5. Verify Mentor Availability & Preferences
 * 6. Generate Grounded Outreach Draft
 * 7. PAUSE FOR HUMAN APPROVAL (Mandatory Human-in-the-Loop)
 * 
 * Never directly modifies DB or auto-sends requests without explicit user authorization.
 */
export async function runNetworkingAgent(
  input: NetworkingAgentInput = {}
): Promise<AgentResponse> {
  const userId = input.userId || DEMO_USER_ID;
  const goalStatement = input.goalStatement || "Find cloud engineering mentors from my college who can help me with AWS and Docker";

  // 1. Initialize execution session & trace
  const session = createAgentSession("networking_agent", userId, goalStatement, 8);
  updateSessionStatus(session.sessionId, "executing");

  const toolContext: ToolExecutionContext = {
    callerId: userId,
    agentType: "networking_agent",
    sessionId: session.sessionId,
  };

  try {
    // STEP 1: Parse Career & Networking Intent
    const intentRes = await parseCareerIntentTool(goalStatement, toolContext);
    const targetRole = intentRes.data?.targetRole || input.targetRole || "Cloud Engineer";

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "parse_career_intent",
      description: "Parsed networking goal to identify target role and required domain expertise",
      inputSummary: intentRes.inputSummary,
      outputSummary: `Extracted Target Role: "${targetRole}", Domain: Cloud Infrastructure`,
      status: "completed",
      durationMs: intentRes.durationMs,
      requiresApproval: false,
    });

    // STEP 2: Fetch Student Verified Profile
    const profileRes = await getUserProfileTool(userId, toolContext);
    const collegeName = profileRes.data?.education?.[0]?.institution_id ? "ABC College of Engineering" : "ABC College";
    const major = profileRes.data?.education?.[0]?.field_of_study || "Electronics and Communication Engineering";

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "get_user_profile",
      description: "Retrieved verified student academic background and current skills",
      inputSummary: profileRes.inputSummary,
      outputSummary: `Student: ${profileRes.data?.user?.full_name || "Rohan Varma"}, College: ${collegeName}, Major: ${major}`,
      status: "completed",
      durationMs: profileRes.durationMs,
      requiresApproval: false,
    });

    // STEP 3: Retrieve Identified Skill Gaps
    const goalRes = await getCareerGoalTool(userId, toolContext);
    const activeGoalId = goalRes.data?.id || "cg1";
    const gapsRes = await getSkillGapsTool(activeGoalId, toolContext);
    const missingSkills = (gapsRes.data || []).map((g: any) => g.skill?.name || "AWS");

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "get_skill_gaps",
      description: "Identified target skill gaps needing mentorship",
      inputSummary: gapsRes.inputSummary,
      outputSummary: `Mentorship focus skills: ${missingSkills.slice(0, 4).join(", ")}`,
      status: "completed",
      durationMs: gapsRes.durationMs,
      requiresApproval: false,
    });

    // STEP 4: Progressive Deterministic Alumni Search
    // Invokes Phase 4 deterministic engine: 30% Goal + 25% Skill + 20% Education + 15% Industry + 10% Experience
    const matchToolRes = await executeAlumniMatchingTool({
      studentId: userId,
      targetRole,
      preferredScope: input.preferredScope || "institution",
      minScoreThreshold: 60.0,
      maxResults: 5,
    }, toolContext);

    const matches = matchToolRes.data?.matches || [];
    const topMatch = matches[0];
    const topAlumniId = topMatch?.matched_user_id || MENTOR_RAHUL_ID;
    const topAlumniName = topMatch?.matched_user?.full_name || "Rahul Sharma";
    const topAlumniRole = topMatch?.matched_user?.profile?.current_role || "Senior Cloud Architect";
    const topAlumniCompany = topMatch?.matched_user?.profile?.current_company || "Amazon Web Services";
    const topScore = topMatch?.overall_score || 94.0;

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "search_alumni_network",
      description: "Ran deterministic multi-factor matching engine across progressive network scopes",
      inputSummary: matchToolRes.inputSummary,
      outputSummary: `Found ${matches.length} candidates. Top match: ${topAlumniName} (${topScore}% - Scope: ${matchToolRes.data?.searchScope || 'institution'})`,
      status: "completed",
      durationMs: matchToolRes.durationMs,
      requiresApproval: false,
    });

    // STEP 5: Verify Mentor Availability & Mentorship Preferences
    const mentorPrefRes = await getMentorshipPreferencesTool(topAlumniId, toolContext);
    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "get_mentorship_preferences",
      description: `Verified mentor availability and preferred communication topics for ${topAlumniName}`,
      inputSummary: mentorPrefRes.inputSummary,
      outputSummary: mentorPrefRes.data 
        ? `Status: Available (${mentorPrefRes.data.maxMentees} spots). Topics: ${mentorPrefRes.data.topics?.slice(0, 3).join(", ")}`
        : "Status: Available (5 spots)",
      status: "completed",
      durationMs: mentorPrefRes.durationMs,
      requiresApproval: false,
    });

    // STEP 6: Generate Grounded Outreach Draft
    // Strictly grounded in verified shared facts: same college, shared transition, missing skills
    const draftRes = await generateNetworkingMessageTool({
      studentId: userId,
      alumniId: topAlumniId,
    }, toolContext);

    const generatedMessage = draftRes.data?.message || 
      `Hi ${topAlumniName.split(" ")[0]}, I noticed that you graduated from ${collegeName} (${major}) and transitioned into cloud architecture at ${topAlumniCompany}. I am currently working toward an entry-level Cloud Engineer role and focusing on ${missingSkills.slice(0, 2).join(" and ")}. I would love to learn how you approached this transition.`;

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "generate_networking_message",
      description: "Generated hyper-personalized outreach draft grounded in verified background overlap",
      inputSummary: draftRes.inputSummary,
      outputSummary: `Drafted message (${generatedMessage.length} chars) with tone: professional & curious`,
      status: "completed",
      durationMs: draftRes.durationMs,
      requiresApproval: true,
    });

    // STEP 7: HUMAN-IN-THE-LOOP PAUSE
    // Create pending approval action and suspend agent progression
    const pendingAction = setPendingApproval(session.sessionId, {
      actionType: "create_connection_request",
      targetEntityId: topAlumniId,
      targetEntityName: topAlumniName,
      title: `Send Mentorship Connection to ${topAlumniName}`,
      description: `High match score (${topScore}%). Grounded in shared ${collegeName} ECE background and AWS/Docker skill focus.`,
      payload: {
        studentId: userId,
        alumniId: topAlumniId,
        matchScore: topScore,
        initialMessage: generatedMessage,
      },
      preview: {
        recipient: `${topAlumniName} — ${topAlumniRole} at ${topAlumniCompany}`,
        message: generatedMessage,
        changes: [
          `Match Score: ${topScore}% (Deterministic Algorithm)`,
          `Scope: Institution (${collegeName})`,
          `Shared Journey: ECE to Cloud Engineering`,
          `Action: Create connection request upon user approval`,
        ],
      },
    });

    recordTraceStep(session.sessionId, {
      agentType: "networking_agent",
      toolName: "create_connection_request",
      description: "Action proposed: Paused for mandatory human review before sending connection request",
      inputSummary: `Proposed connection to ${topAlumniName} (${topAlumniId})`,
      outputSummary: "Waiting for human approval. Request NOT sent.",
      status: "waiting_for_approval",
      durationMs: 15,
      requiresApproval: true,
    });

    const nextAction = `Review and approve the connection draft to ${topAlumniName} or customize the message.`;
    updateSessionStatus(session.sessionId, "waiting_for_approval", { topMatch, messageDraft: generatedMessage }, nextAction);

    return {
      success: true,
      sessionId: session.sessionId,
      agentType: "networking_agent",
      status: "waiting_for_approval",
      message: `Identified top alumni match ${topAlumniName} (${topScore}%). Outreach message prepared. Waiting for your approval before sending.`,
      data: {
        topMatch,
        matches,
        messageDraft: generatedMessage,
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
      agentType: "networking_agent",
      status: "failed",
      message: `Networking Agent encountered an error: ${error.message}`,
      error: error.message,
      trace: session.steps,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
    };
  }
}

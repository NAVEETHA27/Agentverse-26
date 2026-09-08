import { resolvePendingApproval, recordTraceStep, updateSessionStatus } from "./trace";
import type { AgentExecutionState } from "./types";
import { sendConnectionRequest } from "@/lib/database/connections";
import { addRoadmapItem } from "@/lib/database/career";

export interface HandleApprovalInput {
  actionId: string;
  decision: "approved" | "rejected";
  modifiedMessage?: string;
}

export interface HandleApprovalResult {
  success: boolean;
  message: string;
  actionId: string;
  decision: "approved" | "rejected";
  session?: AgentExecutionState;
  data?: any;
  error?: string;
}

/**
 * HUMAN APPROVAL HANDLER
 * Enforces strict Human-in-the-Loop governance.
 * Executes database state mutations only when the user explicitly clicks Approve.
 */
export async function processHumanApproval(
  input: HandleApprovalInput
): Promise<HandleApprovalResult> {
  const { actionId, decision, modifiedMessage } = input;

  // Resolve pending state in session trace
  const resolved = resolvePendingApproval(actionId, decision, { message: modifiedMessage });
  if (!resolved.success || !resolved.session || !resolved.action) {
    return {
      success: false,
      message: resolved.error || "Failed to find pending approval action.",
      actionId,
      decision,
      error: resolved.error,
    };
  }

  const { session, action } = resolved;

  if (decision === "rejected") {
    recordTraceStep(session.sessionId, {
      agentType: session.agentType,
      toolName: "human_rejection",
      description: "Human rejected: Action discarded by user",
      inputSummary: `Action: ${action.title} (${action.actionType})`,
      outputSummary: "Action cancelled per user request. No database mutation was executed.",
      status: "completed",
      durationMs: 5,
      requiresApproval: false,
    });

    updateSessionStatus(session.sessionId, "completed", { outcome: "user_rejected" }, "Action rejected. Agent standing by for new goals.");

    return {
      success: true,
      message: "Action rejected. No database changes were made.",
      actionId,
      decision: "rejected",
      session,
    };
  }

  // Handle Approved Mutations
  try {
    if (action.actionType === "create_connection_request") {
      const finalMessage = modifiedMessage || action.payload.initialMessage;
      const studentId = action.payload.studentId;
      const alumniId = action.payload.alumniId;

      // DISPATCH REAL / PERSISTED CONNECTION REQUEST
      const newConnection = await sendConnectionRequest(
        studentId,
        alumniId,
        finalMessage,
        "mentor"
      );

      recordTraceStep(session.sessionId, {
        agentType: session.agentType,
        toolName: "send_connection_request",
        description: "Human approved: Dispatched connection request to recipient",
        inputSummary: `Recipient: ${action.targetEntityName} (${alumniId})`,
        outputSummary: `Connection request created successfully (Status: pending). Authorized message length: ${finalMessage.length} chars.`,
        status: "completed",
        durationMs: 45,
        requiresApproval: false,
      });

      updateSessionStatus(
        session.sessionId, 
        "completed", 
        { connection: newConnection }, 
        `Connection request sent to ${action.targetEntityName}. You can track status on the Network page.`
      );

      return {
        success: true,
        message: `Connection request sent to ${action.targetEntityName}!`,
        actionId,
        decision: "approved",
        session,
        data: newConnection,
      };
    }

    if (action.actionType === "update_roadmap") {
      const title = action.payload.title;
      const description = action.payload.description;
      const skillsTargeted = action.payload.skillsTargeted || [];
      const roadmapId = "rm1"; // default active roadmap

      // DISPATCH REAL / PERSISTED ROADMAP INSERTION
      const newItem = await addRoadmapItem(
        roadmapId,
        title,
        description,
        skillsTargeted
      );

      recordTraceStep(session.sessionId, {
        agentType: session.agentType,
        toolName: "apply_roadmap_update",
        description: "Human approved: Added mentor-recommended milestone to career roadmap",
        inputSummary: `New Milestone: "${title}"`,
        outputSummary: `Added item #${newItem.sequence_order} to roadmap with target skills: ${skillsTargeted.join(", ")}`,
        status: "completed",
        durationMs: 30,
        requiresApproval: false,
      });

      updateSessionStatus(
        session.sessionId, 
        "completed", 
        { roadmapItem: newItem }, 
        `Added "${title}" to your career roadmap. View your updated progress on the Career page.`
      );

      return {
        success: true,
        message: `Milestone "${title}" added to your Career Roadmap!`,
        actionId,
        decision: "approved",
        session,
        data: newItem,
      };
    }

    // Default fallback
    return {
      success: true,
      message: "Action approved and logged.",
      actionId,
      decision: "approved",
      session,
    };
  } catch (err: any) {
    recordTraceStep(session.sessionId, {
      agentType: session.agentType,
      toolName: "execute_approved_action",
      description: "Failed executing approved mutation",
      inputSummary: `Action ID: ${actionId}`,
      outputSummary: `Execution failed: ${err.message}`,
      status: "failed",
      durationMs: 10,
      requiresApproval: false,
    });

    return {
      success: false,
      message: `Failed to execute approved action: ${err.message}`,
      actionId,
      decision: "approved",
      error: err.message,
    };
  }
}

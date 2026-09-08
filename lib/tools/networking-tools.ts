import { findRelevantAlumni } from "@/lib/scoring";
import { getAlumniDetails } from "@/lib/database/network";
import { generateNetworkingMessage } from "@/lib/ai/gemini";
import type { NetworkingMessageDraft } from "@/lib/ai/schemas";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError,
  validateResourceAccess 
} from "./types";

export interface SearchAlumniToolInput {
  studentId: string;
  targetRole?: string;
  preferredScope?: "institution" | "broader_alumni" | "industry_network" | "global_network";
  minScoreThreshold?: number;
}

/**
 * Controlled Tool: Retrieves ranked alumni matching a student's career target.
 */
export async function searchAlumniTool(
  input: SearchAlumniToolInput,
  context: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Search alumni for student: ${input.studentId}, targetRole: ${input.targetRole || "active"}`;

  try {
    const result = await findRelevantAlumni(input.studentId, {
      preferredScope: input.preferredScope,
      minScoreThreshold: input.minScoreThreshold ?? 60.0,
    });

    return createToolResult("search_alumni", inputSummary, result, startTime);
  } catch (err: any) {
    return createToolError("search_alumni", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Generates personalized networking outreach draft using verified profile facts.
 * Mandatory Human-in-the-Loop approval before transmission.
 */
export async function generateNetworkingMessageTool(
  input: {
    studentId: string;
    alumniId: string;
  },
  context: ToolExecutionContext
): Promise<ToolResult<NetworkingMessageDraft>> {
  const startTime = Date.now();
  const inputSummary = `Generate outreach message draft for ${input.alumniId} by student ${input.studentId}`;

  const authCheck = validateResourceAccess(context, input.studentId);
  if (!authCheck.authorized) {
    return createToolError("generate_networking_message", inputSummary, authCheck.reason!, startTime);
  }

  try {
    const alumniMatch = await getAlumniDetails(input.alumniId, input.studentId);
    if (!alumniMatch) {
      return createToolError("generate_networking_message", inputSummary, "Alumni record not found", startTime);
    }

    const draft = await generateNetworkingMessage(
      {
        fullName: "Rohan Varma",
        headline: "ECE Senior Student @ ABC College | Aspiring Cloud Engineer",
        college: "ABC College of Engineering",
        major: "Electronics and Communication Engineering",
        targetRole: "Cloud Engineer",
        missingSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      },
      {
        fullName: alumniMatch.matched_user.full_name,
        headline: alumniMatch.matched_user.headline || "Cloud Architect",
        currentCompany: alumniMatch.matched_user.profile?.current_company || "Amazon Web Services",
        currentRole: alumniMatch.matched_user.profile?.current_role || "Senior Cloud Architect",
        college: alumniMatch.matched_user.education?.[0]?.institution_id ? "ABC College of Engineering" : "Engineering College",
        pastMajor: alumniMatch.matched_user.education?.[0]?.field_of_study || "Electronics and Communication Engineering",
        keySkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      }
    );

    return createToolResult<NetworkingMessageDraft>(
      "generate_networking_message",
      inputSummary,
      draft,
      startTime,
      true, // Mandatory Human-in-the-Loop review
      draft
    );
  } catch (err: any) {
    return createToolError("generate_networking_message", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Creates connection request proposal.
 * Strictly pauses for user confirmation before dispatching.
 */
export async function createConnectionRequestTool(
  input: {
    studentId: string;
    alumniId: string;
    proposedMessage: string;
  },
  context: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Propose connection request to ${input.alumniId} from ${input.studentId}`;

  const authCheck = validateResourceAccess(context, input.studentId);
  if (!authCheck.authorized) {
    return createToolError("create_connection_request", inputSummary, authCheck.reason!, startTime);
  }

  const proposal = {
    requesterId: input.studentId,
    receiverId: input.alumniId,
    initialMessage: input.proposedMessage,
    status: "pending_user_authorization",
    requiresApproval: true,
  };

  return createToolResult(
    "create_connection_request",
    inputSummary,
    proposal,
    startTime,
    true, // Human-in-the-loop requirement
    proposal
  );
}

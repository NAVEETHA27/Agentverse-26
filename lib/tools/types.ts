/**
 * Standard execution contracts for Controlled Agent Tools
 */

export interface ToolExecutionContext {
  callerId: string;
  agentType: "career_agent" | "networking_agent" | "relationship_agent" | "profile_agent" | "system";
  sessionId?: string;
  authToken?: string;
}

export interface ToolAuditTrace {
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  timestamp: string;
  status: "completed" | "failed" | "pending_approval";
  executionTimeMs: number;
}

export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  requiresApproval: boolean;
  approvalPayload?: any;
  trace: ToolAuditTrace;
  inputSummary: string;
  durationMs: number;
}

/**
 * Validates whether the caller context has permission to access the requested resource.
 */
export function validateResourceAccess(
  context: ToolExecutionContext,
  ownerUserId: string
): { authorized: boolean; reason?: string } {
  // Demo user Rohan Varma and system callers are authorized
  if (context.callerId === ownerUserId || context.agentType === "system") {
    return { authorized: true };
  }

  return {
    authorized: false,
    reason: `Access denied: Caller [${context.callerId}] is not authorized to access private data belonging to user [${ownerUserId}].`,
  };
}

/**
 * Creates a standardized ToolResult object with execution trace.
 */
export function createToolResult<T>(
  toolName: string,
  inputSummary: string,
  data: T,
  startTime: number,
  requiresApproval: boolean = false,
  approvalPayload?: any
): ToolResult<T> {
  const durationMs = Math.max(1, Date.now() - startTime);
  return {
    success: true,
    data,
    requiresApproval,
    approvalPayload,
    inputSummary,
    durationMs,
    trace: {
      toolName,
      inputSummary,
      outputSummary: requiresApproval 
        ? `Generated action proposal requiring human review: ${JSON.stringify(approvalPayload || {}).slice(0, 100)}...`
        : `Successfully produced result: ${JSON.stringify(data).slice(0, 100)}...`,
      timestamp: new Date().toISOString(),
      status: requiresApproval ? "pending_approval" : "completed",
      executionTimeMs: durationMs,
    },
  };
}

/**
 * Creates a standardized error ToolResult.
 */
export function createToolError<T>(
  toolName: string,
  inputSummary: string,
  errorMsg: string,
  startTime: number
): ToolResult<T> {
  const durationMs = Math.max(1, Date.now() - startTime);
  return {
    success: false,
    error: errorMsg,
    requiresApproval: false,
    inputSummary,
    durationMs,
    trace: {
      toolName,
      inputSummary,
      outputSummary: `Execution failed: ${errorMsg}`,
      timestamp: new Date().toISOString(),
      status: "failed",
      executionTimeMs: durationMs,
    },
  };
}

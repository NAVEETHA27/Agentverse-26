function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
}

import type { 
  AgentType, 
  AgentStatus, 
  AgentTraceStep, 
  PendingApprovalAction, 
  AgentExecutionState 
} from "./types";
import { DEMO_USER_ID, SEED_AGENT_SESSION } from "@/lib/seed-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Persistent runtime session store for active and recent agent runs across Next.js dev route modules
const globalForAgents = globalThis as unknown as {
  sessionStore?: Map<string, AgentExecutionState>;
  pendingApprovalsStore?: Map<string, { sessionId: string; action: PendingApprovalAction }>;
};

export const sessionStore = globalForAgents.sessionStore ?? new Map<string, AgentExecutionState>();
export const pendingApprovalsStore = globalForAgents.pendingApprovalsStore ?? new Map<string, { sessionId: string; action: PendingApprovalAction }>();

globalForAgents.sessionStore = sessionStore;
globalForAgents.pendingApprovalsStore = pendingApprovalsStore;

// Initialize with seed session for demo integrity
const initialSeedSession: AgentExecutionState = {
  sessionId: SEED_AGENT_SESSION.id,
  userId: SEED_AGENT_SESSION.user_id,
  agentType: SEED_AGENT_SESSION.agent_type as AgentType,
  originalGoal: SEED_AGENT_SESSION.goal,
  status: SEED_AGENT_SESSION.status as AgentStatus,
  currentStep: 4,
  maxSteps: 8,
  steps: SEED_AGENT_SESSION.actions.map((act, idx) => ({
    stepNumber: idx + 1,
    agentType: "networking_agent",
    toolName: act.action_type,
    description: `Executed ${act.action_type}`,
    inputSummary: JSON.stringify(act.input_data || {}),
    outputSummary: JSON.stringify(act.output_data || {}),
    status: act.status as any,
    durationMs: 420 + idx * 80,
    timestamp: act.created_at,
    requiresApproval: act.requires_approval,
  })),
  context: SEED_AGENT_SESSION.context as Record<string, any>,
  pendingApproval: null,
  nextBestAction: "Prepare for mock architecture review on AWS and Docker deployments with Rahul Sharma.",
  startedAt: SEED_AGENT_SESSION.started_at,
  completedAt: SEED_AGENT_SESSION.completed_at,
};

sessionStore.set(initialSeedSession.sessionId, initialSeedSession);

/**
 * Creates and registers a new agent execution session.
 */
export function createAgentSession(
  agentType: AgentType,
  userId: string = DEMO_USER_ID,
  goal: string,
  maxSteps: number = 8
): AgentExecutionState {
  const sessionId = generateUUID();
  const session: AgentExecutionState = {
    sessionId,
    userId,
    agentType,
    originalGoal: goal,
    status: "planning",
    currentStep: 0,
    maxSteps,
    steps: [],
    context: {},
    pendingApproval: null,
    startedAt: new Date().toISOString(),
  };

  sessionStore.set(sessionId, session);
  return session;
}

/**
 * Appends an audit step to the active agent execution trace.
 */
export function recordTraceStep(
  sessionId: string,
  step: Omit<AgentTraceStep, "stepNumber" | "timestamp">
): AgentTraceStep {
  const session = sessionStore.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const stepNumber = session.steps.length + 1;
  const traceStep: AgentTraceStep = {
    ...step,
    stepNumber,
    timestamp: new Date().toISOString(),
  };

  session.steps.push(traceStep);
  session.currentStep = stepNumber;

  // Persist to Supabase asynchronously if live database configured
  if (isSupabaseConfigured && supabase) {
    (async () => {
      try {
        await (supabase.from("agent_actions") as any).insert({
          id: generateUUID(),
          session_id: sessionId,
          action_type: step.toolName,
          input_data: { summary: step.inputSummary },
          output_data: { summary: step.outputSummary },
          status: step.status,
          requires_approval: !!step.requiresApproval,
          created_at: traceStep.timestamp,
        });
      } catch (e) {
        console.warn("[Trace] Failed to record step to Supabase:", e);
      }
    })();
  }

  return traceStep;
}

/**
 * Sets a pending Human-in-the-Loop approval action and pauses the session.
 */
export function setPendingApproval(
  sessionId: string,
  actionData: Omit<PendingApprovalAction, "actionId" | "createdAt" | "status">
): PendingApprovalAction {
  const session = sessionStore.get(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const actionId = generateUUID();
  const pendingAction: PendingApprovalAction = {
    ...actionData,
    actionId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  session.pendingApproval = pendingAction;
  session.status = "waiting_for_approval";
  pendingApprovalsStore.set(actionId, { sessionId, action: pendingAction });

  return pendingAction;
}

/**
 * Resolves a pending approval action (approved or rejected by user).
 */
export function resolvePendingApproval(
  actionId: string,
  decision: "approved" | "rejected",
  modifications?: { message?: string }
): { success: boolean; session?: AgentExecutionState; action?: PendingApprovalAction; error?: string } {
  const entry = pendingApprovalsStore.get(actionId);
  if (!entry) {
    return { success: false, error: "Pending approval action not found or expired" };
  }

  const { sessionId, action } = entry;
  const session = sessionStore.get(sessionId);
  if (!session) {
    return { success: false, error: `Parent session ${sessionId} not found` };
  }

  action.status = decision;
  if (modifications?.message && action.preview) {
    action.preview.message = modifications.message;
    if (action.payload) {
      action.payload.initialMessage = modifications.message;
    }
  }

  if (decision === "approved") {
    session.status = "completed";
    session.completedAt = new Date().toISOString();
  } else {
    session.status = "completed";
    session.completedAt = new Date().toISOString();
  }

  pendingApprovalsStore.delete(actionId);

  return {
    success: true,
    session,
    action,
  };
}

/**
 * Updates session status and outcomes.
 */
export function updateSessionStatus(
  sessionId: string,
  status: AgentStatus,
  result?: any,
  nextBestAction?: string,
  error?: string
): void {
  const session = sessionStore.get(sessionId);
  if (!session) return;

  session.status = status;
  if (result !== undefined) session.finalResult = result;
  if (nextBestAction !== undefined) session.nextBestAction = nextBestAction;
  if (error !== undefined) session.error = error;
  if (status === "completed" || status === "failed") {
    session.completedAt = new Date().toISOString();
  }

  if (isSupabaseConfigured && supabase) {
    (async () => {
      try {
        await (supabase.from("agent_sessions") as any).upsert({
          id: sessionId,
          user_id: session.userId,
          agent_type: session.agentType,
          goal: session.originalGoal,
          status: session.status,
          context: session.context,
          started_at: session.startedAt,
          completed_at: session.completedAt,
        });
      } catch (e) {
        console.warn("[Trace] Failed to upsert session to Supabase:", e);
      }
    })();
  }
}

/**
 * Retrieves a session by ID.
 */
export function getAgentSession(sessionId: string): AgentExecutionState | null {
  return sessionStore.get(sessionId) || null;
}

/**
 * Lists all sessions for a user, newest first.
 */
export function listAgentSessions(userId: string = DEMO_USER_ID): AgentExecutionState[] {
  const userSessions: AgentExecutionState[] = [];
  for (const session of sessionStore.values()) {
    if (session.userId === userId) {
      userSessions.push(session);
    }
  }
  return userSessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

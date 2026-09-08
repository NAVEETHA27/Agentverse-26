import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_AGENT_SESSION, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type AgentSessionRow = Database["public"]["Tables"]["agent_sessions"]["Row"];
export type AgentActionRow = Database["public"]["Tables"]["agent_actions"]["Row"];

export type AgentSessionWithActions = AgentSessionRow & {
  actions: AgentActionRow[];
};

/**
 * Retrieve agent execution sessions for a user.
 */
export async function getAgentSessions(
  userId: string = DEMO_USER_ID
): Promise<AgentSessionWithActions[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("agent_sessions")
        .select(`
          *,
          actions:agent_actions(*)
        `)
        .eq("user_id", userId)
        .order("started_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as unknown as AgentSessionWithActions[];
      }
    } catch (err) {
      console.warn("[Agents DAL] Failed to fetch agent sessions from Supabase, falling back to seed data:", err);
    }
  }

  return [SEED_AGENT_SESSION];
}

/**
 * Retrieve the latest agent session with full action trace.
 */
export async function getLatestAgentSession(
  userId: string = DEMO_USER_ID
): Promise<AgentSessionWithActions> {
  const sessions = await getAgentSessions(userId);
  return sessions[0] || SEED_AGENT_SESSION;
}

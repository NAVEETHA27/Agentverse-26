import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_CONNECTIONS, DEMO_USER_ID, SEED_USERS } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type ConnectionRow = Database["public"]["Tables"]["connections"]["Row"];
export type ConnectionWithPartner = ConnectionRow & {
  partner?: Database["public"]["Tables"]["users"]["Row"];
};

// In-memory local state for adding new connections dynamically
const globalForConnections = globalThis as unknown as {
  localConnections?: ConnectionWithPartner[];
};

if (!globalForConnections.localConnections) {
  globalForConnections.localConnections = [...SEED_CONNECTIONS];
}

const getLocalConnections = () => globalForConnections.localConnections!;
const setLocalConnections = (val: ConnectionWithPartner[]) => {
  globalForConnections.localConnections = val;
};

/**
 * Retrieve all connections for a user (both requested and received).
 */
export async function getConnections(
  userId: string = DEMO_USER_ID
): Promise<ConnectionWithPartner[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("connections")
        .select(`
          *,
          requester:users!connections_requester_id_fkey(*),
          receiver:users!connections_receiver_id_fkey(*)
        `)
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => {
          const partner = item.requester_id === userId ? item.receiver : item.requester;
          return {
            ...item,
            partner,
          };
        });
      }
    } catch (err) {
      console.warn("[Connections DAL] Failed to fetch connections from Supabase, falling back to seed data:", err);
    }
  }

  return getLocalConnections().filter(
    (c) => c.requester_id === userId || c.receiver_id === userId
  );
}

/**
 * Send a connection request to an alumni or peer.
 */
export async function sendConnectionRequest(
  requesterId: string = DEMO_USER_ID,
  receiverId: string,
  initialMessage?: string,
  connectionType: "mentor" | "peer" | "professional" | "mentee" | "alumni" = "mentor"
): Promise<ConnectionWithPartner> {
  const newConnection: ConnectionRow = {
    id: `conn_${Date.now()}`,
    requester_id: requesterId,
    receiver_id: receiverId,
    status: "pending",
    connection_type: connectionType,
    source: "ai_recommendation",
    initial_message: initialMessage || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    accepted_at: null,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase.from("connections") as any)
        .insert(newConnection)
        .select()
        .single();

      if (!error && data) {
        const partner = SEED_USERS.find((u) => u.id === receiverId);
        return {
          ...(data as ConnectionRow),
          partner,
        };
      }
    } catch (err) {
      console.warn("[Connections DAL] Failed to save connection to Supabase, saving to local state:", err);
    }
  }

  const partner = SEED_USERS.find((u) => u.id === receiverId);
  const result: ConnectionWithPartner = {
    ...newConnection,
    partner,
  };

  setLocalConnections([result, ...getLocalConnections()]);
  return result;
}

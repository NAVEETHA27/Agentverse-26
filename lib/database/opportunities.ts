import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_OPPORTUNITIES, SEED_USERS } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type OpportunityRow = Database["public"]["Tables"]["opportunities"]["Row"];
export type EnrichedOpportunity = OpportunityRow & {
  posted_by?: Database["public"]["Tables"]["users"]["Row"];
  skills?: Database["public"]["Tables"]["skills"]["Row"][];
};

/**
 * Retrieve all active opportunities (internships, jobs, projects).
 */
export async function getOpportunities(): Promise<EnrichedOpportunity[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          posted_by:users!opportunities_posted_by_user_id_fkey(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as unknown as EnrichedOpportunity[];
      }
    } catch (err) {
      console.warn("[Opportunities DAL] Failed to fetch opportunities from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_OPPORTUNITIES.map((op) => ({
    ...op,
    posted_by: SEED_USERS.find((u) => u.id === op.posted_by_user_id),
  }));
}

/**
 * Retrieve a specific opportunity by ID.
 */
export async function getOpportunityById(id: string): Promise<EnrichedOpportunity | null> {
  const ops = await getOpportunities();
  return ops.find((o) => o.id === id) || null;
}

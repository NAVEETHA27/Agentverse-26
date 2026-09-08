import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_EDUCATION, SEED_INSTITUTIONS, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type EducationRow = Database["public"]["Tables"]["education_records"]["Row"];
export type InstitutionRow = Database["public"]["Tables"]["institutions"]["Row"];

/**
 * Retrieve education history for a given user.
 */
export async function getEducation(userId: string = DEMO_USER_ID): Promise<EducationRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("education_records")
        .select("*")
        .eq("user_id", userId)
        .order("start_year", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as EducationRow[];
      }
    } catch (err) {
      console.warn("[Education DAL] Failed to fetch education records from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_EDUCATION.filter((e) => e.user_id === userId);
}

/**
 * Retrieve institutions list.
 */
export async function getInstitutions(): Promise<InstitutionRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as InstitutionRow[];
      }
    } catch (err) {
      console.warn("[Education DAL] Failed to fetch institutions from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_INSTITUTIONS;
}

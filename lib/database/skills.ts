import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_SKILLS, SEED_USER_SKILLS, SEED_SKILL_GAPS, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
export type UserSkillWithDetails = Database["public"]["Tables"]["user_skills"]["Row"] & {
  skill?: SkillRow;
};
export type SkillGapWithDetails = Database["public"]["Tables"]["skill_gaps"]["Row"] & {
  skill?: SkillRow;
};

/**
 * Retrieve skills possessed by a user.
 */
export async function getUserSkills(userId: string = DEMO_USER_ID): Promise<UserSkillWithDetails[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("user_skills")
        .select("*, skill:skills(*)")
        .eq("user_id", userId);

      if (!error && data && data.length > 0) {
        return data as unknown as UserSkillWithDetails[];
      }
    } catch (err) {
      console.warn("[Skills DAL] Failed to fetch user skills from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_USER_SKILLS.filter((us) => us.user_id === userId);
}

/**
 * Retrieve identified skill gaps for a user or career goal.
 */
export async function getSkillGaps(goalId: string = "cg1"): Promise<SkillGapWithDetails[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("skill_gaps")
        .select("*, skill:skills(*)")
        .eq("career_goal_id", goalId);

      if (!error && data && data.length > 0) {
        return data as unknown as SkillGapWithDetails[];
      }
    } catch (err) {
      console.warn("[Skills DAL] Failed to fetch skill gaps from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_SKILL_GAPS.filter((sg) => sg.career_goal_id === goalId);
}

/**
 * Retrieve master skills catalog.
 */
export async function getAllSkills(): Promise<SkillRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as SkillRow[];
      }
    } catch (err) {
      console.warn("[Skills DAL] Failed to fetch master skills from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_SKILLS;
}

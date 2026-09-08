import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_PROFILES, SEED_USERS, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["professional_profiles"]["Row"];
export type UserProfile = ProfileRow & {
  user?: Database["public"]["Tables"]["users"]["Row"];
};

/**
 * Retrieve professional profile for a given user.
 */
export async function getProfile(userId: string = DEMO_USER_ID): Promise<ProfileRow | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("professional_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        return data as ProfileRow;
      }
    } catch (err) {
      console.warn("[Profiles DAL] Failed to fetch profile from Supabase, falling back to seed data:", err);
    }
  }

  const profile = SEED_PROFILES.find((p) => p.user_id === userId);
  return profile || SEED_PROFILES[0];
}

/**
 * Retrieve professional profile with attached user object.
 */
export async function getProfileWithUser(userId: string = DEMO_USER_ID): Promise<UserProfile | null> {
  const profile = await getProfile(userId);
  if (!profile) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (user) {
        return {
          ...profile,
          user: user as Database["public"]["Tables"]["users"]["Row"],
        };
      }
    } catch (err) {
      console.warn("[Profiles DAL] Failed to fetch user for profile:", err);
    }
  }

  const user = SEED_USERS.find((u) => u.id === userId) || SEED_USERS[0];
  return {
    ...profile,
    user,
  };
}

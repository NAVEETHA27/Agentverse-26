import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_USERS, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];

/**
 * Retrieve a user by ID. Defaults to DEMO_USER_ID (Rohan Varma) if not specified or not found.
 */
export async function getUser(userId: string = DEMO_USER_ID): Promise<UserRow> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        return data as UserRow;
      }
    } catch (err) {
      console.warn("[Users DAL] Failed to fetch user from Supabase, falling back to seed data:", err);
    }
  }

  // Fallback to in-memory seed data
  const user = SEED_USERS.find((u) => u.id === userId);
  return user || SEED_USERS[0];
}

/**
 * Retrieve all registered users.
 */
export async function getAllUsers(): Promise<UserRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as UserRow[];
      }
    } catch (err) {
      console.warn("[Users DAL] Failed to fetch users from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_USERS;
}

/**
 * Retrieve current demo user (Rohan Varma)
 */
export async function getCurrentUser(): Promise<UserRow> {
  return getUser(DEMO_USER_ID);
}

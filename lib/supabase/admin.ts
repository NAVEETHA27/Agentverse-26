import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && 
  supabaseServiceKey && 
  supabaseUrl.startsWith("http") &&
  supabaseServiceKey !== ""
);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient<Database>(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    console.warn(
      "[Supabase Admin] SUPABASE_SECRET_KEY is not configured. Falling back to local data store."
    );
  }
  return supabaseAdmin;
}

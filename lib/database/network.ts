import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_MATCH_RESULTS, DEMO_USER_ID, SEED_USERS, SEED_PROFILES, SEED_EDUCATION } from "@/lib/seed-data";
import { findRelevantAlumni } from "@/lib/scoring/service";
import type { MatchingResult, EnrichedMatchResult } from "@/lib/scoring/types";
import type { Database } from "@/types/database";

export type { EnrichedMatchResult } from "@/lib/scoring/types";
export type MatchResultRow = Database["public"]["Tables"]["match_results"]["Row"];

/**
 * Retrieve ranked recommended alumni mentors for a student.
 * Uses the deterministic scoring engine to dynamically score and rank candidates.
 */
export async function getRecommendedAlumni(
  studentId: string = DEMO_USER_ID
): Promise<EnrichedMatchResult[]> {
  try {
    const result = await findRelevantAlumni(studentId);
    if (result.matches && result.matches.length > 0) {
      return result.matches;
    }
  } catch (err) {
    console.warn("[Network DAL] Dynamic matching failed, falling back to seed matches:", err);
  }

  // Fallback to in-memory seed matches
  const results = SEED_MATCH_RESULTS.filter((mr) => mr.user_id === studentId);
  return (results.length > 0 ? results : SEED_MATCH_RESULTS) as EnrichedMatchResult[];
}

/**
 * Retrieve matching results with progressive search scope details.
 */
export async function getMatchingWithScope(
  studentId: string = DEMO_USER_ID
): Promise<MatchingResult> {
  try {
    return await findRelevantAlumni(studentId);
  } catch (err) {
    console.warn("[Network DAL] Failed to execute scoped matching:", err);
    return {
      matches: SEED_MATCH_RESULTS as EnrichedMatchResult[],
      searchScope: "broader_alumni",
      scopeMessage: "Expanded search to regional university and industry partner networks to provide comprehensive mentor options.",
      totalEvaluated: SEED_MATCH_RESULTS.length,
      levelCounts: {
        institution: 1,
        broader_alumni: 1,
        industry_network: 2,
      },
    };
  }
}

/**
 * Retrieve single alumni details including matching explanation and score breakdown.
 */
export async function getAlumniDetails(
  alumniId: string, 
  studentId: string = DEMO_USER_ID
): Promise<EnrichedMatchResult | null> {
  const allMatches = await getRecommendedAlumni(studentId);
  const match = allMatches.find((m) => m.matched_user_id === alumniId);
  if (match) return match;

  // Fallback: construct if in users
  const user = SEED_USERS.find((u) => u.id === alumniId);
  if (!user) return null;

  return {
    id: `fallback-${alumniId}`,
    user_id: studentId,
    matched_user_id: alumniId,
    career_goal_id: "cg1",
    match_type: "alumni_mentor",
    overall_score: 75.0,
    career_goal_score: 20.0,
    skill_score: 20.0,
    education_score: 15.0,
    industry_score: 10.0,
    experience_score: 10.0,
    location_score: 5.0,
    explanation: `${user.full_name} is an experienced professional in your field.`,
    match_reasons: ["Verified professional in tech", "Alumni of institution"],
    search_scope: "institution",
    created_at: new Date().toISOString(),
    expires_at: null,
    matched_user: {
      ...user,
      profile: SEED_PROFILES.find((p) => p.user_id === alumniId),
      education: SEED_EDUCATION.filter((e) => e.user_id === alumniId),
    },
  };
}

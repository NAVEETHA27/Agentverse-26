import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { 
  DEMO_USER_ID, 
  SEED_USERS, 
  SEED_PROFILES, 
  SEED_EDUCATION, 
  SEED_USER_SKILLS, 
  SEED_SKILL_GAPS,
  SEED_CAREER_GOALS 
} from "@/lib/seed-data";
import { 
  calculateMatchScore 
} from "./matcher";
import type { 
  StudentMatchContext, 
  CandidateMatchContext, 
  MatchingOptions, 
  MatchingResult, 
  EnrichedMatchResult 
} from "./types";

/**
 * Builds the student matching context from Supabase or local seed data.
 */
export async function buildStudentContext(
  studentId: string = DEMO_USER_ID
): Promise<StudentMatchContext> {
  // Try fetching from Supabase if online
  if (isSupabaseConfigured && supabase) {
    try {
      const [userRes, goalRes, eduRes, skillsRes, gapsRes] = await Promise.all([
        supabase.from("users").select("*").eq("id", studentId).single(),
        supabase.from("career_goals").select("*").eq("user_id", studentId).eq("status", "active").single(),
        supabase.from("education_records").select("*").eq("user_id", studentId).order("start_year", { ascending: false }),
        supabase.from("user_skills").select("*, skill:skills(*)").eq("user_id", studentId),
        supabase.from("skill_gaps").select("*, skill:skills(*)").eq("user_id", studentId),
      ]);

      const primaryEdu = (eduRes.data as any)?.[0];
      const goalData = goalRes.data as any;
      const targetRole = goalData?.target_role || "Cloud Engineer";
      const targetIndustry = goalData?.target_industry || "Cloud Infrastructure";
      const currentSkills = (skillsRes.data || []).map((s: any) => s.skill?.name || "").filter(Boolean);
      const skillGaps = (gapsRes.data || []).map((g: any) => g.skill?.name || "").filter(Boolean);

      return {
        studentId,
        institutionId: primaryEdu?.institution_id || "11111111-1111-1111-1111-111111111111",
        institutionName: "ABC College of Engineering",
        fieldOfStudy: primaryEdu?.field_of_study || "Electronics and Communication Engineering",
        targetRole,
        targetIndustry,
        currentSkills: currentSkills.length > 0 ? currentSkills : ["Python", "Linux", "Networking", "C++"],
        skillGaps: skillGaps.length > 0 ? skillGaps : ["AWS", "Docker", "Kubernetes", "CI/CD"],
        careerGoalId: goalData?.id || "cg1",
      };
    } catch (err) {
      console.warn("[Matching Service] Failed to build context from Supabase, using seed data:", err);
    }
  }

  // Fallback to in-memory demo student context
  const primaryEdu = SEED_EDUCATION.find((e) => e.user_id === studentId);
  const goal = SEED_CAREER_GOALS.find((g) => g.user_id === studentId);
  const currentSkills = SEED_USER_SKILLS.filter((us) => us.user_id === studentId).map((us) => us.skill?.name || "");
  const skillGaps = SEED_SKILL_GAPS.filter((sg) => sg.user_id === studentId).map((sg) => sg.skill?.name || "");

  return {
    studentId,
    institutionId: primaryEdu?.institution_id || "11111111-1111-1111-1111-111111111111",
    institutionName: "ABC College of Engineering",
    fieldOfStudy: primaryEdu?.field_of_study || "Electronics and Communication Engineering",
    targetRole: goal?.target_role || "Cloud Engineer",
    targetIndustry: goal?.target_industry || "Cloud Infrastructure & DevOps",
    currentSkills: currentSkills.length > 0 ? currentSkills : ["Python", "Linux", "Networking", "C++"],
    skillGaps: skillGaps.length > 0 ? skillGaps : ["AWS", "Docker", "Kubernetes", "CI/CD"],
    careerGoalId: goal?.id || "cg1",
  };
}

/**
 * Builds candidate pool excluding the student.
 */
export async function getCandidatePool(studentId: string): Promise<CandidateMatchContext[]> {
  const candidates: CandidateMatchContext[] = [];

  // Candidate mentor skill lookup
  const mentorSkillsMap: Record<string, string[]> = {
    "u2222222-2222-2222-2222-222222222222": ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Python", "Terraform", "Cloud Architecture"],
    "u3333333-3333-3333-3333-333333333333": ["Java", "Azure", "SQL", "Distributed Systems", "Python", "Microservices"],
    "u4444444-4444-4444-4444-444444444444": ["Kubernetes", "CI/CD", "Python", "Go", "Terraform", "Linux", "GCP", "Monitoring"],
    "u5555555-5555-5555-5555-555555555555": ["Docker", "Terraform", "Linux", "CI/CD", "Go", "AWS", "Infrastructure as Code"],
  };

  const candidateUsers = SEED_USERS.filter((u) => u.id !== studentId);

  for (const user of candidateUsers) {
    const profile = SEED_PROFILES.find((p) => p.user_id === user.id);
    const education = SEED_EDUCATION.filter((e) => e.user_id === user.id);
    const skills = mentorSkillsMap[user.id] || ["Software Engineering", "Cloud"];

    candidates.push({
      candidateId: user.id,
      user,
      profile,
      education,
      skills,
    });
  }

  return candidates;
}

/**
 * CORE MATCHING ENGINE ENTRYPOINT
 * Performs progressive search, multi-factor scoring, ranking, and explanation generation.
 */
export async function findRelevantAlumni(
  studentId: string = DEMO_USER_ID,
  options: MatchingOptions = {}
): Promise<MatchingResult> {
  const student = await buildStudentContext(studentId);
  const allCandidates = await getCandidatePool(studentId);

  // Progressive Search Levels
  // Level 1: Candidates from the student's exact institution
  const level1Candidates = allCandidates.filter((c) =>
    c.education.some((e) => e.institution_id === student.institutionId)
  );

  // Level 2: Broader regional / university network
  const level2Candidates = allCandidates.filter((c) =>
    !level1Candidates.some((l1) => l1.candidateId === c.candidateId) &&
    c.education.some((e) => e.institution_id === "22222222-2222-2222-2222-222222222222")
  );

  // Level 3: Industry & national tech network
  const level3Candidates = allCandidates.filter((c) =>
    !level1Candidates.some((l1) => l1.candidateId === c.candidateId) &&
    !level2Candidates.some((l2) => l2.candidateId === c.candidateId)
  );

  let searchScope: "institution" | "broader_alumni" | "industry_network" = "institution";
  let scopeMessage: string | null = null;
  let evaluatedCandidates = level1Candidates;

  // Progressive search trigger: if fewer than 3 candidates from direct institution, expand!
  if (level1Candidates.length < 3) {
    evaluatedCandidates = [...level1Candidates, ...level2Candidates, ...level3Candidates];
    searchScope = "broader_alumni";
    scopeMessage = `Found ${level1Candidates.length} direct alumni mentor from ABC College of Engineering. Expanded search to regional university and industry partner networks to provide comprehensive mentor options.`;
  }

  // Score all evaluated candidates
  const scoredMatches: EnrichedMatchResult[] = evaluatedCandidates.map((candidate) => {
    const breakdown = calculateMatchScore(student, candidate);

    return {
      id: `mr_${candidate.candidateId}`,
      user_id: student.studentId,
      matched_user_id: candidate.candidateId,
      career_goal_id: student.careerGoalId || null,
      match_type: "alumni_mentor",
      overall_score: breakdown.overallScore,
      career_goal_score: breakdown.careerGoalScore,
      skill_score: breakdown.skillScore,
      education_score: breakdown.educationScore,
      industry_score: breakdown.industryScore,
      experience_score: breakdown.experienceScore,
      location_score: 8.0,
      explanation: breakdown.explanation,
      match_reasons: breakdown.matchReasons,
      searchScope: breakdown.searchScope,
      search_scope: breakdown.searchScope,
      created_at: new Date().toISOString(),
      expires_at: null,
      matched_user: {
        ...candidate.user,
        profile: candidate.profile || undefined,
        education: candidate.education,
      },
    };
  });

  // Sort descending by deterministic overall score
  scoredMatches.sort((a, b) => b.overall_score - a.overall_score);

  // Filter by minimum threshold if specified
  const minThreshold = options.minScoreThreshold ?? 60.0;
  const filtered = scoredMatches.filter((m) => m.overall_score >= minThreshold);
  const finalMatches = options.maxResults ? filtered.slice(0, options.maxResults) : filtered;

  return {
    matches: finalMatches,
    searchScope,
    scopeMessage,
    totalEvaluated: evaluatedCandidates.length,
    levelCounts: {
      institution: level1Candidates.length,
      broader_alumni: level2Candidates.length,
      industry_network: level3Candidates.length,
    },
  };
}

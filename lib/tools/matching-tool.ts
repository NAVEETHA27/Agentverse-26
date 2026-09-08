import { findRelevantAlumni } from "@/lib/scoring";
import type { MatchingResult } from "@/lib/scoring";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError 
} from "./types";

export interface MatchingToolInput {
  studentId: string;
  targetRole?: string;
  preferredScope?: "institution" | "broader_alumni" | "industry_network" | "global_network";
  minScoreThreshold?: number;
  maxResults?: number;
}

/**
 * ALUMNI MATCHING TOOL
 * Controlled tool that calls the Phase 4 deterministic matching engine.
 * strictly preserves the 30/25/20/15/10 mathematical formula without LLM scoring hallucination.
 */
export async function executeAlumniMatchingTool(
  input: MatchingToolInput,
  context?: ToolExecutionContext
): Promise<ToolResult<MatchingResult>> {
  const startTime = Date.now();
  const inputSummary = `Matching query for student: ${input.studentId}, targetRole: ${input.targetRole || "active_goal"}`;

  try {
    const result = await findRelevantAlumni(input.studentId, {
      minScoreThreshold: input.minScoreThreshold ?? 60.0,
      maxResults: input.maxResults ?? 10,
      preferredScope: input.preferredScope,
    });

    return createToolResult<MatchingResult>(
      "search_alumni_network",
      inputSummary,
      result,
      startTime,
      false
    );
  } catch (err: any) {
    return createToolError<MatchingResult>(
      "search_alumni_network",
      inputSummary,
      err?.message || "Failed to execute deterministic alumni matching.",
      startTime
    );
  }
}

/**
 * CALCULATE MATCH TOOL
 * Evaluates the 5 deterministic factors between a specific student and candidate.
 */
export async function calculateMatchTool(
  studentId: string,
  candidateId: string,
  context?: ToolExecutionContext
): Promise<ToolResult<any>> {
  const startTime = Date.now();
  const inputSummary = `Deterministic scoring: student ${studentId} vs candidate ${candidateId}`;

  try {
    const { buildStudentContext, getCandidatePool, calculateMatchScore } = await import("@/lib/scoring");
    const student = await buildStudentContext(studentId);
    const pool = await getCandidatePool(studentId);
    const candidate = pool.find((c) => c.candidateId === candidateId);
    if (!candidate) {
      return createToolError("calculate_match", inputSummary, `Candidate [${candidateId}] not found in pool`, startTime);
    }

    const breakdown = calculateMatchScore(student, candidate);
    return createToolResult("calculate_match", inputSummary, breakdown, startTime);
  } catch (err: any) {
    return createToolError("calculate_match", inputSummary, err?.message || "Scoring calculation failed", startTime);
  }
}

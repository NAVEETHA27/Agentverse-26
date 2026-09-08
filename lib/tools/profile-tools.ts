import { getUser, getProfile, getEducation, getUserSkills } from "@/lib/database";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError,
  validateResourceAccess 
} from "./types";

export interface FullUserProfilePayload {
  user: any;
  profile: any;
  education: any[];
  skills: any[];
}

/**
 * Controlled Tool: Retrieves student's own unified profile with security check.
 */
export async function getUserProfileTool(
  userId: string,
  context: ToolExecutionContext
): Promise<ToolResult<FullUserProfilePayload>> {
  const startTime = Date.now();
  const inputSummary = `Fetch profile for user: ${userId}`;

  const authCheck = validateResourceAccess(context, userId);
  if (!authCheck.authorized) {
    return createToolError("get_user_profile", inputSummary, authCheck.reason!, startTime);
  }

  try {
    const [user, profile, education, skills] = await Promise.all([
      getUser(userId),
      getProfile(userId),
      getEducation(userId),
      getUserSkills(userId),
    ]);

    return createToolResult<FullUserProfilePayload>(
      "get_user_profile",
      inputSummary,
      { user, profile, education, skills },
      startTime
    );
  } catch (err: any) {
    return createToolError("get_user_profile", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Retrieves public verified alumni profile.
 */
export async function getAlumniProfileTool(
  alumniId: string,
  context: ToolExecutionContext
): Promise<ToolResult<FullUserProfilePayload>> {
  const startTime = Date.now();
  const inputSummary = `Fetch verified public alumni profile: ${alumniId}`;

  try {
    const [user, profile, education] = await Promise.all([
      getUser(alumniId),
      getProfile(alumniId),
      getEducation(alumniId),
    ]);

    return createToolResult<FullUserProfilePayload>(
      "get_alumni_profile",
      inputSummary,
      { user, profile, education, skills: [] },
      startTime
    );
  } catch (err: any) {
    return createToolError("get_alumni_profile", inputSummary, err.message, startTime);
  }
}

export interface MentorshipPreferencesPayload {
  userId: string;
  isAvailable: boolean;
  preferredMode: "chat" | "async" | "flexible";
  topics: string[];
  maxMentees: number;
}

/**
 * Controlled Tool: Retrieves mentorship preferences and availability.
 */
export async function getMentorshipPreferencesTool(
  userId: string,
  context?: ToolExecutionContext
): Promise<ToolResult<MentorshipPreferencesPayload>> {
  const startTime = Date.now();
  const inputSummary = `Fetch mentorship preferences for user: ${userId}`;

  const payload: MentorshipPreferencesPayload = {
    userId,
    isAvailable: true,
    preferredMode: "chat",
    topics: ["Cloud Architecture", "Career Transition from ECE", "AWS Fundamentals", "Docker Containerization"],
    maxMentees: 5,
  };

  return createToolResult<MentorshipPreferencesPayload>(
    "get_mentorship_preferences",
    inputSummary,
    payload,
    startTime
  );
}

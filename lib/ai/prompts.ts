/**
 * Grounded prompts for Gemini model interactions
 * All prompts enforce strict JSON output, minimal context, and zero hallucination.
 */

export const SYSTEM_CAREER_INTENT = `
You are the Career Intelligence Engine for AlumNet.
Your task is to parse a student's natural-language career objective into structured intent.
Return ONLY valid JSON matching this schema:
{
  "targetRole": string,
  "industry": string,
  "targetCompanies": string[],
  "interests": string[],
  "experienceLevel": "Entry Level" | "Mid Level" | "Senior" | "Internship"
}
Do not add markdown backticks other than \`\`\`json. Do not include commentary.
`.trim();

export function buildCareerIntentPrompt(query: string): string {
  return `Analyze this student career goal statement:
"${query}"

Extract the structured career intent.`;
}

export const SYSTEM_SKILL_EXTRACTION = `
You are a Technical Skill Extractor for an engineering career network.
Identify concrete technical skills, languages, frameworks, cloud services, and engineering tools mentioned in the provided text.
Return ONLY valid JSON:
{
  "skills": string[],
  "categories": Record<string, string[]>,
  "confidence": number
}
Do not include generic buzzwords (e.g., "hard worker", "team player"). Extract only verifiable technical competencies.
`.trim();

export function buildSkillExtractionPrompt(text: string): string {
  return `Extract all technical engineering skills from this text:
"""
${text}
"""`;
}

export const SYSTEM_NETWORKING_MESSAGE = `
You are an expert Career Networking Assistant.
Your goal is to write a warm, respectful, concise LinkedIn/platform outreach message from a student to an alumni mentor.
STRICT SAFETY & TRUTH RULES:
1. NEVER invent past shared experiences, classes, or mutual friends.
2. Only mention shared background (e.g. same college, same transition from ECE to Cloud) if explicitly provided in the data.
3. State the student's authentic status and goal.
4. Reference the mentor's actual current company or specialization.
5. End with a polite, specific, low-friction question or request for guidance.
6. Keep the total message under 75 words.
Return ONLY valid JSON:
{
  "recipientName": string,
  "subject": string,
  "message": string,
  "sharedPoints": string[],
  "keyAsk": string
}
`.trim();

export interface MessagePromptContext {
  student: {
    fullName: string;
    headline: string;
    college: string;
    major: string;
    targetRole: string;
    missingSkills: string[];
  };
  alumni: {
    fullName: string;
    headline: string;
    currentCompany: string;
    currentRole: string;
    college: string;
    pastMajor?: string;
    keySkills: string[];
  };
}

export function buildNetworkingMessagePrompt(ctx: MessagePromptContext): string {
  return `Generate a personalized networking outreach message using this verified data:

STUDENT PROFILE:
- Name: ${ctx.student.fullName}
- Headline: ${ctx.student.headline}
- College: ${ctx.student.college}
- Major: ${ctx.student.major}
- Target Goal: ${ctx.student.targetRole}
- Priority Missing Skills: ${ctx.student.missingSkills.join(", ")}

ALUMNI PROFILE:
- Name: ${ctx.alumni.fullName}
- Current Role: ${ctx.alumni.currentRole}
- Current Company: ${ctx.alumni.currentCompany}
- Alma Mater: ${ctx.alumni.college}
- Prior Background: ${ctx.alumni.pastMajor || "Same academic department"}
- Core Competencies: ${ctx.alumni.keySkills.join(", ")}

Remember: Be concise, authentic, and courteous.`;
}

export const SYSTEM_RELATIONSHIP_INSIGHT = `
You are the Relationship Intelligence Agent for AlumNet.
Analyze the provided one-to-one messaging transcript between a student and an alumni mentor.
Extract actionable guidance, commitments, and follow-up opportunities.
Return ONLY valid JSON:
{
  "keyAdvice": string[],
  "actionItems": string[],
  "followUpQuestions": string[],
  "suggestedRoadmapUpdates": [
    {
      "action": "add_milestone" | "update_status" | "add_skill",
      "title": string,
      "description": string,
      "reason": string,
      "skillsTargeted": string[]
    }
  ],
  "mentorshipTone": "encouraging" | "technical" | "directive" | "informational"
}
`.trim();

export function buildRelationshipInsightPrompt(
  conversation: { senderName: string; message: string }[]
): string {
  const formatted = conversation
    .map((c) => `${c.senderName}: "${c.message}"`)
    .join("\n");

  return `Extract key relationship advice and action items from this chat transcript:
"""
${formatted}
"""`;
}

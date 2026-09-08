import {
  SYSTEM_CAREER_INTENT,
  SYSTEM_SKILL_EXTRACTION,
  SYSTEM_NETWORKING_MESSAGE,
  SYSTEM_RELATIONSHIP_INSIGHT,
  buildCareerIntentPrompt,
  buildSkillExtractionPrompt,
  buildNetworkingMessagePrompt,
  buildRelationshipInsightPrompt,
  type MessagePromptContext,
} from "./prompts";
import type {
  CareerIntent,
  SkillExtractionResult,
  NetworkingMessageDraft,
  RelationshipInsight,
} from "./schemas";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY && 
  GEMINI_API_KEY.trim().length > 0 &&
  GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY"
);

/**
 * Executes a controlled structured Gemini call with timeout, error handling, and robust fallback.
 */
async function callGeminiStructured<T>(
  userPrompt: string,
  systemInstruction: string,
  fallback: T
): Promise<T> {
  if (!isGeminiConfigured) {
    return fallback;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second safety timeout

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for deterministic, reliable structured extraction
          responseMimeType: "application/json",
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Gemini API] Request failed with HTTP ${response.status}: ${response.statusText}`);
      return fallback;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.warn("[Gemini API] Empty response returned, using fallback.");
      return fallback;
    }

    // Clean potential markdown fencing
    const cleanedJson = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedJson) as T;
    return parsed;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      console.warn("[Gemini API] Call timed out after 8s, falling back to deterministic response.");
    } else {
      console.warn("[Gemini API] Call encountered error, falling back to deterministic response:", err?.message || err);
    }
    return fallback;
  }
}

/**
 * 1. CAREER GOAL UNDERSTANDING
 * Converts natural-language user query into validated structured CareerIntent.
 */
export async function parseCareerIntent(userInput: string): Promise<CareerIntent> {
  const norm = userInput.toLowerCase();
  
  // Deterministic rule-based fallback
  const isCloud = norm.includes("cloud") || norm.includes("devops") || norm.includes("sre") || norm.includes("aws");
  const isSecurity = norm.includes("security") || norm.includes("cyber");
  const isData = norm.includes("data") || norm.includes("analytics") || norm.includes("ml");

  const targetRole = isSecurity 
    ? "Cybersecurity Analyst"
    : isData 
    ? "Data Engineer" 
    : "Cloud Engineer";

  const industry = isSecurity
    ? "Cybersecurity"
    : isData
    ? "Data & AI"
    : "Cloud Infrastructure & DevOps";

  const targetCompanies = [];
  if (norm.includes("aws") || norm.includes("amazon")) targetCompanies.push("AWS");
  if (norm.includes("google") || norm.includes("gcp")) targetCompanies.push("Google");
  if (norm.includes("microsoft") || norm.includes("azure")) targetCompanies.push("Microsoft");
  if (targetCompanies.length === 0) targetCompanies.push("AWS", "CloudScale Systems");

  const fallbackIntent: CareerIntent = {
    targetRole,
    industry,
    targetCompanies,
    interests: ["Cloud Infrastructure", "Distributed Systems", "Containerization"],
    experienceLevel: "Entry Level",
    rawIntent: userInput,
  };

  const result = await callGeminiStructured<CareerIntent>(
    buildCareerIntentPrompt(userInput),
    SYSTEM_CAREER_INTENT,
    fallbackIntent
  );

  return {
    targetRole: result.targetRole || fallbackIntent.targetRole,
    industry: result.industry || fallbackIntent.industry,
    targetCompanies: Array.isArray(result.targetCompanies) && result.targetCompanies.length > 0 
      ? result.targetCompanies 
      : fallbackIntent.targetCompanies,
    interests: Array.isArray(result.interests) ? result.interests : fallbackIntent.interests,
    experienceLevel: result.experienceLevel || fallbackIntent.experienceLevel,
    rawIntent: userInput,
  };
}

/**
 * 2. SKILL EXTRACTION
 * Controlled extraction of technical tools, frameworks, and skills from arbitrary texts.
 */
export async function extractSkillsFromText(text: string): Promise<SkillExtractionResult> {
  // Deterministic keyword scanning fallback
  const knownKeywords = [
    "AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Python", "Java", "C++", 
    "Terraform", "Node.js", "React", "TypeScript", "SQL", "PostgreSQL", "Go", "ECS", 
    "Git", "GitHub Actions", "Kafka", "Redis", "MQTT", "ESP32", "Microservices"
  ];

  const foundSkills = knownKeywords.filter((k) => 
    new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );

  const fallbackExtraction: SkillExtractionResult = {
    skills: foundSkills.length > 0 ? foundSkills : ["Cloud Architecture", "Linux", "Docker"],
    categories: {
      Cloud: foundSkills.filter((s) => ["AWS", "ECS", "Terraform"].includes(s)),
      DevOps: foundSkills.filter((s) => ["Docker", "Kubernetes", "CI/CD", "Linux", "Git", "GitHub Actions"].includes(s)),
      Programming: foundSkills.filter((s) => ["Python", "Java", "C++", "TypeScript", "Node.js", "Go"].includes(s)),
    },
    confidence: 0.92,
    sourceText: text,
  };

  const result = await callGeminiStructured<SkillExtractionResult>(
    buildSkillExtractionPrompt(text),
    SYSTEM_SKILL_EXTRACTION,
    fallbackExtraction
  );

  return {
    skills: Array.isArray(result.skills) && result.skills.length > 0 ? result.skills : fallbackExtraction.skills,
    categories: result.categories || fallbackExtraction.categories,
    confidence: typeof result.confidence === "number" ? result.confidence : 0.9,
    sourceText: text,
  };
}

/**
 * 3. PERSONALIZED NETWORKING MESSAGE GENERATION
 * Synthesizes grounded outreach proposals using factual profile data.
 * Always sets requiresApproval: true.
 */
export async function generateNetworkingMessage(
  student: MessagePromptContext["student"],
  alumni: MessagePromptContext["alumni"]
): Promise<NetworkingMessageDraft> {
  const fallbackDraft: NetworkingMessageDraft = {
    recipientName: alumni.fullName,
    subject: `Advice on ECE to Cloud Engineering Transition — Junior from ${student.college}`,
    message: `Hi ${alumni.fullName}, I noticed that you transitioned from an ${student.major} background at ${student.college} into cloud architecture and now work at ${alumni.currentCompany}. I am preparing for an entry-level ${student.targetRole} position and would really appreciate your guidance on what to prioritize.`,
    sharedPoints: [
      `Alumni of ${student.college}`,
      `Navigated the ${student.major} to ${student.targetRole} career transition`,
      `Expertise in ${student.missingSkills.slice(0, 2).join(" & ")}`,
    ],
    keyAsk: "Guidance on foundational priorities for cloud transition",
    requiresApproval: true,
  };

  const prompt = buildNetworkingMessagePrompt({ student, alumni });

  const result = await callGeminiStructured<NetworkingMessageDraft>(
    prompt,
    SYSTEM_NETWORKING_MESSAGE,
    fallbackDraft
  );

  return {
    recipientName: result.recipientName || alumni.fullName,
    subject: result.subject || fallbackDraft.subject,
    message: result.message || fallbackDraft.message,
    sharedPoints: Array.isArray(result.sharedPoints) ? result.sharedPoints : fallbackDraft.sharedPoints,
    keyAsk: result.keyAsk || fallbackDraft.keyAsk,
    requiresApproval: true, // Inviolable agentic safety contract
  };
}

/**
 * 4. RELATIONSHIP INSIGHTS EXTRACTION
 * Analyzes authorized chat transcripts to surface actionable mentor takeaways and roadmap items.
 */
export async function extractRelationshipInsights(
  conversation: { senderName: string; message: string }[]
): Promise<RelationshipInsight> {
  const fallbackInsights: RelationshipInsight = {
    summary: "Mentor Rahul Sharma provided strategic guidance on leveraging your Linux/Python systems foundation for Cloud Engineering, emphasizing Docker containerization and AWS deployments.",
    keyAdvice: [
      "Your ECE background with Linux & Python gives you a system-level advantage over generic applicants.",
      "Master AWS core compute, VPC, and storage fundamentals before moving to multi-cluster Kubernetes orchestration.",
    ],
    actionItems: [
      "Containerize an end-to-end Python/Node application using multi-stage Dockerfiles.",
      "Deploy the containerized application on an AWS EC2 or ECS cluster.",
      "Ping mentor Rahul Sharma for a mock cloud architecture review once deployment is live.",
    ],
    followUpQuestions: [
      "Which AWS compute service (EC2 vs ECS Fargate) do you recommend for my initial container capstone project?",
      "How did you demonstrate production reliability during your first cloud engineering interview?",
    ],
    suggestedRoadmapUpdates: [
      {
        action: "add_milestone",
        title: "Dockerized Cloud Application Mock Architecture Review with Mentor",
        description: "Review system architecture, security group configurations, and IAM roles with Rahul Sharma.",
        reason: "Mentor Rahul Sharma suggested reviewing architecture prior to job applications.",
        skillsTargeted: ["AWS", "Docker", "Cloud Architecture"],
        requiresApproval: true,
      },
    ],
    mentorshipTone: "technical",
  };

  if (conversation.length === 0) {
    return fallbackInsights;
  }

  const prompt = buildRelationshipInsightPrompt(conversation);

  const result = await callGeminiStructured<RelationshipInsight>(
    prompt,
    SYSTEM_RELATIONSHIP_INSIGHT,
    fallbackInsights
  );

  return {
    summary: result.summary || fallbackInsights.summary,
    keyAdvice: Array.isArray(result.keyAdvice) && result.keyAdvice.length > 0 ? result.keyAdvice : fallbackInsights.keyAdvice,
    actionItems: Array.isArray(result.actionItems) && result.actionItems.length > 0 ? result.actionItems : fallbackInsights.actionItems,
    followUpQuestions: Array.isArray(result.followUpQuestions) ? result.followUpQuestions : fallbackInsights.followUpQuestions,
    suggestedRoadmapUpdates: Array.isArray(result.suggestedRoadmapUpdates) ? result.suggestedRoadmapUpdates : fallbackInsights.suggestedRoadmapUpdates,
    mentorshipTone: result.mentorshipTone || "technical",
  };
}

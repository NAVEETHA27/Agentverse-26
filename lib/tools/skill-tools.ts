import { extractSkillsFromText } from "@/lib/ai/gemini";
import type { SkillExtractionResult } from "@/lib/ai/schemas";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError 
} from "./types";

/**
 * Controlled Tool: Extracts technical skills and categories from freeform text.
 */
export async function extractSkillsFromTextTool(
  text: string,
  context?: ToolExecutionContext
): Promise<ToolResult<SkillExtractionResult>> {
  const startTime = Date.now();
  const inputSummary = `Extract skills from text: "${text.slice(0, 60)}..."`;

  try {
    const result = await extractSkillsFromText(text);
    return createToolResult<SkillExtractionResult>(
      "extract_skills_from_text",
      inputSummary,
      result,
      startTime
    );
  } catch (err: any) {
    return createToolError<SkillExtractionResult>(
      "extract_skills_from_text",
      inputSummary,
      err.message,
      startTime
    );
  }
}

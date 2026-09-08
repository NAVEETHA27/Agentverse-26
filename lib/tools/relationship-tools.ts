import { getMessages, getConversations } from "@/lib/database/chat";
import { extractRelationshipInsights } from "@/lib/ai/gemini";
import type { RelationshipInsight } from "@/lib/ai/schemas";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError 
} from "./types";

/**
 * Controlled Tool: Retrieves authorized message transcript for relationship analysis.
 */
export async function getConversationContextTool(
  conversationId: string,
  context: ToolExecutionContext
): Promise<ToolResult<any[]>> {
  const startTime = Date.now();
  const inputSummary = `Fetch messages for conversation: ${conversationId}`;

  try {
    const messages = await getMessages(conversationId);
    return createToolResult("get_conversation_context", inputSummary, messages, startTime);
  } catch (err: any) {
    return createToolError("get_conversation_context", inputSummary, err.message, startTime);
  }
}

/**
 * Controlled Tool: Extracts actionable insights, mentor advice, and roadmap updates from dialogue.
 */
export async function extractRelationshipInsightsTool(
  conversationId: string,
  context: ToolExecutionContext
): Promise<ToolResult<RelationshipInsight>> {
  const startTime = Date.now();
  const inputSummary = `Analyze relationship dialogue for conversation: ${conversationId}`;

  try {
    const messages = await getMessages(conversationId);
    const formatted = messages.map((m) => ({
      senderName: m.sender_id === "u1111111-1111-1111-1111-111111111111" ? "Rohan Varma (Student)" : "Rahul Sharma (Mentor)",
      message: m.message_text,
    }));

    const insights = await extractRelationshipInsights(formatted);

    return createToolResult<RelationshipInsight>(
      "extract_relationship_insights",
      inputSummary,
      insights,
      startTime
    );
  } catch (err: any) {
    return createToolError("extract_relationship_insights", inputSummary, err.message, startTime);
  }
}

import { getOpportunities } from "@/lib/database/opportunities";
import { 
  type ToolExecutionContext, 
  type ToolResult, 
  createToolResult, 
  createToolError 
} from "./types";

/**
 * Controlled Tool: Retrieves career opportunities matching student targets.
 */
export async function getOpportunitiesTool(
  filters: { type?: string; workMode?: string } = {},
  context?: ToolExecutionContext
): Promise<ToolResult<any[]>> {
  const startTime = Date.now();
  const inputSummary = `Fetch opportunities with filters: ${JSON.stringify(filters)}`;

  try {
    const opps = await getOpportunities();
    return createToolResult("get_opportunities", inputSummary, opps, startTime);
  } catch (err: any) {
    return createToolError("get_opportunities", inputSummary, err.message, startTime);
  }
}

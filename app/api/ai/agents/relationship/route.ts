import { NextRequest, NextResponse } from "next/server";
import { runRelationshipAgent } from "@/lib/agents/relationship-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await runRelationshipAgent({
      conversationId: body.conversationId,
      userId: body.userId,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    console.error("[API:RelationshipAgent] Internal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to run relationship agent",
        trace: [],
      },
      { status: 500 }
    );
  }
}

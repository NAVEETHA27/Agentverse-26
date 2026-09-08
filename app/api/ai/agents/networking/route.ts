import { NextRequest, NextResponse } from "next/server";
import { runNetworkingAgent } from "@/lib/agents/networking-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await runNetworkingAgent({
      userId: body.userId,
      targetRole: body.targetRole,
      preferredScope: body.preferredScope,
      goalStatement: body.goalStatement || body.query,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    console.error("[API:NetworkingAgent] Internal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to run networking agent",
        trace: [],
      },
      { status: 500 }
    );
  }
}

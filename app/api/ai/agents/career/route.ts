import { NextRequest, NextResponse } from "next/server";
import { runCareerAgent } from "@/lib/agents/career-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid request payload with careerGoalStatement or goal is required" },
        { status: 400 }
      );
    }

    const result = await runCareerAgent({
      userId: body.userId,
      careerGoalStatement: body.careerGoalStatement || body.goal,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    console.error("[API:CareerAgent] Internal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to run career agent",
        trace: [],
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { processHumanApproval } from "@/lib/agents/approval";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.actionId || !body.decision) {
      return NextResponse.json(
        { success: false, message: "actionId and decision ('approved' | 'rejected') are required" },
        { status: 400 }
      );
    }

    const result = await processHumanApproval({
      actionId: body.actionId,
      decision: body.decision,
      modifiedMessage: body.modifiedMessage,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error("[API:Approval] Internal error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process human approval" },
      { status: 500 }
    );
  }
}

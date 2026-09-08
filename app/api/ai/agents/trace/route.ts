import { NextRequest, NextResponse } from "next/server";
import { getAgentSession, listAgentSessions } from "@/lib/agents/trace";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId") || undefined;

    if (sessionId) {
      const session = getAgentSession(sessionId);
      if (!session) {
        return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, session });
    }

    const sessions = listAgentSessions(userId);
    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error("[API:Trace] Internal error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve agent trace" },
      { status: 500 }
    );
  }
}

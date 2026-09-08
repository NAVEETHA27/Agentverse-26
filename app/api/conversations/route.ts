import { NextRequest, NextResponse } from "next/server";
import { getConversations } from "@/lib/database/chat";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || DEMO_USER_ID;
    const convs = await getConversations(userId);
    return NextResponse.json(convs, { status: 200 });
  } catch (error: any) {
    console.error("[API:Conversations] Error fetching conversations:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch conversations" }, { status: 500 });
  }
}

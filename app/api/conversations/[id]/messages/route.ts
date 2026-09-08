import { NextRequest, NextResponse } from "next/server";
import { getMessages, sendMessage } from "@/lib/database/chat";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const messages = await getMessages(conversationId);
    const enriched = messages.map((m) => ({ ...m, content: m.message_text }));
    return NextResponse.json(enriched, { status: 200 });
  } catch (error: any) {
    console.error("[API:ConversationMessages] Error fetching messages:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await req.json().catch(() => ({}));
    const senderId = body.senderId || DEMO_USER_ID;
    const content = (body.content || body.messageText || "").trim();

    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const newMessage = await sendMessage(conversationId, senderId, content);
    const enriched = { ...newMessage, content: newMessage.message_text };
    return NextResponse.json(enriched, { status: 200 });
  } catch (error: any) {
    console.error("[API:ConversationMessages] Error sending message:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}

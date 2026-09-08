import { NextRequest, NextResponse } from "next/server";
import { sendMessage, getMessages, getConversations } from "@/lib/database/chat";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId") || DEMO_USER_ID;

    if (conversationId) {
      const messages = await getMessages(conversationId);
      const enriched = messages.map((m) => ({ ...m, content: m.message_text }));
      return NextResponse.json({ success: true, data: { messages: enriched }, messages: enriched });
    }

    const conversations = await getConversations(userId);
    return NextResponse.json({ success: true, data: conversations, conversations });
  } catch (error: any) {
    console.error("[API:Chat] Failed to retrieve chat data:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const conversationId = body.conversationId;
    const senderId = body.senderId || DEMO_USER_ID;
    const text = (body.messageText || body.content || "").trim();

    if (!conversationId || !text) {
      return NextResponse.json(
        { success: false, message: "conversationId and messageText/content are required" },
        { status: 400 }
      );
    }

    const newMessage = await sendMessage(conversationId, senderId, text);
    const enriched = { ...newMessage, content: newMessage.message_text };
    return NextResponse.json({ success: true, data: enriched, message: enriched }, { status: 200 });
  } catch (error: any) {
    console.error("[API:Chat] Failed to post message:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to post message" },
      { status: 500 }
    );
  }
}

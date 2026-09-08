import React from "react";
import { getUser, getConversations } from "@/lib/database";
import { ChatView } from "@/components/chat/ChatView";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const [user, conversations] = await Promise.all([
    getUser(),
    getConversations(),
  ]);

  return (
    <ChatView
      currentUser={user}
      initialConversations={conversations}
    />
  );
}

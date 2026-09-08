import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_CONVERSATIONS, DEMO_USER_ID, SEED_USERS } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];

export type EnrichedConversation = {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  partner: Database["public"]["Tables"]["users"]["Row"];
  messages: MessageRow[];
};

// In-memory local conversations state for offline chat interactions
const globalForChat = globalThis as unknown as {
  localConversations?: EnrichedConversation[];
};

if (!globalForChat.localConversations) {
  globalForChat.localConversations = [...SEED_CONVERSATIONS];
}

const getLocalConversations = () => globalForChat.localConversations!;
const setLocalConversations = (val: EnrichedConversation[]) => {
  globalForChat.localConversations = val;
};

/**
 * Retrieve all active conversations for a user.
 */
export async function getConversations(
  userId: string = DEMO_USER_ID
): Promise<EnrichedConversation[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("conversation_participants")
        .select(`
          conversation_id,
          conversation:conversations(*),
          user:users(*)
        `)
        .eq("user_id", userId);

      if (!error && data && data.length > 0) {
        // Retrieve full conversation data with messages
        const convList: EnrichedConversation[] = [];
        for (const item of (data as any[])) {
          const convId = item.conversation_id;
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: true });

          // Find the other participant
          const { data: otherPart } = await supabase
            .from("conversation_participants")
            .select("user:users(*)")
            .eq("conversation_id", convId)
            .neq("user_id", userId)
            .single();

          const partner = (otherPart as any)?.user || SEED_USERS[1];
          convList.push({
            id: convId,
            created_at: (item.conversation as any)?.created_at || new Date().toISOString(),
            updated_at: (item.conversation as any)?.updated_at || new Date().toISOString(),
            last_message_at: (item.conversation as any)?.last_message_at || null,
            partner,
            messages: (messages as MessageRow[]) || [],
          });
        }
        return convList;
      }
    } catch (err) {
      console.warn("[Chat DAL] Failed to fetch conversations from Supabase, falling back to seed data:", err);
    }
  }

  return getLocalConversations();
}

/**
 * Retrieve messages for a specific conversation.
 */
export async function getMessages(conversationId: string): Promise<MessageRow[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MessageRow[];
      }
    } catch (err) {
      console.warn("[Chat DAL] Failed to fetch messages from Supabase, falling back to seed data:", err);
    }
  }

  const conv = getLocalConversations().find((c) => c.id === conversationId);
  return conv ? conv.messages : (getLocalConversations()[0]?.messages || []);
}

/**
 * Post a new message to a conversation.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string = DEMO_USER_ID,
  messageText: string
): Promise<MessageRow> {
  const newMessage: MessageRow = {
    id: `msg_${Date.now()}`,
    conversation_id: conversationId,
    sender_id: senderId,
    message_text: messageText,
    message_type: "text",
    created_at: new Date().toISOString(),
    edited_at: null,
    deleted_at: null,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase.from("messages") as any)
        .insert(newMessage)
        .select()
        .single();

      if (!error && data) {
        await (supabase.from("conversations") as any)
          .update({ last_message_at: newMessage.created_at })
          .eq("id", conversationId);

        return data as MessageRow;
      }
    } catch (err) {
      console.warn("[Chat DAL] Failed to post message to Supabase, saving to local state:", err);
    }
  }

  // Update in-memory local state
  setLocalConversations(getLocalConversations().map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        last_message_at: newMessage.created_at,
        messages: [...c.messages, newMessage],
      };
    }
    return c;
  }));

  return newMessage;
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Send, Sparkles, CheckCircle2, Search,
  Phone, Video, MoreHorizontal, Check, FileText, HelpCircle,
  ArrowRight, Edit3
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sendMessage } from "@/lib/database/chat";
import type { EnrichedConversation, MessageRow } from "@/lib/database/chat";
import type { UserRow } from "@/lib/database/users";

interface ChatViewProps {
  currentUser: UserRow;
  initialConversations: EnrichedConversation[];
}

const MOCK_CONVS = [
  { id: "c1", name: "Rohan Mehta", role: "Thanks for the insights! I'll check out the resources.", time: "11:24 AM", badge: 2, online: true },
  { id: "c2", name: "Neha Iyer", role: "That makes sense. I'll keep you updated.", time: "Yesterday", badge: 0, online: false },
  { id: "c3", name: "Arjun Bose", role: "Great connecting with you! Let's stay in touch.", time: "Tue", badge: 0, online: false },
  { id: "c4", name: "Priya Nair", role: "Can we schedule a quick call next week?", time: "Mon", badge: 1, online: true },
  { id: "c5", name: "Karan Shah", role: "Here's the deck I mentioned.", time: "May 18", badge: 0, online: false },
  { id: "c6", name: "Sneha Patil", role: "Thanks a lot!", time: "May 16", badge: 0, online: false },
  { id: "c7", name: "Vikram Desai", role: "Let me know if you need anything else.", time: "May 14", badge: 0, online: false },
];

const MOCK_MESSAGES = [
  { id: "m1", sender: "other", text: "Hi Ananya! Great to connect with you. I saw you're interested in Product Management.", time: "10:58 AM" },
  { id: "m2", sender: "me", text: "Hi Rohan! Yes, I'm exploring PM roles and would love to learn from your journey.", time: "11:02 AM" },
  { id: "m3", sender: "other", text: "Happy to help! Happy to share what worked for me and lessons learned along the way.", time: "11:05 AM" },
  { id: "m4", sender: "me", text: "That would be amazing. Could you share how you made the transition from engineering to PM?", time: "11:07 AM" },
  { id: "m5", sender: "other", text: "Sure! It was a mix of building the right skills, working on side projects, and networking. Happy to dive deeper—let me know what specific areas you'd like to focus on.", time: "11:10 AM" },
  { id: "m6", sender: "me", text: "Thanks for the insights! I'll check out the resources you shared.", time: "11:24 AM" },
];

const AI_TOOLS = [
  { icon: FileText, label: "Summarize Chat" },
  { icon: Sparkles, label: "Extract Advice" },
  { icon: CheckCircle2, label: "Extract Action Items" },
  { icon: HelpCircle, label: "Suggested Questions" },
  { icon: ArrowRight, label: "Suggested Follow-up" },
];

const REL_STEPS = [
  { label: "Connected", date: "May 12, 2024", done: true },
  { label: "First Conversation", date: "May 12, 2024", done: true },
  { label: "Exchanged Messages", date: "6+ messages", done: true },
  { label: "Meet / Call", date: "Not yet", done: false },
];

export function ChatView({ currentUser, initialConversations }: ChatViewProps) {
  const [activeId, setActiveId] = useState("c1");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const active = MOCK_CONVS.find((c) => c.id === activeId) || MOCK_CONVS[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const text = input.trim();
    setInput("");
    setIsSending(true);
    setMessages((p) => [...p, { id: `m${Date.now()}`, sender: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setIsSending(false);
  };

  return (
    <div className="flex gap-0 h-[calc(100dvh-var(--navbar-height,56px)-3rem)] min-h-[500px] bg-white rounded-2xl border border-[#F0E3E7] overflow-hidden shadow-sm">
      {/* ── Left: Conversations list ── */}
      <div className="w-[260px] shrink-0 border-r border-[#F0E3E7] flex flex-col">
        <div className="p-3 border-b border-[#F0E3E7] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E1218]">Conversations</h2>
          <button><Edit3 className="w-4 h-4 text-[#7A1443]" /></button>
        </div>
        {/* Search */}
        <div className="px-3 py-2 border-b border-[#F0E3E7]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B0A0B0]" />
            <input placeholder="Search conversations" className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF7F8] border border-[#F0E3E7] text-xs text-[#1E1218] focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVS.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full px-3 py-3 flex items-start gap-2.5 border-b border-[#F5EEF1] hover:bg-[#FAF7F8] transition text-left ${activeId === conv.id ? "bg-[#FDF2F5]" : ""}`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold">
                  {conv.name.charAt(0)}
                </div>
                {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1E1218] truncate">{conv.name}</p>
                  <p className="text-[10px] text-[#7D6F77] shrink-0 ml-1">{conv.time}</p>
                </div>
                <p className="text-[11px] text-[#7D6F77] truncate">{conv.role}</p>
              </div>
              {conv.badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">{conv.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Center: Chat window ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-[#F0E3E7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold">
                {active.name.charAt(0)}
              </div>
              {active.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />}
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E1218]">{active.name}</p>
              <p className="text-[11px] text-[#7D6F77]">Senior Product Manager at Google · MTech '15 · Connected since May 12, 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#7D6F77]">
            <button className="p-1.5 rounded-lg hover:bg-[#FAF7F8]"><Phone className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-[#FAF7F8]"><Video className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-[#FAF7F8]"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAFA]">
          <div className="text-center">
            <span className="text-[10px] text-[#7D6F77] bg-[#F0E8EC] px-3 py-1 rounded-full">Today</span>
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
              {msg.sender === "other" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold mb-1">
                  {active.name.charAt(0)}
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "me"
                  ? "text-white rounded-br-sm"
                  : "bg-white text-[#1E1218] border border-[#F0E3E7] rounded-bl-sm"
              }`}
                style={msg.sender === "me" ? {
                  background: "linear-gradient(135deg, #5A0C32, #8A1848)",
                } : {}}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#7D6F77]">
                <span>{msg.time}</span>
                {msg.sender === "me" && <Check className="w-3 h-3 text-emerald-500" />}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="px-4 py-3 border-t border-[#F0E3E7] bg-white flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl px-4 py-2.5 text-xs text-[#1E1218] focus:outline-none focus:border-[#7A1443]"
          />
          <Button type="submit" size="sm" variant="primary" disabled={!input.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      {/* ── Right: AI Assistant + Relationship Progress ── */}
      <div className="w-[240px] shrink-0 border-l border-[#F0E3E7] flex flex-col overflow-y-auto bg-white">
        {/* AI Conversation Assistant */}
        <div className="p-3 border-b border-[#F0E3E7]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7A1443]" />
              <p className="text-xs font-bold text-[#1E1218]">AI Conversation Assistant</p>
            </div>
            <button className="text-[#7D6F77] text-xs">∧</button>
          </div>
          <div className="space-y-1.5">
            {AI_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button key={tool.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAF7F8] border border-[#F0E3E7] text-xs text-[#4A3E45] hover:bg-[#FDF2F5] hover:border-[#F4CEDB] transition text-left">
                  <Icon className="w-3.5 h-3.5 text-[#7A1443] shrink-0" />
                  {tool.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Relationship Progress */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#1E1218]">Relationship Progress</p>
            <button className="text-[#7D6F77] text-[11px]">ⓘ</button>
          </div>
          <p className="text-[10px] text-[#7D6F77] mb-2">Building a Strong Connection</p>
          <div className="w-full bg-[#F5ECF0] rounded-full h-2 mb-3">
            <div className="bg-[#7A1443] h-2 rounded-full" style={{ width: "72%" }} />
          </div>
          <div className="space-y-2">
            {REL_STEPS.map((step) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-[#7A1443]" : "bg-[#F0E3E7]"}`}>
                  {step.done && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#1E1218]">{step.label}</span>
                  <span className="text-[10px] text-[#7D6F77]">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Quote */}
          <div className="mt-3 p-2.5 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB]">
            <p className="text-[10px] text-[#7A1443] italic leading-relaxed">"Strong relationships open doors. Keep the conversation going!"</p>
            <Sparkles className="w-3 h-3 text-[#7A1443] mt-1 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck, 
  Loader2,
  X,
  BookmarkPlus,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { sendMessage } from "@/lib/database/chat";
import type { EnrichedConversation, MessageRow } from "@/lib/database/chat";
import type { UserRow } from "@/lib/database/users";
import type { PendingApprovalAction, AgentResponse } from "@/lib/agents/types";

interface ChatViewProps {
  currentUser: UserRow;
  initialConversations: EnrichedConversation[];
}

export function ChatView({
  currentUser,
  initialConversations,
}: ChatViewProps) {
  const [conversations] = useState<EnrichedConversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(
    initialConversations[0]?.id || "conv1"
  );
  const [messages, setMessages] = useState<MessageRow[]>(
    initialConversations[0]?.messages || []
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Relationship Agent state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<PendingApprovalAction | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [conversationSummary, setConversationSummary] = useState<string>(
    "Discussion with mentor Rahul Sharma on transitioning from an ECE undergrad into cloud engineering. Prioritizing AWS compute and Docker container packaging before jumping into Kubernetes."
  );
  const [latestAdvice, setLatestAdvice] = useState<string>(
    "Your ECE background with Linux & Python gives you a system-level advantage. Master AWS compute and Docker before jumping to complex Kubernetes orchestration."
  );
  const [latestActionItem, setLatestActionItem] = useState<string>(
    "Complete Docker containerization project on AWS, then request a mock architecture design review with Rahul."
  );
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([
    "What AWS container service (ECS Fargate vs EKS) do you recommend for entry-level portfolios?",
    "How did you demonstrate production readiness during your AWS interviews?",
  ]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const partner = activeConv?.partner;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const text = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: currentUser.id,
          messageText: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
          return;
        }
      }

      // Fallback to local function if API route unavailable
      const newMsg = await sendMessage(activeConv.id, currentUser.id, text);
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      const newMsg = await sendMessage(activeConv.id, currentUser.id, text);
      setMessages((prev) => [...prev, newMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Run Relationship Agent to inspect conversation and propose roadmap updates
  const handleAnalyzeDialogue = async () => {
    setIsAnalyzing(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/ai/agents/relationship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          userId: currentUser.id,
        }),
      });

      const data: AgentResponse = await res.json();
      if (data.success && data.data?.insights) {
        if (data.data.insights.keyAdvice?.[0]) {
          setLatestAdvice(data.data.insights.keyAdvice[0]);
        }
        if (data.data.insights.actionItems?.[0]) {
          setLatestActionItem(data.data.insights.actionItems[0]);
        }
        if (data.data.insights.followUpQuestions && data.data.insights.followUpQuestions.length > 0) {
          setFollowUpQuestions(data.data.insights.followUpQuestions);
        }
        setConversationSummary(
          `Analysis of ${messages.length} messages with mentor ${partner?.full_name}. Identified actionable technical recommendations and milestone candidate.`
        );
      }

      if (data.pendingApproval) {
        setPendingApproval(data.pendingApproval);
      }
    } catch (err: any) {
      console.error("Failed to run relationship agent:", err);
      setFeedbackMessage("Failed to analyze dialogue. Check console logs.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Human approval handler for roadmap updates
  const handleApprovalDecision = async (decision: "approved" | "rejected") => {
    if (!pendingApproval) return;
    setIsSubmittingApproval(true);

    try {
      const res = await fetch("/api/ai/agents/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId: pendingApproval.actionId,
          decision,
        }),
      });

      const result = await res.json();
      if (result.success) {
        if (decision === "approved") {
          setFeedbackMessage(`Milestone added to Career Roadmap! Check the Career tab to view your updated roadmap.`);
        } else {
          setFeedbackMessage("Milestone proposal rejected. Roadmap unchanged.");
        }
        setPendingApproval(null);
      } else {
        setFeedbackMessage(`Error: ${result.message}`);
      }
    } catch (err: any) {
      setFeedbackMessage(`Failed processing approval: ${err.message}`);
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Mentor Messages & Relationship Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Direct dialogue with alumni mentors enriched with actionable advice extraction.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isAnalyzing}
            onClick={handleAnalyzeDialogue}
            className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Analyzing Dialogue...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Analyze Dialogue with AI
              </>
            )}
          </Button>
          <Badge variant="emerald" size="md">Relationship Agent Active</Badge>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between text-xs text-indigo-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <Link href="/career" className="underline font-semibold text-sky-300 hover:text-white">
            View Career Roadmap &rarr;
          </Link>
        </div>
      )}

      {/* HUMAN APPROVAL CARD: ROADMAP UPDATE PROPOSAL */}
      {pendingApproval && (
        <Card className="border-2 border-indigo-500/80 bg-indigo-950/30 p-5 rounded-2xl shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="indigo" size="sm">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  AI Suggests Adding This to Your Career Roadmap
                </Badge>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  Human Approval Mandatory
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {pendingApproval.title}
              </h3>
              <p className="text-xs text-slate-300">
                {pendingApproval.description}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-900/50 space-y-1.5 text-xs text-slate-300">
            <div className="font-semibold text-indigo-300">Proposed Milestone Details:</div>
            <ul className="list-disc list-inside space-y-0.5 pl-1">
              {pendingApproval.preview?.changes?.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400 italic">
              * Your roadmap will only be updated if you click &quot;Approve & Add to Roadmap&quot;.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isSubmittingApproval}
                onClick={() => handleApprovalDecision("rejected")}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={isSubmittingApproval}
                onClick={() => handleApprovalDecision("approved")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/40"
              >
                {isSubmittingApproval ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />
                    Approve & Add to Roadmap
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Conversations List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Active Mentor Threads
          </div>

          <div className="space-y-2">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMessages(conv.messages);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition border ${
                    isActive
                      ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-950/40"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {conv.partner?.full_name?.charAt(0) || "M"}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">
                          {conv.partner?.full_name || "Alumni Mentor"}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.last_message_at || conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 truncate">
                        {conv.partner?.headline || "Cloud Mentor"}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.message_text : "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Chat Window (5 cols) */}
        <div className="lg:col-span-5 flex flex-col glass-panel rounded-2xl border border-slate-800 overflow-hidden h-[620px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                {partner?.full_name?.charAt(0) || "M"}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {partner?.full_name || "Rahul Sharma"}
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Alumni Mentor • Online
                </p>
              </div>
            </div>
            <Badge variant="indigo" size="sm">94% Match</Badge>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-xs"
                        : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs"
                    }`}
                  >
                    {msg.message_text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Rahul about Docker, AWS, or project advice..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!inputMessage.trim() || isSending}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-500"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        {/* Right Column: AI Relationship Intelligence Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="glass-panel border-indigo-500/30 bg-indigo-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Relationship AI
                </h4>
              </div>
              <Badge variant="purple" size="sm">Grounded</Badge>
            </div>

            {/* 1. Conversation Summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                Conversation Summary
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                {conversationSummary}
              </p>
            </div>

            {/* 2. Key Advice */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                Key Advice
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                &quot;{latestAdvice}&quot;
              </p>
            </div>

            {/* 3. Action Items */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Action Item
              </span>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {latestActionItem}
                </p>
                <Link href="/career" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                  Link to Career Roadmap &rarr;
                </Link>
              </div>
            </div>

            {/* 4. Follow-up Questions */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-sky-400" />
                Follow-up Questions
              </span>
              <div className="space-y-1">
                {followUpQuestions.map((q, i) => (
                  <div key={i} className="text-[11px] text-slate-300 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    &quot;{q}&quot;
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="glass-panel border-slate-800 p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mentor Context
            </h4>
            <div className="text-xs text-slate-300 space-y-1">
              <div><strong>Company:</strong> Amazon Web Services</div>
              <div><strong>Role:</strong> Senior Cloud Architect</div>
              <div><strong>Alumni:</strong> ABC College of Eng. (ECE)</div>
              <div><strong>Match Score:</strong> 94% Deterministic</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

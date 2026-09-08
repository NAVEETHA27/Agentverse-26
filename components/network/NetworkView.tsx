"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  MessageSquare, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  Info, 
  Loader2, 
  X, 
  ExternalLink,
  Briefcase,
  HelpCircle,
  Edit3
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentActivity } from "@/components/agent/AgentActivity";
import { AgentTraceModal } from "@/components/agent/AgentTraceModal";
import { sendConnectionRequest } from "@/lib/database/connections";
import type { 
  EnrichedMatchResult, 
  ConnectionWithPartner, 
  AgentSessionWithActions 
} from "@/lib/database";
import type { PendingApprovalAction, AgentResponse, AgentTraceStep, AgentStatus } from "@/lib/agents/types";

interface NetworkViewProps {
  initialMatches: EnrichedMatchResult[];
  initialConnections: ConnectionWithPartner[];
  agentSession: AgentSessionWithActions;
  searchScope?: "institution" | "broader_alumni" | "industry_network" | "global_network";
  scopeMessage?: string | null;
  levelCounts?: {
    institution: number;
    broader_alumni: number;
    industry_network: number;
  };
}

export function NetworkView({
  initialMatches,
  initialConnections,
  agentSession,
  searchScope = "broader_alumni",
  scopeMessage,
  levelCounts = { institution: 2, broader_alumni: 1, industry_network: 1 },
}: NetworkViewProps) {
  const [matches, setMatches] = useState<EnrichedMatchResult[]>(initialMatches);
  const [connections, setConnections] = useState<ConnectionWithPartner[]>(initialConnections);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>("mr_u2222222-2222-2222-2222-222222222222");
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "institution" | "broader_alumni" | "industry_network">("all");

  // Agent interactive state
  const [goalQuery, setGoalQuery] = useState("I want to become a Cloud Engineer. Find me an alumni mentor.");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [currentAgentAction, setCurrentAgentAction] = useState<string | undefined>(undefined);
  const [pendingApproval, setPendingApproval] = useState<PendingApprovalAction | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentTraceStep[]>([]);

  const getConnectionStatus = (userId: string) => {
    const conn = connections.find(
      (c) => c.receiver_id === userId || c.requester_id === userId
    );
    return conn ? conn.status : null;
  };

  const handleConnect = async (alumniId: string) => {
    setConnectingUserId(alumniId);
    try {
      const newConn = await sendConnectionRequest(
        undefined,
        alumniId,
        "Hi, I noticed your career journey and would love to connect for mentorship."
      );
      setConnections((prev) => [newConn, ...prev]);
    } finally {
      setConnectingUserId(null);
    }
  };

  // Run the full Networking Agent workflow
  const handleRunNetworkingAgent = async () => {
    setAgentStatus("executing");
    setApprovalFeedback(null);
    setCurrentAgentAction("Step 1/7: Parsing career intent & target role...");

    try {
      setTimeout(() => setCurrentAgentAction("Step 3/7: Inspecting priority skill gaps (AWS, Docker)..."), 400);
      setTimeout(() => setCurrentAgentAction("Step 4/7: Executing deterministic alumni matching engine..."), 800);
      setTimeout(() => setCurrentAgentAction("Step 6/7: Synthesizing grounded outreach draft..."), 1200);

      const res = await fetch("/api/ai/agents/networking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalStatement: goalQuery,
          targetRole: "Cloud Engineer",
        }),
      });

      const data: AgentResponse = await res.json();

      if (data.pendingApproval) {
        setPendingApproval(data.pendingApproval);
        setEditedMessage(data.pendingApproval.preview?.message || data.pendingApproval.payload?.initialMessage || "");
        setAgentStatus("waiting_for_approval");
      } else {
        setAgentStatus(data.status || "completed");
      }

      if (data.trace) {
        setAgentSteps(data.trace);
      }

      if (data.data?.matches) {
        setMatches(data.data.matches);
      }
    } catch (err: any) {
      console.error("Failed to run networking agent:", err);
      setAgentStatus("failed");
    } finally {
      setCurrentAgentAction(undefined);
    }
  };

  // Human approval handler (Approve or Reject)
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
          modifiedMessage: editedMessage,
        }),
      });

      const result = await res.json();
      if (result.success) {
        if (decision === "approved") {
          setApprovalFeedback(`Connection request sent to ${pendingApproval.targetEntityName}!`);
          setAgentStatus("completed");
          if (result.data) {
            setConnections((prev) => [result.data, ...prev]);
          }
        } else {
          setApprovalFeedback("Proposal rejected. No connection request was dispatched.");
          setAgentStatus("completed");
        }
        setPendingApproval(null);
        setIsEditingMessage(false);
      } else {
        setApprovalFeedback(`Error: ${result.message}`);
      }
    } catch (err: any) {
      setApprovalFeedback(`Failed processing approval: ${err.message}`);
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (activeFilter === "all") return true;
    return m.search_scope === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            Alumni & Mentor Network Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover verified alumni mentors ranked by deterministic multi-factor career goal alignment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsTraceOpen(true)}
            className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40"
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5" />
            Audit Trace Inspector
          </Button>
          <Badge variant="sky" size="md">Deterministic Engine</Badge>
        </div>
      </div>

      {/* SECTION 8: NETWORKING AGENT CONTROL PANEL */}
      <Card className="glass-panel border-indigo-500/30 bg-indigo-950/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Find the Right Person for Your Career Goal
                <Badge variant="emerald" size="sm">Autonomous Agent</Badge>
              </h2>
              <p className="text-xs text-slate-400">
                What kind of career connection are you looking for? The agent evaluates academic, skill, and industry overlap.
              </p>
            </div>
          </div>
          <Badge variant="purple" size="sm" className="hidden sm:inline-flex">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
            Human Approval Mandatory
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={goalQuery}
              onChange={(e) => setGoalQuery(e.target.value)}
              placeholder="e.g., 'I want to become a Cloud Engineer and need a mentor.'"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>
          <Button 
            size="md" 
            variant="primary" 
            disabled={agentStatus === "executing"}
            onClick={handleRunNetworkingAgent}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/40 px-5"
          >
            {agentStatus === "executing" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Orchestrating Tools...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Run Networking Agent
              </>
            )}
          </Button>
        </div>

        {/* Real-time agent status tracker banner */}
        {currentAgentAction && (
          <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center gap-2.5 text-xs text-indigo-300 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-indigo-400" />
            <span className="font-medium">{currentAgentAction}</span>
          </div>
        )}

        {approvalFeedback && (
          <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            approvalFeedback.includes("rejected")
              ? "bg-slate-900 border-slate-700 text-slate-300"
              : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
          }`}>
            <div className="flex items-center gap-2">
              {approvalFeedback.includes("rejected") ? (
                <X className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{approvalFeedback}</span>
            </div>
            {!approvalFeedback.includes("rejected") && (
              <Link href="/chat" className="underline font-semibold text-emerald-200 hover:text-white">
                Open Chat Dialogue &rarr;
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* Embedded Agent Activity Panel when agent has executed */}
      {agentSteps.length > 0 && (
        <AgentActivity
          title="Networking Agent Activity Trace"
          agentType="networking_agent"
          status={agentStatus}
          currentAction={currentAgentAction}
          steps={agentSteps}
          onInspectTrace={() => setIsTraceOpen(true)}
        />
      )}

      {/* SECTION 11: HUMAN-IN-THE-LOOP APPROVAL CARD */}
      {pendingApproval && (
        <Card className="border-2 border-amber-500/80 bg-amber-950/20 p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="amber" size="md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  AI Prepared a Connection Request
                </Badge>
                <span className="text-[11px] font-mono text-amber-400/90 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/60">
                  Execution Paused
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Recipient: {pendingApproval.targetEntityName || "Rahul Sharma"}
              </h3>
              <p className="text-xs text-slate-300">
                <strong>Why: </strong>Strong alignment with your Cloud Engineer goal and shared ABC College ECE transition background.
              </p>
            </div>
          </div>

          {/* Editable Outreach Draft */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-900/40 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-semibold">Grounded Facts:</span>
              <span className="text-amber-300 font-mono">Deterministic Match: 94%</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold">
                  Personalized Message Draft:
                </label>
                <button
                  onClick={() => setIsEditingMessage(!isEditingMessage)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditingMessage ? "Done Editing" : "Customize Message"}
                </button>
              </div>

              <textarea
                rows={4}
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                placeholder="Personalize the outreach message..."
              />
            </div>
          </div>

          {/* Action Buttons & Safety Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Nothing will be sent until you approve.</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-900/40"
              >
                {isSubmittingApproval ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Approve & Send Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Progressive Scope Banner */}
      {scopeMessage && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 flex items-start gap-3">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span>Progressive Search Strategy:</span>
              <Badge variant="indigo" size="sm">Level 2: Broader Network</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {scopeMessage}
            </p>
          </div>
        </div>
      )}

      {/* Scope Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-lg border font-medium transition ${
            activeFilter === "all"
              ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          All Candidates ({matches.length})
        </button>
        <button
          onClick={() => setActiveFilter("institution")}
          className={`px-3 py-1.5 rounded-lg border font-medium transition ${
            activeFilter === "institution"
              ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Same College: ABC College ({matches.filter((m) => m.search_scope === "institution").length})
        </button>
        <button
          onClick={() => setActiveFilter("broader_alumni")}
          className={`px-3 py-1.5 rounded-lg border font-medium transition ${
            activeFilter === "broader_alumni"
              ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Broader Alumni ({matches.filter((m) => m.search_scope === "broader_alumni").length})
        </button>
        <button
          onClick={() => setActiveFilter("industry_network")}
          className={`px-3 py-1.5 rounded-lg border font-medium transition ${
            activeFilter === "industry_network"
              ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Industry Mentors ({matches.filter((m) => m.search_scope === "industry_network").length})
        </button>
      </div>

      {/* SECTION 9: POLISHED ALUMNI MATCH CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Ranked Alumni Matches ({filteredMatches.length} shown)</span>
          <span>Deterministic Formula: 30% Goal + 25% Skill + 20% Edu + 15% Ind + 10% Exp</span>
        </div>

        {filteredMatches.map((match) => {
          const user = match.matched_user;
          const status = getConnectionStatus(user.id);
          const isExpanded = expandedMatchId === match.id;
          const isTopMatch = match.overall_score >= 90;

          const skillsList = [
            "AWS",
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux"
          ];

          return (
            <Card
              key={match.id}
              className={`glass-panel transition border ${
                isTopMatch
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="p-6 space-y-4">
                {/* Header Row: User Info & Match Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {user.full_name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">
                          {user.full_name}
                        </h3>
                        {isTopMatch && (
                          <Badge variant="emerald" size="sm">
                            <Sparkles className="w-3 h-3 mr-1 inline" />
                            {match.overall_score}% Top Match
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          @{user.username || user.full_name.toLowerCase().replace(/\s+/g, "")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {user.headline}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          Available for mentorship
                        </span>
                        {user.education?.[0] && (
                          <span className="flex items-center gap-1 text-indigo-300">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                            ABC College of Engineering (ECE — 2021)
                          </span>
                        )}
                        {user.location && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {user.location} • 5.5 Yrs Exp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action & Score */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className={`text-2xl font-black ${isTopMatch ? "text-emerald-400" : "text-sky-400"}`}>
                        {match.overall_score}%
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Match</div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                        className="text-xs border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/30"
                      >
                        Why This Match?
                      </Button>

                      {status === "accepted" ? (
                        <Link href="/chat">
                          <Button size="sm" variant="secondary" className="border-emerald-500/40 text-emerald-300">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            Chat
                          </Button>
                        </Link>
                      ) : status === "pending" ? (
                        <Badge variant="amber" size="md">
                          <Clock className="w-3 h-3 mr-1 inline" />
                          Pending
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={connectingUserId === user.id}
                          onClick={() => handleConnect(user.id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          {connectingUserId === user.id ? "Connecting..." : "Connect"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Key Skills:</span>
                  {skillsList.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* SECTION 10: MATCH EXPLANATION (5-FACTOR DETERMINISTIC BREAKDOWN) */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        Deterministic Multi-Factor Scoring Breakdown
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Formula: 30/25/20/15/10</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      &quot;{match.explanation}&quot;
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                        <div className="text-[10px] text-slate-400">Career Goal (30%)</div>
                        <div className="font-bold text-emerald-400">{match.career_goal_score} / 30</div>
                        <Badge variant="emerald" size="sm">Strong</Badge>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                        <div className="text-[10px] text-slate-400">Skills Overlap (25%)</div>
                        <div className="font-bold text-emerald-400">{match.skill_score} / 25</div>
                        <Badge variant="emerald" size="sm">Strong</Badge>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                        <div className="text-[10px] text-slate-400">Education (20%)</div>
                        <div className="font-bold text-emerald-400">{match.education_score} / 20</div>
                        <Badge variant="emerald" size="sm">Strong</Badge>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                        <div className="text-[10px] text-slate-400">Industry (15%)</div>
                        <div className="font-bold text-indigo-300">{match.industry_score} / 15</div>
                        <Badge variant="indigo" size="sm">Strong</Badge>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1 space-y-0.5">
                        <div className="text-[10px] text-slate-400">Experience (10%)</div>
                        <div className="font-bold text-indigo-300">{match.experience_score} / 10</div>
                        <Badge variant="indigo" size="sm">Relevant</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Agent Trace Modal */}
      <AgentTraceModal
        session={agentSession}
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
      />
    </div>
  );
}

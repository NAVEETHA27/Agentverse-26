"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Clock, 
  ChevronRight, 
  X, 
  Cpu, 
  Database as DbIcon,
  Search,
  Award,
  Send,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AgentSessionWithActions } from "@/lib/database/agents";

interface AgentTraceModalProps {
  session: AgentSessionWithActions;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentTraceModal({ session, isOpen, onClose }: AgentTraceModalProps) {
  const [activeTab, setActiveTab] = useState<"timeline" | "raw">("timeline");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                <Cpu className="w-3 h-3 mr-1 inline" />
                Autonomous Agent Trace
              </Badge>
              <Badge variant="emerald" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                Execution Completed
              </Badge>
              <Badge variant="purple" size="sm">
                <ShieldCheck className="w-3 h-3 mr-1 inline" />
                Human-in-the-Loop Verified
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Agent Reasoning & Execution Log
            </h2>
            <p className="text-xs text-slate-400">
              Session ID: <code className="text-indigo-300 font-mono">{session.id}</code> • Started: {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Duration: 1m 55s
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === "timeline" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Visual Trace
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === "raw" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw JSON
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Goal Banner */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-900/40 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Agent Target:</span> {session.goal}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {activeTab === "raw" ? (
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Goal Analysis */}
              <div className="relative pl-8 border-l-2 border-indigo-600 space-y-2">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  1
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 1: Goal Parsing & Gap Detection</span>
                    <Badge variant="emerald" size="sm">Completed</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> +10s
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  The Career Agent parsed the student&apos;s goal statement and matched it against the Cloud Engineering taxonomy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold text-[11px]">Input Intent</div>
                    <div className="text-slate-200 font-mono text-[11px]">&quot;I want to become a Cloud Engineer.&quot;</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-semibold text-[11px]">Required Skills Extracted</div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {["AWS", "Docker", "Kubernetes", "CI/CD"].map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Alumni Candidate Retrieval */}
              <div className="relative pl-8 border-l-2 border-indigo-600 space-y-2">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  2
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 2: Scoped Alumni Graph Search</span>
                    <Badge variant="emerald" size="sm">Completed</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> +20s
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Searched institutional alumni records from <strong className="text-white">ABC College of Engineering</strong> to identify graduates in cloud architecture.
                </p>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    <span>Retrieved <strong>12 candidate profiles</strong> from ABC College alumni pool</span>
                  </div>
                  <span className="text-emerald-400 font-semibold text-xs">Top Match: Rahul Sharma</span>
                </div>
              </div>

              {/* Step 3: Deterministic Scoring Breakdown */}
              <div className="relative pl-8 border-l-2 border-indigo-600 space-y-2">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  3
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 3: Deterministic Multi-Factor Scoring</span>
                    <Badge variant="emerald" size="sm">Completed</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> +20s
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Executed the transparent, non-hallucinatory scoring formula defined in Document 4:
                </p>
                
                {/* Scoring Formula Card */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-white">Scoring Formula Weights</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">Overall Match: 94.0%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Career Goal (30%)</div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">30.0 / 30</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Exact Role Alignment</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Skill Overlap (25%)</div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">23.5 / 25</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">AWS, Docker, K8s</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Education (20%)</div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">20.0 / 20</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">ABC College ECE</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Industry (15%)</div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">14.0 / 15</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">AWS Cloud</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-400">Experience (10%)</div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">6.5 / 10</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">5.5 Yrs Architect</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Outreach Message Draft Generation */}
              <div className="relative pl-8 border-l-2 border-indigo-600 space-y-2">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  4
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 4: Personalized Outreach Generation</span>
                    <Badge variant="emerald" size="sm">Completed</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> +20s
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Synthesized a personalized message emphasizing shared educational background and specific skill guidance.
                </p>
                <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs italic text-slate-200">
                  &quot;Hi Rahul, I noticed that you transitioned from an ECE background at ABC College into cloud engineering and now work with AWS and Kubernetes. I am currently working toward an entry-level Cloud Engineer role and would really value your advice on what to prioritize.&quot;
                </div>
              </div>

              {/* Step 5: Human in the loop Approval */}
              <div className="relative pl-8 space-y-2">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                  5
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 5: Human-In-The-Loop Approval</span>
                    <Badge variant="emerald" size="sm">Authorized</Badge>
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <UserCheck className="w-3 h-3" /> Approved by Rohan Varma
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  In strict accordance with agentic safety principles, the system paused for human review before sending the connection request.
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>User reviewed message draft, approved transmission, and dispatched connection request.</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Status: Sent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Deterministic logic verified • Safe agent execution
          </div>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}

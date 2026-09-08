"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Target, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Briefcase,
  Terminal,
  Cpu,
  GraduationCap,
  MessageSquare,
  Building2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentActivity } from "@/components/agent/AgentActivity";
import { AgentTraceModal } from "@/components/agent/AgentTraceModal";
import type { 
  UserRow, 
  CareerGoalRow, 
  CareerAnalysisRow, 
  SkillGapWithDetails, 
  EnrichedMatchResult, 
  AgentSessionWithActions 
} from "@/lib/database";

interface DashboardViewProps {
  user: UserRow;
  goal: CareerGoalRow | null;
  analysis: CareerAnalysisRow | null;
  gaps: SkillGapWithDetails[];
  matches: EnrichedMatchResult[];
  agentSession: AgentSessionWithActions;
}

export function DashboardView({
  user,
  goal,
  analysis,
  gaps,
  matches,
  agentSession,
}: DashboardViewProps) {
  const [isTraceOpen, setIsTraceOpen] = useState(false);

  const topMatch = matches[0];
  const readiness = analysis?.career_readiness_score || 68;

  // Sample opportunities for Section D
  const recommendedOpportunities = [
    {
      id: "op1",
      title: "Cloud & DevOps Engineering Intern",
      company: "CloudScale Systems",
      location: "Bangalore (Hybrid)",
      type: "Internship",
      whyRecommended: "Directly bridges AWS & Docker skill gaps identified in your career goal.",
      url: "https://cloudscale.careers/intern-cloud",
    },
    {
      id: "op2",
      title: "Junior Cloud Infrastructure Associate",
      company: "FinTech Distributed Systems",
      location: "Remote",
      type: "Full-time",
      whyRecommended: "Alumni Ananya Patel works here; strong mentorship for entry-level cloud engineers.",
      url: "https://fintech.careers/jr-cloud",
    },
  ];

  // Convert agent session actions to AgentActivity steps
  const agentSteps = agentSession.actions.map((act, idx) => ({
    stepNumber: idx + 1,
    agentType: "networking_agent" as const,
    toolName: act.action_type,
    description: `Executed ${act.action_type}`,
    inputSummary: JSON.stringify(act.input_data || {}),
    outputSummary: typeof act.output_data === "object" ? JSON.stringify(act.output_data) : String(act.output_data || "Completed"),
    status: act.status as any,
    durationMs: 420 + idx * 75,
    timestamp: act.created_at,
    requiresApproval: act.requires_approval,
  }));

  return (
    <div className="space-y-6">
      {/* Top Greeting & Metric Strip */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="indigo" size="sm">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Autonomous Career OS
              </Badge>
              <span className="text-xs text-slate-400">Rohan Varma • Final Year ECE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, {user.full_name.split(" ")[0]}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Here is your career command center. Your Autonomous Career & Networking Agents are monitoring skill milestones and mentor connections.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsTraceOpen(true)}
              className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/30"
            >
              <Terminal className="w-3.5 h-3.5 mr-1.5" />
              Audit Trace
            </Button>
            <Link href="/network">
              <Button size="sm" variant="primary" className="bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Find Mentors
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 KPI Quick Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Career Goal</span>
            <span className="text-sm sm:text-base font-bold text-white mt-0.5 block truncate">{goal?.target_role || "Cloud Engineer"}</span>
            <span className="text-[10px] text-emerald-400">Target Role Active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Role Readiness</span>
            <span className="text-sm sm:text-base font-bold text-indigo-300 mt-0.5 block">{readiness}%</span>
            <span className="text-[10px] text-slate-400">High Transferability</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Skill Gaps</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mt-0.5 block">{gaps.length} Skills</span>
            <span className="text-[10px] text-amber-300/80">AWS, Docker Priority</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Matched Mentors</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block">{matches.length} Alumni</span>
            <span className="text-[10px] text-emerald-300/80">Top Match 94%</span>
          </div>
        </div>
      </div>

      {/* SECTION B: AI NEXT BEST ACTION */}
      <Card className="border-indigo-500/40 bg-indigo-950/30 p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" size="sm">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                AI Next Best Action
              </Badge>
              <span className="text-[11px] font-mono text-indigo-300">Priority 1 Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              &quot;Strengthen Docker and Kubernetes through an automated deployment project. Reach out to mentor Rahul Sharma (Senior Cloud Architect @ AWS) for architecture review guidance.&quot;
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/career">
              <Button size="sm" variant="primary" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                View Career Plan
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Main Grid: Left 2 Cols (Career & Mentor), Right 1 Col (Agent Activity & Opportunities) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION A: CAREER PROGRESS */}
          <Card className="glass-panel border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Career Progress & Readiness</h3>
              </div>
              <Link href="/career" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                Manage Roadmap &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Entry-Level Cloud Engineer Readiness</span>
                <span className="text-indigo-400 font-bold">{readiness}% Complete</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${readiness}%` }}
                />
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Stage 1</span>
                  <Badge variant="emerald" size="sm">Completed</Badge>
                </div>
                <div className="text-xs font-semibold text-white">Linux & Python Systems</div>
                <p className="text-[10px] text-slate-400">Core OS scripting foundation</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-1 shadow-sm shadow-indigo-950/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-300 uppercase font-mono">Stage 2</span>
                  <Badge variant="indigo" size="sm">In Progress</Badge>
                </div>
                <div className="text-xs font-semibold text-white">AWS Compute & Docker</div>
                <p className="text-[10px] text-slate-300">Container packaging & ECS</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 opacity-70">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Stage 3</span>
                  <Badge variant="slate" size="sm">Next</Badge>
                </div>
                <div className="text-xs font-semibold text-white">CI/CD & Kubernetes</div>
                <p className="text-[10px] text-slate-400">Automated deployment pipelines</p>
              </div>
            </div>
          </Card>

          {/* SECTION C: RECOMMENDED MENTOR */}
          <Card className="glass-panel border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Top Recommended Alumni Mentor</h3>
              </div>
              <Badge variant="emerald" size="sm">94% Deterministic Match</Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                  R
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">Rahul Sharma</h4>
                    <span className="text-xs text-slate-400">@rahul_cloud</span>
                  </div>
                  <p className="text-xs text-indigo-300 font-medium">
                    Senior Cloud Architect @ Amazon Web Services
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    ABC College of Engineering • ECE (&apos;21 Alum)
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                <Link href="/network">
                  <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-semibold shadow-md shadow-emerald-900/30">
                    View Match
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Available for Mentorship
                </span>
              </div>
            </div>

            {/* Why Matched Evidence List */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-slate-300 text-[11px] block">Why You Matched (Phase 4 Mathematical Breakdown):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cloud Architecture Goal (30/30 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AWS & Docker Skill Focus (23.5/25 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Same College: ABC College ECE (20/20 pts)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Shared non-CS to Cloud transition</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION D: RECOMMENDED OPPORTUNITIES */}
          <Card className="glass-panel border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Recommended Opportunities</h3>
              </div>
              <Link href="/opportunities" className="text-xs text-sky-400 hover:underline">
                View All Opportunities &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedOpportunities.map((op) => (
                <div key={op.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{op.title}</h4>
                      <p className="text-[11px] text-slate-400">{op.company} • {op.location}</p>
                    </div>
                    <Badge variant="sky" size="sm">{op.type}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <strong className="text-indigo-300">Why recommended: </strong>{op.whyRecommended}
                  </p>
                  <div className="pt-1 flex justify-end">
                    <a href={op.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                      Apply / View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION F: RECENT AGENT ACTIVITY */}
          <AgentActivity
            title="Recent AI Agent Activity"
            agentType="networking_agent"
            status="completed"
            steps={agentSteps}
            onInspectTrace={() => setIsTraceOpen(true)}
          />

          {/* SECTION E: RECENT CONNECTIONS & MESSAGES */}
          <Card className="glass-panel border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Mentor Dialogues</h3>
              </div>
              <Link href="/chat" className="text-xs text-emerald-400 hover:underline">
                Open Chat &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              <Link href="/chat" className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Rahul Sharma</span>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </div>
                <p className="text-[11px] text-slate-300 truncate mt-1">
                  &quot;Once you have a working Dockerized deployment on AWS, ping me and I&apos;ll do a mock design review...&quot;
                </p>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Senior Cloud Architect @ AWS</span>
                  <span>1 hr ago</span>
                </div>
              </Link>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 block opacity-75">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Priya Nair</span>
                  <Badge variant="amber" size="sm">Pending</Badge>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  Connection request sent via AI recommendation
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  Site Reliability Engineer @ Google
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Agent Trace Inspector Modal */}
      <AgentTraceModal
        session={agentSession}
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
      />
    </div>
  );
}

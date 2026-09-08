"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  CheckSquare, 
  Square,
  Users,
  ExternalLink,
  Cpu,
  Loader2,
  Briefcase,
  Edit3,
  Check,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentActivity } from "@/components/agent/AgentActivity";
import { updateRoadmapItemStatus } from "@/lib/database/career";
import type { 
  CareerGoalRow, 
  CareerAnalysisRow, 
  SkillGapWithDetails, 
  RoadmapWithItems,
  RoadmapItemRow
} from "@/lib/database";
import type { AgentResponse, AgentTraceStep, AgentStatus } from "@/lib/agents/types";

interface CareerViewProps {
  goal: CareerGoalRow | null;
  analysis: CareerAnalysisRow | null;
  gaps: SkillGapWithDetails[];
  initialRoadmap: RoadmapWithItems | null;
}

export function CareerView({
  goal,
  analysis,
  gaps,
  initialRoadmap,
}: CareerViewProps) {
  const [items, setItems] = useState<RoadmapItemRow[]>(initialRoadmap?.items || []);
  const [activeTab, setActiveTab] = useState<"roadmap" | "skills" | "analysis">("roadmap");

  // Editable Career Goal state
  const [targetRole, setTargetRole] = useState(goal?.target_role || "Cloud Engineer");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalSavedNotification, setGoalSavedNotification] = useState(false);

  // Career Agent interactive state
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("completed");
  const [currentAgentAction, setCurrentAgentAction] = useState<string | undefined>(undefined);
  const [nextBestAction, setNextBestAction] = useState<string | null>(
    "Strengthen Docker and Kubernetes through a deployment project. Reach out to mentor Rahul Sharma (Senior Cloud Architect @ AWS) for architecture review guidance."
  );
  const [agentSteps, setAgentSteps] = useState<AgentTraceStep[]>([
    {
      stepNumber: 1,
      agentType: "career_agent",
      toolName: "parse_career_intent",
      description: "Extracted target role and core domain requirements from user goal",
      inputSummary: "Goal statement: 'I want to transition from ECE to become a Cloud Engineer at AWS'",
      outputSummary: "Target Role: Cloud Engineer, Domain: Cloud Infrastructure, Timeline: 12 months",
      status: "completed",
      durationMs: 420,
      timestamp: "2026-01-20T14:28:10Z",
    },
    {
      stepNumber: 2,
      agentType: "career_agent",
      toolName: "get_user_profile",
      description: "Retrieved verified student academic background and existing skill inventory",
      inputSummary: "Student ID: Rohan Varma (ECE, ABC College of Engineering)",
      outputSummary: "Major: ECE, Current Skills: Python, Linux, Java, SQL, Microcontrollers",
      status: "completed",
      durationMs: 310,
      timestamp: "2026-01-20T14:28:15Z",
    },
    {
      stepNumber: 3,
      agentType: "career_agent",
      toolName: "get_skill_gaps",
      description: "Computed delta between current verified skills and entry-level Cloud Architect criteria",
      inputSummary: "Evaluated 9 domain criteria for target role",
      outputSummary: "Identified 4 priority skill gaps: AWS, Docker, Kubernetes, CI/CD",
      status: "completed",
      durationMs: 390,
      timestamp: "2026-01-20T14:28:20Z",
    },
    {
      stepNumber: 4,
      agentType: "career_agent",
      toolName: "get_career_analysis",
      description: "Calculated career transition feasibility and readiness score",
      inputSummary: "Evaluated hardware-to-cloud transition potential",
      outputSummary: "Readiness Score: 68%. Strong transferability via Linux kernel and Python foundations.",
      status: "completed",
      durationMs: 280,
      timestamp: "2026-01-20T14:28:25Z",
    },
  ]);

  const completedCount = items.filter((i) => i.status === "completed").length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 20;

  const toggleItemStatus = async (item: RoadmapItemRow) => {
    const nextStatus: "completed" | "in_progress" = item.status === "completed" ? "in_progress" : "completed";
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );
    await updateRoadmapItemStatus(item.id, nextStatus);
  };

  const handleSaveGoal = () => {
    setIsEditingGoal(false);
    setGoalSavedNotification(true);
    setTimeout(() => setGoalSavedNotification(false), 3000);
  };

  const handleRunCareerAgent = async () => {
    setAgentStatus("executing");
    setCurrentAgentAction("Step 1/7: Parsing career intent & target role...");

    try {
      setTimeout(() => setCurrentAgentAction("Step 3/7: Inspecting verified student background & education..."), 400);
      setTimeout(() => setCurrentAgentAction("Step 5/7: Assessing priority skill gaps & milestones..."), 800);
      setTimeout(() => setCurrentAgentAction("Step 7/7: Determining optimal next best action..."), 1200);

      const res = await fetch("/api/ai/agents/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoalStatement: `I want to become a ${targetRole} and bridge my skill gaps`,
        }),
      });

      const data: AgentResponse = await res.json();
      if (data.success) {
        setAgentStatus("completed");
        if (data.nextAction) setNextBestAction(data.nextAction);
        if (data.trace) setAgentSteps(data.trace);
      } else {
        setAgentStatus("failed");
      }
    } catch (err) {
      console.error("Failed to run career agent:", err);
      setAgentStatus("failed");
    } finally {
      setCurrentAgentAction(undefined);
    }
  };

  const existingSkills = [
    { name: "Linux", level: "Intermediate", verified: true },
    { name: "Python", level: "Advanced", verified: true },
    { name: "Java", level: "Intermediate", verified: true },
    { name: "SQL", level: "Intermediate", verified: true },
    { name: "Microcontrollers / IoT", level: "Advanced", verified: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-400" />
            AI Career Planning & Diagnostic Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Goal formulation, automated skill gap diagnostics, and step-by-step career milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            disabled={agentStatus === "executing"}
            onClick={handleRunCareerAgent}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 text-white font-semibold"
          >
            {agentStatus === "executing" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Analyzing Pathway...
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 mr-1.5" />
                Run AI Career Agent
              </>
            )}
          </Button>
          <Badge variant="indigo" size="md">Career Agent Ready</Badge>
        </div>
      </div>

      {goalSavedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Career Goal updated to &quot;{targetRole}&quot;. Agent recommendations re-aligned.</span>
        </div>
      )}

      {/* SECTION A: CAREER GOAL FORMULATION & READINESS BANNER */}
      <Card className="glass-panel border-indigo-500/30 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">Target Role</span>
              <Badge variant="emerald" size="sm">Active Pathway</Badge>
            </div>
            
            {isEditingGoal ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-slate-950 border border-indigo-500 rounded-lg px-3 py-1.5 text-base font-bold text-white focus:outline-none"
                />
                <Button size="sm" variant="primary" onClick={handleSaveGoal} className="bg-emerald-600 hover:bg-emerald-500">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Save Goal
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold text-white">
                  {targetRole}
                </h2>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-xs text-slate-400 hover:text-indigo-300 transition flex items-center gap-1 p-1 rounded hover:bg-slate-800/60"
                  title="Edit target role"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Goal</span>
                </button>
              </div>
            )}

            <p className="text-xs text-slate-300">
              Transitioning from Electronics & Communication Engineering (ECE) to Cloud Infrastructure & DevOps.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-400">
                {analysis?.career_readiness_score || 68}%
              </div>
              <div className="text-[11px] text-slate-400">Role Readiness</div>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">{progressPercent}%</div>
              <div className="text-[11px] text-slate-400">Roadmap Progress</div>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400">{gaps.length}</div>
              <div className="text-[11px] text-slate-400">Skill Gaps</div>
            </div>
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress Toward Entry-Level Role Requirements</span>
            <span className="font-semibold text-slate-200">{completedCount} of {items.length} Milestones Complete</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* SECTION E: PROMINENT AI NEXT BEST ACTION */}
      <Card className="border-2 border-emerald-500/50 bg-emerald-950/20 p-5 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm">
                <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
                AI Next Best Action
              </Badge>
              <span className="text-[11px] font-mono text-emerald-300">Synthesized by Career Navigation Agent</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed pt-1">
              &quot;{nextBestAction}&quot;
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/network">
              <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Connect with Rahul Sharma &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "roadmap"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          5-Stage Progression Roadmap ({completedCount}/{items.length} Complete)
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "skills"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Skill Gap Analysis (Current vs Target)
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`pb-3 px-4 font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === "analysis"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          AI Diagnostic Intelligence
        </button>
      </div>

      {/* TAB 1: CAREER ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Sequenced Transition Milestones</span>
            <span>Check the box to update stage status</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isCompleted = item.status === "completed";
              const isInProgress = item.status === "in_progress";

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition ${
                    isCompleted
                      ? "bg-slate-950/40 border-slate-800/80 opacity-85"
                      : isInProgress
                      ? "bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-950/40"
                      : "bg-slate-950/60 border-slate-800/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleItemStatus(item)}
                      className="mt-1 text-slate-400 hover:text-indigo-400 transition shrink-0"
                      title={isCompleted ? "Mark in-progress" : "Mark completed"}
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                      )}
                    </button>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            STAGE {item.sequence_order}
                          </span>
                          <h3 className={`text-sm font-bold ${isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.estimated_duration || "3 weeks"}
                          </span>
                          <Badge
                            variant={
                              isCompleted ? "emerald" : isInProgress ? "indigo" : "slate"
                            }
                            size="sm"
                          >
                            {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Not Started"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Mentor Connection & Resource Tags */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div className="flex items-center gap-1 text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40 text-[11px]">
                          <Users className="w-3 h-3 text-indigo-400" />
                          <span>Linked Mentor: <strong>Rahul Sharma</strong> (Senior Cloud Architect @ AWS)</span>
                        </div>
                        {item.resource_url && (
                          <a
                            href={item.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sky-400 hover:underline text-[11px]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Reference Project Blueprint
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              Need architecture feedback on Stage 2 & Stage 3 deployments?
            </div>
            <Link href="/network">
              <Button size="sm" variant="primary">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Ask Rahul Sharma (94% Match Mentor)
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: SKILL GAP VISUALIZATION (CURRENT VS TO DEVELOP) */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Existing Verified Skills */}
            <Card className="glass-panel border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Current Verified Skills</h3>
                </div>
                <Badge variant="emerald" size="sm">5 Verified</Badge>
              </div>

              <div className="space-y-2.5">
                {existingSkills.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Proficiency: {s.level}</span>
                    </div>
                    <Badge variant="emerald" size="sm">Verified via IoT Project</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Skills To Develop (Missing Gaps) */}
            <Card className="glass-panel border-amber-900/40 bg-amber-950/10 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Skills To Develop (Missing Gaps)</h3>
                </div>
                <Badge variant="amber" size="sm">{gaps.length} Target Gaps</Badge>
              </div>

              <div className="space-y-2.5">
                {gaps.map((gap) => (
                  <div key={gap.id} className="p-3 rounded-xl bg-slate-950/70 border border-amber-900/30 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{gap.skill?.name || "AWS"}</span>
                      <Badge variant="amber" size="sm">
                        {gap.importance.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{gap.reason}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Current: <strong className="text-amber-400">{gap.current_level}</strong></span>
                      <span>Target: <strong className="text-emerald-400">{gap.required_level}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: AI DIAGNOSTIC INTELLIGENCE & AGENT ACTIVITY */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          <Card className="glass-panel border-slate-800 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Comprehensive AI Diagnostic Assessment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis?.current_profile_summary || "Student displays strong system-level foundation in Linux OS concepts and Python telemetry from an IoT environmental monitor project. High aptitude for cloud transition with targeted practice in containerization."}
            </p>
          </Card>

          {/* Reusable Agent Activity Log */}
          <AgentActivity
            title="Career Agent Execution Audit"
            agentType="career_agent"
            status={agentStatus}
            currentAction={currentAgentAction}
            steps={agentSteps}
          />
        </div>
      )}
    </div>
  );
}

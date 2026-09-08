"use client";

import React from "react";
import Link from "next/link";
import {
  Target, TrendingUp, Users, Briefcase, ChevronRight,
  Sparkles, ArrowRight, Clock, CheckCircle2, Sun,
  MapPin, Calendar, Bot, Zap, BookOpen, Award,
  FolderGit2, Edit3, GraduationCap, BarChart2,
  Rocket, Star, ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type {
  UserRow, CareerGoalRow, CareerAnalysisRow,
  SkillGapWithDetails, EnrichedMatchResult, AgentSessionWithActions,
} from "@/lib/database";

interface DashboardViewProps {
  user: UserRow;
  goal: CareerGoalRow | null;
  analysis: CareerAnalysisRow | null;
  gaps: SkillGapWithDetails[];
  matches: EnrichedMatchResult[];
  agentSession: AgentSessionWithActions;
}

export function DashboardView({ user, goal, analysis, gaps, matches, agentSession }: DashboardViewProps) {
  const readiness = analysis?.career_readiness_score ?? 72;
  const targetRole = goal?.target_role ?? "Cloud Engineer";

  const getHour = () => new Date().getHours();
  const greeting =
    getHour() < 12 ? "Good morning" : getHour() < 17 ? "Good afternoon" : "Good evening";

  // Alumni from live matching or seed fallback
  const recommendedAlumni =
    matches && matches.length > 0
      ? matches.slice(0, 3).map((m) => ({
          id: m.matched_user?.id ?? "a1",
          name: m.matched_user?.full_name ?? "Rahul Sharma",
          role: m.matched_user?.headline ?? "Cloud Architect @ Google",
          match: m.overall_score ?? 94,
        }))
      : [
          { id: "a1", name: "Rahul Sharma", role: "Cloud Architect @ Google", match: 94 },
          { id: "a2", name: "Priya Sharma", role: "ML Engineer @ Microsoft", match: 91 },
          { id: "a3", name: "Arjun Reddy", role: "Data Scientist @ NVIDIA", match: 87 },
        ];

  const opportunitiesList = [
    { title: "Cloud & DevOps Engineering Intern", company: "Google", location: "Remote", match: 85 },
    { title: "AI/ML Systems Intern", company: "Microsoft", location: "Bangalore", match: 78 },
  ];

  const recentConnections = [
    { name: "Rahul Sharma", role: "Cloud Architect @ Google" },
    { name: "Ritika Sharma", role: "Data Scientist @ ZS" },
    { name: "Vikram Rao", role: "SDE @ PayPal" },
  ];

  const roadmapSteps = [
    { label: "Foundation", status: "completed" },
    { label: "Build Skills (Docker & Kubernetes)", status: "in_progress" },
    { label: "Experience & Projects", status: "upcoming" },
    { label: "Applications & Referrals", status: "upcoming" },
  ];

  const agentActivityList =
    agentSession?.actions && agentSession.actions.length > 0
      ? agentSession.actions.slice(0, 4).map((a) => ({
          text: a.action_type ?? "Agent executed career step",
          time: new Date(a.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      : [
          { text: "Career Agent analyzed target role: Cloud Engineer", time: "10m ago" },
          { text: "Identified skill gaps: Docker, Kubernetes, Terraform", time: "25m ago" },
          { text: "Networking Agent matched top mentor: Rahul Sharma (94%)", time: "1h ago" },
          { text: "Human-in-the-loop action pending your review", time: "2h ago" },
        ];

  const skillGapLabels =
    gaps && gaps.length > 0
      ? gaps.slice(0, 4).map((g) => g.skill?.name ?? "Skill")
      : ["Docker & Kubernetes", "Terraform", "AWS & Cloud", "CI/CD"];

  return (
    <div className="space-y-4">
      {/* ── 1. Welcome Banner ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl text-white p-5 lg:p-6"
        style={{
          background: "linear-gradient(135deg, #160309 0%, #2e0618 35%, #4a0c28 70%, #681038 100%)",
          boxShadow: "0 4px 20px rgba(74, 12, 40, 0.25)",
        }}
      >
        {/* Decorative curves */}
        <svg
          className="absolute right-0 top-0 h-full w-[45%] pointer-events-none opacity-40"
          viewBox="0 0 300 150"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          <ellipse cx="260" cy="20" rx="140" ry="70" stroke="#e01858" strokeWidth="1.2" />
          <ellipse cx="280" cy="30" rx="110" ry="55" stroke="#f02060" strokeWidth="0.8" />
          <line x1="120" y1="0" x2="300" y2="90" stroke="#ff4080" strokeWidth="0.6" opacity="0.4" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: "radial-gradient(circle, rgba(122,20,67,0.85) 0%, #300618 100%)",
                border: "2px solid rgba(240, 60, 110, 0.6)",
                boxShadow: "0 0 16px rgba(220, 40, 90, 0.4)",
              }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-rose-200/80 flex items-center gap-1.5">
                <Sun className="w-3 h-3" /> {greeting}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {greeting}, {user.full_name.split(" ")[0]}!
              </h1>
              <p className="text-xs text-rose-200/90">
                Your AI agents are active and working toward{" "}
                <span className="font-bold text-white">{targetRole}</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link href="/career">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/20 text-white"
              >
                <Bot className="w-3.5 h-3.5 mr-1.5" /> Career Agent
              </Button>
            </Link>
            <Link href="/network">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              >
                <Users className="w-3.5 h-3.5 mr-1.5" /> Find Mentors
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Key Metric Counters ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Career Readiness", value: `${readiness}%`, icon: TrendingUp },
          { label: "Skill Gaps", value: String(skillGapLabels.length), icon: Sparkles },
          { label: "Connections", value: "25", icon: Users },
          { label: "Open Opportunities", value: "2", icon: Briefcase },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#7A1443]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#7D6F77]">{label}</p>
              <p className="text-lg font-black text-[#1E1218]">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── 3. Main Layout ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="space-y-4 min-w-0">
          {/* Career Goal + Skill Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">
                  Current Career Goal
                </p>
                <Link href="/career" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                  Edit
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-[#7A1443]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E1218] leading-tight">
                    I want to become a {targetRole}
                  </p>
                  <p className="text-[10px] text-[#7D6F77] mt-0.5">Target: Entry Level / Associate</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">
                  Skill Gap Summary
                </p>
                <Link href="/career" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {skillGapLabels.map((gap) => (
                  <span
                    key={gap}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB]"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Career Roadmap Preview */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">
                Career Roadmap Preview
              </p>
              <Link
                href="/career"
                className="text-[11px] text-[#7A1443] font-bold hover:underline flex items-center gap-0.5"
              >
                View Full Roadmap <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roadmapSteps.map((step, idx) => (
                <div
                  key={step.label}
                  className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7D6F77]">Step {idx + 1}</span>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1E1218] leading-tight line-clamp-2">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Connections + Agent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">
                  Recent Connections
                </p>
                <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                  View Network
                </Link>
              </div>
              <div className="space-y-2">
                {recentConnections.map((conn) => (
                  <div key={conn.name} className="flex items-center gap-2 text-xs">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {conn.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1E1218] leading-none">{conn.name}</p>
                      <p className="text-[10px] text-[#7D6F77]">{conn.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">
                  Agent Activity
                </p>
                <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                  Trace
                </Link>
              </div>
              <div className="space-y-2">
                {agentActivityList.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-[#7A1443] mt-0.5">✦</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#4A3E45] leading-tight">{item.text}</p>
                      <p className="text-[9px] text-[#7D6F77]">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Right Rail ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Career Progress Donut */}
          <Card className="p-4 space-y-3.5">
            <p className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#7A1443]" /> Your Career Progress
            </p>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#F0E3E7" strokeWidth="8" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#7A1443"
                    strokeWidth="8"
                    strokeDasharray={`${(readiness / 100) * 188.5} 188.5`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-[#5A0C32]">{readiness}%</span>
                  <span className="text-[8px] font-semibold text-[#7D6F77] leading-none text-center">
                    Career
                    <br />
                    Readiness
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-xs">
                {[
                  { label: "Skills", pct: 60 },
                  { label: "Projects", pct: 40 },
                  { label: "Experience", pct: 30 },
                  { label: "Certifications", pct: 20 },
                ].map(({ label, pct }) => (
                  <div key={label} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#7D6F77] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7A1443]" /> {label}
                    </span>
                    <span className="font-bold text-[#1E1218]">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recommended Alumni */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#7A1443]" /> Recommended Alumni
              </p>
              <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {recommendedAlumni.map((alum) => (
                <Link
                  key={alum.id}
                  href="/network"
                  className="p-2 rounded-xl hover:bg-[#FAF7F8] border border-transparent hover:border-[#F0E3E7] flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {alum.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E1218] truncate group-hover:text-[#7A1443]">
                        {alum.name}
                      </p>
                      <p className="text-[10px] text-[#7D6F77] truncate">{alum.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {Math.round(alum.match)}% Match
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#B0A0B0] group-hover:text-[#7A1443]" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Latest Opportunities */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#7A1443]" /> Latest Opportunities
              </p>
              <Link href="/opportunities" className="text-[11px] text-[#7A1443] font-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {opportunitiesList.map((opp) => (
                <Link
                  key={opp.title}
                  href="/opportunities"
                  className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:border-[#F4CEDB] flex items-center justify-between transition block group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#F0E3E7] flex items-center justify-center text-xs font-bold text-[#7A1443] shrink-0">
                      {opp.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E1218] truncate group-hover:text-[#7A1443]">
                        {opp.title}
                      </p>
                      <p className="text-[10px] text-[#7D6F77]">
                        {opp.company} • {opp.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    {opp.match}%
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          {/* AI Next Best Action */}
          <div
            className="rounded-2xl p-4 text-white space-y-2.5"
            style={{
              background: "linear-gradient(135deg, #2b0618 0%, #4a0c2b 60%, #681038 100%)",
              boxShadow: "0 4px 16px rgba(74, 12, 40, 0.2)",
            }}
          >
            <div className="flex items-center gap-1.5 text-amber-300">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              <span className="text-[11px] font-bold uppercase tracking-wide">Next Best Action</span>
            </div>
            <p className="text-xs font-bold leading-snug">
              Start the AWS Cloud Practitioner course and build a cloud project to strengthen your profile.
            </p>
            <Link href="/career" className="block pt-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-bold py-1.5"
                style={{ background: "linear-gradient(90deg, #c0336b, #e0406e)" }}
              >
                Start Now →
              </Button>
            </Link>
          </div>

          {/* CTA Banner */}
          <div
            className="relative overflow-hidden rounded-2xl p-4 text-white flex items-center justify-between"
            style={{
              background: "linear-gradient(110deg, #1f0412 0%, #420824 50%, #630c34 100%)",
            }}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Build your dream career</p>
                <p className="text-[10px] text-rose-200/80">with the right connections.</p>
              </div>
            </div>
            <Link
              href="/network"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition shrink-0 relative z-10"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

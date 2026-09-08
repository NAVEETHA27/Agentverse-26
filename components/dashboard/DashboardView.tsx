"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target, TrendingUp, Users, Briefcase, ChevronRight,
  Sparkles, ArrowRight, MessageSquare, Clock, CheckCircle2,
  Bookmark, MapPin, Calendar, Bot, Zap, BookOpen,
  Award, FolderGit2, Edit3, GraduationCap, Mail, Phone,
  BarChart2, Rocket, Star, Check, ExternalLink, HelpCircle,
  MoreVertical, ShieldCheck, Cpu, Terminal, Info, ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentActivity } from "@/components/agent/AgentActivity";
import { AgentTraceModal } from "@/components/agent/AgentTraceModal";
import type {
  UserRow, CareerGoalRow, CareerAnalysisRow,
  SkillGapWithDetails, EnrichedMatchResult, AgentSessionWithActions
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
  const [selectedMatchForExplanation, setSelectedMatchForExplanation] = useState<any>(null);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"This Month" | "This Week">("This Month");
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const readiness = analysis?.career_readiness_score || 68;
  const targetRole = goal?.target_role || "Cloud Engineer";

  // Data grounding: Top mentor MUST remain Rahul Sharma (Senior Cloud Architect, AWS/Google, ABC College ECE Alum 2021)
  const topMatches = matches && matches.length > 0
    ? matches
    : [
        {
          id: "m1",
          student_id: user?.id || "u1",
          matched_user_id: "u2",
          overall_score: 94,
          created_at: new Date().toISOString(),
          matched_user: {
            id: "u2",
            full_name: "Rahul Sharma",
            headline: "Senior Cloud Architect @ AWS | ABC College ECE Alum ('21)",
            email: "rahul.sharma@aws.com",
            location: "Bangalore",
            profile_photo_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile: {
              current_company: "Google",
              current_role: "Senior Cloud Architect",
              years_experience: 5,
              degree: "B.Tech ECE",
              graduation_year: 2021,
            },
          },
          score_breakdown: {
            goalScore: 30.0,
            skillScore: 22.5,
            educationScore: 18.0,
            industryScore: 14.5,
            experienceScore: 9.0,
            reasons: [
              "Direct career match: Target role Cloud Engineer aligns with Rahul's Cloud Architect background.",
              "Shared high-priority skills: AWS, Docker, Kubernetes, Terraform.",
              "ABC College ECE Alumnus ('21) connection.",
            ],
          },
        },
        {
          id: "m2",
          student_id: user?.id || "u1",
          matched_user_id: "u3",
          overall_score: 91,
          created_at: new Date().toISOString(),
          matched_user: {
            id: "u3",
            full_name: "Neha Iyer",
            headline: "Consultant @ McKinsey & Company | Alumna ('20)",
            email: "neha.iyer@mckinsey.com",
            location: "Mumbai",
            profile_photo_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile: {
              current_company: "McKinsey & Company",
              current_role: "Consultant",
              years_experience: 4,
              degree: "B.Tech CSE",
              graduation_year: 2020,
            },
          },
          score_breakdown: {
            goalScore: 28.0,
            skillScore: 22.0,
            educationScore: 19.0,
            industryScore: 13.0,
            experienceScore: 9.0,
            reasons: ["Strong technical & problem-solving background."],
          },
        },
        {
          id: "m3",
          student_id: user?.id || "u1",
          matched_user_id: "u4",
          overall_score: 87,
          created_at: new Date().toISOString(),
          matched_user: {
            id: "u4",
            full_name: "Arjun Singh",
            headline: "Data Scientist @ ZS Associates | Alum ('19)",
            email: "arjun.singh@zs.com",
            location: "Gurgaon",
            profile_photo_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile: {
              current_company: "ZS Associates",
              current_role: "Data Scientist",
              years_experience: 6,
              degree: "B.Tech ECE",
              graduation_year: 2019,
            },
          },
          score_breakdown: {
            goalScore: 26.0,
            skillScore: 21.0,
            educationScore: 18.0,
            industryScore: 13.0,
            experienceScore: 9.0,
            reasons: ["Data analysis & machine learning infrastructure experience."],
          },
        },
      ];

  const recentConnections = [
    { name: "Rahul Sharma", role: "Senior Cloud Architect", company: "Google / AWS", avatar: "RS", color: "from-[#5A0C32] to-[#7A1443]" },
    { name: "Ritika Sharma", role: "Data Scientist", company: "ZS Associates", avatar: "RS", color: "from-[#7A1443] to-[#C0336B]" },
    { name: "Vikram Rao", role: "Senior DevOps Engineer", company: "PayPal", avatar: "VR", color: "from-[#350A1F] to-[#5A0C32]" },
    { name: "Neha Joshi", role: "Product Manager", company: "Flipkart", avatar: "NJ", color: "from-[#7A1443] to-[#A02058]" },
    { name: "Sneha Iyer", role: "Software Engineer", company: "Adobe", avatar: "SI", color: "from-[#5A0C32] to-[#8A1545]" },
  ];

  const handleConnect = (id: string) => {
    if (!connectedIds.includes(id)) {
      setConnectedIds([...connectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── Desktop Main Content Grid (Left Column: Content, Right Column: Insights) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT MAIN COLUMN (lg:col-span-8) ── */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          
          {/* ── 1. Main Hero AI Insight Banner (Matching Reference Screenshot) ── */}
          <div
            className="relative overflow-hidden rounded-2xl text-white p-6 lg:p-7 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5A0C32 0%, #7A1443 55%, #1A0410 100%)",
              boxShadow: "0 6px 24px rgba(90, 12, 50, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {/* Abstract Decorative Network Lines in Background */}
            <svg
              className="absolute right-0 top-0 h-full w-[50%] pointer-events-none opacity-30"
              viewBox="0 0 320 160"
              fill="none"
              preserveAspectRatio="xMaxYMid slice"
            >
              <ellipse cx="280" cy="20" rx="140" ry="75" stroke="#E01858" strokeWidth="1.2" />
              <ellipse cx="300" cy="40" rx="110" ry="55" stroke="#F02060" strokeWidth="0.8" />
              <circle cx="240" cy="90" r="4" fill="#FF4080" />
              <circle cx="280" cy="120" r="3" fill="#FF80B0" />
              <line x1="160" y1="10" x2="280" y2="120" stroke="#FF4080" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 3" />
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left Info & Sparkle Icon */}
              <div className="flex items-start gap-4 max-w-[520px]">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                  <Sparkles className="w-6 h-6 text-rose-200 fill-rose-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
                      AI Insight for You
                    </h2>
                  </div>
                  <p className="text-xs lg:text-sm text-rose-100/90 leading-relaxed font-normal">
                    Based on your profile, skills, and career goal ({targetRole}), AgentVerse found people and opportunities that can help you move forward.
                  </p>
                  <div className="pt-2">
                    <Link href="/network">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#5A0C32] hover:bg-rose-50 transition-colors shadow-md flex items-center gap-1.5 active:scale-95"
                      >
                        Explore recommendations <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Stat Box matching Reference Screenshot */}
              <div className="flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[140px]">
                <span className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                  {topMatches.length}
                </span>
                <span className="text-xs font-bold text-rose-200 mt-1">
                  Top recommendation
                </span>
                <span className="text-[11px] text-rose-200/80 font-medium">
                  People you should connect with next
                </span>
              </div>
            </div>
          </div>


          {/* ── 2. Top Alumni Recommendations for You ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1E1218] tracking-tight">
                  Top Alumni Recommendations for You
                </h2>
                <p className="text-xs text-[#7D6F77]">
                  Ranked by AgentVerse deterministic matching engine based on career goal & skill gaps.
                </p>
              </div>
              <Link
                href="/network"
                className="text-xs font-semibold text-[#7A1443] hover:text-[#5A0C32] flex items-center gap-1 transition"
              >
                View all recommendations <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 3 Horizontal Recommendation Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {topMatches.slice(0, 3).map((match, idx) => {
                const candidate = match.matched_user;
                const isConnected = connectedIds.includes(candidate?.id || match.id);
                const score = match.overall_score || 94;
                const companyName = candidate?.profile?.current_company || (idx === 0 ? "Google" : idx === 1 ? "McKinsey & Company" : "ZS Associates");
                const roleName = candidate?.profile?.current_role || (idx === 0 ? "Senior Cloud Architect" : idx === 1 ? "Consultant" : "Data Scientist");
                const sharedSkills = idx === 0
                  ? ["AWS", "Docker", "Kubernetes", "Terraform"]
                  : idx === 1
                  ? ["Problem Solving", "Communication", "Strategy"]
                  : ["Data Analysis", "Machine Learning", "SQL"];

                return (
                  <div
                    key={match.id || idx}
                    className="group rounded-2xl border border-[#F0E3E7] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Full Cover Self-Contained Professional Avatar Box */}
                      <div
                        className="relative h-48 w-full overflow-hidden p-3.5 flex flex-col justify-between"
                        style={{
                          background:
                            idx === 0
                              ? "linear-gradient(135deg, #1A0410 0%, #350A1F 40%, #5A0C32 75%, #7A1443 100%)"
                              : idx === 1
                              ? "linear-gradient(135deg, #2A0818 0%, #4A0C28 45%, #7A1443 80%, #C0336B 100%)"
                              : "linear-gradient(135deg, #1E0412 0%, #3D0822 50%, #5A0C32 85%, #8A1545 100%)",
                        }}
                      >
                        {/* Abstract Decorative Vector Line Accents */}
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
                          viewBox="0 0 240 160"
                          fill="none"
                          preserveAspectRatio="xMidYMid slice"
                        >
                          <ellipse cx="200" cy="30" rx="100" ry="60" stroke="#E01858" strokeWidth="1.2" />
                          <ellipse cx="210" cy="40" rx="80" ry="45" stroke="#F02060" strokeWidth="0.8" />
                          <circle cx="180" cy="110" r="30" fill="rgba(255, 60, 120, 0.15)" />
                        </svg>

                        {/* Top Overlay Row */}
                        <div className="relative z-10 flex items-center justify-between">
                          {/* Match Percentage Badge */}
                          <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 shadow-xs flex items-center gap-1">
                            <span className="text-rose-300 font-extrabold">{score}%</span>
                            <span>Match</span>
                          </div>

                          {/* Verified Alum Icon */}
                          <div
                            className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-emerald-400 border border-white/20"
                            title="Verified Alumnus"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Center Professional Avatar Emblem & Initials */}
                        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                          <div className="w-20 h-20 rounded-2xl bg-white/12 backdrop-blur-md border-2 border-white/30 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {candidate?.full_name
                              ? candidate.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                              : idx === 0
                              ? "RS"
                              : idx === 1
                              ? "PN"
                              : "AP"}
                          </div>
                        </div>
                      </div>

                      {/* Card Main Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#1E1218] group-hover:text-[#7A1443] transition flex items-center gap-1.5">
                            {candidate?.full_name || "Rahul Sharma"}
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#7A1443] shrink-0" />
                          </h3>
                        </div>

                        <p className="text-xs font-semibold text-[#5A0C32]">
                          {roleName}
                        </p>
                        <p className="text-[11px] text-[#7D6F77] font-medium flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#A08E98]" />
                          {companyName}
                        </p>

                        <div className="border-t border-[#F0E3E7] pt-2 mt-2" />

                        {/* Shared Skills Section */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08E98] block">
                            Skills you both share
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sharedSkills.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F0E3E7]/60 text-[#5A0C32] border border-[#E8D1D8]"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-2 space-y-1.5 bg-[#FAF7F8]/50 border-t border-[#F0E3E7]/60">
                      <button
                        type="button"
                        onClick={() => handleConnect(candidate?.id || match.id)}
                        disabled={isConnected}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                          isConnected
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-[#7A1443] hover:bg-[#5A0C32] text-white active:scale-95"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Connection Sent
                          </>
                        ) : (
                          "Connect"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMatchForExplanation(match)}
                        className="w-full py-1 text-[11px] font-medium text-[#7A1443] hover:text-[#5A0C32] text-center transition"
                      >
                        Why this person?
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* ── 3. Your Career Progress ── */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[#1E1218] tracking-tight">
              Your Career Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: AI Career Readiness */}
              <div className="p-4 rounded-2xl border border-[#F0E3E7] bg-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7D6F77]">
                  <span className="font-semibold text-[#1E1218]">AI Career Readiness</span>
                  <Target className="w-4 h-4 text-[#7A1443]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#5A0C32]">{readiness}%</span>
                  <span className="text-[11px] font-medium text-emerald-600">On Track</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5A0C32] to-[#C0336B] rounded-full" style={{ width: `${readiness}%` }} />
                </div>
                <p className="text-[11px] text-[#7D6F77] pt-1">
                  Target Role: <strong className="text-[#1E1218]">{targetRole}</strong>
                </p>
              </div>

              {/* Card 2: Skill Gap Analysis */}
              <div className="p-4 rounded-2xl border border-[#F0E3E7] bg-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7D6F77]">
                  <span className="font-semibold text-[#1E1218]">Skill Gap Analysis</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1218]">
                    {gaps.length > 0 ? gaps.length : 4}
                  </span>
                  <span className="text-[11px] text-[#7D6F77]">priority gaps identified</span>
                </div>
                <p className="text-[11px] text-[#7D6F77] truncate">
                  Key focus: Docker, Kubernetes, Terraform
                </p>
                <Link href="/career" className="text-[11px] font-semibold text-[#7A1443] hover:underline block pt-1">
                  Bridge skill gaps →
                </Link>
              </div>

              {/* Card 3: Career Roadmap */}
              <div className="p-4 rounded-2xl border border-[#F0E3E7] bg-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#7D6F77]">
                  <span className="font-semibold text-[#1E1218]">Roadmap Stages</span>
                  <BookOpen className="w-4 h-4 text-[#7A1443]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1218]">5</span>
                  <span className="text-[11px] text-emerald-600 font-medium">Stage 2 in progress</span>
                </div>
                <p className="text-[11px] text-[#7D6F77]">
                  Foundations → Containerization → Cloud Deployment
                </p>
                <Link href="/career" className="text-[11px] font-semibold text-[#7A1443] hover:underline block pt-1">
                  View full roadmap →
                </Link>
              </div>

            </div>
          </div>


          {/* ── 4. Next-Best-Action Banner ── */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1A0410] to-[#5A0C32] text-white space-y-3 shadow-sm border border-[#7A1443]/40">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10 text-rose-300">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                Your Next Best Action
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Connect with Rahul Sharma
                </h3>
                <p className="text-xs text-rose-100/80 max-w-[500px]">
                  Rahul's AWS and cloud architecture experience closely matches your Cloud Engineer goal. Connecting now gives you targeted mentorship.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/network">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#5A0C32] hover:bg-rose-50 transition shadow-sm"
                  >
                    View recommendation
                  </button>
                </Link>
                <Link href="/career">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-white bg-white/10 hover:bg-white/20 transition"
                  >
                    View roadmap
                  </button>
                </Link>
              </div>
            </div>
          </div>


          {/* ── 5. Recent Connections ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1E1218]">
                Recent Connections
              </h2>
              <Link href="/network" className="text-xs font-semibold text-[#7A1443] hover:text-[#5A0C32] flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {recentConnections.map((conn, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl border border-[#F0E3E7] bg-white text-center space-y-2 shadow-xs hover:border-[#7A1443]/40 transition"
                >
                  <div className={`w-10 h-10 mx-auto rounded-full bg-gradient-to-br ${conn.color} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                    {conn.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1218] truncate">{conn.name}</p>
                    <p className="text-[10px] text-[#7D6F77] truncate">{conn.role}</p>
                    <p className="text-[9px] text-[#A08E98] truncate">{conn.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* ── 6. Agent Activity Audit Trace ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#7A1443]" />
                <h2 className="text-base font-bold text-[#1E1218]">
                  Agent Activity
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsTraceModalOpen(true)}
                className="text-xs font-semibold text-[#7A1443] hover:text-[#5A0C32] flex items-center gap-1"
              >
                Inspect Audit Trace <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>

            <AgentActivity
              status={
                agentSession?.status === "running" || agentSession?.status === "pending"
                  ? "executing"
                  : agentSession?.status === "completed"
                  ? "completed"
                  : agentSession?.status === "failed" || agentSession?.status === "cancelled"
                  ? "failed"
                  : "waiting_for_approval"
              }
              steps={
                agentSession?.actions && agentSession.actions.length > 0
                  ? agentSession.actions.map((a, i) => ({
                      stepNumber: i + 1,
                      agentType: "networking_agent" as const,
                      toolName: a.action_type || "Tool Execution",
                      description: (a as any)?.payload?.description || (a as any)?.input_data?.description || a.action_type || "Executed agent reasoning tool",
                      inputSummary: "Candidate evaluation context",
                      outputSummary: (a as any)?.payload?.summary || (a as any)?.output_data?.summary || "Processed candidate match",
                      status: a.status === "completed" ? ("completed" as const) : ("waiting_for_approval" as const),
                      durationMs: 120 + i * 40,
                      timestamp: new Date(a.created_at || Date.now()).toISOString(),
                    }))
                  : [
                      {
                        stepNumber: 1,
                        agentType: "career_agent" as const,
                        toolName: "CareerGoalAnalyzer",
                        description: "Analyzed student goal (Cloud Engineer) against baseline curriculum",
                        inputSummary: "Goal: Cloud Engineer",
                        outputSummary: "Identified priority gaps: Docker, Kubernetes, Terraform",
                        status: "completed" as const,
                        durationMs: 140,
                        timestamp: new Date().toISOString(),
                      },
                      {
                        stepNumber: 2,
                        agentType: "networking_agent" as const,
                        toolName: "AlumniMatchEngine",
                        description: "Evaluated 15 alumni candidates using 5-part score formula",
                        inputSummary: "15 Candidates",
                        outputSummary: "Top match identified: Rahul Sharma (94% score)",
                        status: "completed" as const,
                        durationMs: 210,
                        timestamp: new Date().toISOString(),
                      },
                      {
                        stepNumber: 3,
                        agentType: "networking_agent" as const,
                        toolName: "HumanInTheLoopApproval",
                        description: "Connection outreach draft prepared; waiting for user confirmation",
                        inputSummary: "Outreach message payload",
                        outputSummary: "Outreach message drafted for Rahul Sharma",
                        status: "waiting_for_approval" as const,
                        durationMs: 0,
                        timestamp: new Date().toISOString(),
                      },
                    ]
              }
              onInspectTrace={() => setIsTraceModalOpen(true)}
            />
          </div>

        </div>


        {/* ── RIGHT INSIGHTS COLUMN (lg:col-span-4) matching Reference Screenshot ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ── CARD 1: AI PROFILE STRENGTH ── */}
          <div className="p-5 rounded-2xl border border-[#F0E3E7] bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0E3E7] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FAF7F8] text-[#5A0C32]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1E1218]">
                  Profile Strength
                </h3>
              </div>
              <button type="button" className="text-[#A08E98] hover:text-[#1E1218]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Progress & Status Row matching Screenshot */}
            <div className="flex items-center gap-4 pt-1">
              {/* Donut Progress Circle */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-[#F0E3E7]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Arc (68%) */}
                  <path
                    className="text-[#7A1443]"
                    strokeDasharray={`${readiness}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-[#1E1218] leading-none">
                    {readiness}%
                  </span>
                  <span className="text-[9px] font-bold text-[#5A0C32] mt-0.5">
                    AI Readiness
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#1E1218]">
                  You're on the right track.
                </p>
                <p className="text-[11px] text-[#7D6F77] leading-relaxed">
                  Complete a few more sections to unlock better recommendations.
                </p>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 border-t border-[#F0E3E7] pt-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Career goal added</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Skills added (5/8)</span>
              </div>
              <div className="flex items-center gap-2 text-[#7D6F77]">
                <div className="w-4 h-4 rounded-full border-2 border-[#E8D1D8] shrink-0" />
                <span>Add more projects</span>
              </div>
              <div className="flex items-center gap-2 text-[#7D6F77]">
                <div className="w-4 h-4 rounded-full border-2 border-[#E8D1D8] shrink-0" />
                <span>Complete profile verification</span>
              </div>
            </div>

            {/* Button */}
            <Link href="/profile" className="block pt-1">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#7A1443] bg-white border border-[#E8D1D8] hover:bg-[#FAF7F8] hover:border-[#7A1443]/40 transition text-center shadow-xs"
              >
                Improve profile
              </button>
            </Link>
          </div>


          {/* ── CARD 2: CAREER MOMENTUM ── */}
          <div className="p-5 rounded-2xl border border-[#F0E3E7] bg-white space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0E3E7] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#7A1443]" />
                <h3 className="text-sm font-bold text-[#1E1218]">
                  Career Momentum
                </h3>
              </div>

              {/* Timeframe Dropdown */}
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="text-[11px] font-semibold text-[#5A0C32] bg-[#FAF7F8] border border-[#E8D1D8] rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="This Month">This Month</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>
            </div>

            {/* 4 Stat Boxes (2x2 Grid matching Reference Screenshot) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Stat 1: Profile Views */}
              <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1218]">
                  <Users className="w-3.5 h-3.5 text-[#7A1443]" />
                  <span className="text-base font-extrabold">23</span>
                </div>
                <p className="text-[10px] text-[#7D6F77] font-medium">Profile views</p>
                <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> ↗ 35% vs last month
                </p>
              </div>

              {/* Stat 2: Connection Invites */}
              <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1218]">
                  <Rocket className="w-3.5 h-3.5 text-[#7A1443]" />
                  <span className="text-base font-extrabold">17</span>
                </div>
                <p className="text-[10px] text-[#7D6F77] font-medium">Connection invites</p>
                <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> ↗ 21% vs last month
                </p>
              </div>

              {/* Stat 3: Messages */}
              <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1218]">
                  <MessageSquare className="w-3.5 h-3.5 text-[#7A1443]" />
                  <span className="text-base font-extrabold">9</span>
                </div>
                <p className="text-[10px] text-[#7D6F77] font-medium">Messages</p>
                <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> ↗ 29% vs last month
                </p>
              </div>

              {/* Stat 4: Opportunities */}
              <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1218]">
                  <Briefcase className="w-3.5 h-3.5 text-[#7A1443]" />
                  <span className="text-base font-extrabold">3</span>
                </div>
                <p className="text-[10px] text-[#7D6F77] font-medium">Opportunities</p>
                <p className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> ↗ 50% vs last month
                </p>
              </div>

            </div>

            {/* Bottom Button */}
            <Link href="/network" className="block pt-1">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#7A1443] bg-white border border-[#E8D1D8] hover:bg-[#FAF7F8] hover:border-[#7A1443]/40 transition text-center shadow-xs"
              >
                View all insights
              </button>
            </Link>
          </div>

        </div>

      </div>


      {/* ── Deterministic Match Score Breakdown Modal ("Why this person?") ── */}
      {selectedMatchForExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white border border-[#F0E3E7] rounded-2xl shadow-2xl p-6 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#F0E3E7] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#1E1218] flex items-center gap-2">
                  Match Explanation: {selectedMatchForExplanation.matched_user?.full_name || "Rahul Sharma"}
                </h3>
                <p className="text-xs text-[#7D6F77]">
                  Evaluated using AgentVerse's 5-part deterministic formula.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchForExplanation(null)}
                className="text-[#7D6F77] hover:text-[#1E1218] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Overall Score Badge */}
            <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#E8D1D8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A0C32]">Total Deterministic Score</span>
              <span className="text-xl font-extrabold text-[#7A1443]">
                {selectedMatchForExplanation.overall_score || 94}%
              </span>
            </div>

            {/* Formula Breakdown Progress Bars */}
            <div className="space-y-3 text-xs">
              
              {/* 30% Career Goal */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1E1218]">Career Goal Similarity (30% max)</span>
                  <span className="text-[#7A1443]">
                    {selectedMatchForExplanation.score_breakdown?.goalScore || 30.0} / 30.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7]">
                  <div
                    className="h-full bg-[#7A1443] rounded-full"
                    style={{ width: `${((selectedMatchForExplanation.score_breakdown?.goalScore || 30) / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* 25% Skills */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1E1218]">Skill Similarity (25% max)</span>
                  <span className="text-[#7A1443]">
                    {selectedMatchForExplanation.score_breakdown?.skillScore || 22.5} / 25.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7]">
                  <div
                    className="h-full bg-[#7A1443] rounded-full"
                    style={{ width: `${((selectedMatchForExplanation.score_breakdown?.skillScore || 22.5) / 25) * 100}%` }}
                  />
                </div>
              </div>

              {/* 20% Education */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1E1218]">Education Connection (20% max)</span>
                  <span className="text-[#7A1443]">
                    {selectedMatchForExplanation.score_breakdown?.educationScore || 18.0} / 20.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7]">
                  <div
                    className="h-full bg-[#7A1443] rounded-full"
                    style={{ width: `${((selectedMatchForExplanation.score_breakdown?.educationScore || 18) / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* 15% Industry / Role */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1E1218]">Industry / Role Relevance (15% max)</span>
                  <span className="text-[#7A1443]">
                    {selectedMatchForExplanation.score_breakdown?.industryScore || 14.5} / 15.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7]">
                  <div
                    className="h-full bg-[#7A1443] rounded-full"
                    style={{ width: `${((selectedMatchForExplanation.score_breakdown?.industryScore || 14.5) / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* 10% Experience */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1E1218]">Experience Relevance (10% max)</span>
                  <span className="text-[#7A1443]">
                    {selectedMatchForExplanation.score_breakdown?.experienceScore || 9.0} / 10.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0E3E7]">
                  <div
                    className="h-full bg-[#7A1443] rounded-full"
                    style={{ width: `${((selectedMatchForExplanation.score_breakdown?.experienceScore || 9) / 10) * 100}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Reasons List */}
            {selectedMatchForExplanation.score_breakdown?.reasons && (
              <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                <span className="text-[11px] font-bold text-[#5A0C32]">Matching Reasons:</span>
                <ul className="text-xs text-[#7D6F77] list-disc list-inside space-y-0.5">
                  {selectedMatchForExplanation.score_breakdown.reasons.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedMatchForExplanation(null)}
                className="w-full py-2 rounded-xl bg-[#7A1443] hover:bg-[#5A0C32] text-white text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Agent Trace Modal ── */}
      {agentSession && (
        <AgentTraceModal
          session={agentSession}
          isOpen={isTraceModalOpen}
          onClose={() => setIsTraceModalOpen(false)}
        />
      )}

    </div>
  );
}

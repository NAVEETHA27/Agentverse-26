"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target, TrendingUp, Users, Briefcase, ChevronRight,
  Sparkles, ArrowRight, MessageSquare, Clock, CheckCircle2,
  Sun, Bookmark, MapPin, Calendar, Bot, Zap, BookOpen,
  Award, FolderGit2, Edit3, GraduationCap, Mail, Phone,
  BarChart2, Rocket, Star, Check, ExternalLink, HelpCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
  const [activeTab, setActiveTab] = useState<"about" | "skills" | "projects" | "certifications" | "goals">("about");
  const readiness = analysis?.career_readiness_score || 72;
  const targetRole = goal?.target_role || "Cloud Engineer";

  // Real or grounded data
  const realAlumni = matches && matches.length > 0
    ? matches.slice(0, 3).map((m) => ({
        id: m.id || m.matched_user?.id || "a1",
        name: m.matched_user?.full_name || "Rahul Sharma",
        role: m.matched_user?.headline || "Cloud Architect @ Google",
        company: m.matched_user?.profile?.current_company || "Google",
        match: m.overall_score || 94,
      }))
    : [
        { id: "a1", name: "Rahul Sharma", role: "Cloud Architect @ Google", company: "Google", match: 94 },
        { id: "a2", name: "Priya Sharma", role: "ML Engineer @ Microsoft", company: "Microsoft", match: 91 },
        { id: "a3", name: "Arjun Reddy", role: "Data Scientist @ NVIDIA", company: "NVIDIA", match: 87 },
      ];

  const opportunitiesList = [
    {
      title: "Cloud & DevOps Engineering Intern",
      company: "Google",
      location: "Remote",
      match: 85,
      type: "Internship",
    },
    {
      title: "AI/ML Systems Intern",
      company: "Microsoft",
      location: "Bangalore",
      match: 78,
      type: "Internship",
    },
  ];

  const recentConnections = [
    { name: "Rahul Sharma", role: "Cloud Architect @ Google" },
    { name: "Ritika Sharma", role: "Data Scientist @ ZS" },
    { name: "Vikram Rao", role: "SDE @ PayPal" },
    { name: "Neha Joshi", role: "Product Manager @ Flipkart" },
    { name: "Sneha Iyer", role: "Software Engineer @ Adobe" },
  ];

  const recentMessages = [
    { name: "Rahul Sharma", text: "Great question regarding Kubernetes architecture! I shared some sample manifests.", time: "1h ago" },
    { name: "Ananya Iyer", text: "Hey Rohan! Let's connect regarding the cloud panel this weekend.", time: "3h ago" },
  ];

  const roadmapSteps = [
    { label: "Foundation", status: "completed" },
    { label: "Build Skills (Docker & Kubernetes)", status: "in_progress" },
    { label: "Experience & Projects", status: "upcoming" },
    { label: "Applications & Referrals", status: "upcoming" },
  ];

  const agentActivityList = agentSession?.actions && agentSession.actions.length > 0
    ? agentSession.actions.slice(0, 4).map((a) => ({
        text: a.action_type || "Agent executed career step",
        time: new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))
    : [
        { text: "Career Agent analyzed target role: Cloud Engineer", time: "10m ago" },
        { text: "Identified skill gaps: Docker, Kubernetes, Terraform", time: "25m ago" },
        { text: "Networking Agent matched top mentor: Rahul Sharma (94%)", time: "1h ago" },
        { text: "Human-in-the-loop action pending your review", time: "2h ago" },
      ];

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? "Good morning" : getHour() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-4">
      {/* ── 1. Hero Profile Banner matching Screenshot 0 & 1 ── */}
      <div
        className="relative overflow-hidden rounded-2xl text-white p-5 lg:p-6"
        style={{
          background: "linear-gradient(135deg, #160309 0%, #2e0618 35%, #4a0c28 70%, #681038 100%)",
          boxShadow: "0 4px 20px rgba(74, 12, 40, 0.25)",
        }}
      >
        {/* Subtle decorative pink curves */}
        <svg className="absolute right-0 top-0 h-full w-[45%] pointer-events-none opacity-40" viewBox="0 0 300 150" fill="none" preserveAspectRatio="xMaxYMid slice">
          <ellipse cx="260" cy="20" rx="140" ry="70" stroke="#e01858" strokeWidth="1.2" />
          <ellipse cx="280" cy="30" rx="110" ry="55" stroke="#f02060" strokeWidth="0.8" />
          <line x1="120" y1="0" x2="300" y2="90" stroke="#ff4080" strokeWidth="0.6" opacity="0.4" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Avatar & Info */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Glowing Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "radial-gradient(circle, rgba(122,20,67,0.85) 0%, #300618 100%)",
                  border: "2px solid rgba(240, 60, 110, 0.6)",
                  boxShadow: "0 0 16px rgba(220, 40, 90, 0.4)",
                }}
              >
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            {/* Profile details */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user.full_name}</h1>
                <Link href="/profile" className="text-rose-200/70 hover:text-white transition">
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-rose-200 font-medium">
                {user.headline || "B.Tech CSE | 3rd Year"} • Student
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-rose-200/80 pt-0.5">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-rose-300" />
                  SRM Institute of Science and Technology
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-300" />
                  {user.location || "Coimbatore, Tamil Nadu"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-300" />
                  Expected Graduation: 2026
                </span>
              </div>

              <p className="text-[11px] text-rose-100/90 leading-relaxed max-w-[560px] pt-1">
                {user.bio || "Passionate about AI, Cloud Engineering, and building real-world solutions. Looking forward to learning, growing, and connecting with industry professionals."}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                {["Python", "Docker & Kubernetes", "Terraform", "AWS & Cloud Services", "React"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-white border border-white/20"
                  >
                    {skill}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-rose-200">+3</span>
              </div>
            </div>
          </div>

          {/* Right Slogan & Action */}
          <div className="flex flex-col items-end justify-between self-stretch gap-4 shrink-0">
            <Link href="/profile">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3 h-3" /> Edit Profile
              </button>
            </Link>

            <div className="hidden xl:block text-right">
              <p className="text-[14px] font-light italic leading-tight text-rose-200/90">Big dreams</p>
              <p className="text-[14px] font-light italic leading-tight text-rose-200/90">Better connections</p>
              <p className="text-[16px] font-bold italic leading-tight text-white">Brighter future</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Stat Counters Row matching Screenshot 0 & 1 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-[#7A1443]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#7D6F77]">Projects</p>
            <p className="text-lg font-black text-[#1E1218]">4</p>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-[#7A1443]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#7D6F77]">Certifications</p>
            <p className="text-lg font-black text-[#1E1218]">2</p>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#7A1443]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#7D6F77]">Skills</p>
            <p className="text-lg font-black text-[#1E1218]">{gaps?.length ? gaps.length + 5 : 12}</p>
          </div>
        </Card>

        <Card className="p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-[#7A1443]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#7D6F77]">Connections</p>
            <p className="text-lg font-black text-[#1E1218]">25</p>
          </div>
        </Card>
      </div>

      {/* ── 3. Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* ── Left Column: Tabs + Tab Content + Goal + Roadmap + Connections ── */}
        <div className="space-y-4 min-w-0">
          {/* Tabs Card */}
          <Card className="p-4 space-y-4">
            {/* Tab navigation headers */}
            <div className="flex items-center gap-1 border-b border-[#F0E3E7] pb-2 overflow-x-auto">
              {[
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "certifications", label: "Certifications" },
                { id: "goals", label: "Career Goals" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#5A0C32] text-white shadow-sm"
                      : "text-[#7D6F77] hover:text-[#1E1218] hover:bg-[#FAF7F8]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: About */}
            {activeTab === "about" && (
              <div className="space-y-4">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5 mb-2.5">
                    <Users className="w-3.5 h-3.5 text-[#7A1443]" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl p-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">Department</p>
                      <p className="text-xs font-bold text-[#1E1218]">Computer Science & Engineering</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">Year</p>
                      <p className="text-xs font-bold text-[#1E1218]">3rd Year</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">CGPA</p>
                      <p className="text-xs font-bold text-[#1E1218]">8.6</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">Email</p>
                      <p className="text-xs font-semibold text-[#1E1218] truncate">{user.email || "rohan.varma@campus.edu"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">Phone</p>
                      <p className="text-xs font-semibold text-[#1E1218]">+91 98765 43210</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-[#7D6F77]">Location</p>
                      <p className="text-xs font-semibold text-[#1E1218]">{user.location || "Coimbatore, Tamil Nadu"}</p>
                    </div>
                  </div>
                </div>

                {/* Career Interests */}
                <div>
                  <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-[#7A1443]" /> Career Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["AI & Machine Learning", "Software Development", "Data Science", "Cloud Computing"].map((item) => (
                      <span key={item} className="px-3 py-1 text-xs font-medium bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Achievements
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#4A3E45]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Won 2nd Place in Inter-College Hackathon (2024)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#4A3E45]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Completed Google Cloud Fundamentals (2024)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#4A3E45]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Active Member - IEEE Student Branch</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5 text-[#7A1443]" /> Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Link href="/network" className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:bg-[#FDF2F5] transition text-center space-y-1 block">
                      <Users className="w-4 h-4 text-[#7A1443] mx-auto" />
                      <p className="text-[11px] font-bold text-[#1E1218]">Connect with Alumni</p>
                    </Link>
                    <Link href="/career" className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:bg-[#FDF2F5] transition text-center space-y-1 block">
                      <Target className="w-4 h-4 text-[#7A1443] mx-auto" />
                      <p className="text-[11px] font-bold text-[#1E1218]">View Career Roadmap</p>
                    </Link>
                    <Link href="/opportunities" className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:bg-[#FDF2F5] transition text-center space-y-1 block">
                      <Briefcase className="w-4 h-4 text-[#7A1443] mx-auto" />
                      <p className="text-[11px] font-bold text-[#1E1218]">Explore Jobs</p>
                    </Link>
                    <Link href="/career" className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:bg-[#FDF2F5] transition text-center space-y-1 block">
                      <Bot className="w-4 h-4 text-[#7A1443] mx-auto" />
                      <p className="text-[11px] font-bold text-[#1E1218]">Ask AI Assistant</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Skills */}
            {activeTab === "skills" && (
              <div className="space-y-3">
                <p className="text-xs text-[#7D6F77]">Verified profile skills and target learning areas for {targetRole}:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl p-3 space-y-2">
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Existing Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Python", "HTML/CSS/JS", "React", "Basic Linux", "Problem Solving"].map((s) => (
                        <span key={s} className="text-xs bg-white border border-[#F0E3E7] text-[#1E1218] px-2.5 py-1 rounded-lg font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl p-3 space-y-2">
                    <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Target Skill Gaps
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Docker & Kubernetes", "Terraform", "AWS & Cloud Services", "CI/CD", "System Design"].map((s) => (
                        <span key={s} className="text-xs bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] px-2.5 py-1 rounded-lg font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {activeTab === "projects" && (
              <div className="space-y-2.5">
                {[
                  { title: "AI Cloud-Native Resume Screener", desc: "Dockerized NLP tool with microservice pipeline on AWS ECS.", tech: "Python • Docker • AWS" },
                  { title: "Microservices Cluster with Terraform", desc: "Automated provisioning of VPC, Kubernetes cluster, and monitoring stack.", tech: "Terraform • Kubernetes" },
                ].map((p) => (
                  <div key={p.title} className="p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1E1218]">{p.title}</p>
                      <p className="text-[11px] text-[#7D6F77]">{p.desc}</p>
                      <span className="text-[10px] font-mono text-[#7A1443]">{p.tech}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#7D6F77]" />
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Certifications */}
            {activeTab === "certifications" && (
              <div className="space-y-2">
                {[
                  { name: "Google Cloud Fundamentals", org: "Google Cloud", date: "2024" },
                  { name: "Deep Learning Specialization", org: "Coursera", date: "2023" },
                ].map((c) => (
                  <div key={c.name} className="p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1E1218]">{c.name}</p>
                      <p className="text-[11px] text-[#7D6F77]">{c.org} • Issued {c.date}</p>
                    </div>
                    <Badge variant="emerald">Verified</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Career Goals */}
            {activeTab === "goals" && (
              <div className="p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1218]">Primary Target Role</span>
                  <Badge variant="wine">{targetRole}</Badge>
                </div>
                <p className="text-xs text-[#4A3E45]">
                  Targeting an associate or entry-level Cloud Engineering position. Actively closing gaps in containerization, orchestration, and infrastructure-as-code.
                </p>
                <Link href="/career" className="text-xs text-[#7A1443] font-bold flex items-center gap-1 hover:underline">
                  Update Goal in AI Career Coach <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </Card>

          {/* Current Career Goal card + Skill Gap summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Career Goal */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">Current Career Goal</p>
                <Link href="/career" className="text-[11px] text-[#7A1443] font-bold hover:underline">Edit</Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-[#7A1443]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E1218] leading-tight">I want to become a Cloud Engineer</p>
                  <p className="text-[10px] text-[#7D6F77] mt-0.5">Target: Entry Level / Associate</p>
                </div>
              </div>
            </Card>

            {/* Skill Gaps */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">Skill Gap Summary</p>
                <Link href="/career" className="text-[11px] text-[#7A1443] font-bold hover:underline">View All</Link>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {["Docker & Kubernetes", "Terraform", "AWS & Cloud", "CI/CD"].map((gap) => (
                  <span key={gap} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB]">
                    {gap}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Career Roadmap Preview */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">Career Roadmap Preview</p>
              <Link href="/career" className="text-[11px] text-[#7A1443] font-bold hover:underline flex items-center gap-0.5">
                View Full Roadmap <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roadmapSteps.map((step, idx) => (
                <div key={step.label} className="p-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7D6F77]">Step {idx + 1}</span>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#1E1218] leading-tight line-clamp-2">{step.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Connections & Messages & Agent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recent Connections */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">Recent Connections</p>
                <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">View Network</Link>
              </div>
              <div className="space-y-2">
                {recentConnections.slice(0, 3).map((conn) => (
                  <div key={conn.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-[10px] font-bold">
                        {conn.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1E1218] leading-none">{conn.name}</p>
                        <p className="text-[10px] text-[#7D6F77]">{conn.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Agent Activity Trace */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6F77]">Agent Activity</p>
                <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">Trace</Link>
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

        {/* ── Right Rail matching Screenshot 0 & 1 ── */}
        <div className="space-y-4">
          {/* Your Career Progress Card (Donut + Breakdown) */}
          <Card className="p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1E1218] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#7A1443]" /> Your Career Progress
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Circular SVG Donut */}
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
                  <span className="text-[8px] font-semibold text-[#7D6F77] leading-none text-center">Career<br/>Readiness</span>
                </div>
              </div>

              {/* Breakdown list */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7D6F77] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A1443]" /> Skills
                  </span>
                  <span className="font-bold text-[#1E1218]">60%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7D6F77] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A1443]" /> Projects
                  </span>
                  <span className="font-bold text-[#1E1218]">40%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7D6F77] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A1443]" /> Experience
                  </span>
                  <span className="font-bold text-[#1E1218]">30%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7D6F77] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A1443]" /> Certifications
                  </span>
                  <span className="font-bold text-[#1E1218]">20%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommended Alumni matching Screenshot 0 & 1 */}
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
              {realAlumni.map((alum) => (
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
                      <p className="text-xs font-bold text-[#1E1218] truncate group-hover:text-[#7A1443]">{alum.name}</p>
                      <p className="text-[10px] text-[#7D6F77] truncate">{alum.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {alum.match}% Match
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#B0A0B0] group-hover:text-[#7A1443]" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Latest Opportunities matching Screenshot 0 & 1 */}
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
                      <p className="text-xs font-bold text-[#1E1218] truncate group-hover:text-[#7A1443]">{opp.title}</p>
                      <p className="text-[10px] text-[#7D6F77]">{opp.company} • {opp.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    Match: {opp.match}%
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

          {/* Rocket Bottom Banner matching Screenshot 0 & 1 */}
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, Briefcase, Award, Code, MapPin,
  Calendar, CheckCircle2, ExternalLink, Target, FolderGit2,
  Sparkles, AlertCircle, Users, ShieldCheck, Edit3,
  Camera, ArrowRight, Bot, Mail, Phone,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type {
  UserRow,
  ProfileRow,
  EducationRow,
  UserSkillWithDetails,
  CareerGoalRow,
  CareerAnalysisRow,
  SkillGapWithDetails,
  EnrichedMatchResult,
  AgentSessionWithActions,
} from "@/lib/database";

// ─── Props ───────────────────────────────────────────────────────────────────

interface ProfileViewProps {
  user: UserRow;
  profile: ProfileRow | null;
  education: EducationRow[];
  skills: UserSkillWithDetails[];
  goal: CareerGoalRow | null;
  analysis?: CareerAnalysisRow | null;
  gaps?: SkillGapWithDetails[];
  matches?: EnrichedMatchResult[];
  agentSession?: AgentSessionWithActions;
}

// ─── Tab types ───────────────────────────────────────────────────────────────

type TabId = "about" | "skills" | "experience" | "projects" | "certifications" | "goals";

// ─── Component ───────────────────────────────────────────────────────────────

export function ProfileView({
  user,
  profile,
  education,
  skills,
  goal,
  analysis,
  gaps,
  matches,
  agentSession,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [hoveredAlum, setHoveredAlum] = useState<string | null>(null);

  // ── Derived data ────────────────────────────────────────────────────────

  const readiness = analysis?.career_readiness_score ?? 68;
  const targetRole = goal?.target_role ?? "Cloud Engineer";

  const existingSkills =
    skills.length > 0
      ? skills.map((s) => s.skill?.name ?? (s as any).skill_name ?? "Skill")
      : ["Python", "HTML/CSS/JS", "React", "Basic Linux", "Java", "SQL"];

  const skillGaps =
    gaps && gaps.length > 0
      ? gaps.slice(0, 5).map((g) => g.skill?.name ?? (g as any).skill_name ?? "Skill")
      : ["Docker & Kubernetes", "Terraform", "AWS & Cloud", "CI/CD", "System Design"];

  const recommendedAlumni =
    matches && matches.length > 0
      ? matches.slice(0, 3).map((m) => ({
          id: m.matched_user?.id ?? "a1",
          name: m.matched_user?.full_name ?? "Rahul Sharma",
          role: m.matched_user?.headline ?? "Cloud Architect @ AWS",
          match: Math.round(m.overall_score ?? 94),
          why: m.explanation ?? "Strong alignment in Cloud Engineering career path and skills.",
        }))
      : [
          { id: "a1", name: "Rahul Sharma", role: "Cloud Architect @ AWS", match: 94, why: "Strong alignment in Cloud Engineering career path and shared skills in AWS, Docker, and Kubernetes." },
          { id: "a2", name: "Priya Sharma", role: "ML Engineer @ Microsoft", match: 91, why: "Overlapping AI/ML interests and similar educational background at SRM." },
          { id: "a3", name: "Arjun Reddy", role: "Data Scientist @ NVIDIA", match: 87, why: "Relevant Python and data science experience that aligns with your career goals." },
        ];

  // ── Static data ─────────────────────────────────────────────────────────

  const projects = [
    { title: "AI Cloud-Native Resume Screener", desc: "Dockerized NLP tool with microservice pipeline on AWS ECS.", tech: ["Python", "Docker", "AWS"], link: "#" },
    { title: "Microservices Cluster with Terraform", desc: "Automated provisioning of VPC, Kubernetes cluster, and monitoring stack.", tech: ["Terraform", "Kubernetes", "AWS"], link: "#" },
    { title: "HealthCare Chatbot", desc: "Conversational chatbot for healthcare support using React and OpenAI API.", tech: ["React", "OpenAI", "Node.js"], link: "#" },
  ];

  const certs = [
    { name: "Google Cloud Fundamentals", org: "Google Cloud", date: "2024", icon: "☁️" },
    { name: "Deep Learning Specialization", org: "Coursera", date: "2023", icon: "🧠" },
    { name: "Python for Everybody", org: "Coursera", date: "2023", icon: "🐍" },
  ];

  const hackathons = [
    "Smart India Hackathon 2023",
    "HackFest 2024 – Finalist",
    "#JynBash 2023",
  ];

  const experiences = [
    { role: "AI/ML Intern", company: "CodeSoft", period: "May 2024 – Jul 2024", desc: "Worked on prediction models and data preprocessing pipelines using Python and Scikit-learn." },
    { role: "Web Developer Intern", company: "TechnoHacks", period: "Dec 2023 – Feb 2024", desc: "Built responsive web applications using React and Node.js in an agile team environment." },
  ];

  const tabs: { id: TabId; label: string }[] = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certs" },
    { id: "goals", label: "Goals" },
  ];

  // ── Donut helpers ────────────────────────────────────────────────────────

  const donutR = 30;
  const donutCirc = 2 * Math.PI * donutR;
  const donutFill = (readiness / 100) * donutCirc;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl text-white"
        style={{ background: "linear-gradient(135deg, #160309 0%, #2e0618 40%, #4a0c28 75%, #6b1038 100%)" }}
      >
        {/* Decorative SVG curves */}
        <svg
          className="absolute right-0 top-0 h-full w-1/2 pointer-events-none opacity-25"
          viewBox="0 0 400 200"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
        >
          <ellipse cx="350" cy="30" rx="180" ry="90" stroke="#e01858" strokeWidth="1.5" />
          <ellipse cx="380" cy="60" rx="140" ry="70" stroke="#f02060" strokeWidth="1" />
          <circle cx="320" cy="160" r="60" stroke="#c01040" strokeWidth="0.8" />
          <path d="M200 0 Q280 60 400 40" stroke="#ff4080" strokeWidth="0.8" />
        </svg>

        <div className="relative z-10 p-5 lg:p-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white/20">
                {user.full_name.charAt(0)}
              </div>
              <button
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                aria-label="Change photo"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white tracking-tight">{user.full_name}</h1>
                <span title="Verified profile"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /></span>
              </div>
              <p className="text-sm font-semibold text-rose-200">
                {user.headline ?? "B.Tech CSE (AI&ML) @ SRM IST | Aspiring Cloud Engineer"}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-rose-200/80">
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />SRM Institute of Science &amp; Technology</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user.location ?? "Chennai, India"}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Graduating 2026</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {["Python", "Docker", "AWS", "React", "Terraform"].map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 border border-white/20 text-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Own-profile actions only */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link href="/settings">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition w-full">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </Link>
              <Link href="/career">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-rose-200 text-xs font-semibold transition w-full">
                  <Bot className="w-3.5 h-3.5" /> Career Agent
                </button>
              </Link>
              <Link href="/network">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-rose-200 text-xs font-semibold transition w-full">
                  <Users className="w-3.5 h-3.5" /> Find Mentors
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT COUNTERS ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Projects", value: "4", icon: FolderGit2, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
          { label: "Certifications", value: "3", icon: Award, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Skills", value: String(existingSkills.length), icon: Code, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Connections", value: "25", icon: Users, color: "text-[#7A1443]", bg: "bg-[#FDF2F5] border-[#F4CEDB]" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow cursor-default">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#7D6F77] tracking-wider">{label}</p>
              <p className="text-2xl font-black text-[#1E1218] leading-none mt-0.5">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">

        {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <Card className="overflow-hidden p-0">
            {/* Tab bar */}
            <div className="flex items-center gap-0 border-b border-[#F0E3E7] px-3 pt-3 overflow-x-auto bg-[#FDFAFC]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg transition-all shrink-0 border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "bg-white text-[#5A0C32] border-[#7A1443] shadow-sm"
                      : "text-[#7D6F77] border-transparent hover:text-[#1E1218] hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content — capped ~300px via max-h + overflow-y-auto */}
            <div className="p-4 max-h-[300px] overflow-y-auto">

              {/* ABOUT — bio + interests + 3 quick actions only */}
              {activeTab === "about" && (
                <div className="space-y-4">
                  <p className="text-sm text-[#4A3E45] leading-relaxed">
                    {user.bio ?? "Enthusiastic CSE undergraduate specializing in AI & ML, passionate about cloud infrastructure and intelligent systems. Actively bridging the gap between AI research and production cloud engineering."}
                  </p>
                  <div>
                    <p className="text-[10px] font-bold text-[#7D6F77] uppercase tracking-wider mb-2">Career Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["AI & Machine Learning", "Cloud Computing", "DevOps", "Data Science"].map((item) => (
                        <span key={item} className="px-2.5 py-1 text-xs font-semibold bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full hover:bg-[#F4CEDB] transition cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/network">
                      <Button size="sm" variant="secondary"><Users className="w-3.5 h-3.5" /> Find Alumni</Button>
                    </Link>
                    <Link href="/career">
                      <Button size="sm" variant="secondary"><Target className="w-3.5 h-3.5" /> Roadmap</Button>
                    </Link>
                    <Link href="/opportunities">
                      <Button size="sm" variant="secondary"><Briefcase className="w-3.5 h-3.5" /> Explore Jobs</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* SKILLS — two-column: existing (green) + gaps (red) */}
              {activeTab === "skills" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Current Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {existingSkills.map((s) => (
                          <span key={s} className="text-[11px] bg-white border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Skill Gaps
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillGaps.map((s) => (
                          <span key={s} className="text-[11px] bg-white border border-rose-100 text-rose-700 px-2 py-0.5 rounded-lg font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    {skillGaps.length} gaps identified for <strong>{targetRole}</strong>.
                    <Link href="/career" className="ml-auto font-bold underline hover:no-underline shrink-0">Fix now →</Link>
                  </div>
                </div>
              )}

              {/* EXPERIENCE — 2 compact cards */}
              {activeTab === "experience" && (
                <div className="space-y-2.5">
                  {experiences.map((exp, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] hover:shadow-sm transition">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {exp.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-xs font-bold text-[#1E1218]">{exp.role}</p>
                            <p className="text-[11px] text-[#7A1443] font-semibold">{exp.company}</p>
                          </div>
                          <span className="text-[10px] text-[#7D6F77] bg-white border border-[#F0E3E7] px-2 py-0.5 rounded-full font-medium shrink-0">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7D6F77] mt-1 leading-relaxed">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROJECTS — 3 compact cards */}
              {activeTab === "projects" && (
                <div className="space-y-2.5">
                  {projects.map((p) => (
                    <div key={p.title} className="p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] hover:shadow-sm transition group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1E1218] group-hover:text-[#7A1443] transition truncate">{p.title}</p>
                          <p className="text-[11px] text-[#7D6F77] mt-0.5 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.tech.map((t) => (
                              <span key={t} className="text-[10px] font-mono font-semibold bg-white border border-[#F0E3E7] text-[#7A1443] px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <a href={p.link} className="p-1.5 rounded-lg bg-white border border-[#F0E3E7] hover:border-[#F4CEDB] text-[#7D6F77] hover:text-[#7A1443] transition shrink-0" aria-label="View project">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATIONS — 3 certs + 3 hackathons */}
              {activeTab === "certifications" && (
                <div className="space-y-2.5">
                  {certs.map((c) => (
                    <div key={c.name} className="flex items-center gap-3 p-3 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] hover:shadow-sm transition">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#F0E3E7] flex items-center justify-center text-lg shrink-0 shadow-sm">
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1E1218]">{c.name}</p>
                        <p className="text-[11px] text-[#7D6F77]">{c.org} · {c.date}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">✓ Verified</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-[#7D6F77] uppercase tracking-wider mb-2">Hackathons</p>
                    <div className="space-y-1.5">
                      {hackathons.map((h) => (
                        <div key={h} className="flex items-center gap-2 p-2.5 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] transition text-[11px] font-semibold text-[#4A3E45]">
                          <span className="text-rose-500">⚡</span> {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GOALS — target role card + 4-step roadmap grid */}
              {activeTab === "goals" && (
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-br from-[#FDF2F5] to-white border border-[#F4CEDB] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-[#7D6F77] uppercase tracking-wider">Primary Target Role</p>
                      <Link href="/career" className="text-[10px] text-[#7A1443] font-bold hover:underline">Edit →</Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#7A1443] flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1E1218]">{targetRole}</p>
                        <p className="text-[11px] text-[#7D6F77]">Entry Level · Full-time · {readiness}% ready</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-[#7D6F77] uppercase tracking-wider">Career Roadmap</p>
                      <Link href="/career" className="text-[10px] text-[#7A1443] font-bold hover:underline">Full view →</Link>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Foundation", status: "completed" },
                        { label: "Build Skills", status: "in_progress" },
                        { label: "Experience", status: "upcoming" },
                        { label: "Apply", status: "upcoming" },
                      ].map((step, i) => (
                        <div
                          key={step.label}
                          className={`p-2.5 rounded-xl border text-center space-y-1 ${
                            step.status === "completed" ? "bg-emerald-50 border-emerald-100" :
                            step.status === "in_progress" ? "bg-amber-50 border-amber-100" :
                            "bg-[#FAF7F8] border-[#F0E3E7]"
                          }`}
                        >
                          <div className="text-sm">
                            {step.status === "completed" ? "✅" : step.status === "in_progress" ? "🔄" : "⏳"}
                          </div>
                          <p className="text-[10px] font-bold text-[#1E1218]">Step {i + 1}</p>
                          <p className="text-[9px] text-[#7D6F77] leading-tight">{step.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </Card>

        </div>

        {/* ── RIGHT RAIL ──────────────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* 1. AI Profile Insights */}
          <Card className="p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#1E1218] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A1443]" /> AI Profile Insights
            </h3>
            {/* Donut + readiness */}
            <div className="flex items-center gap-4">
              <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${readiness}% career readiness`}>
                <circle cx="36" cy="36" r={donutR} fill="none" stroke="#F0E3E7" strokeWidth="8" />
                <circle
                  cx="36" cy="36" r={donutR}
                  fill="none"
                  stroke="#7A1443"
                  strokeWidth="8"
                  strokeDasharray={`${donutFill} ${donutCirc - donutFill}`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                />
                <text x="36" y="39" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1E1218">{readiness}%</text>
              </svg>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-[#1E1218]">Career Readiness</p>
                <p className="text-[11px] text-[#7D6F77] leading-relaxed">
                  {readiness >= 70 ? "Strong foundation — focus on closing cloud gaps." : "Build cloud skills to accelerate your readiness."}
                </p>
              </div>
            </div>
            {/* Bullet insights */}
            <ul className="space-y-1.5">
              {[
                { text: "Python & React are strong portfolio signals", positive: true },
                { text: "Docker/Kubernetes gap is critical to close", positive: false },
                { text: "Internship experience boosts credibility", positive: true },
                { text: "Add 2 cloud projects to strengthen profile", positive: false },
              ].map(({ text, positive }) => (
                <li key={text} className="flex items-start gap-2 text-[11px] text-[#4A3E45]">
                  <span className={`mt-0.5 shrink-0 ${positive ? "text-emerald-500" : "text-amber-500"}`}>
                    {positive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            {/* Top career matches */}
            <div>
              <p className="text-[10px] font-bold text-[#7D6F77] uppercase tracking-wider mb-1.5">Top Career Matches</p>
              <div className="flex flex-wrap gap-1.5">
                {["AI Engineer", "ML Engineer", "Data Scientist"].map((r) => (
                  <Badge key={r} variant="rose" size="sm">{r}</Badge>
                ))}
              </div>
            </div>
          </Card>



        </div>
        {/* ── END RIGHT RAIL ──────────────────────────────────────────── */}

      </div>

      {/* ── FULL WIDTH ROW: Alumni + Opportunities side by side ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Recommended Alumni */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E1218] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7A1443]" /> Recommended Alumni
            </h3>
            <Link href="/network" className="text-[11px] text-[#7A1443] font-bold hover:underline">View All →</Link>
          </div>
          <div className="space-y-2">
            {recommendedAlumni.map((alum) => (
              <div key={alum.id} className="relative">
                <div
                  className="flex items-center gap-3 p-2.5 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] hover:bg-[#FDF2F5] transition cursor-pointer"
                  onMouseEnter={() => setHoveredAlum(alum.id)}
                  onMouseLeave={() => setHoveredAlum(null)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {alum.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E1218] truncate">{alum.name}</p>
                    <p className="text-[11px] text-[#7D6F77] truncate">{alum.role}</p>
                  </div>
                  <Badge variant="rose" size="sm">{alum.match}%</Badge>
                </div>
                {hoveredAlum === alum.id && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-[#1E1218] text-white text-[11px] rounded-xl px-3 py-2 shadow-xl leading-relaxed pointer-events-none">
                    <span className="font-bold text-rose-300">Why matched: </span>{alum.why}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Opportunities */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1E1218] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#7A1443]" /> Opportunities
            </h3>
            <Link href="/opportunities" className="text-[11px] text-[#7A1443] font-bold hover:underline">Browse All →</Link>
          </div>
          <div className="space-y-2">
            {[
              { title: "Cloud & DevOps Engineering Intern", company: "Google", location: "Remote", match: 85 },
              { title: "AI/ML Systems Intern", company: "Microsoft", location: "Bangalore", match: 78 },
            ].map((opp) => (
              <div key={opp.title} className="flex items-center gap-3 p-2.5 bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl hover:border-[#F4CEDB] hover:shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {opp.company.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1E1218] leading-snug truncate">{opp.title}</p>
                  <p className="text-[11px] text-[#7D6F77]">{opp.company} · {opp.location}</p>
                </div>
                <Badge variant="emerald" size="sm" className="shrink-0">{opp.match}%</Badge>
              </div>
            ))}
          </div>
        </Card>

      </div>
      {/* ── END MAIN LAYOUT ─────────────────────────────────────────────── */}

    </div>
  );
}

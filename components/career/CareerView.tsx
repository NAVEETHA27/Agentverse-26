"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Check,
  ArrowRight,
  ChevronRight,
  Cloud,
  User,
  GraduationCap,
  Target,
  Star,
  BarChart2,
  Zap,
  BookOpen,
  Folder,
  Award,
  Search,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { updateRoadmapItemStatus } from "@/lib/database/career";
import type {
  CareerGoalRow,
  CareerAnalysisRow,
  SkillGapWithDetails,
  RoadmapWithItems,
  RoadmapItemRow,
} from "@/lib/database";

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
  const [items, setItems] = useState<RoadmapItemRow[]>(
    initialRoadmap?.items || []
  );
  const [targetRole, setTargetRole] = useState(
    goal?.target_role || "I want to become a Cloud Engineer"
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(targetRole);

  const completedCount = items.filter((i) => i.status === "completed").length;
  const readiness = analysis?.career_readiness_score || 72;

  const handleSaveGoal = () => {
    setTargetRole(goalInput);
    setIsEditingGoal(false);
  };

  const toggleItemStatus = async (item: RoadmapItemRow) => {
    const nextStatus: "completed" | "in_progress" =
      item.status === "completed" ? "in_progress" : "completed";
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
    );
    await updateRoadmapItemStatus(item.id, nextStatus);
  };

  // Static data matching screenshot
  const existingSkills = ["Python", "HTML/CSS/JS", "C/C++", "Basic Linux", "Problem Solving"];
  const missingSkills = ["AWS & Cloud Services", "Docker & Kubernetes", "Terraform", "System Design"];
  const prioritySkills = [
    { name: "AWS & Cloud Services", level: "High" },
    { name: "Docker & Kubernetes", level: "High" },
    { name: "CI/CD", level: "Medium" },
  ];

  const roadmapSteps = [
    {
      number: 1,
      phase: "Foundation",
      duration: "0 – 3 Months",
      items: ["Learn AWS Cloud Basics", "Understand Linux & Shell Scripting", "Build Simple Cloud Project"],
      projects: 3,
      courses: 2,
      certifications: 1,
    },
    {
      number: 2,
      phase: "Build Skills",
      duration: "3 – 6 Months",
      items: ["Docker & Kubernetes Basics", "CI/CD with GitHub Actions", "Cloud Projects (Deployed)"],
      projects: 3,
      courses: 3,
      certifications: 1,
    },
    {
      number: 3,
      phase: "Get Job Ready",
      duration: "6 – 12 Months",
      items: ["System Design Basics", "Resume & LinkedIn Optimization", "Interview Preparation"],
      projects: 3,
      courses: 3,
      certifications: 1,
    },
  ];

  const targetRoles = [
    { title: "Cloud Engineer", salary: "₹9 – 12 LPA", match: 85 },
    { title: "DevOps Engineer", salary: "₹7 – 14 LPA", match: 77 },
    { title: "Backend Developer", salary: "₹9 – 10 LPA", match: 78 },
  ];

  const quickActions = [
    { label: "Explore Courses", icon: BookOpen },
    { label: "Browse Projects", icon: Folder },
    { label: "Find Certifications", icon: Award },
    { label: "View Job Openings", icon: Briefcase },
    { label: "Ask AI Assistant", icon: MessageSquare },
  ];

  return (
    <div className="space-y-3">
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-2xl text-white flex items-center justify-between min-h-[120px]"
        style={{
          background: "linear-gradient(110deg, #1a0410 0%, #3b0920 35%, #5c0c30 55%, #7a1040 70%, #6b0d38 80%, #4a0826 100%)",
        }}
      >
        {/* Pink/magenta glowing streaks on the right — exactly like screenshot */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large bright magenta arc top-right */}
          <svg className="absolute right-0 top-0 h-full w-[55%]" viewBox="0 0 400 140" fill="none" preserveAspectRatio="xMaxYMid slice">
            <ellipse cx="340" cy="10" rx="180" ry="90" fill="none" stroke="#e0185a" strokeWidth="1.5" opacity="0.55" />
            <ellipse cx="360" cy="20" rx="150" ry="75" fill="none" stroke="#f02060" strokeWidth="1" opacity="0.4" />
            <ellipse cx="380" cy="-10" rx="200" ry="110" fill="none" stroke="#c0104a" strokeWidth="0.8" opacity="0.3" />
            {/* glowing diagonal streaks */}
            <line x1="200" y1="0" x2="400" y2="80" stroke="#e8306a" strokeWidth="0.8" opacity="0.35" />
            <line x1="220" y1="0" x2="400" y2="100" stroke="#ff4080" strokeWidth="0.5" opacity="0.25" />
            <line x1="250" y1="0" x2="400" y2="120" stroke="#d01855" strokeWidth="0.6" opacity="0.2" />
            {/* bright pink center glow */}
            <ellipse cx="320" cy="70" rx="90" ry="50" fill="#c01848" opacity="0.18" />
            <ellipse cx="360" cy="60" rx="60" ry="35" fill="#e82060" opacity="0.12" />
          </svg>
          {/* subtle overall pink shimmer on right half */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2"
            style={{ background: "radial-gradient(ellipse at 85% 40%, rgba(200,20,70,0.22) 0%, transparent 70%)" }} />
        </div>

        <div className="flex items-center gap-5 relative z-10 px-6 py-5">
          {/* Brain icon circle with glowing ring */}
          <div className="relative shrink-0">
            <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(180,20,60,0.5) 0%, rgba(100,10,40,0.3) 100%)",
                border: "1.5px solid rgba(230,60,100,0.6)",
                boxShadow: "0 0 18px rgba(200,30,70,0.45), inset 0 0 12px rgba(200,30,70,0.2)",
              }}
            >
              <BrainCircuit className="w-8 h-8 text-rose-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-bold tracking-tight">AI Career</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(220,40,80,0.25)",
                  border: "1px solid rgba(230,60,100,0.45)",
                  color: "#ffb3c8",
                }}
              >
                <Zap className="w-3 h-3" />
                Powered by AI
              </span>
            </div>
            <p className="text-[13px] leading-relaxed max-w-[420px]" style={{ color: "rgba(255,200,215,0.85)" }}>
              Get personalized career guidance, skill gap analysis and actionable steps
              to achieve your dream career.
            </p>
          </div>
        </div>

        {/* Right italic text */}
        <div className="hidden xl:block relative z-10 text-right pr-8 py-5 shrink-0">
          <p className="text-[17px] font-light italic leading-snug" style={{ color: "rgba(255,210,225,0.9)" }}>
            Smarter insights.
          </p>
          <p className="text-[17px] font-light italic leading-snug" style={{ color: "rgba(255,210,225,0.9)" }}>
            Better decisions.
          </p>
          <p className="text-[19px] font-bold italic leading-snug text-white">
            Brighter future.
          </p>
        </div>
      </div>

      {/* ── CAREER GOAL ROW ── */}
      <div className="bg-white rounded-xl border border-[#F0E3E7] px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-[#7A1443]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1E1218]">Career Goal</p>
            <p className="text-[10px] text-[#7D6F77]">Tell us what you want to achieve</p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#FAF7F8] border border-[#F0E3E7] rounded-lg px-3 py-2">
            <Cloud className="w-4 h-4 text-[#7D6F77] shrink-0" />
            {isEditingGoal ? (
              <input
                autoFocus
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 text-xs bg-transparent text-[#1E1218] focus:outline-none"
              />
            ) : (
              <span className="text-xs text-[#1E1218] flex-1">{targetRole}</span>
            )}
            <button
              onClick={() => {
                if (isEditingGoal) handleSaveGoal();
                else { setGoalInput(targetRole); setIsEditingGoal(true); }
              }}
              className="text-[#7D6F77] hover:text-[#5A0C32] transition"
            >
              {isEditingGoal
                ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                : <Edit3 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <Button size="sm" variant="primary" className="shrink-0 rounded-lg">
          <Zap className="w-3 h-3 mr-1" />
          Update Goal
        </Button>
      </div>

      {/* ── MAIN TWO-COLUMN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-3">

          {/* AI Career Analysis */}
          <div className="bg-white rounded-xl border border-[#F0E3E7] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#7A1443]" />
              <h2 className="text-sm font-bold text-[#1E1218]">AI Career Analysis</h2>
              <span className="text-[10px] text-[#7D6F77]">Based on your profile, skills and market trends</span>
            </div>

            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start">
              {/* Current Position */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#7D6F77]">
                  <User className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Current Position</span>
                </div>
                <p className="text-xs font-bold text-[#1E1218] leading-snug">
                  B.E. Computer Science<br />& Engineering
                </p>
                <span className="inline-block text-[10px] font-semibold bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full px-2 py-0.5">
                  Student
                </span>
              </div>

              {/* Target Role */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#7D6F77]">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Target Role</span>
                </div>
                <p className="text-xs font-bold text-[#1E1218]">Cloud Engineer</p>
                <span className="text-[10px] text-[#7D6F77]">(Entry Level / Associate)</span>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#7D6F77]">
                  <Target className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Strengths</span>
                </div>
                <ul className="space-y-0.5 text-[11px] text-[#4A3E45]">
                  <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />Good in Python</li>
                  <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />Problem Solving</li>
                  <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />Basic Web Development</li>
                  <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />Learning Attitude</li>
                </ul>
              </div>

              {/* Readiness Score donut */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="relative w-[72px] h-[72px]">
                  <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r="28" fill="none" stroke="#F0E3E7" strokeWidth="7" />
                    <circle
                      cx="36" cy="36" r="28" fill="none"
                      stroke="#7A1443" strokeWidth="7"
                      strokeDasharray={`${(readiness / 100) * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-black text-[#5A0C32]">{readiness}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-center text-[#7D6F77] leading-tight font-medium">
                  Readiness Score<br />
                  <span className="text-[9px]">Overall preparedness<br />for your target role</span>
                </p>
              </div>
            </div>
          </div>

          {/* Career Roadmap */}
          <div className="bg-white rounded-xl border border-[#F0E3E7] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center">
                  <BarChart2 className="w-3 h-3 text-[#7A1443]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1E1218]">Career Roadmap</h2>
                  <p className="text-[10px] text-[#7D6F77]">Your personalized step-by-step plan</p>
                </div>
              </div>
              <button className="text-[11px] text-[#7A1443] font-semibold flex items-center gap-0.5 hover:underline">
                View Full Roadmap <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-3 gap-3">
              {roadmapSteps.map((step, idx) => (
                <div key={step.number} className="relative">
                  {/* connector arrow */}
                  {idx < roadmapSteps.length - 1 && (
                    <div className="absolute -right-1.5 top-5 z-10">
                      <ArrowRight className="w-3 h-3 text-[#C9A8B8]" />
                    </div>
                  )}
                  <div className="rounded-xl border border-[#F0E3E7] p-3 space-y-2 h-full">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#5A0C32] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {step.number}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold text-[#5A0C32]">Step {step.number} &nbsp;{step.phase}</p>
                        <p className="text-[10px] text-[#7D6F77]">{step.duration}</p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {step.items.map((it) => (
                        <li key={it} className="flex items-start gap-1 text-[11px] text-[#4A3E45]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 pt-1 border-t border-[#F5ECF0] text-[10px] text-[#7D6F77]">
                      <span className="flex items-center gap-0.5"><Folder className="w-2.5 h-2.5" />{step.projects} Projects</span>
                      <span className="flex items-center gap-0.5"><BookOpen className="w-2.5 h-2.5" />{step.courses} Courses</span>
                      <span className="flex items-center gap-0.5"><Award className="w-2.5 h-2.5" />{step.certifications} Certification</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#F0E3E7] p-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-[#F0E3E7]">
              <Zap className="w-4 h-4 text-[#7A1443]" />
              <span className="text-xs font-bold text-[#1E1218]">Quick Actions</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {quickActions.map((qa) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={qa.label}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[#5A4E54] bg-[#FAF7F8] border border-[#F0E3E7] rounded-lg px-2.5 py-1.5 hover:bg-[#FDF2F5] hover:text-[#5A0C32] transition"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#7A1443]" />
                    {qa.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-3">

          {/* Skill Gap */}
          <div className="bg-white rounded-xl border border-[#F0E3E7] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center">
                <Target className="w-3 h-3 text-[#7A1443]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1E1218]">Skill Gap</h2>
                <p className="text-[10px] text-[#7D6F77]">Compare your current skills with what you need</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {/* Existing Skills */}
              <div>
                <p className="font-bold text-emerald-700 mb-1.5">Existing Skills</p>
                <ul className="space-y-1">
                  {existingSkills.map((s) => (
                    <li key={s} className="flex items-center gap-1 text-[#4A3E45]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-[#7D6F77] mt-1.5">5 skills</p>
              </div>
              {/* Missing Skills */}
              <div>
                <p className="font-bold text-rose-600 mb-1.5">Missing Skills</p>
                <ul className="space-y-1">
                  {missingSkills.map((s) => (
                    <li key={s} className="flex items-center gap-1 text-[#4A3E45]">
                      <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-[#7D6F77] mt-1.5">5 skills</p>
              </div>
              {/* Priority */}
              <div>
                <p className="font-bold text-amber-700 mb-1.5">Priority</p>
                <ul className="space-y-1">
                  {prioritySkills.map((s) => (
                    <li key={s.name} className="flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold px-1.5 rounded ${s.level === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                        {s.level}
                      </span>
                      <span className="text-[10px] text-[#4A3E45]">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="mt-2.5 text-[11px] text-[#7A1443] font-semibold flex items-center gap-0.5 hover:underline">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* AI Career Recommendations */}
          <div className="bg-white rounded-xl border border-[#F0E3E7] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#7A1443]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1E1218]">AI Career Recommendations</h2>
                  <p className="text-[10px] text-[#7D6F77]">Roles that match your skills, interests and market demand</p>
                </div>
              </div>
              <button className="text-[11px] text-[#7A1443] font-semibold hover:underline whitespace-nowrap">
                View All Roles →
              </button>
            </div>

            <p className="text-[11px] font-semibold text-[#7D6F77] mb-2">Target Roles</p>

            <div className="space-y-2">
              {targetRoles.map((role) => (
                <div key={role.title} className="flex items-center justify-between rounded-lg bg-[#FAF7F8] border border-[#F0E3E7] px-3 py-2">
                  <div>
                    <p className="text-xs font-bold text-[#1E1218]">{role.title}</p>
                    <p className="text-[10px] text-[#7D6F77]">Avg. Salary: {role.salary}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-bold ${role.match >= 80 ? "text-emerald-600" : "text-[#7A1443]"}`}>
                      {role.match}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Best Action */}
          <div className="rounded-xl bg-gradient-to-r from-[#3D0A24] to-[#5A0C32] p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-rose-300" />
              <span className="text-xs font-bold">Next Best Action</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed mb-3">
              Start the AWS Cloud Practitioner course and build a cloud project to strengthen your profile.
            </p>
            <Button size="sm" variant="secondary" className="w-full justify-between text-[#5A0C32] font-semibold">
              Start Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

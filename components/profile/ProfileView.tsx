"use client";

import React from "react";
import Link from "next/link";
import {
  UserCheck, GraduationCap, Briefcase, Award, Code, MapPin,
  Mail, Calendar, CheckCircle2, ExternalLink, Target, FolderGit2,
  Sparkles, TrendingUp, AlertCircle, Users, ShieldCheck, Edit3,
  Camera, MessageSquare, MoreHorizontal, Plus
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { UserRow, ProfileRow, EducationRow, UserSkillWithDetails, CareerGoalRow } from "@/lib/database";

interface ProfileViewProps {
  user: UserRow;
  profile: ProfileRow | null;
  education: EducationRow[];
  skills: UserSkillWithDetails[];
  goal: CareerGoalRow | null;
}

export function ProfileView({ user, profile, education, skills, goal }: ProfileViewProps) {
  const projects = [
    {
      title: "AI Resume Screener",
      description: "NLP-based resume screening tool using Python and ML models.",
      technologies: ["Python", "NLP", "ML"],
      github: "#",
    },
    {
      title: "HealthCare Chatbot",
      description: "Conversational chatbot for healthcare support using React and OpenAI API.",
      technologies: ["React", "OpenAI", "Node.js"],
      github: "#",
    },
  ];

  const certs = [
    { name: "Machine Learning A-Z (Udemy)", status: "completed" },
    { name: "Deep Learning Specialization (Coursera)", status: "completed" },
    { name: "Python for Everybody (Coursera)", status: "completed" },
  ];

  const achievements = [
    "Dean's List (2023)",
    "Winner – Smart India Hackathon Internal Round (2023)",
    "Top 10% in Coding Contest (CodeChef)",
  ];

  const hackathons = [
    "Smart India Hackathon 2023",
    "HackFest 2024 – Finalist",
    "#JynBash 2023",
  ];

  const topCareerMatches = ["AI Engineer", "ML Engineer", "Data Scientist"];

  const verifications = [
    { label: "Email", verified: true },
    { label: "Mobile", verified: true },
    { label: "Education", verified: true },
    { label: "ID", verified: true },
  ];

  return (
    <div className="flex gap-4">
      {/* ── Left + Center ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm overflow-hidden">
          <div className="flex items-start gap-5 p-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                {user.full_name.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7A1443] flex items-center justify-center border-2 border-white">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1E1218]">{user.full_name}</h1>
                <ShieldCheck className="w-4 h-4 text-[#7A1443]" />
              </div>
              <p className="text-sm font-semibold text-[#7A1443]">{user.headline || "Aspiring AI Engineer"}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#7D6F77]">
                <MapPin className="w-3 h-3" />{user.location || "Chennai, India"}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="primary" size="sm">
                  <Users className="w-3.5 h-3.5 mr-1" /> Connect
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: About + Education + Skills + Projects + Certifications + Achievements + Hackathons + Posts */}
        <div className="grid grid-cols-2 gap-4">
          {/* About */}
          <Card className="p-4 col-span-2 space-y-2">
            <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[#7A1443]" /> About
            </h3>
            <p className="text-xs text-[#4A3E45] leading-relaxed">
              {user.bio || "Enthusiastic and detail-oriented Computer Science undergraduate passionate about AI and Machine Learning. Eager to leverage my skills in building intelligent solutions that solve real-world problems."}
            </p>
          </Card>

          {/* Skills */}
          <Card className="p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-[#7A1443]" /> Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {["Python", "Machine Learning", "React"].map((s) => (
                <span key={s} className="text-xs font-semibold bg-[#5A0C32] text-white rounded-full px-3 py-1">{s}</span>
              ))}
              <button className="w-7 h-7 rounded-full bg-[#FDF2F5] border border-[#F4CEDB] flex items-center justify-center text-[#7A1443]">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Education Journey */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#7A1443]" /> Education Journey
              </h3>
              <button><Edit3 className="w-3.5 h-3.5 text-[#7D6F77]" /></button>
            </div>
            {education.length > 0 ? education.map((edu) => (
              <div key={edu.id} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F8] border border-[#F0E3E7] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#7A1443]" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#1E1218]">SRM Institute of Science and Technology</p>
                  <p className="text-[#7A1443] font-medium">B.Tech, Computer Science and Engineering</p>
                  <p className="text-[#7D6F77]">Field: Artificial Intelligence and Machine Learning</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#7D6F77] mt-0.5">
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> Start Year: {edu.start_year || "2022"}</span>
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> Expected Graduation: {edu.end_year || "2026"}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF7F8] border border-[#F0E3E7] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#7A1443]" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#1E1218]">SRM Institute of Science and Technology</p>
                  <p className="text-[#7A1443] font-medium">B.Tech, Computer Science and Engineering</p>
                  <p className="text-[#7D6F77]">Field: Artificial Intelligence and Machine Learning</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#7D6F77] mt-0.5">
                    <span>Start Year: 2022</span>
                    <span>Expected Graduation: 2026</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Projects */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5 text-[#7A1443]" /> Projects
              </h3>
              <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {projects.map((p) => (
                <div key={p.title} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-4 h-4 text-[#7A1443]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1E1218]">{p.title}</p>
                    <p className="text-[10px] text-[#7D6F77] truncate">{p.description}</p>
                  </div>
                  <a href={p.github} className="text-[#7D6F77] hover:text-[#7A1443]">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </Card>

          {/* Professional Experience */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-[#7A1443]" /> Professional Experience
              </h3>
              <button><Edit3 className="w-3.5 h-3.5 text-[#7D6F77]" /></button>
            </div>
            <div className="space-y-2">
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#1E1218]">AI/ML Intern</p>
                </div>
                <p className="text-[#7A1443]">CodeSoft • May 2024 – Jul 2024</p>
                <p className="text-[#7D6F77]">Worked on prediction models and data preprocessing pipelines using Python and Scikit-learn.</p>
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1E1218]">Web Developer Intern</p>
                <p className="text-[#7A1443]">TechnoHacks • Dec 2023 – Feb 2024</p>
                <p className="text-[#7D6F77]">Built responsive web applications using React and Node.js. Collaborated in agile team environment.</p>
              </div>
            </div>
          </Card>

          {/* Certifications + Achievements + Hackathons row */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#7A1443]" /> Certifications
              </h3>
              <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View All</button>
            </div>
            <ul className="space-y-1">
              {certs.map((c) => (
                <li key={c.name} className="text-[11px] text-[#4A3E45] flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{c.name}
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-4">
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Achievements
                </h3>
                <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View All</button>
              </div>
              <ul className="space-y-1">
                {achievements.map((a) => (
                  <li key={a} className="text-[11px] text-[#4A3E45] flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">★</span>{a}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1E1218] flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-rose-500" /> Hackathons
                </h3>
                <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View All</button>
              </div>
              <ul className="space-y-1">
                {hackathons.map((h) => (
                  <li key={h} className="text-[11px] text-[#4A3E45] flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0">⚡</span>{h}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Posts / Activity */}
          <Card className="col-span-2 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#1E1218]">Posts / Activity</h3>
              <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View All Activity</button>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1E1218]">{user.full_name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-[#7D6F77]">2d ago</p>
                    <button><MoreHorizontal className="w-3.5 h-3.5 text-[#7D6F77]" /></button>
                  </div>
                </div>
                <p className="text-[11px] text-[#4A3E45] mt-1 leading-relaxed">
                  Excited to share that I've completed a project on AI Resume Screener! It was an amazing experience working with NLP and ML models.
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#7D6F77]">
                  <button className="flex items-center gap-1 hover:text-[#7A1443]">👍 24</button>
                  <button className="flex items-center gap-1 hover:text-[#7A1443]">💬 6</button>
                  <button className="flex items-center gap-1 hover:text-[#7A1443]">↗ Share</button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Right: AI Insights + Career Goals + Verification + Mentorship ── */}
      <div className="w-[260px] shrink-0 space-y-4">
        {/* AI Profile Insights */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7A1443]" />
              <p className="text-xs font-bold text-[#1E1218]">AI Profile Insights</p>
            </div>
            <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View Details</button>
          </div>
          {/* Donut */}
          <div className="flex items-center gap-3">
            <div className="relative w-[72px] h-[72px] shrink-0">
              <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                <circle cx="36" cy="36" r="26" fill="none" stroke="#F0E3E7" strokeWidth="8" />
                <circle cx="36" cy="36" r="26" fill="none" stroke="#7A1443" strokeWidth="8"
                  strokeDasharray={`${0.87 * 163.4} 163.4`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[15px] font-black text-[#5A0C32]">87%</span>
                <span className="text-[8px] text-[#7D6F77]">Profile Strength</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-[#4A3E45]">
              <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Strong skills match for AI Engineer roles</p>
              <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Good academic background</p>
              <p className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" />Add more projects to boost visibility</p>
              <p className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" />Engage more in community discussions</p>
            </div>
          </div>
          {/* Top Career Matches */}
          <div>
            <p className="text-[10px] font-bold text-[#7D6F77] mb-1.5">Top Career Matches</p>
            <div className="flex flex-wrap gap-1.5">
              {topCareerMatches.map((m) => (
                <span key={m} className="text-[11px] font-medium bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full px-2.5 py-0.5">{m}</span>
              ))}
              <button className="text-[#7A1443]"><ExternalLink className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        {/* Verification / Trust Signals */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7A1443]" />
            <p className="text-xs font-bold text-[#1E1218]">Verification / Trust Signals</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {verifications.map((v) => (
              <div key={v.label} className="flex items-center gap-1.5 bg-[#FAF7F8] border border-[#F0E3E7] rounded-lg px-2 py-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="text-[10px] font-semibold text-[#4A3E45]">{v.label} Verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Goals */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#7A1443]" />
              <p className="text-xs font-bold text-[#1E1218]">Career Goals</p>
            </div>
            <button><Edit3 className="w-3.5 h-3.5 text-[#7D6F77]" /></button>
          </div>
          <p className="text-[11px] text-[#4A3E45] leading-relaxed">
            {goal?.target_role
              ? `To become a skilled ${goal.target_role} and work on impactful AI solutions.`
              : "To become a skilled AI Engineer and work on impactful AI solutions that improve lives."}
          </p>
        </div>

        {/* Mentorship Preferences */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#7A1443]" />
              <p className="text-xs font-bold text-[#1E1218]">Mentorship Preferences</p>
            </div>
            <div className="w-9 h-5 rounded-full bg-[#7A1443] relative shrink-0">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600">Open to Mentorship</p>
          <p className="text-[10px] text-[#7D6F77]">Looking for guidance in AI, ML, and career growth.</p>
          <div>
            <p className="text-[10px] font-bold text-[#7D6F77] mb-1.5">Preferred Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {["AI/ML", "Deep Learning", "Career Guidance"].map((a) => (
                <span key={a} className="text-[10px] font-medium bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full px-2 py-0.5">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code, 
  MapPin, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Target, 
  FolderGit2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Users,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { 
  UserRow, 
  ProfileRow, 
  EducationRow, 
  UserSkillWithDetails, 
  CareerGoalRow 
} from "@/lib/database";

interface ProfileViewProps {
  user: UserRow;
  profile: ProfileRow | null;
  education: EducationRow[];
  skills: UserSkillWithDetails[];
  goal: CareerGoalRow | null;
}

export function ProfileView({
  user,
  profile,
  education,
  skills,
  goal,
}: ProfileViewProps) {
  const projects = [
    {
      title: "IoT Smart Environmental Telemetry Monitor",
      description: "Embedded telemetry station broadcasting temperature, humidity, and atmospheric telemetry via MQTT protocols and ESP32 microcontrollers to cloud collectors.",
      technologies: ["Python", "ESP32", "MQTT", "C++", "AWS IoT Core"],
      github: "https://github.com/rohan-v/iot-telemetry",
    },
    {
      title: "Automated Linux Socket Traffic Inspector",
      description: "Low-level Linux socket packet sniffing tool inspecting TCP/IP header flags and analyzing anomalous packet transmission intervals.",
      technologies: ["Linux", "Python Sockets", "Bash", "Wireshark"],
      github: "https://github.com/rohan-v/linux-traffic-inspector",
    },
  ];

  const certs = [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issue_date: "In Progress (Target: Q2 2026)",
      status: "in_progress",
    },
    {
      name: "Cisco Networking Fundamentals",
      issuer: "Cisco Networking Academy",
      issue_date: "Issued Nov 2025",
      status: "completed",
    },
    {
      name: "Modern Linux Administration & Shell Scripting",
      issuer: "Coursera / Linux Foundation",
      issue_date: "Issued Aug 2025",
      status: "completed",
    },
  ];

  const targetSkillsToDevelop = [
    { name: "Docker", category: "DevOps / Containers", priority: "High" },
    { name: "Kubernetes", category: "Container Orchestration", priority: "High" },
    { name: "Terraform", category: "Infrastructure as Code", priority: "High" },
    { name: "CI/CD Pipelines (GitHub Actions)", category: "Automation", priority: "Medium" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="glass-panel border-slate-800 relative overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-indigo-900/70 via-purple-950/60 to-sky-900/70 w-full relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        </div>
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-600 border-4 border-slate-900 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                {user.full_name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {user.full_name}
                  </h1>
                  <Badge variant="indigo" size="sm">
                    <ShieldCheck className="w-3 h-3 mr-1 inline text-indigo-300" />
                    Unified Identity
                  </Badge>
                </div>
                <p className="text-xs text-indigo-300 font-medium">
                  @{user.username || "rohan_v"} • {profile?.current_role || "ECE Student & Aspiring Cloud Engineer"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/career">
                <Button size="sm" variant="primary">
                  <Target className="w-3.5 h-3.5 mr-1.5" />
                  Target: {goal?.target_role || "Cloud Engineer"}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <p className="text-sm text-slate-200 font-medium">
              {user.headline || "Final-year Electronics & Communication Engineering student transitioning into Cloud & Infrastructure Engineering."}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {user.bio || "Passionate about Linux systems internals, TCP/IP networking, and distributed cloud computing architectures. Actively building containerized services and looking for mentorship from alumni working across AWS, Microsoft, and Google Cloud."}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {user.location || "Chennai, India"}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined January 2026
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Open to Internship / New Grad Roles
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Education Journey, Projects, Target Skills Gap (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Multi-Education Journey */}
          <Card className="glass-panel border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  Education Journey & Multi-Institution Records
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Unified identity model: Tracks current enrollment, previous alma maters, and ongoing studies
                </p>
              </div>
              <Badge variant="indigo" size="sm">Multi-Record</Badge>
            </div>
            <div className="p-5 space-y-4">
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          ABC College of Technology
                        </h3>
                        <p className="text-xs text-indigo-300 font-medium">
                          {(edu as any).degree || "Bachelor of Technology"} in {edu.field_of_study || "Electronics and Communication Engineering"}
                        </p>
                      </div>
                      <Badge variant={edu.status === "current" ? "emerald" : "default"} size="sm">
                        {edu.status === "current" ? "Currently Enrolled (Senior Year)" : "Graduated"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>
                        {edu.start_year} – {edu.end_year ? edu.end_year : "2026 (Expected)"}
                      </span>
                      <span className="text-slate-300">
                        CGPA: 8.6 / 10.0
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">ABC College of Technology</h3>
                      <p className="text-xs text-indigo-300">B.Tech in Electronics and Communication Engineering</p>
                    </div>
                    <Badge variant="emerald" size="sm">Current Student</Badge>
                  </div>
                  <p className="text-xs text-slate-400">2022 – 2026 (Senior Year)</p>
                </div>
              )}

              {/* Ongoing Graduate / Specialized Study Entry */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1.5 opacity-90">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Cloud Computing Specialization Program
                    </h3>
                    <p className="text-xs text-sky-300">
                      AWS Academy & Linux Foundation Verified Curriculum
                    </p>
                  </div>
                  <Badge variant="purple" size="sm">Concurrent Studies</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  2025 – Present • Focus: Distributed Cloud Infrastructure & Virtualization
                </p>
              </div>
            </div>
          </Card>

          {/* Featured Projects */}
          <Card className="glass-panel border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-sky-400" />
                Academic & Technical Projects
              </h2>
              <span className="text-xs text-slate-400">{projects.length} Repositories</span>
            </div>
            <div className="p-5 space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {proj.title}
                    </h3>
                    <a 
                      href={proj.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                    >
                      <span>Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Target Skills to Develop (Gap Analysis Contrast) */}
          <Card className="glass-panel border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Target Skills Under Development
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Identified by AI Career Agent for Cloud Engineer qualification
                </p>
              </div>
              <Badge variant="amber" size="sm">4 Gaps</Badge>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targetSkillsToDevelop.map((ts) => (
                <div 
                  key={ts.name} 
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{ts.name}</div>
                    <div className="text-[11px] text-slate-400">{ts.category}</div>
                  </div>
                  <Badge variant="purple" size="sm">{ts.priority} Priority</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Insights, Verified Skills, Certifications (1 col) */}
        <div className="space-y-6">
          {/* Profile AI Insights Card */}
          <Card className="glass-panel border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-transparent">
            <div className="p-5 border-b border-indigo-500/20 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Profile AI Insights
              </h2>
              <Badge variant="purple" size="sm">Live Model</Badge>
            </div>
            <div className="p-5 space-y-4">
              {/* Readiness Score */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Career Readiness Index</span>
                  <span className="text-indigo-400 font-mono font-bold text-sm">68%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 rounded-full" style={{ width: "68%" }} />
                </div>
                <p className="text-[11px] text-slate-400">
                  Target Role: <span className="text-white font-medium">{goal?.target_role || "Cloud Engineer"}</span>
                </p>
              </div>

              {/* Career Direction */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Career Direction</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Transitioning from ECE foundation to Cloud Infrastructure & DevOps systems.
                </p>
              </div>

              {/* Top Strengths */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Core Strengths</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Strong grasp of TCP/IP protocols, Linux socket programming, Python automation, and hardware-software interfacing.
                </p>
              </div>

              {/* Highest Priority Gap */}
              <div className="space-y-1">
                <span className="text-[11px] text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Primary Skill Focus
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hands-on Docker containerization & AWS VPC / IAM configuration.
                </p>
              </div>

              {/* Alumni Networking Affinity */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Alumni Mentors Available:
                </span>
                <span className="text-white font-bold">4 Matches</span>
              </div>
            </div>
          </Card>

          {/* Current Verified Skills */}
          <Card className="glass-panel border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Current Verified Skills
              </h2>
              <span className="text-xs text-slate-400 font-mono">{skills.length} skills</span>
            </div>
            <div className="p-5 space-y-2.5">
              {skills.map((us) => (
                <div 
                  key={us.id} 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white">
                      {us.skill?.name || "Skill"}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {us.skill?.category} • {us.proficiency_level}
                    </div>
                  </div>
                  {us.verified ? (
                    <Badge variant="emerald" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">Self-Reported</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications & Courses */}
          <Card className="glass-panel border-slate-800">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications & Badges
              </h2>
              <span className="text-xs text-slate-400 font-mono">{certs.length}</span>
            </div>
            <div className="p-5 space-y-3">
              {certs.map((cert, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{cert.name}</span>
                    {cert.status === "completed" ? (
                      <Badge variant="emerald" size="sm">Active</Badge>
                    ) : (
                      <Badge variant="amber" size="sm">Pursuing</Badge>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px]">{cert.issuer}</div>
                  <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                    {cert.issue_date}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

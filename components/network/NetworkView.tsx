"use client";

import React, { useState } from "react";
import {
  Sparkles, Search, CheckCircle2, Building2, GraduationCap,
  Send, MessageSquare, ChevronDown, Users, TrendingUp, ExternalLink,
  Info, Filter, RotateCcw, LayoutGrid, List, Heart, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { sendConnectionRequest } from "@/lib/database/connections";
import type { EnrichedMatchResult, ConnectionWithPartner, AgentSessionWithActions } from "@/lib/database";

interface NetworkViewProps {
  initialMatches: EnrichedMatchResult[];
  initialConnections: ConnectionWithPartner[];
  agentSession: AgentSessionWithActions;
  searchScope?: string;
  scopeMessage?: string | null;
  levelCounts?: { institution: number; broader_alumni: number; industry_network: number };
}

const DEMO_ALUMNI_MATCHES = [
  {
    id: "m1",
    name: "Riya Malhotra",
    verified: true,
    role: "Product Manager",
    company: "Google",
    location: "Bengaluru, India",
    school: "B.Tech CSE '16",
    exp: "8 Yrs Exp",
    match: 94,
    avatarColor: "from-[#5A0C32] to-[#7A1443]",
    initials: "RM",
    why: "Riya follows a similar career path in product management and has experience in scalable customer products.",
    skills: ["Product Strategy", "Roadmapping", "Agile", "SQL", "A/B Testing"],
    careerSimilarity: 92,
    eduConnection: "Same College",
    eduDegree: "B.Tech CSE",
    experience: [
      {
        role: "Product Manager",
        company: "Google",
        location: "Bengaluru, India",
        period: "2021 – Present",
        desc: "Working on Search Console and developer tools used by millions of users globally.",
        logo: "G",
        logoBg: "bg-red-50 text-red-600 border-red-200",
      },
      {
        role: "Associate Product Manager",
        company: "Microsoft",
        location: "Bengaluru, India",
        period: "2018 – 2021",
        desc: "Worked on Bing Ads platform focusing on SMB business.",
        logo: "M",
        logoBg: "bg-blue-50 text-blue-600 border-blue-200",
      },
    ],
  },
  {
    id: "m2",
    name: "Arjun Desai",
    verified: true,
    role: "Senior Product Manager",
    company: "Flipkart",
    location: "Bengaluru, India",
    school: "B.Tech CSE '17",
    exp: "7 Yrs Exp",
    match: 91,
    avatarColor: "from-[#350A1F] to-[#5A0C32]",
    initials: "AD",
    why: "Arjun has progressed in product management with a focus on commerce and marketplace products.",
    skills: ["Product Strategy", "User Research", "Analytics", "SQL", "Leadership"],
    careerSimilarity: 89,
    eduConnection: "Same College",
    eduDegree: "B.Tech CSE",
    experience: [
      {
        role: "Senior Product Manager",
        company: "Flipkart",
        location: "Bengaluru, India",
        period: "2022 – Present",
        desc: "Leading growth initiatives for marketplace experience and seller tools.",
        logo: "F",
        logoBg: "bg-amber-50 text-amber-600 border-amber-200",
      },
      {
        role: "Product Manager",
        company: "Amazon",
        location: "Bengaluru, India",
        period: "2017 – 2022",
        desc: "Owned features in Amazon Pay and Wallet experience.",
        logo: "A",
        logoBg: "bg-amber-100 text-amber-800 border-amber-300",
      },
    ],
  },
];

const MENTOR_PROFILES = [
  {
    name: "Smita Maryma",
    role: "Director of Product",
    company: "Azelan",
    location: "Texas, India",
    match: 93,
    open: true,
    initials: "SM",
    avatarBg: "from-[#5A0C32] to-[#7A1443]",
  },
  {
    name: "Nikhil Bhatia",
    role: "Head of Product",
    company: "Vustare",
    location: "Gurugram, India",
    match: 90,
    open: true,
    initials: "NB",
    avatarBg: "from-[#7A1443] to-[#C0336B]",
  },
];

const FILTERS = [
  "From My College",
  "B.Tech CSE",
  "Product Manager",
  "Graduation Year",
  "Location",
  "More Filters",
];

export function NetworkView({ initialMatches, initialConnections, agentSession }: NetworkViewProps) {
  const [query, setQuery] = useState("Find alumni who became product managers from my college");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [messagingTarget, setMessagingTarget] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-w-0">
      
      {/* ── Left + Center: Main Alumni Discovery Content ── */}
      <div className="flex-1 min-w-0 space-y-5">
        
        {/* 1. Results Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#1E1218] tracking-tight">
              Recommended Alumni
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0E3E7] text-[#5A0C32] border border-[#E8D1D8]">
              42 matches
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#7D6F77]">
            <div className="flex items-center gap-1 font-medium">
              <span>Sort by:</span>
              <span className="font-bold text-[#1E1218]">Best Match</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1E1218]" />
            </div>
            <div className="flex items-center gap-1">
              <button type="button" className="p-1.5 rounded-lg bg-white border border-[#E8D1D8] text-[#7A1443] shadow-2xs">
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1.5 rounded-lg bg-white border border-[#F0E3E7] text-[#7D6F77]">
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>


        {/* 3. Alumni Recommendation Cards Grid matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {DEMO_ALUMNI_MATCHES.map((m) => {
            const isConnected = connectedIds.has(m.id);

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-[#F0E3E7] shadow-xs hover:shadow-md transition-all duration-200 p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar Photo */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-white text-base font-extrabold shadow-sm shrink-0 border-2 border-white ring-2 ring-[#F0E3E7]`}>
                        {m.initials}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-[#1E1218]">{m.name}</h3>
                          {m.verified && (
                            <CheckCircle2 className="w-4 h-4 text-[#7A1443]" />
                          )}
                          <Info className="w-3.5 h-3.5 text-[#A08E98] hover:text-[#7A1443] cursor-pointer" />
                        </div>
                        <p className="text-xs font-semibold text-[#5A0C32]">
                          {m.role}
                        </p>
                        <p className="text-[11px] text-[#7D6F77] font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#A08E98]" />
                          {m.company} • {m.location}
                        </p>
                        <p className="text-[11px] text-[#7D6F77] font-medium flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-[#A08E98]" />
                          {m.school} • {m.exp}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="px-2.5 py-1 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] text-[#7A1443] text-right shrink-0 flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-[#7A1443] fill-[#7A1443]" />
                      <span className="text-xs font-extrabold">{m.match}%</span>
                      <span className="text-[10px] font-semibold text-[#7D6F77]">Match</span>
                    </div>
                  </div>

                  {/* Why this person reasoning box matching Screenshot */}
                  <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
                    <p className="text-[11px] font-bold text-[#7A1443] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Why this person?
                    </p>
                    <p className="text-[11px] text-[#4A3E45] leading-relaxed font-normal">
                      {m.why}
                    </p>
                  </div>

                  {/* Shared Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08E98] block">
                      Shared Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#F0E3E7]/60 text-[#5A0C32] border border-[#E8D1D8]"
                        >
                          {s}
                        </span>
                      ))}
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#FAF7F8] text-[#7A1443] border border-[#F0E3E7]">
                        +3
                      </span>
                    </div>
                  </div>

                  {/* Similarity Progress Bars Row */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#F0E3E7]">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#7D6F77] block">
                        Career Suitability
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-[#F0E3E7] overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${m.careerSimilarity}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-extrabold text-[#1E1218]">
                          {m.careerSimilarity}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#7D6F77] block">
                        Education Connection
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#7A1443] shrink-0" />
                        <div>
                          <p className="font-semibold text-[#1E1218] leading-tight">
                            {m.eduConnection}
                          </p>
                          <p className="text-[10px] text-[#7D6F77] leading-tight">
                            {m.eduDegree}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience Timeline */}
                  <div className="space-y-2 pt-1 border-t border-[#F0E3E7]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A08E98] block">
                      Experience
                    </span>
                    <div className="space-y-2">
                      {m.experience.map((exp, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className={`w-6 h-6 rounded-lg ${exp.logoBg} flex items-center justify-center text-[10px] font-bold shrink-0 border mt-0.5`}>
                            {exp.logo}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#1E1218]">{exp.role}</p>
                              <span className="text-[10px] text-[#7D6F77] font-medium">{exp.period}</span>
                            </div>
                            <p className="text-[10px] text-[#7D6F77] font-medium">
                              {exp.company} • {exp.location}
                            </p>
                            <p className="text-[10px] text-[#4A3E45] leading-relaxed">
                              {exp.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Row */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-[#F0E3E7]">
                  <button
                    type="button"
                    onClick={() => setMessagingTarget(m.name)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-[#7A1443] bg-white border border-[#E8D1D8] hover:bg-[#FAF7F8] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#7A1443]" />
                    Generate Networking Message
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConnect(m.id)}
                    disabled={isConnected}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs ${
                      isConnected
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-[#5A0C32] hover:bg-[#7A1443] text-white active:scale-95"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {isConnected ? "Request Sent" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>


      {/* ── Right Column Panel (AI Networking Agent & Mentor Profiles) ── */}
      <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-5">
        
        {/* CARD 1: AI Networking Agent Chat Guidance matching Screenshot */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-xs p-4 lg:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E3E7] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A1443] fill-[#7A1443]" />
              <h3 className="text-xs font-bold text-[#1E1218]">
                AI Networking Agent
              </h3>
            </div>
            <button type="button" className="text-[#A08E98] text-sm hover:text-[#1E1218]">
              −
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] space-y-1">
            <p className="text-xs font-bold text-[#1E1218]">Hi Rohan! 👋</p>
            <p className="text-[11px] text-[#7D6F77] leading-relaxed">
              I can help you find the right alumni and craft the perfect outreach.
            </p>
          </div>

          {/* Preset Action Prompts */}
          <div className="space-y-2">
            {[
              {
                title: "Refine your search",
                desc: "Add more details to get better recommendations",
              },
              {
                title: "Show alumni open to mentoring",
                desc: "Find alumni who are open to mentoring students",
              },
              {
                title: "Best way to reach out?",
                desc: "Get tips for how to start a conversation",
              },
            ].map((item, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left bg-white border border-[#E8D1D8] hover:border-[#7A1443] hover:bg-[#FDF2F5]/50 rounded-xl p-2.5 transition group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-[#1E1218] group-hover:text-[#7A1443] transition">
                    {item.title}
                  </p>
                  <ArrowRight className="w-3 h-3 text-[#A08E98] group-hover:text-[#7A1443] transition" />
                </div>
                <p className="text-[10px] text-[#7D6F77] mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Ask Input Field */}
          <div className="flex items-center gap-2 border border-[#E8D1D8] rounded-xl p-1.5 bg-[#FAF7F8]">
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 text-xs bg-transparent text-[#1E1218] pl-2 focus:outline-none placeholder:text-[#A08E98]"
            />
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-[#5A0C32] hover:bg-[#7A1443] text-white flex items-center justify-center transition shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-[#7D6F77] text-center font-medium">
            ✦ Powered by AI
          </p>
        </div>


        {/* CARD 2: Mentor Profiles for You matching Screenshot */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-xs p-4 lg:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E3E7] pb-3">
            <h3 className="text-xs font-bold text-[#1E1218]">
              Mentor Profiles for You
            </h3>
            <button type="button" className="text-[11px] font-bold text-[#7A1443] hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3.5">
            {MENTOR_PROFILES.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 border-b border-[#F0E3E7]/60 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 border-2 border-white ring-1 ring-[#F0E3E7]`}>
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1E1218] truncate">{m.name}</p>
                    <p className="text-[10px] font-semibold text-[#5A0C32] truncate">{m.role}</p>
                    <p className="text-[9px] text-[#7D6F77] truncate">{m.company} • {m.location}</p>
                    {m.open && (
                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Open to Mentor
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    {m.match}%
                  </span>
                  <span className="text-[9px] text-[#7D6F77] block mt-0.5">Match</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-[#7A1443] bg-[#FAF7F8] hover:bg-[#FDF2F5] border border-[#E8D1D8] transition text-center shadow-2xs"
          >
            Explore More Mentors →
          </button>
        </div>

      </div>

    </div>
  );
}

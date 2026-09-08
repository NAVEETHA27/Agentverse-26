"use client";

import React, { useState } from "react";
import {
  Sparkles, Search, CheckCircle2, Building2, GraduationCap,
  Send, MessageSquare, ChevronDown, Users, TrendingUp, ExternalLink
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

const MOCK_MATCHES = [
  {
    id: "m1", name: "Riya Malhotra", verified: true,
    role: "Product Manager", company: "Google", location: "Bengaluru, India",
    school: "B.Tech CSE '18", exp: "6 Yrs Exp", match: 94,
    why: "Riya follows a similar career path in product management and has experience in scalable consumer products.",
    skills: ["Product Strategy", "Roadmapping", "Agile", "SQL", "A/B Testing"],
    careerSimilarity: 92, eduConnection: "Same College", eduDegree: "B.Tech CSE",
    experience: [
      { role: "Product Manager", company: "Google", location: "Bengaluru, India", period: "2021 – Present", desc: "Working on Search Console and developer tools used by millions of users globally." },
      { role: "Associate Product Manager", company: "Microsoft", location: "Bengaluru, India", period: "2018 – 2021", desc: "Worked on Bing Ads platform focusing on SMB solutions." },
    ],
  },
  {
    id: "m2", name: "Arjun Desai", verified: true,
    role: "Senior Product Manager", company: "Flipkart", location: "Bengaluru, India",
    school: "B.Tech CSE '17", exp: "7 Yrs Exp", match: 91,
    why: "Arjun has progressed in product management with a focus on e-commerce and marketplace products.",
    skills: ["Product Strategy", "User Research", "Analytics", "SQL", "Leadership"],
    careerSimilarity: 89, eduConnection: "Same College", eduDegree: "B.Tech CSE",
    experience: [
      { role: "Senior Product Manager", company: "Flipkart", location: "Bengaluru, India", period: "2022 – Present", desc: "Leading growth initiatives for marketplace experience and seller tools." },
      { role: "Product Manager", company: "Amazon", location: "Bengaluru, India", period: "2017 – 2022", desc: "Owned features in Amazon Pay and Wallet experience." },
    ],
  },
];

const MENTOR_PROFILES = [
  { name: "Smita Narayan", role: "Director of Product", company: "Adobe", location: "Noida, India", match: 93, open: true },
  { name: "Nikhil Bhatia", role: "Head of Product", company: "Tomato", location: "Gurugram, India", match: 90, open: true },
];

const FILTERS = ["From My College", "B.Tech CSE", "Product Manager", "Graduation Year", "Location", "More Filters"];

export function NetworkView({ initialMatches, initialConnections, agentSession }: NetworkViewProps) {
  const [query, setQuery] = useState("Find alumni who became product managers from my college");
  const [connected, setConnected] = useState<Set<string>>(new Set());

  return (
    <div className="flex gap-4">
      {/* ── Left + Center: Main content ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* AI Alumni Search */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7A1443]" />
            <h1 className="text-base font-bold text-[#1E1218]">AI Alumni Search</h1>
          </div>
          <p className="text-xs text-[#7D6F77] -mt-2">Find the right alumni connections powered by AI</p>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A1443]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] text-sm text-[#1E1218] focus:outline-none focus:border-[#7A1443] transition"
              />
            </div>
            <Button variant="primary" size="md">
              <Search className="w-3.5 h-3.5 mr-1.5" /> Search
            </Button>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} className="flex items-center gap-1 text-xs text-[#4A3E45] bg-white border border-[#F0E3E7] rounded-full px-3 py-1.5 hover:border-[#7A1443] hover:text-[#7A1443] transition">
                {f} <ChevronDown className="w-3 h-3" />
              </button>
            ))}
            <button className="text-xs text-[#7A1443] font-semibold hover:underline px-2">↺ Clear All</button>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1E1218]">Recommended Alumni</h2>
            <p className="text-[11px] text-[#7D6F77]">42 results</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#7D6F77]">
            Sort by: <span className="font-semibold text-[#1E1218]">Best Match</span>
            <ChevronDown className="w-3 h-3" />
            <button className="p-1.5 rounded-lg bg-white border border-[#F0E3E7]">⊞</button>
            <button className="p-1.5 rounded-lg bg-white border border-[#F0E3E7]">≡</button>
          </div>
        </div>

        {/* Match cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MOCK_MATCHES.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-3">
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-base font-bold shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#1E1218]">{m.name}</p>
                      {m.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#7A1443]" />}
                    </div>
                    <p className="text-xs text-[#7D6F77] flex items-center gap-1">
                      <Building2 className="w-3 h-3" />{m.role} • {m.company} • {m.location}
                    </p>
                    <p className="text-[11px] text-[#7D6F77] flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />{m.school} • {m.exp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700">{m.match}% Match</span>
                </div>
              </div>

              {/* Why this person */}
              <div className="bg-[#FDF2F5] border border-[#F4CEDB] rounded-xl p-3">
                <p className="text-[10px] font-bold text-[#7A1443] mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Why this person?
                </p>
                <p className="text-[11px] text-[#4A3E45] leading-relaxed">{m.why}</p>
              </div>

              {/* Shared skills */}
              <div>
                <p className="text-[10px] font-bold text-[#7D6F77] mb-1">Shared Skills</p>
                <div className="flex flex-wrap gap-1">
                  {m.skills.map((s) => (
                    <span key={s} className="text-[10px] bg-[#FAF7F8] border border-[#F0E3E7] text-[#4A3E45] rounded-full px-2 py-0.5">{s}</span>
                  ))}
                  <span className="text-[10px] text-[#7A1443] font-semibold px-1">+2</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#7D6F77]">Career Similarity</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-[#F5ECF0] rounded-full h-2">
                      <div className="bg-[#7A1443] h-2 rounded-full" style={{ width: `${m.careerSimilarity}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E1218]">{m.careerSimilarity}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#7D6F77]">Education Connection</p>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3 text-[#7A1443]" />
                    <div>
                      <p className="text-[11px] font-semibold text-[#1E1218]">{m.eduConnection}</p>
                      <p className="text-[10px] text-[#7D6F77]">{m.eduDegree}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="text-[10px] font-bold text-[#7D6F77] mb-1">Experience</p>
                <div className="space-y-1.5">
                  {m.experience.map((exp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded bg-[#FAF7F8] border border-[#F0E3E7] flex items-center justify-center text-[8px] font-bold text-[#7A1443] shrink-0">
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#1E1218]">{exp.role}</p>
                        <p className="text-[10px] text-[#7D6F77]">{exp.company} • {exp.location} • {exp.period}</p>
                        <p className="text-[10px] text-[#4A3E45] leading-relaxed">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-[#F0E3E7]">
                <Button variant="outline" size="sm" className="flex-1">
                  <Sparkles className="w-3 h-3 mr-1" /> Generate Networking Message
                </Button>
                <Button
                  variant="primary" size="sm" className="flex-1"
                  onClick={() => setConnected((p) => { const n = new Set(p); n.add(m.id); return n; })}
                  disabled={connected.has(m.id)}
                >
                  <Users className="w-3 h-3 mr-1" />
                  {connected.has(m.id) ? "Request Sent" : "Connect"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: AI Networking Agent + Mentor Profiles ── */}
      <div className="w-[260px] shrink-0 space-y-4">
        {/* AI Networking Agent */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A1443]" />
              <p className="text-xs font-bold text-[#1E1218]">AI Networking Agent</p>
            </div>
            <button className="text-[#7D6F77] text-sm">−</button>
          </div>
          <p className="text-xs text-[#4A3E45]">Hi Ananya! 👋</p>
          <p className="text-[11px] text-[#7D6F77] leading-relaxed">I can help you find the right alumni and craft the perfect outreach</p>
          <div className="space-y-2">
            {[
              { label: "Refine your search", desc: "Add more details to get better recommendations" },
              { label: "Show alumni open to mentoring", desc: "Find alumni who are open to mentoring students" },
              { label: "Best way to reach out?", desc: "Get tips on how to start a conversation" },
            ].map((item) => (
              <button key={item.label} className="w-full text-left bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl px-3 py-2 hover:border-[#F4CEDB] hover:bg-[#FDF2F5] transition">
                <p className="text-[11px] font-semibold text-[#1E1218]">{item.label}</p>
                <p className="text-[10px] text-[#7D6F77]">{item.desc}</p>
              </button>
            ))}
          </div>
          {/* Ask input */}
          <div className="flex items-center gap-2 border border-[#F0E3E7] rounded-xl px-2 py-1.5 bg-[#FAF7F8]">
            <input placeholder="Ask anything..." className="flex-1 text-xs bg-transparent text-[#1E1218] focus:outline-none" />
            <button className="w-6 h-6 rounded-lg bg-[#7A1443] flex items-center justify-center">
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-[#7D6F77] text-center">✦ Powered by AI</p>
        </div>

        {/* Mentor Profiles For You */}
        <div className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#1E1218]">Mentor Profiles For You</p>
            <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {MENTOR_PROFILES.map((m) => (
              <div key={m.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {m.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1E1218]">{m.name}</p>
                    <p className="text-[10px] text-[#7D6F77]">{m.role}</p>
                    <p className="text-[10px] text-[#7D6F77]">{m.company} • {m.location}</p>
                    {m.open && (
                      <p className="text-[10px] text-emerald-600 font-semibold">Open to Mentor</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">{m.match}%</span>
                  <p className="text-[9px] text-[#7D6F77] mt-0.5">Match</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full text-center text-[11px] text-[#7A1443] font-semibold hover:underline">Explore More Mentors →</button>
        </div>
      </div>
    </div>
  );
}

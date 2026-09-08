"use client";

import React, { useState } from "react";
import {
  Briefcase, MapPin, X, Bookmark, BookmarkCheck, Search,
  CheckCircle2, Users, ExternalLink, ChevronDown, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { EnrichedOpportunity } from "@/lib/database/opportunities";

interface OpportunitiesViewProps {
  initialOpportunities: EnrichedOpportunity[];
}

const MOCK_OPPS = [
  {
    id: "op1", title: "Product Manager", company: "ACME Corp", logo: "ACME",
    location: "Bengaluru, India", mode: "Hybrid", type: "Full-time",
    posted: "2 days ago", applicants: 120,
    tags: ["Product Strategy", "Analytics", "Roadmapping"],
    match: 92,
    about: "We're looking for a strategic and data-driven Product Manager to lead initiatives that drive customer impact and business growth. You'll collaborate cross-functionally to define product strategy, prioritize roadmap, and deliver solutions that delight our users.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills and data-driven mindset",
      "Experience with product lifecycle and agile methodologies",
      "Excellent communication and stakeholder management",
      "Bachelor's degree in Engineering, CS, or related field",
    ],
    aiMatch: { skills: 95, experience: 90, role: 91, company: 92 },
    alumniName: "Sanya Patel", alumniRole: "Product Manager @ ACME Corp", alumniYear: "Alum '17",
  },
  {
    id: "op2", title: "Software Engineer II", company: "Microsoft", logo: "MS",
    location: "Hyderabad, India", mode: "Remote", type: "Full-time",
    posted: "1 day ago", applicants: 85,
    tags: ["C++", "System Design", "Distributed Systems"],
    match: 89, about: "", requirements: [], aiMatch: { skills: 88, experience: 85, role: 90, company: 87 },
    alumniName: "Rahul Verma", alumniRole: "SDE @ Microsoft", alumniYear: "Alum '18",
  },
  {
    id: "op3", title: "Data Analyst", company: "Zomato", logo: "Z",
    location: "Gurugram, India", mode: "Hybrid", type: "Full-time",
    posted: "3 days ago", applicants: 200,
    tags: ["SQL", "Python", "Data Visualization"],
    match: 85, about: "", requirements: [], aiMatch: { skills: 82, experience: 80, role: 86, company: 84 },
    alumniName: "Priya Singh", alumniRole: "Analyst @ Zomato", alumniYear: "Alum '20",
  },
  {
    id: "op4", title: "Associate Product Manager", company: "Razorpay", logo: "R",
    location: "Bengaluru, India", mode: "On-site", type: "Full-time",
    posted: "5 days ago", applicants: 150,
    tags: ["User Research", "Product Metrics", "Agile"],
    match: 81, about: "", requirements: [], aiMatch: { skills: 80, experience: 78, role: 82, company: 79 },
    alumniName: "Karan Mehta", alumniRole: "APM @ Razorpay", alumniYear: "Alum '21",
  },
];

const ROLE_TYPES = ["Full-time", "Part-time", "Contract", "Temporary"];
const LOCATIONS = ["Bengaluru, India", "Mumbai, India", "Delhi, India", "Hyderabad, India"];

export function OpportunitiesView({ initialOpportunities }: OpportunitiesViewProps) {
  const [activeTab, setActiveTab] = useState<"Jobs" | "Internships" | "Referrals" | "Recommended">("Jobs");
  const [selectedId, setSelectedId] = useState("op1");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [referralRequested, setReferralRequested] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const selectedOpp = MOCK_OPPS.find((o) => o.id === selectedId) || MOCK_OPPS[0];

  return (
    <div className="flex gap-0 bg-white rounded-2xl border border-[#F0E3E7] overflow-hidden shadow-sm" style={{ minHeight: "calc(100dvh - var(--navbar-height, 56px) - 3rem)" }}>
      {/* ── Left: Filter panel ── */}
      <div className="w-[200px] shrink-0 border-r border-[#F0E3E7] p-3 space-y-4 overflow-y-auto bg-[#FAFAFA]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#1E1218]">Filters</p>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#7D6F77]" />
        </div>

        {/* Role Type */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold text-[#1E1218]">Role Type</p>
            <ChevronDown className="w-3 h-3 text-[#7D6F77]" />
          </div>
          <div className="space-y-1">
            {ROLE_TYPES.map((rt, i) => (
              <label key={rt} className="flex items-center justify-between text-[11px] text-[#4A3E45] cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" defaultChecked={i === 0} className="accent-[#7A1443] w-3 h-3" />
                  <span>{rt}</span>
                </div>
                <span className="text-[#7D6F77]">{[128, 42, 36, 18][i]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold text-[#1E1218]">Location</p>
            <ChevronDown className="w-3 h-3 text-[#7D6F77]" />
          </div>
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#B0A0B0]" />
            <input placeholder="Search locations..." className="w-full pl-6 pr-2 py-1 rounded-lg bg-white border border-[#F0E3E7] text-[11px] focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[11px] text-[#4A3E45] cursor-pointer">
              <input type="radio" name="loc" defaultChecked className="accent-[#7A1443] w-3 h-3" />
              All Locations
            </label>
            {LOCATIONS.map((loc) => (
              <label key={loc} className="flex items-center justify-between text-[11px] text-[#4A3E45] cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <input type="radio" name="loc" className="accent-[#7A1443] w-3 h-3" />
                  <span>{loc.split(",")[0]}, India</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Remote */}
        <div>
          <p className="text-[11px] font-bold text-[#1E1218] mb-1.5">Remote</p>
          {["Any", "Remote", "Hybrid", "On-site"].map((r, i) => (
            <label key={r} className="flex items-center gap-1.5 text-[11px] text-[#4A3E45] cursor-pointer mb-1">
              <input type="radio" name="remote" defaultChecked={i === 0} className="accent-[#7A1443] w-3 h-3" />
              {r}
            </label>
          ))}
        </div>

        <button className="flex items-center gap-1.5 text-[11px] text-[#7A1443] font-semibold hover:underline">
          <X className="w-3 h-3" /> Clear Filters
        </button>

        {/* Premium card */}
        <div className="rounded-xl p-3 text-white space-y-1.5"
          style={{ background: "linear-gradient(145deg, #2a0618 0%, #5a0c32 100%)" }}>
          <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold">
            <span>★</span> Upgrade to Premium
          </div>
          <p className="text-[11px] leading-snug">Unlock advanced insights, unlimited referrals, and exclusive opportunities.</p>
          <button className="w-full py-1.5 rounded-lg text-[11px] font-bold bg-amber-400 text-[#3d0820]">Upgrade Now</button>
        </div>
      </div>

      {/* ── Center: Opportunities list ── */}
      <div className="flex-1 min-w-0 flex flex-col border-r border-[#F0E3E7]">
        {/* Header + Tabs */}
        <div className="p-4 border-b border-[#F0E3E7]">
          <h1 className="text-lg font-bold text-[#1E1218]">Opportunities</h1>
          <p className="text-xs text-[#7D6F77] mb-3">Discover opportunities matched to your skills and goals.</p>
          <div className="flex items-center gap-0">
            {(["Jobs", "Internships", "Referrals", "Recommended"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold transition border-b-2 ${
                  activeTab === tab
                    ? "border-[#7A1443] text-white rounded-t-lg"
                    : "border-transparent text-[#7D6F77] hover:text-[#1E1218]"
                }`}
                style={activeTab === tab ? { background: "linear-gradient(135deg,#5A0C32,#8A1848)" } : {}}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[#7D6F77]">
              Sort by: <span className="font-semibold text-[#1E1218]">Most Relevant</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F5EEF1]">
          {MOCK_OPPS.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedId(op.id)}
              className={`p-4 cursor-pointer hover:bg-[#FAF7F8] transition ${selectedId === op.id ? "bg-[#FDF2F5] border-l-2 border-[#7A1443]" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F5ECF0] border border-[#F0E3E7] flex items-center justify-center text-sm font-bold text-[#7A1443] shrink-0">
                  {op.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#1E1218]">{op.title}</p>
                      <p className="text-xs text-[#7D6F77]">{op.company}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#7D6F77] mt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{op.location}</span>
                        <span className="flex items-center gap-0.5"><Briefcase className="w-2.5 h-2.5" />{op.mode}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative w-12 h-12">
                        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="18" fill="none" stroke="#F0E3E7" strokeWidth="5" />
                          <circle cx="24" cy="24" r="18" fill="none" stroke="#7A1443" strokeWidth="5"
                            strokeDasharray={`${(op.match / 100) * 113.1} 113.1`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[11px] font-black text-[#5A0C32]">{op.match}%</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#7D6F77] font-medium">Match</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {op.tags.map((tag) => (
                      <span key={tag} className="text-[9px] bg-[#FAF7F8] border border-[#F0E3E7] text-[#4A3E45] rounded-full px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSavedIds((p) => { const n = new Set(p); n.has(op.id) ? n.delete(op.id) : n.add(op.id); return n; }); }}>
                  {savedIds.has(op.id) ? <BookmarkCheck className="w-4 h-4 text-[#7A1443]" /> : <Bookmark className="w-4 h-4 text-[#B0A0B0]" />}
                </button>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 p-4">
            {[1, 2, 3, 4, "...", 10].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded-lg text-xs font-semibold ${p === 1 ? "bg-[#7A1443] text-white" : "text-[#7D6F77] hover:bg-[#FAF7F8]"}`}>{p}</button>
            ))}
            <button className="w-7 h-7 rounded-lg text-xs text-[#7D6F77]">›</button>
          </div>
        </div>
      </div>

      {/* ── Right: Opportunity Details ── */}
      <div className="w-[300px] shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-[#F0E3E7] flex items-center justify-between">
          <p className="text-sm font-bold text-[#1E1218]">Opportunity Details</p>
          <button><X className="w-4 h-4 text-[#7D6F77]" /></button>
        </div>
        <div className="p-4 space-y-4">
          {/* Title */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5ECF0] border border-[#F0E3E7] flex items-center justify-center text-sm font-bold text-[#7A1443] shrink-0">
              {selectedOpp.logo}
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E1218]">{selectedOpp.title}</p>
              <p className="text-xs text-[#7D6F77]">{selectedOpp.company}</p>
              <div className="flex items-center gap-2 text-[10px] text-[#7D6F77] mt-0.5">
                <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{selectedOpp.location}</span>
                <span>{selectedOpp.mode}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full px-2 py-0.5 font-medium">{selectedOpp.type}</span>
                <span className="text-[10px] text-[#7D6F77]">Posted {selectedOpp.posted} · {selectedOpp.applicants} applicants</span>
              </div>
            </div>
          </div>

          {/* About */}
          {selectedOpp.about && (
            <div>
              <p className="text-xs font-bold text-[#1E1218] mb-1">About the Role</p>
              <p className="text-[11px] text-[#4A3E45] leading-relaxed">{selectedOpp.about}</p>
              <button className="text-[11px] text-[#7A1443] font-semibold mt-0.5">Read more ∨</button>
            </div>
          )}

          {/* Requirements */}
          {selectedOpp.requirements.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#1E1218] mb-1.5">Requirements</p>
              <ul className="space-y-1">
                {selectedOpp.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#4A3E45]">
                    <CheckCircle2 className="w-3 h-3 text-[#7A1443] mt-0.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Opportunity Matching */}
          <div className="bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#7A1443]">✦</span>
              <p className="text-[11px] font-bold text-[#1E1218]">AI Opportunity Matching</p>
            </div>
            <div className="flex items-start gap-3">
              {/* small donut */}
              <div className="relative w-12 h-12 shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="18" fill="none" stroke="#F0E3E7" strokeWidth="5" />
                  <circle cx="24" cy="24" r="18" fill="none" stroke="#7A1443" strokeWidth="5"
                    strokeDasharray={`${(selectedOpp.match / 100) * 113.1} 113.1`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-[#5A0C32]">{selectedOpp.match}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                {Object.entries(selectedOpp.aiMatch).map(([k, v]) => (
                  <div key={k} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#4A3E45] capitalize">{k.replace(/([A-Z])/g, " $1")} Match</span>
                      <span className="font-semibold text-[#1E1218]">{v}%</span>
                    </div>
                    <div className="w-full bg-[#F0E3E7] rounded-full h-1">
                      <div className="bg-[#7A1443] h-1 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alumni Connection */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-[#7D6F77]" />
              <p className="text-[11px] font-bold text-[#1E1218]">Alumni Connection</p>
            </div>
            <div className="flex items-center justify-between bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold">
                  {selectedOpp.alumniName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1E1218]">{selectedOpp.alumniName}</p>
                  <p className="text-[10px] text-[#7D6F77]">{selectedOpp.alumniRole}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#7D6F77]">{selectedOpp.alumniYear}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Open to refer</p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Bookmark className="w-3.5 h-3.5 mr-1.5" /> Save Opportunity
            </Button>
            <Button variant="primary" size="sm" className="w-full">
              <Users className="w-3.5 h-3.5 mr-1.5" /> Request Referral
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

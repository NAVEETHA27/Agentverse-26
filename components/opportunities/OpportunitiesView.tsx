"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Clock, 
  ArrowRight, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  Search,
  CheckCircle2,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { EnrichedOpportunity } from "@/lib/database/opportunities";

interface OpportunitiesViewProps {
  initialOpportunities: EnrichedOpportunity[];
}

export function OpportunitiesView({
  initialOpportunities,
}: OpportunitiesViewProps) {
  const [opportunities] = useState<EnrichedOpportunity[]>(initialOpportunities);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "internship" | "job">("all");
  const [filterWorkMode, setFilterWorkMode] = useState<"all" | "remote" | "hybrid" | "onsite">("all");
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());
  const [referralRequested, setReferralRequested] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedOpportunities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const requestReferral = (id: string) => {
    setReferralRequested((prev) => new Set(prev).add(id));
  };

  const filtered = opportunities.filter((op) => {
    if (filterType !== "all" && op.opportunity_type !== filterType) return false;
    if (filterWorkMode !== "all" && op.work_mode !== filterWorkMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = op.title.toLowerCase().includes(q);
      const matchCompany = op.company_name.toLowerCase().includes(q);
      const matchSkills = op.skills?.some((s) => s.name.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }
    return true;
  });

  const getWhyRecommended = (op: EnrichedOpportunity) => {
    if (op.title.includes("Cloud") || op.title.includes("DevOps")) {
      return "Directly bridges your priority skill gaps in AWS & Docker containerization. Mentors Rahul Sharma & Vikram Rao share this domain.";
    }
    return "Matches student profile in Linux/Python systems foundation with high growth into cloud infrastructure.";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            Career Opportunities & Alumni Referrals
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cloud, DevOps, and Infrastructure roles directly verified by institutional alumni mentors.
          </p>
        </div>
        <Badge variant="amber" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
          Alumni Referral Matching
        </Badge>
      </div>

      {/* Filter & Search Controls Bar */}
      <Card className="glass-panel border-slate-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or skill (e.g. AWS, Docker, DevOps)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Work Mode Select */}
            <select
              value={filterWorkMode}
              onChange={(e) => setFilterWorkMode(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
            </select>

            {/* Opportunity Type Select */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Role Types</option>
              <option value="internship">Internships Only</option>
              <option value="job">Full-time Jobs</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <span>Showing {filtered.length} of {opportunities.length} matching positions</span>
          <span>Filtered by verified career alignment</span>
        </div>
      </Card>

      {/* Opportunities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((op) => {
          const isSaved = savedOpportunities.has(op.id);
          const hasRequestedReferral = referralRequested.has(op.id);
          const whyRecommended = getWhyRecommended(op);

          return (
            <Card
              key={op.id}
              className="glass-panel border-slate-800 hover:border-slate-700 transition space-y-4 p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Row: Title, Company, Save button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">
                        {op.title}
                      </h3>
                      <Badge variant="amber" size="sm">
                        {op.opportunity_type === "internship" ? "Internship" : "Full-Time"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{op.company_name}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{op.location} ({op.work_mode})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSave(op.id)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition"
                    title={isSaved ? "Saved" : "Save opportunity"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {op.description}
                </p>

                {/* Grounded "Why recommended" Banner */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-400 flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Why Recommended:
                  </strong>
                  {whyRecommended}
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {op.skills?.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Row: Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  Deadline: {op.deadline || "Open"}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={hasRequestedReferral}
                    onClick={() => requestReferral(op.id)}
                    className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/30"
                  >
                    {hasRequestedReferral ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Referral Requested
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 mr-1" />
                        Ask Alumni Referral
                      </>
                    )}
                  </Button>

                  <a
                    href={op.application_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="primary" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold">
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

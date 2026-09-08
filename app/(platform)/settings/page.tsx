"use client";

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Target, 
  HeartHandshake, 
  Sparkles, 
  Lock, 
  Save, 
  Check, 
  ShieldCheck, 
  Sliders, 
  Eye,
  Bell
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "career" | "mentorship" | "ai" | "privacy">("account");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [accountState, setAccountState] = useState({
    fullName: "Rohan Varma",
    username: "rohan_v",
    email: "rohan@example.com",
    location: "Chennai, India",
    headline: "ECE Senior Student @ ABC College | Aspiring Cloud & DevOps Engineer",
    bio: "Passionate about distributed systems, Linux socket internals, and cloud infrastructure.",
  });

  const [careerState, setCareerState] = useState({
    targetRole: "Cloud Engineer",
    targetTimeline: "6 months (by graduation 2026)",
    activeStatus: "Actively Preparing & Seeking Mentorship",
  });

  const [mentorshipState, setMentorshipState] = useState({
    openToMentoring: false,
    openToMentees: true,
    maxMentees: 2,
    preferredTopics: "Cloud Architecture, Linux Systems, Containerization, ECE to Software transition",
  });

  const [aiState, setAiState] = useState({
    approvalMode: "strict", // strict = human approval required before sending
    geminiExtraction: true,
    agentTraceAudit: true,
    autoDiscoveryFrequency: "daily",
  });

  const [privacyState, setPrivacyState] = useState({
    visibility: "network_only",
    showAcademicRecords: true,
    allowAlumniDirectMessage: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            Platform & Agent Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your unified identity, career objectives, AI governance parameters, and privacy preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: "account", label: "Account Profile", icon: User },
          { id: "career", label: "Career Goal", icon: Target },
          { id: "mentorship", label: "Mentorship", icon: HeartHandshake },
          { id: "ai", label: "AI & Agent Guardrails", icon: Sparkles },
          { id: "privacy", label: "Privacy & Visibility", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave}>
        <Card className="glass-panel border-slate-800 p-6">
          {/* 1. Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Unified Account Identity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your identity seamlessly spans student enrollment and alumni alumni networks without artificial role locks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={accountState.fullName}
                    onChange={(e) => setAccountState({ ...accountState, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Username</label>
                  <input
                    type="text"
                    value={accountState.username}
                    onChange={(e) => setAccountState({ ...accountState, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={accountState.email}
                    onChange={(e) => setAccountState({ ...accountState, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Location</label>
                  <input
                    type="text"
                    value={accountState.location}
                    onChange={(e) => setAccountState({ ...accountState, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Professional Headline</label>
                <input
                  type="text"
                  value={accountState.headline}
                  onChange={(e) => setAccountState({ ...accountState, headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  value={accountState.bio}
                  onChange={(e) => setAccountState({ ...accountState, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 2. Career Goal */}
          {activeTab === "career" && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Target Career Objective
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drives the Career Agent's roadmap generation and the Networking Agent's deterministic matching algorithm.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Target Role Title</label>
                  <input
                    type="text"
                    value={careerState.targetRole}
                    onChange={(e) => setCareerState({ ...careerState, targetRole: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-indigo-300">Matching weights will automatically optimize for this role</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Target Horizon / Timeline</label>
                  <input
                    type="text"
                    value={careerState.targetTimeline}
                    onChange={(e) => setCareerState({ ...careerState, targetTimeline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Readiness Status</label>
                  <select
                    value={careerState.activeStatus}
                    onChange={(e) => setCareerState({ ...careerState, activeStatus: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Actively Preparing & Seeking Mentorship">Actively Preparing & Seeking Mentorship</option>
                    <option value="Exploring Career Paths">Exploring Career Paths</option>
                    <option value="Applying to Roles / Interviewing">Applying to Roles / Interviewing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. Mentorship */}
          {activeTab === "mentorship" && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  Mentorship Availability & Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure whether you are seeking mentors or willing to guide junior students in specialized topics.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Seeking Alumni Mentorship</h4>
                    <p className="text-[11px] text-slate-400">Allows the Networking Agent to pair you with qualified alumni advisors.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mentorshipState.openToMentees}
                    onChange={(e) => setMentorshipState({ ...mentorshipState, openToMentees: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Open to Guide Junior Students (Peer Mentoring)</h4>
                    <p className="text-[11px] text-slate-400">Offer guidance on freshman coursework or hardware/ECE labs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mentorshipState.openToMentoring}
                    onChange={(e) => setMentorshipState({ ...mentorshipState, openToMentoring: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Preferred Discussion Topics</label>
                  <textarea
                    rows={2}
                    value={mentorshipState.preferredTopics}
                    onChange={(e) => setMentorshipState({ ...mentorshipState, preferredTopics: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. AI & Agent Guardrails */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Agent Guardrails & Governance
                  </h3>
                  <Badge variant="purple" size="sm">Safety Guarantee</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ensures all autonomous actions adhere to strict human-in-the-loop oversight.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Human Approval Enforcement</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The Networking Agent will <strong>NEVER</strong> automatically dispatch connection requests or messages without your explicit one-click confirmation.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Execution Trace Audit Logging</h4>
                    <p className="text-[11px] text-slate-400">Record all agent tool invocations and latency timings in the audit log.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiState.agentTraceAudit}
                    onChange={(e) => setAiState({ ...aiState, agentTraceAudit: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Natural Language Skill Extraction</h4>
                    <p className="text-[11px] text-slate-400">Use Gemini to automatically identify technical competencies from feed posts and chat.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiState.geminiExtraction}
                    onChange={(e) => setAiState({ ...aiState, geminiExtraction: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Agent Discovery Frequency</label>
                  <select
                    value={aiState.autoDiscoveryFrequency}
                    onChange={(e) => setAiState({ ...aiState, autoDiscoveryFrequency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="instant">Instant on Goal Change</option>
                    <option value="daily">Daily Digest</option>
                    <option value="manual">Manual Execution Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 5. Privacy & Visibility */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-sky-400" />
                  Privacy & Network Visibility
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control who can discover your profile and view your academic achievements.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Profile Visibility Scope</label>
                  <select
                    value={privacyState.visibility}
                    onChange={(e) => setPrivacyState({ ...privacyState, visibility: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="network_only">College Network & Verified Alumni (Recommended)</option>
                    <option value="public">All Platform Members</option>
                    <option value="private">Private / Mentors Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Show Academic & College Records</h4>
                    <p className="text-[11px] text-slate-400">Display institution names and graduation years to alumni peers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyState.showAcademicRecords}
                    onChange={(e) => setPrivacyState({ ...privacyState, showAcademicRecords: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Allow Direct Outreach from Alumni</h4>
                    <p className="text-[11px] text-slate-400">Receive mentor check-ins and referral invites directly in your inbox.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacyState.allowAlumniDirectMessage}
                    onChange={(e) => setPrivacyState({ ...privacyState, allowAlumniDirectMessage: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Changes take effect immediately across all active agent loops.
            </span>
            <Button type="submit" variant="primary" size="md">
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

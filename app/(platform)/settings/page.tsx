"use client";

import React, { useState } from "react";
import {
  User, Eye, Users, GraduationCap, Bell, Sparkles, Lock, Save, Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "visibility", label: "Profile Visibility", icon: Eye },
  { id: "networking", label: "Networking Preferences", icon: Users },
  { id: "mentorship", label: "Mentorship Preferences", icon: GraduationCap },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-[#7A1443]" : "bg-[#E0D0D8]"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: "Priya Sharma",
    email: "priya.sharma@alumnet.edu",
    visibility: "Alumni Network",
    showEmail: true,
    allowConnections: true,
    showInDirectory: true,
    allowMessages: false,
    openToMentor: true,
    lookingForMentor: true,
    emailNotifs: true,
    pushNotifs: true,
    aiFrequency: 60, // 0-100 slider
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-[#1E1218]">Settings</h1>

      <div className="flex gap-4">
        {/* Left nav */}
        <div className="w-52 shrink-0 bg-white rounded-2xl border border-[#F0E3E7] shadow-sm py-2 h-fit sticky top-20">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.id} href={`#${s.id}`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#4A3E45] hover:bg-[#FDF2F5] hover:text-[#7A1443] transition rounded-xl mx-1.5 group">
                <Icon className="w-4 h-4 text-[#7D6F77] group-hover:text-[#7A1443]" />
                {s.label}
              </a>
            );
          })}
        </div>

        {/* Right: all settings in one scrollable panel */}
        <div className="flex-1 bg-white rounded-2xl border border-[#F0E3E7] shadow-sm p-6 space-y-8">
          {/* Account */}
          <section id="account" className="space-y-4">
            <h2 className="text-base font-bold text-[#1E1218] pb-2 border-b border-[#F0E3E7]">Account</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A3E45]">Full Name</label>
                <div className="flex items-center border border-[#F0E3E7] rounded-xl px-3 py-2 bg-[#FAF7F8] gap-2">
                  <User className="w-3.5 h-3.5 text-[#7D6F77]" />
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="flex-1 text-xs bg-transparent text-[#1E1218] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A3E45]">Email Address</label>
                <div className="flex items-center border border-[#F0E3E7] rounded-xl px-3 py-2 bg-[#FAF7F8] gap-2">
                  <span className="text-[#7D6F77] text-xs">✉</span>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="flex-1 text-xs bg-transparent text-[#1E1218] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A3E45]">Change Password</label>
                <Button variant="outline" size="sm" className="w-full">
                  <Lock className="w-3.5 h-3.5 mr-1.5" /> Change Password
                </Button>
              </div>
            </div>
          </section>

          {/* Profile Visibility */}
          <section id="visibility" className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-[#F0E3E7]">
              <Eye className="w-4 h-4 text-[#7A1443] mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1E1218]">Profile Visibility</h3>
                <p className="text-[11px] text-[#7D6F77]">Choose who can see your profile information.</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  className="border border-[#F0E3E7] rounded-xl px-3 py-1.5 text-xs text-[#1E1218] bg-white focus:outline-none focus:border-[#7A1443]">
                  <option>Alumni Network</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
                <div className="flex items-center gap-2 text-xs text-[#4A3E45]">
                  <Toggle checked={form.showEmail} onChange={(v) => setForm({ ...form, showEmail: v })} />
                  Show my email to trusted connections
                </div>
              </div>
            </div>
          </section>

          {/* Networking */}
          <section id="networking" className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-[#F0E3E7]">
              <Users className="w-4 h-4 text-[#7A1443] mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1E1218]">Networking Preferences</h3>
                <p className="text-[11px] text-[#7D6F77]">Control how others can connect with you.</p>
              </div>
              <div className="space-y-2 text-xs text-[#4A3E45]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.allowConnections} onChange={(e) => setForm({ ...form, allowConnections: e.target.checked })} className="accent-[#7A1443] w-3.5 h-3.5" />
                  Allow connection requests
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.showInDirectory} onChange={(e) => setForm({ ...form, showInDirectory: e.target.checked })} className="accent-[#7A1443] w-3.5 h-3.5" />
                  Show me in alumni directory
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.allowMessages} onChange={(e) => setForm({ ...form, allowMessages: e.target.checked })} className="accent-[#7A1443] w-3.5 h-3.5" />
                  Allow messages from non-connections
                </label>
              </div>
            </div>
          </section>

          {/* Mentorship */}
          <section id="mentorship" className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-[#F0E3E7]">
              <GraduationCap className="w-4 h-4 text-[#7A1443] mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1E1218]">Mentorship Preferences</h3>
                <p className="text-[11px] text-[#7D6F77]">Set your availability and mentoring interests.</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#4A3E45]">
                <div className="flex items-center gap-2">
                  <Toggle checked={form.openToMentor} onChange={(v) => setForm({ ...form, openToMentor: v })} />
                  I am open to mentor
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={form.lookingForMentor} onChange={(v) => setForm({ ...form, lookingForMentor: v })} />
                  I am looking for a mentor
                </div>
                <Button variant="outline" size="sm">
                  <span className="text-[#7A1443]">✏</span> Edit Interests
                </Button>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section id="notifications" className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-[#F0E3E7]">
              <Bell className="w-4 h-4 text-[#7A1443] mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1E1218]">Notification Preferences</h3>
                <p className="text-[11px] text-[#7D6F77]">Choose how you want to stay updated.</p>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#4A3E45]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Toggle checked={form.emailNotifs} onChange={(v) => setForm({ ...form, emailNotifs: v })} />
                    Email Notifications
                  </div>
                  <p className="text-[10px] text-[#7D6F77] ml-12">Receive updates via email</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Toggle checked={form.pushNotifs} onChange={(v) => setForm({ ...form, pushNotifs: v })} />
                    Push Notifications
                  </div>
                  <p className="text-[10px] text-[#7D6F77] ml-12">Receive updates on your device</p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Preferences */}
          <section id="ai" className="space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#7A1443] mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1E1218]">AI Preferences</h3>
                <p className="text-[11px] text-[#7D6F77]">Customize your AI recommendations.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#4A3E45]">Recommendation Frequency</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#7D6F77]">
                    <span>Less Often</span>
                    <input type="range" min={0} max={100} value={form.aiFrequency}
                      onChange={(e) => setForm({ ...form, aiFrequency: Number(e.target.value) })}
                      className="w-32 accent-[#7A1443]" />
                    <span className="text-[#7A1443] font-semibold">More Often</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-[#7D6F77]">Balanced</span>
                  </div>
                </div>
                <div className="bg-[#FDF2F5] border border-[#F4CEDB] rounded-xl p-3 text-[11px] text-[#7A1443] max-w-[200px] leading-relaxed">
                  ✦ We'll use AI to suggest relevant connections, jobs, events, and mentorship opportunities.
                </div>
              </div>
            </div>
          </section>

          {/* Save / Cancel */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E3E7]">
            <Button variant="outline" size="md">Cancel</Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              {saved ? <><Check className="w-4 h-4 mr-1.5 text-emerald-300" />Saved!</> : <><Save className="w-4 h-4 mr-1.5" />Save Changes</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

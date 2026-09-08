"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell, UserPlus, MessageSquare, BookOpen, Briefcase,
  Map, Sparkles, ChevronDown, ChevronUp, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface NotifGroup {
  id: string;
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  items: {
    id: string;
    avatar: string;
    name: string;
    sub: string;
    message: string;
    time: string;
    actions?: { label: string; variant: "primary" | "outline" }[];
    actionLabel?: string;
  }[];
}

const GROUPS: NotifGroup[] = [
  {
    id: "conn_req", icon: UserPlus, label: "Connection Requests", count: 2, color: "text-emerald-600",
    items: [
      { id: "n1", avatar: "A", name: "Arjun Mehta", sub: "Product Manager at Google", message: "Hi Priya, I'd like to connect and explore opportunities to collaborate.", time: "10m ago", actions: [{ label: "Accept", variant: "primary" }, { label: "Dismiss", variant: "outline" }] },
      { id: "n2", avatar: "N", name: "Neha Iyer", sub: "Data Scientist at Microsoft", message: "Hi Priya, I'd love to connect and learn from your journey.", time: "1h ago", actions: [{ label: "Accept", variant: "primary" }, { label: "Dismiss", variant: "outline" }] },
    ],
  },
  {
    id: "conn_acc", icon: UserPlus, label: "Connection Accepted", count: 1, color: "text-blue-600",
    items: [
      { id: "n3", avatar: "R", name: "Rohan Kapoor", sub: "Senior Software Engineer at Amazon", message: "Rohan Kapoor accepted your connection request.", time: "2h ago", actionLabel: "View" },
    ],
  },
  {
    id: "messages", icon: MessageSquare, label: "New Messages", count: 2, color: "text-[#7A1443]",
    items: [
      { id: "n4", avatar: "A", name: "Ananya Singh", sub: "UX Designer at Adobe", message: "Hey Priya! I came across your profile and would love to chat about...", time: "3h ago", actionLabel: "View" },
    ],
  },
  {
    id: "mentor", icon: BookOpen, label: "Mentor Updates", count: 1, color: "text-purple-600",
    items: [
      { id: "n5", avatar: "D", name: "Dr. Vivek Menon", sub: "Mentor", message: "Dr. Vivek Menon posted a new update: \"Key skills for career growth in 2024\"", time: "5h ago", actionLabel: "View" },
    ],
  },
  {
    id: "jobs", icon: Briefcase, label: "Job Recommendations", count: 3, color: "text-amber-600",
    items: [
      { id: "n6", avatar: "ZS", name: "Product Manager", sub: "ZS Associates • Mumbai, India", message: "Based on your profile and preferences", time: "6h ago", actionLabel: "View Jobs" },
    ],
  },
  {
    id: "roadmap", icon: Map, label: "Roadmap Updates", count: 1, color: "text-emerald-600",
    items: [
      { id: "n7", avatar: "★", name: "Leadership Roadmap", sub: "Your Career Path", message: "New milestone unlocked: \"Leading Teams Effectively\"", time: "1d ago", actionLabel: "View" },
    ],
  },
  {
    id: "ai", icon: Sparkles, label: "AI Recommendations", count: 2, color: "text-rose-500",
    items: [
      { id: "n8", avatar: "AI", name: "Skill Recommendation", sub: "AI Career Coach", message: "AI suggests you to learn \"Prompt Engineering\" to boost your career.", time: "1d ago", actionLabel: "View" },
    ],
  },
];

export default function NotificationsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map((g) => [g.id, true]))
  );

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1E1218]">Notifications</h1>
          <p className="text-xs text-[#7D6F77]">Stay updated with your network and career opportunities</p>
        </div>
        <Button size="sm" variant="primary">
          <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark all as read
        </Button>
      </div>

      {/* Groups */}
      <div className="space-y-3">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          const isOpen = expanded[group.id];
          return (
            <div key={group.id} className="bg-white rounded-2xl border border-[#F0E3E7] shadow-sm overflow-hidden">
              {/* Group header */}
              <button
                onClick={() => toggle(group.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAF7F8] transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] flex items-center justify-center ${group.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-[#1E1218]">{group.label}</span>
                  {group.count > 0 && (
                    <span className="text-[10px] font-bold bg-[#FDF2F5] text-[#7A1443] border border-[#F4CEDB] rounded-full px-2 py-0.5">
                      {group.count}
                    </span>
                  )}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#7D6F77]" /> : <ChevronDown className="w-4 h-4 text-[#7D6F77]" />}
              </button>

              {/* Items */}
              {isOpen && group.items.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${i < group.items.length - 1 ? "border-b border-[#F5EEF1]" : ""} hover:bg-[#FAF7F8] transition`}>
                  {/* Red dot for unread */}
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {item.avatar}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E1218]">{item.name}</p>
                    <p className="text-[11px] text-[#7D6F77]">{item.sub}</p>
                    <p className="text-[11px] text-[#4A3E45] mt-0.5 truncate">{item.message}</p>
                  </div>
                  <p className="text-[10px] text-[#7D6F77] shrink-0 w-12 text-right">{item.time}</p>
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {item.actions ? item.actions.map((a) => (
                      <Button key={a.label} size="sm" variant={a.variant}>{a.label}</Button>
                    )) : item.actionLabel ? (
                      <Button size="sm" variant="outline">{item.actionLabel}</Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

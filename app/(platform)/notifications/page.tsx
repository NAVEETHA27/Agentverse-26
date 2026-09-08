"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Sparkles, 
  UserPlus, 
  MessageSquare, 
  Map, 
  Check, 
  CheckCheck, 
  ArrowRight, 
  Clock, 
  Filter,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface NotificationItem {
  id: string;
  type: "connection" | "message" | "roadmap" | "agent";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl: string;
  actionLabel: string;
  badge?: string;
  badgeVariant?: "indigo" | "emerald" | "amber" | "purple" | "rose" | "default";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "connection",
    title: "Connection Request Accepted",
    description: "Rahul Sharma (Senior Cloud Architect @ AWS) accepted your connection request and agreed to mentor your Cloud Engineer transition.",
    timestamp: "10m ago",
    read: false,
    actionUrl: "/chat",
    actionLabel: "Open Conversation",
    badge: "Connected",
    badgeVariant: "emerald",
  },
  {
    id: "notif-2",
    type: "agent",
    title: "AI Networking Agent Match Discovery",
    description: "The Networking Agent analyzed alumni nodes from ABC College and identified Rahul Sharma as a 94% deterministic match for Cloud Engineering.",
    timestamp: "45m ago",
    read: false,
    actionUrl: "/network",
    actionLabel: "View Match Breakdown",
    badge: "Agent Alert",
    badgeVariant: "purple",
  },
  {
    id: "notif-3",
    type: "message",
    title: "New Message from Rahul Sharma",
    description: "'Hey Rohan! Glad to connect. I saw your Linux socket project — that's solid groundwork for cloud infrastructure...'",
    timestamp: "2h ago",
    read: false,
    actionUrl: "/chat",
    actionLabel: "Reply to Rahul",
    badge: "Unread Message",
    badgeVariant: "indigo",
  },
  {
    id: "notif-4",
    type: "roadmap",
    title: "Career Roadmap Action Item Added",
    description: "Relationship AI analyzed your chat dialogue and proposed adding 'Set up AWS VPC with public/private subnets' to Phase 2 of your career plan.",
    timestamp: "5h ago",
    read: true,
    actionUrl: "/career",
    actionLabel: "View Career Plan",
    badge: "Roadmap Sync",
    badgeVariant: "amber",
  },
  {
    id: "notif-5",
    type: "connection",
    title: "Connection Request Pending",
    description: "Your introductory message to Ananya Patel (SWE II @ Microsoft) is awaiting review.",
    timestamp: "1d ago",
    read: true,
    actionUrl: "/network",
    actionLabel: "View Request Status",
    badge: "Pending Approval",
    badgeVariant: "default",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "connections") return n.type === "connection";
    if (activeTab === "messages") return n.type === "message";
    if (activeTab === "agent") return n.type === "agent" || n.type === "roadmap";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "connection":
        return <UserPlus className="w-5 h-5 text-emerald-400" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case "roadmap":
        return <Map className="w-5 h-5 text-amber-400" />;
      case "agent":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications from alumni connections, mentor conversations, and autonomous AI agents.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Mark all as read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Notifications", count: notifications.length },
          { id: "connections", label: "Connections", count: notifications.filter((n) => n.type === "connection").length },
          { id: "messages", label: "Messages", count: notifications.filter((n) => n.type === "message").length },
          { id: "agent", label: "Agent & Roadmap", count: notifications.filter((n) => n.type === "agent" || n.type === "roadmap").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? "bg-indigo-800 text-white" : "bg-slate-800 text-slate-400"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="glass-panel text-center py-12">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No notifications in this filter</p>
            <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
          </Card>
        ) : (
          filteredNotifications.map((n) => (
            <Card
              key={n.id}
              className={`glass-panel border-slate-800 transition ${
                !n.read ? "border-l-4 border-l-indigo-500 bg-indigo-950/10" : "opacity-90"
              }`}
            >
              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${!n.read ? "text-white" : "text-slate-200"}`}>
                        {n.title}
                      </h3>
                      {n.badge && (
                        <Badge variant={n.badgeVariant || "default"} size="sm">
                          {n.badge}
                        </Badge>
                      )}
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {n.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <Link href={n.actionUrl} onClick={() => markSingleAsRead(n.id)}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <span>{n.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>

                    {!n.read && (
                      <button
                        onClick={() => markSingleAsRead(n.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

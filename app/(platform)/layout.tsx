"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Compass, 
  UserCheck, 
  Sparkles,
  Bot,
  Bell,
  Settings,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const primaryLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Career Goal", href: "/career", icon: Target },
    { name: "Network Explorer", href: "/network", icon: Users },
    { name: "Messages & Chat", href: "/chat", icon: MessageSquare },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Professional Feed", href: "/feed", icon: Compass },
    { name: "My Profile", href: "/profile", icon: UserCheck },
  ];

  const secondaryLinks = [
    { name: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 overflow-x-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-5">
          <div className="glass-panel rounded-2xl p-4 space-y-1 border border-slate-800">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Core Navigation
            </div>
            {primaryLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150",
                    active
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-950/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 pb-1 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-t border-slate-800/80 mt-2">
              System & Alerts
            </div>
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150",
                    active
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Autonomous Agent Status Widget */}
          <div className="glass-panel rounded-2xl p-4 border-indigo-500/30 space-y-3 bg-indigo-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                Agent Engine Live
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Autonomous Career & Networking Agents ready with Human-in-the-Loop governance.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Protocol:
              </span>
              <Badge variant="indigo" size="sm">Controlled Tools</Badge>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

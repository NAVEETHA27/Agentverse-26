"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Target, Users, Briefcase, UserCheck, Sparkles,
  Settings, BrainCircuit, Calendar, MessageSquare, Bell,
  BookOpen, LogOut, Star
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "My Profile", href: "/profile", icon: UserCheck },
  { name: "Career Roadmap", href: "/career", icon: Target },
  { name: "Alumni Roadmap", href: "/network", icon: BookOpen },
  { name: "Mentorship", href: "/network", icon: Sparkles },
  { name: "Jobs & Referrals", href: "/opportunities", icon: Briefcase },
  { name: "AI Assistant", href: "/career", icon: BrainCircuit },
  { name: "Messages", href: "/chat", icon: MessageSquare, badge: 3 },
  { name: "Events", href: "/feed", icon: Calendar },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Prevent browser window/document body from scrolling while inside the authenticated platform shell
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const isActive = (href: string, name: string) => {
    if (pathname === "/career") {
      return name === "Career Roadmap";
    }
    if (pathname === "/network") {
      return name === "Alumni Roadmap" || name === "Mentorship";
    }
    return pathname === href;
  };

  return (
    <div
      className="platform-shell relative w-full overflow-hidden bg-[#FAF7F8] text-[#1E1218]"
      style={{
        height: "100dvh",
        minHeight: "100dvh",
        maxHeight: "100dvh",
      }}
    >
      {/* ── 1. Fixed Top Navbar ── */}
      <Navbar />

      {/* ── 2. Fixed Desktop Sidebar (stays pinned at left, never moves on main scroll) ── */}
      <aside
        id="platform-sidebar"
        className="hidden lg:flex flex-col fixed left-0 bottom-0 z-40 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{
          top: "var(--navbar-height, 56px)",
          width: "var(--sidebar-width, 220px)",
          background: "linear-gradient(180deg, #1a0410 0%, #220614 60%, #2a0818 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Navigation links */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.name);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group",
                  active
                    ? "text-white"
                    : "text-rose-200/60 hover:text-white hover:bg-white/10"
                )}
                style={active ? {
                  background: "linear-gradient(110deg, #4a0c28 0%, #7a1443 100%)",
                  boxShadow: "0 2px 8px rgba(120,20,60,0.4)",
                } : {}}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-rose-300/50 group-hover:text-rose-200")} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-white/10" />

        {/* Promotional / Network Card matching screenshot */}
        <div
          className="m-3 relative overflow-hidden rounded-2xl p-4 text-white shrink-0"
          style={{
            background: "linear-gradient(145deg, #1e0512 0%, #3d0822 40%, #6b1038 70%, #8a1545 100%)",
            boxShadow: "0 4px 20px rgba(100,10,40,0.5)",
          }}
        >
          {/* Decorative glowing arcs matching screenshot */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 180 130" fill="none" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="160" cy="15" rx="100" ry="55" fill="none" stroke="#e01858" strokeWidth="1" opacity="0.4" />
            <ellipse cx="170" cy="25" rx="80" ry="42" fill="none" stroke="#c8104a" strokeWidth="0.7" opacity="0.3" />
            <circle cx="160" cy="110" r="28" fill="rgba(180,20,60,0.1)" />
          </svg>
          <div
            className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(220,30,80,0.3) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span className="text-[11px] font-bold text-rose-300">Important</span>
            </div>
            <p className="text-[12px] font-bold leading-snug">Your future is a network away.</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,190,210,0.85)" }}>
              Connect with the right people, Build your career with AI.
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="flex items-center gap-3 px-5 py-3.5 text-rose-300/60 hover:text-rose-200 hover:bg-white/5 transition text-[13px] font-medium border-t border-white/10 shrink-0 text-left"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </aside>

      {/* ── 3. Main Content Area (The Single Primary Scroll Container) ── */}
      <main
        id="main-scroll-area"
        className="min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain ml-0 lg:ml-[var(--sidebar-width,220px)]"
        style={{
          marginTop: "var(--navbar-height, 56px)",
          height: "calc(100dvh - var(--navbar-height, 56px))",
        }}
      >
        <div className="max-w-[1400px] mx-auto p-4 lg:p-6 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

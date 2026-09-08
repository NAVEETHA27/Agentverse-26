"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Target, Users, MessageSquare, Briefcase, Calendar,
  UserCheck, Bell, Settings, GraduationCap, Sparkles, ArrowRight,
  LogOut, Compass, Trophy, BookOpen, BrainCircuit
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "My Profile", href: "/profile", icon: UserCheck },
  { name: "Career Roadmap", href: "/career", icon: Target },
  { name: "Alumni Roadmap & Mentorship", href: "/network", icon: BookOpen },
  { name: "Jobs & Referrals", href: "/opportunities", icon: Briefcase },
  { name: "Messages", href: "/chat", icon: MessageSquare, badge: 3 },
  { name: "Events", href: "/feed", icon: Calendar },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Prevent main browser document body from scrolling; main container handles scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/profile" && (pathname === "/profile" || pathname === "/dashboard" || pathname === "/")) {
      return true;
    }
    return pathname === href;
  };

  return (
    <div
      className="platform-shell relative w-full overflow-hidden bg-[#FAF7F8] text-[#1E1218]"
      style={{
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* ── 1. Fixed Desktop Left Sidebar (Full Height 0 to 100vh) ── */}
      <aside
        id="platform-sidebar"
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{
          width: "var(--sidebar-width, 250px)",
          background: "linear-gradient(180deg, #1A0410 0%, #2A0818 55%, #350A1F 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Brand Header */}
        <div className="p-5 pb-4 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center shadow-lg ring-1 ring-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[16px] font-extrabold text-white tracking-tight leading-tight block">
              AgentVerse
            </span>
            <span className="text-[10px] text-rose-300/80 font-medium block">
              AI Career Navigation
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group",
                  active
                    ? "text-white font-semibold"
                    : "text-rose-200/70 hover:text-white hover:bg-white/10"
                )}
                style={
                  active
                    ? {
                        background: "linear-gradient(110deg, #5A0C32 0%, #7A1443 100%)",
                        boxShadow: "0 2px 10px rgba(122, 20, 67, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active ? "text-white" : "text-rose-300/60 group-hover:text-rose-200"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="w-4 h-4 rounded-full bg-[#C0336B] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Promotional AI Card matching Screenshot */}
        <div
          className="m-3 relative overflow-hidden rounded-2xl p-4 text-white shrink-0"
          style={{
            background: "linear-gradient(145deg, #1E0412 0%, #3D0822 40%, #5A0C32 75%, #7A1443 100%)",
            boxShadow: "0 4px 18px rgba(90, 12, 50, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Glowing Vector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 180 130" fill="none" preserveAspectRatio="xMidYMid slice">
            <ellipse cx="150" cy="20" rx="90" ry="50" fill="none" stroke="#E01858" strokeWidth="1" opacity="0.35" />
            <ellipse cx="160" cy="30" rx="70" ry="38" fill="none" stroke="#C8104A" strokeWidth="0.8" opacity="0.25" />
            <circle cx="140" cy="100" r="24" fill="rgba(220, 30, 80, 0.15)" />
          </svg>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
              <span className="text-[11px] font-bold text-white tracking-wide">AgentVerse AI</span>
            </div>
            <p className="text-[11px] leading-snug text-rose-100/90 font-medium">
              Your AI-powered career navigation companion.
            </p>
            <Link
              href="/career"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white transition mt-1"
            >
              Explore AI <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="flex items-center gap-3 px-5 py-3 text-rose-300/60 hover:text-white hover:bg-white/5 transition text-[12px] font-medium border-t border-white/10 shrink-0 text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </aside>

      {/* ── 2. Fixed Top Navbar Header ── */}
      <Navbar />

      {/* ── 3. Main Content Area (Independent Scroll Container) ── */}
      <main
        id="main-scroll-area"
        className="min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain ml-0 lg:ml-[var(--sidebar-width,250px)]"
        style={{
          marginTop: "var(--navbar-height, 64px)",
          height: "calc(100vh - var(--navbar-height, 64px))",
        }}
      >
        <div className="max-w-[1440px] mx-auto p-4 lg:p-6 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

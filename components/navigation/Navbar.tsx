"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, ChevronDown, GraduationCap, Search, Menu, X,
  Settings, LayoutDashboard, Target, Users, Briefcase,
  BrainCircuit, Sparkles, Calendar, UserCheck, MessageSquare, Home
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Network", href: "/network", icon: Users },
    { name: "Mentorship", href: "/network", icon: Sparkles },
    { name: "Jobs", href: "/opportunities", icon: Briefcase },
    { name: "Events", href: "/feed", icon: Calendar },
    { name: "Messages", href: "/chat", icon: MessageSquare },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full shadow-md shrink-0"
        style={{
          height: "var(--navbar-height, 56px)",
          background: "linear-gradient(90deg, #160309 0%, #250614 50%, #160309 100%)",
          borderBottom: "1px solid #3a0820",
        }}
      >
        <div className="flex items-center justify-between px-4 h-full max-w-[1440px] mx-auto gap-4">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white tracking-tight leading-tight">AgentVerse</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white/15 text-rose-200">AlumniVerse</span>
              </div>
              <p className="text-[10px] leading-tight" style={{ color: "rgba(255,180,200,0.8)" }}>
                Discover the right people and make networking useful.
              </p>
            </div>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                    active
                      ? "text-white bg-white/15 border-b-2 border-rose-400"
                      : "text-rose-200/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-[340px] relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "rgba(200,100,140,0.6)" }}
            />
            <input
              type="text"
              placeholder="Search alumni, skills, or mentors..."
              className="w-full pl-9 pr-4 py-2 text-white text-xs rounded-full focus:outline-none transition-all"
              style={{
                background: "rgba(60,8,28,0.85)",
                border: "1px solid rgba(120,20,60,0.5)",
              }}
            />
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Link
              href="/notifications"
              className="relative p-2 rounded-full text-rose-200/80 hover:text-white hover:bg-white/10 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                R
              </div>
              <span className="text-xs font-semibold text-white">Rohan Varma</span>
              <span className="text-[10px] text-rose-300/80">Student</span>
              <ChevronDown className="w-3.5 h-3.5 text-rose-300/70" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-rose-300 hover:text-white rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Fixed below Navbar) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 bottom-0 z-50 bg-[#1E0412]/95 backdrop-blur-md border-t border-[#3A0820] px-4 py-4 space-y-1.5 overflow-y-auto"
          style={{ top: "var(--navbar-height, 56px)" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition",
                  active ? "bg-[#5A0C32] text-white font-semibold" : "text-rose-200/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

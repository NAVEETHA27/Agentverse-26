"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, ChevronDown, Search, Menu, X,
  Home, Target, Users, Briefcase, Calendar,
  UserCheck, MessageSquare, Sparkles, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Career", href: "/career", icon: Target },
    { name: "Network", href: "/network", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Feed", href: "/feed", icon: Calendar },
    { name: "Profile", href: "/profile", icon: UserCheck },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 lg:left-[var(--sidebar-width,250px)] right-0 z-30 w-full lg:w-[calc(100%-var(--sidebar-width,250px))] bg-[#FAF7F8] border-b border-[#F0E3E7] shadow-sm shrink-0"
        style={{
          height: "var(--navbar-height, 64px)",
        }}
      >
        <div className="flex items-center justify-between px-4 lg:px-6 h-full max-w-[1440px] mx-auto gap-4">
          
          {/* Mobile Brand (Shown only on small screens) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[15px] font-bold text-[#1E1218]">AgentVerse</span>
            </Link>
          </div>

          {/* Desktop Left Greeting */}
          <div className="hidden lg:flex flex-col justify-center shrink-0">
            <h1 className="text-[17px] font-bold text-[#1E1218] flex items-center gap-1.5 leading-tight">
              Welcome back, Rohan! 👋
            </h1>
            <p className="text-[11px] text-[#7D6F77] font-medium leading-tight">
              Your journey. Your network. Your future.
            </p>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-[420px] relative mx-auto">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08E98] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search alumni, skills, companies..."
              className="w-full pl-10 pr-4 py-2 text-xs text-[#1E1218] bg-white border border-[#E8D1D8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7A1443]/30 focus:border-[#7A1443] transition-all placeholder:text-[#A08E98] shadow-xs"
            />
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-full text-[#5A0C32] hover:bg-[#F0E3E7]/60 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C0336B] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#FAF7F8]">
                3
              </span>
            </Link>

            {/* Profile Avatar Pill matching screenshot */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white border border-[#E8D1D8] hover:border-[#7A1443]/50 transition shadow-xs group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#7A1443] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                R
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[12px] font-bold text-[#1E1218] group-hover:text-[#7A1443] transition">
                  Rohan Varma
                </span>
                <span className="text-[10px] text-[#7D6F77] font-medium">
                  ECE • Final Year
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#7D6F77] group-hover:text-[#1E1218] transition ml-0.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#5A0C32] hover:bg-[#F0E3E7]/60 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Fixed below Navbar on mobile) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 bottom-0 z-50 bg-[#1E0412]/95 backdrop-blur-md border-t border-[#3A0820] px-4 py-4 space-y-1.5 overflow-y-auto"
          style={{ top: "var(--navbar-height, 64px)" }}
        >
          <div className="p-3 mb-2 rounded-xl bg-white/10 text-white flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7A1443] flex items-center justify-center font-bold text-xs text-white">
              R
            </div>
            <div>
              <p className="text-xs font-bold">Rohan Varma</p>
              <p className="text-[10px] text-rose-200">ECE • Final Year</p>
            </div>
          </div>
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


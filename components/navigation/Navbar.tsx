"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Compass, 
  Users, 
  MessageSquare, 
  Briefcase, 
  LayoutDashboard,
  Target,
  Menu,
  X,
  UserCheck,
  Bell,
  Settings,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Career Goal", href: "/career", icon: Target },
    { name: "Network Explorer", href: "/network", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Opportunities", href: "/opportunities", icon: Briefcase },
    { name: "Feed", href: "/feed", icon: Compass },
    { name: "Profile", href: "/profile", icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#090d16]">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              AlumniVerse
              <Badge variant="indigo" size="sm" className="hidden sm:inline-flex text-[10px]">
                Agentic OS
              </Badge>
            </span>
            <p className="text-[10px] text-slate-400 hidden sm:block">AI Career & Alumni Network Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Notifications, Settings, Profile */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Notifications link with indicator */}
          <Link
            href="/notifications"
            className={cn(
              "relative p-2 rounded-xl border transition-colors",
              pathname === "/notifications"
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                : "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
            )}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#090d16]" />
          </Link>

          {/* Settings link */}
          <Link
            href="/settings"
            className={cn(
              "p-2 rounded-xl border transition-colors",
              pathname === "/settings"
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                : "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
            )}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* User Mini Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              R
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition leading-tight">
                Rohan Varma
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                ECE @ ABC College
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#090d16] px-4 pt-2 pb-6 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg",
                  active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-300 hover:bg-slate-800/60"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <Link
              href="/notifications"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-800 text-xs text-slate-300"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              Notifications
            </Link>
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-800 text-xs text-slate-300"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

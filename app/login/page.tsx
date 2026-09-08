"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  Briefcase 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("rohan@example.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemoLogin = (role: "student" | "alumni") => {
    setLoading(true);
    if (role === "student") {
      setEmail("rohan@example.com");
    } else {
      setEmail("rahul.sharma@example.com");
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with brand and back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Alumni<span className="text-indigo-400">Verse</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {activeTab === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          The agentic AI career network connecting education to opportunity
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="glass-panel border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
          {/* Explanatory Banner: Unified Identity Guarantee */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Unified Identity Architecture</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                One account for both student and alumni journeys. You will never be locked into a rigid binary role.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("signin")}
              className={`py-2 rounded-lg transition ${
                activeTab === "signin"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 rounded-lg transition ${
                activeTab === "signup"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Logins Bar */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">
              1-Click Hackathon Demo Access:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student")}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                      Rohan Varma (Student/ECE)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Target: Cloud Engineer • 68% Readiness
                    </div>
                  </div>
                </div>
                <Badge variant="indigo" size="sm">Demo User</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("alumni")}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300">
                      Rahul Sharma (Alumni Mentor)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sr. Cloud Architect @ AWS • 94% Match
                    </div>
                  </div>
                </div>
                <Badge variant="purple" size="sm">Mentor Demo</Badge>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider">or sign in with email</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-xs"
              disabled={loading}
            >
              {loading ? "Authenticating..." : activeTab === "signin" ? "Sign In to Platform" : "Create My Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Social Logins */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-3">
            {["Google", "GitHub", "LinkedIn"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-medium text-slate-300 transition"
              >
                {provider}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-indigo-400 transition">
              ← Return to AlumniVerse home page
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

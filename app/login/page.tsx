"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  ShieldCheck, 
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
    <div className="min-h-screen bg-[#FAF7F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F4CEDB]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FDF2F5] rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with brand and back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 group-hover:scale-105 transition-transform">
            {/* AlumNet inline SVG logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AlumNet logo">
              <defs>
                <linearGradient id="login-outer" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FA1561" />
                  <stop offset="35%" stopColor="#D81B60" />
                  <stop offset="70%" stopColor="#880E4F" />
                  <stop offset="100%" stopColor="#4A0023" />
                </linearGradient>
                <linearGradient id="login-top-left" x1="6" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF2A75" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#C2185B" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="login-top-right" x1="34" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FA1561" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#AD1457" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="login-cube-left" x1="12" y1="15.3" x2="20" y2="29.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE5EE" />
                  <stop offset="100%" stopColor="#F8BBD0" />
                </linearGradient>
                <linearGradient id="login-cube-right" x1="28" y1="15.3" x2="20" y2="29.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F48FB1" />
                  <stop offset="100%" stopColor="#EC407A" />
                </linearGradient>
              </defs>
              <path d="M17.5 2.87C19.05 1.98 20.95 1.98 22.5 2.87L34.1 9.57C35.65 10.46 36.6 12.1 36.6 13.89V26.11C36.6 27.9 35.65 29.54 34.1 30.43L22.5 37.13C20.95 38.02 19.05 38.02 17.5 37.13L5.9 30.43C4.35 29.54 3.4 27.9 3.4 26.11V13.89C3.4 12.1 4.35 10.46 5.9 9.57L17.5 2.87Z" fill="url(#login-outer)" />
              <path d="M20 2.5C26 2.5 35 8 35 14C35 19 28 20 20 20C12 20 5 19 5 14C5 8 14 2.5 20 2.5Z" fill="url(#login-top-right)" opacity="0.6" />
              <path d="M5.5 11C12 11 20 20 20 27.5C20 33 13 36.5 7.5 31C3.5 27 3.5 16 5.5 11Z" fill="url(#login-top-left)" opacity="0.5" />
              <path d="M12 15.3L20 19.9V29.5L12 24.9V15.3Z" fill="url(#login-cube-left)" />
              <path d="M20 19.9L28 15.3V24.9L20 29.5V19.9Z" fill="url(#login-cube-right)" />
              <path d="M20 10.7L28 15.3L20 19.9L12 15.3L20 10.7Z" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#1E1218] tracking-tight">
            Alum<span className="text-[#FA1561]">Net</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-[#1E1218]">
          {activeTab === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-xs text-[#735362] mt-1">
          The agentic AI career network connecting education to opportunity
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="bg-white border-[#F0E3E7] p-6 sm:p-8 space-y-6 shadow-xl rounded-3xl relative">
          {/* Explanatory Banner: Unified Identity Guarantee */}
          <div className="p-3.5 rounded-2xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#7A1443] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#5A0C32]">Unified Identity Architecture</h4>
              <p className="text-[11px] text-[#735362] leading-relaxed">
                One account for both student and alumni journeys. You will never be locked into a rigid binary role.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF7F8] rounded-2xl border border-[#F0E3E7] text-xs font-semibold">
            <button
              onClick={() => setActiveTab("signin")}
              className={`py-2 rounded-xl transition ${
                activeTab === "signin"
                  ? "bg-[#5A0C32] text-white shadow-sm"
                  : "text-[#735362] hover:text-[#1E1218]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 rounded-xl transition ${
                activeTab === "signup"
                  ? "bg-[#5A0C32] text-white shadow-sm"
                  : "text-[#735362] hover:text-[#1E1218]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Logins Bar */}
          <div className="space-y-2">
            <span className="text-[11px] text-[#735362] font-semibold block">
              1-Click Hackathon Demo Access:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F8] hover:bg-[#FDF2F5] border border-[#F0E3E7] hover:border-[#F4CEDB] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] text-[#7A1443] flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1218] group-hover:text-[#5A0C32]">
                      Rohan Varma (Student/ECE)
                    </div>
                    <div className="text-[10px] text-[#735362]">
                      Target: Cloud Engineer • 68% Readiness
                    </div>
                  </div>
                </div>
                <Badge variant="wine" size="sm">Demo User</Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("alumni")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F8] hover:bg-[#FDF2F5] border border-[#F0E3E7] hover:border-[#F4CEDB] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF2F5] text-[#7A1443] flex items-center justify-center font-bold text-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1218] group-hover:text-[#5A0C32]">
                      Rahul Sharma (Alumni Mentor)
                    </div>
                    <div className="text-[10px] text-[#735362]">
                      Sr. Cloud Architect @ AWS • 94% Match
                    </div>
                  </div>
                </div>
                <Badge variant="rose" size="sm">Mentor Demo</Badge>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#F0E3E7]" />
            <span className="flex-shrink mx-3 text-[11px] text-[#9C7A8A] uppercase tracking-wider font-semibold">or sign in with email</span>
            <div className="flex-grow border-t border-[#F0E3E7]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1E1218]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9C7A8A] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E1218] focus:outline-none focus:border-[#7A1443] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1E1218]">Password</label>
                <span className="text-[10px] text-[#7A1443] hover:underline cursor-pointer font-medium">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9C7A8A] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E1218] focus:outline-none focus:border-[#7A1443] focus:bg-white transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-xs shadow-md shadow-[#5A0C32]/25"
              disabled={loading}
            >
              {loading ? "Authenticating..." : activeTab === "signin" ? "Sign In to Platform" : "Create My Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Social Logins */}
          <div className="pt-2 border-t border-[#F0E3E7] flex items-center justify-center gap-3">
            {["Google", "GitHub", "LinkedIn"].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F8] border border-[#F0E3E7] hover:border-[#F4CEDB] text-[11px] font-semibold text-[#735362] hover:text-[#1E1218] transition"
              >
                {provider}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-[#735362] hover:text-[#5A0C32] font-medium transition">
              ← Return to AlumNet home page
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

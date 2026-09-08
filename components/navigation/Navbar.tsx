"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell, ChevronDown, Menu, X,
} from "lucide-react";

// AlumNet inline SVG logo matching the provided brand image:
// 3D geometric hex/cube icon in burgundy/magenta, "Alum" in dark navy, "Net" in pink/magenta
function AlumNetLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AlumNet logo"
    >
      <defs>
        {/* Outer rounded hex gradient */}
        <linearGradient id="an-outer" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FA1561" />
          <stop offset="35%" stopColor="#D81B60" />
          <stop offset="70%" stopColor="#880E4F" />
          <stop offset="100%" stopColor="#4A0023" />
        </linearGradient>

        {/* Facet gradients for 3D gemstone effect */}
        <linearGradient id="an-top-left" x1="6" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2A75" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C2185B" stopOpacity="0.7" />
        </linearGradient>

        <linearGradient id="an-top-right" x1="34" y1="6" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FA1561" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#AD1457" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="an-cube-left" x1="12" y1="15.3" x2="20" y2="29.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE5EE" />
          <stop offset="100%" stopColor="#F8BBD0" />
        </linearGradient>

        <linearGradient id="an-cube-right" x1="28" y1="15.3" x2="20" y2="29.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F48FB1" />
          <stop offset="100%" stopColor="#EC407A" />
        </linearGradient>
      </defs>

      {/* 1. Outer rounded hexagon background */}
      <path
        d="M17.5 2.87C19.05 1.98 20.95 1.98 22.5 2.87L34.1 9.57C35.65 10.46 36.6 12.1 36.6 13.89V26.11C36.6 27.9 35.65 29.54 34.1 30.43L22.5 37.13C20.95 38.02 19.05 38.02 17.5 37.13L5.9 30.43C4.35 29.54 3.4 27.9 3.4 26.11V13.89C3.4 12.1 4.35 10.46 5.9 9.57L17.5 2.87Z"
        fill="url(#an-outer)"
      />

      {/* 2. Curved petal overlays for gemstone shading */}
      <path
        d="M20 2.5C26 2.5 35 8 35 14C35 19 28 20 20 20C12 20 5 19 5 14C5 8 14 2.5 20 2.5Z"
        fill="url(#an-top-right)"
        opacity="0.6"
      />
      <path
        d="M5.5 11C12 11 20 20 20 27.5C20 33 13 36.5 7.5 31C3.5 27 3.5 16 5.5 11Z"
        fill="url(#an-top-left)"
        opacity="0.5"
      />

      {/* 3. Center 3D Isometric Cube */}
      {/* Left face */}
      <path
        d="M12 15.3L20 19.9V29.5L12 24.9V15.3Z"
        fill="url(#an-cube-left)"
      />

      {/* Right face */}
      <path
        d="M20 19.9L28 15.3V24.9L20 29.5V19.9Z"
        fill="url(#an-cube-right)"
      />

      {/* Top face (White Diamond) */}
      <path
        d="M20 10.7L28 15.3L20 19.9L12 15.3L20 10.7Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between px-4 lg:px-5 h-full w-full">
          {/* ── LEFT: Brand ── */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="group-hover:scale-105 transition-transform">
              <AlumNetLogo size={36} />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight leading-none select-none">
              <span className="text-white">Alum</span>
              <span style={{ color: "#FA1561" }}>Net</span>
            </span>
          </Link>

          {/* ── MIDDLE: intentionally empty — clean space ── */}
          <div className="flex-1" />

          {/* ── RIGHT: Notification + Profile — always visible on lg+, condensed on smaller ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-full text-rose-200/80 hover:text-white hover:bg-white/10 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Profile pill — full on lg+, avatar-only on smaller */}
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-1.5 pr-1.5 lg:pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                R
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-white">Rohan Varma</span>
              <span className="hidden lg:inline text-[10px] text-rose-300/80">Student</span>
              <ChevronDown className="hidden lg:inline w-3.5 h-3.5 text-rose-300/70" />
            </Link>
          </div>

          {/* Mobile hamburger — only on screens below lg where sidebar is hidden */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-rose-300 hover:text-white rounded-lg ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown — notification + profile only, shown below lg (where sidebar is hidden) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed left-0 right-0 z-50 bg-[#1E0412]/95 backdrop-blur-md border-t border-[#3A0820] px-4 py-4 space-y-2"
          style={{ top: "var(--navbar-height, 56px)" }}
        >
          <Link
            href="/notifications"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl text-rose-200/80 hover:bg-white/10 hover:text-white transition"
          >
            <Bell className="h-4 w-4" />
            Notifications
            <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl text-rose-200/80 hover:bg-white/10 hover:text-white transition"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7A1443] to-[#C0336B] flex items-center justify-center text-white text-[10px] font-bold">
              R
            </div>
            <div>
              <p className="text-white font-semibold">Rohan Varma</p>
              <p className="text-rose-300/70 text-[10px]">Student</p>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

"use client";

import React from "react";
import { Zap } from "lucide-react";

interface PageHeroProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tagline?: string;
}

/**
 * Shared hero banner used across every platform page.
 * Matches the AI Career page design: deep wine gradient with pink arc
 * streaks on the right side, brain icon circle with glow, italic tagline.
 */
export function PageHero({ icon, title, subtitle, tagline }: PageHeroProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white flex items-center justify-between"
      style={{
        background:
          "linear-gradient(110deg, #1a0410 0%, #3b0920 35%, #5c0c30 55%, #7a1040 70%, #6b0d38 80%, #4a0826 100%)",
        minHeight: "112px",
      }}
    >
      {/* ── Pink / magenta arc streaks (right side) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute right-0 top-0 h-full w-[55%]"
          viewBox="0 0 400 140"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          <ellipse cx="340" cy="10"  rx="180" ry="90"  fill="none" stroke="#e0185a" strokeWidth="1.5" opacity="0.55" />
          <ellipse cx="360" cy="20"  rx="150" ry="75"  fill="none" stroke="#f02060" strokeWidth="1"   opacity="0.4"  />
          <ellipse cx="380" cy="-10" rx="200" ry="110" fill="none" stroke="#c0104a" strokeWidth="0.8" opacity="0.3"  />
          <line x1="200" y1="0" x2="400" y2="80"  stroke="#e8306a" strokeWidth="0.8" opacity="0.35" />
          <line x1="220" y1="0" x2="400" y2="100" stroke="#ff4080" strokeWidth="0.5" opacity="0.25" />
          <line x1="250" y1="0" x2="400" y2="120" stroke="#d01855" strokeWidth="0.6" opacity="0.2"  />
          <ellipse cx="320" cy="70"  rx="90" ry="50" fill="#c01848" opacity="0.18" />
          <ellipse cx="360" cy="60"  rx="60" ry="35" fill="#e82060" opacity="0.12" />
        </svg>
        {/* subtle pink glow right-half */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2"
          style={{
            background:
              "radial-gradient(ellipse at 85% 40%, rgba(200,20,70,0.22) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Left content ── */}
      <div className="flex items-center gap-5 relative z-10 px-6 py-5">
        {/* Icon circle with glow */}
        <div
          className="relative shrink-0 w-[68px] h-[68px] rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle, rgba(180,20,60,0.5) 0%, rgba(100,10,40,0.3) 100%)",
            border: "1.5px solid rgba(230,60,100,0.6)",
            boxShadow:
              "0 0 18px rgba(200,30,70,0.45), inset 0 0 12px rgba(200,30,70,0.2)",
          }}
        >
          {icon}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{
                background: "rgba(220,40,80,0.25)",
                border: "1px solid rgba(230,60,100,0.45)",
                color: "#ffb3c8",
              }}
            >
              <Zap className="w-3 h-3" />
              Powered by AI
            </span>
          </div>
          <p
            className="text-[13px] leading-relaxed max-w-[420px]"
            style={{ color: "rgba(255,200,215,0.85)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* ── Right italic tagline ── */}
      <div className="hidden xl:block relative z-10 text-right pr-8 py-5 shrink-0">
        <p
          className="text-[17px] font-light italic leading-snug"
          style={{ color: "rgba(255,210,225,0.9)" }}
        >
          {tagline ? tagline.split("\n")[0] : "Smarter insights."}
        </p>
        <p
          className="text-[17px] font-light italic leading-snug"
          style={{ color: "rgba(255,210,225,0.9)" }}
        >
          {tagline ? tagline.split("\n")[1] : "Better decisions."}
        </p>
        <p className="text-[19px] font-bold italic leading-snug text-white">
          {tagline ? tagline.split("\n")[2] : "Brighter future."}
        </p>
      </div>
    </div>
  );
}

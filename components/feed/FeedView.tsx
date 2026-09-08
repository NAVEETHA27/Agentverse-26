"use client";

import React, { useState } from "react";
import {
  Heart, MessageCircle, Share2, Send, Sparkles,
  Award, Rocket, Lightbulb, Trophy, Briefcase, Compass, Users,
  MoreHorizontal, Image, Video, FileText, BarChart, Calendar, Tag
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toggleLikePost, createPost } from "@/lib/database/feed";
import type { EnrichedPost } from "@/lib/database/feed";
import type { UserRow } from "@/lib/database/users";

const TABS = ["All Posts", "Recommended Posts", "Alumni Posts", "Career Insights", "Projects", "Hackathons", "Certifications", "Job Updates"];

const TRENDING = [
  { rank: 1, topic: "Generative AI", posts: "1.2K posts" },
  { rank: 2, topic: "Product Management", posts: "980 posts" },
  { rank: 3, topic: "Data Science", posts: "875 posts" },
  { rank: 4, topic: "Career Growth", posts: "620 posts" },
  { rank: 5, topic: "Startups", posts: "540 posts" },
];

const SUGGESTED = [
  { name: "Aman Verma", role: "Engineering Manager at Amazon", mutual: 12 },
  { name: "Priya Sood", role: "UX Researcher at Google", mutual: 8 },
  { name: "Karan Singh", role: "Engineer at Snowflake", mutual: 15 },
  { name: "Simran Kaur", role: "Founder at CodeBridge", mutual: 9 },
];

const MOCK_POSTS = [
  {
    id: "p1", name: "Rohan Mehta", degree: "IIT Bombay '16", role: "Senior Data Scientist at Google",
    connection: "2nd", time: "2h ago", public: true,
    content: "Just published a deep dive on how LLMs are transforming recommendation systems.\nWould love to hear your thoughts and feedback!\nhttps://medium.com/@rohanmehta/llms-recommendations",
    likes: 128, comments: 24, hasLink: true,
    likers: ["Aditi Rao", "Karan Singh"],
  },
  {
    id: "p2", name: "Neha Iyer", degree: "BITS Pilani '14", role: "Product Manager at Microsoft",
    connection: "1st", time: "5h ago", public: true,
    content: "Excited to share that our team just shipped a new AI feature in Microsoft 365!\nGrateful to my mentors and peers from BITS Pilani for the support always. 💜\nHappy to connect with fellow product folks!",
    likes: 96, comments: 18, hasLink: false,
    likers: ["Arjun Nair", "Priya Sood"],
  },
];

interface FeedViewProps {
  currentUser: UserRow;
  initialPosts: EnrichedPost[];
}

export function FeedView({ currentUser, initialPosts }: FeedViewProps) {
  const [activeTab, setActiveTab] = useState("All Posts");
  const [postText, setPostText] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posts] = useState(MOCK_POSTS);

  const toggleLike = (id: string) => {
    setLikedPosts((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="flex gap-4">
      {/* ── Center: Feed ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Tab bar */}
        <div className="bg-white border border-[#F0E3E7] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center overflow-x-auto border-b border-[#F0E3E7]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                  activeTab === tab
                    ? "border-[#7A1443] text-[#7A1443]"
                    : "border-transparent text-[#7D6F77] hover:text-[#1E1218]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Create Post */}
          <div className="p-4">
            <p className="text-sm font-bold text-[#1E1218] mb-3">Create Post</p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your thoughts, ask a question, or update your network..."
                  rows={3}
                  className="w-full bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl px-3 py-2.5 text-xs text-[#1E1218] focus:outline-none focus:border-[#7A1443] resize-none transition"
                />
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F0E3E7]">
                  <div className="flex items-center gap-2">
                    {[
                      { icon: Image, label: "Photo" },
                      { icon: Video, label: "Video" },
                      { icon: FileText, label: "Document" },
                      { icon: BarChart, label: "Poll" },
                      { icon: Calendar, label: "Event" },
                    ].map(({ icon: Icon, label }) => (
                      <button key={label} className="flex items-center gap-1 text-[11px] text-[#7D6F77] hover:text-[#1E1218] px-2 py-1 rounded-lg hover:bg-[#FAF7F8] transition">
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" variant="primary" disabled={!postText.trim()}>
                    Post <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-[#F0E3E7] rounded-2xl p-4 shadow-sm space-y-3">
            {/* Author */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {post.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-[#1E1218]">{post.name}</p>
                    <span className="text-[#7D6F77] text-xs">• {post.connection}</span>
                  </div>
                  <p className="text-[11px] text-[#7D6F77]">{post.role} • {post.degree}</p>
                  <p className="text-[10px] text-[#7D6F77]">{post.time} · {post.public ? "🌐" : "👥"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-[10px] text-[#7A1443] font-semibold bg-[#FDF2F5] border border-[#F4CEDB] rounded-full px-2 py-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI Post Intelligence
                </button>
                <button><MoreHorizontal className="w-4 h-4 text-[#7D6F77]" /></button>
              </div>
            </div>

            {/* Content */}
            <p className="text-xs text-[#2A1420] leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {/* Engagement */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F0E3E7] text-xs text-[#7D6F77]">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {post.likers.map((l) => (
                    <div key={l} className="w-4 h-4 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] border border-white text-white text-[7px] font-bold flex items-center justify-center">{l.charAt(0)}</div>
                  ))}
                </div>
                <span>{post.likers.slice(0, 2).join(", ")} and {post.likes - 2} others liked this</span>
              </div>
              <button className="hover:underline">View all comments</button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs transition ${likedPosts.has(post.id) ? "text-[#7A1443] font-semibold" : "text-[#7D6F77] hover:text-[#1E1218]"}`}
              >
                <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[#7D6F77] hover:text-[#1E1218]">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[#7D6F77] hover:text-[#1E1218]">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: Trending + Suggested ── */}
      <div className="w-[240px] shrink-0 space-y-4">
        {/* Trending */}
        <div className="bg-white border border-[#F0E3E7] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#1E1218]">Trending Topics</p>
            <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-2.5">
            {TRENDING.map((t) => (
              <div key={t.rank} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FDF2F5] text-[#7A1443] text-[10px] font-bold flex items-center justify-center shrink-0">{t.rank}</span>
                <div>
                  <p className="text-xs font-semibold text-[#1E1218]">{t.topic}</p>
                  <p className="text-[10px] text-[#7D6F77]">{t.posts}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested People */}
        <div className="bg-white border border-[#F0E3E7] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#1E1218]">Suggested People</p>
            <button className="text-[11px] text-[#7A1443] font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {SUGGESTED.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1E1218] leading-tight">{s.name}</p>
                    <p className="text-[10px] text-[#7D6F77] leading-tight">{s.role}</p>
                    <p className="text-[9px] text-[#7D6F77]">{s.mutual} mutual connections</p>
                  </div>
                </div>
                <button className="text-[11px] font-semibold text-[#7A1443] border border-[#7A1443] rounded-full px-2 py-0.5 hover:bg-[#FDF2F5] transition shrink-0">
                  Connect
                </button>
              </div>
            ))}
          </div>
          <button className="mt-2 text-[11px] text-[#7A1443] font-semibold hover:underline w-full text-center">Discover more alumni →</button>
        </div>

        {/* Profile strength */}
        <div className="bg-white border border-[#F0E3E7] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A0C32] to-[#A72B5F] flex items-center justify-center text-white text-sm font-bold">
              {currentUser.full_name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E1218]">{currentUser.full_name}</p>
              <p className="text-[10px] text-[#7D6F77]">Product Designer</p>
              <p className="text-[10px] text-[#7D6F77]">Bangalore, India</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#4A3E45]">Profile Strength</span>
              <span className="font-bold text-[#1E1218]">80%</span>
            </div>
            <div className="w-full bg-[#F5ECF0] rounded-full h-1.5">
              <div className="bg-[#7A1443] h-1.5 rounded-full" style={{ width: "80%" }} />
            </div>
          </div>
          <button className="mt-2 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] text-[11px] text-[#7A1443] font-semibold hover:bg-[#FCE7ED] transition">
            <span>Verify your profile</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <p className="text-[10px] text-[#7D6F77] mt-1 text-center">Increase credibility</p>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}><path d="m9 18 6-6-6-6" /></svg>;
}

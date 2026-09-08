"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Layers,
  Clock,
  Rocket,
  Lightbulb,
  Trophy,
  Briefcase,
  Tag,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toggleLikePost, createPost } from "@/lib/database/feed";
import type { EnrichedPost } from "@/lib/database/feed";
import type { UserRow } from "@/lib/database/users";

interface FeedViewProps {
  currentUser: UserRow;
  initialPosts: EnrichedPost[];
}

const CATEGORIES = [
  { id: "all", label: "All Updates", icon: Compass },
  { id: "project_launch", label: "Projects", icon: Rocket },
  { id: "certification", label: "Certifications", icon: Award },
  { id: "career_advice", label: "Career Advice", icon: Lightbulb },
  { id: "hackathon", label: "Hackathons", icon: Trophy },
  { id: "job_update", label: "Job Updates", icon: Briefcase },
];

const KNOWN_SKILLS = [
  "AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", 
  "Python", "React", "Next.js", "TypeScript", "PostgreSQL", "MQTT", "C++"
];

export function FeedView({
  currentUser,
  initialPosts,
}: FeedViewProps) {
  const [posts, setPosts] = useState<EnrichedPost[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("project_launch");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", postId }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likes_count: result.likesCount,
                    user_has_liked: result.userHasLiked,
                  }
                : p
            )
          );
          return;
        }
      }
    } catch {
      // fallback
    }

    const result = await toggleLikePost(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes_count: result.likesCount,
              user_has_liked: result.userHasLiked,
            }
          : p
      )
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isPublishing) return;

    setIsPublishing(true);
    const content = newPostContent.trim();
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content,
          postType: selectedCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.post) {
          setPosts((prev) => [data.post, ...prev]);
          setNewPostContent("");
          return;
        }
      }

      // fallback
      const created = await createPost(currentUser.id, content, selectedCategory as any);
      setPosts((prev) => [created, ...prev]);
      setNewPostContent("");
    } catch {
      const created = await createPost(currentUser.id, content, selectedCategory as any);
      setPosts((prev) => [created, ...prev]);
      setNewPostContent("");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleShare = (postId: string) => {
    setCopiedPostId(postId);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const toggleCommentBox = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "all") return true;
    return (p.post_type || "general").toLowerCase() === activeFilter.toLowerCase();
  });

  // Helper to extract known skills from text
  const extractSkills = (text: string) => {
    return KNOWN_SKILLS.filter((skill) => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(text);
    });
  };

  // Helper for AI intelligence tag
  const getAiTag = (post: EnrichedPost) => {
    const content = post.content.toLowerCase();
    if (content.includes("cloud") || content.includes("aws") || content.includes("docker") || content.includes("terraform")) {
      return "Relevant to your Cloud Engineer goal";
    }
    if (post.author?.headline?.toLowerCase().includes("engineer") || (post.author as any)?.role === "alumni") {
      return "Features Alumni from your College Network";
    }
    return "Trending Career Milestone";
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" />
            Alumni & Student Achievement Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Community milestones, project launches, career transitions, and AI-grounded mentorship insights.
          </p>
        </div>
        <Badge variant="purple" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
          Community Pulse
        </Badge>
      </div>

      {/* Share Update Box with Category Picker */}
      <Card className="glass-panel border-indigo-500/20">
        <form onSubmit={handleCreatePost} className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share a project milestone, certification, or learning takeaway..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              
              {/* Category selector */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Category:</span>
                {[
                  { id: "project_launch", label: "Project Launch" },
                  { id: "certification", label: "Certification" },
                  { id: "career_advice", label: "Career Advice" },
                  { id: "hackathon", label: "Hackathon" },
                  { id: "job_update", label: "Job Update" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI highlights mentioned tech skills in the community graph</span>
            </div>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!newPostContent.trim() || isPublishing}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {isPublishing ? "Publishing..." : "Share Milestone"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="glass-panel text-center py-10">
            <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No posts found in this category</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to share an achievement!</p>
          </Card>
        ) : (
          filteredPosts.map((post) => {
            const author = post.author;
            const detectedSkills = extractSkills(post.content);
            const aiTag = getAiTag(post);
            const isCommentsOpen = !!expandedComments[post.id];
            const isCopied = copiedPostId === post.id;

            return (
              <Card key={post.id} className="glass-panel border-slate-800 hover:border-slate-700/80 transition">
                <div className="p-5 space-y-3.5">
                  {/* Author Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {author?.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">
                            {author?.full_name || "Community Member"}
                          </h3>
                          {(author as any)?.role === "alumni" && (
                            <Badge variant="indigo" size="sm">Alumni</Badge>
                          )}
                          {(author as any)?.role === "student" && (
                            <Badge variant="emerald" size="sm">Student</Badge>
                          )}
                          {post.post_type && post.post_type !== "general" && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase tracking-wider font-mono">
                              {post.post_type.replace("_", " ")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {author?.headline || "Tech Professional"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Automated Skill Tags Highlight */}
                  {detectedSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mr-1">Skills:</span>
                      {detectedSkills.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50 text-[11px] font-mono text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI Intelligence Tag */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong className="text-white">AI Context:</strong> {aiTag}</span>
                  </div>

                  {/* Interaction Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-5">
                      {/* Like button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition ${
                          post.user_has_liked
                            ? "text-rose-400 font-semibold"
                            : "hover:text-rose-400 text-slate-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.user_has_liked ? "fill-current" : ""}`} />
                        <span>{post.likes_count} Likes</span>
                      </button>

                      {/* Comment toggle */}
                      <button
                        onClick={() => toggleCommentBox(post.id)}
                        className="flex items-center gap-1.5 hover:text-indigo-400 transition"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-500" />
                        <span>{post.comments_count} Comments</span>
                      </button>

                      {/* Share button */}
                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-1.5 hover:text-sky-400 transition"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-slate-500" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>Verified Network Entry</span>
                    </div>
                  </div>

                  {/* Collapsible Discussion Mock */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-slate-800/60 space-y-2">
                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                          <span className="text-indigo-300 font-semibold">Rahul Sharma</span>
                          <span>2h ago</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          Great progress! Be sure to integrate automated health check probes in your next milestone.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write a congratulatory note or question..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <Button size="sm" variant="outline">Reply</Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

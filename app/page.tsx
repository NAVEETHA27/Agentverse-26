import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Network, 
  MessageSquare, 
  TrendingUp, 
  Award,
  ChevronRight,
  UserCheck,
  Bot,
  Briefcase
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090d16] text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge variant="indigo" size="md" className="px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400 animate-pulse" />
              24-Hour Hackathon • Agentic AI Innovation
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Your Career Goal. <br className="hidden sm:inline" />
              <span className="gradient-text">Your Network.</span> <br className="hidden sm:inline" />
              Your Next Opportunity.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed">
              Discover the right people and make networking useful. An agentic AI career network that understands your goals, finds the right people to help you reach them, and continuously guides your next career move.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/network" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full">
                  Explore Network
                </Button>
              </Link>
            </div>

            {/* Platform Philosophy Tagline */}
            <p className="text-xs text-slate-400 italic pt-3">
              &quot;Don&apos;t just tell users WHO the alumni are. Tell them WHO they should talk to, WHY they should talk to them, and WHAT they should do next.&quot;
            </p>
          </div>

          {/* Interactive Agent Journey Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <Card className="glass-panel border-slate-700/60 p-6 sm:p-8 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      Live Agentic AI Workflow Preview
                      <Badge variant="emerald" size="sm" className="text-[10px]">
                        Active State
                      </Badge>
                    </h3>
                    <p className="text-xs text-slate-400">Closed-Loop Career Navigation: Understand → Gap → Match → Message → Advice</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Orchestrator: 4 Agents Synchronized
                </div>
              </div>

              {/* Step Flow Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                {/* Step 1: Career Agent */}
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> 1. Career Agent
                      </span>
                      <Badge variant="indigo" size="sm">Goal Analyzed</Badge>
                    </div>
                    <div className="bg-slate-950/70 rounded p-2.5 text-xs text-slate-300 font-mono border border-slate-800/80">
                      &quot;I want to become a Cloud Engineer.&quot;
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <p className="text-[11px] font-semibold text-slate-300">Detected Skill Gaps:</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-rose-950/60 text-rose-300 text-[10px] px-1.5 py-0.5 rounded border border-rose-800/40">AWS</span>
                        <span className="bg-rose-950/60 text-rose-300 text-[10px] px-1.5 py-0.5 rounded border border-rose-800/40">Docker</span>
                        <span className="bg-rose-950/60 text-rose-300 text-[10px] px-1.5 py-0.5 rounded border border-rose-800/40">Kubernetes</span>
                        <span className="bg-rose-950/60 text-rose-300 text-[10px] px-1.5 py-0.5 rounded border border-rose-800/40">CI/CD</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-indigo-300 flex items-center justify-between">
                    <span>Readiness: 68%</span>
                    <span>Roadmap: 4 Phases</span>
                  </div>
                </div>

                {/* Step 2: Networking Agent */}
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" /> 2. Networking Agent
                      </span>
                      <Badge variant="sky" size="sm">94% Match</Badge>
                    </div>
                    <div className="bg-slate-950/70 rounded p-2.5 text-xs border border-slate-800/80">
                      <p className="font-semibold text-slate-200">Rahul Sharma</p>
                      <p className="text-[11px] text-slate-400">Cloud Architect • Amazon Web Services</p>
                      <p className="text-[10px] text-slate-500 mt-1">Alumni: ABC College (ECE 2021)</p>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <p className="text-[10px] font-semibold text-sky-300">Why Matched (Deterministic 100% Score):</p>
                      <ul className="space-y-0.5 text-[10px] text-slate-400">
                        <li className="flex items-center gap-1">✓ Same institution & ECE transition</li>
                        <li className="flex items-center gap-1">✓ Directly works with your missing skills</li>
                        <li className="flex items-center gap-1">✓ Active mentor in Cloud Computing</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-sky-300 flex items-center justify-between">
                    <span>Human Approval Required</span>
                    <Badge variant="amber" size="sm">Pending</Badge>
                  </div>
                </div>

                {/* Step 3: Relationship Agent */}
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> 3. Relationship Agent
                      </span>
                      <Badge variant="emerald" size="sm">Advice Extracted</Badge>
                    </div>
                    <div className="bg-slate-950/70 rounded p-2.5 text-xs border border-slate-800/80 text-slate-300">
                      <span className="text-emerald-400 font-semibold">Mentor Advice:</span>
                      <p className="text-[11px] italic mt-0.5">&quot;Master AWS Core & deploy a microservices project first.&quot;</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      <p className="text-[11px] font-semibold text-slate-300">Continuous Roadmap Action:</p>
                      <div className="bg-emerald-950/40 border border-emerald-800/40 rounded p-2 text-[10px] text-emerald-200">
                        Add &quot;AWS Microservices Deployment&quot; to roadmap?
                        <div className="flex gap-2 mt-1.5">
                          <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-medium">Approve</span>
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">Ignore</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-emerald-300 flex items-center justify-between">
                    <span>Next Best Action: Updated</span>
                    <span>Loop: Closed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4 Agent Architecture Overview */}
      <section className="py-16 border-t border-slate-800/80 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="purple" size="md">Specialized Intelligence</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
              Powered by 4 Purpose-Built AI Agents
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              No generic single prompts. Each agent is responsible for an explicit segment of your career and networking journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agent 1 */}
            <Card className="glass-card hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Career Agent</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Analyzes natural language goals, maps target competencies, conducts skill gap audits, and dynamically constructs milestone roadmaps.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-indigo-300 font-mono">
                tools: analyze_goal(), calc_gaps()
              </div>
            </Card>

            {/* Agent 2 */}
            <Card className="glass-card hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Networking Agent</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                The killer agent: Performs two-stage candidate retrieval, deterministic 5-factor scoring, generates transparent explanations, and drafts messages.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-300 font-mono">
                tools: semantic_search(), rank_alumni()
              </div>
            </Card>

            {/* Agent 3 */}
            <Card className="glass-card hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Relationship Agent</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Maintains mentorship momentum. Summarizes conversations, extracts actionable guidance, and prompts for roadmap updates with user approval.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-mono">
                tools: parse_chat(), extract_advice()
              </div>
            </Card>

            {/* Agent 4 */}
            <Card className="glass-card hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Profile & Opportunity</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extracts verified skills from projects and posts. Surfaces targeted internships, roles, and referrals that match your exact roadmap gaps.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-mono">
                tools: extract_skills(), match_jobs()
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Demo Flow / Hackathon Judge Defense Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="indigo" size="sm">Technical Innovation</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 leading-tight">
                Why this is Genuine Agentic AI, <br />
                <span className="text-slate-400 font-normal">Not Just Another Chatbot</span>
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Generic chatbots simply reply to text prompts with ungrounded answers. In contrast, AlumniVerse uses an autonomous agentic loop wrapped with human approval controls:
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Deterministic 5-Factor Scoring</h4>
                    <p className="text-xs text-slate-400">Goal (30%) + Skills (25%) + Education (20%) + Role (15%) + Experience (10%). No invented percentages.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-sky-500/20 text-sky-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Progressive No-Alumni Fallback</h4>
                    <p className="text-xs text-slate-400">Never says &quot;no alumni found&quot;. System expands from Institution → Broader Network → Industry Mentors with clear user notice.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Human-in-the-Loop Safeguards</h4>
                    <p className="text-xs text-slate-400">The agent prepares messages and roadmap edits, but never sends or modifies data without user approval.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Full Agent Traceability</h4>
                    <p className="text-xs text-slate-400">Judges can inspect the full execution trace: intent, tools used, candidate sets, decision logic, and state progression.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Comparison Box */}
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Traditional Chatbot (What We Avoided)
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  User Question → LLM Prompt → Unverified Text Response → End of interaction.
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  ❌ No database grounding, no state, no tool usage, no real connections, no follow-up.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-600/40 bg-emerald-950/20 p-5 shadow-lg shadow-emerald-950/30">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AlumniVerse Agentic System (What We Built)
                </div>
                <p className="text-xs text-slate-200 font-mono leading-relaxed">
                  Goal → Analyze Profile → Detect Gaps → Retrieve Candidates → Deterministic Scoring → Explain Match → Draft Action → Human Approval → Execute Connection → Extract Conversation Advice → Update Roadmap.
                </p>
                <p className="text-[11px] text-emerald-300/80 mt-2">
                  ✓ Database grounded, controlled tools, explainable, safe, and continuously adaptive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#06080f] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-white">AlumniVerse</span>
            <span className="text-xs text-slate-500">| PS6 AI-Based Alumni Career & Networking Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/career" className="hover:text-white transition-colors">Career</Link>
            <Link href="/network" className="hover:text-white transition-colors">Network</Link>
            <Link href="/chat" className="hover:text-white transition-colors">Messages</Link>
          </div>

          <Link href="/dashboard">
            <Button size="sm" variant="primary">
              Enter Platform
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}

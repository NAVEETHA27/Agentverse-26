import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  CheckCircle2, 
  Network, 
  MessageSquare, 
  Briefcase,
  Bot
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F8] text-[#1E1218]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#240516] via-[#3D0B22] to-[#FAF7F8] text-white">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-[#A81B5B]/20 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 h-64 w-64 rounded-full bg-[#5A0C32]/30 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge variant="rose" size="md" className="px-3.5 py-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#7A1443] animate-pulse" />
              24-Hour Hackathon • Agentic AI Innovation
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Your Career Goal. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#F4CEDB] via-[#FDF2F5] to-[#F4CEDB] bg-clip-text text-transparent">Your Network.</span> <br className="hidden sm:inline" />
              Your Next Opportunity.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#F4CEDB] font-normal leading-relaxed">
              Discover the right people and make networking useful. An agentic AI career network that understands your goals, finds the right people to help you reach them, and continuously guides your next career move.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full group shadow-lg shadow-[#5A0C32]/40">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/network" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20">
                  Explore Network
                </Button>
              </Link>
            </div>

            {/* Platform Philosophy Tagline */}
            <p className="text-xs text-[#F4CEDB]/80 italic pt-3">
              &quot;Don&apos;t just tell users WHO the alumni are. Tell them WHO they should talk to, WHY they should talk to them, and WHAT they should do next.&quot;
            </p>
          </div>

          {/* Interactive Agent Journey Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-md border-[#F0E3E7] p-6 sm:p-8 shadow-2xl rounded-3xl relative text-[#1E1218]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#F0E3E7] gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FDF2F5] text-[#7A1443]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1218] flex items-center gap-2">
                      Live Agentic AI Workflow Preview
                      <Badge variant="emerald" size="sm" className="text-[10px]">
                        Active State
                      </Badge>
                    </h3>
                    <p className="text-xs text-[#735362]">Closed-Loop Career Navigation: Understand → Gap → Match → Message → Advice</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#7A1443] font-mono font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Orchestrator: 4 Agents Synchronized
                </div>
              </div>

              {/* Step Flow Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                {/* Step 1: Career Agent */}
                <div className="rounded-2xl bg-[#FAF7F8] border border-[#F0E3E7] p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#7A1443] flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> 1. Career Agent
                      </span>
                      <Badge variant="wine" size="sm">Goal Analyzed</Badge>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 text-xs text-[#1E1218] font-mono border border-[#F0E3E7] shadow-sm">
                      &quot;I want to become a Cloud Engineer.&quot;
                    </div>
                    <div className="space-y-1.5 text-xs text-[#735362]">
                      <p className="text-[11px] font-bold text-[#1E1218]">Detected Skill Gaps:</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-[#FDF2F5] text-[#7A1443] text-[10px] px-2 py-0.5 rounded-full border border-[#F4CEDB] font-medium">AWS</span>
                        <span className="bg-[#FDF2F5] text-[#7A1443] text-[10px] px-2 py-0.5 rounded-full border border-[#F4CEDB] font-medium">Docker</span>
                        <span className="bg-[#FDF2F5] text-[#7A1443] text-[10px] px-2 py-0.5 rounded-full border border-[#F4CEDB] font-medium">Kubernetes</span>
                        <span className="bg-[#FDF2F5] text-[#7A1443] text-[10px] px-2 py-0.5 rounded-full border border-[#F4CEDB] font-medium">CI/CD</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#F0E3E7] text-[11px] text-[#7A1443] font-semibold flex items-center justify-between">
                    <span>Readiness: 68%</span>
                    <span>Roadmap: 4 Phases</span>
                  </div>
                </div>

                {/* Step 2: Networking Agent */}
                <div className="rounded-2xl bg-[#FAF7F8] border border-[#F0E3E7] p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5A0C32] flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" /> 2. Networking Agent
                      </span>
                      <Badge variant="rose" size="sm">94% Match</Badge>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 text-xs border border-[#F0E3E7] shadow-sm">
                      <p className="font-bold text-[#1E1218]">Rahul Sharma</p>
                      <p className="text-[11px] text-[#735362]">Cloud Architect • Amazon Web Services</p>
                      <p className="text-[10px] text-[#9C7A8A] mt-1">Alumni: ABC College (ECE 2021)</p>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#735362]">
                      <p className="text-[10px] font-bold text-[#5A0C32]">Why Matched (Deterministic 100% Score):</p>
                      <ul className="space-y-0.5 text-[10px] text-[#735362]">
                        <li className="flex items-center gap-1">✓ Same institution & ECE transition</li>
                        <li className="flex items-center gap-1">✓ Directly works with your missing skills</li>
                        <li className="flex items-center gap-1">✓ Active mentor in Cloud Computing</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#F0E3E7] text-[11px] text-[#7A1443] font-semibold flex items-center justify-between">
                    <span>Human Approval Required</span>
                    <Badge variant="amber" size="sm">Pending</Badge>
                  </div>
                </div>

                {/* Step 3: Relationship Agent */}
                <div className="rounded-2xl bg-[#FAF7F8] border border-[#F0E3E7] p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> 3. Relationship Agent
                      </span>
                      <Badge variant="emerald" size="sm">Advice Extracted</Badge>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 text-xs border border-[#F0E3E7] text-[#1E1218] shadow-sm">
                      <span className="text-emerald-700 font-bold">Mentor Advice:</span>
                      <p className="text-[11px] italic mt-0.5 text-[#735362]">&quot;Master AWS Core & deploy a microservices project first.&quot;</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#735362]">
                      <p className="text-[11px] font-bold text-[#1E1218]">Continuous Roadmap Action:</p>
                      <div className="bg-[#FAF7F8] border border-[#F0E3E7] rounded-xl p-2 text-[10px] text-[#1E1218]">
                        Add &quot;AWS Microservices Deployment&quot; to roadmap?
                        <div className="flex gap-2 mt-1.5">
                          <span className="bg-[#5A0C32] text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium">Approve</span>
                          <span className="bg-[#FAF7F8] border border-[#F0E3E7] text-[#735362] px-2.5 py-0.5 rounded-full text-[10px]">Ignore</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#F0E3E7] text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
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
      <section className="py-16 border-t border-[#F0E3E7] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="rose" size="md">Specialized Intelligence</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1218] mt-3">
              Powered by 4 Purpose-Built AI Agents
            </h2>
            <p className="text-sm text-[#735362] mt-2">
              No generic single prompts. Each agent is responsible for an explicit segment of your career and networking journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agent 1 */}
            <Card className="bg-[#FAF7F8] border-[#F0E3E7] hover:border-[#F4CEDB] transition-all hover:shadow-md rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] text-[#7A1443] flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1218]">Career Agent</h3>
              <p className="text-xs text-[#735362] mt-2 leading-relaxed">
                Analyzes natural language goals, maps target competencies, conducts skill gap audits, and dynamically constructs milestone roadmaps.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0E3E7] text-[11px] text-[#7A1443] font-mono font-medium">
                tools: analyze_goal(), calc_gaps()
              </div>
            </Card>

            {/* Agent 2 */}
            <Card className="bg-[#FAF7F8] border-[#F0E3E7] hover:border-[#F4CEDB] transition-all hover:shadow-md rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F5] text-[#7A1443] flex items-center justify-center mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1218]">Networking Agent</h3>
              <p className="text-xs text-[#735362] mt-2 leading-relaxed">
                The killer agent: Performs two-stage candidate retrieval, deterministic 5-factor scoring, generates transparent explanations, and drafts messages.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0E3E7] text-[11px] text-[#7A1443] font-mono font-medium">
                tools: semantic_search(), rank_alumni()
              </div>
            </Card>

            {/* Agent 3 */}
            <Card className="bg-[#FAF7F8] border-[#F0E3E7] hover:border-[#F4CEDB] transition-all hover:shadow-md rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1218]">Relationship Agent</h3>
              <p className="text-xs text-[#735362] mt-2 leading-relaxed">
                Maintains mentorship momentum. Summarizes conversations, extracts actionable guidance, and prompts for roadmap updates with user approval.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0E3E7] text-[11px] text-emerald-700 font-mono font-medium">
                tools: parse_chat(), extract_advice()
              </div>
            </Card>

            {/* Agent 4 */}
            <Card className="bg-[#FAF7F8] border-[#F0E3E7] hover:border-[#F4CEDB] transition-all hover:shadow-md rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1218]">Profile & Opportunity</h3>
              <p className="text-xs text-[#735362] mt-2 leading-relaxed">
                Extracts verified skills from projects and posts. Surfaces targeted internships, roles, and referrals that match your exact roadmap gaps.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0E3E7] text-[11px] text-amber-700 font-mono font-medium">
                tools: extract_skills(), match_jobs()
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Demo Flow / Hackathon Judge Defense Section */}
      <section className="py-16 bg-[#FAF7F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="wine" size="sm">Technical Innovation</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1218] mt-3 leading-tight">
                Why this is Genuine Agentic AI, <br />
                <span className="text-[#735362] font-normal">Not Just Another Chatbot</span>
              </h2>
              <p className="text-sm text-[#735362] mt-4 leading-relaxed">
                Generic chatbots simply reply to text prompts with ungrounded answers. In contrast, AlumNet uses an autonomous agentic loop wrapped with human approval controls:
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#FDF2F5] text-[#7A1443] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1218]">Deterministic 5-Factor Scoring</h4>
                    <p className="text-xs text-[#735362]">Goal (30%) + Skills (25%) + Education (20%) + Role (15%) + Experience (10%). No invented percentages.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#FDF2F5] text-[#7A1443] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1218]">Progressive No-Alumni Fallback</h4>
                    <p className="text-xs text-[#735362]">Never says &quot;no alumni found&quot;. System expands from Institution → Broader Network → Industry Mentors with clear user notice.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1218]">Human-in-the-Loop Safeguards</h4>
                    <p className="text-xs text-[#735362]">The agent prepares messages and roadmap edits, but never sends or modifies data without user approval.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#FDF2F5] text-[#7A1443] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1218]">Full Agent Traceability</h4>
                    <p className="text-xs text-[#735362]">Judges can inspect the full execution trace: intent, tools used, candidate sets, decision logic, and state progression.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Comparison Box */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Traditional Chatbot (What We Avoided)
                </div>
                <p className="text-xs text-[#1E1218] font-mono">
                  User Question → LLM Prompt → Unverified Text Response → End of interaction.
                </p>
                <p className="text-[11px] text-[#735362] mt-2">
                  ❌ No database grounding, no state, no tool usage, no real connections, no follow-up.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  AlumNet Agentic System (What We Built)
                </div>
                <p className="text-xs text-[#1E1218] font-mono leading-relaxed">
                  Goal → Analyze Profile → Detect Gaps → Retrieve Candidates → Deterministic Scoring → Explain Match → Draft Action → Human Approval → Execute Connection → Extract Conversation Advice → Update Roadmap.
                </p>
                <p className="text-[11px] text-emerald-800 mt-2 font-medium">
                  ✓ Database grounded, controlled tools, explainable, safe, and continuously adaptive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-[#F0E3E7] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-[#7A1443]" />
            <span className="text-sm font-bold text-[#1E1218]">AlumNet</span>
            <span className="text-xs text-[#735362]">| PS6 AI-Based Alumni Career & Networking Platform</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-[#735362] font-medium">
            <Link href="/dashboard" className="hover:text-[#5A0C32] transition-colors">Dashboard</Link>
            <Link href="/career" className="hover:text-[#5A0C32] transition-colors">Career</Link>
            <Link href="/network" className="hover:text-[#5A0C32] transition-colors">Network</Link>
            <Link href="/chat" className="hover:text-[#5A0C32] transition-colors">Messages</Link>
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

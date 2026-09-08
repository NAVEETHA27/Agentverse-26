# AgentVerse

> *"Discover the right people and make networking useful."*

AgentVerse is an Agentic AI Career & Alumni Networking Platform designed for students, alumni, and educational institutions. Traditional alumni platforms function as static phonebooks—overwhelming students with lists of names without explaining who to contact, why they are relevant, or what actions to take. 

AgentVerse replaces cold directories with goal-driven AI agents that analyze student career aspirations, identify skill gaps, mathematically rank relevant alumni mentors, draft personalized outreach, and extract actionable career roadmap milestones from real mentor interactions under strict Human-in-the-Loop governance.

---

## Table of Contents
- [Problem Statement](#problem-statement)
- [The AgentVerse Solution](#the-agentverse-solution)
- [Key Features](#key-features)
- [Agentic AI Architecture](#agentic-ai-architecture)
  - [Career Agent](#1-career-agent)
  - [Networking Agent](#2-networking-agent)
  - [Relationship Agent](#3-relationship-agent)
- [Deterministic Matching Formula](#deterministic-matching-formula)
- [Human-in-the-Loop Governance](#human-in-the-loop-governance)
- [Career Roadmap & Skill Gap Engine](#career-roadmap--skill-gap-engine)
- [Chat & Relationship Intelligence](#chat--relationship-intelligence)
- [Curated Opportunities](#curated-opportunities)
- [Tech Stack](#tech-stack)
- [Data Layer: Supabase & Mock Fallback](#data-layer-supabase--mock-fallback)
- [Environment Variables](#environment-variables)
- [Setup & Installation Instructions](#setup--installation-instructions)
- [Recommended 3-Minute Demo Flow](#recommended-3-minute-demo-flow)
- [Hackathon Positioning & Judge Defense](#hackathon-positioning--judge-defense)

---

## Problem Statement
Higher education institutions possess vast alumni networks, yet student engagement remains broken:
1. **Directory Paralysis**: Students face thousands of unranked profiles with no guidance on relevance.
2. **Cold Outreach Friction**: Students struggle to articulate why they are reaching out, resulting in ignored messages.
3. **Disconnected Mentorship**: Conversations end after polite pleasantries without translating into actionable career milestones.
4. **Keyword Filter Limitations**: Traditional search cannot assess skill transferability (e.g., transitioning from an Electronics background to Cloud Computing).

---

## The AgentVerse Solution
AgentVerse introduces closed-loop, agentic career navigation:
$$\text{Student Goal} \longrightarrow \text{Skill Gap Analysis} \longrightarrow \text{Deterministic Match} \longrightarrow \text{Grounded Outreach} \longrightarrow \text{Human Approval} \longrightarrow \text{Mentor Chat} \longrightarrow \text{Roadmap Evolution}$$

1. **Understand Intent**: Parses natural-language career ambitions into structured target roles.
2. **Calculate Gap**: Compares verified student coursework and skills against target market requirements.
3. **Rank Relevant Alumni**: Runs a 5-factor deterministic matching engine across progressive institutional scopes.
4. **Draft Grounded Outreach**: Synthesizes personalized messages referencing verified shared alma mater and background.
5. **Enforce Human Approval**: Pauses agent execution; no connection or mutation occurs without explicit user consent.
6. **Extract Relationship Intelligence**: Analyzes conversation transcripts to generate concrete roadmap milestones.

---

## Key Features
- **Goal-Driven Dashboard**: Instant clarity on career readiness percentage, active skill gaps, recommended mentors, and the next best action.
- **Autonomous Networking Agent**: Converts natural-language requests (*"Find me a cloud mentor from my college"*) into ranked, verified alumni candidates with tailored outreach drafts.
- **Human-in-the-Loop Approval Modal**: Preview, edit, approve, or reject proposed actions with zero unauthorized database mutations.
- **Relationship Intelligence Agent**: Automatically surfaces key advice, action items, and suggested roadmap milestones from chat dialogue.
- **Interactive Career Roadmap**: Milestone-based pathway tracking with dynamic adaptation based on mentor recommendations.
- **Curated Career Opportunities**: High-relevance internships and job postings with grounded *"Why Recommended"* explanations.
- **Professional Community Feed**: Institutional achievement feed for project launches, certifications, and career milestones.
- **Dual-Mode Data Layer**: Seamless execution with real Supabase PostgreSQL or offline-resilient local mock data.

---

## Agentic AI Architecture

AgentVerse does not use a generic chatbot. It deploys three specialized, bounded autonomous agents that invoke controlled tools, evaluate evidence, pause for human approval, and record immutable execution traces.

```
Client (Next.js 15 App Router / Tailwind CSS)
   │
   ▼
Server-Side API Routes (/api/ai/agents/*, /api/*)
   │
   ▼
Agent Orchestration Layer (Career, Networking, Relationship Agents)
   │
   ├── Human-in-the-Loop Approval Gate (Mandatory pause on state mutations)
   ├── Audit Trace Engine (Step-by-step execution tracking)
   ▼
Controlled Tool Layer (10 strictly typed tools)
   │
   ├── Data Access Layer (DAL) (Supabase + In-Memory Fallback)
   ├── Deterministic Matching Engine (30/25/20/15/10 multi-factor formula)
   └── Gemini 2.5 Flash (Structured intent parsing, grounded drafting, insights)
```

### 1. Career Agent
- **Goal**: Evaluate career pathway feasibility and formulate immediate next steps.
- **Execution Flow**:
  1. `parse_career_intent`: Extracts target role and domain requirements.
  2. `get_user_profile`: Retrieves verified student academic and skill history.
  3. `get_skill_gaps`: Calculates delta against market expectations.
  4. `get_career_roadmap`: Loads sequenced milestone pathway.
  5. `get_career_analysis`: Computes numerical readiness score.
  6. **Next Best Action**: Recommends targeted mentor engagement.

### 2. Networking Agent
- **Goal**: Discover, rank, and connect with optimal alumni mentors.
- **Execution Flow**:
  1. `parse_career_intent`: Analyzes user query.
  2. `get_user_profile`: Loads academic background (e.g., B.Tech ECE).
  3. `get_skill_gaps`: Identifies missing skills needing guidance (e.g., Kubernetes, Terraform).
  4. `search_alumni_network`: Executes 5-factor deterministic matching algorithm across progressive scopes (Institution $\rightarrow$ Broader Network $\rightarrow$ Industry).
  5. `get_mentorship_preferences`: Verifies mentor capacity and preferred discussion topics.
  6. `generate_networking_message`: Synthesizes grounded outreach draft based on shared college and transition background.
  7. **HUMAN-IN-THE-LOOP PAUSE**: Generates a secure `actionId` and halts state until user approves or rejects.

### 3. Relationship Agent
- **Goal**: Translate conversational exchanges into actionable career momentum.
- **Execution Flow**:
  1. `get_conversation_context`: Fetches authorized message transcript.
  2. `extract_relationship_insights`: Surfaces key takeaways, action items, and follow-up questions.
  3. `propose_roadmap_update`: Drafts a concrete milestone (e.g., *"Dockerized Cloud Architecture Review"*).
  4. **HUMAN-IN-THE-LOOP PAUSE**: Awaits user authorization before committing the new milestone to the student's career roadmap.

---

## Deterministic Matching Formula

To ensure fairness, auditability, and zero hallucination, match percentages are computed by deterministic application code—**Gemini is never permitted to calculate or fabricate scores**:

$$\text{Final Match Score} = 0.30 \times S_{\text{goal}} + 0.25 \times S_{\text{skill}} + 0.20 \times S_{\text{education}} + 0.15 \times S_{\text{industry}} + 0.10 \times S_{\text{experience}}$$

- **Career Goal Similarity (30%)**: Alignment between student's desired role and mentor's current title and career path.
- **Skill Overlap & Gap Relevance (25%)**: Mentor's proficiency in the specific high-priority skills missing from the student's profile.
- **Education Connection (20%)**: Shared institutional lineage (same college = 100%, same university system = 70%, general alumni = 50%).
- **Industry & Role Relevance (15%)**: Mentor's company sector and domain seniority.
- **Experience Level (10%)**: Optimal career vintage for relatable, tactical advice (3–8 years prioritized).

---

## Human-in-the-Loop Governance

AgentVerse treats user trust as an architectural requirement:
1. **Zero Autonomous Write-Privileges**: The AI agent cannot dispatch connection requests or alter student roadmaps on its own.
2. **Cryptographic Action Tokens**: Actions are assigned server-validated UUIDs (`actionId`) stored in session state.
3. **Rejection Safety**: If the user clicks **Reject**, the action is discarded, recorded as `human_rejection` in audit logs, and zero database mutations occur.
4. **Editable Outreach**: Users can customize the drafted message before approving.

---

## Career Roadmap & Skill Gap Engine
- Visual milestone progression tracking from beginner to job-ready.
- Dynamic skill badges classifying skills as *Verified* or *Target Gap*.
- Closed-loop updates where accepted mentor recommendations automatically insert new milestones into the roadmap.

---

## Chat & Relationship Intelligence
- Real-time peer-to-peer and student-to-mentor messaging interface.
- Built-in **Relationship Intelligence Assistant** in the chat sidebar.
- One-click analysis extracting actionable takeaways directly from discussion history.

---

## Curated Opportunities
- Integrated board of internships, full-time positions, and open hackathon projects.
- Context-aware filtering by work mode (Remote, Hybrid, On-site) and category.
- Transparent *"Why Recommended"* explainability grounded in student skills and network connections.

---

## Tech Stack
- **Frontend Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **AI / LLM**: Google Gemini 2.5 Flash (via `@google/genai` with strict JSON Schema generation)
- **Database / Backend**: PostgreSQL / Supabase
- **Data Access Layer (DAL)**: Typed repository pattern with offline mock fallback

---

## Data Layer: Supabase & Mock Fallback

AgentVerse is architected to be 100% demo-resilient:
- **Mode 1 (Supabase Connected)**: When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, all entities (users, goals, connections, messages, roadmaps) read and write to real PostgreSQL tables via Supabase.
- **Mode 2 (Local Demo / Offline Fallback)**: If Supabase is unconfigured or temporarily unreachable, the application automatically falls back to an in-memory database initialized with realistic seed personas.

> **Note**: In-memory storage is designed strictly for offline development and hackathon demonstrations; production deployments utilize the Supabase PostgreSQL schema provided in `supabase/schema.sql`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

```ini
# Google Gemini API Key (Server-Side Only)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Optional for offline demo mode)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## Setup & Installation Instructions

### Prerequisites
- Node.js 18.18+ or 20+ installed
- npm, pnpm, or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/NAVEETHA27/Agentverse-26.git
cd Agentverse-26
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
npm run build
npm run start
```

---

## Recommended 3-Minute Demo Flow

1. **Landing Page (`/`)**: Show the brand and slogan: *"Discover the right people and make networking useful."* Click **Get Started**.
2. **Dashboard (`/dashboard`)**: Log in as demo student **Rohan Varma** (B.Tech ECE). Observe the 65% readiness score, Kubernetes/Terraform skill gaps, and AI Next Best Action.
3. **Career Agent (`/career`)**: Click **Run Career Agent**. Watch the real-time trace parse the Cloud Engineer goal and formulate the roadmap.
4. **Networking Agent (`/network`)**: Enter: *"I want to become a Cloud Engineer. Find me an alumni mentor."* Click **Run Networking Agent**.
   - Watch the live trace execute deterministic matching.
   - Point out **Rahul Sharma** (Senior Cloud Architect @ AWS) ranked #1 with a 94% match score.
   - Show the generated outreach draft.
   - **Point out the Human-in-the-Loop pause**: The agent will not send anything until authorized.
   - Click **Approve & Send Request**.
5. **Chat (`/chat`)**: Open the conversation with Rahul Sharma. Review the mentor's tactical advice. Click **Run Relationship Agent**. Show the extracted action items and proposed milestone.
6. **Closed-Loop Persistence**: Approve the milestone and navigate back to `/career` to prove the roadmap was updated.
7. **Opportunities (`/opportunities`)**: Review the Cloud & DevOps internship with the grounded *"Why Recommended"* badge.

---

## Hackathon Positioning & Judge Defense

### Q: Why AI instead of simple database filters?
**A:** Keyword search cannot understand career trajectory or transferability. A student from an Electronics background seeking a Cloud Engineering role has transferable Linux and Python skills but lacks AWS experience. AI understands unstructured goals, reasons across academic backgrounds, synthesizes hyper-personalized outreach, and extracts structured roadmap actions from conversational chat.

### Q: Can the AI hallucinate alumni match scores?
**A:** **No.** All match percentages are computed by the deterministic 5-factor mathematical engine in application code. Gemini is only used to explain the mathematical breakdown in natural language.

### Q: Can the AI spam alumni without permission?
**A:** **Never.** All state-mutating actions pause at mandatory Human-in-the-Loop gates. The client must supply a valid server-issued `actionId` to approve any request.

---

## License
MIT License. Built for the Agentic AI Hackathon 2026.

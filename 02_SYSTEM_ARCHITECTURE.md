
# AI Alumni Career & Networking Platform
## System Architecture Document

---

## 1. Architecture Overview

The platform is designed as an AI-powered, agentic career networking system.

The core architecture follows:

User
↓
Next.js Frontend
↓
Application/API Layer
↓
Agent Orchestrator
↓
AI + Platform Tools
↓
Supabase Database / Vector Search
↓
Action
↓
User Approval
↓
Networking / Career Progress

The AI does not directly control the entire application.

Instead, the Agent uses controlled tools to:

- Understand the user's goal
- Analyze the user's profile
- Search the alumni network
- Identify skill gaps
- Find relevant mentors
- Rank potential connections
- Explain recommendations
- Generate networking messages
- Track conversations
- Suggest next actions

Human approval is required before important external actions.

---

# 2. Recommended Technology Stack

## 2.1 Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Lucide Icons

## 2.2 Backend / Application Layer

- Next.js App Router
- Route Handlers
- Server Actions where appropriate

A separate backend server is not required for the MVP.

## 2.3 Database

- Supabase PostgreSQL

## 2.4 Authentication

- Supabase Auth
- Email/password authentication

Google OAuth can be added later.

## 2.5 Storage

- Supabase Storage

Used for:

- Profile pictures
- Certificates
- Project images
- Achievement attachments

## 2.6 Realtime

- Supabase Realtime

Used for:

- Chat messages
- Online status
- Notifications
- Connection updates

## 2.7 AI

- Gemini API

Used for:

- Natural-language understanding
- Career analysis
- Skill-gap generation
- Match explanation
- Message generation
- Conversation analysis
- Agent reasoning

## 2.8 Semantic Search

- PostgreSQL
- pgvector

Used for:

- Alumni embeddings
- Skill embeddings
- Career goal embeddings
- Post embeddings
- Semantic matching

## 2.9 Deployment

- Vercel
- Supabase

---

# 3. High-Level System Architecture

```text
                    ┌──────────────────────┐
                    │        USER          │
                    │ Student / Alumni /   │
                    │ Mentor / Professional│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    NEXT.JS FRONTEND  │
                    │                      │
                    │ Dashboard            │
                    │ Profile              │
                    │ Career Roadmap       │
                    │ Discover             │
                    │ Networking            │
                    │ Chat                 │
                    │ Feed                 │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ APPLICATION / API    │
                    │       LAYER          │
                    │                      │
                    │ Auth                 │
                    │ Profiles             │
                    │ Matching             │
                    │ Connections          │
                    │ Chat                 │
                    │ Opportunities        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   AGENT ORCHESTRATOR │
                    │                      │
                    │ Career Agent         │
                    │ Networking Agent     │
                    │ Relationship Agent   │
                    │ Profile/Post Agent   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
        ┌──────────────┐ ┌────────────┐ ┌──────────────┐
        │ Gemini / LLM │ │ Vector     │ │ Application  │
        │              │ │ Search     │ │ Tools        │
        └──────────────┘ └────────────┘ └──────────────┘
                 │             │             │
                 └─────────────┼─────────────┘
                               ▼
                    ┌──────────────────────┐
                    │       SUPABASE       │
                    │                      │
                    │ PostgreSQL           │
                    │ pgvector             │
                    │ Auth                 │
                    │ Storage              │
                    │ Realtime             │
                    └──────────────────────┘
````

---

# 4. Frontend Architecture

The frontend is built using Next.js App Router.

## 4.1 Main Pages

```text
/
├── login
├── signup
├── onboarding
├── dashboard
├── profile
├── career
├── discover
├── network
├── connections
├── chat
├── opportunities
├── feed
└── settings
```

---

# 5. Dashboard Architecture

The dashboard is the user's main career control center.

It should show:

* Current career goal
* AI career status
* Skill gaps
* Career roadmap progress
* Recommended alumni
* Recommended mentors
* Job/internship opportunities
* Pending connections
* Recent conversations
* AI suggested next action

Example:

```text
Good Morning 👋

Career Goal
────────────────────────────
Cloud Engineer

AI Career Progress
████████████░░░░ 72%

Skill Gaps
• AWS
• Docker
• Kubernetes

Recommended Alumni
• Cloud Engineer — AWS
• DevOps Engineer — Microsoft
• Platform Engineer — Google

AI Suggested Next Step

"Connect with an AWS Cloud Engineer
and ask about their transition into
cloud engineering."

[ View Recommendation ]
```

---

# 6. Profile Architecture

The profile is not limited to:

"Student" or "Alumni".

Instead, the user has a unified identity.

A user can have multiple education experiences.

```text
User
 │
 ├── Education Journey
 │      ├── Bachelor's
 │      ├── Master's
 │      └── Other Education
 │
 ├── Professional Experience
 │
 ├── Skills
 │
 ├── Certifications
 │
 ├── Projects
 │
 ├── Achievements
 │
 ├── Career Goals
 │
 └── Interests
```

This allows one person to simultaneously be:

* Alumni of Institution A
* Student of Institution B
* Professional
* Mentor

The platform therefore models a person's education and professional journey instead of forcing a fixed Student/Alumni role.

---

# 7. Application / API Layer

The application layer provides controlled access to platform functionality.

Example API structure:

```text
/api
│
├── auth
├── profile
├── education
├── skills
├── career
├── matching
├── mentors
├── connections
├── messages
├── opportunities
├── posts
└── ai
```

The AI agent should never directly manipulate database tables without application-level controls.

Instead:

```text
Agent
  ↓
Tool
  ↓
API / Server Function
  ↓
Validation
  ↓
Database
```

This provides:

* Security
* Validation
* Consistent business logic
* Better debugging
* Controlled AI actions

---

# 8. Agentic AI Architecture

The AI layer is the most important part of the system.

The platform contains multiple specialized agents.

The LLM itself is not considered the agent.

The agent consists of:

* Goal understanding
* Reasoning
* Tool usage
* Data retrieval
* Decision making
* Actions
* Feedback
* State

---

# 9. Career Agent

## Purpose

Understand the user's career direction and continuously guide them.

## Input

```text
User Profile
+
Education
+
Skills
+
Projects
+
Achievements
+
Interests
+
Career Goal
```

## Responsibilities

The Career Agent can:

* Understand career goals
* Identify target roles
* Analyze existing skills
* Detect skill gaps
* Generate career roadmap
* Recommend projects
* Recommend certifications
* Recommend mentors
* Recommend opportunities
* Suggest next actions
* Track career progress

## Example

User:

"I want to become a Data Engineer."

The Career Agent identifies:

```text
Target Role:
Data Engineer

Relevant Skills:
- Python
- SQL
- Data Structures
- ETL
- Apache Spark
- Airflow
- Cloud
- Data Warehousing
```

Then it compares these requirements against the user's existing profile.

---

# 10. Networking Agent

The Networking Agent is the primary agentic component.

Its purpose is to transform a career goal into a meaningful professional connection.

The workflow is:

```text
Career Goal
     ↓
Understand Intent
     ↓
Analyze User Profile
     ↓
Identify Required Skills
     ↓
Identify Skill Gaps
     ↓
Search Network
     ↓
Retrieve Candidates
     ↓
Evaluate Candidates
     ↓
Rank Candidates
     ↓
Explain Matches
     ↓
Generate Personalized Message
     ↓
User Approval
     ↓
Create Connection
     ↓
Monitor Connection
     ↓
Suggest Follow-up
```

---

# 11. Networking Agent Example

User:

"I want to become a cybersecurity engineer.
Can you find someone who can guide me?"

The Networking Agent performs the following steps.

## Step 1 — Understand Goal

```text
Target Role:
Cybersecurity Engineer

Domain:
Cybersecurity
```

## Step 2 — Identify Requirements

```text
Possible Skills:

- Network Security
- Linux
- Python
- SIEM
- Threat Detection
- Cloud Security
- Ethical Hacking
```

## Step 3 — Analyze User Profile

Example:

```text
Existing Skills:

✓ Python
✓ Linux
✓ Networking

Missing / Weak Skills:

- SIEM
- Cloud Security
- Threat Detection
```

## Step 4 — Search Network

The agent searches the alumni and professional network.

Example:

```text
Potential candidates:
37
```

## Step 5 — Rank Candidates

Example:

```text
Candidate 1
Cybersecurity Engineer
AWS Security
5 years experience
Same institution
Mentor experience

Candidate 2
Security Analyst
3 years experience
Different institution

Candidate 3
Cloud Security Engineer
6 years experience
Same institution
```

## Step 6 — Explain Match

```text
92% Match

Why?

✓ Same institution
✓ Works in cybersecurity
✓ Strong cloud security experience
✓ Relevant technical skills
✓ Previous mentoring experience
```

## Step 7 — Generate Message

```text
Hi Rahul,

I'm currently working toward a career in
cybersecurity and noticed your experience
with cloud security and threat detection.

I'd really appreciate the opportunity to
learn from your career journey and get
some guidance on the skills I should focus on.

Would you be open to connecting?
```

## Step 8 — Human Approval

```text
[ Send Connection Request ]

[ Edit Message ]

[ Cancel ]
```

The AI should not send the message without user approval.

---

# 12. Relationship Agent

The Relationship Agent works after a connection is established.

Its purpose is to maintain meaningful professional relationships.

It can:

* Analyze conversations
* Summarize mentor advice
* Extract action items
* Detect recommended skills
* Suggest follow-up questions
* Track mentorship goals
* Recommend next actions
* Suggest roadmap updates

Example:

Mentor says:

"You should learn PyTorch and build a computer vision project."

The Relationship Agent extracts:

```text
Advice:
Learn PyTorch

Action:
Build a Computer Vision Project

Category:
Skill Development
```

The system then asks:

```text
Your mentor recommended learning PyTorch.

Would you like me to add this to your career roadmap?

[ Add to Roadmap ]

[ Ignore ]
```

This creates a continuous career feedback loop.

---

# 13. Profile / Post Agent

The Profile/Post Agent analyzes professional activity.

Example post:

```text
"I completed my AWS Solutions Architect
certification and deployed a scalable
serverless application."
```

The agent extracts:

```text
Skills:
- AWS
- Serverless
- Cloud Architecture

Achievement:
- AWS Certification

Interest:
- Cloud Computing
```

These signals can improve:

* Profile
* Recommendations
* Matching
* Career analysis
* Opportunity discovery
* Networking

The AI should ask for user confirmation before making important profile changes.

---

# 14. Agent Tool Architecture

Agents should use controlled tools instead of having unrestricted database access.

Example:

```text
Networking Agent
       │
       ├── analyze_user_profile()
       │
       ├── extract_career_goal()
       │
       ├── identify_skill_gaps()
       │
       ├── search_alumni()
       │
       ├── semantic_match()
       │
       ├── rank_candidates()
       │
       ├── explain_match()
       │
       ├── generate_message()
       │
       ├── create_connection_request()
       │
       └── get_connection_status()
```

Each tool performs one controlled operation.

---

# 15. Example Agent Tools

## Profile Tools

```text
get_user_profile()
get_user_skills()
get_user_education()
get_user_projects()
get_user_goals()
```

## Career Tools

```text
analyze_career_goal()
identify_required_skills()
calculate_skill_gaps()
generate_career_roadmap()
```

## Network Tools

```text
search_alumni()
search_mentors()
semantic_match()
rank_candidates()
get_match_reasons()
```

## Connection Tools

```text
generate_networking_message()
create_connection_request()
get_connection_status()
```

## Relationship Tools

```text
get_recent_conversation()
summarize_conversation()
extract_mentor_advice()
suggest_follow_up()
```

---

# 16. Agent Decision Flow

```text
START
  │
  ▼
Understand User Goal
  │
  ▼
Is the goal clear?
  │
 ┌┴─────────────┐
 │              │
NO             YES
 │              │
Ask            Analyze
Question       Profile
                │
                ▼
          Identify Skill Gaps
                │
                ▼
          Search Network
                │
                ▼
       Relevant alumni found?
          │             │
         YES            NO
          │             │
          ▼             ▼
       Rank          Expand Search
      Candidates         │
          │              ▼
          │       Wider Network
          │              │
          │              ▼
          │       Industry Mentors
          │              │
          └──────┬───────┘
                 ▼
          Explain Matches
                 │
                 ▼
       Generate Message
                 │
                 ▼
          User Approval
                 │
          ┌──────┴──────┐
          │             │
        APPROVE       REJECT
          │             │
          ▼             ▼
     Send Request    Adjust Search
          │
          ▼
      Connection
          │
          ▼
   Relationship Agent
          │
          ▼
   Monitor Conversation
          │
          ▼
    Suggest Next Action
```

---

# 17. Agentic AI Loop

The complete agentic loop is:

```text
UNDERSTAND
     ↓
REASON
     ↓
SEARCH
     ↓
DECIDE
     ↓
ACT
     ↓
OBSERVE
     ↓
ADAPT
```

The LLM alone is not the agent.

The agent is the complete workflow that combines:

```text
LLM
+
Tools
+
Database
+
Retrieval
+
Decision Making
+
Actions
+
Feedback
+
State
```

This distinction is important for the hackathon because the platform must demonstrate genuine Agentic AI behavior.

---

# 18. Semantic Matching Architecture

Traditional keyword filtering is not enough.

Example:

User searches:

```text
Cloud Engineer
```

An exact keyword system may miss:

* DevOps Engineer
* Site Reliability Engineer
* Platform Engineer
* Cloud Infrastructure Engineer
* Cloud Operations Engineer

Semantic matching understands that these roles can be related.

---

# 19. Semantic Matching Pipeline

```text
User Career Goal
       ↓
Goal Embedding
       ↓
Vector Search
       ↓
Candidate Retrieval
       ↓
Metadata Filtering
       ↓
Similarity Calculation
       ↓
Match Scoring
       ↓
Top Candidates
       ↓
AI Explanation
```

---

# 20. Candidate Retrieval Architecture

The platform should NOT send thousands of profiles to the LLM.

Instead:

```text
10,000 Alumni
      ↓
Database Filters
      ↓
2,000 Candidates
      ↓
Vector Search
      ↓
50 Candidates
      ↓
Matching Algorithm
      ↓
10 Candidates
      ↓
AI Explanation
      ↓
Top 5 Recommendations
```

This improves:

* Speed
* Cost
* Accuracy
* Scalability

---

# 21. Match Scoring

The match score should be explainable and calculated using application logic.

Example weighting:

```text
Career Goal Similarity     30%
Skill Similarity           25%
Education Connection       20%
Industry / Role            15%
Experience Relevance       10%
```

Total:

```text
100%
```

Example:

```text
92% Match

Career Goal Similarity: 95%
Skill Similarity: 90%
Education Connection: 100%
Industry / Role: 90%
Experience Relevance: 85%
```

The LLM can explain the score, but it should not randomly invent the percentage.

---

# 22. Match Explanation

Every recommendation should answer:

```text
Why this person?
```

Example:

```text
92% Match

✓ Same institution
✓ Works in your target role
✓ Has 5+ years of relevant experience
✓ Has the skills you currently need
✓ Has previous mentoring experience
✓ Works in your target industry
```

This makes recommendations transparent and trustworthy.

---

# 23. No-Alumni Fallback

This is an important agentic behavior.

If no suitable alumni are found, the agent progressively expands the search.

The fallback order is:

```text
1. Relevant alumni from user's institution
        ↓
2. Wider alumni network
        ↓
3. Relevant mentors / industry professionals
        ↓
4. Relevant opportunities / resources
```

Example:

```text
We couldn't find a strong cybersecurity
mentor from your institution.

I've expanded the search to the wider
network and found 3 relevant professionals.
```

The system must clearly explain that the search scope was expanded.

The agent should not silently show cross-institution recommendations.

---

# 24. RAG Architecture

Retrieval-Augmented Generation is used when the AI needs platform-specific information.

Example:

User:

```text
Which alumni work at Microsoft and have
cybersecurity experience?
```

Flow:

```text
User Question
      ↓
Intent Detection
      ↓
Database Retrieval
      ↓
Semantic Search
      ↓
Relevant Alumni Profiles
      ↓
Context Construction
      ↓
Gemini
      ↓
Grounded Answer
```

The LLM should answer using retrieved platform data instead of inventing alumni.

---

# 25. RAG Data Sources

The RAG system may retrieve information from:

* User profiles
* Alumni profiles
* Education records
* Skills
* Work experience
* Certifications
* Projects
* Achievement posts
* Job opportunities
* Mentorship information
* Connection history where authorized

Only relevant and authorized information should be included in the AI context.

---

# 26. Career Roadmap Architecture

Example:

```text
Goal:
Data Engineer
```

AI generates:

```text
Current Skills
│
├── Python ✓
├── SQL ✓
└── Java ✓

Skill Gaps
│
├── Apache Spark
├── Airflow
├── Data Warehousing
└── Cloud Data Services

Projects
│
├── ETL Pipeline
├── Real-time Data Pipeline
└── Cloud Data Warehouse

Certifications
│
└── Relevant Cloud Certification

Mentors
│
└── Recommended Alumni

Target Roles
│
├── Data Engineer
└── Cloud Data Engineer
```

The roadmap should be editable by the user.

---

# 27. Career Roadmap Progress

Each roadmap item can contain:

```text
title
description
category
priority
status
progress
estimated_time
resources
related_skills
recommended_projects
```

Possible statuses:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

---

# 28. Chat Architecture

The MVP supports one-to-one professional messaging.

```text
User A
  │
  ▼
Conversation
  │
  ├── Messages
  ├── Timestamp
  ├── Read Status
  ├── Online Status
  └── Notifications
  │
  ▼
User B
```

Supabase Realtime can provide near-real-time message updates.

---

# 29. Chat Features for MVP

Implement:

* One-to-one conversations
* Send message
* Receive message
* Timestamp
* Read/unread status
* Online/offline indicator
* Connection status
* Basic notifications

Avoid:

* Voice calls
* Video calls
* Group calls
* Complex media processing

These are unnecessary for the 24-hour hackathon MVP.

---

# 30. AI Relationship Assistance in Chat

The AI does not automatically take over conversations.

Instead, it provides assistance.

Example:

```text
Mentor:
"Learn Kubernetes and build a deployment project."
```

AI Insight:

```text
Mentor Advice
────────────────────

Skill:
Kubernetes

Suggested Action:
Add Kubernetes project to roadmap.

Suggested Follow-up:
"Would you recommend any Kubernetes
projects for beginners?"
```

Buttons:

```text
[ Add to Roadmap ]

[ Use Follow-up ]

[ Ignore ]
```

This keeps the user in control.

---

# 31. Authentication Architecture

```text
User
 ↓
Signup / Login
 ↓
Supabase Auth
 ↓
Authenticated Session
 ↓
User ID
 ↓
Profile
```

Every user-related database record should reference the authenticated user ID.

Authentication and authorization should be enforced using Supabase Row Level Security.

---

# 32. Authorization Architecture

Users should only be able to access information they are authorized to access.

Examples:

```text
User
 ↓
Authenticated User ID
 ↓
RLS Policy
 ↓
Allowed Data
```

Examples of rules:

* Users can edit their own profile.
* Users can edit their own education records.
* Users can edit their own skills.
* Users can read public professional profiles.
* Users can read messages belonging to their conversations.
* Users can create connection requests.
* Users cannot modify another user's profile.
* Users cannot read private conversations they are not part of.

---

# 33. Security Architecture

## Frontend

Only public/publishable Supabase credentials are allowed.

Never expose:

* Supabase secret/service-role key
* Gemini API key
* Private backend credentials
* Other private API keys

## Backend

Sensitive keys are stored in environment variables.

## Database

Use:

* Row Level Security
* User ownership checks
* Input validation
* Database constraints

## AI

The AI should not have unrestricted database access.

Use controlled tools and validated server-side operations.

---

# 34. Environment Variables

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

GEMINI_API_KEY=
```

Only variables beginning with:

```text
NEXT_PUBLIC_
```

should be exposed to browser-side code.

Private API keys must remain server-side.

---

# 35. Realtime Architecture

Realtime events include:

```text
New Message
     ↓
Supabase Realtime
     ↓
Chat UI Updates
```

```text
Connection Accepted
     ↓
Realtime Event
     ↓
Notification
```

```text
New Recommendation
     ↓
Realtime Event
     ↓
Dashboard Update
```

---

# 36. Notification Architecture

Notifications may include:

* Connection request
* Connection accepted
* New message
* Mentor recommendation
* Job recommendation
* AI career suggestion
* Roadmap update
* Follow-up reminder
* New opportunity
* Profile recommendation

---

# 37. Professional Feed Architecture

The platform can include a LinkedIn-like professional feed.

Users can post:

* Projects
* Hackathons
* Certifications
* Internships
* Jobs
* Career milestones
* Technical articles
* Research
* Startup updates

The feed should remain career-focused.

It should not become a generic social-media platform.

---

# 38. AI Post Analysis

When a user creates a post, the Profile/Post Agent can analyze it.

Example:

```text
Post:
"Built an IoT water quality monitoring
system using ESP32, sensors and a web dashboard."
```

AI extracts:

```text
Skills:
- ESP32
- IoT
- Sensors
- Web Development

Project Category:
IoT

Interests:
Embedded Systems
Internet of Things
Full Stack Development
```

These extracted signals can improve recommendations and matching.

---

# 39. Opportunity Matching

The platform can match users with:

* Internships
* Jobs
* Referrals
* Alumni companies
* Projects
* Collaborations

Flow:

```text
User Profile
      ↓
Skills
      ↓
Career Goal
      ↓
Opportunity Requirements
      ↓
Semantic Matching
      ↓
Relevant Opportunities
```

Example:

```text
AI Recommendation

Software Engineering Internship

Why it matches:

✓ Java
✓ SQL
✓ Problem Solving
✓ Target role matches
✓ Experience level matches
```

---

# 40. Alumni Value Proposition

The platform should also create value for alumni.

Alumni can use the platform to:

* Mentor students
* Review resumes
* Review projects
* Provide referrals
* Hire students
* Find interns
* Recruit talent
* Find collaborators
* Find co-founders
* Promote startups
* Reconnect with their academic network

This creates a two-sided ecosystem.

---

# 41. Trust and Verification

The platform should use trust signals.

Possible profile indicators:

```text
Self-Reported
Professional Profile Connected
Verified
Mentor Experience
Community Reputation
```

Verification should not block basic platform participation.

Users can still create profiles and network.

---

# 42. Human-in-the-Loop Architecture

Important actions require user approval.

Examples:

```text
AI generates message
       ↓
User reviews
       ↓
User approves
       ↓
Message sent
```

```text
AI detects mentor advice
       ↓
AI suggests roadmap update
       ↓
User approves
       ↓
Roadmap updated
```

This reduces unwanted AI actions.

---

# 43. AI Failure Handling

The system should avoid presenting uncertain AI output as fact.

If the AI is uncertain:

```text
I'm not confident I found a strong match.

Here are the closest available profiles.
```

If there is insufficient data:

```text
I don't have enough profile information
to make a reliable recommendation.

Please add your skills or career goal.
```

If no match exists:

```text
No strong match was found in your
institution's network.

Would you like me to expand the search?
```

---

# 44. AI Guardrails

The AI should:

* Use retrieved platform data
* Avoid inventing alumni
* Avoid inventing job opportunities
* Avoid exposing private information
* Respect user permissions
* Request approval before sensitive actions
* Clearly communicate uncertainty
* Use deterministic scoring where possible

The AI should not:

* Automatically message people without approval
* Modify private profile information without permission
* Reveal private conversations
* Invent professional experience
* Invent certifications
* Invent job openings

---

# 45. Data Flow: Career Goal to Connection

The complete data flow is:

```text
User enters career goal
        ↓
Career Agent
        ↓
Goal understanding
        ↓
Target role extraction
        ↓
Required skill identification
        ↓
User profile retrieval
        ↓
Skill-gap analysis
        ↓
Alumni retrieval
        ↓
Vector similarity
        ↓
Metadata filtering
        ↓
Match scoring
        ↓
Top candidate selection
        ↓
AI explanation
        ↓
Personalized message
        ↓
User approval
        ↓
Connection request
        ↓
Conversation
        ↓
Relationship Agent
        ↓
Mentor advice
        ↓
Career roadmap update
```

---

# 46. Complete Agentic Workflow

```text
┌──────────────────────────┐
│      CAREER GOAL         │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   UNDERSTAND INTENT      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   ANALYZE USER PROFILE   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    IDENTIFY SKILL GAPS   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│     SEARCH NETWORK       │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   RETRIEVE CANDIDATES    │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      RANK MATCHES        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    EXPLAIN MATCHES       │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   GENERATE MESSAGE       │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│     USER APPROVAL        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    CREATE CONNECTION     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   MONITOR RELATIONSHIP   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│    EXTRACT ADVICE        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│  UPDATE CAREER JOURNEY   │
└──────────────────────────┘
```

---

# 47. Recommended Project Structure

```text
alumni-ai-platform/
│
├── app/
│   │
│   ├── login/
│   ├── signup/
│   ├── onboarding/
│   │
│   ├── dashboard/
│   ├── profile/
│   ├── career/
│   ├── discover/
│   ├── network/
│   ├── connections/
│   ├── chat/
│   ├── opportunities/
│   ├── feed/
│   └── settings/
│
│   └── api/
│       ├── ai/
│       ├── matching/
│       ├── profile/
│       ├── career/
│       ├── connections/
│       ├── messages/
│       ├── opportunities/
│       └── posts/
│
├── components/
│   ├── ui/
│   ├── profile/
│   ├── career/
│   ├── networking/
│   ├── chat/
│   ├── dashboard/
│   ├── feed/
│   └── opportunities/
│
├── lib/
│   ├── supabase/
│   ├── ai/
│   ├── agents/
│   ├── matching/
│   ├── embeddings/
│   ├── database/
│   └── utils/
│
├── lib/agents/
│   ├── career-agent.ts
│   ├── networking-agent.ts
│   ├── relationship-agent.ts
│   └── profile-agent.ts
│
├── lib/agents/tools/
│   ├── profile-tools.ts
│   ├── career-tools.ts
│   ├── alumni-search.ts
│   ├── matching-tools.ts
│   ├── connection-tools.ts
│   ├── relationship-tools.ts
│   └── opportunity-tools.ts
│
├── types/
│
├── prompts/
│   ├── career-prompts.ts
│   ├── networking-prompts.ts
│   ├── relationship-prompts.ts
│   └── profile-prompts.ts
│
├── hooks/
│
├── public/
│
├── middleware.ts
│
├── .env.local
├── package.json
└── README.md
```

---

# 48. AI Module Structure

```text
lib/
└── agents/
    │
    ├── career-agent.ts
    ├── networking-agent.ts
    ├── relationship-agent.ts
    └── profile-agent.ts
```

Tools:

```text
lib/
└── agents/
    └── tools/
        ├── profile-tools.ts
        ├── career-tools.ts
        ├── alumni-search.ts
        ├── matching-tools.ts
        ├── connection-tools.ts
        ├── relationship-tools.ts
        └── opportunity-tools.ts
```

---

# 49. Core Agent State

The Networking Agent should maintain state such as:

```text
goal
intent
user_profile
education_context
target_role
required_skills
existing_skills
skill_gaps
search_scope
candidate_list
selected_candidates
match_scores
match_reasons
generated_message
approval_status
connection_status
conversation_status
next_action
```

Example:

```text
{
  goal: "Become a Cloud Engineer",

  target_role: "Cloud Engineer",

  required_skills: [
    "AWS",
    "Docker",
    "Kubernetes",
    "Linux",
    "CI/CD"
  ],

  existing_skills: [
    "Python",
    "Linux",
    "Git"
  ],

  skill_gaps: [
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD"
  ],

  search_scope: "institution",

  approval_status: "pending",

  connection_status: "not_connected",

  next_action: "await_user_approval"
}
```

This state allows the agent to continue its workflow instead of treating every interaction as a completely new prompt.

---

# 50. Database Interaction Architecture

The agent should never directly execute arbitrary SQL.

Instead:

```text
Agent
  ↓
Tool
  ↓
Validation
  ↓
Supabase Query
  ↓
Result
  ↓
Agent
```

Example:

```text
Networking Agent
       ↓
search_alumni()
       ↓
validate search parameters
       ↓
Supabase
       ↓
candidate profiles
       ↓
Networking Agent
```

This makes the AI system safer and easier to debug.

---

# 51. Embedding Architecture

Embeddings can be generated for:

* Career goals
* User profiles
* Alumni profiles
* Skills
* Projects
* Achievement posts
* Job descriptions
* Mentor profiles

Example alumni embedding input:

```text
Role:
Cloud Engineer

Company:
Microsoft

Skills:
AWS, Kubernetes, Docker, Linux

Industry:
Cloud Computing

Experience:
6 years

Education:
Computer Science

Mentoring:
Yes
```

This structured information can be converted into an embedding and stored for semantic search.

---

# 52. Vector Search

Example:

```text
User Goal:
"I want to become a cloud infrastructure engineer."
```

The vector search can retrieve profiles such as:

```text
Cloud Engineer
DevOps Engineer
Platform Engineer
SRE
Cloud Infrastructure Engineer
```

even when the exact words are different.

---

# 53. Performance Optimization

For better performance:

* Generate embeddings once.
* Store embeddings in the database.
* Do not generate embeddings repeatedly for unchanged profiles.
* Use database indexes.
* Use pgvector indexes.
* Filter candidates before AI ranking.
* Limit LLM context.
* Cache frequently used recommendations where appropriate.

---

# 54. Scalability Strategy

For 100,000+ profiles:

```text
100,000 Profiles
       ↓
Metadata Filtering
       ↓
20,000 Candidates
       ↓
Vector Search
       ↓
100 Candidates
       ↓
Deterministic Scoring
       ↓
20 Candidates
       ↓
AI Ranking / Explanation
       ↓
Top 5 Recommendations
```

Do not send the entire alumni database to the LLM.

Use:

* PostgreSQL indexes
* pgvector indexes
* Metadata filtering
* Cached embeddings
* Top-K retrieval
* Background AI processing
* Pagination

---

# 55. Error Handling Architecture

The application should handle:

## AI API Failure

```text
AI service unavailable
        ↓
Show fallback message
        ↓
Allow user to retry
```

## Database Failure

```text
Database request fails
        ↓
Log error
        ↓
Show user-friendly message
        ↓
Retry where appropriate
```

## No Search Results

```text
No relevant alumni found
        ↓
Expand search scope
```

## Invalid AI Response

```text
AI response
     ↓
Schema validation
     ↓
Invalid?
   /     \
 YES     NO
  ↓       ↓
Retry   Continue
```

Structured AI output should be validated before being used by application logic.

---

# 56. Logging and Monitoring

For the hackathon MVP, log:

* AI requests
* Agent actions
* Tool calls
* Matching results
* API failures
* Database errors
* Connection actions
* AI response validation failures

Do not log sensitive private messages unnecessarily.

---

# 57. Deployment Architecture

```text
                    GitHub
                       │
                       ▼
                    Vercel
                       │
                       ▼
                  Next.js App
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Gemini API           Supabase
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
          PostgreSQL          Storage           Realtime
              │
              ▼
           pgvector
```

---

# 58. Development Environment

Local development:

```text
Developer
   ↓
Next.js
   ↓
Supabase
   ↓
Gemini API
```

Production:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ├── Supabase
   └── Gemini
```

---

# 59. Environment Separation

Use:

```text
.env.local
```

for local development.

Use Vercel Environment Variables for production.

Never commit:

```text
.env.local
```

to GitHub.

Use:

```text
.env.example
```

for documenting required environment variables.

---

# 60. 24-Hour Hackathon Architecture

The project should be implemented in priority order.

## Phase 1 — Foundation

Build:

* Authentication
* User profile
* Education journey
* Skills
* Career goal
* Supabase database
* Basic dashboard

---

## Phase 2 — Career Intelligence

Build:

* Career goal analysis
* Target role identification
* Skill-gap analysis
* Career roadmap
* Required skill identification

---

## Phase 3 — Networking Agent

Build:

```text
Goal
 ↓
Profile Analysis
 ↓
Skill Gap
 ↓
Alumni Search
 ↓
Semantic Matching
 ↓
Ranking
 ↓
Match Explanation
 ↓
Message Generation
 ↓
User Approval
 ↓
Connection
```

This is the most important demo workflow.

---

## Phase 4 — Networking

Build:

* Connection requests
* Accept/reject connection
* One-to-one chat
* Basic notifications

---

## Phase 5 — Relationship Intelligence

Build:

* Conversation summary
* Mentor advice extraction
* Follow-up suggestion
* Roadmap update suggestion

---

## Phase 6 — Demo Enhancements

If time remains:

* Achievement posts
* Opportunity matching
* Alumni engagement scoring
* No-alumni fallback
* AI profile enhancement

---

# 61. MVP Priority

## MUST HAVE

```text
1. Authentication
2. Unified user profile
3. Education journey
4. Skills
5. Career goal
6. AI career analysis
7. Skill-gap analysis
8. Career roadmap
9. Semantic alumni matching
10. Match explanation
11. Mentor recommendation
12. Personalized networking message
13. Connection request
14. Basic chat
```

---

## SHOULD HAVE

```text
15. Achievement posts
16. Job/internship matching
17. AI relationship assistance
18. No-alumni fallback
19. Alumni engagement scoring
20. Notifications
```

---

## OPTIONAL

```text
21. Advanced feed
22. Advanced analytics
23. Advanced verification
24. Advanced recommendation models
25. Portfolio generation
26. Gamification
```

---

# 62. Features to Avoid During the Hackathon

Avoid spending significant time on:

* Mobile application
* Voice calls
* Video calls
* Complex payment systems
* Huge social media feed
* Advanced admin dashboards
* Complex ML model training
* Custom recommendation model training
* Microservices
* Multiple backend servers
* Excessive animations
* Complex infrastructure
* Unnecessary third-party integrations

The goal is a strong working agentic system, not a huge unfinished application.

---

# 63. Recommended Demo Flow

The best hackathon demo should follow one complete user journey.

```text
1. User logs in
       ↓
2. User completes profile
       ↓
3. User adds education journey
       ↓
4. User enters:
   "I want to become a Cloud Engineer."
       ↓
5. Career Agent analyzes profile
       ↓
6. AI identifies skill gaps
       ↓
7. AI generates roadmap
       ↓
8. Networking Agent searches alumni
       ↓
9. AI finds relevant alumni
       ↓
10. AI explains match
       ↓
11. AI generates personalized message
       ↓
12. User approves message
       ↓
13. Connection request is created
       ↓
14. Alumni accepts
       ↓
15. Chat begins
       ↓
16. Mentor provides advice
       ↓
17. Relationship Agent extracts advice
       ↓
18. AI suggests roadmap update
```

This demonstrates the complete:

```text
Student Goal
→ Skill Gap
→ Relevant Alumni
→ Mentorship
→ Career Opportunity
```

workflow.

---

# 64. Judge-Facing Architecture Explanation

If judges ask:

"Where is the Agentic AI?"

Answer:

```text
Our system is not just an LLM chatbot.

The agent receives a career goal, analyzes the user's
profile, identifies skill gaps, searches the network
using semantic retrieval, evaluates and ranks alumni,
explains the recommendation, generates a personalized
networking message, waits for user approval, creates
the connection, observes the resulting conversation,
and recommends the next career action.

So the agent can understand, reason, use tools,
make decisions, act, observe and adapt.
```

---

# 65. Why This Is Not Just a Chatbot

A chatbot:

```text
User
 ↓
Question
 ↓
LLM
 ↓
Answer
```

Our system:

```text
User Goal
 ↓
Agent
 ↓
Profile Analysis
 ↓
Skill Gap
 ↓
Database Search
 ↓
Semantic Retrieval
 ↓
Candidate Ranking
 ↓
Decision
 ↓
Message Generation
 ↓
User Approval
 ↓
Connection
 ↓
Conversation Analysis
 ↓
Next Action
```

The agent performs actions across multiple steps and uses platform tools.

---

# 66. Core Architecture Principle

The platform follows:

```text
DATA
 ↓
INTELLIGENCE
 ↓
DECISION
 ↓
ACTION
 ↓
FEEDBACK
 ↓
ADAPTATION
```

Traditional platform:

```text
User searches
 ↓
Platform shows profiles
```

Our platform:

```text
User expresses career goal
 ↓
AI understands goal
 ↓
AI analyzes career gap
 ↓
AI searches network
 ↓
AI selects relevant people
 ↓
AI explains why
 ↓
AI prepares networking action
 ↓
User approves
 ↓
Connection happens
 ↓
AI learns from conversation
 ↓
Career roadmap evolves
```

---

# 67. Core Product Loop

The platform's main intelligence loop is:

```text
CAREER GOAL
     ↓
SKILL ANALYSIS
     ↓
SKILL GAP
     ↓
ALUMNI DISCOVERY
     ↓
SEMANTIC MATCHING
     ↓
MENTORSHIP
     ↓
NETWORKING
     ↓
CONVERSATION
     ↓
ADVICE
     ↓
CAREER ROADMAP
     ↓
NEW ACTION
```

This creates a continuous career development cycle.

---

# 68. System Components Summary

| Component      | Technology            | Purpose                       |
| -------------- | --------------------- | ----------------------------- |
| Frontend       | Next.js               | User interface                |
| UI             | Tailwind CSS          | Styling                       |
| Backend        | Next.js API           | Application logic             |
| Database       | Supabase PostgreSQL   | Structured data               |
| Authentication | Supabase Auth         | Login/signup                  |
| Storage        | Supabase Storage      | Files/images                  |
| Realtime       | Supabase Realtime     | Chat/notifications            |
| Vector Search  | pgvector              | Semantic matching             |
| LLM            | Gemini                | AI reasoning/generation       |
| Agents         | Custom Agent Workflow | Autonomous multi-step actions |
| RAG            | Retrieval + Gemini    | Grounded platform answers     |
| Deployment     | Vercel                | Web hosting                   |

---

# 69. Security Summary

The application follows these principles:

```text
Public Client Key
        ↓
Frontend

Private Keys
        ↓
Server Only

User Data
        ↓
Supabase RLS

AI
        ↓
Controlled Tools

Sensitive Actions
        ↓
Human Approval
```

---

# 70. Final Architecture Statement

The platform is a unified career intelligence and networking system built around an agentic AI workflow.

Its architecture combines:

* Next.js
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* pgvector
* Supabase Auth
* Supabase Realtime
* Supabase Storage
* Gemini
* Semantic Search
* RAG
* Agentic Workflows

The key architectural differentiator is not simply the use of an LLM.

The differentiator is the closed-loop agentic workflow:

```text
CAREER GOAL
     ↓
UNDERSTAND
     ↓
ANALYZE
     ↓
SEARCH
     ↓
MATCH
     ↓
EXPLAIN
     ↓
ACT
     ↓
CONNECT
     ↓
OBSERVE
     ↓
LEARN
     ↓
NEXT ACTION
```

This architecture directly supports the core challenge:

```text
Student Goal
      ↓
Skill Gap
      ↓
Relevant Alumni
      ↓
Mentorship
      ↓
Career Opportunity
```

The final product is therefore not simply an alumni directory.

It is an:

"AI-powered Career Navigation and Professional Networking Platform"

where AI continuously helps users understand:

* What should I do next?
* What skills am I missing?
* Who can help me?
* Why is this person relevant?
* How should I approach them?
* What should I ask them?
* What should I learn from the conversation?
* What should I do next in my career?

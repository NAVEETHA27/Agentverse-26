
# 03_DATABASE_AND_DATA_MODEL.md

# AI-Powered Alumni Career & Networking Platform
## Database & Data Model Specification

---

# 1. Purpose of This Document

This document defines the complete database and data model for the AI-Powered Alumni Career & Networking Platform.

The database must support:

- Unified user identity
- Multiple education experiences
- Student/alumni relationships
- Professional profiles
- Skills
- Career goals
- Projects
- Certifications
- Achievements
- Career journeys
- AI-generated career analysis
- Skill-gap analysis
- Career roadmaps
- Alumni semantic matching
- Mentor recommendations
- Connections
- One-to-one messaging
- Job and internship opportunities
- Referrals
- Achievement posts
- AI relationship assistance
- AI-generated profile intelligence
- Engagement prediction
- Notifications
- Feedback and reputation
- Vector embeddings
- Agent activity and decisions
- Auditability
- Human approval for sensitive AI actions

The database is designed for PostgreSQL and is compatible with Supabase.

---

# 2. Database Philosophy

The platform should not treat a person as only a "student" or only an "alumni".

A single person can have multiple relationships with educational institutions.

For example:

Person A:

- Bachelor's at ABC College
- Graduated in 2024
- Master's at XYZ University
- Expected graduation in 2027
- Currently working part-time
- Mentor for cloud computing
- Alumni of ABC College
- Student of XYZ University

Therefore:

```text
USER
 |
 +-- EDUCATION JOURNEY
 |
 +-- PROFESSIONAL PROFILE
 |
 +-- SKILLS
 |
 +-- CAREER GOALS
 |
 +-- PROJECTS
 |
 +-- CERTIFICATIONS
 |
 +-- ACHIEVEMENTS
 |
 +-- POSTS
 |
 +-- CONNECTIONS
 |
 +-- MESSAGES
 |
 +-- CAREER ROADMAP
 |
 +-- OPPORTUNITIES
````

The database must model the person as one unified identity.

---

# 3. Recommended Database

Primary database:

```text
PostgreSQL
```

Recommended platform:

```text
Supabase PostgreSQL
```

Additional Supabase services:

```text
Supabase Auth
Supabase Storage
Supabase Realtime
```

Optional AI/vector support:

```text
pgvector
```

---

# 4. High-Level Database Architecture

The database can be divided into the following logical modules.

```text
IDENTITY
    |
    +-- users
    +-- user_preferences
    |
EDUCATION
    |
    +-- institutions
    +-- education_records
    +-- degrees
    |
PROFESSIONAL
    |
    +-- professional_profiles
    +-- experiences
    +-- skills
    +-- user_skills
    +-- projects
    +-- certifications
    +-- achievements
    |
CAREER INTELLIGENCE
    |
    +-- career_goals
    +-- career_analyses
    +-- skill_gaps
    +-- career_roadmaps
    +-- roadmap_items
    |
NETWORKING
    |
    +-- connections
    +-- mentorship_preferences
    +-- mentorship_requests
    +-- match_results
    |
COMMUNICATION
    |
    +-- conversations
    +-- messages
    +-- message_read_status
    |
OPPORTUNITIES
    |
    +-- opportunities
    +-- opportunity_skills
    +-- referrals
    +-- saved_opportunities
    |
SOCIAL / PROFESSIONAL CONTENT
    |
    +-- posts
    +-- post_skills
    +-- post_likes
    +-- post_comments
    |
AI / AGENTS
    |
    +-- embeddings
    +-- agent_sessions
    +-- agent_actions
    +-- ai_recommendations
    +-- relationship_insights
    |
TRUST / ENGAGEMENT
    |
    +-- profile_verifications
    +-- feedback
    +-- engagement_scores
    |
SYSTEM
    |
    +-- notifications
    +-- reports
    +-- audit_logs
```

---

# 5. Primary Entity

The most important entity is:

```text
users
```

Every other major entity should connect back to the user.

---

# 6. users Table

Purpose:

Stores the core identity of every person using the platform.

Suggested structure:

```text
users
-----------------------------
id                  UUID PK
email               TEXT UNIQUE
full_name           TEXT
username            TEXT UNIQUE
profile_photo_url   TEXT
headline            TEXT
bio                 TEXT
location            TEXT
country             TEXT
phone               TEXT NULL
date_of_birth       DATE NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
last_active_at      TIMESTAMP
is_active           BOOLEAN
```

Important:

Do not store:

```text
role = student
role = alumni
```

as a permanent identity field.

Instead, derive institutional relationships from education records.

---

# 7. Authentication

Supabase Auth should handle authentication.

The application database should reference the authenticated user ID.

Recommended relationship:

```text
auth.users
      |
      |
      v
public.users
```

The authenticated Supabase user ID should match:

```text
users.id
```

The application should never store raw passwords.

---

# 8. User Preferences Table

Table:

```text
user_preferences
```

Purpose:

Stores personalization and privacy preferences.

Fields:

```text
id                  UUID PK
user_id             UUID FK
preferred_roles     JSONB
preferred_industries JSONB
preferred_locations JSONB
preferred_work_mode TEXT
career_interests    JSONB
notification_settings JSONB
privacy_settings    JSONB
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Examples:

```text
preferred_roles:
[
  "Cloud Engineer",
  "DevOps Engineer"
]
```

---

# 9. institutions Table

Purpose:

Stores colleges, universities, companies, or other educational institutions.

Fields:

```text
institutions
-----------------------------
id                  UUID PK
name                TEXT
short_name          TEXT
type                TEXT
location            TEXT
country             TEXT
website             TEXT NULL
description         TEXT NULL
logo_url            TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Possible institution types:

```text
college
university
institute
school
bootcamp
other
```

---

# 10. degrees Table

Purpose:

Stores standardized degree information.

Fields:

```text
degrees
-----------------------------
id                  UUID PK
name                TEXT
level               TEXT
field               TEXT NULL
created_at          TIMESTAMP
```

Examples:

```text
B.E.
B.Tech
M.E.
M.Tech
B.Sc
M.Sc
MBA
Ph.D
```

Degree level:

```text
undergraduate
postgraduate
doctoral
certificate
other
```

---

# 11. education_records Table

This is one of the most important tables.

Purpose:

Represents the user's education journey.

A user can have multiple education records.

Fields:

```text
education_records
-----------------------------
id                  UUID PK
user_id             UUID FK
institution_id      UUID FK
degree_id           UUID FK
field_of_study      TEXT
start_year          INT
end_year            INT NULL
graduation_year     INT NULL
expected_graduation_year INT NULL
status              TEXT
description         TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Possible status:

```text
current
graduated
completed
dropped
on_hold
```

Example:

```text
User:
Naveetha

Education 1:
ABC College
B.E.
Electronics and Communication Engineering
2022 - 2026
current

Education 2:
XYZ University
M.Tech
Computer Science
2026 - 2028
current
```

This allows the same user to be:

```text
Alumni of ABC College
Student of XYZ University
```

simultaneously.

---

# 12. Institutional Relationship Logic

Do not create separate tables:

```text
students
alumni
```

Instead:

```text
education_records
```

determines the relationship.

Example:

```text
graduation_year < current_year
        |
        v
ALUMNI

expected_graduation_year >= current_year
        |
        v
STUDENT
```

The system can dynamically determine:

```text
Current Student
Alumni
Former Student
Multiple Institution Alumni
```

---

# 13. professional_profiles Table

Purpose:

Stores professional identity.

Fields:

```text
professional_profiles
-----------------------------
id                  UUID PK
user_id             UUID FK UNIQUE
current_company     TEXT NULL
current_role        TEXT NULL
industry            TEXT NULL
years_of_experience DECIMAL
linkedin_url        TEXT NULL
portfolio_url       TEXT NULL
github_url          TEXT NULL
resume_url          TEXT NULL
open_to_work        BOOLEAN
open_to_mentor      BOOLEAN
open_to_hiring      BOOLEAN
open_to_referrals   BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 14. experiences Table

Purpose:

Stores professional experience history.

Fields:

```text
experiences
-----------------------------
id                  UUID PK
user_id             UUID FK
company_name        TEXT
job_title           TEXT
employment_type     TEXT
industry            TEXT NULL
location            TEXT NULL
start_date          DATE
end_date            DATE NULL
is_current          BOOLEAN
description         TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Employment types:

```text
full_time
part_time
internship
freelance
contract
founder
other
```

---

# 15. skills Table

Purpose:

Stores standardized skills.

Fields:

```text
skills
-----------------------------
id                  UUID PK
name                TEXT UNIQUE
category            TEXT
description         TEXT NULL
created_at          TIMESTAMP
```

Examples:

```text
Java
Python
AWS
Docker
Kubernetes
React
SQL
Machine Learning
Data Engineering
Cybersecurity
Communication
Leadership
```

---

# 16. user_skills Table

Many-to-many relationship:

```text
users <----> skills
```

Fields:

```text
user_skills
-----------------------------
id                  UUID PK
user_id             UUID FK
skill_id            UUID FK
proficiency_level   TEXT
years_experience    DECIMAL NULL
source              TEXT
verified             BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Possible proficiency:

```text
beginner
intermediate
advanced
expert
```

Source:

```text
self_reported
resume
project
certification
experience
ai_extracted
```

---

# 17. AI Skill Extraction

AI may identify skills from:

```text
resume
projects
posts
certifications
experience descriptions
career goals
chat conversations
```

However, AI should not silently modify important profile information.

Recommended workflow:

```text
AI detects skill
       |
       v
suggest skill
       |
       v
user approves
       |
       v
user_skills
```

---

# 18. projects Table

Purpose:

Stores projects completed by users.

Fields:

```text
projects
-----------------------------
id                  UUID PK
user_id             UUID FK
title               TEXT
description         TEXT
project_url         TEXT NULL
github_url          TEXT NULL
start_date          DATE NULL
end_date            DATE NULL
project_type        TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 19. project_skills Table

Many-to-many relationship:

```text
projects <----> skills
```

Fields:

```text
project_skills
-----------------------------
id                  UUID PK
project_id          UUID FK
skill_id            UUID FK
created_at          TIMESTAMP
```

Example:

```text
Project:
AI Resume Analyzer

Skills:
Python
NLP
Machine Learning
FastAPI
PostgreSQL
```

---

# 20. certifications Table

Purpose:

Stores certifications.

Fields:

```text
certifications
-----------------------------
id                  UUID PK
user_id             UUID FK
name                TEXT
issuing_organization TEXT
credential_id       TEXT NULL
credential_url      TEXT NULL
issue_date          DATE NULL
expiry_date         DATE NULL
description         TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 21. achievements Table

Purpose:

Stores professional and academic achievements.

Examples:

```text
Hackathon
Award
Publication
Competition
Scholarship
Leadership
Open-source contribution
Conference
Career milestone
```

Fields:

```text
achievements
-----------------------------
id                  UUID PK
user_id             UUID FK
title               TEXT
description         TEXT
achievement_type    TEXT
organization        TEXT NULL
achievement_date    DATE NULL
url                 TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 22. Career Goals

Table:

```text
career_goals
```

Purpose:

Stores what the user wants to achieve.

Fields:

```text
career_goals
-----------------------------
id                  UUID PK
user_id             UUID FK
goal_text           TEXT
target_role         TEXT
target_industry     TEXT NULL
target_company      TEXT NULL
target_location     TEXT NULL
target_timeframe    TEXT NULL
priority            INT
status              TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Example:

```text
goal_text:
"I want to become a Cloud Engineer."

target_role:
Cloud Engineer

target_industry:
Technology
```

---

# 23. Multiple Career Goals

A user may have multiple goals.

Example:

```text
Goal 1:
Become a Cloud Engineer

Goal 2:
Get AWS certification

Goal 3:
Find a cloud internship
```

The database should therefore NOT enforce one career goal per user.

---

# 24. Career Analysis Table

Table:

```text
career_analyses
```

Purpose:

Stores AI analysis results.

Fields:

```text
career_analyses
-----------------------------
id                  UUID PK
user_id             UUID FK
career_goal_id      UUID FK
current_profile_summary TEXT
target_role_summary TEXT
strengths            JSONB
skill_gaps           JSONB
recommended_skills  JSONB
recommended_projects JSONB
recommended_certifications JSONB
recommended_roles   JSONB
analysis_version    TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 25. Why Store AI Analysis?

AI output should not always be regenerated.

Instead:

```text
User requests analysis
        |
        v
Generate AI analysis
        |
        v
Store result
        |
        v
Reuse until profile/goal changes
```

This reduces:

```text
API cost
latency
duplicate AI calls
```

---

# 26. Skill Gaps Table

Table:

```text
skill_gaps
```

Purpose:

Stores identified gaps between current skills and target career requirements.

Fields:

```text
skill_gaps
-----------------------------
id                  UUID PK
user_id             UUID FK
career_goal_id      UUID FK
skill_id            UUID FK
importance           TEXT
current_level        TEXT
required_level       TEXT
gap_score            DECIMAL
reason               TEXT
status               TEXT
created_at           TIMESTAMP
updated_at           TIMESTAMP
```

Example:

```text
Skill:
Kubernetes

Current:
Beginner

Required:
Intermediate

Gap:
High
```

---

# 27. Career Roadmaps

Table:

```text
career_roadmaps
```

Purpose:

Stores an AI-generated career path.

Fields:

```text
career_roadmaps
-----------------------------
id                  UUID PK
user_id             UUID FK
career_goal_id      UUID FK
title               TEXT
description         TEXT
duration_estimate   TEXT NULL
status              TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 28. Roadmap Items

Table:

```text
roadmap_items
```

Fields:

```text
roadmap_items
-----------------------------
id                  UUID PK
roadmap_id          UUID FK
title               TEXT
description         TEXT
item_type           TEXT
skill_id            UUID NULL
sequence_order      INT
estimated_duration  TEXT NULL
resource_url        TEXT NULL
status              TEXT
completed_at        TIMESTAMP NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Possible item types:

```text
learn_skill
course
project
certification
mentor
networking
job_application
internship
portfolio
interview_prep
```

---

# 29. Roadmap Example

```text
Career Goal:
Cloud Engineer

Roadmap:

1. Learn Linux
2. Improve Networking
3. Learn AWS
4. Build AWS Project
5. Learn Docker
6. Learn Kubernetes
7. Learn CI/CD
8. Connect with Cloud Engineer Alumni
9. Get AWS Certification
10. Apply for Cloud Engineer Internship
```

---

# 30. Mentorship Preferences

Table:

```text
mentorship_preferences
```

Purpose:

Stores what a person can mentor or what they want mentoring in.

Fields:

```text
mentorship_preferences
-----------------------------
id                  UUID PK
user_id             UUID FK
mentorship_type     TEXT
topics              JSONB
availability        JSONB
preferred_mode      TEXT
max_mentees         INT NULL
is_available        BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 31. Mentorship Types

Examples:

```text
career_guidance
technical
resume_review
interview_prep
project_review
higher_studies
entrepreneurship
industry_transition
leadership
```

---

# 32. Connections Table

Table:

```text
connections
```

Purpose:

Stores networking relationships.

Fields:

```text
connections
-----------------------------
id                  UUID PK
requester_id        UUID FK
receiver_id         UUID FK
status              TEXT
connection_type     TEXT
source              TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
accepted_at         TIMESTAMP NULL
```

Possible statuses:

```text
pending
accepted
rejected
blocked
cancelled
```

Connection types:

```text
professional
mentor
mentee
alumni
peer
```

---

# 33. Connection Rules

A connection must not be duplicated.

Recommended database constraint:

```text
UNIQUE(requester_id, receiver_id)
```

Application logic should also normalize:

```text
A -> B
B -> A
```

as the same relationship.

---

# 34. Match Results Table

Table:

```text
match_results
```

Purpose:

Stores AI-generated alumni/mentor matching results.

Fields:

```text
match_results
-----------------------------
id                  UUID PK
user_id             UUID FK
matched_user_id     UUID FK
career_goal_id      UUID FK NULL
match_type          TEXT
overall_score       DECIMAL
career_goal_score   DECIMAL
skill_score         DECIMAL
education_score     DECIMAL
industry_score      DECIMAL
experience_score    DECIMAL
location_score      DECIMAL NULL
explanation         TEXT
match_reasons       JSONB
created_at          TIMESTAMP
expires_at          TIMESTAMP NULL
```

---

# 35. Match Score Model

Do not let the LLM randomly invent a percentage.

Recommended deterministic model:

```text
Career Goal Similarity      30%
Skill Similarity            25%
Education Connection        20%
Industry/Role Similarity   15%
Experience Relevance        10%
```

Example:

```text
Career Goal = 28/30
Skills = 22/25
Education = 20/20
Industry = 13/15
Experience = 8/10

Total = 91/100
```

The AI can explain the score.

---

# 36. Match Reasons

Store structured reasons.

Example:

```json
[
  "Works as a Cloud Engineer",
  "Has AWS and Kubernetes experience",
  "Graduated from the same institution",
  "Has 5 years of industry experience",
  "Open to mentoring"
]
```

This allows the frontend to display:

```text
91% Match

Why:
✓ Same institution
✓ Cloud Engineer
✓ AWS + Kubernetes
✓ 5 years experience
✓ Open to mentoring
```

---

# 37. Semantic Search

The platform should use vector embeddings for semantic matching.

Examples:

```text
"I want to become a cloud engineer"

should match:

"Cloud Infrastructure Engineer"

"DevOps Engineer"

"Site Reliability Engineer"

"AWS Solutions Architect"
```

Keyword matching alone would miss some of these relationships.

---

# 38. embeddings Table

Table:

```text
embeddings
-----------------------------
id                  UUID PK
entity_type         TEXT
entity_id           UUID
content             TEXT
embedding           VECTOR
embedding_model     TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Entity types:

```text
user_profile
career_goal
project
post
experience
opportunity
```

---

# 39. Vector Embedding Strategy

Create embeddings for meaningful semantic content.

Example user embedding content:

```text
Current Role:
Software Engineer

Skills:
Java, Spring Boot, AWS, Docker

Industry:
FinTech

Experience:
3 years

Career Interests:
Cloud Engineering, DevOps

Education:
B.Tech Computer Science
```

The resulting embedding represents the user's professional context.

---

# 40. Career Goal Embedding

Example:

```text
"I want to become a cybersecurity engineer and work in cloud security."
```

Generate an embedding.

Then compare it with:

```text
alumni profile embeddings
```

using vector similarity.

---

# 41. Alumni Matching Architecture

The database should support:

```text
User Goal
    |
    v
career_goals
    |
    v
embedding
    |
    v
vector search
    |
    v
candidate alumni
    |
    v
structured filtering
    |
    v
match scoring
    |
    v
AI explanation
```

---

# 42. Two-Stage Retrieval

Do not send thousands of alumni profiles to the LLM.

Instead:

```text
5000 alumni
    |
    v
Database filters
    |
    v
500 candidates
    |
    v
Vector similarity
    |
    v
50 candidates
    |
    v
Ranking
    |
    v
Top 5
```

This is faster and cheaper.

---

# 43. conversations Table

Purpose:

Stores one-to-one chat conversations.

Fields:

```text
conversations
-----------------------------
id                  UUID PK
created_at          TIMESTAMP
updated_at          TIMESTAMP
last_message_at     TIMESTAMP
```

---

# 44. conversation_members Table

Fields:

```text
conversation_members
-----------------------------
id                  UUID PK
conversation_id     UUID FK
user_id             UUID FK
joined_at           TIMESTAMP
last_read_at        TIMESTAMP NULL
```

For a one-to-one chat:

```text
conversation
     |
     +-- user A
     |
     +-- user B
```

---

# 45. messages Table

Purpose:

Stores chat messages.

Fields:

```text
messages
-----------------------------
id                  UUID PK
conversation_id     UUID FK
sender_id           UUID FK
message_text        TEXT
message_type        TEXT
created_at          TIMESTAMP
edited_at            TIMESTAMP NULL
deleted_at          TIMESTAMP NULL
```

Message types:

```text
text
system
ai_suggestion
attachment
```

---

# 46. Message Read Status

For basic one-to-one chat, `last_read_at` in `conversation_members` can be sufficient.

For detailed read receipts:

```text
message_read_status
-----------------------------
id                  UUID PK
message_id          UUID FK
user_id             UUID FK
read_at             TIMESTAMP
```

---

# 47. AI Relationship Insights

Table:

```text
relationship_insights
```

Purpose:

Stores AI-generated insights from conversations.

Fields:

```text
relationship_insights
-----------------------------
id                  UUID PK
conversation_id     UUID FK
user_id             UUID FK
summary             TEXT
advice_points       JSONB
action_items        JSONB
questions_to_ask    JSONB
follow_up_suggestion TEXT
roadmap_suggestions JSONB
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 48. Example Relationship Insight

Mentor says:

```text
"Learn PyTorch and build a computer vision project."
```

AI extracts:

```text
Advice:
Learn PyTorch

Action:
Build computer vision project

Roadmap suggestion:
Add PyTorch learning module
Add computer vision project
```

The AI should ask the user for approval before modifying the roadmap.

---

# 49. Opportunities Table

Table:

```text
opportunities
-----------------------------
id                  UUID PK
posted_by_user_id   UUID FK NULL
company_name        TEXT
title               TEXT
description         TEXT
opportunity_type    TEXT
location            TEXT NULL
work_mode           TEXT NULL
application_url     TEXT NULL
deadline            DATE NULL
is_active           BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Types:

```text
job
internship
referral
mentorship
project
event
```

---

# 50. Opportunity Skills

Table:

```text
opportunity_skills
-----------------------------
id                  UUID PK
opportunity_id      UUID FK
skill_id            UUID FK
importance          TEXT
created_at          TIMESTAMP
```

This enables:

```text
Career Goal
    |
    v
Required Skills
    |
    v
Opportunity Skills
    |
    v
Opportunity Matching
```

---

# 51. Referrals Table

Table:

```text
referrals
-----------------------------
id                  UUID PK
opportunity_id      UUID FK
referrer_id         UUID FK
candidate_id        UUID FK
status              TEXT
message             TEXT NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Statuses:

```text
requested
accepted
declined
submitted
completed
```

---

# 52. Saved Opportunities

Table:

```text
saved_opportunities
-----------------------------
id                  UUID PK
user_id             UUID FK
opportunity_id      UUID FK
created_at          TIMESTAMP
```

Constraint:

```text
UNIQUE(user_id, opportunity_id)
```

---

# 53. Posts Table

Purpose:

Professional achievement and career-oriented social feed.

Fields:

```text
posts
-----------------------------
id                  UUID PK
user_id             UUID FK
content             TEXT
media_url           TEXT NULL
post_type           TEXT
visibility          TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Post types:

```text
achievement
project
hackathon
certification
career_update
internship
job_update
technical_article
event
startup
other
```

---

# 54. AI Post Analysis

AI can analyze posts to extract:

```text
skills
industry
career interests
project type
achievement type
technology
job roles
```

Example:

Post:

```text
"Built an AWS-based serverless application using Lambda and DynamoDB."
```

AI extracts:

```text
AWS
Serverless
Lambda
DynamoDB
Cloud Computing
Backend Development
```

---

# 55. post_skills Table

Fields:

```text
post_skills
-----------------------------
id                  UUID PK
post_id             UUID FK
skill_id            UUID FK
source              TEXT
confidence_score    DECIMAL NULL
created_at          TIMESTAMP
```

---

# 56. Post Likes

Table:

```text
post_likes
-----------------------------
id                  UUID PK
post_id             UUID FK
user_id             UUID FK
created_at          TIMESTAMP
```

Constraint:

```text
UNIQUE(post_id, user_id)
```

---

# 57. Post Comments

Table:

```text
post_comments
-----------------------------
id                  UUID PK
post_id             UUID FK
user_id             UUID FK
content             TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 58. AI Recommendations

Table:

```text
ai_recommendations
-----------------------------
id                  UUID PK
user_id             UUID FK
recommendation_type TEXT
target_entity_type  TEXT
target_entity_id    UUID
score               DECIMAL NULL
reason              TEXT
priority             INT
status              TEXT
created_at          TIMESTAMP
expires_at          TIMESTAMP NULL
```

Types:

```text
alumni
mentor
job
internship
skill
course
project
connection
```

---

# 59. Recommendation Example

```text
User:
"I want to become a Data Engineer."

Recommendation:

Person:
Alumni A

Reason:
"Works as a Data Engineer and has experience with
Python, Spark, Kafka and AWS."

Action:
Connect
```

---

# 60. Agent Sessions

Table:

```text
agent_sessions
-----------------------------
id                  UUID PK
user_id             UUID FK
agent_type          TEXT
goal                TEXT
status              TEXT
context             JSONB
started_at          TIMESTAMP
completed_at        TIMESTAMP NULL
```

Agent types:

```text
career_agent
networking_agent
relationship_agent
post_agent
```

---

# 61. Agent Actions

Table:

```text
agent_actions
-----------------------------
id                  UUID PK
session_id          UUID FK
action_type         TEXT
target_entity_type  TEXT NULL
target_entity_id    UUID NULL
input_data          JSONB
output_data         JSONB
status              TEXT
requires_approval   BOOLEAN
approved_at         TIMESTAMP NULL
created_at          TIMESTAMP
```

---

# 62. Agent Action Examples

Examples:

```text
analyze_profile
extract_goal
identify_skill_gap
search_alumni
rank_candidates
generate_message
create_connection_request
summarize_chat
suggest_follow_up
update_roadmap
search_opportunity
```

---

# 63. Human Approval

Sensitive actions should require approval.

Example:

```text
AI generates message
        |
        v
User reviews
        |
        v
Approve
        |
        v
Connection request sent
```

Database:

```text
requires_approval = true
```

before execution.

---

# 64. Agent State

The agent should be able to remember workflow state.

Example:

```text
Goal:
Become a Cloud Engineer

Current step:
Find mentor

Candidates found:
12

Top candidates:
5

Selected:
Candidate #2

Message generated:
Yes

User approval:
Pending
```

This state can be stored in:

```text
agent_sessions.context
```

and/or structured tables.

---

# 65. No-Alumni Fallback

The system must support fallback search.

Search levels:

```text
LEVEL 1
Same institution alumni

        ↓ if insufficient

LEVEL 2
Broader alumni network

        ↓ if insufficient

LEVEL 3
Industry mentors/professionals

        ↓ if insufficient

LEVEL 4
Career resources/opportunities
```

The agent should record which search level was used.

---

# 66. Fallback Metadata

Add to `match_results`:

```text
search_scope
```

Possible values:

```text
institution
broader_alumni
industry_network
global_network
```

Example:

```text
search_scope:
broader_alumni
```

UI message:

```text
"We couldn't find a strong cybersecurity mentor
from your institution, so we expanded the search
to the wider alumni network."
```

---

# 67. Profile Verification

Table:

```text
profile_verifications
-----------------------------
id                  UUID PK
user_id             UUID FK
verification_type   TEXT
status              TEXT
evidence_url        TEXT NULL
verified_at         TIMESTAMP NULL
created_at          TIMESTAMP
```

Verification types:

```text
education
employment
professional
institution
```

Statuses:

```text
pending
verified
rejected
```

Verification should improve trust but should not block normal platform usage unless required by institution policy.

---

# 68. Feedback Table

Table:

```text
feedback
-----------------------------
id                  UUID PK
from_user_id        UUID FK
to_user_id          UUID FK
connection_id       UUID FK NULL
rating              INT
comment             TEXT NULL
feedback_type       TEXT
created_at          TIMESTAMP
```

Feedback types:

```text
mentorship
career_guidance
resume_review
professional_connection
general
```

---

# 69. Engagement Scores

Table:

```text
engagement_scores
-----------------------------
id                  UUID PK
user_id             UUID FK
mentor_score        DECIMAL
event_score         DECIMAL
hiring_score        DECIMAL
networking_score    DECIMAL
overall_score       DECIMAL
factors             JSONB
calculated_at       TIMESTAMP
```

Example:

```text
Mentor Score: 87
Hiring Score: 72
Networking Score: 91
Overall: 84
```

---

# 70. Engagement Prediction

The system can use signals such as:

```text
previous mentoring
connection acceptance rate
response rate
profile activity
post activity
opportunity sharing
referrals
availability
```

The first hackathon version can use a rule-based score.

Example:

```text
mentor_score =
  response_rate * 0.30
+ mentorship_history * 0.30
+ activity * 0.20
+ open_to_mentor * 0.20
```

A machine-learning model can replace this later.

---

# 71. Notifications Table

Table:

```text
notifications
-----------------------------
id                  UUID PK
user_id             UUID FK
type                TEXT
title               TEXT
message             TEXT
entity_type         TEXT NULL
entity_id           UUID NULL
is_read             BOOLEAN
created_at          TIMESTAMP
```

Types:

```text
connection_request
connection_accepted
new_message
mentor_recommendation
job_recommendation
roadmap_update
ai_suggestion
post_interaction
system
```

---

# 72. Reports Table

Table:

```text
reports
-----------------------------
id                  UUID PK
reported_by_user_id UUID FK
target_entity_type  TEXT
target_entity_id    UUID
reason              TEXT
description         TEXT NULL
status              TEXT
created_at          TIMESTAMP
resolved_at         TIMESTAMP NULL
```

Used for:

```text
spam
harassment
fake profile
inappropriate content
misinformation
```

---

# 73. Audit Logs

Table:

```text
audit_logs
-----------------------------
id                  UUID PK
user_id             UUID FK NULL
action              TEXT
entity_type         TEXT
entity_id           UUID NULL
metadata            JSONB
created_at          TIMESTAMP
```

Important for AI actions.

Example:

```text
action:
AI_GENERATED_CONNECTION_MESSAGE

metadata:
{
  "agent": "networking_agent",
  "approved": true
}
```

---

# 74. Database Relationships

Main relationships:

```text
users
 |
 +---- user_preferences
 |
 +---- education_records ---- institutions
 |                         \
 |                          degrees
 |
 +---- professional_profiles
 |
 +---- experiences
 |
 +---- user_skills -------- skills
 |
 +---- projects ----------- project_skills ---- skills
 |
 +---- certifications
 |
 +---- achievements
 |
 +---- career_goals
 |          |
 |          +---- career_analyses
 |          |
 |          +---- skill_gaps ---- skills
 |          |
 |          +---- career_roadmaps
 |                         |
 |                         +---- roadmap_items
 |
 +---- mentorship_preferences
 |
 +---- connections
 |
 +---- conversations
 |          |
 |          +---- conversation_members
 |          |
 |          +---- messages
 |
 +---- opportunities
 |
 +---- posts
 |          |
 |          +---- post_skills
 |          +---- post_likes
 |          +---- post_comments
 |
 +---- ai_recommendations
 |
 +---- agent_sessions
 |          |
 |          +---- agent_actions
 |
 +---- relationship_insights
 |
 +---- profile_verifications
 |
 +---- engagement_scores
 |
 +---- notifications
 |
 +---- reports
 |
 +---- audit_logs
```

---

# 75. Foreign Key Strategy

Recommended:

```text
users.id
```

is referenced by most user-owned tables.

Example:

```text
education_records.user_id
professional_profiles.user_id
experiences.user_id
user_skills.user_id
projects.user_id
career_goals.user_id
connections.requester_id
connections.receiver_id
```

Use foreign keys to maintain data integrity.

---

# 76. Delete Strategy

Be careful with user deletion.

For user-owned temporary data:

```text
ON DELETE CASCADE
```

may be appropriate.

For important historical records:

```text
ON DELETE RESTRICT
```

or soft deletion may be preferable.

Recommended user deletion approach:

```text
users.is_active = false
```

followed by controlled data deletion according to privacy policy.

---

# 77. UUID Strategy

Use UUIDs for primary keys.

Example:

```text
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

Advantages:

```text
harder to guess
distributed-system friendly
Supabase friendly
easy to generate
```

---

# 78. Timestamps

Use:

```text
created_at
updated_at
```

on most tables.

Prefer timezone-aware timestamps:

```text
TIMESTAMPTZ
```

instead of:

```text
TIMESTAMP
```

when supported by the schema.

---

# 79. JSONB Usage

Use JSONB for flexible AI outputs.

Good examples:

```text
career_analyses.strengths
career_analyses.skill_gaps
agent_sessions.context
agent_actions.input_data
agent_actions.output_data
match_results.match_reasons
engagement_scores.factors
```

Do not use JSONB for everything.

Core searchable relationships should remain normalized.

---

# 80. Normalization Strategy

Use relational tables for:

```text
users
skills
education
experiences
connections
messages
opportunities
```

Use JSONB for:

```text
AI outputs
dynamic metadata
temporary agent context
explanations
prediction factors
```

Use vectors for:

```text
semantic matching
semantic search
AI recommendation
```

---

# 81. Row Level Security

Supabase Row Level Security must be enabled.

Users should only be able to modify their own private information.

Example:

```text
User A
   |
   +-- can read own profile
   +-- can update own profile
   +-- can manage own career goals
   +-- can manage own roadmap
```

Users should not be allowed to directly modify:

```text
another user's profile
another user's messages
another user's private data
AI audit records
```

---

# 82. Profile Visibility

Profiles should support visibility settings.

Example:

```text
public
network_only
institution_only
private
```

This should affect:

```text
search
matching
profile viewing
AI retrieval
```

---

# 83. Chat Privacy

AI should not automatically analyze every private conversation without clear product policy and user consent.

Recommended:

```text
User opens AI Relationship Assistant
        |
        v
User requests conversation summary
        |
        v
AI analyzes allowed conversation
```

Do not silently use private messages for unrelated recommendations.

---

# 84. Data Sources for AI

AI can use:

```text
User profile
Education
Skills
Experience
Projects
Certifications
Achievements
Career goals
Roadmap
Public posts
Public opportunities
Approved conversation insights
```

AI should not retrieve arbitrary private records.

---

# 85. Profile Search Data

A searchable profile representation can contain:

```text
Name
Headline
Current role
Company
Industry
Skills
Education
Experience
Location
Career interests
Mentorship availability
Projects
Certifications
Achievements
```

---

# 86. AI Retrieval Context

When the Networking Agent searches for alumni, the retrieved context should contain only the information required for matching.

Example:

```text
Candidate:
Alumni A

Role:
Cloud Engineer

Company:
XYZ

Skills:
AWS, Docker, Kubernetes

Experience:
4 years

Education:
B.Tech, ABC College

Mentoring:
Cloud Computing

Location:
Chennai
```

Do not send irrelevant private information to the LLM.

---

# 87. Indexing Strategy

Important indexes:

```text
users.email
users.username

education_records.user_id
education_records.institution_id

user_skills.user_id
user_skills.skill_id

experiences.user_id

career_goals.user_id

connections.requester_id
connections.receiver_id

messages.conversation_id

posts.user_id

opportunities.opportunity_type

notifications.user_id

match_results.user_id
match_results.matched_user_id
```

---

# 88. Composite Indexes

Useful composite indexes:

```text
connections(requester_id, receiver_id)

user_skills(user_id, skill_id)

education_records(user_id, institution_id)

messages(conversation_id, created_at)

notifications(user_id, is_read)

match_results(user_id, overall_score)
```

---

# 89. Unique Constraints

Examples:

```text
users.email
users.username

skills.name

user_skills(user_id, skill_id)

post_likes(post_id, user_id)

saved_opportunities(user_id, opportunity_id)

conversation_members(conversation_id, user_id)
```

---

# 90. Search Strategy

The platform should combine:

```text
Structured filtering
+
Keyword search
+
Vector similarity
+
AI ranking
```

Example:

```text
Goal:
"I want to become a cybersecurity engineer."

Step 1:
Filter users with relevant professional fields.

Step 2:
Vector similarity.

Step 3:
Skill overlap.

Step 4:
Education relationship.

Step 5:
Mentorship availability.

Step 6:
Final ranking.
```

---

# 91. Semantic Matching Data Flow

```text
Career Goal
     |
     v
Generate Embedding
     |
     v
Vector Search
     |
     v
Candidate Users
     |
     v
Filter:
- visibility
- institution
- role
- skills
- mentorship availability
     |
     v
Calculate Match Score
     |
     v
Generate Explanation
     |
     v
Store match_results
```

---

# 92. AI-Generated Content Storage

AI-generated content should be stored separately from user-authored content when practical.

Examples:

```text
AI career analysis
AI roadmap
AI recommendation
AI message suggestion
AI relationship insight
AI profile suggestion
```

This helps distinguish:

```text
USER DATA
vs
AI-GENERATED DATA
```

---

# 93. AI Confidence

Where appropriate, AI outputs can store:

```text
confidence_score
```

But confidence should not be presented as scientific certainty.

For example:

```text
AI confidence:
0.86
```

can be used internally for ranking or review.

Do not tell users:

```text
"86% guaranteed correct"
```

---

# 94. Agent Traceability

Every meaningful autonomous workflow should be traceable.

Example:

```text
agent_sessions
       |
       +-- action: analyze_goal
       |
       +-- action: retrieve_candidates
       |
       +-- action: rank_candidates
       |
       +-- action: generate_message
       |
       +-- action: request_approval
       |
       +-- action: send_connection
```

This makes the system easier to debug and demonstrate to judges.

---

# 95. Agentic AI Database Flow

```text
USER
 |
 | "I want a mentor in cloud computing"
 v
CAREER GOAL
 |
 v
CAREER AGENT
 |
 +-- Read profile
 |
 +-- Read skills
 |
 +-- Identify missing skills
 |
 +-- Search network
 |
 +-- Read match results
 |
 +-- Select candidates
 |
 +-- Ask Networking Agent
 |
 v
NETWORKING AGENT
 |
 +-- Generate message
 |
 +-- Ask user approval
 |
 v
CONNECTION
 |
 v
CHAT
 |
 v
RELATIONSHIP AGENT
 |
 +-- Extract advice
 |
 +-- Suggest follow-up
 |
 +-- Suggest roadmap update
```

---

# 96. Minimum Viable Database

For the 24-hour hackathon, the absolute MVP database should prioritize:

```text
users
institutions
education_records
professional_profiles
skills
user_skills
experiences
projects
career_goals
career_analyses
skill_gaps
career_roadmaps
roadmap_items
connections
conversations
conversation_members
messages
match_results
embeddings
agent_sessions
agent_actions
notifications
```

---

# 97. Phase 2 Database Tables

If time permits:

```text
certifications
achievements
mentorship_preferences
mentorship_requests
opportunities
opportunity_skills
referrals
saved_opportunities
posts
post_skills
post_likes
post_comments
relationship_insights
engagement_scores
feedback
profile_verifications
reports
audit_logs
```

---

# 98. Hackathon Seed Data

The demo database should contain realistic seed data.

Recommended:

```text
50-100 users
20-40 alumni
10-20 current students
10-20 mentors/professionals
30-50 skills
20-30 companies
20-30 career goals
10-20 opportunities
```

For a strong demo, create alumni with different:

```text
companies
roles
industries
skills
locations
experience levels
education histories
mentoring areas
```

---

# 99. Example Seed Alumni

Example:

```text
Alumni 1
Role: Cloud Engineer
Company: Microsoft
Skills: AWS, Azure, Kubernetes
Experience: 5 years
Mentoring: Cloud Engineering

Alumni 2
Role: Data Engineer
Company: Amazon
Skills: Python, Spark, Kafka, AWS
Experience: 6 years
Mentoring: Data Engineering

Alumni 3
Role: Cybersecurity Engineer
Company: Deloitte
Skills: Security, SIEM, Cloud Security
Experience: 4 years
Mentoring: Cybersecurity

Alumni 4
Role: ML Engineer
Company: Google
Skills: Python, TensorFlow, PyTorch
Experience: 5 years
Mentoring: AI/ML
```

---

# 100. Example Demo User

```text
Name:
Student A

Education:
B.Tech Computer Science
ABC College

Skills:
Python
Java
SQL
Linux

Career Goal:
"I want to become a Cloud Engineer."

Current Gaps:
AWS
Docker
Kubernetes
CI/CD
Cloud Security
```

The system should identify:

```text
Alumni 1
Cloud Engineer
Microsoft
AWS
Azure
Kubernetes
5 years experience
ABC College alumni
```

as a strong match.

---

# 101. Example Database-to-AI Workflow

```text
users
   |
   +-- education_records
   |
   +-- user_skills
   |
   +-- experiences
   |
   +-- career_goals
             |
             v
      Career Analysis
             |
             v
        Skill Gaps
             |
             v
       Career Roadmap
             |
             v
      Alumni Matching
             |
             v
       Match Results
             |
             v
    Personalized Message
             |
             v
        Connection
             |
             v
           Chat
             |
             v
 Relationship Insights
             |
             v
      Roadmap Update
```

---

# 102. Data Lifecycle

User registration:

```text
Auth User
   ↓
users
```

Profile setup:

```text
users
   ↓
education_records
   ↓
professional_profiles
   ↓
skills
```

Career onboarding:

```text
career_goals
   ↓
career_analysis
   ↓
skill_gaps
   ↓
career_roadmap
```

Networking:

```text
career_goal
   ↓
embedding
   ↓
match_results
   ↓
connection
   ↓
conversation
   ↓
messages
```

Continuous intelligence:

```text
posts
projects
achievements
messages
roadmap progress
        ↓
AI insights
        ↓
updated recommendations
```

---

# 103. Database Security Principles

Never expose:

```text
Supabase secret key
service role key
private AI credentials
private user information
```

to the frontend.

Frontend should use:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Server-side operations requiring privileged access should use secure server environment variables.

---

# 104. Environment Variables

Recommended:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
GEMINI_API_KEY=
```

Never commit actual secrets to GitHub.

Use:

```text
.env.local
```

and provide:

```text
.env.example
```

with empty values.

---

# 105. Storage

Supabase Storage can be used for:

```text
profile photos
resumes
certificates
project images
post media
```

Recommended buckets:

```text
avatars
resumes
certifications
project-media
post-media
```

Storage policies must prevent unauthorized access to private files.

---

# 106. Realtime

Supabase Realtime can be used for:

```text
new messages
online status
notifications
connection updates
```

For the 24-hour hackathon, prioritize:

```text
chat realtime
notifications
```

and avoid unnecessary realtime complexity.

---

# 107. Online Status

Online presence can be handled using:

```text
last_active_at
```

or Supabase Realtime Presence.

Simple MVP logic:

```text
last_active_at within X minutes
        |
        v
Online
```

Otherwise:

```text
Offline
```

---

# 108. Chat Message Flow

```text
User A sends message
        |
        v
messages table
        |
        v
Supabase Realtime
        |
        v
User B receives message
        |
        v
notification
```

---

# 109. Notification Flow

Example:

```text
Alumni accepts connection
        |
        v
connections.status = accepted
        |
        v
Create notification
        |
        v
notifications
        |
        v
User sees notification
```

---

# 110. AI Recommendation Refresh

Recommendations should refresh when important profile information changes.

Trigger examples:

```text
career goal changed
skills changed
education changed
new project added
experience changed
roadmap progress changed
```

Instead of regenerating everything immediately, mark recommendations as stale.

Example:

```text
recommendation_status = stale
```

Then regenerate when needed.

---

# 111. Stale AI Data

AI-generated records should include:

```text
created_at
updated_at
analysis_version
```

This helps determine whether information is outdated.

Example:

```text
Career analysis created:
September 1

User added:
AWS certification
September 5

Analysis:
Needs refresh
```

---

# 112. Versioning

AI prompts and models may change.

Store:

```text
analysis_version
embedding_model
agent_version
```

Example:

```text
analysis_version:
v1.2

embedding_model:
text-embedding-model-X

agent_version:
networking-agent-v1
```

This helps debug inconsistent outputs.

---

# 113. Data Integrity Rules

Important rules:

```text
A user cannot connect to themselves.

A user cannot have duplicate skills.

A user cannot like the same post twice.

A user cannot save the same opportunity twice.

A conversation should not contain duplicate members.

A roadmap item must belong to a roadmap.

A skill gap must belong to a career goal.

A match result must reference a valid user.

A message must belong to a valid conversation.
```

---

# 114. Data Validation

Validate at both:

```text
Frontend
+
Backend
```

Examples:

```text
email format
career goal length
year ranges
rating 1-5
required fields
UUID format
URL format
```

Never rely only on frontend validation.

---

# 115. AI Data Validation

LLM output should be converted into structured JSON before storing.

Example:

```json
{
  "target_role": "Cloud Engineer",
  "strengths": [
    "Python",
    "Linux"
  ],
  "skill_gaps": [
    "AWS",
    "Docker",
    "Kubernetes"
  ],
  "recommended_projects": [
    "Deploy a containerized application on AWS"
  ]
}
```

Validate this structure before inserting into the database.

---

# 116. AI Hallucination Protection

The AI should not invent:

```text
alumni profiles
companies
skills
certifications
job opportunities
education history
```

when database evidence is unavailable.

For recommendations:

```text
AI must retrieve real platform records first.
```

Then generate explanations based on retrieved data.

---

# 117. RAG Data Flow

For alumni search:

```text
User Question
      |
      v
Intent extraction
      |
      v
Database retrieval
      |
      v
Vector retrieval
      |
      v
Relevant profiles
      |
      v
LLM
      |
      v
Answer
```

The LLM should not be treated as the source of truth.

---

# 118. Knowledge Sources

The platform's AI knowledge base can include:

```text
User profiles
Education records
Skills
Experiences
Projects
Posts
Career goals
Opportunities
Approved mentorship insights
```

External information can later be added through APIs.

For MVP, prioritize platform data.

---

# 119. Scale Strategy

If the platform grows to:

```text
100,000 alumni
```

do not send all profiles to the LLM.

Use:

```text
PostgreSQL filters
+
pgvector
+
indexes
+
ranking
```

Pipeline:

```text
100,000
   ↓
10,000 structured candidates
   ↓
1,000 semantic candidates
   ↓
100 ranked candidates
   ↓
10 final candidates
```

---

# 120. Database Performance Strategy

Prioritize:

```text
indexes
pagination
vector search
selective queries
caching
background AI jobs
```

Avoid:

```text
fetching entire tables
sending huge datasets to LLM
regenerating AI results unnecessarily
```

---

# 121. Pagination

Use pagination for:

```text
alumni search
posts
messages
notifications
opportunities
connections
```

Do not load thousands of records into the browser at once.

---

# 122. Soft Delete

For content that may need recovery:

```text
deleted_at
```

can be used.

Recommended for:

```text
posts
messages
projects
opportunities
```

depending on product requirements.

---

# 123. MVP Database Simplification

For the hackathon, do not spend most of the 24 hours building enterprise-level database infrastructure.

Focus on:

```text
correct relationships
clean schema
secure access
seed data
AI retrieval
agent workflow
```

The database should enable the demo, not become the demo.

---

# 124. Recommended MVP Tables

The minimum strong architecture is:

```text
users
institutions
education_records
professional_profiles
experiences
skills
user_skills
projects
career_goals
career_analyses
skill_gaps
career_roadmaps
roadmap_items
connections
conversations
conversation_members
messages
match_results
embeddings
agent_sessions
agent_actions
notifications
```

---

# 125. Recommended Phase 2 Tables

```text
certifications
achievements
mentorship_preferences
mentorship_requests
opportunities
opportunity_skills
referrals
saved_opportunities
posts
post_skills
post_likes
post_comments
relationship_insights
engagement_scores
feedback
profile_verifications
reports
audit_logs
```

---

# 126. Core Demo Database Scenario

The demo should demonstrate the database working as one connected system.

Scenario:

```text
Student creates profile
        ↓
Adds education
        ↓
Adds skills
        ↓
Enters career goal
        ↓
AI analyzes profile
        ↓
Skill gaps created
        ↓
Career roadmap created
        ↓
AI searches alumni
        ↓
Match results generated
        ↓
Student sees explanation
        ↓
AI generates networking message
        ↓
Student approves
        ↓
Connection request created
        ↓
Alumni accepts
        ↓
Chat begins
        ↓
Relationship Agent summarizes advice
        ↓
Student approves roadmap update
```

This demonstrates:

```text
Database
+
AI
+
Agentic workflow
+
Networking
+
Career development
```

---

# 127. Core Data Model Summary

The entire platform can be understood as:

```text
PERSON
  |
  +-- EDUCATION
  |
  +-- PROFESSIONAL EXPERIENCE
  |
  +-- SKILLS
  |
  +-- PROJECTS
  |
  +-- ACHIEVEMENTS
  |
  +-- CAREER GOALS
          |
          +-- SKILL GAPS
          |
          +-- CAREER ROADMAP
          |
          +-- ALUMNI MATCHES
                    |
                    +-- CONNECTION
                          |
                          +-- CHAT
                                |
                                +-- RELATIONSHIP AI
                                      |
                                      +-- NEXT ACTION
```

---

# 128. Final Database Principle

The database should represent the complete career journey of a person rather than simply storing an alumni directory.

The core relationship is:

```text
WHO AM I?
     ↓
WHAT HAVE I DONE?
     ↓
WHAT CAN I DO?
     ↓
WHAT DO I WANT TO BECOME?
     ↓
WHAT SKILLS AM I MISSING?
     ↓
WHO CAN HELP ME?
     ↓
WHO SHOULD I CONNECT WITH?
     ↓
WHAT SHOULD I DO NEXT?
```

The database therefore becomes the foundation for the Agentic AI system.

The goal is not merely:

```text
Store alumni
```

The goal is:

```text
Understand people
+
Understand careers
+
Understand relationships
+
Enable intelligent actions
```

---

# 129. Final Architecture Principle

The most important database flow is:

```text
USER
  ↓
EDUCATION + EXPERIENCE + SKILLS + PROJECTS
  ↓
CAREER GOAL
  ↓
AI CAREER ANALYSIS
  ↓
SKILL GAP
  ↓
CAREER ROADMAP
  ↓
SEMANTIC NETWORK SEARCH
  ↓
ALUMNI / MENTOR MATCH
  ↓
PERSONALIZED CONNECTION
  ↓
CHAT
  ↓
RELATIONSHIP INTELLIGENCE
  ↓
NEXT CAREER ACTION
```

This data model directly supports the central product philosophy:

> **Student Goal → Skill Gap → Relevant Alumni → Mentorship → Career Opportunity**

and enables the platform to function as an **Agentic AI Career Navigation and Networking Platform**, rather than a simple alumni directory.


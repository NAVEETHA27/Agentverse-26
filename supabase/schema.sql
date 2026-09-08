-- ==============================================================================
-- AI-Powered Alumni Career & Networking Platform (AlumniVerse)
-- Master Database Schema (PostgreSQL + Supabase + pgvector)
-- SINGLE SOURCE OF TRUTH: 03_DATABASE_AND_DATA_MODEL.md
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ==============================================================================
-- 2. IDENTITY & CORE USER TABLES
-- ==============================================================================

-- Unified identity: No permanent 'student' or 'alumni' role flag
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    profile_photo_url TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    country TEXT,
    phone TEXT,
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    visibility TEXT DEFAULT 'public' NOT NULL CHECK (visibility IN ('public', 'network_only', 'institution_only', 'private'))
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    preferred_roles JSONB DEFAULT '[]'::jsonb NOT NULL,
    preferred_industries JSONB DEFAULT '[]'::jsonb NOT NULL,
    preferred_locations JSONB DEFAULT '[]'::jsonb NOT NULL,
    preferred_work_mode TEXT DEFAULT 'hybrid' NOT NULL CHECK (preferred_work_mode IN ('remote', 'onsite', 'hybrid', 'any')),
    career_interests JSONB DEFAULT '[]'::jsonb NOT NULL,
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "connections": true}'::jsonb NOT NULL,
    privacy_settings JSONB DEFAULT '{"visibility": "public", "show_email": false, "allow_ai_matching": true}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 3. EDUCATION JOURNEY MODULE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT,
    type TEXT DEFAULT 'college' NOT NULL CHECK (type IN ('college', 'university', 'institute', 'school', 'bootcamp', 'other')),
    location TEXT,
    country TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.degrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('undergraduate', 'postgraduate', 'doctoral', 'certificate', 'other')),
    field TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Models a person's multi-institution educational trajectory
CREATE TABLE IF NOT EXISTS public.education_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE RESTRICT NOT NULL,
    degree_id UUID REFERENCES public.degrees(id) ON DELETE SET NULL,
    field_of_study TEXT NOT NULL,
    start_year INT NOT NULL,
    end_year INT,
    graduation_year INT,
    expected_graduation_year INT,
    status TEXT DEFAULT 'current' NOT NULL CHECK (status IN ('current', 'graduated', 'completed', 'dropped', 'on_hold')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 4. PROFESSIONAL PROFILE, SKILLS & PORTFOLIO
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    current_company TEXT,
    current_role TEXT,
    industry TEXT,
    years_of_experience NUMERIC DEFAULT 0 NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    resume_url TEXT,
    open_to_work BOOLEAN DEFAULT false NOT NULL,
    open_to_mentor BOOLEAN DEFAULT false NOT NULL,
    open_to_hiring BOOLEAN DEFAULT false NOT NULL,
    open_to_referrals BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    employment_type TEXT DEFAULT 'full_time' NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'internship', 'freelance', 'contract', 'founder', 'other')),
    industry TEXT,
    location TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    proficiency_level TEXT DEFAULT 'intermediate' NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience NUMERIC,
    source TEXT DEFAULT 'self_reported' NOT NULL CHECK (source IN ('self_reported', 'resume', 'project', 'certification', 'experience', 'ai_extracted')),
    verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    project_url TEXT,
    github_url TEXT,
    start_date DATE,
    end_date DATE,
    project_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_project_skill UNIQUE (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    credential_id TEXT,
    credential_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    achievement_type TEXT NOT NULL,
    organization TEXT,
    achievement_date DATE,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 5. CAREER INTELLIGENCE, GOALS, GAPS & ROADMAPS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.career_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    goal_text TEXT NOT NULL,
    target_role TEXT NOT NULL,
    target_industry TEXT,
    target_company TEXT,
    target_location TEXT,
    target_timeframe TEXT,
    priority INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'achieved', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.career_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE CASCADE NOT NULL,
    current_profile_summary TEXT,
    target_role_summary TEXT,
    strengths JSONB DEFAULT '[]'::jsonb NOT NULL,
    skill_gaps JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommended_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommended_projects JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommended_certifications JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommended_roles JSONB DEFAULT '[]'::jsonb NOT NULL,
    career_readiness_score NUMERIC DEFAULT 0 NOT NULL,
    analysis_version TEXT DEFAULT 'v1.0' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    importance TEXT DEFAULT 'critical' NOT NULL CHECK (importance IN ('critical', 'important', 'optional')),
    current_level TEXT DEFAULT 'none' NOT NULL,
    required_level TEXT DEFAULT 'intermediate' NOT NULL,
    gap_score NUMERIC DEFAULT 0 NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'identified' NOT NULL CHECK (status IN ('identified', 'learning', 'bridged', 'ignored')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_estimate TEXT,
    status TEXT DEFAULT 'in_progress' NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.career_roadmaps(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    item_type TEXT NOT NULL CHECK (item_type IN ('learn_skill', 'course', 'project', 'certification', 'mentor', 'networking', 'job_application', 'internship', 'portfolio', 'interview_prep')),
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    sequence_order INT NOT NULL,
    estimated_duration TEXT,
    resource_url TEXT,
    status TEXT DEFAULT 'not_started' NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 6. NETWORKING & MATCHING MODULE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.mentorship_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    mentorship_type TEXT DEFAULT 'career_guidance' NOT NULL,
    topics JSONB DEFAULT '[]'::jsonb NOT NULL,
    availability JSONB DEFAULT '{"status": "available", "hours_per_week": 2}'::jsonb NOT NULL,
    preferred_mode TEXT DEFAULT 'chat' NOT NULL CHECK (preferred_mode IN ('chat', 'async', 'flexible')),
    max_mentees INT DEFAULT 3,
    is_available BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked', 'cancelled')),
    connection_type TEXT DEFAULT 'professional' NOT NULL CHECK (connection_type IN ('professional', 'mentor', 'mentee', 'alumni', 'peer')),
    source TEXT DEFAULT 'ai_recommendation' NOT NULL,
    initial_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    accepted_at TIMESTAMPTZ,
    CONSTRAINT unique_connection UNIQUE (requester_id, receiver_id),
    CONSTRAINT check_not_self_connection CHECK (requester_id <> receiver_id)
);

-- Deterministic 5-factor weighted score record
CREATE TABLE IF NOT EXISTS public.match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    matched_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    career_goal_id UUID REFERENCES public.career_goals(id) ON DELETE SET NULL,
    match_type TEXT DEFAULT 'alumni_mentor' NOT NULL,
    overall_score NUMERIC NOT NULL,
    career_goal_score NUMERIC NOT NULL,
    skill_score NUMERIC NOT NULL,
    education_score NUMERIC NOT NULL,
    industry_score NUMERIC NOT NULL,
    experience_score NUMERIC NOT NULL,
    location_score NUMERIC,
    explanation TEXT NOT NULL,
    match_reasons JSONB DEFAULT '[]'::jsonb NOT NULL,
    search_scope TEXT DEFAULT 'institution' NOT NULL CHECK (search_scope IN ('institution', 'broader_alumni', 'industry_network', 'global_network')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ,
    CONSTRAINT check_not_self_match CHECK (user_id <> matched_user_id)
);

-- ==============================================================================
-- 7. CHAT & RELATIONSHIP INTELLIGENCE MODULE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_read_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_conversation_member UNIQUE (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' NOT NULL CHECK (message_type IN ('text', 'system', 'ai_suggestion', 'attachment')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.message_read_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_message_read UNIQUE (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.relationship_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    summary TEXT NOT NULL,
    advice_points JSONB DEFAULT '[]'::jsonb NOT NULL,
    action_items JSONB DEFAULT '[]'::jsonb NOT NULL,
    questions_to_ask JSONB DEFAULT '[]'::jsonb NOT NULL,
    follow_up_suggestion TEXT,
    roadmap_suggestions JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 8. OPPORTUNITIES & REFERRALS MODULE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posted_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('job', 'internship', 'referral', 'mentorship', 'project', 'event')),
    location TEXT,
    work_mode TEXT DEFAULT 'remote' CHECK (work_mode IN ('remote', 'onsite', 'hybrid')),
    application_url TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.opportunity_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    importance TEXT DEFAULT 'required' NOT NULL CHECK (importance IN ('required', 'preferred')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_opportunity_skill UNIQUE (opportunity_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'requested' NOT NULL CHECK (status IN ('requested', 'accepted', 'declined', 'submitted', 'completed')),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_saved_opportunity UNIQUE (user_id, opportunity_id)
);

-- ==============================================================================
-- 9. PROFESSIONAL ACHIEVEMENT FEED
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    post_type TEXT DEFAULT 'achievement' NOT NULL CHECK (post_type IN ('achievement', 'project', 'hackathon', 'certification', 'career_update', 'internship', 'job_update', 'technical_article', 'event', 'startup', 'other')),
    visibility TEXT DEFAULT 'public' NOT NULL CHECK (visibility IN ('public', 'network_only', 'connections_only')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.post_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    source TEXT DEFAULT 'ai_extracted' NOT NULL,
    confidence_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_post_skill UNIQUE (post_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_post_like UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 10. AGENT INFRASTRUCTURE & DECISION TRACEABILITY
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    agent_type TEXT NOT NULL CHECK (agent_type IN ('career_agent', 'networking_agent', 'relationship_agent', 'profile_agent')),
    goal TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'running', 'waiting_for_approval', 'completed', 'failed', 'cancelled')),
    context JSONB DEFAULT '{}'::jsonb NOT NULL,
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.agent_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.agent_sessions(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL,
    target_entity_type TEXT,
    target_entity_id UUID,
    input_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    output_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'running', 'waiting_for_approval', 'completed', 'failed')),
    requires_approval BOOLEAN DEFAULT false NOT NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('alumni', 'mentor', 'job', 'internship', 'skill', 'course', 'project', 'connection')),
    target_entity_type TEXT NOT NULL,
    target_entity_id UUID NOT NULL,
    score NUMERIC,
    reason TEXT NOT NULL,
    priority INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'accepted', 'dismissed', 'stale', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ
);

-- ==============================================================================
-- 11. TRUST, ENGAGEMENT & AUDIT LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profile_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('education', 'employment', 'professional', 'institution')),
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'verified', 'rejected')),
    evidence_url TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    connection_id UUID REFERENCES public.connections(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_type TEXT DEFAULT 'mentorship' NOT NULL CHECK (feedback_type IN ('mentorship', 'career_guidance', 'resume_review', 'professional_connection', 'general')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.engagement_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    mentor_score NUMERIC DEFAULT 0 NOT NULL,
    event_score NUMERIC DEFAULT 0 NOT NULL,
    hiring_score NUMERIC DEFAULT 0 NOT NULL,
    networking_score NUMERIC DEFAULT 0 NOT NULL,
    overall_score NUMERIC DEFAULT 0 NOT NULL,
    factors JSONB DEFAULT '{}'::jsonb NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_entity_type TEXT NOT NULL,
    target_entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 12. SEMANTIC SEARCH & VECTOR EMBEDDINGS (pgvector)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('user_profile', 'career_goal', 'project', 'post', 'experience', 'opportunity')),
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768), -- Standard 768-dim vector for Gemini text-embedding-004
    embedding_model TEXT DEFAULT 'text-embedding-004' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_entity_embedding UNIQUE (entity_type, entity_id)
);

-- ==============================================================================
-- 13. INDEXES FOR HIGH-PERFORMANCE RETRIEVAL
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_visibility ON public.users(visibility);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active_at DESC);

CREATE INDEX IF NOT EXISTS idx_education_user_inst ON public.education_records(user_id, institution_id);
CREATE INDEX IF NOT EXISTS idx_education_status ON public.education_records(status);
CREATE INDEX IF NOT EXISTS idx_education_grad_year ON public.education_records(graduation_year);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_skill ON public.user_skills(user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_experiences_user ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

CREATE INDEX IF NOT EXISTS idx_career_goals_user ON public.career_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_goal ON public.skill_gaps(career_goal_id, importance);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_goal ON public.career_roadmaps(user_id, career_goal_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_seq ON public.roadmap_items(roadmap_id, sequence_order);

CREATE INDEX IF NOT EXISTS idx_connections_users ON public.connections(requester_id, receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_match_results_user_score ON public.match_results(user_id, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_match_results_search_scope ON public.match_results(search_scope);

CREATE INDEX IF NOT EXISTS idx_conv_members ON public.conversation_members(conversation_id, user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_opportunities_type_active ON public.opportunities(opportunity_type, is_active);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_user ON public.agent_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_actions_session ON public.agent_actions(session_id, created_at);

-- HNSW vector similarity search index on embeddings
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw ON public.embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- Global catalog read policies (institutions, degrees, skills, active opportunities)
CREATE POLICY "Public read institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public read degrees" ON public.degrees FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read opportunity skills" ON public.opportunity_skills FOR SELECT USING (true);

-- Users profile visibility policy
CREATE POLICY "Read visible profiles" ON public.users FOR SELECT USING (
    visibility = 'public' 
    OR id = auth.uid()
    OR (visibility = 'network_only' AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Users can edit own profile" ON public.users FOR UPDATE USING (id = auth.uid());

-- Education records read / write
CREATE POLICY "Read education records" ON public.education_records FOR SELECT USING (true);
CREATE POLICY "Manage own education records" ON public.education_records FOR ALL USING (user_id = auth.uid());

-- Professional profiles read / write
CREATE POLICY "Read professional profiles" ON public.professional_profiles FOR SELECT USING (true);
CREATE POLICY "Manage own professional profile" ON public.professional_profiles FOR ALL USING (user_id = auth.uid());

-- User skills & experiences read / write
CREATE POLICY "Read user skills" ON public.user_skills FOR SELECT USING (true);
CREATE POLICY "Manage own user skills" ON public.user_skills FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Manage own experiences" ON public.experiences FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Manage own projects" ON public.projects FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Read project skills" ON public.project_skills FOR SELECT USING (true);
CREATE POLICY "Manage own project skills" ON public.project_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_skills.project_id AND projects.user_id = auth.uid())
);

CREATE POLICY "Read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Manage own certifications" ON public.certifications FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Manage own achievements" ON public.achievements FOR ALL USING (user_id = auth.uid());

-- Career intelligence (Private to user)
CREATE POLICY "Manage own career goals" ON public.career_goals FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage own career analyses" ON public.career_analyses FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage own skill gaps" ON public.skill_gaps FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage own roadmaps" ON public.career_roadmaps FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage own roadmap items" ON public.roadmap_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.career_roadmaps WHERE career_roadmaps.id = roadmap_items.roadmap_id AND career_roadmaps.user_id = auth.uid())
);

-- Connections policies (Participants only)
CREATE POLICY "Read connections" ON public.connections FOR SELECT USING (
    requester_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Insert connections" ON public.connections FOR INSERT WITH CHECK (
    requester_id = auth.uid()
);
CREATE POLICY "Update connections" ON public.connections FOR UPDATE USING (
    requester_id = auth.uid() OR receiver_id = auth.uid()
);

-- Mentorship preferences & match results
CREATE POLICY "Read mentorship preferences" ON public.mentorship_preferences FOR SELECT USING (true);
CREATE POLICY "Manage own mentorship preferences" ON public.mentorship_preferences FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Manage own match results" ON public.match_results FOR ALL USING (user_id = auth.uid());

-- Chat & Conversations (Strict privacy: members only)
CREATE POLICY "Members read conversation" ON public.conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_members.conversation_id = conversations.id AND conversation_members.user_id = auth.uid())
);

CREATE POLICY "Members read conversation members" ON public.conversation_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_members.conversation_id AND cm.user_id = auth.uid())
);

CREATE POLICY "Members read messages" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_members.conversation_id = messages.conversation_id AND conversation_members.user_id = auth.uid())
);
CREATE POLICY "Members send messages" ON public.messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_members.conversation_id = messages.conversation_id AND conversation_members.user_id = auth.uid())
);

CREATE POLICY "Manage own relationship insights" ON public.relationship_insights FOR ALL USING (user_id = auth.uid());

-- Social posts (Public feed)
CREATE POLICY "Read public posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Manage own posts" ON public.posts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Read post skills" ON public.post_skills FOR SELECT USING (true);
CREATE POLICY "Read post likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Manage own post likes" ON public.post_likes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Read post comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Manage own post comments" ON public.post_comments FOR ALL USING (user_id = auth.uid());

-- Agent sessions & actions (Private to owner)
CREATE POLICY "Manage own agent sessions" ON public.agent_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Manage own agent actions" ON public.agent_actions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.agent_sessions WHERE agent_sessions.id = agent_actions.session_id AND agent_sessions.user_id = auth.uid())
);
CREATE POLICY "Manage own recommendations" ON public.ai_recommendations FOR ALL USING (user_id = auth.uid());

-- Notifications & Audit Logs
CREATE POLICY "Manage own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Read own audit logs" ON public.audit_logs FOR SELECT USING (user_id = auth.uid());

-- Vector embeddings (Readable for AI search services)
CREATE POLICY "Public read embeddings" ON public.embeddings FOR SELECT USING (true);

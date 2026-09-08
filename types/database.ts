export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          profile_photo_url: string | null;
          headline: string | null;
          bio: string | null;
          location: string | null;
          country: string | null;
          phone: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
          last_active_at: string;
          is_active: boolean;
          visibility: "public" | "network_only" | "institution_only" | "private";
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at" | "updated_at" | "last_active_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferred_roles: Json;
          preferred_industries: Json;
          preferred_locations: Json;
          preferred_work_mode: "remote" | "onsite" | "hybrid" | "any";
          career_interests: Json;
          notification_settings: Json;
          privacy_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_preferences"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Insert"]>;
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          type: "college" | "university" | "institute" | "school" | "bootcamp" | "other";
          location: string | null;
          country: string | null;
          website: string | null;
          description: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["institutions"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["institutions"]["Insert"]>;
      };
      degrees: {
        Row: {
          id: string;
          name: string;
          level: "undergraduate" | "postgraduate" | "doctoral" | "certificate" | "other";
          field: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["degrees"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["degrees"]["Insert"]>;
      };
      education_records: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          degree_id: string | null;
          field_of_study: string;
          start_year: number;
          end_year: number | null;
          graduation_year: number | null;
          expected_graduation_year: number | null;
          status: "current" | "graduated" | "completed" | "dropped" | "on_hold";
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["education_records"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["education_records"]["Insert"]>;
      };
      professional_profiles: {
        Row: {
          id: string;
          user_id: string;
          current_company: string | null;
          current_role: string | null;
          industry: string | null;
          years_of_experience: number;
          linkedin_url: string | null;
          portfolio_url: string | null;
          github_url: string | null;
          resume_url: string | null;
          open_to_work: boolean;
          open_to_mentor: boolean;
          open_to_hiring: boolean;
          open_to_referrals: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["professional_profiles"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["professional_profiles"]["Insert"]>;
      };
      experiences: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_title: string;
          employment_type: string;
          industry: string | null;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["experiences"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["skills"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          proficiency_level: "beginner" | "intermediate" | "advanced" | "expert";
          years_experience: number | null;
          source: string;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_skills"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_skills"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          project_url: string | null;
          github_url: string | null;
          start_date: string | null;
          end_date: string | null;
          project_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_skills: {
        Row: {
          id: string;
          project_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_skills"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_skills"]["Insert"]>;
      };
      certifications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          issuing_organization: string;
          credential_id: string | null;
          credential_url: string | null;
          issue_date: string | null;
          expiry_date: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["certifications"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certifications"]["Insert"]>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          achievement_type: string;
          organization: string | null;
          achievement_date: string | null;
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["achievements"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      career_goals: {
        Row: {
          id: string;
          user_id: string;
          goal_text: string;
          target_role: string;
          target_industry: string | null;
          target_company: string | null;
          target_location: string | null;
          target_timeframe: string | null;
          priority: number;
          status: "active" | "achieved" | "paused" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["career_goals"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_goals"]["Insert"]>;
      };
      career_analyses: {
        Row: {
          id: string;
          user_id: string;
          career_goal_id: string;
          current_profile_summary: string | null;
          target_role_summary: string | null;
          strengths: Json;
          skill_gaps: Json;
          recommended_skills: Json;
          recommended_projects: Json;
          recommended_certifications: Json;
          recommended_roles: Json;
          career_readiness_score: number;
          analysis_version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["career_analyses"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_analyses"]["Insert"]>;
      };
      skill_gaps: {
        Row: {
          id: string;
          user_id: string;
          career_goal_id: string;
          skill_id: string;
          importance: "critical" | "important" | "optional";
          current_level: string;
          required_level: string;
          gap_score: number;
          reason: string | null;
          status: "identified" | "learning" | "bridged" | "ignored";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["skill_gaps"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skill_gaps"]["Insert"]>;
      };
      career_roadmaps: {
        Row: {
          id: string;
          user_id: string;
          career_goal_id: string;
          title: string;
          description: string | null;
          duration_estimate: string | null;
          status: "not_started" | "in_progress" | "completed" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["career_roadmaps"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_roadmaps"]["Insert"]>;
      };
      roadmap_items: {
        Row: {
          id: string;
          roadmap_id: string;
          title: string;
          description: string;
          item_type: string;
          skill_id: string | null;
          sequence_order: number;
          estimated_duration: string | null;
          resource_url: string | null;
          status: "not_started" | "in_progress" | "completed";
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["roadmap_items"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmap_items"]["Insert"]>;
      };
      mentorship_preferences: {
        Row: {
          id: string;
          user_id: string;
          mentorship_type: string;
          topics: Json;
          availability: Json;
          preferred_mode: "chat" | "async" | "flexible";
          max_mentees: number | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["mentorship_preferences"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mentorship_preferences"]["Insert"]>;
      };
      connections: {
        Row: {
          id: string;
          requester_id: string;
          receiver_id: string;
          status: "pending" | "accepted" | "rejected" | "blocked" | "cancelled";
          connection_type: "professional" | "mentor" | "mentee" | "alumni" | "peer";
          source: string;
          initial_message: string | null;
          created_at: string;
          updated_at: string;
          accepted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["connections"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["connections"]["Insert"]>;
      };
      match_results: {
        Row: {
          id: string;
          user_id: string;
          matched_user_id: string;
          career_goal_id: string | null;
          match_type: string;
          overall_score: number;
          career_goal_score: number;
          skill_score: number;
          education_score: number;
          industry_score: number;
          experience_score: number;
          location_score: number | null;
          explanation: string;
          match_reasons: Json;
          search_scope: "institution" | "broader_alumni" | "industry_network" | "global_network";
          created_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["match_results"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["match_results"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversations"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      conversation_members: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          joined_at: string;
          last_read_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["conversation_members"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversation_members"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          message_text: string;
          message_type: "text" | "system" | "ai_suggestion" | "attachment";
          created_at: string;
          edited_at: string | null;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      relationship_insights: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          summary: string;
          advice_points: Json;
          action_items: Json;
          questions_to_ask: Json;
          follow_up_suggestion: string | null;
          roadmap_suggestions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["relationship_insights"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["relationship_insights"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          post_type: "achievement" | "project" | "hackathon" | "certification" | "career_update" | "internship" | "job_update" | "technical_article" | "event" | "startup" | "general" | "other";
          media_url: string | null;
          visibility: "public" | "network_only" | "connections_only";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["posts"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      opportunities: {
        Row: {
          id: string;
          posted_by_user_id: string | null;
          company_name: string;
          title: string;
          description: string;
          opportunity_type: "job" | "internship" | "referral" | "mentorship" | "project" | "event";
          location: string | null;
          work_mode: "remote" | "onsite" | "hybrid" | null;
          application_url: string | null;
          deadline: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["opportunities"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["opportunities"]["Insert"]>;
      };
      agent_sessions: {
        Row: {
          id: string;
          user_id: string;
          agent_type: "career_agent" | "networking_agent" | "relationship_agent" | "profile_agent";
          goal: string;
          status: "pending" | "running" | "waiting_for_approval" | "completed" | "failed" | "cancelled";
          context: Json;
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_sessions"]["Row"], "id" | "started_at"> & {
          id?: string;
          started_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agent_sessions"]["Insert"]>;
      };
      agent_actions: {
        Row: {
          id: string;
          session_id: string;
          action_type: string;
          target_entity_type: string | null;
          target_entity_id: string | null;
          input_data: Json;
          output_data: Json;
          status: "pending" | "running" | "waiting_for_approval" | "completed" | "failed";
          requires_approval: boolean;
          approved_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_actions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agent_actions"]["Insert"]>;
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string;
          recommendation_type: "alumni" | "mentor" | "job" | "internship" | "skill" | "course" | "project" | "connection";
          target_entity_type: string;
          target_entity_id: string;
          score: number | null;
          reason: string;
          priority: number;
          status: "active" | "accepted" | "dismissed" | "stale" | "expired";
          created_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_recommendations"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_recommendations"]["Insert"]>;
      };
      embeddings: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          content: string;
          embedding: string | null;
          embedding_model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["embeddings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["embeddings"]["Insert"]>;
      };
    };
  };
}

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { 
  SEED_CAREER_GOALS, 
  SEED_CAREER_ANALYSIS, 
  SEED_ROADMAPS, 
  SEED_ROADMAP_ITEMS, 
  DEMO_USER_ID 
} from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type CareerGoalRow = Database["public"]["Tables"]["career_goals"]["Row"];
export type CareerAnalysisRow = Database["public"]["Tables"]["career_analyses"]["Row"];
export type CareerRoadmapRow = Database["public"]["Tables"]["career_roadmaps"]["Row"];
export type RoadmapItemRow = Database["public"]["Tables"]["roadmap_items"]["Row"];

export type RoadmapWithItems = CareerRoadmapRow & {
  items: RoadmapItemRow[];
};

// In-memory local state for toggling roadmap items when offline
const globalForCareer = globalThis as unknown as {
  localRoadmapItems?: RoadmapItemRow[];
};

if (!globalForCareer.localRoadmapItems) {
  globalForCareer.localRoadmapItems = [...SEED_ROADMAP_ITEMS];
}

const getLocalRoadmapItems = () => globalForCareer.localRoadmapItems!;
const setLocalRoadmapItems = (val: RoadmapItemRow[]) => {
  globalForCareer.localRoadmapItems = val;
};

/**
 * Retrieve the active career goal for a user.
 */
export async function getCareerGoal(userId: string = DEMO_USER_ID): Promise<CareerGoalRow | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("career_goals")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (!error && data) {
        return data as CareerGoalRow;
      }
    } catch (err) {
      console.warn("[Career DAL] Failed to fetch career goal from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_CAREER_GOALS.find((cg) => cg.user_id === userId && cg.status === "active") || SEED_CAREER_GOALS[0];
}

/**
 * Retrieve the career analysis (readiness score, strengths, gaps) for a goal.
 */
export async function getCareerAnalysis(goalId: string = "cg1"): Promise<CareerAnalysisRow | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("career_analyses")
        .select("*")
        .eq("career_goal_id", goalId)
        .single();

      if (!error && data) {
        return data as CareerAnalysisRow;
      }
    } catch (err) {
      console.warn("[Career DAL] Failed to fetch career analysis from Supabase, falling back to seed data:", err);
    }
  }

  return SEED_CAREER_ANALYSIS.career_goal_id === goalId ? SEED_CAREER_ANALYSIS : SEED_CAREER_ANALYSIS;
}

/**
 * Retrieve the complete career roadmap with its ordered milestones/items.
 */
export async function getRoadmap(goalId: string = "cg1"): Promise<RoadmapWithItems | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error: rError } = await supabase
        .from("career_roadmaps")
        .select("*")
        .eq("career_goal_id", goalId)
        .single();

      const roadmap = data as CareerRoadmapRow | null;
      if (!rError && roadmap) {
        const { data: items, error: iError } = await supabase
          .from("roadmap_items")
          .select("*")
          .eq("roadmap_id", roadmap.id)
          .order("sequence_order", { ascending: true });

        if (!iError && items) {
          return {
            ...roadmap,
            items: items as RoadmapItemRow[],
          };
        }
      }
    } catch (err) {
      console.warn("[Career DAL] Failed to fetch roadmap from Supabase, falling back to seed data:", err);
    }
  }

  const baseRoadmap = SEED_ROADMAPS.find((r) => r.career_goal_id === goalId) || SEED_ROADMAPS[0];
  const items = getLocalRoadmapItems().filter((i) => i.roadmap_id === baseRoadmap.id);
  
  return {
    ...baseRoadmap,
    items,
  };
}

/**
 * Update the status of a roadmap item (e.g. mark completed or in progress).
 */
export async function updateRoadmapItemStatus(
  itemId: string, 
  status: "not_started" | "in_progress" | "completed"
): Promise<RoadmapItemRow | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase.from("roadmap_items") as any)
        .update({ status, completed_at: status === "completed" ? new Date().toISOString() : null })
        .eq("id", itemId)
        .select()
        .single();

      if (!error && data) {
        return data as RoadmapItemRow;
      }
    } catch (err) {
      console.warn("[Career DAL] Failed to update roadmap item in Supabase, updating local state:", err);
    }
  }

  setLocalRoadmapItems(getLocalRoadmapItems().map((item) =>
    item.id === itemId
      ? {
          ...item,
          status,
          completed_at: status === "completed" ? new Date().toISOString() : null,
        }
      : item
  ));

  return getLocalRoadmapItems().find((i) => i.id === itemId) || null;
}

/**
 * Add a new milestone item to a career roadmap.
 */
export async function addRoadmapItem(
  roadmapId: string,
  title: string,
  description: string,
  skillsTargeted: string[] = []
): Promise<RoadmapItemRow> {
  const currentItems = getLocalRoadmapItems();
  const newItem: RoadmapItemRow = {
    id: `item_${Date.now()}`,
    roadmap_id: roadmapId,
    title,
    description,
    item_type: "project",
    skill_id: null,
    sequence_order: currentItems.length + 1,
    estimated_duration: "3 weeks",
    resource_url: null,
    status: "not_started",
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase.from("roadmap_items") as any)
        .insert(newItem)
        .select()
        .single();
      if (!error && data) {
        return data as RoadmapItemRow;
      }
    } catch (err) {
      console.warn("[Career DAL] Failed to insert roadmap item in Supabase:", err);
    }
  }

  setLocalRoadmapItems([...currentItems, newItem]);
  return newItem;
}


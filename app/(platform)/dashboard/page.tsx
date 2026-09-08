import React from "react";
import { 
  getUser, 
  getCareerGoal, 
  getCareerAnalysis, 
  getSkillGaps, 
  getRecommendedAlumni, 
  getLatestAgentSession 
} from "@/lib/database";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [user, goal, analysis, gaps, matches, agentSession] = await Promise.all([
    getUser(),
    getCareerGoal(),
    getCareerAnalysis(),
    getSkillGaps(),
    getRecommendedAlumni(),
    getLatestAgentSession(),
  ]);

  return (
    <DashboardView
      user={user}
      goal={goal}
      analysis={analysis}
      gaps={gaps}
      matches={matches}
      agentSession={agentSession}
    />
  );
}

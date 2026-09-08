import React from "react";
import {
  getUser,
  getProfile,
  getEducation,
  getUserSkills,
  getCareerGoal,
  getCareerAnalysis,
  getSkillGaps,
  getRecommendedAlumni,
  getLatestAgentSession,
} from "@/lib/database";
import { ProfileView } from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [user, profile, education, skills, goal, analysis, gaps, matches, agentSession] =
    await Promise.all([
      getUser(),
      getProfile(),
      getEducation(),
      getUserSkills(),
      getCareerGoal(),
      getCareerAnalysis(),
      getSkillGaps(),
      getRecommendedAlumni(),
      getLatestAgentSession(),
    ]);

  return (
    <ProfileView
      user={user}
      profile={profile}
      education={education}
      skills={skills}
      goal={goal}
      analysis={analysis}
      gaps={gaps}
      matches={matches}
      agentSession={agentSession}
    />
  );
}

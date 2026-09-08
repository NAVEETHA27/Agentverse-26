import React from "react";
import { getUser, getProfile, getEducation, getUserSkills, getCareerGoal } from "@/lib/database";
import { ProfileView } from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [user, profile, education, skills, goal] = await Promise.all([
    getUser(),
    getProfile(),
    getEducation(),
    getUserSkills(),
    getCareerGoal(),
  ]);

  return (
    <ProfileView
      user={user}
      profile={profile}
      education={education}
      skills={skills}
      goal={goal}
    />
  );
}

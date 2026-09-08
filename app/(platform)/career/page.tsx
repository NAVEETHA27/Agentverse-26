import React from "react";
import { getCareerGoal, getCareerAnalysis, getSkillGaps, getRoadmap } from "@/lib/database";
import { CareerView } from "@/components/career/CareerView";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const [goal, analysis, gaps, roadmap] = await Promise.all([
    getCareerGoal(),
    getCareerAnalysis(),
    getSkillGaps(),
    getRoadmap(),
  ]);

  return (
    <CareerView
      goal={goal}
      analysis={analysis}
      gaps={gaps}
      initialRoadmap={roadmap}
    />
  );
}

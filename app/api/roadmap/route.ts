import { NextRequest, NextResponse } from "next/server";
import { getRoadmap, getCareerGoal } from "@/lib/database/career";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || DEMO_USER_ID;
    const goal = await getCareerGoal(userId);
    const goalId = goal?.id || "cg1";
    const roadmap = await getRoadmap(goalId);
    return NextResponse.json(roadmap?.items || [], { status: 200 });
  } catch (error: any) {
    console.error("[API:Roadmap] Error fetching roadmap:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch roadmap" }, { status: 500 });
  }
}

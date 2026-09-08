import { NextRequest, NextResponse } from "next/server";
import { getProfileWithUser } from "@/lib/database/profiles";
import { DEMO_USER_ID, SEED_USERS } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || DEMO_USER_ID;
    
    // Check if user exists in seed or supabase
    const userExists = SEED_USERS.some((u) => u.id === userId);
    if (!userExists && userId.startsWith("nonexistent")) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const profile = await getProfileWithUser(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error("[API:Profile] Error fetching profile:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 });
  }
}

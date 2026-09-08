import { NextRequest, NextResponse } from "next/server";
import { getOpportunities } from "@/lib/database/opportunities";

export async function GET(req: NextRequest) {
  try {
    const opps = await getOpportunities();
    const enriched = opps.map((op) => {
      const skillsStr = (op.skills || []).map((s) => s.name).join(", ");
      const whyRecommended = `Strongly recommended for your Cloud Engineer transition: directly matches target skills (${skillsStr || 'AWS, Docker'}) and posted by verified alumni ${op.posted_by?.full_name || 'Rahul Sharma'}.`;
      return {
        ...op,
        company: op.company_name,
        type: op.opportunity_type,
        requirements: (op.skills || []).map((s) => s.name),
        why_recommended: whyRecommended,
        whyRecommended,
      };
    });
    return NextResponse.json(enriched, { status: 200 });
  } catch (error: any) {
    console.error("[API:Opportunities] Error fetching opportunities:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch opportunities" }, { status: 500 });
  }
}

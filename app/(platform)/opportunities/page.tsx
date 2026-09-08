import React from "react";
import { getOpportunities } from "@/lib/database";
import { OpportunitiesView } from "@/components/opportunities/OpportunitiesView";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <OpportunitiesView initialOpportunities={opportunities} />
  );
}

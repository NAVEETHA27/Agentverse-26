import React from "react";
import { getMatchingWithScope, getConnections, getLatestAgentSession } from "@/lib/database";
import { NetworkView } from "@/components/network/NetworkView";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const [matchingResult, connections, agentSession] = await Promise.all([
    getMatchingWithScope(),
    getConnections(),
    getLatestAgentSession(),
  ]);

  return (
    <NetworkView
      initialMatches={matchingResult.matches}
      initialConnections={connections}
      agentSession={agentSession}
      searchScope={matchingResult.searchScope}
      scopeMessage={matchingResult.scopeMessage}
      levelCounts={matchingResult.levelCounts}
    />
  );
}

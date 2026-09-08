import { NextRequest, NextResponse } from "next/server";
import { getConnections, sendConnectionRequest } from "@/lib/database/connections";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || DEMO_USER_ID;
    const connections = await getConnections(userId);
    return NextResponse.json(connections, { status: 200 });
  } catch (error: any) {
    console.error("[API:Connections] Error fetching connections:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch connections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requesterId = body.senderId || body.requesterId || DEMO_USER_ID;
    const receiverId = body.receiverId;
    const message = body.message || body.initialMessage;

    if (!receiverId) {
      return NextResponse.json({ error: "receiverId is required" }, { status: 400 });
    }

    const existing = await getConnections(requesterId);
    const alreadyConnected = existing.find(
      (c) => (c.requester_id === requesterId && c.receiver_id === receiverId) ||
             (c.requester_id === receiverId && c.receiver_id === requesterId)
    );

    if (alreadyConnected) {
      return NextResponse.json(alreadyConnected, { status: 200 });
    }

    const connection = await sendConnectionRequest(requesterId, receiverId, message);
    return NextResponse.json(connection, { status: 200 });
  } catch (error: any) {
    console.error("[API:Connections] Error creating connection:", error);
    return NextResponse.json({ error: error.message || "Failed to create connection" }, { status: 500 });
  }
}

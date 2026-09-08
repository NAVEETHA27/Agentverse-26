import { NextRequest, NextResponse } from "next/server";

const NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "connection",
    title: "Connection Request Accepted",
    description: "Rahul Sharma (Senior Cloud Architect @ AWS) accepted your connection request and agreed to mentor your Cloud Engineer transition.",
    timestamp: "10m ago",
    read: false,
    actionUrl: "/chat",
    actionLabel: "Open Conversation",
    badge: "Connected",
  },
  {
    id: "notif-2",
    type: "agent",
    title: "AI Networking Agent Match Discovery",
    description: "The Networking Agent analyzed alumni nodes from ABC College and identified Rahul Sharma as a 94% deterministic match for Cloud Engineering.",
    timestamp: "45m ago",
    read: false,
    actionUrl: "/network",
    actionLabel: "View Match Breakdown",
    badge: "Agent Alert",
  },
];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(NOTIFICATIONS, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/database/feed";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("[API:Posts] Error fetching posts:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || DEMO_USER_ID;
    const content = (body.content || "").trim();
    const postType = body.postType || "general";

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await createPost(userId, content, postType);
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("[API:Posts] Error creating post:", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

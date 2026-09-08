import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPost, toggleLikePost } from "@/lib/database/feed";
import { DEMO_USER_ID } from "@/lib/seed-data";

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json({ success: true, data: posts, posts });
  } catch (error: any) {
    console.error("[API:Feed] Failed to retrieve feed posts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retrieve posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, postId, userId = DEMO_USER_ID, content, postType = "general" } = body;

    // Support toggle like
    if (action === "like" && postId) {
      const result = await toggleLikePost(postId);
      return NextResponse.json({ success: true, data: result, ...result });
    }

    // Default: create post
    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: "Post content is required" },
        { status: 400 }
      );
    }

    const newPost = await createPost(userId, content.trim(), postType);
    return NextResponse.json({ success: true, data: newPost, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("[API:Feed] Failed to handle feed request:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to handle feed request" },
      { status: 500 }
    );
  }
}

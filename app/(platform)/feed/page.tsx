import React from "react";
import { getUser, getPosts } from "@/lib/database";
import { FeedView } from "@/components/feed/FeedView";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);

  return (
    <FeedView currentUser={user} initialPosts={posts} />
  );
}

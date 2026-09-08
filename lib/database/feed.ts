import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { SEED_POSTS, SEED_USERS, DEMO_USER_ID } from "@/lib/seed-data";
import type { Database } from "@/types/database";

export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type EnrichedPost = PostRow & {
  author?: Database["public"]["Tables"]["users"]["Row"];
  likes_count: number;
  comments_count: number;
  user_has_liked?: boolean;
};

// In-memory local posts store
const globalForFeed = globalThis as unknown as {
  localPosts?: EnrichedPost[];
};

if (!globalForFeed.localPosts) {
  globalForFeed.localPosts = SEED_POSTS.map((p) => ({
    ...p,
    likes_count: p.likes_count || 0,
    comments_count: p.comments_count || 0,
    user_has_liked: false,
  }));
}

const getLocalPosts = () => globalForFeed.localPosts!;
const setLocalPosts = (val: EnrichedPost[]) => {
  globalForFeed.localPosts = val;
};

/**
 * Retrieve public feed posts.
 */
export async function getPosts(): Promise<EnrichedPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:users!posts_user_id_fkey(*)
        `)
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((post: any) => ({
          ...post,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          user_has_liked: false,
        }));
      }
    } catch (err) {
      console.warn("[Feed DAL] Failed to fetch posts from Supabase, falling back to seed data:", err);
    }
  }

  return getLocalPosts();
}

/**
 * Like or unlike a post.
 */
export async function toggleLikePost(postId: string): Promise<{ likesCount: number; userHasLiked: boolean }> {
  let updatedCount = 0;
  let hasLiked = false;

  setLocalPosts(getLocalPosts().map((p) => {
    if (p.id === postId) {
      hasLiked = !p.user_has_liked;
      updatedCount = hasLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1);
      return {
        ...p,
        likes_count: updatedCount,
        user_has_liked: hasLiked,
      };
    }
    return p;
  }));

  return {
    likesCount: updatedCount,
    userHasLiked: hasLiked,
  };
}

/**
 * Create a new feed post.
 */
export async function createPost(
  userId: string = DEMO_USER_ID,
  content: string,
  postType: Database["public"]["Tables"]["posts"]["Row"]["post_type"] = "achievement"
): Promise<EnrichedPost> {
  const newPost: EnrichedPost = {
    id: `post_${Date.now()}`,
    user_id: userId,
    content,
    media_url: null,
    post_type: postType,
    visibility: "public",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: SEED_USERS.find((u) => u.id === userId),
    likes_count: 0,
    comments_count: 0,
    user_has_liked: false,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase.from("posts") as any)
        .insert({
          id: newPost.id,
          user_id: newPost.user_id,
          content: newPost.content,
          media_url: newPost.media_url,
          post_type: newPost.post_type,
          visibility: newPost.visibility,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          ...(data as PostRow),
          author: newPost.author,
          likes_count: 0,
          comments_count: 0,
          user_has_liked: false,
        };
      }
    } catch (err) {
      console.warn("[Feed DAL] Failed to persist post to Supabase, keeping in local memory:", err);
    }
  }

  setLocalPosts([newPost, ...getLocalPosts()]);
  return newPost;
}

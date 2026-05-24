import { CreatePost, Post } from "@/lib/schemas/post";
import { apiFetch } from "@/lib/client/api/fetcher";

export async function createPostClient(post: CreatePost) {
  const formData = new FormData();
  formData.append("content", post.content);
  formData.append("visibility", post.visibility);

  if (post.media) {
    formData.append("media", post.media);
  }

  try {
    const response = await apiFetch<Post>("/api/private/post", {
      method: "POST",
      body: formData,
    });

    return response;
  } catch (error) {
    throw new Error(
      `Client error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

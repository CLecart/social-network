"use client";

import { useApi } from "@/hooks/use-api";
import { PostWithDetails, PostWithDetailsSchema } from "@/lib/schemas/post/postWithDetails";

export function usePostDetails(postId?: string) {
  const enabled = !!postId;
  return useApi<PostWithDetails>({
    url: enabled ? `/api/private/post/${postId}` : "",
    schema: PostWithDetailsSchema,
    envelope: true,
    enabled,
    swrOptions: { shouldRetryOnError: false },
  });
}


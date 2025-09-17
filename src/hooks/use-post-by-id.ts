"use client";

import useSWR from "swr";
import { PostSchemas } from "@/lib/schemas/post";
import { useApi } from "@/hooks/use-api";

export function usePostById(postId: string | null) {
  const shouldFetch = !!postId;

  const { data, error, isLoading, refresh } = useApi({
    url: `/api/private/post/${postId}`,
    schema: PostSchemas.Details,
    envelope: true,
    enabled: shouldFetch,
  });

  return {
    post: data,
    loading: isLoading,
    error,
    refetch: refresh,
  };
}

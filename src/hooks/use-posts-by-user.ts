
// hooks/useUserPosts.ts
'use client';

import { PostWithDetails, PostWithDetailsSchema } from '@/lib/schemas/post';
import { useCallback, useMemo, useState } from 'react';
import { useApi } from '@/hooks/use-api';

interface UseUserPostsParams {
  userId?: string; // Si non fourni, utilise l'utilisateur connecté
  publicOnly?: boolean;
  page?: number; // réservé pour futur usage (pagination côté API)
  limit?: number;
}

interface UseUserPostsReturn {
  posts: PostWithDetails[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  setPosts: React.Dispatch<React.SetStateAction<PostWithDetails[]>>
  refetch: () => void;
  loadMore: () => void;
}

export function useUserPosts({
  userId,
  publicOnly = false,
  page = 1,
  limit = 10,
}: UseUserPostsParams = {}): UseUserPostsReturn {
  const enabled = !!userId;
  const url = enabled ? `/api/private/post/profile/${userId}` : '';
  const { data, isLoading, error, refresh } = useApi<PostWithDetails[]>({
    url,
    schema: PostWithDetailsSchema.array(),
    envelope: true,
    enabled,
    swrOptions: {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    },
  });

  const posts = useMemo(() => data ?? [], [data]);
  const [postsState, setPosts] = useState<PostWithDetails[]>([]);

  // Expose a setter while keeping SWR as source of truth
  const effectivePosts = posts.length ? posts : postsState;

  const hasMore = false; // l'endpoint actuel ne pagine pas
  const total = effectivePosts.length;

  const refetch = useCallback(() => {
    refresh();
  }, [refresh]);

  const loadMore = useCallback(() => {
    // pas de pagination serveur pour le moment
  }, []);

  return {
    posts: effectivePosts,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    hasMore,
    total,
    refetch,
    loadMore,
    setPosts,
  };
}

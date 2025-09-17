"use client";

import { UserStoriesGroupSchema } from "@/lib/schemas/stories/group";
import { useApi } from "@/hooks/use-api";
import { z } from "zod";

interface UseUserStoriesParams {
  userId?: string;
  publicOnly?: boolean;
  includeExpired?: boolean;
}

const StoriesArraySchema = z
  .array(UserStoriesGroupSchema)
  .describe("StoriesArraySchema");

export function useUserStories({
  userId,
  publicOnly = false,
  includeExpired = false,
}: UseUserStoriesParams = {}) {
  const params = new URLSearchParams();
  if (publicOnly) params.append("publicOnly", "true");
  if (includeExpired) params.append("includeExpired", "true");
  if (userId) params.append("userId", userId);

  const { data, error, isLoading, refresh } = useApi<z.infer<typeof StoriesArraySchema>>({
    url: `/api/private/stories?${params.toString()}`,
    schema: StoriesArraySchema,
    envelope: true,
  });

  return {
    storiesGroups: data,
    loading: isLoading,
    error,
    refetch: refresh,
  };
}

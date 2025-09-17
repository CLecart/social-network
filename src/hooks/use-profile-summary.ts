"use client";

import { useApi } from "@/hooks/use-api";
import { ProfileSummary, ProfileSummarySchema } from "@/lib/schemas/profile/summary";

export function useProfileSummary(userId?: string) {
  const enabled = !!userId;
  return useApi<ProfileSummary>({
    url: enabled ? `/api/private/profile/${userId}/summary` : "",
    schema: ProfileSummarySchema,
    envelope: true,
    enabled,
    swrOptions: {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  });
}


"use client";

import { useApi } from "@/hooks/use-api";
import { UserPublic, UserPublicSchema } from "@/lib/schemas/user/public";

export function useFollowers(userId?: string) {
  const enabled = !!userId;
  return useApi<UserPublic[]>({
    url: enabled ? `/api/private/follow/${userId}/followers` : "",
    schema: UserPublicSchema.array(),
    envelope: true,
    enabled,
    swrOptions: { shouldRetryOnError: false },
  });
}

export function useFollowing(userId?: string) {
  const enabled = !!userId;
  return useApi<UserPublic[]>({
    url: enabled ? `/api/private/follow/${userId}/following` : "",
    schema: UserPublicSchema.array(),
    envelope: true,
    enabled,
    swrOptions: { shouldRetryOnError: false },
  });
}


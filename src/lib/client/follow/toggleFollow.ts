"use client";

import { apiFetch } from "@/lib/client/api/fetcher";

// Toggle follow/unfollow for a target user. Returns the new status (e.g., 'accepted') or null if unfollowed.
export async function toggleFollow(targetUserId: string) {
  const res = await apiFetch<any>(`/api/private/follow/${targetUserId}/`, {
    method: "POST",
    body: { userId: targetUserId },
  });
  return (res?.data && (res.data as any).status) ? (res.data as any).status as string : null;
}


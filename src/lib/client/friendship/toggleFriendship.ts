"use client";

import { apiFetch } from "@/lib/client/api/fetcher";

export async function toggleFriendshipRequest(targetUserId: string) {
  const res = await apiFetch<{ status?: "pending" | "accepted" }>(
    "/api/private/friend-requests",
    {
      method: "POST",
      body: { friendId: targetUserId },
    }
  );
  return (res?.data && (res.data as any).status) || null;
}


"use client";

import { useApi } from "@/hooks/use-api";
import { GroupEventsResponse, GroupEventsResponseSchema } from "@/lib/schemas/group/event";

export function useGroupEvents(groupId?: string | null) {
  const enabled = !!groupId;
  return useApi<GroupEventsResponse>({
    url: enabled ? `/api/private/events?groupId=${groupId}` : "",
    schema: GroupEventsResponseSchema,
    envelope: true,
    enabled,
    swrOptions: { shouldRetryOnError: false, revalidateOnFocus: false },
  });
}


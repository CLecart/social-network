"use client";

import { useApi } from "@/hooks/use-api";
import { GroupEventsResponse, GroupEventsResponseSchema } from "@/lib/schemas/group/event";

export function useEvents() {
  return useApi<GroupEventsResponse>({
    url: "/api/private/events",
    schema: GroupEventsResponseSchema,
    envelope: true,
    enabled: true,
    swrOptions: { shouldRetryOnError: false, revalidateOnFocus: false },
  });
}


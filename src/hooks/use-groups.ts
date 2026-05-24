"use client";

import { useApi } from "@/hooks/use-api";
import { GroupListResponse, GroupListResponseSchema } from "@/lib/schemas/group/list";

export function useGroups() {
  return useApi<GroupListResponse>({
    url: "/api/private/groups",
    schema: GroupListResponseSchema,
    envelope: true,
    enabled: true,
    swrOptions: { shouldRetryOnError: false, revalidateOnFocus: false },
  });
}


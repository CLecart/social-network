"use client";

import { useApi } from "@/hooks/use-api";
import { GroupSummary, GroupSummarySchema } from "@/lib/schemas/group/summary";

export function useGroup(groupId?: string | null) {
  const enabled = !!groupId;
  return useApi<GroupSummary>({
    url: enabled ? `/api/private/groups/${groupId}` : "",
    schema: GroupSummarySchema,
    envelope: true,
    enabled,
    swrOptions: { shouldRetryOnError: false, revalidateOnFocus: false },
  });
}


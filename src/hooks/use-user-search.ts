"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import { UserSearchResponse, UserSearchResponseSchema } from "@/lib/schemas/user/search";

export function useUserSearch(query: string, debounceMs = 250) {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const trimmed = (query || "").trim();
    const id = setTimeout(() => setDebounced(trimmed), debounceMs);
    return () => clearTimeout(id);
  }, [query, debounceMs]);

  const enabled = debounced.length >= 2;
  const { data, isLoading, error, refresh } = useApi<UserSearchResponse>({
    url: enabled ? `/api/private/users/search?q=${encodeURIComponent(debounced)}` : "",
    schema: UserSearchResponseSchema,
    envelope: true,
    enabled,
    swrOptions: { keepPreviousData: true, shouldRetryOnError: false },
  });

  return {
    users: data?.users ?? [],
    isLoading,
    error,
    refresh,
    debouncedQuery: debounced,
  };
}


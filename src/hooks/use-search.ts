"use client";

import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/use-api";
import { SearchItem, SearchItemSchema } from "@/lib/schemas/search";

export function useSearch(query: string, debounceMs = 300) {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const q = query?.trim?.() ?? "";
    const id = setTimeout(() => setDebounced(q), debounceMs);
    return () => clearTimeout(id);
  }, [query, debounceMs]);

  const enabled = debounced.length > 0;
  const url = useMemo(() => (enabled ? `/api/private/search?q=${encodeURIComponent(debounced)}` : ""), [enabled, debounced]);

  const { data, isLoading, error, refresh } = useApi<SearchItem[]>({
    url,
    schema: SearchItemSchema.array(),
    envelope: true,
    enabled,
    swrOptions: {
      revalidateOnFocus: false,
      keepPreviousData: true,
      shouldRetryOnError: false,
    },
  });

  return {
    results: data ?? [],
    isLoading,
    error,
    refresh,
    debouncedQuery: debounced,
  };
}


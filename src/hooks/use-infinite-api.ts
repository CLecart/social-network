"use client";

import useSWRInfinite from "swr/infinite";
import { apiFetch } from "@/lib/client/api/fetcher";
import { z } from "zod";
import { apiResponseSchema } from "@/lib/schemas/api/response";
import { parseOrThrow } from "@/lib/utils/validation";

type CommonOptions = {
  headers?: Record<string, string>;
  withAuth?: boolean;
  getToken?: () => string | null;
  userId?: string;
  retry?: number;
  timeout?: number;
  revalidateFirstPage?: boolean;
};

export type UseInfiniteApiOptions<T> = CommonOptions & {
  getKey: (pageIndex: number, previousPageData: T[] | null) => string | null;
  schema?: z.ZodType<T[]>;
  envelope?: boolean;
};

export function useInfiniteApi<T = unknown>({
  getKey,
  headers,
  withAuth = true,
  getToken,
  userId,
  retry,
  timeout,
  schema,
  envelope = true,
}: UseInfiniteApiOptions<T>) {
  const validate = (raw: any): T[] => {
    if (!schema) return (raw ?? []) as T[];
    if (envelope) {
      const respSchema = apiResponseSchema(schema);
      const parsed = parseOrThrow(respSchema as any, raw) as any;
      return parsed.data as T[];
    }
    return parseOrThrow(schema as any, raw) as T[];
  };

  const fetcher = async (url: string): Promise<T[]> => {
    const res = await apiFetch<any>(url, {
      method: "GET",
      headers,
      withAuth,
      token: getToken ? getToken() : undefined,
      userId,
      retry,
      timeout,
    });
    return validate(res);
  };

  const swr = useSWRInfinite<T[]>(getKey as any, fetcher);

  return swr;
}


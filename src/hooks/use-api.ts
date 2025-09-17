"use client";

import useSWR, { SWRConfiguration, KeyedMutator } from 'swr';
import { apiFetch, HttpMethod } from '@/lib/client/api/fetcher';
import { z } from 'zod';
import { apiResponseSchema } from '@/lib/schemas/api/response';
import { parseOrThrow } from '@/lib/utils/validation';

type UseApiOptions<T = unknown> = {
  url: string;
  method?: HttpMethod;
  body?: unknown;
  swrOptions?: SWRConfiguration<T>;
  disableCache?: boolean;
  headers?: Record<string, string>;
  withAuth?: boolean;
  getToken?: () => string | null;
  userId?: string;
  retry?: number;
  timeout?: number;
  enabled?: boolean; // allow conditional fetch
  schema?: z.ZodType<T>;
  envelope?: boolean; // if true, parse { success, data }
};

export function useApi<T>(options: UseApiOptions<T>) {
  const {
    url,
    method = 'GET',
    body,
    swrOptions,
    disableCache = false,
    headers,
    withAuth = true,
    getToken,
    userId,
    retry,
    timeout,
  } = options;

  const isGet = method === 'GET';
  const swrKey = disableCache || !isGet || options.enabled === false ? null : url;
  const validate = (raw: any): T => {
    if (!options?.schema) return raw as T;
    const { schema, envelope = true } = options;
    if (envelope) {
      const respSchema = apiResponseSchema(schema);
      const parsed = parseOrThrow(respSchema as any, raw) as any;
      return parsed.data as T;
    }
    return parseOrThrow(options.schema as any, raw) as T;
  };

  const fetcher = async (): Promise<T> => {
    const res = await apiFetch<any>(url, {
      method: 'GET',
      headers,
      withAuth,
      token: getToken ? getToken() : undefined,
      userId,
      retry,
      timeout,
    });
    return validate(res);
  };

  const { data, error, mutate, isLoading } = useSWR<T>(swrKey, fetcher, swrOptions);

  type MutateOptions = {
    method?: Exclude<HttpMethod, 'GET'>;
    optimisticData?: T | ((current?: T) => T);
    rollbackOnError?: boolean;
    revalidate?: boolean;
    headers?: Record<string, string>;
    body?: unknown;
  };

  const mutateData = async (newBody?: unknown, opts?: Omit<MutateOptions, 'body'>) => {
    const {
      method: mutateMethod,
      optimisticData,
      rollbackOnError = true,
      revalidate = true,
      headers: extraHeaders,
    } = opts || {};

    const finalMethod: Exclude<HttpMethod, 'GET'> = mutateMethod || (newBody ? 'PUT' : 'DELETE');

    return await mutate(
      async () => {
        const res = await apiFetch<T>(url, {
          method: finalMethod,
          body: newBody ?? body,
          headers: { ...(headers || {}), ...(extraHeaders || {}) },
          withAuth,
          token: getToken ? getToken() : undefined,
          userId,
          retry,
          timeout,
        });
        return validate(res);
      },
      {
        optimisticData: typeof optimisticData === 'function' ? (optimisticData as any)(data) : optimisticData,
        rollbackOnError,
        revalidate,
        populateCache: true,
      }
    );
  };

  const send = async (sendOptions: MutateOptions = {}) => {
    const {
      method: sendMethod = 'POST',
      body: sendBody = body,
      headers: extraHeaders,
      optimisticData,
      rollbackOnError = true,
      revalidate = true,
    } = sendOptions;

    return await mutate(
      async () => {
        const res = await apiFetch<any>(url, {
          method: sendMethod,
          body: sendBody,
          headers: { ...(headers || {}), ...(extraHeaders || {}) },
          withAuth,
          token: getToken ? getToken() : undefined,
          userId,
          retry,
          timeout,
        });
        return validate(res);
      },
      {
        optimisticData: typeof optimisticData === 'function' ? (optimisticData as any)(data) : optimisticData,
        rollbackOnError,
        revalidate,
        populateCache: true,
      }
    );
  };

  return {
    data,
    error,
    isLoading,
    mutate: mutateData as (
      newBody?: unknown,
      opts?: Omit<MutateOptions, 'body'>
    ) => Promise<T | undefined>,
    send: send as (opts?: MutateOptions) => Promise<T | undefined>,
    refresh: () => mutate(),
    mutateRaw: mutate as KeyedMutator<T>,
  };
}

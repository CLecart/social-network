"use client";

import { APIResponse } from "@/lib/schemas/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type FetcherOptions<TBody = any> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  withAuth?: boolean;
  token?: string | null;
  userId?: string;
  timeout?: number;
  retry?: number;
  retryDelay?: (attempt: number) => number;
  shouldRetry?: (status: number | null, error: unknown) => boolean;
  signal?: AbortSignal;
};


function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function defaultRetryDelay(attempt: number) {
  const base = 400 * Math.pow(2, attempt);
  const jitter = Math.random() * 100;
  return base + jitter;
}

function defaultShouldRetry(status: number | null) {
  if (status === null) return true;
  if (status === 429) return true;
  if (status >= 500) return true;
  return false;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, payload?: unknown) {
    super(`HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch<TData = unknown, TBody = any>(
  url: string,
  opts: FetcherOptions<TBody> = {}
): Promise<APIResponse<TData>> {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
    token,
    userId,
    timeout = 10000,
    retry = 3,
    retryDelay = defaultRetryDelay,
    shouldRetry = defaultShouldRetry,
    signal,
  } = opts;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...headers,
  };

  if (withAuth) {
    const cookieToken = token ?? readCookie("authToken");
    if (cookieToken) finalHeaders["Authorization"] = `Bearer ${cookieToken}`;
  }

  if (userId) finalHeaders["x-user-id"] = userId;

  let lastError: unknown = null;

  for (let attempt = 0; attempt < Math.max(1, retry); attempt++) {
    try {
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      if (signal) {
        if (signal.aborted) controller.abort();
        else signal.addEventListener("abort", onAbort, { once: true });
      }
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        credentials: "include",
        body: isFormData ? (body as any) : body != null ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (signal) {
        try { signal.removeEventListener("abort", onAbort as any); } catch { }
      }

      if (!res.ok) {
        const status = res.status;
        let errorPayload: any = null;
        try {
          errorPayload = await res.json();
        } catch { }
        const err = new ApiError(status, errorPayload);
        if (attempt < retry - 1 && shouldRetry(status, err)) {
          await new Promise((r) => setTimeout(r, retryDelay(attempt)));
          continue;
        }
        throw err;
      }

      // Succès HTTP → on retourne ApiResponse<TData>
      if (res.status === 204) {
        // si tes APIs ne renvoient jamais 204, tu peux throw ici.
        return { success: true, data: null as unknown as TData };
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return (await res.json()) as APIResponse<TData>;
      }

      // Fallback: si pas JSON, on enveloppe dans un succès (peu probable dans ton design)
      const text = await res.text();
      return { success: true, data: text as unknown as TData };
    } catch (e: any) {
      lastError = e;
      const status = e instanceof ApiError ? e.status : null;
      if (attempt < retry - 1 && shouldRetry(status, e)) {
        await new Promise((r) => setTimeout(r, retryDelay(attempt)));
        continue;
      }
      throw e;
    }
  }

  throw lastError ?? new Error("Unknown fetch error");
}

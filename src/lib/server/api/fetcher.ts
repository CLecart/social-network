import { cookies } from "next/headers";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type FetcherOptions<T> = {
    method: HttpMethod;
    body?: T;
    headers?: Record<string, string>;
    timeout?: number; // Default: 5000ms
    retry?: number;   // Default: 2
};

// Nouvelle signature avec génériques
export async function fetcher<TRequest, TResponse>(
    url: string,
    options: FetcherOptions<TRequest>
): Promise<TResponse> {
    const { method, body, headers = {}, timeout = 5000, retry = 3 } = options;

    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;
    const finalHeaders = authToken
        ? { ...headers, Authorization: `Bearer ${authToken}` }
        : headers;

    let lastError: unknown;
    for (let i = 0; i < retry; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                method,
                headers: finalHeaders,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
            }

            return (await response.json()) as TResponse;
        } catch (error) {
            lastError = error;
            if (i === retry - 1) throw lastError; // Dernière tentative → relance l'erreur
            await new Promise(resolve => setTimeout(resolve, 1000 * i)); // Backoff exponentiel
        }
    }
    throw lastError;
}

import { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt/verifyJwt";

/**
 * Resolve the authenticated user id from the request.
 * Priority: middleware header `x-user-id` -> cookie `authToken` (JWT).
 * Returns null if unauthenticated or invalid.
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) return headerUserId;

  const token = req.cookies.get("authToken")?.value;
  if (!token) return null;
  try {
    const payload = await verifyJwt(token);
    return payload?.userId ?? null;
  } catch {
    return null;
  }
}


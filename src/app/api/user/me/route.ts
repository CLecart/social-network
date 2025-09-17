import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = await getUserIdFromRequest(request);
  
  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  // For now, return a simple response with the user ID
  // In a real app, you'd fetch user details from the database
  return NextResponse.json(respondSuccess({ id: userId }));
}

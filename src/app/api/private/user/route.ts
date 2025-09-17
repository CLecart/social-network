import { UserPublic, UserSchemas } from "@/lib/schemas/user";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json(respondError("Unauthorized"), { status: 401 });

  const userData = await getUserByIdServer<UserPublic>(userId, UserSchemas.Public);

  if (!userData) {
    return NextResponse.json(respondError("User not found"), { status: 404 });
  }

  return NextResponse.json(respondSuccess(userData), { status: 200 });
}

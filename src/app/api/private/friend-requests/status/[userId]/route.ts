import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

// GET: Vérifier le statut d'amitié avec un utilisateur spécifique
export async function GET(
  req: NextRequest,
  { params }: any
) {
  const currentUserId = await getUserIdFromRequest(req);
  if (!currentUserId) return NextResponse.json(respondError("Unauthorized"), { status: 401 });
  const { userId: targetUserId } = await params;

  try {
    // Chercher une relation d'amitié dans les deux sens
    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          {
            userId: currentUserId,
            friendId: targetUserId,
          },
          {
            userId: targetUserId,
            friendId: currentUserId,
          },
        ],
      },
      select: {
        status: true,
        userId: true,
        friendId: true,
      },
    });

    if (!friendship) {
      return NextResponse.json(respondSuccess(null, "No friendship found"), { status: 200 });
    }

    return NextResponse.json(respondSuccess({ status: friendship.status }, "Friendship status retrieved"), { status: 200 });

  } catch (error) {
    console.error("Error checking friendship status:", error);
    return NextResponse.json(respondError("Internal server error"), { status: 500 });
  }
}

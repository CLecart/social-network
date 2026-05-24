// app/api/private/post/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPostsByUserIdServer } from "@/lib/server/post/getPost";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const currentUserId = await getUserIdFromRequest(req);

    if (!userId) {
        return NextResponse.json(respondError("Missing userId"), { status: 400 });
    }
    
    try {
        const posts = await getPostsByUserIdServer(userId, currentUserId || undefined);

        return NextResponse.json(respondSuccess(posts), { status: 200 });
    } catch (err) {
        console.error("Erreur dans /by-user", err);
        return NextResponse.json(respondError("Server error"), { status: 500 });
    }
}

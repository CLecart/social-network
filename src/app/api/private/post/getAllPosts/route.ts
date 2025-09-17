import { getPaginatedPosts } from "@/lib/db/queries/post/getAllPosts";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(respondError("Missing or invalid user ID"), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);

    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "10", 10);

    if (isNaN(skip) || skip < 0 || isNaN(take) || take <= 0 || take > 50) {
      return NextResponse.json(respondError("Invalid pagination parameters."), {
        status: 400,
      });
    }

    const posts = await getPaginatedPosts(skip, take, userId);

    return NextResponse.json(
      respondSuccess(
        posts,
        posts.length === 0 ? "No posts available yet." : undefined
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);

    return NextResponse.json(
      respondError(
        error instanceof Error ? error.message : "Unexpected server error."
      ),
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getAllStoriesGrouped,
  getStoriesByUserId,
} from "@/lib/server/stories/getStories";
import { createStoriesServer } from "@/lib/server/stories/createStories";
import { CreateStory, StorySchemas } from "@/lib/schemas/stories";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { parseOrThrow, ValidationError } from "@/lib/utils/validation";
import { serializeDates } from "@/lib/utils/serializeDates";
import { parseCreateStory } from "@/lib/parsers/formParsers";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";

export async function GET(req: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(req);

    if (!currentUserId) {
      return NextResponse.json(
        respondError("Invalid user ID."),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const publicOnly = searchParams.get("publicOnly") === "true";

    if (userId) {
      const rawStories = await getStoriesByUserId(userId, currentUserId);
      const mappedStories = rawStories.map((story) => ({
        ...story,
        likesCount: story._count.reactions,
      }));

      return NextResponse.json(
        respondSuccess([
          {
            user: mappedStories[0]?.user || null,
            stories: mappedStories,
            hasUnviewed: true,
          },
        ]),
        { status: 200 }
      );
    } else {
      const rawStoriesGroups = await getAllStoriesGrouped(
        currentUserId,
        publicOnly
      );

      const mappedStoriesGroups = rawStoriesGroups.map((userGroup) => ({
        ...userGroup,
        stories: userGroup.stories.map((story: any) => ({
          ...story,
          likesCount: story._count.reactions,
        })),
      }));

      return NextResponse.json(respondSuccess(mappedStoriesGroups), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Failed to fetch stories:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json(respondError(message), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(respondError("Invalid user ID"), {
        status: 401,
      });
    }

    let parsedData: CreateStory;
    try {
      const rawData = parseOrThrow(
        StorySchemas.Create,
        parseCreateStory(await req.formData()),
        { label: 'CreateStoryBody' }
      );

      // Ensure visibility is always defined
      parsedData = {
        ...rawData,
        visibility: rawData.visibility ?? "PUBLIC" as const,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          respondError("Invalid body", error.fieldErrors),
          { status: 400 }
        );
      }
      return NextResponse.json(
        respondError(
          error instanceof Error ? error.message : "Unexpected server error."
        ),
        { status: 500 }
      );
    }

    const created = await createStoriesServer(parsedData, userId);

    return NextResponse.json(
      respondSuccess(serializeDates(created)),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Failed to updated reaction:", error);

    return NextResponse.json(
      respondError(
        error instanceof Error ? error.message : "Unexpected server error."
      ),
      { status: 500 }
    );
  }
}

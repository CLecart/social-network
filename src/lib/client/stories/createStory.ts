import { CreateStory } from "@/lib/schemas/stories/";
import { apiFetch } from "@/lib/client/api/fetcher";
import type { StoryWithDetails } from "@/lib/schemas/stories/story";

export async function createStoryClient(story: CreateStory) {
    const formData = new FormData();

    if (story.media) {
        formData.append("media", story.media);
    }

    formData.append("visibility", story.visibility);
    try {
        const response = await apiFetch<StoryWithDetails>("/api/private/stories", {
            method: "POST",
            body: formData,
            retry: 1, // avoid duplicate creations on transient errors
            timeout: 120000, // allow large uploads (up to 2 minutes)
        });

        return response;
    } catch (error) {
        throw new Error(`Client error: ${(error instanceof Error) ? error.message : "Unknown error"}`);
    }
}

import { apiFetch } from "@/lib/client/api/fetcher";

// TODO : Review gestion d'erreur de update reaction
export async function updatedReaction(data: Record<string, any>) {
  try {
    const reponse = await apiFetch<void>("/api/private/reaction", {
      method: "PUT",
      body: data,
    });
    return reponse;
  } catch (error) {
    if (error instanceof Error)
      throw new Error("failed to update reaction: ", error);
  }
}

import { db } from "../..";

export async function getJoinRequestsForOwner(ownerId: string) {
  if (!ownerId) {
    throw new Error("Missing ownerId");
  }

  // Get all pending join requests for groups owned by the user
  const joinRequests = await db.groupJoinRequest.findMany({
    where: {
      status: "PENDING",
      Conversation: {
        ownerId: ownerId,
      },
    },
    include: {
      Conversation: {
        select: {
          id: true,
          title: true,
        },
      },
      User: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return joinRequests;
}

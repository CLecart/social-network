import { InvitationStatus } from "@prisma/client";
import { db } from "../..";
import { buildPostVisibilityFilter } from "./visibilityFilters";

// export async function getAllPosts() {
//   return await db.post.findMany({
//     include: {
//       user: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           username: true,
//           avatar: true,
//         }
//       },
//       _count: {
//         select: {
//           reactions: true,
//           comments: true
//         }
//       }
//     },
//     orderBy: {
//       datetime: 'desc'
//     }
//   });
// };

export async function getPaginatedPosts(
  skip: number,
  take: number = 10,
  currentUserId?: string
) {
  const visibilityFilter = buildPostVisibilityFilter({
    currentUserId,
    showPrivatePosts: false,
  });

  return await db.post.findMany({
    skip,
    take,
    where: visibilityFilter,
    orderBy: { datetime: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          lastName: true,
          firstName: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

export async function getUserPosts(
  userId: string,
  skip: number,
  take: number = 10,
  currentUserId?: string
) {
  // D'abord récupérer la visibilité du compte cible
  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { visibility: true },
  });

  // Si le compte est privé et que l'utilisateur courant n'est pas l'auteur,
  // ne retourner des posts que si l'amitié est acceptée. Si non authentifié, aucun post.
  if (targetUser?.visibility === 'PRIVATE' && currentUserId !== userId) {
    if (!currentUserId) {
      return [] as any[];
    }
    const isFriend = await db.friendship.findFirst({
      where: {
        OR: [
          { userId: currentUserId, friendId: userId, status: InvitationStatus.ACCEPTED },
          { userId: userId, friendId: currentUserId, status: InvitationStatus.PENDING },
        ],
      },
      select: { id: true },
    });
    if (!isFriend) {
      return [] as any[];
    }
  }

  const visibilityFilter = buildPostVisibilityFilter({
    currentUserId,
    targetUserId: userId,
    targetUserAccountVisibility: targetUser?.visibility || "PUBLIC",
  });

  return await db.post.findMany({
    skip,
    take,
    where: {
      userId,
      ...visibilityFilter,
    },
    orderBy: { datetime: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          lastName: true,
          firstName: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

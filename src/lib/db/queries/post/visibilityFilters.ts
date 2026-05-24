// visibilityFilters.ts
import { Prisma, Visibility, ProfileVisibility, InvitationStatus } from "@prisma/client";

interface VisibilityFilterOptions {
  currentUserId?: string;
  targetUserId?: string;
  showPrivatePosts?: boolean;
  targetUserAccountVisibility?: ProfileVisibility;

}

const isFriendOf = (currentUserId: string): Prisma.UserWhereInput => ({
  OR: [
    { friendships: { some: { friendId: currentUserId, status: InvitationStatus.ACCEPTED } } },
    { friendsWithMe: { some: { userId: currentUserId, status: InvitationStatus.ACCEPTED } } },
  ],
});


export function buildPostVisibilityFilter({
  currentUserId,
  targetUserId,
  showPrivatePosts = false,
  targetUserAccountVisibility,
}: VisibilityFilterOptions): Prisma.PostWhereInput {

  // Pas connecté → seulement les posts PUBLIC
  if (!currentUserId) {
    return { visibility: Visibility.PUBLIC };
  }

  // Vue des posts d’un utilisateur précis
  if (targetUserId) {
    // Mes propres posts → tout voir
    if (currentUserId === targetUserId) {
      return {};
    }

    // Compte privé : il faut être ami + post PUBLIC ou FRIENDS
    if (targetUserAccountVisibility === ProfileVisibility.PRIVATE) {
      return {
        AND: [
          { user: { is: isFriendOf(currentUserId) } },
          { OR: [{ visibility: Visibility.PUBLIC }, { visibility: Visibility.FRIENDS }] },
        ],
      };
    }

    // Compte public
    return {
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            { user: { is: isFriendOf(currentUserId) } },
          ],
        },
      ],
    };
  }

  // Feed avec ses propres posts privés inclus
  if (showPrivatePosts) {
    return {
      OR: [
        // Comptes publics + posts PUBLIC (pour tous)
        {
          AND: [
            { visibility: Visibility.PUBLIC },
            { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
          ],
        },
        // Comptes publics + posts FRIENDS (si ami)
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
            { user: { is: isFriendOf(currentUserId) } },
          ],
        },
        // Comptes privés (PUBLIC ou FRIENDS) si ami
        {
          AND: [
            { user: { is: { visibility: ProfileVisibility.PRIVATE } } },
            { OR: [{ visibility: Visibility.PUBLIC }, { visibility: Visibility.FRIENDS }] },
            { user: { is: isFriendOf(currentUserId) } },
          ],
        },
        // Mes propres posts (inclut PRIVATE)
        { userId: currentUserId },
      ],
    };
  }

  // Feed normal
  return {
    OR: [
      // Comptes publics + posts PUBLIC
      {
        AND: [
          { visibility: Visibility.PUBLIC },
          { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
        ],
      },
      // Comptes publics + posts FRIENDS (si ami)
      {
        AND: [
          { visibility: Visibility.FRIENDS },
          { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
          { user: { is: isFriendOf(currentUserId) } },
        ],
      },
      // Comptes privés (PUBLIC ou FRIENDS) si ami
      {
        AND: [
          { user: { is: { visibility: ProfileVisibility.PRIVATE } } },
          { OR: [{ visibility: Visibility.PUBLIC }, { visibility: Visibility.FRIENDS }] },
          { user: { is: isFriendOf(currentUserId) } },
        ],
      },
      // Mes propres posts
      { userId: currentUserId },
    ],
  };
}

export async function canUserSeePost(
  postId: string,
  currentUserId?: string
): Promise<boolean> {
  const { db } = await import("../..");

  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          visibility: true,
          friendships: {
            where: { friendId: currentUserId, status: InvitationStatus.ACCEPTED },
          },
          friendsWithMe: {
            where: { userId: currentUserId, status: InvitationStatus.ACCEPTED },
          },
        },
      },
    },
  });

  if (!post) return false;
  if (post.userId === currentUserId) return true;

  const isFriend = post.user.friendships.length > 0 || post.user.friendsWithMe.length > 0;

  if (post.user.visibility === ProfileVisibility.PRIVATE) {
    if (!isFriend) return false;
    return post.visibility === Visibility.PUBLIC || post.visibility === Visibility.FRIENDS;
  }

  // PUBLIC account
  if (post.visibility === Visibility.PUBLIC) return true;
  if (post.visibility === Visibility.FRIENDS) return isFriend;
  return false; // PRIVATE d’un autre utilisateur
}

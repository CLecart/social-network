import { Prisma, Visibility, ProfileVisibility, InvitationStatus } from "@prisma/client";

interface StoryVisibilityFilterOptions {
  currentUserId?: string;
  targetUserId?: string;                 // Stories d'un utilisateur spécifique
  showPrivateStories?: boolean;          // Inclure ses propres stories PRIVATE
  targetUserAccountVisibility?: ProfileVisibility; // Visibilité du compte cible
}

// Helper commun
const isFriendOf = (currentUserId: string): Prisma.UserWhereInput => ({
  OR: [
    { friendships: { some: { friendId: currentUserId, status: InvitationStatus.ACCEPTED } } },
    { friendsWithMe: { some: { userId: currentUserId, status: InvitationStatus.ACCEPTED } } },
  ],
});

export function buildStoryVisibilityFilter({
  currentUserId,
  targetUserId,
  showPrivateStories = false,
  targetUserAccountVisibility,
}: StoryVisibilityFilterOptions): Prisma.StoryWhereInput {

  // 1) Non connecté → uniquement PUBLIC
  if (!currentUserId) {
    return { visibility: Visibility.PUBLIC };
  }

  // 2) Stories d'un utilisateur précis
  if (targetUserId) {
    // a) Moi-même → tout voir
    if (currentUserId === targetUserId) {
      return {};
    }

    // b) Compte privé → il faut être ami + (PUBLIC ou FRIENDS)
    if (targetUserAccountVisibility === ProfileVisibility.PRIVATE) {
      return {
        AND: [
          { user: { is: isFriendOf(currentUserId) } },
          { OR: [{ visibility: Visibility.PUBLIC }, { visibility: Visibility.FRIENDS }] },
        ],
      };
    }

    // c) Compte public
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

  // 3) Feed avec ses stories privées incluses
  if (showPrivateStories) {
    return {
      OR: [
        // Comptes publics + PUBLIC
        {
          AND: [
            { visibility: Visibility.PUBLIC },
            { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
          ],
        },
        // Comptes publics + FRIENDS si ami
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
        // Mes propres stories (inclut PRIVATE)
        { userId: currentUserId },
      ],
    };
  }

  // 4) Feed normal
  return {
    OR: [
      // Comptes publics + PUBLIC
      {
        AND: [
          { visibility: Visibility.PUBLIC },
          { user: { is: { visibility: ProfileVisibility.PUBLIC } } },
        ],
      },
      // Comptes publics + FRIENDS si ami
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
      // Mes propres stories
      { userId: currentUserId },
    ],
  };
}

export async function canUserSeeStory(
  storyId: string,
  currentUserId?: string
): Promise<boolean> {
  const { db } = await import("../..");

  const story = await db.story.findUnique({
    where: { id: storyId },
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

  if (!story) return false;

  // L'auteur peut toujours voir ses propres stories
  if (story.userId === currentUserId) return true;

  const isFriend = story.user.friendships.length > 0 || story.user.friendsWithMe.length > 0;

  if (story.user.visibility === ProfileVisibility.PRIVATE) {
    if (!isFriend) return false;
    return story.visibility === Visibility.PUBLIC || story.visibility === Visibility.FRIENDS;
  }

  // Compte public
  if (story.visibility === Visibility.PUBLIC) return true;
  if (story.visibility === Visibility.FRIENDS) return isFriend;
  return false; // PRIVATE d’un autre utilisateur
}

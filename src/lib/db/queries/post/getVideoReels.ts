import { db } from "../..";
import { buildPostVisibilityFilter } from "./visibilityFilters";

import { Prisma } from "@prisma/client";

function videoImageFilter(): Prisma.PostWhereInput {
  const videoExts = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".flv"];
  return {
    image: { not: null }, // si image est nullable en BDD
    OR: [
      ...videoExts.map((ext) => ({
        image: { endsWith: ext, mode: "insensitive" as const },
      })),
      { image: { contains: "/video/", mode: "insensitive" } },
      { image: { contains: "video", mode: "insensitive" } },
    ],
  };
}


export async function getVideoReels(skip: number, take: number = 10, currentUserId?: string) {
  const visibilityFilter = buildPostVisibilityFilter({
    currentUserId,
    showPrivatePosts: false,
  });

  return await db.post.findMany({
    where: {
      AND: [videoImageFilter(), visibilityFilter],
    },
    skip,
    take,
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
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

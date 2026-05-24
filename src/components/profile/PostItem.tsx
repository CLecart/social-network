"use client";

import Image from "next/image";
import { Heart, MessageCircle, Video as VideoIcon } from "lucide-react";
import React, { useState } from "react";

type PostItemProps = {
  post: any;
  onClick: (post: any) => void;
};

export default function PostItem({ post, onClick }: PostItemProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const getMediaType = (mediaUrl: string | null) => {
    if (!mediaUrl) return "text";
    if (mediaUrl.includes("/video/") || mediaUrl.includes("video"))
      return "video";
    if (mediaUrl.includes("/image/") || mediaUrl.includes("image"))
      return "image";

    const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".flv"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    const lowerUrl = mediaUrl.toLowerCase();

    if (videoExtensions.some((ext) => lowerUrl.includes(ext))) return "video";
    if (imageExtensions.some((ext) => lowerUrl.includes(ext))) return "image";

    return "image";
  };

  const imageSrc =
    post.image && !hasImageError
      ? encodeURI(post.image)
      : "https://i.pinimg.com/736x/ac/de/54/acde5463c760002ed97dc553eb8238ab.jpg";
  const mediaType = getMediaType(post.image);

  return (
    <div
      className="aspect-square relative group cursor-pointer bg-[var(--bgLevel1)] rounded-lg overflow-hidden"
      onClick={() => onClick(post)}
    >
      {mediaType === "image" ? (
        <Image
          src={imageSrc}
          alt="Post"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover border-[var(--detailMinimal)] border-1 rounded-lg"
          onError={() => setHasImageError(true)}
        />
      ) : mediaType === "video" ? (
        <video
          src={post.image}
          className="w-full h-full object-cover border-[var(--detailMinimal)] border-1 rounded-lg"
          muted
          loop
          onMouseEnter={(e) => {
            const video = e.target as HTMLVideoElement;
            video.play();
          }}
          onMouseLeave={(e) => {
            const video = e.target as HTMLVideoElement;
            video.pause();
            video.currentTime = 0;
          }}
        />
      ) : (
        <div className="flex items-center justify-center p-2 h-full text-xs text-[var(--textNeutral)] text-center break-words">
          <p className="line-clamp-4">{post.content}</p>
        </div>
      )}

      {mediaType === "video" && (
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
          <VideoIcon className="w-3 h-3" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-white" />
            <span className="text-sm font-semibold">
              {post._count?.reactions || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="text-sm font-semibold">
              {post._count?.comments || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

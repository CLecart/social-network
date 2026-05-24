"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Camera,
  Edit3,
  Grid3X3,
  Video,
  Settings,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-theme";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import { useProfileSummary } from "@/hooks/use-profile-summary";
import { formatDate } from "@/app/utils/dateFormat";
import { useUserPosts } from "@/hooks/use-posts-by-user";
import { useState, useMemo, useRef } from "react";
import { PostProvider } from "@/app/context/post-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LoadingState,
  ErrorState,
  MediaSection,
  CommentsSection,
  PostHeader,
  PostFooter,
} from "@/components/feed/post/postDetails";
import { useParams, useRouter } from "next/navigation";
import { useFollowers, useFollowing } from "@/hooks/use-followers";
import { usePostDetails } from "@/hooks/use-post-details";
import { toggleFollow } from "@/lib/client/follow/toggleFollow";
import { toggleFriendshipRequest } from "@/lib/client/friendship/toggleFriendship";
import PostItem from "@/components/profile/PostItem";

type FilterType = "all" | "photos" | "videos" | "text";

interface TabButtonProps {
  type: FilterType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  activeFilter: FilterType;
  onFilterChange: (type: FilterType) => void;
}

const ProfileTabButton = ({ type, icon: Icon, label, count, activeFilter, onFilterChange }: TabButtonProps) => (
  <button
    onClick={() => onFilterChange(type)}
    className={`flex-1 flex flex-col items-center py-3 px-2 border-b-2 transition-colors ${
      activeFilter === type
        ? "border-(--blue) text-(--blue)"
        : "border-transparent text-(--textMinimal) hover:text-(--textNeutral)"
    }`}
  >
    <Icon className="w-5 h-5 mb-1" />
    <span className="text-xs font-medium">
      {label} ({count})
    </span>
  </button>
);

export default function ProfilePage() {
  const params = useParams();

  const userId = params?.userId as string | undefined;

  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [followPending, setFollowPending] = useState(false);
  const [friendPending, setFriendPending] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const [bannerError, setBannerError] = useState(false);

  const {
    data: summary,
    isLoading: loading,
    error,
    refresh: refetch,
  } = useProfileSummary(userId);
  const profileUser = summary?.user;
  const isOwnProfile = !!summary?.isOwnProfile;

  const { posts } = useUserPosts({
    userId: profileUser?.id,
    limit: 12,
  });
  // API hooks
  const stats = summary?.stats;
  const isFollowing = summary?.relationship.followStatus === "ACCEPTED";
  const followStatus = summary?.relationship.followStatus ?? null;
  const friendshipStatus = summary?.relationship.friendshipStatus ?? null;
  // Actions déclenchées côté client (follow / friend request)
  const { data: followers = [], refresh: refreshFollowers } = useFollowers(
    profileUser?.id,
  );
  const { data: following = [], refresh: refreshFollowing } = useFollowing(
    profileUser?.id,
  );
  const {
    data: selectedPostDetails,
    isLoading: postDetailsLoading,
    error: postDetailsError,
    refresh: refreshPostDetails,
  } = usePostDetails(selectedPost?.id);

  // Statuts de follow/amitié et compteurs gérés par hooks ci-dessus

  // Suivre / ne plus suivre via apiFetch helper
  const handleFollowToggle = async () => {
    if (!profileUser?.id || isOwnProfile) return;
    try {
      setFollowPending(true);
      await toggleFollow(profileUser.id);
      await refetch();
    } catch (err) {
      console.error("Erreur lors du suivi:", err);
    } finally {
      setFollowPending(false);
    }
  };

  // Envoyer/annuler une demande d'amitié
  const handleFriendRequest = async () => {
    if (!profileUser?.id || isOwnProfile) return;
    try {
      setFriendPending(true);
      await toggleFriendshipRequest(profileUser.id);
      await refetch();
    } catch (err) {
      console.error("Erreur lors de la demande d'amitié:", err);
    } finally {
      setFriendPending(false);
    }
  };

  // ------------------------
  const handleGoToSettings = () => {
    router.push("/settings/profile");
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedPost(null);
  };

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

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    switch (activeFilter) {
      case "photos":
        return posts.filter((post) => getMediaType(post.image) === "image");
      case "videos":
        return posts.filter((post) => getMediaType(post.image) === "video");
      case "text":
        return posts.filter((post) => !post.image);
      default:
        return posts;
    }
  }, [posts, activeFilter]);

  const postCounts = useMemo(() => {
    if (!posts) return { all: 0, photos: 0, videos: 0, text: 0 };

    const photos = posts.filter(
      (post) => getMediaType(post.image) === "image",
    ).length;
    const videos = posts.filter(
      (post) => getMediaType(post.image) === "video",
    ).length;
    const textOnly = posts.filter((post) => !post.image).length;

    return {
      all: posts.length,
      photos,
      videos,
      text: textOnly,
    };
  }, [posts]);

  // Afficher un loader pendant le chargement initial
  if (loading) {
    return (
      <div className="flex h-screen bg-(--bgLevel1) items-center justify-center">
        <div className="text-(--textMinimal)">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-(--bgLevel1) items-center justify-center">
        <div className="p-4 text-center">
          <div className="text-red-600 mb-4">
            Erreur lors du chargement du profil: {error?.message ?? String(error)}
          </div>
          <Button onClick={refetch} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex h-screen bg-(--bgLevel1) items-center justify-center">
        <div className="text-(--textMinimal)">Profil non trouvé</div>
      </div>
    );
  }

  // Button state helpers — flatten nested ternaries (SonarLint S3358)
  const friendBtnClass = (() => {
    if (friendPending) return "bg-gray-400 text-white cursor-not-allowed opacity-60";
    if (friendshipStatus === "PENDING") return "bg-orange-500 text-white hover:bg-orange-600";
    if (friendshipStatus === "ACCEPTED") return "bg-(--green60) text-(--textNeutral) hover:bg-(--greyHighlighted)";
    return "bg-(--blue) hover:bg-(--blue80) text-white";
  })();

  const friendBtnLabel = (() => {
    if (friendPending) return "En cours...";
    if (friendshipStatus === "PENDING") return "Demande envoyée";
    if (friendshipStatus === "ACCEPTED") return "Ami(e)";
    return "Demander en ami";
  })();

  const followBtnClass = (() => {
    if (followPending) return "bg-gray-400 text-white cursor-not-allowed opacity-60";
    if (isFollowing && followStatus === "ACCEPTED") return "bg-(--green60) text-(--textNeutral) hover:bg-(--greyHighlighted)";
    return "bg-(--blue) hover:bg-(--blue80) text-white";
  })();

  const followBtnLabel = (() => {
    if (followPending) return "En cours...";
    if (isFollowing && followStatus === "ACCEPTED") return "Suivi(e)";
    return "Suivre";
  })();

  const addFriendBtnClass = (() => {
    if (friendPending) return "bg-gray-400 text-white cursor-not-allowed opacity-60";
    if (friendshipStatus === "PENDING") return "bg-orange-500 text-white hover:bg-orange-600";
    return "bg-(--lavender) hover:bg-(--lavender80) text-white";
  })();

  const addFriendBtnLabel = (() => {
    if (friendPending) return "En cours...";
    if (friendshipStatus === "PENDING") return "Demande envoyée";
    return "Ajouter en ami";
  })();

  return (
    <PostProvider>
      <div className="flex h-screen bg-(--bgLevel1)">
        <NavigationBar />

        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-(--detailMinimal) bg-(--bgLevel1) sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-(--textNeutral) hover:bg-(--greyHighlighted)"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="font-semibold text-lg text-(--textNeutral)">
                {profileUser.username}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-(--textNeutral) hover:bg-(--greyHighlighted)"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              <ModeToggle />
            </div>
          </header>

          {/* Contenu principal */}
          <div className="bg-(--bgLevel1) mx-auto w-full">
            {/* Profile Info avec Bannière */}
            <div className="bg-(--bgLevel2)">
              {/* Bannière */}
              <div className="relative h-32 md:h-48 bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
                {profileUser.banner && !bannerError ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={profileUser.banner}
                      alt="Bannière de profil"
                      fill
                      sizes="(max-width: 768px) 100vw, calc(100vw - 256px)"
                      className="object-cover"
                      onError={() => setBannerError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-blue-400 via-purple-500 to-pink-500" />
                )}
                {isOwnProfile && (
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Informations du profil */}
              <div className="p-4">
                <div className="flex items-start gap-4 mb-4 -mt-12 relative">
                  <div className="relative">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-(--bgLevel2)">
                      <AvatarImage
                        src={profileUser.avatar || "/placeholder.svg"}
                        alt={profileUser.username}
                      />
                      <AvatarFallback className="bg-(--greyFill) text-(--textNeutral)">
                        {profileUser.username![0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-(--bgLevel2) border border-(--detailMinimal) hover:bg-(--greyHighlighted) rounded-full"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex-1 mt-14">
                    <div className="flex justify-around text-center mb-4">
                      <div className="flex flex-col items-center">
                        <div className="font-semibold text-lg text-(--textNeutral)">
                          {posts?.length || 0}
                        </div>
                        <div className="text-sm text-(--textMinimal)">
                          {(posts?.length || 0) > 1
                            ? "publications"
                            : "publication"}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="flex flex-col items-center"
                            onClick={refreshFollowers} // rafraîchir juste avant d’ouvrir
                          >
                            {stats?.follower ?? 0} abonnés
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25">
                          <DialogHeader>
                            <DialogTitle>Abonnés</DialogTitle>
                          </DialogHeader>

                          <div className="max-h-100 overflow-y-auto">
                            {followers.length === 0 ? (
                              <p className="text-sm text-(--textMinimal)">
                                Aucun abonné
                              </p>
                            ) : (
                              followers.map((f) => (
                                <div
                                  key={f.id}
                                  className="flex items-center gap-2 p-2 border-b border-(--detailMinimal)"
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={f.avatar || "/placeholder.svg"}
                                      alt={f.username}
                                    />
                                    <AvatarFallback>
                                      {f.username?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-(--textNeutral) font-medium">
                                    {f.username}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="flex flex-col items-center"
                            onClick={refreshFollowing} // rafraîchir juste avant d’ouvrir
                          >
                            {stats?.following ?? 0} abonnements
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25">
                          <DialogHeader>
                            <DialogTitle>Abonnements</DialogTitle>
                          </DialogHeader>

                          <div className="max-h-100 overflow-y-auto">
                            {following.length === 0 ? (
                              <p className="text-sm text-(--textMinimal)">
                                Aucun abonné
                              </p>
                            ) : (
                              following.map((f) => (
                                <div
                                  key={f.id}
                                  className="flex items-center gap-2 p-2 border-b border-(--detailMinimal)"
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={f.avatar || "/placeholder.svg"}
                                      alt={f.username}
                                    />
                                    <AvatarFallback>
                                      {f.username?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-(--textNeutral) font-medium">
                                    {f.username}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* Name and Bio */}
                <div className="mb-4">
                  {profileUser.birthDate && (
                    <h2 className="font-semibold text-base mb-1 text-(--textNeutral)">
                      {formatDate(profileUser.birthDate)}
                    </h2>
                  )}
                  {(profileUser.firstName || profileUser.lastName) && (
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-base text-(--textNeutral)">
                        {profileUser.firstName} {profileUser.lastName}
                      </h2>
                      {profileUser.visibility === "PRIVATE" && (
                        <Lock size={14} />
                      )}
                    </div>
                  )}
                  <p className="text-sm text-(--textMinimal) mb-1">
                    @{profileUser.username}
                  </p>
                  <p className="text-sm text-(--textMinimal) mb-1">
                    {profileUser.email}
                  </p>
                  <div className="text-sm whitespace-pre-line text-(--textMinimal) mb-2">
                    {profileUser.biography ||
                      (isOwnProfile
                        ? "Aucune bio pour le moment"
                        : "Aucune biographie")}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button
                      onClick={handleGoToSettings}
                      variant="outline"
                      className="flex-1 mx-2 border-(--detailMinimal) text-(--textNeutral) hover:bg-(--greyHighlighted)"
                    >
                      Modifier le profil
                    </Button>
                  ) : (
                    <>
                      {profileUser?.visibility === "PRIVATE" ? (
                        <Button
                          onClick={handleFriendRequest}
                          className={`flex-1 transition-opacity ${friendBtnClass}`}
                          disabled={friendPending}
                        >
                          {friendBtnLabel}
                        </Button>
                      ) : (
                        <>
                          {friendshipStatus === "ACCEPTED" ? (
                            <Button
                              onClick={handleFriendRequest}
                              className="flex-1 transition-opacity bg-(--green60) text-(--textNeutral) hover:bg-(--greyHighlighted)"
                              disabled={friendPending}
                            >
                              {friendBtnLabel}
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={handleFollowToggle}
                                className={`flex-1 transition-opacity mr-1 ${followBtnClass}`}
                                disabled={followPending}
                              >
                                {followBtnLabel}
                              </Button>
                              <Button
                                onClick={handleFriendRequest}
                                className={`flex-1 ml-1 transition-opacity ${addFriendBtnClass}`}
                                disabled={friendPending}
                              >
                                {addFriendBtnLabel}
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      <Button
                        variant="outline"
                        className="flex-1 ml-2 border-(--detailMinimal) text-(--textNeutral) hover:bg-(--greyHighlighted)"
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* TabBar pour filtrer les posts */}
            <div className="bg-(--bgLevel2) border-t border-(--detailMinimal) sticky top-18.25 z-40 w-full">
              <div className="flex w-full">
                <ProfileTabButton type="all" icon={Grid3X3} label="Tous" count={postCounts.all} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                <ProfileTabButton type="photos" icon={Camera} label="Photos" count={postCounts.photos} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                <ProfileTabButton type="videos" icon={Video} label="Vidéos" count={postCounts.videos} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </div>
            </div>

            {/* Posts Grid */}
            <div className="bg-(--bgLevel2)">
              <div className="p-4">
                {(() => {
                  // Si le compte est privé, afficher en fonction des permissions du résumé
                  if (
                    profileUser?.visibility === "PRIVATE" &&
                    !isOwnProfile &&
                    summary?.permissions.canViewPosts
                  ) {
                    return (
                      <div className="grid grid-cols-3 gap-2">
                        {filteredPosts.map((post) => (
                          <PostItem key={post.id} post={post} onClick={handlePostClick} />
                        ))}
                      </div>
                    );
                  }

                  if (
                    profileUser?.visibility === "PRIVATE" &&
                    !isOwnProfile &&
                    !summary?.permissions.canViewPosts
                  ) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🔒</div>
                        <p className="text-(--textMinimal) text-lg font-medium mb-2">
                          Ce compte est privé
                        </p>
                        <p className="text-(--textNeutral) text-sm">
                          Suivez @{profileUser.username} pour voir ses
                          publications
                        </p>
                      </div>
                    );
                  }

                  // Affichage normal des posts
                  if (!posts) {
                    return (
                      <div className="flex justify-center py-8">
                        <div className="text-(--textMinimal)">
                          Chargement des posts...
                        </div>
                      </div>
                    );
                  }

                  if (filteredPosts.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-(--textMinimal)">
                          {activeFilter === "photos" &&
                            "Aucune photo à afficher"}
                          {activeFilter === "videos" &&
                            "Aucune vidéo à afficher"}
                          {activeFilter === "text" &&
                            "Aucun post texte à afficher"}
                          {activeFilter === "all" &&
                            (isOwnProfile
                              ? "Vous n'avez pas encore publié de contenu"
                              : "Aucun post à afficher")}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-3 gap-2">
                      {filteredPosts.map((post) => (
                        <PostItem key={post.id} post={post} onClick={handlePostClick} />
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Dialog pour afficher les détails du post */}
        <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-5xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-50">
            <DialogHeader className="hidden">
              <DialogTitle>Détails du post</DialogTitle>
              <DialogDescription>Affiche les détails du post sélectionné.</DialogDescription>
            </DialogHeader>
            <div className="flex h-[80vh] max-h-[83vh] w-full rounded-md overflow-hidden">
              {postDetailsLoading ? (
                <LoadingState />
              ) : postDetailsError ? (
                <ErrorState
                  error={
                    postDetailsError instanceof Error
                      ? postDetailsError.message
                      : String(postDetailsError)
                  }
                  onRetry={() => selectedPost && refreshPostDetails()}
                />
              ) : selectedPostDetails ? (
                <div className="flex w-full h-full">
                  <MediaSection post={selectedPostDetails} />
                  <div className="flex flex-col w-125 bg-(--bgLevel1) border-l border-(--detailMinimal)">
                    <PostHeader post={selectedPostDetails} />
                    <div
                      ref={contentRef}
                      className="flex-1 overflow-y-auto"
                    >
                      <CommentsSection
                        comments={selectedPostDetails.comments || []}
                      />
                    </div>
                    <PostFooter
                      postId={selectedPostDetails.id}
                      onCommentAdded={() => refreshPostDetails()}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PostProvider>
  );
}

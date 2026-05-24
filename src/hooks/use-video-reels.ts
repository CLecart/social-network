import { Post, PostSchema } from "@/lib/schemas/post";
import { useInfiniteApi } from "@/hooks/use-infinite-api";

const PAGE_SIZE = 10;

export function useVideoReels() {
    const getKey = (pageIndex: number, previousPageData: unknown) => {
        if (previousPageData && (previousPageData as any).length === 0) return null;
        return `/api/private/post/getVideoReels?skip=${pageIndex * PAGE_SIZE}&take=${PAGE_SIZE}`;
    };

    const { data, error, size, setSize, isLoading, isValidating, mutate } = useInfiniteApi<Post>({
        getKey: (index, prev) => getKey(index, prev as any),
        schema: PostSchema.array(),
        envelope: true,
    });

    const posts: Post[] = data ? data.flat() : [];
    const lastPage = data && data[data.length - 1];
    const isEmpty = !data || (data[0]?.length === 0);
    const isReachingEnd = isEmpty || (lastPage && lastPage.length < PAGE_SIZE) || false;
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

    const loadMore = () => {
        if (!isLoadingMore && !isReachingEnd) {
            setSize(size + 1);
        }
    };

    return {
        posts,
        error,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        loadMore,
        mutate,
    };
}

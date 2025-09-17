import { UserPrivateSchema } from "@/lib/schemas/user/private";
import { useApi } from "@/hooks/use-api";

export function useUserPrivate() {
  const { data, error, isLoading, refresh } = useApi({
    url: "/api/private/me",
    schema: UserPrivateSchema,
    envelope: true,
  });

  return {
    user: data,
    loading: isLoading,
    error,
    refetch: refresh,
  };
}

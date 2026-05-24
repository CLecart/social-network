'use client'

import { useApi } from '@/hooks/use-api'
import { UserPublic, UserPublicSchema } from '@/lib/schemas/user/public'

interface UseUserReturn {
  user: UserPublic | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useUser(): UseUserReturn {
  const { data, isLoading, error, refresh } = useApi<UserPublic>({
    url: '/api/private/user',
    schema: UserPublicSchema,
    envelope: true,
  })

  return {
    user: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refetch: refresh,
  }
}
/**
 * Hook pour récupérer un profil utilisateur (soi-même ou un autre utilisateur)
 */
interface UseUserProfileReturn {
    user: UserPublic | null
    loading: boolean
    error: string | null
    isOwnProfile: boolean
    refetch: () => void
}

// Unifie le profil public: soi-même (réutilise useUser) ou un autre utilisateur
export function useUserPublic(userIdFromParams?: string): UseUserProfileReturn {
  const { user: currentUser, loading: currentUserLoading } = useUser()

  const isOwn = !userIdFromParams || userIdFromParams === currentUser?.id

  const { data, isLoading, error, refresh } = useApi<UserPublic>({
    url: `/api/private/user/${userIdFromParams}`,
    schema: UserPublicSchema,
    envelope: true,
    // On ne fetch que si ce n'est PAS son propre profil et que l'utilisateur courant est connu
    enabled: !isOwn && !currentUserLoading && !!userIdFromParams,
    userId: currentUser?.id,
  })

  return {
    user: isOwn ? currentUser ?? null : data ?? null,
    loading: isOwn ? currentUserLoading : isLoading || currentUserLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    isOwnProfile: !!isOwn,
    refetch: refresh,
  }
}

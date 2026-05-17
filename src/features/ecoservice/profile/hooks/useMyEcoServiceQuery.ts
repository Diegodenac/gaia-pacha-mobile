import { useQuery } from '@tanstack/react-query';
import { enterprisesRepository } from '@/repositories/enterprises.repository';
import { useAuthStore } from '@/store/authStore';
import { CACHE_TIMES } from '@/constants';

/**
 * Hook: useMyEcoServiceQuery
 * Fetches the ecoservice owned by the currently authenticated user
 * via GET /api/enterprises/me. Disabled when no user is logged in.
 */
export function useMyEcoServiceQuery() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['my-ecoservice', userId],
    queryFn: () => enterprisesRepository.getMine(),
    enabled: !!userId,
    staleTime: CACHE_TIMES.MEDIUM,
    retry: 1,
  });
}

import { useQuery } from '@tanstack/react-query';
import { enterprisesRepository } from '@/repositories/enterprises.repository';
import { CACHE_TIMES } from '@/constants';

/**
 * Hook: useEcoServiceListQuery
 * Returns the flat list of all enterprises for the EcoService switcher.
 * Uses a generous page limit to avoid pagination in the switcher UI.
 */
export function useEcoServiceListQuery() {
  return useQuery({
    queryKey: ['enterprises-list-all'],
    queryFn: () => enterprisesRepository.getAll({ limit: 50 }),
    staleTime: CACHE_TIMES.LONG,
    select: (data) => data.enterprises,
  });
}

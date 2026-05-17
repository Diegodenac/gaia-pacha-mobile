import { useQuery } from '@tanstack/react-query';
import { categoriesRepository } from '@/repositories/enterprises.repository';
import { CACHE_TIMES } from '@/constants';

/**
 * Hook: useCategoriesQuery
 * Returns the list of category chips for the home screen, fetched from
 * GET /api/categories. Cached aggressively since categories rarely change.
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesRepository.getAll(),
    staleTime: CACHE_TIMES.LONG,
  });
}

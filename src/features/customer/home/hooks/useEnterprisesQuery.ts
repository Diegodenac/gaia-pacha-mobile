import { useInfiniteQuery } from '@tanstack/react-query';
import { enterprisesRepository, type EnterprisesFilters } from '@/repositories/enterprises.repository';
import { GREEN_ENTERPRISES } from '@/features/customer/home/mockData';

/**
 * Hook: useEnterprisesQuery
 *
 * Fetches paginated green enterprises from the backend WITHOUT search.
 * Search filtering happens client-side for instant, smooth search.
 * Only backend filtering: category (since it affects DB query).
 * Falls back to mock data as placeholder while loading.
 */
export function useEnterprisesQuery(filters: EnterprisesFilters = {}) {
  // Remove search from backend query - we'll filter client-side
  const backendFilters = {
    category: filters.category,
    // Don't pass search to backend
  };

  const query = useInfiniteQuery({
    queryKey: ['enterprises', { category: filters.category }],
    queryFn: ({ pageParam = 1 }) => 
      enterprisesRepository.getAll({ ...backendFilters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Flatten the pages array into a single array of enterprises
  const enterprises = query.data?.pages.flatMap((page) => page.enterprises) ?? GREEN_ENTERPRISES;
  const isFromBackend = query.isSuccess && query.data?.pages?.[0]?.enterprises !== undefined;

  return {
    ...query,
    enterprises,
    isFromBackend,
  };
}

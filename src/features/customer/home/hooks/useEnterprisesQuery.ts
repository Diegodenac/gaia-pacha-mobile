import { useInfiniteQuery } from '@tanstack/react-query';
import { enterprisesRepository, type EnterprisesFilters } from '@/repositories/enterprises.repository';
import { GREEN_ENTERPRISES } from '@/features/customer/home/mockData';

/**
 * Hook: useEnterprisesQuery
 *
 * Fetches paginated green enterprises from the local backend.
 * Falls back to mock data as placeholder while loading.
 */
export function useEnterprisesQuery(filters: EnterprisesFilters = {}) {
  const query = useInfiniteQuery({
    queryKey: ['enterprises', filters],
    queryFn: ({ pageParam = 1 }) => 
      enterprisesRepository.getAll({ ...filters, page: pageParam }),
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

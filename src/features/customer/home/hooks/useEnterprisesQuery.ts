import { useQuery } from '@tanstack/react-query';
import { enterprisesRepository, type EnterprisesFilters } from '@/repositories/enterprises.repository';

/**
 * Hook: useEnterprisesQuery
 * Fetches all enterprises for client-side filtering.
 * Returns dummy pagination props to avoid crashing legacy screens.
 */
export function useEnterprisesQuery(filters: EnterprisesFilters = {}) {
  const query = useQuery({
    queryKey: ['enterprises', 'all'],
    queryFn: () => enterprisesRepository.getAll({ limit: 1000 }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const enterprises = query.data?.enterprises ?? [];
  const isFromBackend = query.isSuccess;

  return {
    ...query,
    enterprises,
    isFromBackend,
    // Dummy pagination props to satisfy existing UI code
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}

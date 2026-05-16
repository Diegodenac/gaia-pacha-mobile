import { useQuery } from '@tanstack/react-query';
import { enterprisesRepository, type EnterprisesFilters } from '@/repositories/enterprises.repository';
import { GREEN_ENTERPRISES } from '@/features/customer/home/mockData';

/**
 * Hook: useEnterprisesQuery
 *
 * Fetches green enterprises from the local backend (which reads from PostgreSQL on Aiven).
 * Falls back to mock data as placeholder while loading or on network error.
 *
 * The `isFromBackend` flag lets the UI show whether data is real or mocked.
 */
export function useEnterprisesQuery(filters: EnterprisesFilters = {}) {
  const query = useQuery({
    queryKey:        ['enterprises', filters],
    queryFn:         () => enterprisesRepository.getAll(filters),
    staleTime:       1000 * 60 * 5,      // 5 minutes — avoid unnecessary refetches
    retry:           1,                   // one retry on failure, then show fallback
    placeholderData: GREEN_ENTERPRISES,   // show mock data instantly while loading
  });

  return {
    ...query,
    enterprises:   query.data ?? GREEN_ENTERPRISES,
    isFromBackend: query.isSuccess && !query.isPlaceholderData,
  };
}

import { useQuery, type InfiniteData } from '@tanstack/react-query';
import { enterprisesRepository, type PaginatedEnterprises } from '@/repositories/enterprises.repository';
import { queryClient } from '@/lib/queryClient';
import type { GreenEnterprise } from '@/features/customer/home/mockData';

/**
 * Hook: useEnterpriseDetailQuery
 *
 * Fetches a single enterprise by ID from the backend.
 * Uses the list cache as initialData so the screen renders instantly when
 * navigating from the home list (no loading spinner for cached enterprises).
 */
export function useEnterpriseDetailQuery(id: string) {
  return useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => enterprisesRepository.getById(id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!id,
    // Seed data from the list cache for instant navigation
    initialData: () => {
      const allQueries = queryClient.getQueriesData<InfiniteData<PaginatedEnterprises>>({ queryKey: ['enterprises'] });
      for (const [, data] of allQueries) {
        if (!data?.pages) continue;
        for (const page of data.pages) {
          const found = page.enterprises?.find((e) => e.id === id);
          if (found) return found;
        }
      }
      return undefined;
    },
    initialDataUpdatedAt: () => {
      const state = queryClient.getQueryState<InfiniteData<PaginatedEnterprises>>(['enterprises', {}]);
      return state?.dataUpdatedAt;
    },
  });
}

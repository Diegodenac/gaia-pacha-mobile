import { useQuery } from '@tanstack/react-query';
import { explorerRepository } from '@/repositories/explorer.repository';
import { QUERY_KEYS, CACHE_TIMES } from '@/constants';
import type { ExplorerFilters } from '@/types';

// ─── useExplorerFeedQuery ─────────────────────────────────────────────────────
/**
 * useExplorerFeedQuery — TanStack Query hook for the Explorer mixed feed.
 *
 * Layer: Feature Hook (Customer › Explorer)
 * Used by: ExplorerFeedOrganism (via app/(customer)/index.tsx)
 *
 * Cache Strategy:
 *  - staleTime: MEDIUM (10 min) — feed data doesn't need real-time freshness.
 *    Tab switches do NOT trigger a refetch; cached data is shown instantly.
 *  - placeholderData: previous data retained during filter changes — no blank flash.
 *
 * AI Hint: To add infinite scroll, replace useQuery with useInfiniteQuery
 * and pass `pageParam` to explorerRepository.getFeed({ page: pageParam }).
 * No other layer changes are required.
 *
 * @example
 * const { data = [], isLoading, error } = useExplorerFeedQuery({ search: 'solar' });
 */
export function useExplorerFeedQuery(filters: ExplorerFilters = {}) {
  return useQuery({
    queryKey:  QUERY_KEYS.explorerFeed(filters as Record<string, unknown>),
    queryFn:   () => explorerRepository.getFeed(filters),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime:    CACHE_TIMES.LONG,
    // Keeps previous data visible while new filter results are loading —
    // prevents the staggered grid from collapsing on each filter tap.
    placeholderData: (previousData) => previousData,
  });
}

import { QueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/constants';

/**
 * Global TanStack Query Client — singleton instance.
 *
 * Cache Policies:
 *  - staleTime:    Data is "fresh" for 10 min by default → no background refetch
 *  - gcTime:       Unused cache entries evicted after 30 min
 *  - retry:        2 automatic retries on network errors
 *  - refetchOnWindowFocus: disabled (mobile doesn't have window focus concept)
 *
 * AI Hint: Override staleTime/gcTime per-query using CACHE_TIMES constants
 * from src/constants/index.ts. Example:
 *   useQuery({ queryKey: [...], queryFn: ..., staleTime: CACHE_TIMES.SHORT })
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           CACHE_TIMES.MEDIUM,
      gcTime:              CACHE_TIMES.LONG,
      retry:               2,
      retryDelay:          (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false,
      refetchOnMount:      true,
    },
    mutations: {
      retry: 0,
    },
  },
});

import { useQuery } from '@tanstack/react-query';
import { catalogRepository, type CatalogFilters } from '@/repositories/catalog.repository';
import { QUERY_KEYS, CACHE_TIMES } from '@/constants';

// ─── useCatalogQuery ──────────────────────────────────────────────────────────
/**
 * Hook: useCatalogQuery
 * Layer: Feature hook (Customer > Catalog)
 *
 * Fetches paginated catalog products with optional filters.
 * TanStack Query caches results keyed by the exact filter object.
 *
 * AI Hint: Add `enabled: !!searchTerm` to prevent fetching on empty search.
 *
 * @example
 * const { data, isLoading, error } = useCatalogQuery({ category: 'recycling' });
 */
export function useCatalogQuery(filters: CatalogFilters = {}) {
  return useQuery({
    queryKey:  QUERY_KEYS.catalog(filters),
    queryFn:   () => catalogRepository.getProducts(filters),
    staleTime: CACHE_TIMES.MEDIUM,
    // Deduplicate parallel calls to the same filter set (automatic via TanStack Query)
    placeholderData: (prev) => prev, // keeps old data while refetching (UX: no loading flash)
  });
}

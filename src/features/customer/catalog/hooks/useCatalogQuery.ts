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
    queryKey:  QUERY_KEYS.catalog(filters as Record<string, unknown>),
    queryFn:   () => catalogRepository.getProducts(filters),
    staleTime: CACHE_TIMES.MEDIUM,
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook: useProductQuery
 *
 * Fetches a single product by ID.
 */
export function useProductQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.productDetail(id),
    queryFn: () => catalogRepository.getProductById(id),
    staleTime: CACHE_TIMES.MEDIUM,
    enabled: !!id,
  });
}

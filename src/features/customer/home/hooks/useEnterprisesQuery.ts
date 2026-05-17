import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { enterprisesRepository, type EnterprisesFilters } from '@/repositories/enterprises.repository';

/**
 * Hook: useEnterprisesQuery
 *
 * Fetches paginated green enterprises from the backend.
 * Server-side filters: search (LIKE on name/description), categoryId
 * (exact DB id, preferred), and the legacy `category` enum for older callers.
 * Callers should debounce the search input so we don't fire a DB query on
 * every keystroke.
 *
 * `keepPreviousData` keeps the current results on screen while a new search or
 * category fetch is in flight — no empty flash, no list remount stutter.
 */
export function useEnterprisesQuery(filters: EnterprisesFilters = {}) {
  const search = filters.search?.trim() ?? '';
  const categoryId = filters.categoryId ?? null;
  const category = filters.category ?? 'all';

  const query = useInfiniteQuery({
    queryKey: ['enterprises', { search, categoryId, category }],
    queryFn: ({ pageParam = 1 }) =>
      enterprisesRepository.getAll({ search, categoryId, category, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const enterprises = query.data?.pages.flatMap((page) => page.enterprises) ?? [];
  const isFromBackend = query.isSuccess;

  return {
    ...query,
    enterprises,
    isFromBackend,
  };
}

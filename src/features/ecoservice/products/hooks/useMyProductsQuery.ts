import { useMemo } from 'react';
import { useCatalogQuery } from '@/features/customer/catalog/hooks/useCatalogQuery';

/**
 * Hook: useMyProductsQuery
 * Returns products belonging to the current EcoService user.
 * Sends ecoServiceId as a query param and also filters client-side
 * to guard against backends that ignore the param.
 */
export function useMyProductsQuery(ecoServiceId: string) {
  const query = useCatalogQuery({ ecoServiceId });

  const myProducts = useMemo(() => {
    if (!query.data?.data) return [];
    return query.data.data.filter((p) => p.ecoServiceId === ecoServiceId);
  }, [query.data, ecoServiceId]);

  return { ...query, myProducts };
}

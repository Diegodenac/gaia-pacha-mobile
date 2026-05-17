import { useQuery } from '@tanstack/react-query';
import { productsRepository } from '@/repositories/products.repository';

export function useProductsQuery(enterpriseId: string) {
  return useQuery({
    queryKey: ['products', enterpriseId],
    queryFn: () => productsRepository.getByEnterprise(enterpriseId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!enterpriseId,
  });
}

import { useQuery } from '@tanstack/react-query';
import { ordersRepository } from '@/repositories/orders.repository';
import { useAuthStore } from '@/store/authStore';
import { QUERY_KEYS, CACHE_TIMES } from '@/constants';

// ─── useCustomerOrdersQuery ───────────────────────────────────────────────────
/**
 * Hook: useCustomerOrdersQuery
 * Layer: Feature hook (Customer > Orders)
 *
 * Fetches the authenticated customer's order history.
 * Auto-disabled when no user is authenticated.
 *
 * @example
 * const { data: ordersPage, isLoading } = useCustomerOrdersQuery();
 */
export function useCustomerOrdersQuery() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey:  QUERY_KEYS.customerOrders(userId ?? ''),
    queryFn:   () => ordersRepository.getCustomerOrders(userId!),
    enabled:   !!userId,
    staleTime: CACHE_TIMES.SHORT,
  });
}

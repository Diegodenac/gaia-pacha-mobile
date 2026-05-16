import { useQuery } from '@tanstack/react-query';
import { ordersRepository } from '@/repositories/orders.repository';
import { useAuthStore } from '@/store/authStore';
import { QUERY_KEYS, CACHE_TIMES } from '@/constants';

// ─── useServiceOrdersQuery ────────────────────────────────────────────────────
/**
 * Hook: useServiceOrdersQuery
 * Layer: Feature hook (EcoService > Orders)
 *
 * Fetches incoming orders for the authenticated EcoService business.
 *
 * @example
 * const { data: ordersPage, isLoading } = useServiceOrdersQuery();
 */
export function useServiceOrdersQuery() {
  const serviceId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey:        QUERY_KEYS.serviceOrders(serviceId ?? ''),
    queryFn:         () => ordersRepository.getServiceOrders(serviceId!),
    enabled:         !!serviceId,
    staleTime:       CACHE_TIMES.SHORT,
    refetchInterval: CACHE_TIMES.POLLING, // Poll every 30s for new incoming orders
  });
}

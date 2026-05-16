import { apiClient } from '@/lib/apiClient';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';

// ─── Orders Repository ────────────────────────────────────────────────────────
/**
 * Orders Repository — shared between Customer and EcoService profiles.
 *
 * AI Hint: Customer uses `getCustomerOrders` and `createOrder`.
 *          EcoService uses `getServiceOrders` and `updateOrderStatus`.
 *          Both profiles share this repository via different hooks.
 */
export const ordersRepository = {
  // ── Customer Actions ───────────────────────────────────────────────────────

  /**
   * GET /orders/customer/:customerId
   */
  getCustomerOrders: async (customerId: string): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<{ data: PaginatedResponse<Order> }>(
      `/orders/customer/${customerId}`,
    );
    return response.data.data;
  },

  /**
   * POST /orders
   * Creates a new order from the customer's cart.
   */
  createOrder: async (
    payload: Pick<Order, 'ecoServiceId' | 'items'>,
  ): Promise<Order> => {
    const response = await apiClient.post<{ data: Order }>('/orders', payload);
    return response.data.data;
  },

  // ── EcoService Actions ─────────────────────────────────────────────────────

  /**
   * GET /orders/service/:serviceId
   */
  getServiceOrders: async (serviceId: string): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<{ data: PaginatedResponse<Order> }>(
      `/orders/service/${serviceId}`,
    );
    return response.data.data;
  },

  /**
   * PATCH /orders/:orderId/status
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch<{ data: Order }>(
      `/orders/${orderId}/status`,
      { status },
    );
    return response.data.data;
  },
};

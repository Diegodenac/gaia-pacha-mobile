import { apiClient } from '@/lib/apiClient';
import type { Product, PaginatedResponse, EcoCategory } from '@/types';

// ─── Catalog Filters ──────────────────────────────────────────────────────────
export interface CatalogFilters {
  category?:  EcoCategory;
  search?:    string;
  page?:      number;
  perPage?:   number;
  sortBy?:    'price_asc' | 'price_desc' | 'rating' | 'newest';
  minPrice?:  number;
  maxPrice?:  number;
}

// ─── Catalog Repository ───────────────────────────────────────────────────────
/**
 * Catalog Repository — product and EcoService discovery endpoints.
 *
 * Used by: Customer feature only.
 * AI Hint: All filter combinations produce unique cache keys via QUERY_KEYS.catalog(filters).
 */
export const catalogRepository = {
  /**
   * GET /catalog/products
   * Returns paginated product listings with optional filters.
   */
  getProducts: async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<{ data: PaginatedResponse<Product> }>(
      '/catalog/products',
      { params: filters },
    );
    return response.data.data;
  },

  /**
   * GET /catalog/products/:id
   */
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{ data: Product }>(`/catalog/products/${id}`);
    return response.data.data;
  },

  /**
   * GET /catalog/featured
   * Returns featured/promoted services for the home screen.
   */
  getFeatured: async (): Promise<Product[]> => {
    const response = await apiClient.get<{ data: Product[] }>('/catalog/featured');
    return response.data.data;
  },
};

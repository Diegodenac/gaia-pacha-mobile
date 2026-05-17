import axios from 'axios';
import { apiClient } from '@/lib/apiClient';
import type { Product, PaginatedResponse, EcoCategory } from '@/types';

const BACKEND_URL = 'https://gaia-pacha-backend.onrender.com';

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
function mapProduct(row: any): Product {
  return {
    id: String(row.id_producto),
    name: row.nombre_producto,
    description: row.descripcion_producto,
    price: parseFloat(row.precio || '0'),
    currency: 'Bs.',
    imageUrls: [row.foto_producto_url].filter(Boolean),
    ecoServiceId: String(row.id_ecoservice),
    category: 'other', // Placeholder
    categoryName: row.nombre_categoria,
    enterpriseName: row.nombre_emprendimiento,
    stockQuantity: 10,
    isAvailable: row.disponible,
    tags: [],
    createdAt: row.fecha_creacion || new Date().toISOString(),
  };
}

export const catalogRepository = {
  /**
   * GET /api/products
   * Returns product listings. Backend currently returns a flat list.
   */
  getProducts: async (filters: CatalogFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await axios.get<{ data: any[], count: number }>(
      `${BACKEND_URL}/api/products`,
      { params: filters },
    );
    const products = response.data.data.map(mapProduct);
    return {
      data: products,
      total: response.data.count,
      page: 1,
      perPage: response.data.count,
      hasMore: false,
    };
  },

  /**
   * GET /api/products/:id (Polyfill locally by filtering all)
   */
  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get<{ data: any[] }>(`${BACKEND_URL}/api/products`);
    const row = response.data.data.find((p: any) => String(p.id_producto) === id);
    if (!row) throw new Error('Producto no encontrado');
    return mapProduct(row);
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

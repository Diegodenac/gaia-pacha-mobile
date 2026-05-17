import axios from 'axios';
import { apiClient } from '@/lib/apiClient';
import { GREEN_ENTERPRISES } from '@/features/customer/home/mockData';
import type { GreenEnterprise } from '@/features/customer/home/mockData';
import type { EcoCategory, CreateEnterprisePayload } from '@/types';

// ── Backend URL ───────────────────────────────────────────────────────────────
const BACKEND_URL = 'https://gaia-pacha-backend.onrender.com';

// ── Mock fallback enrichment ──────────────────────────────────────────────────
/**
 * Fills in any fields that are missing/empty in the real DB row
 * with values from the mock dataset. This prevents broken card designs
 * when the DB doesn't yet have greenSignals, impactBadges, etc.
 */
function enrichWithMockFallback(
  enterprise: GreenEnterprise,
  index: number,
): GreenEnterprise {
  const mock = GREEN_ENTERPRISES[index % GREEN_ENTERPRISES.length];
  return {
    ...enterprise,
    // Keep real data if present, otherwise use mock
    categoryLabel: enterprise.categoryLabel || mock.categoryLabel,
    imageUrl: enterprise.imageUrl || mock.imageUrl,
    logoUrl: enterprise.logoUrl || mock.logoUrl,
    impactSummary: enterprise.impactSummary || mock.impactSummary,
    greenSignals: enterprise.greenSignals?.length ? enterprise.greenSignals : mock.greenSignals,
    impactBadges: enterprise.impactBadges?.length ? enterprise.impactBadges : mock.impactBadges,
    keywords: enterprise.keywords?.length ? enterprise.keywords : mock.keywords,
  };
}

// ── Repository ────────────────────────────────────────────────────────────────
export interface EnterprisesFilters {
  category?: 'all' | EcoCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BackendResponse {
  success: boolean;
  data: GreenEnterprise[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
  table?: string;
  count?: number;
  error?: string;
}

export interface PaginatedEnterprises {
  enterprises: GreenEnterprise[];
  nextPage: number | null;
}

export const enterprisesRepository = {
  /**
   * Creates a new enterprise (EcoService registration).
   * Requires authenticated user via apiClient bearer token.
   */
  create: async (payload: CreateEnterprisePayload) => {
    const response = await apiClient.post('/api/enterprises', payload);
    return response.data;
  },


  /**
   * Fetches paginated enterprises from the backend.
   * Enriches missing visual fields from mock data so cards always look complete.
   */
  getAll: async (filters: EnterprisesFilters = {}): Promise<PaginatedEnterprises> => {
    const params: Record<string, string | number> = {};
    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }
    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    // Pagination params
    params.page = filters.page || 1;
    params.limit = filters.limit || 10;

    const response = await axios.get<BackendResponse>(
      `${BACKEND_URL}/api/enterprises`,
      { params, timeout: 8000 },
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error(response.data.error ?? 'Invalid response from backend');
    }

    const enterprises = response.data.data.map((enterprise, i) =>
      enrichWithMockFallback(enterprise, i),
    );

    const hasMore = response.data.pagination?.hasMore ?? false;
    const nextPage = hasMore ? (filters.page || 1) + 1 : null;

    return {
      enterprises,
      nextPage,
    };
  },

  /**
   * Fetches a single enterprise by ID.
   * Enriches missing visual fields from mock data.
   */
  getById: async (id: string): Promise<GreenEnterprise> => {
    const response = await axios.get<{ success: boolean; data: GreenEnterprise; error?: string }>(
      `${BACKEND_URL}/api/enterprises/${id}`,
      { timeout: 8000 },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error ?? 'Enterprise not found');
    }

    const enterprise = response.data.data;
    const fallbackIdx = GREEN_ENTERPRISES.findIndex(e => e.category === enterprise.category);
    return enrichWithMockFallback(enterprise, fallbackIdx >= 0 ? fallbackIdx : 0);
  },
};

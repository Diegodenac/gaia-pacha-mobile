import { catalogRepository } from '@/repositories/catalog.repository';
import type { ExplorerItem, ExplorerFilters, ExplorerItemType, Product } from '@/types';

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Derives a CO2 reduction label from the product's sustainability score.
 * Falls back to a tier-based estimate when no score is provided.
 */
function deriveCo2Label(sustainabilityScore?: number): string {
  if (sustainabilityScore !== undefined) {
    const reduction = Math.max(5, Math.round(sustainabilityScore * 0.45));
    return `CO2 -${reduction}%`;
  }
  return 'CO2 -15%';
}

/**
 * Maps a single Product to the unified ExplorerItem shape.
 *
 * @param product - source Product entity from catalog
 * @param index   - position in the list; used to alternate type labels for demo
 */
function mapProductToExplorerItem(product: Product, index: number): ExplorerItem {
  // Alternate type: even = 'product', odd = 'ecoservice' for a balanced demo mix.
  // The real /explorer/feed endpoint will provide the `type` field directly.
  const type: ExplorerItemType = index % 2 === 0 ? 'product' : 'ecoservice';

  const imageUrl =
    (product.imageUrls.length > 0 ? product.imageUrls[0] : undefined) ??
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';

  const location = product.tags.length > 0 ? `Bolivia · ${product.tags[0]}` : 'Bolivia';

  return {
    id:          product.id,
    type,
    title:       product.name,
    imageUrl,
    location,
    co2Reduction: deriveCo2Label(product.sustainabilityScore),
    priceLabel:  type === 'product' ? `${product.currency} ${product.price}` : undefined,
    ecoCategory: product.category,
    isVerified:  false,
    rawProduct:  product,
  };
}

/**
 * Applies client-side filter logic to normalised ExplorerItems.
 * This is the MVP approach — server-side filtering replaces this
 * when /explorer/feed is implemented.
 */
function applyClientFilters(
  items: ExplorerItem[],
  filters: ExplorerFilters,
): ExplorerItem[] {
  let result = [...items];

  // Text search — match against title
  if (filters.search && filters.search.trim().length > 0) {
    const term = filters.search.toLowerCase();
    result = result.filter((item) => item.title.toLowerCase().includes(term));
  }

  // Type filter
  if (filters.type && filters.type !== 'all') {
    result = result.filter((item) => item.type === filters.type);
  }

  // Carbon focus — only items that have a CO2 label with ≥20% reduction
  if (filters.carbonFocus) {
    result = result.filter((item) => {
      if (!item.co2Reduction) return false;
      const match = item.co2Reduction.match(/(\d+)/);
      return match !== null && parseInt(match[1], 10) >= 20;
    });
  }

  // Price sort — lowest price first (product items only; ecoservice items float to end)
  if (filters.priceSort) {
    result.sort((a, b) => {
      const priceA = a.rawProduct?.price ?? Infinity;
      const priceB = b.rawProduct?.price ?? Infinity;
      return priceA - priceB;
    });
  }

  return result;
}

// ─── Explorer Repository ──────────────────────────────────────────────────────
/**
 * Explorer Repository — mixed EcoServices + Products feed.
 *
 * Layer: Repository (Data)
 * Used by: useExplorerFeedQuery (Customer › Explorer feature hook)
 *
 * AI Hint: This is an MVP normaliser. When /explorer/feed is ready:
 *  1. Replace the body of `getFeed` with a single apiClient.get('/explorer/feed') call.
 *  2. Map the response directly — `ExplorerItem` shape is already API-compatible.
 *  3. Remove `applyClientFilters` and pass `filters` as query params instead.
 *  The hook and all UI components require ZERO changes.
 *
 * @example
 * const items = await explorerRepository.getFeed({ search: 'solar', type: 'ecoservice' });
 */
export const explorerRepository = {
  /**
   * Returns a normalised, interleaved mix of Products and (mock) EcoService items.
   *
   * MVP Strategy:
   *  - Calls catalogRepository.getProducts for the paginated main set.
   *  - Calls catalogRepository.getFeatured for a promoted top set.
   *  - Deduplicates by id.
   *  - Alternates type labels to simulate a balanced mix.
   *  - Applies client-side filtering for search / type / carbon / price.
   */
  getFeed: async (filters: ExplorerFilters = {}): Promise<ExplorerItem[]> => {
    const [paginatedResult, featuredProducts] = await Promise.all([
      catalogRepository.getProducts({
        page:    filters.page    ?? 1,
        perPage: filters.perPage ?? 20,
      }),
      catalogRepository.getFeatured(),
    ]);

    // Merge & deduplicate: featured items come first for prominence
    const seenIds = new Set<string>();
    const merged: Product[] = [];

    for (const p of [...featuredProducts, ...paginatedResult.data]) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        merged.push(p);
      }
    }

    // Normalise to ExplorerItem[]
    const normalised = merged.map((p, i) => mapProductToExplorerItem(p, i));

    // Apply client-side filters for the MVP
    return applyClientFilters(normalised, filters);
  },
};

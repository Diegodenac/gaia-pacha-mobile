import { useState, useMemo, useCallback } from 'react';
import { SafeAreaView, Alert, Share, StyleSheet } from 'react-native';
import { useExplorerFeedQuery } from '@/features/customer/explorer/hooks/useExplorerFeedQuery';
import { ExplorerFeedOrganism } from '@organisms/ExplorerFeedOrganism';
import { FilterBarOrganism } from '@organisms/FilterBarOrganism';
import { SearchBar } from '@molecules/SearchBar';
import type { ExplorerFilter, ExplorerFilters, ExplorerItem } from '@/types';

/**
 * CustomerHomeScreen — Explorer Tab (Customer Home)
 *
 * This is a thin composition screen. It owns:
 *  - UI state: searchTerm + activeFilter
 *  - Derived query filters (memoised)
 *  - Quick-action handlers (Save, Share, QuickView)
 *
 * All rendering is delegated to:
 *  - ExplorerFeedOrganism — staggered grid
 *  - FilterBarOrganism    — horizontal filter pills
 *  - SearchBar            — browser-style search input
 *
 * Data flows:
 *  useExplorerFeedQuery → explorerRepository.getFeed → catalogRepository
 *
 * AI Hint: To add detail navigation, replace the Alert in handlePress with
 * router.push({ pathname: '/(customer)/detail', params: { id: item.id } })
 * after creating app/(customer)/detail.tsx.
 */
export default function CustomerHomeScreen() {
  // ── UI State ───────────────────────────────────────────────────────────────
  const [searchTerm,   setSearchTerm]   = useState('');
  const [activeFilter, setActiveFilter] = useState<ExplorerFilter>('all');

  // ── Derived Query Filters (memoised — prevents unnecessary hook re-executions) ──
  const filters = useMemo<ExplorerFilters>(() => ({
    search:      searchTerm.trim() || undefined,
    type:        activeFilter === 'products'    ? 'product'    :
                 activeFilter === 'ecoservices' ? 'ecoservice' : 'all',
    carbonFocus: activeFilter === 'carbon',
    priceSort:   activeFilter === 'price',
    region:      activeFilter === 'near_me' ? 'bolivia' : undefined,
  }), [searchTerm, activeFilter]);

  // ── Server State ───────────────────────────────────────────────────────────
  const { data: items = [], isLoading } = useExplorerFeedQuery(filters);

  // ── Quick-Action Handlers ──────────────────────────────────────────────────
  const handlePress = useCallback((_item: ExplorerItem) => {
    // TODO: useRouter().push('/(customer)/detail') after detail screen is created
  }, []);

  const handleSave = useCallback((item: ExplorerItem) => {
    // TODO: persist to local wishlist / backend
    Alert.alert('Saved ✓', `"${item.title}" added to your saved items.`);
  }, []);

  const handleShare = useCallback((item: ExplorerItem) => {
    // Fire-and-forget: Share API is async but the organism prop is sync
    void Share.share({
      message: `🌿 Check out "${item.title}" on Gaia Pacha! gaiapacha://`,
      title:   item.title,
    });
  }, []);

  const handleQuickView = useCallback((item: ExplorerItem) => {
    // TODO: open a bottom-sheet modal with item details
    Alert.alert(item.title, `Type: ${item.type}\n${item.co2Reduction ?? ''}`);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.screen}>
      <ExplorerFeedOrganism
        items={items}
        isLoading={isLoading}
        ListHeaderComponent={
          <>
            <SearchBar onSearch={setSearchTerm} />
            <FilterBarOrganism
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </>
        }
        onPress={handlePress}
        onSave={handleSave}
        onShare={handleShare}
        onQuickView={handleQuickView}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: '#191616',
  },
});

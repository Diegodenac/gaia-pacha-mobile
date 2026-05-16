import { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ExplorerCard } from '@molecules/ExplorerCard';
import type { ExplorerItem } from '@/types';

// ─── ExplorerFeedOrganism ─────────────────────────────────────────────────────
/**
 * ExplorerFeedOrganism — staggered two-column Pinterest-style feed.
 *
 * Layer: Organism (manages column-split computation; calls no feature hooks)
 * Used by: app/(customer)/index.tsx
 *
 * Layout Algorithm:
 *  - Items at even indices → LEFT column (height: 220)
 *  - Items at odd  indices → RIGHT column (height: 185)
 *  - Columns rendered side-by-side in a flex-row ScrollView
 *  - Split is memoised — only recalculates when `items` reference changes
 *
 * Performance:
 *  - ScrollView retains position on tab switch (Expo Router default)
 *  - No unnecessary re-renders: callbacks are passed through, not created here
 *
 * AI Hint: To upgrade to infinite scroll, wrap this organism with an
 * InfiniteScroll container in the screen and pass paginated items.
 * This organism is unaware of pagination.
 *
 * @example
 * <ExplorerFeedOrganism
 *   items={feedItems}
 *   isLoading={isLoading}
 *   ListHeaderComponent={<><SearchBar /><FilterBarOrganism /></>}
 *   onPress={(item) => router.push('/detail')}
 *   onSave={(item) => handleSave(item)}
 *   onShare={(item) => handleShare(item)}
 *   onQuickView={(item) => setQuickViewItem(item)}
 * />
 */

// Column heights for the stagger effect
const HEIGHT_LEFT  = 220;
const HEIGHT_RIGHT = 185;

interface ExplorerFeedOrganismProps {
  items:                 ExplorerItem[];
  isLoading:             boolean;
  ListHeaderComponent?:  React.ReactNode;
  onPress:               (item: ExplorerItem) => void;
  onSave:                (item: ExplorerItem) => void;
  onShare:               (item: ExplorerItem) => void;
  onQuickView:           (item: ExplorerItem) => void;
}

// ─── Skeleton placeholder ─────────────────────────────────────────────────────
function SkeletonCard({ height }: { height: number }) {
  return (
    <View style={[styles.skeleton, { height }]} />
  );
}

export function ExplorerFeedOrganism({
  items,
  isLoading,
  ListHeaderComponent,
  onPress,
  onSave,
  onShare,
  onQuickView,
}: ExplorerFeedOrganismProps) {
  // Split items into two columns — memoised for performance
  const { leftColumn, rightColumn } = useMemo(() => {
    const left:  ExplorerItem[] = [];
    const right: ExplorerItem[] = [];
    items.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else                  right.push(item);
    });
    return { leftColumn: left, rightColumn: right };
  }, [items]);

  // ── Skeleton Loading State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {ListHeaderComponent}
        <View style={styles.columnsRow}>
          <View style={styles.column}>
            <SkeletonCard height={HEIGHT_LEFT}  />
            <SkeletonCard height={HEIGHT_RIGHT} />
            <SkeletonCard height={HEIGHT_LEFT}  />
          </View>
          <View style={styles.columnGap} />
          <View style={styles.column}>
            <SkeletonCard height={HEIGHT_RIGHT} />
            <SkeletonCard height={HEIGHT_LEFT}  />
            <SkeletonCard height={HEIGHT_RIGHT} />
          </View>
        </View>
        <View style={styles.loadingIndicator}>
          <ActivityIndicator color="#74A643" />
        </View>
      </ScrollView>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  if (!isLoading && items.length === 0) {
    return (
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
        {ListHeaderComponent}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌿</Text>
          <Text style={styles.emptyTitle}>Nothing found</Text>
          <Text style={styles.emptySubtitle}>
            Try a different search term or filter
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ── Feed ──────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {ListHeaderComponent}

      <View style={styles.columnsRow}>
        {/* Left column — even indices */}
        <View style={styles.column}>
          {leftColumn.map((item) => (
            <ExplorerCard
              key={item.id}
              item={item}
              height={HEIGHT_LEFT}
              onPress={() => onPress(item)}
              onSave={() => onSave(item)}
              onShare={() => onShare(item)}
              onQuickView={() => onQuickView(item)}
            />
          ))}
        </View>

        <View style={styles.columnGap} />

        {/* Right column — odd indices */}
        <View style={styles.column}>
          {rightColumn.map((item) => (
            <ExplorerCard
              key={item.id}
              item={item}
              height={HEIGHT_RIGHT}
              onPress={() => onPress(item)}
              onSave={() => onSave(item)}
              onShare={() => onShare(item)}
              onQuickView={() => onQuickView(item)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  columnsRow: {
    flexDirection:   'row',
    paddingHorizontal: 12,
  },
  column: {
    flex: 1,
  },
  columnGap: {
    width: 8,
  },
  skeleton: {
    backgroundColor: '#2a2a2a',
    borderRadius:    14,
    marginBottom:    10,
  },
  loadingIndicator: {
    paddingVertical: 20,
    alignItems:      'center',
  },
  emptyState: {
    flex:            1,
    alignItems:      'center',
    paddingTop:      80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize:    48,
    marginBottom: 16,
  },
  emptyTitle: {
    color:       '#FFFFFF',
    fontSize:    18,
    fontFamily:  'Inter_600SemiBold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color:      '#9E9E9E',
    fontSize:   14,
    fontFamily: 'Inter_400Regular',
    textAlign:  'center',
  },
});

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@atoms/Badge';
import type { ExplorerItem } from '@/types';

// ─── ExplorerCard Molecule ────────────────────────────────────────────────────
/**
 * ExplorerCard — rich card for the Explorer staggered feed.
 *
 * Layer: Molecule (Image + Badge atom + TouchableOpacity composed)
 * Used by: ExplorerFeedOrganism
 *
 * Design Tokens applied:
 *  - Card surface:   #333333 (explorerSurface)
 *  - High emphasis:  #FFFFFF (title text)
 *  - Medium emphasis:#9E9E9E (location, meta)
 *  - Green accent:   #74A643 (eco badge, CO2)
 *  - Dark green:     #3A5B13 (CO2 badge bg)
 *
 * Quick Actions (image overlay):
 *  - Save    → bookmark-outline
 *  - Share   → share-outline
 *  - QuickView → eye-outline
 *
 * AI Hint: `height` is passed from ExplorerFeedOrganism to create the
 * stagger effect. Do NOT hardcode a fixed height here.
 *
 * @example
 * <ExplorerCard
 *   item={explorerItem}
 *   height={220}
 *   onPress={() => router.push('/detail')}
 *   onSave={() => handleSave(item)}
 *   onShare={() => handleShare(item)}
 *   onQuickView={() => handleQuickView(item)}
 * />
 */

interface ExplorerCardProps {
  item:        ExplorerItem;
  height:      number;
  onPress:     () => void;
  onSave:      () => void;
  onShare:     () => void;
  onQuickView: () => void;
}

export function ExplorerCard({
  item,
  height,
  onPress,
  onSave,
  onShare,
  onQuickView,
}: ExplorerCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${item.type === 'ecoservice' ? 'EcoService' : 'Product'}: ${item.title}`}
    >
      {/* ── Image + Quick-Action Overlay ─── */}
      <View style={{ height, overflow: 'hidden', borderRadius: 14 }}>
        <Image
          source={{ uri: item.imageUrl }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
          accessibilityLabel={item.title}
        />

        {/* Gradient-like overlay at bottom for quick actions */}
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onSave}
            accessibilityLabel="Save"
            accessibilityRole="button"
          >
            <Ionicons name="bookmark-outline" size={15} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onShare}
            accessibilityLabel="Share"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={15} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onQuickView}
            accessibilityLabel="Quick view"
            accessibilityRole="button"
          >
            <Ionicons name="eye-outline" size={15} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Verified badge — floats top-right on image */}
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <Badge variant="verified" />
          </View>
        )}
      </View>

      {/* ── Card Content ─── */}
      <View style={styles.content}>
        {/* Type distinction badge */}
        <Badge variant={item.type === 'ecoservice' ? 'eco' : 'product'} />

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Location row */}
        {item.location !== undefined && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color="#9E9E9E" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        )}

        {/* CO2 Impact badge */}
        {item.co2Reduction !== undefined && (
          <View style={styles.co2Row}>
            <Badge variant="co2" label={item.co2Reduction} />
          </View>
        )}

        {/* Price label — products only */}
        {item.type === 'product' && item.priceLabel !== undefined && (
          <Text style={styles.price}>{item.priceLabel}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333333',
    borderRadius:    14,
    marginBottom:    10,
    overflow:        'hidden',
  },
  overlay: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    flexDirection:   'row',
    justifyContent:  'flex-end',
    alignItems:      'center',
    paddingVertical:   6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  actionBtn: {
    padding:      6,
    marginLeft:   4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  verifiedBadge: {
    position: 'absolute',
    top:   8,
    right: 8,
  },
  content: {
    padding: 10,
  },
  title: {
    color:       '#FFFFFF',
    fontSize:    13,
    fontFamily:  'Inter_600SemiBold',
    marginTop:   6,
    lineHeight:  18,
  },
  locationRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginTop:       4,
  },
  locationText: {
    color:      '#9E9E9E',
    fontSize:   10,
    fontFamily: 'Inter_400Regular',
    marginLeft:  3,
    flex:        1,
  },
  co2Row: {
    marginTop: 6,
  },
  price: {
    color:      '#4ade80',
    fontSize:   12,
    fontFamily: 'Inter_600SemiBold',
    marginTop:   6,
  },
});

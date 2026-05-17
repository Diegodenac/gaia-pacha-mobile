import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEcoServiceStore } from '@/store/ecoServiceStore';
import { useMyProductsQuery } from '@/features/ecoservice/products/hooks/useMyProductsQuery';
import type { Product } from '@/types';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 40 - CARD_MARGIN) / 2;

export default function EcoServiceProductsScreen() {
  const { user } = useAuthStore();
  const { activeEcoServiceId } = useEcoServiceStore();
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Prefer the switcher selection; fall back to the authenticated user's own ID
  const ecoServiceId = activeEcoServiceId ?? user?.id ?? '';
  const { myProducts, isLoading } = useMyProductsQuery(ecoServiceId);

  const categories = useMemo(() => {
    const cats = new Set(myProducts.map((p) => p.categoryName).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, [myProducts]);

  const filtered = useMemo(() => {
    return myProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchInput.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.categoryName === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [myProducts, searchInput, activeCategory]);

  const renderHeader = () => (
    <View style={s.headerContainer}>
      <View style={s.titleRow}>
        <Text style={s.pageTitle}>Mis Productos</Text>
        {/* Add Product CTA — UI only, functionality disabled for this iteration */}
        <Pressable style={s.addBtn} disabled>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.addBtnText}>Agregar</Text>
        </Pressable>
      </View>

      <View style={s.searchWrap}>
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar en mis productos..."
            placeholderTextColor="#9CA3AF"
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <Pressable onPress={() => setSearchInput('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {categories.length > 1 && (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chips}
          renderItem={({ item: cat }) => {
            const active = activeCategory === cat;
            return (
              <Pressable
                onPress={() => setActiveCategory(cat)}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {cat === 'all' ? 'Todos' : cat}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <Link href={{ pathname: '/(customer)/producto/[id]', params: { id: item.id } }} asChild>
      <Pressable style={s.card}>
        <View style={s.imageContainer}>
          <Image
            source={{ uri: item.imageUrls[0] || 'https://via.placeholder.com/150' }}
            style={s.productImage}
            contentFit="cover"
            transition={300}
          />
          <View style={s.priceBubble}>
            <Text style={s.priceText}>{item.currency} {item.price}</Text>
          </View>
          {!item.isAvailable && (
            <View style={s.unavailableBadge}>
              <Text style={s.unavailableText}>No disponible</Text>
            </View>
          )}
        </View>
        <View style={s.cardContent}>
          <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
          {item.categoryName ? (
            <Text style={s.categoryName} numberOfLines={1}>{item.categoryName}</Text>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      );
    }
    return (
      <View style={s.empty}>
        <View style={s.emptyIcon}>
          <Ionicons name="cube-outline" size={40} color="#9CA3AF" />
        </View>
        <Text style={s.emptyTitle}>Sin productos</Text>
        <Text style={s.emptySubtitle}>
          Aún no tienes productos registrados en la plataforma.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={s.columnWrapper}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0FDF4' },
  headerContainer: { paddingTop: 16, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#064E3B' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#9CA3AF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  searchWrap: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  chips: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#BBF7D0' },
  chipActive: { backgroundColor: '#064E3B', borderColor: '#064E3B' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#fff' },
  listContent: { paddingBottom: 40 },
  columnWrapper: { paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: CARD_MARGIN * 2 },
  card: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  imageContainer: { position: 'relative', width: '100%', height: CARD_WIDTH },
  productImage: { width: '100%', height: '100%' },
  priceBubble: { position: 'absolute', bottom: 8, left: 8, backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priceText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  unavailableBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  unavailableText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardContent: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2, lineHeight: 18 },
  categoryName: { fontSize: 12, color: '#6B7280' },
  empty: { alignItems: 'center', paddingVertical: 64, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});

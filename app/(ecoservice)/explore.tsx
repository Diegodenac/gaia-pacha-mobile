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
import { useCatalogQuery } from '@/features/customer/catalog/hooks/useCatalogQuery';
import type { Product } from '@/types';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 40 - CARD_MARGIN) / 2;

export default function EcoServiceExploreScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { data, isLoading } = useCatalogQuery();

  const products = data?.data || [];

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoryName).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (p.enterpriseName && p.enterpriseName.toLowerCase().includes(searchInput.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || p.categoryName === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchInput, activeCategory]);

  const renderHeader = () => (
    <View style={s.headerContainer}>
      <Text style={s.pageTitle}>Catálogo de Productos</Text>

      <View style={s.searchWrap}>
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar productos, emprendimientos..."
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
        </View>
        <View style={s.cardContent}>
          <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={s.enterpriseName} numberOfLines={1}>{item.enterpriseName}</Text>
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
        <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
        <Text style={s.emptyText}>No se encontraron productos.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
      <FlatList
        data={filteredProducts}
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
  root:            { flex: 1, backgroundColor: '#F0FDF4' },
  headerContainer: { paddingTop: 16, paddingBottom: 8 },
  pageTitle:       { fontSize: 24, fontWeight: '800', color: '#064E3B', paddingHorizontal: 20, marginBottom: 12 },
  searchWrap:      { paddingHorizontal: 20, marginBottom: 12 },
  searchBox:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  searchInput:     { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  chips:           { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  chip:            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#BBF7D0' },
  chipActive:      { backgroundColor: '#064E3B', borderColor: '#064E3B' },
  chipText:        { fontSize: 13, fontWeight: '600', color: '#374151' },
  chipTextActive:  { color: '#fff' },
  listContent:     { paddingBottom: 40 },
  columnWrapper:   { paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: CARD_MARGIN * 2 },
  card:            { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  imageContainer:  { position: 'relative', width: '100%', height: CARD_WIDTH },
  productImage:    { width: '100%', height: '100%' },
  priceBubble:     { position: 'absolute', bottom: 8, left: 8, backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priceText:       { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  cardContent:     { padding: 10 },
  productName:     { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4, lineHeight: 18 },
  enterpriseName:  { fontSize: 12, color: '#6B7280' },
  empty:           { alignItems: 'center', paddingTop: 60 },
  emptyText:       { marginTop: 12, fontSize: 16, color: '#6B7280' },
});

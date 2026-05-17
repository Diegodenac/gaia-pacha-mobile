import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ImpactServiceCard } from '@molecules/ImpactServiceCard';
import { useEnterprisesQuery } from '@/features/customer/home/hooks/useEnterprisesQuery';

const LOGO_URI =
  'https://gaiapacha.org/wp-content/uploads/2023/07/Portada-FGP-1-1024x341.png';

const IMPACT_STATS = [
  { icon: 'business-outline' as const, value: '50+', label: 'Empresas\nverdes' },
  { icon: 'leaf-outline' as const, value: '12T', label: 'CO₂\nevitado' },
  { icon: 'people-outline' as const, value: '15', label: 'Comunidades\nimpactadas' },
];

export default function CustomerHomeScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const {
    enterprises,
    isLoading,
    isFetching,
    isError,
    isFromBackend,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEnterprisesQuery();

  const categories = useMemo(() => {
    const cats = new Set(enterprises.map((e) => e.categoryLabel).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, [enterprises]);

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchInput.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || e.categoryLabel === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [enterprises, searchInput, activeCategory]);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      <FlatList
        data={filteredEnterprises}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => <ImpactServiceCard enterprise={item} />}
        contentContainerStyle={[s.scroll, { paddingHorizontal: 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <HomeHeader
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryPress={setActiveCategory}
            resultsCount={filteredEnterprises.length}
            isFetching={isFetching}
            isFromBackend={isFromBackend}
            isError={isError}
          />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="leaf-outline" size={40} color="#6EE7B7" />
              </View>
              <Text style={s.emptyTitle}>Sin resultados</Text>
              <Text style={s.emptySubtitle}>
                Intenta con otra categoría o palabra clave
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

// ── Header (memoized so the search input never remounts) ──────────────────────
interface HomeHeaderProps {
  searchInput: string;
  onSearchChange: (v: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryPress: (category: string) => void;
  resultsCount: number;
  isFetching: boolean;
  isFromBackend: boolean;
  isError: boolean;
}

const HomeHeader = React.memo(function HomeHeader({
  searchInput,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryPress,
  resultsCount,
  isFetching,
  isFromBackend,
  isError,
}: HomeHeaderProps) {
  return (
    <View>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <View style={s.hero}>
        <View style={s.ring1} />
        <View style={s.ring2} />
        <View style={s.ring3} />
        <View style={s.ring4} />

        <SafeAreaView edges={['top']} style={s.heroContent}>
          <View style={s.logoCardOuter}>
            <View style={s.logoCard}>
              <Image
                source={{ uri: LOGO_URI }}
                style={s.logoImg}
                contentFit="contain"
                transition={500}
              />
            </View>
          </View>

          <Text style={s.tagline}>
            Conectando soluciones verdes{'\n'}con quienes las necesitan
          </Text>

          <View style={s.heroDivider} />

          <View style={s.statsRow}>
            {IMPACT_STATS.map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={s.statSep} />}
                <View style={s.statItem}>
                  <Ionicons name={stat.icon} size={20} color="#6EE7B7" />
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </SafeAreaView>

        <View style={s.heroWave} />
      </View>

      {/* ── SEARCH ────────────────────────────────────────────── */}
      <View style={s.searchWrap}>
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar emprendimientos verdes..."
            placeholderTextColor="#9CA3AF"
            value={searchInput}
            onChangeText={onSearchChange}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchInput.length > 0 && (
            <Pressable onPress={() => onSearchChange('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── CHIPS ─────────────────────────────────────────────── */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chips}
        renderItem={({ item: catName }) => {
          const active = activeCategory === catName;
          const label = catName === 'all' ? 'Todas' : catName;
          return (
            <Pressable
              onPress={() => onCategoryPress(catName)}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* ── RESULTS ───────────────────────────────────────────── */}
      {/*<View style={s.results}>
        <View style={s.resultsHeader}>
          <View style={s.resultsRight}>
            {isFetching && (
              <ActivityIndicator
                size="small"
                color="#059669"
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>

         <View style={[s.sourceBadge, isFromBackend ? s.sourceLive : s.sourceMock]}>
          <Ionicons
            name={isFromBackend ? 'cloud-done-outline' : 'server-outline'}
            size={11}
            color={isFromBackend ? '#059669' : '#9CA3AF'}
          />
          <Text style={[s.sourceText, isFromBackend ? s.sourceTextLive : s.sourceTextMock]}>
            {isFromBackend
              ? 'Datos en vivo · DB Aiven'
              : isError
                ? 'Sin conexión al backend'
                : 'Cargando datos...'}
          </Text>
        </View> 
      </View>*/}
    </View>
  );
});

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  scroll: {
    paddingBottom: 40,
  },

  // ── HERO
  hero: {
    backgroundColor: '#064E3B',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  ring1: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.05)',
    top: -140,
    right: -90,
  },
  ring2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.18)',
    top: 20,
    right: -40,
  },
  ring3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.12)',
    bottom: 30,
    left: -50,
  },
  ring4: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(110,231,183,0.2)',
    top: 60,
    left: 20,
  },
  logoCardOuter: {
    marginTop: 12,
    width: '88%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  logoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  logoImg: {
    width: '100%',
    height: 58,
  },
  tagline: {
    color: 'rgba(209,250,229,0.88)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 18,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  heroDivider: {
    width: 44,
    height: 2,
    backgroundColor: 'rgba(110,231,183,0.5)',
    borderRadius: 2,
    marginTop: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: '100%',
  },
  statSep: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 3,
  },
  statLabel: {
    color: 'rgba(209,250,229,0.78)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  heroWave: {
    height: 34,
    backgroundColor: '#F0FDF4',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  // ── SEARCH
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },

  // ── CHIPS
  chips: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  chipActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextActive: {
    color: '#fff',
  },

  // ── RESULTS
  results: {
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#064E3B',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: '#6EE7B7',
    fontSize: 13,
    fontWeight: '700',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  sourceLive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sourceMock: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '500',
  },
  sourceTextLive: {
    color: '#059669',
  },
  sourceTextMock: {
    color: '#9CA3AF',
  },

  // ── EMPTY
  empty: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

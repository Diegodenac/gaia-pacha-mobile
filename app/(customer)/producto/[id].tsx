import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useProductQuery } from '@/features/customer/catalog/hooks/useCatalogQuery';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { data: product, isLoading, isError } = useProductQuery(id);

  if (isLoading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[s.root, s.center]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={s.errorText}>Error al cargar el producto</Text>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* HERO IMAGE */}
        <View style={s.heroContainer}>
          <Image
            source={{ uri: product.imageUrls[0] || 'https://via.placeholder.com/600' }}
            style={s.heroImage}
            contentFit="cover"
            transition={300}
          />
          {/* Back Button overlay */}
          <SafeAreaView edges={['top']} style={s.backOverlay}>
            <Pressable onPress={() => router.back()} style={s.iconBtn}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* PRODUCT DETAILS */}
        <View style={s.detailsContainer}>
          <View style={s.titleRow}>
            <Text style={s.productName}>{product.name}</Text>
            <View style={s.priceBubble}>
              <Text style={s.priceText}>{product.currency} {product.price}</Text>
            </View>
          </View>
          
          <View style={s.categoryRow}>
            <Ionicons name="leaf-outline" size={16} color="#059669" />
            <Text style={s.categoryText}>{product.categoryName || 'Eco Producto'}</Text>
          </View>

          <View style={s.divider} />

          <Text style={s.sectionTitle}>Descripción</Text>
          <Text style={s.descriptionText}>
            {product.description || 'Sin descripción disponible.'}
          </Text>

          <View style={s.divider} />

          {/* ENTREPRENEURSHIP SECTION */}
          <Text style={s.sectionTitle}>Ofrecido por</Text>
          <View style={s.enterpriseCard}>
            <View style={s.enterpriseInfo}>
              <Ionicons name="business-outline" size={24} color="#064E3B" />
              <Text style={s.enterpriseName}>{product.enterpriseName}</Text>
            </View>
            <Pressable 
              style={s.visitBtn}
              onPress={() => router.push({ pathname: '/enterprise/[id]', params: { id: product.ecoServiceId } })}
            >
              <Text style={s.visitBtnText}>Visitar Emprendimiento</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    backgroundColor: '#F0FDF4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#064E3B',
    marginRight: 16,
  },
  priceBubble: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1FAE5',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },
  enterpriseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  enterpriseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  enterpriseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064E3B',
    marginLeft: 12,
  },
  visitBtn: {
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  visitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#374151',
    marginTop: 12,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

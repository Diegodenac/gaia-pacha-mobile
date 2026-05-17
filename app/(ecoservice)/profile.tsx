import { useEffect } from 'react';
import {
  View, Text, Switch, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';
import { useEcoServiceStore } from '@/store/ecoServiceStore';
import { useEcoServiceListQuery } from '@/features/ecoservice/switcher/hooks/useEcoServiceListQuery';
import { useEnterpriseDetailQuery } from '@/features/customer/home/hooks/useEnterpriseDetailQuery';
import { useMyProductsQuery } from '@/features/ecoservice/products/hooks/useMyProductsQuery';
import type { Product } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────
const SURFACE        = '#0d1117';
const SURFACE_RAISED = '#161b22';
const SURFACE_INPUT  = '#21262d';
const BORDER         = '#30363d';
const PRIMARY_LIGHT  = '#4ade80';
const TEXT_WHITE     = '#ffffff';
const TEXT_SECONDARY = '#9ca3af';
const TEXT_MUTED     = '#6b7280';
const RED            = '#ef4444';
const ECO_GREEN      = '#059669';
const ECO_TEAL       = '#34d399';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function EcoServiceProfileScreen() {
  const { user, logout } = useAuthStore();
  const { previewAsEcoService, togglePreview } = useDevStore();
  const { activeEcoServiceId, setActiveEcoServiceId } = useEcoServiceStore();
  const router = useRouter();

  // Fetch enterprise list only to resolve the active enterprise ID
  const { data: enterprises } = useEcoServiceListQuery();

  useEffect(() => {
    if (!activeEcoServiceId && enterprises?.length) {
      setActiveEcoServiceId(enterprises[0].id);
    }
  }, [enterprises, activeEcoServiceId, setActiveEcoServiceId]);

  const { data: enterprise, isLoading: loadingEnterprise } = useEnterpriseDetailQuery(
    activeEcoServiceId ?? '',
  );
  const { myProducts, isLoading: loadingProducts } = useMyProductsQuery(
    activeEcoServiceId ?? '',
  );

  function handlePreviewToggle(value: boolean) {
    togglePreview();
    if (!value) router.replace('/(customer)');
  }

  const initial = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.screenTitle}>Mi Perfil</Text>

        {/* User card */}
        <View style={s.userCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{initial}</Text>
          </View>
          <View style={s.userInfo}>
            <Text style={s.userEmail}>{user?.email}</Text>
            <View style={s.ecoBadge}>
              <Text style={s.ecoBadgeText}>EcoService</Text>
            </View>
          </View>
        </View>

        {/* Enterprise PDP preview */}
        <Text style={s.sectionLabel}>MI EMPRENDIMIENTO</Text>

        {loadingEnterprise && !enterprise ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color={ECO_GREEN} />
          </View>
        ) : enterprise ? (
          <View style={s.pdpCard}>
            {enterprise.imageUrl ? (
              <Image
                source={{ uri: enterprise.imageUrl }}
                style={s.pdpImage}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={[s.pdpImage, s.imageFallback]}>
                <Ionicons name="storefront-outline" size={32} color={TEXT_MUTED} />
              </View>
            )}
            <View style={s.pdpBody}>
              <Text style={s.pdpName}>{enterprise.name}</Text>
              <Text style={s.pdpCategory}>{enterprise.categoryLabel}</Text>
              {enterprise.location ? (
                <View style={s.pdpLocationRow}>
                  <Ionicons name="location-outline" size={12} color={TEXT_MUTED} />
                  <Text style={s.pdpLocationText} numberOfLines={1}>{enterprise.location}</Text>
                </View>
              ) : null}
              {enterprise.description ? (
                <Text style={s.pdpDesc} numberOfLines={3}>{enterprise.description}</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Products grid */}
        <Text style={s.sectionLabel}>MIS PRODUCTOS</Text>

        {loadingProducts && !myProducts.length ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color={ECO_GREEN} />
          </View>
        ) : myProducts.length > 0 ? (
          <View style={s.productsGrid}>
            {myProducts.map((product: Product) => (
              <View key={product.id} style={s.productCard}>
                {product.imageUrls[0] ? (
                  <Image
                    source={{ uri: product.imageUrls[0] }}
                    style={s.productThumb}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={[s.productThumb, s.imageFallback]}>
                    <Ionicons name="cube-outline" size={22} color={TEXT_MUTED} />
                  </View>
                )}
                <View style={s.productInfo}>
                  <Text style={s.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={s.productPrice}>Bs. {product.price.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={s.emptyRow}>
            <Ionicons name="cube-outline" size={20} color={TEXT_MUTED} />
            <Text style={s.emptyText}>No hay productos registrados aún.</Text>
          </View>
        )}

        {/* Dev preview toggle — only visible when previewing from customer profile */}
        {previewAsEcoService && (
          <View style={s.rowCard}>
            <View style={s.rowLabel}>
              <Ionicons name="flask-outline" size={16} color={TEXT_MUTED} />
              <Text style={s.rowLabelText}>Preview EcoService tabs</Text>
            </View>
            <Switch
              value={previewAsEcoService}
              onValueChange={handlePreviewToggle}
              trackColor={{ false: '#374151', true: ECO_GREEN }}
              thumbColor="#ffffff"
            />
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={RED} />
          <Text style={s.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: SURFACE },
  content:       { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },
  screenTitle:   { fontSize: 22, fontWeight: '800', color: TEXT_WHITE, marginBottom: 20 },

  // User card
  userCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: SURFACE_RAISED, borderRadius: 20, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: BORDER },
  avatarCircle:  { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(5,150,105,0.15)', borderWidth: 2, borderColor: ECO_GREEN, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { fontSize: 20, fontWeight: '800', color: PRIMARY_LIGHT },
  userInfo:      { flex: 1, gap: 6 },
  userEmail:     { fontSize: 15, fontWeight: '600', color: TEXT_WHITE },
  ecoBadge:      { alignSelf: 'flex-start', backgroundColor: 'rgba(5,150,105,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  ecoBadgeText:  { fontSize: 12, fontWeight: '600', color: ECO_TEAL },

  // Section label
  sectionLabel:  { fontSize: 11, fontWeight: '700', color: TEXT_MUTED, letterSpacing: 0.8, marginBottom: 10 },

  // Loading / empty
  loadingBox:    { alignItems: 'center', paddingVertical: 24, marginBottom: 20 },
  emptyRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, marginBottom: 20 },
  emptyText:     { fontSize: 13, color: TEXT_MUTED },

  // PDP card
  pdpCard:           { backgroundColor: SURFACE_RAISED, borderRadius: 16, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: BORDER },
  pdpImage:          { width: '100%', height: 160 },
  imageFallback:     { backgroundColor: '#21262d', alignItems: 'center', justifyContent: 'center' },
  pdpBody:           { padding: 16 },
  pdpName:           { fontSize: 18, fontWeight: '800', color: TEXT_WHITE, marginBottom: 4 },
  pdpCategory:       { fontSize: 12, color: PRIMARY_LIGHT, fontWeight: '600', marginBottom: 8 },
  pdpLocationRow:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  pdpLocationText:   { fontSize: 12, color: TEXT_MUTED, flex: 1 },
  pdpDesc:           { fontSize: 13, color: TEXT_SECONDARY, lineHeight: 19 },

  // Products grid (2-column wrap)
  productsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  productCard:   { width: '47%', backgroundColor: SURFACE_RAISED, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  productThumb:  { width: '100%', height: 110 },
  productInfo:   { padding: 10 },
  productName:   { fontSize: 13, fontWeight: '600', color: TEXT_WHITE, marginBottom: 4 },
  productPrice:  { fontSize: 12, color: PRIMARY_LIGHT, fontWeight: '700' },

  // Dev toggle row
  rowCard:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: SURFACE_RAISED, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  rowLabel:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabelText:  { fontSize: 14, color: TEXT_SECONDARY },

  // Logout
  logoutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingVertical: 14, marginTop: 4 },
  logoutText:    { fontSize: 15, fontWeight: '600', color: RED },
});

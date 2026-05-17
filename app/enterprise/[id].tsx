import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEnterpriseDetailQuery } from '@/features/customer/home/hooks/useEnterpriseDetailQuery';
import { useProductsQuery } from '@/features/customer/home/hooks/useProductsQuery';

// ── Helpers ───────────────────────────────────────────────────────────────────

type SocialIcon =
  | 'logo-tiktok'
  | 'logo-instagram'
  | 'logo-facebook'
  | 'logo-whatsapp'
  | 'logo-twitter'
  | 'globe-outline';

interface SocialNetwork {
  type: string;
  url: string;
  label: string;
  icon: SocialIcon;
  color: string;
}

function parseSocialNetworks(raw?: string): SocialNetwork[] {
  if (!raw) return [];
  return raw
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'))
    .map((url) => {
      const u = url.toLowerCase();
      if (u.includes('tiktok.com'))
        return { type: 'tiktok', url, label: 'TikTok', icon: 'logo-tiktok' as const, color: '#010101' };
      if (u.includes('instagram.com'))
        return { type: 'instagram', url, label: 'Instagram', icon: 'logo-instagram' as const, color: '#E1306C' };
      if (u.includes('facebook.com') || u.includes('fb.com'))
        return { type: 'facebook', url, label: 'Facebook', icon: 'logo-facebook' as const, color: '#1877F2' };
      if (u.includes('wa.me') || u.includes('whatsapp'))
        return { type: 'whatsapp', url, label: 'WhatsApp', icon: 'logo-whatsapp' as const, color: '#25D366' };
      if (u.includes('twitter.com') || u.includes('x.com'))
        return { type: 'twitter', url, label: 'Twitter', icon: 'logo-twitter' as const, color: '#1DA1F2' };
      return { type: 'web', url, label: 'Sitio Web', icon: 'globe-outline' as const, color: '#6B7280' };
    });
}

function openWhatsApp(phone?: string) {
  if (!phone) {
    Alert.alert('Sin contacto', 'Este emprendimiento no tiene número registrado.');
    return;
  }
  const clean = phone.replace(/\D/g, '');
  // Bolivia numbers are 8 digits — prefix with +591 country code
  const number = clean.startsWith('591') ? clean : `591${clean}`;
  Linking.openURL(`https://wa.me/${number}`).catch(() =>
    Alert.alert('Error', 'No se pudo abrir WhatsApp'),
  );
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  organic_food:        { bg: '#DCFCE7', text: '#14532D', emoji: '🌾' },
  other:               { bg: '#D1FAE5', text: '#064E3B', emoji: '🌿' },
  sustainable_fashion: { bg: '#FEF3C7', text: '#92400E', emoji: '🧵' },
  recycling:           { bg: '#DCFCE7', text: '#14532D', emoji: '♻️' },
  renewable_energy:    { bg: '#DBEAFE', text: '#1E3A8A', emoji: '☀️' },
  eco_tourism:         { bg: '#CFFAFE', text: '#164E63', emoji: '🏔️' },
  green_transport:     { bg: '#F0FDF4', text: '#166534', emoji: '🚲' },
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function EnterpriseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: enterprise, isLoading } = useEnterpriseDetailQuery(id ?? '');
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery(id ?? '');

  const cat = enterprise
    ? (CATEGORY_STYLES[enterprise.category] ?? CATEGORY_STYLES['other'])
    : CATEGORY_STYLES['other'];

  const socialNetworks = parseSocialNetworks(enterprise?.socialNetworksRaw);
  const isVirtual = enterprise?.isVirtual ?? false;

  const openMaps = useCallback(() => {
    const raw = enterprise?.linkGoogleMaps ?? '';
    if (raw.startsWith('http')) {
      Linking.openURL(raw);
    } else {
      // Fallback: open Google Maps search with the enterprise name
      const query = encodeURIComponent(`${enterprise?.name ?? ''}, Bolivia`);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
  }, [enterprise]);

  // ── Loading / error states ──────────────────────────────────────────────────
  if (isLoading && !enterprise) {
    return (
      <View style={s.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#059669" />
        <Text style={s.loadingText}>Cargando emprendimiento...</Text>
      </View>
    );
  }

  if (!enterprise) {
    return (
      <View style={s.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text style={s.loadingText}>Emprendimiento no encontrado</Text>
        <Pressable style={s.backBtnCentered} onPress={() => router.back()}>
          <Text style={s.backBtnCenteredText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>

        {/* ── HERO IMAGE ──────────────────────────────────────────────── */}
        <View style={s.heroWrap}>
          <Image
            source={{ uri: enterprise.imageUrl }}
            style={s.heroImage}
            contentFit="cover"
            transition={400}
          />
          <View style={s.heroOverlay} />
          <View style={s.heroBottomGradient} />

          {/* Back button — floats over image */}
          <Pressable style={[s.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          {/* Category + Eco badge — anchored to bottom of hero */}
          <View style={s.heroBadgesRow}>
            <View style={[s.catChip, { backgroundColor: cat.bg }]}>
              <Text style={[s.catChipText, { color: cat.text }]}>
                {cat.emoji}  {enterprise.categoryLabel}
              </Text>
            </View>
            <View style={s.ecoBadge}>
              <Ionicons name="leaf" size={11} color="#6EE7B7" />
              <Text style={s.ecoBadgeText}>Eco Verificado</Text>
            </View>
          </View>
        </View>

        {/* ── IDENTITY ────────────────────────────────────────────────── */}
        <View style={s.identitySection}>
          <Text style={s.enterpriseName}>{enterprise.name}</Text>

          {enterprise.entrepreneurName ? (
            <View style={s.infoRow}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={s.infoText}>{enterprise.entrepreneurName}</Text>
            </View>
          ) : null}

          <View style={s.infoRow}>
            <Ionicons name="location-sharp" size={14} color="#3B82F6" />
            <Text style={[s.infoText, { color: '#3B82F6', fontWeight: '600' }]}>
              {enterprise.location}
            </Text>
          </View>

          {enterprise.schedule ? (
            <View style={s.infoRow}>
              <Ionicons name="time-outline" size={14} color="#059669" />
              <Text style={[s.infoText, { color: '#059669' }]}>{enterprise.schedule}</Text>
            </View>
          ) : null}
        </View>

        {/* ── DESCRIPTION ─────────────────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>¿Qué hacemos?</Text>
          <Text style={s.descriptionText}>{enterprise.description || 'Sin descripción disponible.'}</Text>
        </View>

        {/* ── IMPACT ──────────────────────────────────────────────────── */}
        {(enterprise.environmentalProblem || enterprise.ecoActivities || enterprise.impactSummary) ? (
          <>
            <View style={s.divider} />
            <View style={s.section}>
              <Text style={s.sectionTitle}>🌍 Nuestro Impacto</Text>

              {enterprise.environmentalProblem ? (
                <View style={s.impactBox}>
                  <Ionicons name="leaf-outline" size={16} color="#059669" style={{ marginTop: 2 }} />
                  <Text style={s.impactBoxText}>{enterprise.environmentalProblem}</Text>
                </View>
              ) : null}

              {enterprise.ecoActivities ? (
                <View style={s.ecoActivitiesBox}>
                  <Text style={s.ecoActivitiesLabel}>Actividades sostenibles</Text>
                  <Text style={s.ecoActivitiesText}>{enterprise.ecoActivities}</Text>
                </View>
              ) : null}

              {!enterprise.environmentalProblem && !enterprise.ecoActivities && enterprise.impactSummary ? (
                <View style={s.impactBox}>
                  <Ionicons name="leaf-outline" size={16} color="#059669" style={{ marginTop: 2 }} />
                  <Text style={s.impactBoxText}>{enterprise.impactSummary}</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : null}

        {/* ── GREEN SIGNALS ───────────────────────────────────────────── */}
        {enterprise.greenSignals.length > 0 ? (
          <>
            <View style={s.divider} />
            <View style={s.section}>
              <Text style={s.sectionTitle}>🌱 Indicadores Verdes</Text>
              <View style={s.signalsGrid}>
                {enterprise.greenSignals.map((sig, i) => (
                  <View key={i} style={s.signalCard}>
                    <Text style={s.signalLabel}>{sig.label}</Text>
                    <Text style={s.signalValue}>{sig.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}

        {/* ── IMPACT BADGES ───────────────────────────────────────────── */}
        {enterprise.impactBadges.length > 0 ? (
          <View style={s.badgesRow}>
            {enterprise.impactBadges.map((b, i) => (
              <View key={i} style={s.badge}>
                <Ionicons name="checkmark-circle" size={13} color="#059669" />
                <Text style={s.badgeText}>{b}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── SOCIAL NETWORKS ─────────────────────────────────────────── */}
        {socialNetworks.length > 0 ? (
          <>
            <View style={s.divider} />
            <View style={s.section}>
              <Text style={s.sectionTitle}>Redes Sociales</Text>
              <View style={s.socialsRow}>
                {socialNetworks.map((net) => (
                  <Pressable
                    key={net.type}
                    style={[s.socialBtn, { borderColor: net.color + '50' }]}
                    onPress={() => Linking.openURL(net.url)}
                  >
                    <View style={[s.socialIconCircle, { backgroundColor: net.color + '18' }]}>
                      <Ionicons name={net.icon} size={28} color={net.color} />
                    </View>
                    <Text style={[s.socialLabel, { color: net.color }]}>{net.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : null}

        {/* ── PRODUCT CATALOG ──────────────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>🛍️ Catálogo de Productos</Text>

          {isLoadingProducts ? (
            <View style={s.productsLoading}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={s.productsLoadingText}>Cargando productos...</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={s.productsEmpty}>
              <Ionicons name="cube-outline" size={36} color="#D1FAE5" />
              <Text style={s.productsEmptyText}>Sin productos registrados aún</Text>
            </View>
          ) : (
            <View style={s.productsList}>
              {products.map((product) => (
                <View key={product.id} style={s.productRow}>
                  <View style={s.productImageWrap}>
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={s.productImage}
                      contentFit="cover"
                      transition={300}
                    />
                    {!product.available && (
                      <View style={s.unavailableOverlay}>
                        <Text style={s.unavailableText}>Agotado</Text>
                      </View>
                    )}
                  </View>
                  <View style={s.productInfo}>
                    <View style={s.productCategoryTag}>
                      <Text style={s.productCategoryText} numberOfLines={1}>
                        {product.categoryName}
                      </Text>
                    </View>
                    <Text style={s.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={s.productDesc} numberOfLines={2}>{product.description}</Text>
                    <Text style={s.productPrice}>Bs. {parseFloat(product.price).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── LOCATION / MAP ───────────────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>📍 Ubicación</Text>
          {isVirtual ? (
            <View style={s.virtualCard}>
              <Ionicons name="globe-outline" size={36} color="#059669" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.virtualTitle}>Negocio Virtual 🌐</Text>
                <Text style={s.virtualSub}>
                  Este emprendimiento opera 100% en línea. Contáctalos por sus redes o WhatsApp.
                </Text>
              </View>
            </View>
          ) : (
            <View style={s.mapCard}>
              <View style={s.mapInfo}>
                <Ionicons name="location-outline" size={20} color="#064E3B" />
                <Text style={s.mapAddress} numberOfLines={4}>
                  {enterprise.linkGoogleMaps || enterprise.location}
                </Text>
              </View>
              <Pressable style={s.mapsBtn} onPress={openMaps}>
                <Ionicons name="map-outline" size={16} color="#fff" />
                <Text style={s.mapsBtnText}>Abrir en Google Maps</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── CONTACT CTA ──────────────────────────────────────────────── */}
        <View style={[s.ctaSection, { paddingBottom: insets.bottom + 32 }]}>
          <Pressable
            style={s.whatsappBtn}
            onPress={() => openWhatsApp(enterprise.phone)}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text style={s.whatsappBtnText}>Contactar por WhatsApp</Text>
          </Pressable>
          {enterprise.phone ? (
            <Text style={s.phoneHint}>📞 {enterprise.phone}</Text>
          ) : null}
        </View>

      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  scroll: {
    flex: 1,
  },

  // ── Loading / Error ──────────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  backBtnCentered: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  backBtnCenteredText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  heroWrap: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,78,59,0.25)',
  },
  heroBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(6,78,59,0.6)',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgesRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6,78,59,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  ecoBadgeText: {
    color: '#6EE7B7',
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Identity ─────────────────────────────────────────────────────────────
  identitySection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 7,
  },
  enterpriseName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },

  // ── Layout helpers ────────────────────────────────────────────────────────
  divider: {
    height: 8,
    backgroundColor: '#F0FDF4',
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Description ───────────────────────────────────────────────────────────
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },

  // ── Impact ────────────────────────────────────────────────────────────────
  impactBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    borderRadius: 8,
    padding: 14,
  },
  impactBoxText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  ecoActivitiesBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  ecoActivitiesLabel: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ecoActivitiesText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 21,
  },

  // ── Green Signals ─────────────────────────────────────────────────────────
  signalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  signalCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  signalLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signalValue: {
    fontSize: 14,
    color: '#064E3B',
    fontWeight: '700',
  },

  // ── Badges ────────────────────────────────────────────────────────────────
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },

  // ── Social Networks ───────────────────────────────────────────────────────
  socialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialBtn: {
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 80,
  },
  socialIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialLabel: {
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Product Catalog ───────────────────────────────────────────────────────
  productsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  productsLoadingText: {
    fontSize: 14,
    color: '#059669',
  },
  productsEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 32,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderStyle: 'dashed',
  },
  productsEmptyText: {
    fontSize: 14,
    color: '#6EE7B7',
    fontWeight: '600',
  },
  productsList: {
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageWrap: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  productImage: {
    width: 110,
    height: 110,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
  },
  productCategoryText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '700',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 19,
  },
  productDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 6,
  },

  // ── Location ──────────────────────────────────────────────────────────────
  virtualCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  virtualTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 4,
  },
  virtualSub: {
    fontSize: 13,
    color: '#059669',
    lineHeight: 19,
  },
  mapCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  mapAddress: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#064E3B',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  mapsBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Contact CTA ───────────────────────────────────────────────────────────
  ctaSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 12,
    alignItems: 'center',
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  whatsappBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  phoneHint: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

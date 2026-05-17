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
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useEnterpriseDetailQuery } from '@/features/customer/home/hooks/useEnterpriseDetailQuery';
import { MOCK_PRODUCTS } from '@/features/customer/home/mockData';

// ── Helpers (identical to enterprise/[id].tsx) ────────────────────────────────

type SocialIcon =
  | 'logo-tiktok' | 'logo-instagram' | 'logo-facebook'
  | 'logo-whatsapp' | 'logo-twitter' | 'globe-outline';

interface SocialNetwork { type: string; url: string; label: string; icon: SocialIcon; color: string }

function parseSocialNetworks(raw?: string): SocialNetwork[] {
  if (!raw) return [];
  return raw.split(/\s+/).map((s) => s.trim()).filter((s) => s.startsWith('http')).map((url) => {
    const u = url.toLowerCase();
    if (u.includes('tiktok.com'))     return { type: 'tiktok',     url, label: 'TikTok',    icon: 'logo-tiktok'     as const, color: '#010101' };
    if (u.includes('instagram.com'))  return { type: 'instagram',  url, label: 'Instagram', icon: 'logo-instagram'  as const, color: '#E1306C' };
    if (u.includes('facebook.com') || u.includes('fb.com'))
                                       return { type: 'facebook',   url, label: 'Facebook',  icon: 'logo-facebook'   as const, color: '#1877F2' };
    if (u.includes('wa.me') || u.includes('whatsapp'))
                                       return { type: 'whatsapp',   url, label: 'WhatsApp',  icon: 'logo-whatsapp'   as const, color: '#25D366' };
    if (u.includes('twitter.com') || u.includes('x.com'))
                                       return { type: 'twitter',    url, label: 'Twitter',   icon: 'logo-twitter'    as const, color: '#1DA1F2' };
    return { type: 'web', url, label: 'Sitio Web', icon: 'globe-outline' as const, color: '#6B7280' };
  });
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

export default function PdpEditorScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { data: enterprise, isLoading } = useEnterpriseDetailQuery(user?.id ?? '');

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
      const query = encodeURIComponent(`${enterprise?.name ?? ''}, Bolivia`);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
  }, [enterprise]);

  if (isLoading && !enterprise) {
    return (
      <View style={[s.root, s.center]} >
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#059669" />
        <Text style={s.loadingText}>Cargando tu PDP...</Text>
      </View>
    );
  }

  if (!enterprise) {
    return (
      <View style={[s.root, s.center]}>
        <StatusBar barStyle="dark-content" />
        <Ionicons name="storefront-outline" size={48} color="#9CA3AF" />
        <Text style={s.loadingText}>No se encontró tu emprendimiento.</Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 32 }}>
          Asegúrate de que tu cuenta está vinculada a un emprendimiento en la plataforma.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>

        {/* ── HERO IMAGE ──────────────────────────────────────────── */}
        <View style={s.heroWrap}>
          <Image
            source={{ uri: enterprise.imageUrl }}
            style={s.heroImage}
            contentFit="cover"
            transition={400}
          />
          <View style={s.heroOverlay} />
          <View style={s.heroBottomGradient} />

          {/* Preview mode badge — anchored to top */}
          <View style={[s.previewBanner, { top: insets.top + 12 }]}>
            <Ionicons name="eye-outline" size={13} color="#fff" />
            <Text style={s.previewBannerText}>Vista previa</Text>
          </View>

          {/* Category + Eco badge */}
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

        {/* ── IDENTITY ──────────────────────────────────────────── */}
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

        {/* ── DESCRIPTION ───────────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>¿Qué hacemos?</Text>
          <Text style={s.descriptionText}>{enterprise.description || 'Sin descripción disponible.'}</Text>
        </View>

        {/* ── IMPACT ────────────────────────────────────────────── */}
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

        {/* ── GREEN SIGNALS ─────────────────────────────────────── */}
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

        {/* ── IMPACT BADGES ─────────────────────────────────────── */}
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

        {/* ── SOCIAL NETWORKS ───────────────────────────────────── */}
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

        {/* ── PRODUCT CATALOG ───────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>🛍️ Catálogo de Productos</Text>
            <View style={s.demoBadge}>
              <Text style={s.demoBadgeText}>Demo</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.productsScroll}
          >
            {MOCK_PRODUCTS.map((product) => (
              <Pressable key={product.id} style={s.productCard}>
                <Image source={{ uri: product.imageUrl }} style={s.productImage} contentFit="cover" transition={300} />
                {product.badge ? (
                  <View style={s.productBadge}>
                    <Text style={s.productBadgeText}>{product.badge}</Text>
                  </View>
                ) : null}
                <View style={s.productBody}>
                  <Text style={s.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={s.productDesc} numberOfLines={1}>{product.description}</Text>
                  <Text style={s.productPrice}>{product.price}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── LOCATION ──────────────────────────────────────────── */}
        <View style={s.divider} />
        <View style={s.section}>
          <Text style={s.sectionTitle}>📍 Ubicación</Text>
          {isVirtual ? (
            <View style={s.virtualCard}>
              <Ionicons name="globe-outline" size={36} color="#059669" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.virtualTitle}>Negocio Virtual 🌐</Text>
                <Text style={s.virtualSub}>
                  Este emprendimiento opera 100% en línea.
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

        {/* ── CONTACT CTA (preview-only, non-interactive) ───────── */}
        <View style={[s.ctaSection, { paddingBottom: insets.bottom + 32 }]}>
          <View style={[s.whatsappBtn, s.whatsappBtnDisabled]}>
            <Ionicons name="logo-whatsapp" size={22} color="rgba(255,255,255,0.5)" />
            <Text style={[s.whatsappBtnText, { opacity: 0.5 }]}>Contactar por WhatsApp</Text>
          </View>
          <Text style={s.previewNote}>Vista previa — los botones no son interactivos</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// ── Styles (adapted from enterprise/[id].tsx) ─────────────────────────────────
const s = StyleSheet.create({
  root:               { flex: 1, backgroundColor: '#F0FDF4' },
  scroll:             { flex: 1 },
  center:             { alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText:        { fontSize: 16, color: '#6B7280', fontWeight: '500' },

  heroWrap:           { height: 320, position: 'relative' },
  heroImage:          { width: '100%', height: '100%' },
  heroOverlay:        { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6,78,59,0.25)' },
  heroBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, backgroundColor: 'rgba(6,78,59,0.6)' },

  previewBanner:      { position: 'absolute', left: 16, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(5,150,105,0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(110,231,183,0.5)' },
  previewBannerText:  { color: '#fff', fontSize: 12, fontWeight: '700' },

  heroBadgesRow:      { position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  catChip:            { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4 },
  catChipText:        { fontSize: 12, fontWeight: '700' },
  ecoBadge:           { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(6,78,59,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#6EE7B7' },
  ecoBadgeText:       { color: '#6EE7B7', fontSize: 10, fontWeight: '700' },

  identitySection:    { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 18, gap: 7 },
  enterpriseName:     { fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5, marginBottom: 2 },
  infoRow:            { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  infoText:           { fontSize: 14, color: '#6B7280', fontWeight: '500', flex: 1 },

  divider:            { height: 8, backgroundColor: '#F0FDF4' },
  section:            { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20, gap: 14 },
  sectionTitle:       { fontSize: 17, fontWeight: '800', color: '#111827' },
  sectionHeaderRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  descriptionText:    { fontSize: 15, color: '#374151', lineHeight: 24 },

  impactBox:          { flexDirection: 'row', gap: 10, backgroundColor: '#F0FDF4', borderLeftWidth: 3, borderLeftColor: '#10B981', borderRadius: 8, padding: 14 },
  impactBoxText:      { flex: 1, fontSize: 14, color: '#065F46', lineHeight: 22, fontStyle: 'italic' },
  ecoActivitiesBox:   { backgroundColor: '#ECFDF5', borderRadius: 10, padding: 14, gap: 5, borderWidth: 1, borderColor: '#A7F3D0' },
  ecoActivitiesLabel: { fontSize: 11, color: '#059669', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  ecoActivitiesText:  { fontSize: 14, color: '#065F46', lineHeight: 21 },

  signalsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  signalCard:         { flex: 1, minWidth: '45%', backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 12, padding: 14, gap: 4 },
  signalLabel:        { fontSize: 11, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  signalValue:        { fontSize: 14, color: '#064E3B', fontWeight: '700' },

  badgesRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff' },
  badge:              { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#A7F3D0' },
  badgeText:          { fontSize: 12, color: '#065F46', fontWeight: '600' },

  socialsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  socialBtn:          { alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, minWidth: 80 },
  socialIconCircle:   { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  socialLabel:        { fontSize: 12, fontWeight: '700' },

  demoBadge:          { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: '#FCD34D' },
  demoBadgeText:      { fontSize: 11, color: '#92400E', fontWeight: '700' },
  productsScroll:     { gap: 12, paddingRight: 4 },
  productCard:        { width: 152, backgroundColor: '#fff', borderRadius: 14, shadowColor: '#064E3B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  productImage:       { width: '100%', height: 112 },
  productBadge:       { position: 'absolute', top: 8, right: 8, backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  productBadgeText:   { color: '#6EE7B7', fontSize: 10, fontWeight: '700' },
  productBody:        { padding: 10, gap: 2 },
  productName:        { fontSize: 13, fontWeight: '700', color: '#111827' },
  productDesc:        { fontSize: 11, color: '#9CA3AF' },
  productPrice:       { fontSize: 15, fontWeight: '800', color: '#064E3B', marginTop: 4 },

  virtualCard:        { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: '#ECFDF5', borderRadius: 14, padding: 18, borderWidth: 1.5, borderColor: '#A7F3D0' },
  virtualTitle:       { fontSize: 16, fontWeight: '800', color: '#065F46', marginBottom: 4 },
  virtualSub:         { fontSize: 13, color: '#059669', lineHeight: 19 },
  mapCard:            { backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16, gap: 14, borderWidth: 1, borderColor: '#BBF7D0' },
  mapInfo:            { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  mapAddress:         { flex: 1, fontSize: 14, color: '#374151', lineHeight: 21 },
  mapsBtn:            { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#064E3B', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10, alignSelf: 'flex-start' },
  mapsBtnText:        { color: '#fff', fontSize: 13, fontWeight: '700' },

  ctaSection:         { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 22, gap: 10, alignItems: 'center' },
  whatsappBtn:        { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#25D366', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14, width: '100%', justifyContent: 'center' },
  whatsappBtnDisabled:{ backgroundColor: '#9CA3AF' },
  whatsappBtnText:    { color: '#fff', fontSize: 16, fontWeight: '800' },
  previewNote:        { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
});

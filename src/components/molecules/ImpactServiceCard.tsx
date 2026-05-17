import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { GreenEnterprise } from '@/features/customer/home/mockData';

interface Props {
  enterprise: GreenEnterprise;
  onPress?: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  organic_food:        { bg: '#DCFCE7', text: '#14532D', emoji: '🌾' },
  other:               { bg: '#D1FAE5', text: '#064E3B', emoji: '🦁' },
  sustainable_fashion: { bg: '#FEF3C7', text: '#92400E', emoji: '🧵' },
  recycling:           { bg: '#DCFCE7', text: '#14532D', emoji: '♻️' },
  renewable_energy:    { bg: '#DBEAFE', text: '#1E3A8A', emoji: '☀️' },
  eco_tourism:         { bg: '#CFFAFE', text: '#164E63', emoji: '🏔️' },
  green_transport:     { bg: '#F0FDF4', text: '#166534', emoji: '🚲' },
};

export function ImpactServiceCard({ enterprise, onPress }: Props) {
  const [pressed, setPressed] = useState(false);
  const cat = CATEGORY_STYLES[enterprise.category] ?? CATEGORY_STYLES['other'];

  const handlePress = () => {
    onPress?.();
    router.push({ pathname: '/enterprise/[id]', params: { id: enterprise.id } });
  };

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={handlePress}
      style={[s.card, pressed && s.cardPressed]}
    >
      {/* ── IMAGE HERO ───────────────────────────────── */}
      <View style={s.imageWrap}>
        <Image
          source={{ uri: enterprise.imageUrl }}
          style={s.heroImage}
          contentFit="cover"
          transition={350}
        />
        {/* Forest-green tinted overlay */}
        <View style={s.imageOverlay} />

        {/* Category chip — top left */}
        <View style={[s.catChip, { backgroundColor: cat.bg }]}>
          <Text style={[s.catChipText, { color: cat.text }]}>
            {cat.emoji}  {enterprise.categoryLabel}
          </Text>
        </View>

        {/* Eco-verified badge — top right */}
        <View style={s.ecoBadge}>
          <Ionicons name="leaf" size={11} color="#6EE7B7" />
          <Text style={s.ecoBadgeText}>Eco Verificado</Text>
        </View>

        {/* Logo thumbnail — bottom right, overlapping body */}
        <View style={s.logoThumb}>
          <Image
            source={{ uri: enterprise.logoUrl }}
            style={s.logoImg}
            contentFit="cover"
          />
        </View>
      </View>

      {/* ── BODY ─────────────────────────────────────── */}
      <View style={s.body}>
        {/* Name — leave right margin so it doesn't overlap logo thumb */}
        <Text style={s.name}>{enterprise.name}</Text>

        {/* Location */}
        <View style={s.locationRow}>
          <Ionicons name="location-sharp" size={13} color="#3B82F6" />
          <Text style={s.locationText}>{enterprise.location}</Text>
        </View>

        {/* Description */}
        <Text style={s.description} numberOfLines={2}>
          {enterprise.description}
        </Text>

        {/* ── IMPACT SUMMARY ─────────────────────────── */}
        <View style={s.impactBox}>
          <Ionicons name="leaf-outline" size={14} color="#059669" style={{ marginTop: 1 }} />
          <Text style={s.impactText}>{enterprise.impactSummary}</Text>
        </View>

        {/* ── GREEN SIGNALS ──────────────────────────── */}
        <View style={s.signalsRow}>
          {enterprise.greenSignals.slice(0, 2).map((sig, i) => (
            <View key={i} style={s.signalBox}>
              <Text style={s.signalLabel}>{sig.label}</Text>
              <Text style={s.signalValue}>{sig.value}</Text>
            </View>
          ))}
        </View>

        {/* ── IMPACT BADGES ──────────────────────────── */}
        <View style={s.badgesRow}>
          {enterprise.impactBadges.map((b, i) => (
            <View key={i} style={s.badge}>
              <Ionicons name="checkmark-circle" size={12} color="#059669" />
              <Text style={s.badgeText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* ── CTA ────────────────────────────────────── */}
        <Pressable style={s.cta} onPress={handlePress}>
          <Text style={s.ctaText}>Conocer empresa</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 22,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 7,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.93,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  imageWrap: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 78, 59, 0.22)',
  },
  catChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ecoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 78, 59, 0.82)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ecoBadgeText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '700',
  },
  logoThumb: {
    position: 'absolute',
    bottom: -18,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: 16,
    paddingTop: 26,
  },
  name: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    marginRight: 60,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    marginBottom: 12,
  },
  impactBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  impactText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  signalsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  signalBox: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 10,
  },
  signalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  signalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  cta: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

import { useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';
import { useEcoServiceStore } from '@/store/ecoServiceStore';
import { useEcoServiceListQuery } from '@/features/ecoservice/switcher/hooks/useEcoServiceListQuery';
import type { GreenEnterprise } from '@/features/customer/home/mockData';

// ── EcoService Switcher ───────────────────────────────────────────────────────

function EcoServiceSwitcher() {
  const { activeEcoServiceId, setActiveEcoServiceId } = useEcoServiceStore();
  const { data: enterprises, isLoading } = useEcoServiceListQuery();

  // Auto-select the first enterprise when the list loads and nothing is selected
  useEffect(() => {
    if (!activeEcoServiceId && enterprises?.length) {
      setActiveEcoServiceId(enterprises[0].id);
    }
  }, [enterprises, activeEcoServiceId, setActiveEcoServiceId]);

  return (
    <View style={sw.container}>
      <Text style={sw.label}>MIS ECOSERVICES</Text>

      {isLoading && (
        <View style={sw.loadingRow}>
          <ActivityIndicator size="small" color="#059669" />
          <Text style={sw.loadingText}>Cargando emprendimientos...</Text>
        </View>
      )}

      {enterprises?.map((enterprise: GreenEnterprise) => {
        const isActive = enterprise.id === activeEcoServiceId;
        return (
          <Pressable
            key={enterprise.id}
            style={[sw.row, isActive && sw.rowActive]}
            onPress={() => setActiveEcoServiceId(enterprise.id)}
          >
            {/* Thumbnail */}
            <View style={sw.thumbWrap}>
              <Image
                source={{ uri: enterprise.imageUrl }}
                style={sw.thumb}
                contentFit="cover"
                transition={200}
              />
            </View>

            {/* Info */}
            <View style={sw.info}>
              <Text style={sw.name} numberOfLines={1}>{enterprise.name}</Text>
              <Text style={sw.location} numberOfLines={1}>{enterprise.location}</Text>
            </View>

            {/* Active indicator */}
            {isActive ? (
              <View style={sw.checkCircle}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            ) : (
              <View style={sw.radioCircle} />
            )}
          </Pressable>
        );
      })}

      {!isLoading && !enterprises?.length && (
        <View style={sw.emptyRow}>
          <Ionicons name="storefront-outline" size={20} color="#9CA3AF" />
          <Text style={sw.emptyText}>No se encontraron emprendimientos.</Text>
        </View>
      )}
    </View>
  );
}

// ── Profile Screen ─────────────────────────────────────────────────────────────

export default function EcoServiceProfileScreen() {
  const { user, logout } = useAuthStore();
  const { previewAsEcoService, togglePreview } = useDevStore();
  const router = useRouter();

  function handlePreviewToggle(value: boolean) {
    togglePreview();
    if (!value) {
      router.replace('/(customer)');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d1117' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="section-title">My Profile</Text>

        {/* User card */}
        <View className="card mb-4">
          <Text className="text-white font-semi text-lg">{user?.email ?? 'EcoService'}</Text>
          <View className="mt-2">
            <Text className="badge-eco self-start">EcoService</Text>
          </View>
        </View>

        {/* EcoService switcher — real list from DB */}
        <EcoServiceSwitcher />

        {/* Dev: toggle back to Customer tab set (only shown during preview) */}
        {previewAsEcoService && (
          <View className="card mb-4 flex-row items-center justify-between">
            <Text className="text-gray-300 text-sm">Preview EcoService tabs</Text>
            <Switch
              value={previewAsEcoService}
              onValueChange={handlePreviewToggle}
              trackColor={{ false: '#374151', true: '#059669' }}
              thumbColor="#ffffff"
            />
          </View>
        )}

        {user ? (
          <TouchableOpacity className="btn-ghost mt-2" onPress={logout}>
            <Text className="text-error font-medium">Sign Out</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const sw = StyleSheet.create({
  container:   { backgroundColor: '#161b22', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#30363d' },
  label:       { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 0.8, marginBottom: 12 },

  loadingRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  loadingText: { fontSize: 13, color: '#6b7280' },

  row:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, marginBottom: 6 },
  rowActive:   { backgroundColor: 'rgba(5,150,105,0.12)', borderWidth: 1, borderColor: 'rgba(5,150,105,0.3)' },

  thumbWrap:   { width: 44, height: 44, borderRadius: 10, overflow: 'hidden', backgroundColor: '#21262d' },
  thumb:       { width: '100%', height: '100%' },

  info:        { flex: 1 },
  name:        { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  location:    { fontSize: 12, color: '#6b7280', marginTop: 2 },

  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#30363d' },

  emptyRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  emptyText:   { fontSize: 13, color: '#6b7280' },
});

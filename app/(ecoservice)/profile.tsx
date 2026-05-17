import { View, Text, Switch, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';

// ── EcoService Switcher ───────────────────────────────────────────────────────
// Shows the currently active EcoService and a placeholder for multi-enterprise
// switching. Expands when an EcoService user owns more than one enterprise.

function EcoServiceSwitcher({ userName }: { userName: string }) {
  return (
    <View style={sw.container}>
      <Text style={sw.label}>MIS ECOSERVICES</Text>

      {/* Active enterprise row */}
      <View style={sw.activeRow}>
        <View style={sw.avatarCircle}>
          <Ionicons name="storefront" size={20} color="#059669" />
        </View>
        <View style={sw.info}>
          <Text style={sw.name}>{userName}</Text>
          <Text style={sw.status}>Activo</Text>
        </View>
        <View style={sw.checkCircle}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      </View>

      {/* Placeholder for future additional enterprises */}
      <Pressable style={sw.addRow} disabled>
        <View style={sw.addIcon}>
          <Ionicons name="add" size={18} color="#9CA3AF" />
        </View>
        <Text style={sw.addText}>Agregar otro EcoService</Text>
      </Pressable>
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
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">My Profile</Text>

      {/* User card */}
      <View className="card mb-4">
        <Text className="text-white font-semi text-lg">{user?.name ?? 'EcoService'}</Text>
        {user?.email ? (
          <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
        ) : null}
        <View className="mt-2">
          <Text className="badge-eco self-start">EcoService</Text>
        </View>
      </View>

      {/* EcoService switcher */}
      <EcoServiceSwitcher userName={user?.name ?? 'Mi EcoService'} />

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
    </SafeAreaView>
  );
}

const sw = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  label: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 12 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#A7F3D0' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  status: { fontSize: 12, color: '#059669', fontWeight: '500', marginTop: 1 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6', opacity: 0.5 },
  addIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  addText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
});

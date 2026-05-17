import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';

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
      <Text className="section-title">My Business Profile</Text>

      <View className="card mb-4">
        <Text className="text-white font-semi text-lg">{user?.name ?? 'EcoService'}</Text>
        {user?.email ? (
          <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
        ) : null}
        <View className="mt-2">
          <Text className="badge-eco self-start">EcoService</Text>
        </View>
      </View>

      {/* Dev: switch back to Customer tab set */}
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

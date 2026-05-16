import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';

/** EcoService Profile Screen */
export default function EcoServiceProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">My Business Profile</Text>
      <View className="card mb-4">
        <Text className="text-white font-semi text-lg">{user?.name}</Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>
        <View className="mt-2">
          <Text className="badge-eco self-start">EcoService</Text>
        </View>
      </View>
      <TouchableOpacity className="btn-ghost mt-4" onPress={logout}>
        <Text className="text-error font-medium">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

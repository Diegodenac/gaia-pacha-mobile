import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';

/**
 * Customer Home Screen
 *
 * AI Hint: This screen should display featured EcoServices and a search bar.
 * Data comes from useCatalogQuery() in src/features/customer/catalog/hooks/useCatalogQuery.ts
 * Components used should be from src/components/(molecules|organisms).
 */
export default function CustomerHomeScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="screen-container">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View className="mb-6">
          <Text className="text-gray-400 font-sans text-sm">Good morning 🌿</Text>
          <Text className="text-white font-bold text-2xl mt-1">
            Hello, {user?.name ?? 'Explorer'}
          </Text>
        </View>

        {/* Featured section placeholder */}
        <Text className="section-title">Featured EcoServices</Text>
        <View className="card mb-4">
          <Text className="text-gray-400">
            {/* TODO: Replace with FeaturedServicesOrganism component */}
            Featured services will render here.
          </Text>
        </View>

        {/* Categories placeholder */}
        <Text className="section-title">Browse Categories</Text>
        <View className="card">
          <Text className="text-gray-400">
            {/* TODO: Replace with CategoryGridMolecule */}
            Category grid goes here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

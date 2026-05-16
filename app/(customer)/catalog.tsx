import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Customer Catalog Screen — browse & search EcoServices */
export default function CatalogScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">Discover EcoServices</Text>
      <View className="card">
        <Text className="text-gray-400">
          {/* TODO: SearchBar (atom) + FilterChips (molecule) + ServiceList (organism) */}
        </Text>
      </View>
    </SafeAreaView>
  );
}

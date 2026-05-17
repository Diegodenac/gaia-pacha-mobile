import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EcoServiceProductsScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">Products</Text>
      <View className="card mt-4">
        <Text className="text-gray-400 text-sm">Coming soon — manage your product inventory.</Text>
      </View>
    </SafeAreaView>
  );
}

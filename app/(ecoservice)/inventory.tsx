import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** EcoService Inventory Screen — manage products and services */
export default function InventoryScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">My Inventory</Text>
      <View className="card">
        <Text className="text-gray-400">
          {/* TODO: useMyInventoryQuery + ProductCardMolecule grid + FAB to add new product */}
        </Text>
      </View>
    </SafeAreaView>
  );
}

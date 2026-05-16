import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Customer Orders Screen — order history and status tracking */
export default function CustomerOrdersScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">My Orders</Text>
      <View className="card">
        <Text className="text-gray-400">
          {/* TODO: useCustomerOrdersQuery + OrderCardMolecule list */}
        </Text>
      </View>
    </SafeAreaView>
  );
}

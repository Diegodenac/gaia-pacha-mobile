import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** EcoService Orders Screen — manage incoming customer orders */
export default function EcoServiceOrdersScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">Incoming Orders</Text>
      <View className="card">
        <Text className="text-gray-400">
          {/* TODO: useServiceOrdersQuery + OrderManagementOrganism (accept/reject/complete) */}
        </Text>
      </View>
    </SafeAreaView>
  );
}

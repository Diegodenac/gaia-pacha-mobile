import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** EcoService Insights Screen — sales analytics and eco-impact metrics */
export default function InsightsScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">Insights & Analytics</Text>
      <View className="card">
        <Text className="text-gray-400">
          {/* TODO: useSalesMetricsQuery + charts (react-native-svg charts) */}
          Sales charts and eco-impact reports will render here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

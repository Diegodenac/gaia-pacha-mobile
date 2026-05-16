import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';

/**
 * EcoService Dashboard Screen
 *
 * AI Hint: This screen shows KPIs (sales today, pending orders, revenue).
 * Data comes from useSalesMetricsQuery() in
 * src/features/ecoservice/dashboard/hooks/useSalesMetricsQuery.ts
 */
export default function EcoServiceDashboardScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="screen-container">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-gray-400 font-sans text-sm">Welcome back 🌱</Text>
          <Text className="text-white font-bold text-2xl mt-1">{user?.name}</Text>
        </View>

        {/* KPI Cards placeholder */}
        <Text className="section-title">Today's Overview</Text>
        <View className="flex-row gap-3 mb-6">
          {/* TODO: Replace with KpiCardMolecule components */}
          {['Orders', 'Revenue', 'Views'].map((kpi) => (
            <View key={kpi} className="card flex-1">
              <Text className="text-gray-400 text-xs">{kpi}</Text>
              <Text className="text-white font-bold text-xl mt-1">—</Text>
            </View>
          ))}
        </View>

        {/* Recent orders placeholder */}
        <Text className="section-title">Recent Orders</Text>
        <View className="card">
          <Text className="text-gray-400">
            {/* TODO: useServiceOrdersQuery + OrderRowMolecule */}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

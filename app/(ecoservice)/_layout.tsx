import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

/**
 * EcoService Tab Group Layout
 *
 * Tabs:
 *  - index     → Dashboard / Analytics Overview
 *  - inventory → Product & Service Inventory Management
 *  - orders    → Incoming Orders Management
 *  - insights  → Sales Metrics & Eco Impact Reports
 *  - profile   → EcoService Profile & Settings
 *
 * Performance: lazy={true} — non-active tabs load on first visit.
 *
 * AI Hint: This group is completely independent from (customer).
 * Develop EcoService features here without touching customer files.
 */
export default function EcoServiceLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // Auth guard — redirect if not logged in or wrong role
  if (!isAuthenticated || user?.role !== 'ecoservice') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: COLORS.raised,
          borderTopColor:  COLORS.border,
          borderTopWidth:  1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
        },
        lazy: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

/**
 * Customer Tab Group Layout
 *
 * Tabs:
 *  - index   → Home  (enterprise discovery)
 *  - catalog → Explore (product catalog + search)
 *  - profile → Profile & settings
 *
 * No auth guard — customers browse anonymously by default.
 * Hidden routes (map, orders, producto/[id]) are kept as files
 * but excluded from the tab bar via href: null.
 */
export default function CustomerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: COLORS.raised,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden routes — accessible via Link/router.push but not shown in tab bar */}
      <Tabs.Screen name="map"          options={{ href: null }} />
      <Tabs.Screen name="orders"       options={{ href: null }} />
      <Tabs.Screen name="producto/[id]" options={{ href: null }} />
    </Tabs>
  );
}

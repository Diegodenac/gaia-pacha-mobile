import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

/**
 * Customer Tab Group Layout
 *
 * Tabs:
 *  - index    → Home / Explorer Feed  ← Entry point in demo mode
 *  - catalog  → Browse & Search EcoServices
 *  - map      → Nearby Services Map
 *  - orders   → My Orders & History
 *  - profile  → Customer Profile & Settings
 *
 * DEMO MODE (feature-explorer branch):
 *  Auth guard is disabled — unauthenticated users can access all Customer tabs.
 *  To re-enable, uncomment the guard block inside CustomerLayout().
 *
 * Performance notes:
 *  - `lazy={true}` defers rendering non-active tabs until first visit
 *  - Tab state is preserved on switch via Expo Router default behaviour
 *
 * AI Hint: Add customer-specific tabs here only. EcoService tabs live in
 * app/(ecoservice)/_layout.tsx. Never cross-import between groups.
 */
export default function CustomerLayout() {
  // Auth guard DISABLED for demo mode.
  // To re-enable, replace this block with:
  //   const { isAuthenticated, user } = useAuthStore();
  //   if (!isAuthenticated || user?.role !== 'customer') {
  //     return <Redirect href="/(auth)/login" />;
  //   }

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
        lazy: true, // lazy-load non-active tabs
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
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
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
    </Tabs>
  );
}

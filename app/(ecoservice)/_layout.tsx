import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

/**
 * EcoService Tab Group Layout
 *
 * Tabs:
 *  - index      → Home (dashboard overview)
 *  - explore    → Explore (marketplace browse)
 *  - profile    → Profile & business settings
 *  - pdp-editor → PDP Editor (product detail page builder)
 *  - products   → Products (inventory management)
 *
 * Access: real EcoService users OR dev preview toggle from Customer Profile.
 * Hidden routes (inventory, orders, insights) kept as files, href: null.
 */
export default function EcoServiceLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const { previewAsEcoService } = useDevStore();

  const isAllowed = (isAuthenticated && user?.role === 'ecoservice') || previewAsEcoService;

  if (!isAllowed) {
    return <Redirect href="/(auth)/login" />;
  }

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
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pdp-editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden routes — kept as files but not shown in tab bar */}
      <Tabs.Screen name="inventory" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="insights" options={{ href: null }} />
    </Tabs>
  );
}

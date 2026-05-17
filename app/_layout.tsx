import '../src/styles/global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { queryClient } from '@/lib/queryClient';
import { COLORS } from '@/constants';

// Prevent auto-hide until fonts are ready
SplashScreen.preventAutoHideAsync();

/**
 * Root Layout — entry point for Expo Router.
 *
 * Responsibilities:
 *  1. Load custom fonts (Inter family)
 *  2. Bootstrap TanStack Query client
 *  3. Wrap everything in GestureHandlerRootView (required by react-native-gesture-handler)
 *  4. Define the root Stack navigator (auth + profile groups are children)
 *
 * AI Hint: The auth guard lives in app/(auth)/_layout.tsx and each profile
 * group has its own _layout.tsx. Do NOT add business logic here.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Root index — handles auth/role redirect logic */}
              <Stack.Screen name="index" />
              {/* Enterprise detail — full-screen, no tab bar */}
              <Stack.Screen name="enterprise/[id]" options={{ animation: 'slide_from_right' }} />
              {/* Customer tab group */}
              <Stack.Screen name="(customer)" />
              {/* EcoService tab group */}
              <Stack.Screen name="(ecoservice)" />
              {/* Auth group — unauthenticated routes */}
              <Stack.Screen name="(auth)" />
              {/* EcoService registration wizard — full-screen modal */}
              <Stack.Screen name="ecoservice-registration" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
          </SafeAreaView>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

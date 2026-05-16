import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Auth group layout — wraps all unauthenticated screens.
 *
 * Guard: If user is already authenticated, redirect to the correct
 * profile group immediately (prevents back-navigation to login).
 */
export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // Already logged in — send to correct group
  if (isAuthenticated && user) {
    return <Redirect href={user.role === 'ecoservice' ? '/(ecoservice)' : '/(customer)'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#0d1117' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}

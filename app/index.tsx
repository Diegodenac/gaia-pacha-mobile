import { Redirect } from 'expo-router';

/**
 * App root index — entry point redirect.
 *
 * DEMO MODE (feature-explorer branch):
 *  All users land directly on the Explorer Tab (Customer Home) without login.
 *  Auth/role guard is disabled for hackathon demo purposes.
 *
 * To restore auth-gated routing, uncomment the block below and remove
 * the unconditional redirect:
 *
 *   import { useAuthStore } from '@/store/authStore';
 *   const { isAuthenticated, user } = useAuthStore();
 *   if (!isAuthenticated || !user) return <Redirect href="/(auth)/login" />;
 *   if (user.role === 'ecoservice') return <Redirect href="/(ecoservice)" />;
 *   return <Redirect href="/(customer)" />;
 *
 * AI Hint: This file ONLY redirects. Keep zero business logic here.
 */
export default function Index() {
  // 🚀 Demo mode: skip login, go straight to the Explorer Tab
  return <Redirect href="/(customer)" />;
}

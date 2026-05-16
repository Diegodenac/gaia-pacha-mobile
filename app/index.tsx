import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * App root index — acts as the auth/role guard.
 *
 * Routing logic:
 *  - Not authenticated → redirect to /(auth)/login
 *  - Role 'customer'   → redirect to /(customer)
 *  - Role 'ecoservice' → redirect to /(ecoservice)
 *
 * AI Hint: This file ONLY redirects. Keep zero business logic here.
 * The actual tab layouts are in their respective group _layout.tsx files.
 */
// DEV ONLY: go straight to customer home without logging in
const ENABLE_HOME_PREVIEW = true;

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  if (ENABLE_HOME_PREVIEW) {
    return <Redirect href="/(customer)" />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === 'ecoservice') {
    return <Redirect href="/(ecoservice)" />;
  }

  return <Redirect href="/(customer)" />;
}

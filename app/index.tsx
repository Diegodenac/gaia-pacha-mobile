import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * App root index — auth/role guard.
 *
 * Routing logic:
 *  - Not authenticated → /(customer)  (guests browse as anonymous customers)
 *  - Role 'ecoservice' → /(ecoservice)
 *  - Role 'customer'   → /(customer)
 *
 * AI Hint: This file ONLY redirects. Keep zero business logic here.
 */
export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role === 'ecoservice') {
    return <Redirect href="/(ecoservice)" />;
  }

  return <Redirect href="/(customer)" />;
}

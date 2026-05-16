import { apiClient } from '@/lib/apiClient';
import type { AuthUser } from '@/types';

// ─── Auth Repository ─────────────────────────────────────────────────────────
/**
 * Auth Repository — all authentication API calls.
 *
 * This is the ONLY place that talks to the auth endpoints.
 * Stores / hooks / screens must use this via useAuthStore actions.
 *
 * AI Hint: Replace the [Service Provider/Hosting] placeholders with actual
 * endpoints once the backend URL is defined. The structure (login/register/logout)
 * remains the same regardless of provider (Firebase, Supabase, custom API).
 */
export const authRepository = {
  /**
   * POST /auth/login
   * Returns { user, token }
   */
  login: async (email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiClient.post<{ data: { user: AuthUser; token: string } }>(
      '/auth/login',
      { email, password },
    );
    return response.data.data;
  },

  /**
   * POST /auth/register
   * Creates a new account; role is sent from the registration form.
   */
  register: async (
    name: string,
    email: string,
    password: string,
    role: 'customer' | 'ecoservice',
  ): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiClient.post<{ data: { user: AuthUser; token: string } }>(
      '/auth/register',
      { name, email, password, role },
    );
    return response.data.data;
  },

  /**
   * POST /auth/logout
   * Invalidates the token on the server.
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout').catch(() => {
      // Ignore network errors on logout — token is cleared client-side regardless
    });
  },

  /**
   * GET /auth/me
   * Fetch authenticated user profile (used for session validation on app start).
   */
  getMe: async (): Promise<AuthUser> => {
    const response = await apiClient.get<{ data: AuthUser }>('/auth/me');
    return response.data.data;
  },

  /**
   * POST /auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },
};

import { apiClient } from '@/lib/apiClient';
import type { AuthUser } from '@/types';

export const authRepository = {
  login: async (email: string, password: string): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiClient.post<{ data: { user: AuthUser; token: string } }>(
      '/auth/login',
      { email, password },
    );
    return response.data.data;
  },

  register: async (
    email: string,
    password: string,
    role: 'customer' | 'ecoservice',
  ): Promise<{ user: AuthUser; token: string }> => {
    const response = await apiClient.post<{ data: { user: AuthUser; token: string } }>(
      '/auth/register',
      { email, password, role },
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout').catch(() => {});
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await apiClient.get<{ data: AuthUser }>('/auth/me');
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type { AuthUser, AuthState } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { authRepository } from '@/repositories/auth.repository';

// ─── SecureStore Adapter for Zustand Persist ─────────────────────────────────
const secureStorage = {
  getItem: async (key: string) => await SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
};

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AuthStore extends AuthState {
  login:    (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'customer' | 'ecoservice') => Promise<void>;
  logout:   () => Promise<void>;
  setUser:  (user: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authRepository.login(email, password);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, role) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authRepository.register(email, password, role);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await authRepository.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name:    STORAGE_KEYS.AUTH_TOKEN,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

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

/**
 * Auth Store — global authentication state with secure persistence.
 *
 * AI Hint: This store:
 *  1. Persists the token to Expo SecureStore (encrypted on-device)
 *  2. Exposes `login` and `logout` actions that delegate to authRepository
 *  3. Drives the role-based navigation guard in app/index.tsx
 *
 * To add a new auth action: add the method to AuthStore interface,
 * implement it inside create(), then call the matching repository function.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── Initial State ─────────────────────────────────────────────────────
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,

      // ── Actions ───────────────────────────────────────────────────────────
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
      // Only persist token + user — isLoading is ephemeral
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

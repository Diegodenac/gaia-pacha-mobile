import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';

/**
 * Configured Axios instance — shared by all repositories.
 *
 * Features:
 *  - Base URL from app constants (overridden per EAS build profile)
 *  - Request interceptor: auto-attaches Bearer token from Zustand auth store
 *  - Response interceptor: handles 401 → auto-logout
 *
 * IMPORTANT: Uses lazy getter pattern to avoid require cycle with authStore.
 * authStore is imported lazily inside interceptors (not at module top-level).
 *
 * AI Hint: Import `apiClient` in any repository file.
 * Never use axios.get/post directly — always use this instance.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ─── Request Interceptor: attach auth token ───────────────────────────────────
// Use lazy require pattern to break circular dependency: authStore → auth.repo → apiClient → authStore
apiClient.interceptors.request.use(
  (config) => {
    // Lazy import inside callback — never at module top-level
    const { useAuthStore } = require('@/store/authStore') as typeof import('@/store/authStore');
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: handle 401 ────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired — force logout
      // Lazy import inside callback to break circular dependency
      const { useAuthStore } = require('@/store/authStore') as typeof import('@/store/authStore');
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

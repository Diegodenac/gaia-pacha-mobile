import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';
import { useAuthStore } from '@/store/authStore';

/**
 * Configured Axios instance — shared by all repositories.
 *
 * Features:
 *  - Base URL from app constants (overridden per EAS build profile)
 *  - Request interceptor: auto-attaches Bearer token from Zustand auth store
 *  - Response interceptor: handles 401 → auto-logout
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
apiClient.interceptors.request.use(
  (config) => {
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
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

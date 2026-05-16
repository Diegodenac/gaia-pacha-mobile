import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/constants';

/**
 * Configured Axios instance — shared by all repositories.
 *
 * Features:
 *  - Base URL from app constants (overridden per EAS build profile)
 *  - Request interceptor: auto-attaches Bearer token via lazy getter
 *  - Response interceptor: handles 401 → auto-logout via lazy callback
 *
 * ── Require-Cycle Fix ─────────────────────────────────────────────────────────
 * apiClient MUST NOT import authStore directly. That creates:
 *   authStore → auth.repository → apiClient → authStore  (cycle)
 *
 * Instead, authStore calls `registerTokenGetter` and `registerLogoutHandler`
 * after the store is created, injecting the references lazily.
 * The interceptors use these references at call-time, not at import-time.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * AI Hint: Import `apiClient` in any repository file.
 * Never use axios.get/post directly — always use this instance.
 */

// Lazy references — populated by authStore after it initialises
let _getToken:   () => string | null    = () => null;
let _onLogout:   () => Promise<void>    = () => Promise.resolve();

/** Called once by authStore after the store is created. */
export function registerTokenGetter(fn: () => string | null): void {
  _getToken = fn;
}

/** Called once by authStore after the store is created. */
export function registerLogoutHandler(fn: () => Promise<void>): void {
  _onLogout = fn;
}

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
    const token = _getToken();
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
  async (error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      await _onLogout();
    }
    return Promise.reject(error);
  },
);


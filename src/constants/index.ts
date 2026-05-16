// ─── App Constants ────────────────────────────────────────────────────────────

/** Base API URL — override per EAS build profile */
export const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_URL as string) ?? '[YOUR_API_BASE_URL]';

/** App version */
export const APP_VERSION = '1.0.0';

// ─── Async Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN:  '@gaia_pacha/auth_token',
  USER_PROFILE:'@gaia_pacha/user_profile',
  USER_ROLE:   '@gaia_pacha/user_role',
  ONBOARDED:   '@gaia_pacha/onboarded',
} as const;

// ─── TanStack Query Keys ──────────────────────────────────────────────────────
/**
 * Centralised query key factory.
 * Always use these to ensure cache invalidation works correctly.
 *
 * AI Prompt Hint: When adding a new feature, add its keys here first,
 * then reference them in the feature's repository hook.
 */
export const QUERY_KEYS = {
  // Auth
  me: ['auth', 'me'] as const,

  // Customer
  catalog:       (filters?: Record<string, unknown>) => ['catalog', filters] as const,
  productDetail: (id: string)                         => ['product', id]     as const,
  customerOrders:(customerId: string)                 => ['orders', 'customer', customerId] as const,
  nearbyServices:(lat: number, lng: number)           => ['services', 'nearby', lat, lng]   as const,

  // EcoService
  myInventory:  (serviceId: string) => ['inventory', serviceId]        as const,
  serviceOrders:(serviceId: string) => ['orders', 'service', serviceId] as const,
  salesMetrics: (serviceId: string) => ['metrics', serviceId]          as const,

  // Explorer Feed (Customer Home Tab)
  explorerFeed: (filters?: Record<string, unknown>) =>
    ['explorer', 'feed', filters] as const,
} as const;

// ─── Cache Time Policies (milliseconds) ──────────────────────────────────────
export const CACHE_TIMES = {
  /** Data that rarely changes (user profile, categories) */
  LONG:    1000 * 60 * 30,   // 30 minutes
  /** Standard product/catalog data */
  MEDIUM:  1000 * 60 * 10,   // 10 minutes
  /** Live data like order status */
  SHORT:   1000 * 60 * 2,    // 2 minutes
  /** Refetch interval for real-time-ish data */
  POLLING: 1000 * 30,        // 30 seconds
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ─── Design Tokens (mirrors tailwind.config.js) ───────────────────────────────
/** Use these in StyleSheet.create when className alone is insufficient */
export const COLORS = {
  primary:   '#22c55e',
  earth:     '#e87010',
  surface:   '#0d1117',
  raised:    '#161b22',
  overlay:   '#21262d',
  border:    '#30363d',
  white:     '#ffffff',
  error:     '#ef4444',
  warning:   '#f59e0b',
  success:   '#22c55e',

  // ─── Explorer Tab Design Tokens (per feature spec) ────────────────────────
  /** Explorer screen background — distinct from main surface */
  explorerBg:      '#191616',
  /** Explorer card surface — slightly lighter than bg for elevation */
  explorerSurface: '#333333',
  /** Mid-green for EcoService badges and CO2 labels */
  greenMid:        '#74A643',
  /** Dark green for CO2 badge background */
  greenDark:       '#3A5B13',
  /** Medium-emphasis text on Explorer cards */
  textMedium:      '#9E9E9E',
} as const;

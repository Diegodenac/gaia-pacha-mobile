// ─── User Profile Roles ───────────────────────────────────────────────────────
/**
 * UserRole defines the two distinct profile types in the app.
 * This drives tab group routing at the root layout level.
 */
export type UserRole = 'customer' | 'ecoservice';

// ─── Auth State ───────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// ─── EcoService / Green Entrepreneurship Types ────────────────────────────────
export interface EcoService {
  id: string;
  name: string;
  description: string;
  category: EcoCategory;
  imageUrl: string;
  ownerId: string;
  location: GeoLocation;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tags: string[];
  createdAt: string;
}

export type EcoCategory =
  | 'recycling'
  | 'organic_food'
  | 'renewable_energy'
  | 'sustainable_fashion'
  | 'eco_tourism'
  | 'green_transport'
  | 'other';

// ─── Product / Catalog Types ──────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrls: string[];
  ecoServiceId: string;
  category: EcoCategory;
  stockQuantity: number;
  isAvailable: boolean;
  sustainabilityScore?: number; // 0-100
  tags: string[];
  createdAt: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  ecoServiceId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

// ─── Geolocation ──────────────────────────────────────────────────────────────
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

// ─── UI Component Helpers ─────────────────────────────────────────────────────
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ColorScheme = 'light' | 'dark';

// ─── Explorer / Mixed Feed Types ─────────────────────────────────────────────
/**
 * ExplorerItemType — discriminates between a normalised Product and EcoService
 * in the unified Explorer feed.
 *
 * MVP Note: The repository maps both catalog entities into this shape.
 * When the real /explorer/feed endpoint is ready, only the repository body
 * changes — all UI types and components remain untouched.
 */
export type ExplorerItemType = 'product' | 'ecoservice';

/** Active filter key for the Explorer filter pill bar */
export type ExplorerFilter =
  | 'all'
  | 'near_me'
  | 'products'
  | 'ecoservices'
  | 'carbon'
  | 'price';

/**
 * ExplorerItem — normalised, presentation-ready shape for the staggered feed.
 * Both Product and EcoService are mapped into this by the explorer repository.
 */
export interface ExplorerItem {
  id:           string;
  type:         ExplorerItemType;
  title:        string;
  imageUrl:     string;
  location?:    string;
  /** e.g. "CO2 -25%" — derived from sustainabilityScore for MVP */
  co2Reduction?: string;
  /** Formatted price string, present only for 'product' items */
  priceLabel?:  string;
  ecoCategory:  EcoCategory;
  isVerified:   boolean;
  /** Original entity references — used for detail navigation */
  rawProduct?:     Product;
  rawEcoService?:  EcoService;
}

/**
 * ExplorerFilters — query params passed from the screen down to the repository.
 * Client-side filtering is applied for the MVP; the shape is API-compatible
 * for future server-side filtering.
 */
export interface ExplorerFilters {
  search?:       string;
  type?:         ExplorerItemType | 'all';
  region?:       string;
  carbonFocus?:  boolean;
  priceSort?:    boolean;
  page?:         number;
  perPage?:      number;
}

// ─── Navigation Param Types (Expo Router typed routes) ────────────────────────
export type RootParamList = {
  '/(auth)/login': undefined;
  '/(auth)/register': undefined;
  '/(auth)/forgot-password': undefined;
  '/(customer)': undefined;           // Explorer Tab (Home)
  '/(customer)/catalog': undefined;
  '/(customer)/map': undefined;
  '/(customer)/orders': undefined;
  '/(customer)/profile': undefined;
  '/(ecoservice)': undefined;
  '/(ecoservice)/dashboard': undefined;
  '/(ecoservice)/inventory': undefined;
  '/(ecoservice)/orders': undefined;
  '/(ecoservice)/profile': undefined;
};

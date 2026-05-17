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
  categoryName?: string;
  enterpriseName?: string;
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

// ─── Navigation Param Types (Expo Router typed routes) ────────────────────────
export type RootParamList = {
  '/(auth)/login': undefined;
  '/(auth)/register': undefined;
  '/(auth)/forgot-password': undefined;
  '/(customer)': undefined;
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

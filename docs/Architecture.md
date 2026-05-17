# Mobile Application Architecture

## Architecture Philosophy

The Gaia Pacha mobile application follows a **Feature-First architecture combined with Clean Architecture principles**, emphasizing vertical slicing and separation of concerns.

### Design Principles

1. **Feature-First Organization**: Features are grouped in their own folders with related logic (components, hooks, types)
2. **Atomic Design**: UI components follow a hierarchy from atoms (basic) to pages (full screens)
3. **Dependency Rule**: Direction flows inward - UI → Hooks → Repositories → API Client. No circular dependencies.
4. **Clean Layers**: Strict boundaries between presentation (UI), business logic (hooks), and data access (repositories)

---

## File Organization

### Root Structure
```
mobile-project/
├── app/                      # Expo Router - file-based navigation
├── src/                      # Shared source code
├── docs/                     # Documentation
├── assets/                   # Static assets (images, fonts)
└── package.json
```

### App Directory (Navigation Structure)

```
app/
├── (auth)/                   # Auth Stack (login, register, forgot password)
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (customer)/               # Customer Profile Navigation
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── home.tsx          # Customer home feed
│   │   ├── explore.tsx       # Browse EcoServices/Products
│   │   ├── profile.tsx       # Customer profile settings
│   │   └── orders.tsx        # Order history (planned)
│   └── [id]/
│       └── product.tsx       # Product detail page
├── (ecoservice)/             # EcoService Profile Navigation
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── home.tsx          # EcoService home dashboard
│   │   ├── products.tsx      # Manage products
│   │   ├── profile.tsx       # EcoService profile settings
│   │   └── analytics.tsx     # Performance analytics (planned)
│   └── product-edit.tsx      # PDP (Product Detail Page) editor
└── _layout.tsx               # Root layout with auth guard
```

### Src Directory (Business Logic & Components)

```
src/
├── components/               # Reusable UI components (Atomic Design)
│   ├── atoms/                # Basic building blocks (Button, Input, Text, Icon)
│   ├── molecules/            # Composite components (Card, Header, Footer, ProductCard)
│   ├── organisms/            # Complex sections (ProductGrid, SearchBar, Navigation)
│   └── templates/            # Page templates (AuthTemplate, HomeTemplate)
├── features/                 # Feature-specific hooks & business logic
│   ├── auth/
│   │   ├── useAuth.ts        # Auth state & login/register logic
│   │   ├── useSession.ts     # Session management, token refresh
│   │   └── types.ts
│   ├── customer/
│   │   ├── useCustomerProducts.ts    # Fetch customer-visible products
│   │   ├── useEcoServices.ts         # Fetch & filter EcoServices
│   │   ├── useRecommendations.ts     # Call recommendation engine
│   │   └── types.ts
│   └── ecoservice/
│       ├── useEcoServiceProfile.ts   # EcoService profile management
│       ├── useProductManagement.ts   # CRUD operations for products
│       ├── useFileUpload.ts          # Image/file uploads
│       └── types.ts
├── repositories/             # Data access layer (API calls)
│   ├── authRepository.ts     # login, register, logout
│   ├── productRepository.ts  # Product CRUD operations
│   ├── ecoserviceRepository.ts
│   ├── recommendationRepository.ts
│   ├── uploadRepository.ts
│   └── index.ts              # Barrel export
├── store/                    # Zustand global state
│   ├── authStore.ts          # User auth state, tokens
│   ├── devStore.ts           # Developer/debug settings
│   ├── ecoserviceStore.ts    # Current EcoService context
│   └── index.ts
├── lib/                      # Singletons & utilities
│   ├── apiClient.ts          # Axios instance with interceptors
│   ├── queryClient.ts        # TanStack Query configuration
│   ├── secureStore.ts        # Token & credential storage
│   └── helpers.ts            # Date formatting, validation, etc.
├── types/                    # TypeScript interfaces
│   ├── user.ts
│   ├── product.ts
│   ├── ecoservice.ts
│   ├── recommendation.ts
│   └── index.ts
└── constants/                # App-wide constants
    ├── queryKeys.ts          # TanStack Query keys
    ├── cacheTimes.ts         # Cache durations
    ├── colors.ts             # Design colors
    ├── routes.ts             # Route paths
    └── apiEndpoints.ts       # Backend URL segments
```

---

## Data Flow Architecture

### Request/Response Cycle

```
UI Component (Screen or Molecule)
    ↓
Custom Hook (useCustomerProducts)
    ↓ (calls)
Repository (productRepository.getAll())
    ↓ (calls)
API Client (axios instance)
    ↓ (HTTP GET)
Backend API (Express server)
    ↓
PostgreSQL Database
    ↓ (Response)
API Client (process response, error handling)
    ↓
Repository (transform data if needed)
    ↓
TanStack Query (cache in browser memory)
    ↓
Custom Hook (return { data, isLoading, error })
    ↓
UI Component (render with loading/error states)
```

### State Management Strategy

1. **Server State** (TanStack Query)
   - Products, EcoServices, recommendations
   - Automatically cached (5 min default TTL)
   - Refetches on focus, online event
   - Handles deduplication, background updates

2. **Client State** (Zustand)
   - Auth tokens, user profile
   - Current selected profile (Customer vs EcoService)
   - UI toggles, filters
   - Persisted to SecureStore on mobile

3. **UI State** (React State)
   - Form inputs, loading spinners, modals
   - Local component state only
   - No persistence

### Example: Fetching Product List

```typescript
// In React Component
const { data: products, isLoading } = useCustomerProducts()

// Hook implementation (features/customer/useCustomerProducts.ts)
export function useCustomerProducts() {
  const { token } = useAuthStore()
  return useQuery({
    queryKey: ['products', 'customer'],
    queryFn: () => productRepository.getCustomerProducts(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Repository (repositories/productRepository.ts)
export async function getCustomerProducts() {
  const { data } = await apiClient.get('/products?customer=true')
  return data
}

// API Client (lib/apiClient.ts)
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
})

// Interceptor: automatically adds JWT token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## Key Design Patterns

### 1. Custom Hooks for Business Logic
- Centralize API calls and data transformation
- Reusable across multiple components
- Easy to test in isolation

### 2. Repository Pattern
- Single source of truth for API calls
- Decouples components from API details
- Simplifies mocking for tests

### 3. TanStack Query for Server State
- Automatic caching & background sync
- Optimistic updates
- Handles stale-while-revalidate pattern
- Built-in retry logic

### 4. Zustand for Global Client State
- Lightweight alternative to Redux
- Minimal boilerplate
- Selectors for computed state
- Middleware for persistence (SecureStore)

### 5. Atomic Design for UI Components
- **Atoms**: Button, Input, Text, Icon, Badge
- **Molecules**: Card, ProductCard, Header, Footer
- **Organisms**: ProductGrid, SearchBar, Navigation
- **Templates**: AuthTemplate, HomeTemplate
- Enables design system consistency

---

## Authentication & Authorization

### Auth Flow

1. **Registration/Login**
   - User submits email + password
   - Backend hashes password, issues JWT token (30-day expiration)
   - Token stored in SecureStore (encrypted, platform-native)

2. **Session Management**
   - JWT token included in `Authorization: Bearer {token}` header
   - Axios interceptor handles token injection
   - Token refresh on expiration (if endpoint supports it)

3. **Multi-Profile System**
   - User can be both Customer AND EcoService
   - Profile toggle switches `authStore.currentProfile`
   - Routes guard based on profile type

### SecureStore Integration

```typescript
// Storing token
await SecureStore.setItemAsync('jwt_token', token)

// Retrieving token
const token = await SecureStore.getItemAsync('jwt_token')

// Clearing on logout
await SecureStore.deleteItemAsync('jwt_token')
```

---

## Multi-Profile Navigation

### Profile Toggle Architecture

```
User State: { id, email, name, userType: "customer" | "ecoservice" }

App Root Layout
  ├─ IF unauthenticated → (auth) stack
  ├─ IF customer profile → (customer) stack + tab navigation
  └─ IF ecoservice profile → (ecoservice) stack + tab navigation

Tab Navigation (Customer)
  ├─ Home (Customer home feed)
  ├─ Explore (Browse EcoServices)
  ├─ Orders (Order history - planned)
  └─ Profile (Customer settings)

Tab Navigation (EcoService)
  ├─ Home (EcoService dashboard)
  ├─ Products (Manage inventory)
  ├─ Analytics (Performance - planned)
  └─ Profile (EcoService settings)

Profile Switcher
  → Toggles authStore.currentProfile
  → Re-renders route stack
  → Clears profile-specific caches
```

---

## Component Communication

### Prop Drilling Prevention

Bad (prop drilling):
```typescript
<Screen
  user={user}
  onSelectProduct={onSelectProduct}
  onAddToCart={onAddToCart}
  // ... 10 more props passed through
>
  <NestedComponent prop1={prop1} prop2={prop2} ... />
</Screen>
```

Good (hooks + stores):
```typescript
// In deeply nested component
const { user } = useAuthStore()  // Direct access
const { addToCart } = useCart()  // Hook for logic
```

### Preferred Communication Patterns

1. **Presentation ← Hooks**: Components call hooks to get data
2. **Hooks ← Repositories**: Hooks use repository layer
3. **Repositories ← API Client**: Repositories make HTTP calls
4. **Zustand ← Components**: Components update global state
5. **Navigation ← Route Changes**: Expo Router handles navigation

---

## Dependency Direction

```
External (Backend API, Google Drive, etc.)
    ↑
API Client (Axios)
    ↑
Repositories (Data Access)
    ↑
Hooks (Business Logic)
    ↑
Components (Presentation)
    ↑
Screens (Route handlers)
```

Violations cause tight coupling and make testing difficult. Always maintain inward dependency direction.

---

## Error Handling Strategy

### API Errors

```typescript
// In repository
try {
  const { data } = await apiClient.get('/products')
  return data
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired, logout user
    authStore.logout()
  } else if (error.response?.status === 404) {
    // Resource not found
    throw new NotFoundError('Product not found')
  } else {
    // Generic server error
    throw new ServerError(error.message)
  }
}

// In component
const { data, error, isLoading } = useCustomerProducts()

if (error instanceof NotFoundError) {
  return <EmptyState message="No products found" />
} else if (error) {
  return <ErrorBoundary error={error} />
}
```

### Network Error Handling
- TanStack Query auto-retries failed requests (3 attempts)
- Exponential backoff between retries
- User sees stale data while retrying
- Manual refresh button available

---

## Performance Optimization

### Code Splitting
- Expo Router auto-splits by route
- Large features lazy-loaded on demand
- Reduces initial bundle size

### Image Optimization
- Use native Image component (not web img tag)
- Optimize before upload (resize, compress)
- Lazy load below-the-fold images

### Cache Strategy
- Products: 5 min (frequently accessed)
- User profile: 10 min (changes less often)
- Recommendations: Fresh on app launch (personalization)
- Search results: 2 min (user may refine)

### Memory Management
- Unsubscribe from listeners in useEffect cleanup
- Clear caches on logout
- Limit background fetch to WiFi/plugged-in

---

## Testing Architecture

### Unit Tests
- Test hooks in isolation with mock repositories
- Test components with mock hooks
- Test repositories with mock API client

### Integration Tests
- Test full feature flow (e.g., login → home → product detail)
- Use test database or mock server

### Example Test Structure

```typescript
// Hook test
describe('useCustomerProducts', () => {
  it('should fetch products and cache them', async () => {
    const { result } = renderHook(() => useCustomerProducts())
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => {
      expect(result.current.data).toEqual([...])
    })
  })
})

// Component test
describe('ProductCard', () => {
  it('should render product with image and title', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} />
    )
    expect(getByText('Product Title')).toBeTruthy()
  })
})
```

---

## Security Considerations

1. **Token Storage**: SecureStore (encrypted at rest)
2. **HTTPS Only**: All API calls must use HTTPS in production
3. **Input Validation**: React Hook Form + Zod validate before submission
4. **XSS Prevention**: No innerHTML usage, always sanitize user input
5. **CSRF**: Backend handles CSRF tokens if needed
6. **Sensitive Data**: Never log tokens, passwords, or PII

---

## Summary

The mobile architecture balances **scalability** (features can be added independently), **maintainability** (clear separation of concerns), and **developer experience** (intuitive folder structure). The combination of Expo Router (navigation), Zustand (state), TanStack Query (server state), and atomic components provides a solid foundation for rapid MVP development while remaining flexible for future enhancements.

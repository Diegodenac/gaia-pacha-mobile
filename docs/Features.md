# Mobile Application Features

## Overview

The Gaia Pacha mobile app is a React Native/Expo marketplace connecting customers with ecosystem service providers. The MVP supports two user profiles: Customer (consumer) and EcoService (provider) with distinct feature sets.

---

## Implemented Features

### Authentication & Authorization

- User registration with email and password
- Email/password-based login
- Secure JWT token management (30-day expiration)
- Token storage in SecureStore (encrypted, platform-native)
- Password reset (forgot password flow)
- Session management with automatic token validation
- Multi-profile support (user can be Customer AND EcoService)
- Auto-logout on token expiration

### Customer Profile Features

**Home Feed**
- Personalized recommendations from recommendation engine
- Recent ecosystem service updates
- Quick access to popular products
- Swipe through recommended items
- Pull-to-refresh functionality

**Explore / Browse**
- Search EcoServices by name or category
- Filter products by category
- Sort by price, rating, or relevance
- View detailed product information
- See EcoService profile and contact info
- Product image galleries

**Product Details**
- Full product information (name, description, price)
- Related products from same EcoService
- EcoService information and ratings
- Share product feature
- Add to wishlist (planned)
- Quick purchase flow (planned)

**Profile Management**
- Edit personal information
- View account details
- Manage preferences (notifications, language)
- View order history (planned)
- Change password
- Logout

**Anonymous Access**
- Browse products without login
- View EcoService catalogs
- Search and filter
- Requires login to purchase or interact

### EcoService Profile Features

**Dashboard / Home**
- Overview of profile status (pending, approved, suspended)
- Recent product interactions
- Performance metrics (views, clicks)
- Quick actions (add product, edit profile)
- Alert notifications

**Product Management**
- View all created products
- Create new product with:
  - Name and description
  - Price and inventory
  - Category assignment
  - Image upload
  - Variant management (optional)
- Edit existing products:
  - Update all fields
  - Replace images
  - Adjust pricing
  - Change availability
- Delete products
- View product performance metrics

**Product Image Upload**
- Take photo with camera
- Select from photo library
- Upload to cloud (Google Drive)
- Multiple images per product
- Image preview and crop

**Profile Management**
- Edit EcoService name and description
- Add business logo/cover image
- Manage contact information
- Set business hours
- View profile status and validation history
- Request support for issues

**Analytics & Insights** (Planned)
- View product performance
- Track customer interactions
- Monitor impressions and clicks
- Revenue statistics
- Popular products report

### Recommendation Engine Integration

- Calls BackAlgoritmo microservice on app launch
- Fetches personalized recommendations based on:
  - User's browsing history
  - Product categories viewed
  - Previous interactions
- 10 ecosystem services returned per request
- 20 product recommendations returned per request
- Results cached for session
- Manual refresh available

### Real-time Features

- Live product updates (when available)
- Notification system (planned)
- Chat with EcoServices (planned)
- Order status tracking (planned)

---

## Core Modules & Internal Dependencies

### Module: Authentication

**Key Files**
- `src/features/auth/useAuth.ts` - Login, register, logout logic
- `src/features/auth/useSession.ts` - Token management and session refresh
- `src/repositories/authRepository.ts` - API calls for auth endpoints

**Dependencies**
- Zustand (authStore) - Persist token and user state
- SecureStore - Encrypt tokens at rest
- Axios client - HTTP requests
- React Hook Form - Form handling
- Zod - Input validation

**Responsibilities**
- Handle registration/login/logout flows
- Manage JWT tokens
- Store credentials securely
- Validate user input
- Persist session across app restarts

### Module: Customer Features

**Key Files**
- `src/features/customer/useCustomerProducts.ts` - Fetch product list
- `src/features/customer/useEcoServices.ts` - Search and filter EcoServices
- `src/features/customer/useRecommendations.ts` - Call recommendation engine
- `src/repositories/productRepository.ts` - Product API calls
- `src/repositories/recommendationRepository.ts` - Recommendation API

**Dependencies**
- TanStack Query - Server state management and caching
- Zustand (authStore) - Get current user context
- Axios client - HTTP requests

**Responsibilities**
- Fetch products with filtering and pagination
- Search EcoServices
- Get personalized recommendations
- Cache results for performance
- Handle loading and error states

### Module: EcoService Management

**Key Files**
- `src/features/ecoservice/useEcoServiceProfile.ts` - Profile CRUD
- `src/features/ecoservice/useProductManagement.ts` - Product CRUD
- `src/features/ecoservice/useFileUpload.ts` - Image uploads
- `src/repositories/ecoserviceRepository.ts` - EcoService API
- `src/repositories/uploadRepository.ts` - Upload API

**Dependencies**
- TanStack Query - Server state for products/profile
- React Hook Form - Form inputs
- Zod - Validation
- Zustand (ecoserviceStore) - Current EcoService context
- Axios - HTTP requests
- SecureStore - Store upload credentials if needed

**Responsibilities**
- Create and edit EcoService profile
- CRUD operations for products
- Upload images to cloud
- Validate product data
- Sync local state with backend

### Module: API Integration

**Key Files**
- `src/lib/apiClient.ts` - Axios instance with config
- `src/repositories/*` - All repository modules
- `src/constants/apiEndpoints.ts` - Backend URL segments

**Dependencies**
- Axios - HTTP client
- Environment variables - API base URL
- SecureStore - Token injection via interceptor

**Responsibilities**
- Configure HTTP client
- Inject JWT tokens automatically
- Handle error responses
- Log requests/responses (dev only)
- Manage request/response transformation

### Module: State Management

**Key Files**
- `src/store/authStore.ts` - User and token state
- `src/store/ecoserviceStore.ts` - Current EcoService context
- `src/store/devStore.ts` - Developer settings

**Dependencies**
- Zustand - State management
- SecureStore - Persistent storage
- Immer (built into Zustand) - Immutable updates

**Responsibilities**
- Persist user tokens across sessions
- Store current user profile type
- Maintain global app state
- Sync state with SecureStore

### Module: UI Components

**Key Files**
- `src/components/atoms/*` - Basic components (Button, Text, Input, Card)
- `src/components/molecules/*` - Composite components (ProductCard, Header)
- `src/components/organisms/*` - Complex sections (ProductGrid, Navigation)
- `app/*` - Screen layouts using above components

**Dependencies**
- React Native - Core framework
- NativeWind - Tailwind CSS for styling
- Zustand (authStore) - Access user state for permission checks
- React Navigation - Available via Expo Router

**Responsibilities**
- Render UI
- Accept props from parent
- Trigger callbacks (no API calls)
- Maintain visual consistency

---

## Feature Dependency Graph

```
Authentication
    ↓
Customer Features ←→ Recommendations ←→ BackAlgoritmo Microservice
    ↓                   ↑
Product Management ←───┘
    ↓
File Upload ↔ Google Drive API
    ↓
EcoService Features
```

Key relationships:
1. All features require Authentication first (JWT token)
2. Customer features read from API, call recommendations
3. EcoService features write to API (create/edit products)
4. File uploads bypass normal API (direct to Google Drive)
5. Recommendations are optional (fallback to default list)

---

## Caching Strategy

### TanStack Query Cache Configuration

| Resource | Cache Duration | Refetch Behavior |
|----------|---|---|
| Products | 5 minutes | On mount, on window focus, manual refresh |
| Product Details | 10 minutes | On mount, on window focus |
| EcoServices | 5 minutes | On mount, on window focus |
| User Profile | 10 minutes | On mount, manual refresh |
| Recommendations | Session only | Fresh on app launch, can manual refresh |
| Search Results | 2 minutes | User refines query, manual refresh |

### Cache Invalidation

```typescript
// Invalidate product cache after editing
queryClient.invalidateQueries({ queryKey: ['products'] })

// Invalidate user profile after update
queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })

// Clear all caches on logout
queryClient.clear()
```

### Local Storage via SecureStore

```typescript
// Tokens (encrypted)
SecureStore.setItemAsync('jwt_token', token)

// User preferences (encrypted)
SecureStore.setItemAsync('user_preferences', JSON.stringify(prefs))
```

---

## Pending Features (Roadmap)

### Phase 2 - Order Management
- Place orders from EcoServices
- Track order status
- Delivery/fulfillment workflows
- Order history and re-ordering
- Ratings and reviews

### Phase 3 - Advanced Discovery
- Map view of nearby EcoServices
- Geolocation-based recommendations
- Distance filters and sorting
- Trending products

### Phase 4 - Engagement
- Messaging between Customer and EcoService
- Notifications (new products, order updates, recommendations)
- Wishlist and favorites
- User reviews and ratings
- Social sharing features

### Phase 5 - Analytics
- EcoService insights dashboard
- Customer behavior analytics
- Performance metrics export

---

## API Integration Points

### Backend Endpoints Used

| Feature | Method | Endpoint | Auth |
|---------|--------|----------|------|
| Register | POST | `/auth/register` | No |
| Login | POST | `/auth/login` | No |
| Logout | POST | `/auth/logout` | Yes |
| Get Products | GET | `/products?page=1&limit=10&category=X` | Optional |
| Get Product | GET | `/products/{id}` | Optional |
| Create Product | POST | `/products` | Yes |
| Update Product | PUT | `/products/{id}` | Yes |
| Delete Product | DELETE | `/products/{id}` | Yes |
| Get EcoService | GET | `/ecoservices/{id}` | Optional |
| Update EcoService | PUT | `/ecoservices/{id}` | Yes |
| Upload Image | POST | `/uploads` | Yes |
| Get Recommendations | GET | `/recommendations/ecoservices/{userId}` | Yes |

### Recommendation Engine Endpoints

| Feature | Method | Endpoint |
|---------|--------|----------|
| Top Categories | GET | `/api/recomendaciones/categorias/{id_customer}` |
| EcoServices | GET | `/api/recomendaciones/ecoservices/{id_customer}` |
| Products | GET | `/api/recomendaciones/productos/{id_customer}` |

---

## Technical Stack Summary

| Concern | Library | Version |
|---------|---------|---------|
| Framework | React Native | 0.81.5 |
| Runtime | Expo | SDK 54 |
| Routing | Expo Router | v6 |
| Styling | NativeWind | v4 |
| State | Zustand | v5 |
| Forms | React Hook Form | Latest |
| Validation | Zod | Latest |
| Server State | TanStack Query | v5 |
| HTTP | Axios | Latest |
| Storage | SecureStore | Expo SDK built-in |
| Build | EAS | Expo cloud service |

---

## Error Handling

### Common Error Scenarios

1. **Network Error** → TanStack Query retries 3x with exponential backoff
2. **401 Unauthorized** → Logout user, redirect to login
3. **404 Not Found** → Show empty state or error message
4. **500 Server Error** → Show retry button, alert admin
5. **Input Validation** → Display inline error messages via React Hook Form

### User Feedback

- Loading spinners while data fetches
- Toast notifications for success/error
- Empty states for no data
- Error screens with retry options
- Stale data indicators (e.g., "Last updated 5 min ago")

---

## Security Measures

1. **Token Storage**: Encrypted in SecureStore, never in plain text
2. **HTTPS Only**: All API calls use HTTPS in production
3. **Input Validation**: Zod validates before API submission
4. **Error Messages**: Don't leak sensitive info (e.g., "Invalid email or password" not "Email not found")
5. **Secure Image Upload**: Use authenticated endpoints, validate file types
6. **Biometric Auth**: SecureStore supports fingerprint/face unlock (optional feature)

---

## Performance Metrics

- App load time: <3 seconds
- Login: <2 seconds
- Product list fetch: <1 second (cached)
- Recommendation fetch: <3 seconds
- Image upload: <5 seconds depending on size

---

## Conclusion

The mobile app provides a solid MVP feature set for customers to discover ecoservices and for providers to list products. The architecture supports rapid feature development with clear separation between business logic (hooks), data access (repositories), and UI (components). See Architecture.md for technical details and Setup.md for local development guidance.

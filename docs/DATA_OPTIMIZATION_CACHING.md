# DATA_OPTIMIZATION_CACHING.md
## Data Optimization, Caching & State Management Guide

---

## 1. Two-Layer State Strategy

| System | Tool | Scope | Persistence |
|---|---|---|---|
| **Server State** | TanStack Query | API data (products, orders, services) | In-memory cache |
| **Client State** | Zustand | Auth session, UI preferences | SecureStore (device) |

> Never store server data in Zustand. Never store auth/UI state in TanStack Query.

---

## 2. TanStack Query — Configuration

```ts
// src/lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            CACHE_TIMES.MEDIUM,  // 10 min
      gcTime:               CACHE_TIMES.LONG,    // 30 min
      retry:                2,
      retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false,
      refetchOnMount:       true,
    },
  },
});
```

---

## 3. Cache Time Policies

| Constant | Value | Use For |
|---|---|---|
| `CACHE_TIMES.LONG` | 30 minutes | User profile, categories |
| `CACHE_TIMES.MEDIUM` | 10 minutes | Product catalog, service listings |
| `CACHE_TIMES.SHORT` | 2 minutes | Order status, inventory counts |
| `CACHE_TIMES.POLLING` | 30 seconds | EcoService incoming orders (refetchInterval) |

```ts
// Per-query override example
useQuery({
  queryKey:        QUERY_KEYS.customerOrders(userId),
  queryFn:         () => ordersRepository.getCustomerOrders(userId),
  staleTime:       CACHE_TIMES.SHORT,
  refetchInterval: CACHE_TIMES.POLLING,
});
```

---

## 4. QUERY_KEYS Factory

Centralized in `src/constants/index.ts`:

```ts
export const QUERY_KEYS = {
  me:             ['auth', 'me'],
  catalog:        (filters?) => ['catalog', filters],
  productDetail:  (id)       => ['product', id],
  customerOrders: (userId)   => ['orders', 'customer', userId],
  nearbyServices: (lat, lng) => ['services', 'nearby', lat, lng],
  myInventory:    (serviceId)=> ['inventory', serviceId],
  serviceOrders:  (serviceId)=> ['orders', 'service', serviceId],
  salesMetrics:   (serviceId)=> ['metrics', serviceId],
};
```

Centralized keys prevent typos that cause silent cache misses.

---

## 5. Repository Data Flow

```
Feature Hook
    ↓ calls
Repository (catalogRepository.getProducts)
    ↓ calls
apiClient (Axios + auth interceptor)
    ↓ calls
[Service Provider/Hosting, e.g., Firebase / Supabase / AWS / Custom Services]
```

```ts
// Repository pattern
export const catalogRepository = {
  getProducts: async (filters) => {
    const res = await apiClient.get('/catalog/products', { params: filters });
    return res.data.data;  // unwrap ApiResponse<T>
  },
};
```

---

## 6. Cache-First Behaviour

```
1. useQuery() called
2. Cache hit + not stale? → return cached data (no network)
3. Cache miss or stale?   → fetch from API → cache → return
4. Background refetch when stale (transparent to UI)
```

### No Loading Flash (placeholderData)
```ts
useQuery({
  queryKey:        QUERY_KEYS.catalog(filters),
  queryFn:         () => catalogRepository.getProducts(filters),
  placeholderData: (previousData) => previousData,  // keeps old data visible
});
```

---

## 7. Mutations & Cache Invalidation

```ts
// After creating an order, invalidate the orders cache
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: ordersRepository.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.customerOrders(userId!),
      });
    },
  });
}
```

---

## 8. EcoService Real-Time Orders

```ts
// Polling every 30 seconds for new incoming orders
refetchInterval: CACHE_TIMES.POLLING,
```

**Upgrade path:** Replace `refetchInterval` with a WebSocket or [Service Provider/Hosting] real-time listener without changing any component code.

---

## 9. Zustand Auth Persistence

```ts
persist(
  (set) => ({ ... }),
  {
    name:       STORAGE_KEYS.AUTH_TOKEN,
    storage:    createJSONStorage(() => secureStorage),  // Expo SecureStore
    partialize: (state) => ({ user, token, isAuthenticated }),
  }
)
```

Rehydrates from SecureStore before first render — no flicker, no manual token loading.

---

## 10. Adding a New Query — Checklist

```
[ ] 1. Add QUERY_KEYS entry in src/constants/index.ts
[ ] 2. Determine cache tier: LONG / MEDIUM / SHORT
[ ] 3. Add repository function in src/repositories/[domain].repository.ts
[ ] 4. Create hook: src/features/[profile]/[feature]/hooks/use[X]Query.ts
[ ] 5. Mutation: create useMutation + invalidate relevant query keys
[ ] 6. Import hook in the relevant screen/organism
```

# NAVIGATION_FLOWS.md
## Dynamic Navigation, Tab Best Practices & Routing Guide

---

## 1. Routing Architecture Overview

Expo Router uses file-system-based routing. Route groups (folders in parentheses) create isolated navigation namespaces without affecting the URL path.

```
app/
├── index.tsx              → "/"              (root guard)
├── (auth)/login.tsx       → "/(auth)/login"
├── (auth)/register.tsx    → "/(auth)/register"
├── (customer)/index.tsx   → "/(customer)"
├── (customer)/catalog.tsx → "/(customer)/catalog"
├── (customer)/map.tsx     → "/(customer)/map"
├── (customer)/orders.tsx  → "/(customer)/orders"
├── (customer)/profile.tsx → "/(customer)/profile"
├── (ecoservice)/index.tsx → "/(ecoservice)"
├── (ecoservice)/inventory.tsx
├── (ecoservice)/orders.tsx
├── (ecoservice)/insights.tsx
└── (ecoservice)/profile.tsx
```

---

## 2. Auth Guard & Role Redirect Flow

```
App Starts
    │
    ▼
app/index.tsx  (root guard)
    │
    ├─ isAuthenticated = false  ──→  /(auth)/login
    ├─ user.role = 'customer'   ──→  /(customer)
    └─ user.role = 'ecoservice' ──→  /(ecoservice)
```

### Root Guard
```tsx
// app/index.tsx
const { isAuthenticated, user } = useAuthStore();
if (!isAuthenticated || !user) return <Redirect href="/(auth)/login" />;
if (user.role === 'ecoservice')  return <Redirect href="/(ecoservice)" />;
return <Redirect href="/(customer)" />;
```

### Reverse Guard (prevents back-navigation to login)
```tsx
// app/(auth)/_layout.tsx
if (isAuthenticated && user) {
  return <Redirect href={user.role === 'ecoservice' ? '/(ecoservice)' : '/(customer)'} />;
}
```

### Per-Group Role Guard
```tsx
// app/(customer)/_layout.tsx
if (!isAuthenticated || user?.role !== 'customer') {
  return <Redirect href="/(auth)/login" />;
}
```

---

## 3. Tab Navigation Map

### Customer Tabs

| Tab | Route | Icon | Purpose |
|---|---|---|---|
| Home | `/(customer)` | `home-outline` | Featured services & discovery |
| Catalog | `/(customer)/catalog` | `search-outline` | Browse & search all EcoServices |
| Map | `/(customer)/map` | `map-outline` | Nearby services geolocation |
| Orders | `/(customer)/orders` | `receipt-outline` | Order history & tracking |
| Profile | `/(customer)/profile` | `person-outline` | Account settings & logout |

### EcoService Tabs

| Tab | Route | Icon | Purpose |
|---|---|---|---|
| Dashboard | `/(ecoservice)` | `grid-outline` | KPIs, sales overview |
| Inventory | `/(ecoservice)/inventory` | `cube-outline` | Manage products/services |
| Orders | `/(ecoservice)/orders` | `list-outline` | Accept/reject incoming orders |
| Insights | `/(ecoservice)/insights` | `bar-chart-outline` | Analytics & eco-impact |
| Profile | `/(ecoservice)/profile` | `storefront-outline` | Business profile & settings |

---

## 4. Performance: Lazy Loading & Tab State Persistence

### Lazy Loading
```tsx
<Tabs screenOptions={{ lazy: true }}>
```
Non-active screens are **not mounted** until first visit. Reduces startup time and memory.

### Tab State Persistence
Expo Router's `<Tabs>` preserves state across tab switches (screens are not unmounted).
- Scroll positions are retained
- Form drafts are retained
- Loaded data is retained (TanStack Query cache)

> Do NOT use `unmountOnBlur: true` unless absolutely required (e.g., camera screens).

---

## 5. Deep Linking Configuration

```json
// app.json
{ "expo": { "scheme": "gaiapacha" } }
```

| Deep Link | Resolves To |
|---|---|
| `gaiapacha://` | Root guard (role redirect) |
| `gaiapacha:///customer/catalog` | Customer Catalog tab |
| `gaiapacha:///ecoservice/orders` | EcoService Orders tab |
| `gaiapacha:///auth/login` | Login screen |

---

## 6. Programmatic Navigation

```tsx
import { useRouter } from 'expo-router';
const router = useRouter();

router.push('/(customer)/catalog');
router.push({ pathname: '/(customer)/catalog', params: { category: 'recycling' } });
router.replace('/(auth)/login');
router.back();
```

---

## 7. Adding a New Screen — Checklist

```
[ ] 1. Create .tsx file in the correct group (app/(profile)/new-screen.tsx)
[ ] 2. Tab: add <Tabs.Screen> in the group's _layout.tsx
[ ] 3. Modal/Stack: add <Stack.Screen> in the group's _layout.tsx
[ ] 4. Add route to RootParamList in src/types/index.ts
[ ] 5. Verify auth guard prevents unauthenticated access
```

---

## 8. Auth State on App Resume

When the app returns from background, Zustand rehydrates from SecureStore automatically.

- If token is expired → `apiClient.ts` 401 interceptor calls `logout()`
- Zustand clears `isAuthenticated` → root guard redirects to login

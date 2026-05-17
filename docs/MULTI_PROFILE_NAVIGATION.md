# Multi-Profile Navigation

## Overview

The app supports two distinct user profiles — **Customer** and **EcoService** — each with its own tab bar. Navigation is handled via two Expo Router route groups: `(customer)` and `(ecoservice)`.

---

## Profile Tab Structures

### Customer — 3 tabs

| Tab     | File                         | Screen                                                              |
|---------|------------------------------|---------------------------------------------------------------------|
| Home    | `app/(customer)/index.tsx`   | Enterprise discovery: hero, search, categories, paginated listing   |
| Explore | `app/(customer)/catalog.tsx` | Product catalog: 2-col grid, search, category chips, price bubble   |
| Profile | `app/(customer)/profile.tsx` | User card, dev EcoService preview switch, sign out                  |

Hidden routes (not in tab bar, still navigable via `Link`):
- `app/(customer)/producto/[id].tsx` — product detail, opened from Explore
- `app/(customer)/map.tsx` — preserved for future use
- `app/(customer)/orders.tsx` — preserved for future use

### EcoService — 5 tabs

| Tab        | File                              | Icon              | Screen                                                         |
|------------|-----------------------------------|-------------------|----------------------------------------------------------------|
| Home       | `app/(ecoservice)/index.tsx`      | `home-outline`    | Same as Customer Home — full enterprise discovery              |
| Explore    | `app/(ecoservice)/explore.tsx`    | `compass-outline` | Same as Customer Explore — full product catalog grid           |
| Profile    | `app/(ecoservice)/profile.tsx`    | `person-outline`  | User card, EcoService switcher component, dev toggle, sign out |
| PDP Editor | `app/(ecoservice)/pdp-editor.tsx` | `storefront-outline` | Own enterprise PDP in preview-only mode                     |
| Products   | `app/(ecoservice)/products.tsx`   | `cube-outline`    | Own products grid (filtered), Add Product CTA (UI only)        |

Hidden routes:
- `app/(ecoservice)/inventory.tsx` — preserved for future use
- `app/(ecoservice)/orders.tsx` — preserved for future use
- `app/(ecoservice)/insights.tsx` — preserved for future use

---

## Anonymous Customer Access

Customers do **not** need to log in. The `(customer)` group has no auth guard — all tabs are publicly accessible. When not authenticated, `app/index.tsx` routes directly to `/(customer)`.

Route logic in `app/index.tsx`:
```
isAuthenticated && role === 'ecoservice'  →  /(ecoservice)
otherwise                                  →  /(customer)
```

---

## EcoService Tab Detail

### Home & Explore
Both tabs replicate the Customer implementation exactly — same hooks (`useEnterprisesQuery`, `useCatalogQuery`), same layout, same data source. EcoService owners browse the full marketplace alongside customers.

### Profile — EcoService Switcher
The profile screen includes an `EcoServiceSwitcher` component that fetches the full enterprise list from `/api/enterprises` via `useEcoServiceListQuery` and renders each as a selectable row (thumbnail, name, location). Tapping a row calls `setActiveEcoServiceId(enterprise.id)` in `useEcoServiceStore`, which the Products tab subscribes to. The first enterprise is auto-selected on load if nothing is active. Active state is shown with a green checkmark; inactive rows show an empty radio circle.

### PDP Editor
Loads the current user's enterprise via `useEnterpriseDetailQuery(user.id)`. Renders the full enterprise detail view (identical to what customers see in `app/enterprise/[id].tsx`) with these differences:
- "Vista previa" badge overlaid on the hero image
- WhatsApp CTA replaced by a greyed-out non-interactive version
- No back/navigation button (it's a tab, not a stack screen)
- Icon: `storefront-outline`

### Products
Uses the Explore grid layout (2-column `FlatList`, search bar, category chips). Data flow:
1. Reads `activeEcoServiceId` from `useEcoServiceStore()` (falls back to `user.id`)
2. `useMyProductsQuery(ecoServiceId)` calls `useCatalogQuery({ ecoServiceId })` + client-side filter
3. Switching enterprise in Profile immediately updates the product list (shared Zustand state)
4. Unavailable products show a "No disponible" overlay badge
5. "Agregar" button is present but `disabled` — functionality deferred to next iteration

---

## Dev Preview Switch (Profile Tab)

A `Switch` in the Customer Profile screen allows developers to render the EcoService tab bar without a real EcoService account. State lives in `src/store/devStore.ts` (Zustand, no persistence).

**Customer → EcoService preview:**
1. Toggle "Preview EcoService tabs" ON in Customer Profile.
2. `router.replace('/(ecoservice)')` navigates to EcoService group.
3. EcoService layout guard checks `previewAsEcoService === true`.

**Exit preview:**
1. The switch appears in EcoService Profile only when `previewAsEcoService` is true.
2. Toggle OFF → `router.replace('/(customer)')`.

---

## Auth Guard Summary

| Route group     | Guard condition                                                      |
|-----------------|----------------------------------------------------------------------|
| `(customer)`    | None — always accessible                                            |
| `(ecoservice)`  | `(isAuthenticated && role === 'ecoservice') || previewAsEcoService`  |
| `(auth)`        | Reverse guard — redirects away if already authenticated              |

---

## Data Layer — EcoService-specific

| Hook                       | Location                                                              | Purpose                                        |
|----------------------------|-----------------------------------------------------------------------|------------------------------------------------|
| `useMyProductsQuery`       | `src/features/ecoservice/products/hooks/useMyProductsQuery.ts`        | Products filtered by `activeEcoServiceId`      |
| `useEcoServiceListQuery`   | `src/features/ecoservice/switcher/hooks/useEcoServiceListQuery.ts`    | Flat enterprise list for the switcher          |
| `useEnterpriseDetailQuery` | `src/features/customer/home/hooks/useEnterpriseDetailQuery.ts`        | Enterprise PDP data (shared)                   |
| `useCatalogQuery`          | `src/features/customer/catalog/hooks/useCatalogQuery.ts`              | Full catalog (shared by Explore tabs)          |
| `useEnterprisesQuery`      | `src/features/customer/home/hooks/useEnterprisesQuery.ts`             | Paginated enterprise list (shared by Home tabs)|

### Stores

| Store               | Location                           | Purpose                                                    |
|---------------------|------------------------------------|------------------------------------------------------------|
| `useAuthStore`      | `src/store/authStore.ts`           | Auth user state (login, logout, role)                      |
| `useDevStore`       | `src/store/devStore.ts`            | Dev preview toggle (Customer ↔ EcoService)                 |
| `useEcoServiceStore`| `src/store/ecoServiceStore.ts`     | Active enterprise selection — shared between Profile and Products |

`CatalogFilters` in `src/repositories/catalog.repository.ts` now includes `ecoServiceId?: string` for server-side filtering support.

---

## Next Steps (out of scope here)

- EcoService sign-up form (design in Claude-Designs prototype).
- "Agregar Producto" functionality in Products tab.
- Real multi-enterprise switching API in EcoService switcher.
- PDP editing capabilities in PDP Editor tab.

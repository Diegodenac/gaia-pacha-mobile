# EXPLORER_TAB.md
## Feature: Explorer Tab (Customer Home Feed)

> **Branch:** `feature-explorer`
> **Status:** ✅ MVP Implemented — awaiting `/explorer/feed` backend endpoint for production refactor.
> **Owner:** Dev A (Customer flows)

---

## 1. Purpose & Scope

The Explorer Tab is the **Home / Landing screen** for the Customer (End User) profile.
It provides a scrollable, staggered, asynchronous mixed feed of:

- **Sustainable Products** — items from the product catalog with price and eco-impact data.
- **EcoServices** — green businesses/organisations (simulated from catalog data in MVP).

The goal is to **maximise discovery** through visual richness (Pinterest-style layout),
contextual metadata (location, CO2 impact), and frictionless quick-actions (Save, Share, Quick-View).

---

## 2. Route & Navigation

| Property    | Value                       |
|-------------|---------------------------  |
| Route       | `/(customer)` (index tab)   |
| Tab label   | Home                        |
| Tab icon    | `home-outline` (Ionicons)   |
| Auth guard  | `app/(customer)/_layout.tsx` — redirects to `/(auth)/login` if not authenticated or wrong role |

---

## 3. Architecture & File Map

The feature follows the strict **Feature-First + Clean Architecture** dependency chain:

```
Screen
  app/(customer)/index.tsx
       │
       │ owns: UI state, derived filters, quick-action handlers
       ▼
Organisms
  src/components/organisms/ExplorerFeedOrganism.tsx  ← staggered two-column grid
  src/components/organisms/FilterBarOrganism.tsx     ← horizontal filter pill bar
       │
       │ composes
       ▼
Molecules
  src/components/molecules/ExplorerCard.tsx          ← rich card with image + badges + overlay
  src/components/molecules/SearchBar.tsx             ← controlled search input
  src/components/molecules/FilterPill.tsx            ← single filter tag
       │
       │ composes
       ▼
Atoms
  src/components/atoms/Badge.tsx                     ← type / CO2 / verified pills
       │
Feature Hook (called by Screen only)
  src/features/customer/explorer/hooks/useExplorerFeedQuery.ts
       │
Repository
  src/repositories/explorer.repository.ts           ← MVP normaliser; swappable
       │
Existing Repositories (called by Explorer repo only)
  src/repositories/catalog.repository.ts
       │
API Client
  src/lib/apiClient.ts
```

### Dependency Direction Law

```
Screen → Organisms → Molecules → Atoms        (UI direction)
Screen → Feature Hook → Repository → apiClient (Data direction)
```

> **Rule:** Atoms import nothing from Molecules/Organisms/Feature hooks.
> **Rule:** Molecules import only Atoms and RN primitives — no feature hooks.
> **Rule:** Organisms may import Feature hooks and Molecules.

---

## 4. Data Flow (MVP)

### Current MVP Strategy

The `/explorer/feed` backend endpoint does not exist yet. The `explorerRepository`
implements a **client-side normaliser** that:

1. Calls `catalogRepository.getFeatured()` → promoted items (top of feed).
2. Calls `catalogRepository.getProducts()` → paginated main set.
3. **Deduplicates** by `id` (featured items take priority).
4. **Alternates type labels**: even index = `'product'`, odd index = `'ecoservice'`
   — producing a balanced visual mix for the demo.
5. Derives `co2Reduction` from `product.sustainabilityScore`:
   `Math.round(sustainabilityScore * 0.45)%` reduction, min 5%.
6. Applies **client-side filtering** for search, type, carbon, and price.

### Production Refactor Path (when `/explorer/feed` is ready)

Only **3 lines** in `explorer.repository.ts` need to change — zero UI changes:

```ts
// BEFORE (MVP)
getFeed: async (filters) => {
  const [paginatedResult, featuredProducts] = await Promise.all([...]);
  // ... normalisation logic ...
}

// AFTER (Production)
getFeed: async (filters) => {
  const res = await apiClient.get<{ data: ExplorerItem[] }>('/explorer/feed', { params: filters });
  return res.data.data;
}
```

---

## 5. State Management

| State | Owner | Tool |
|---|---|---|
| `searchTerm` | Screen (`index.tsx`) | `useState` |
| `activeFilter` | Screen (`index.tsx`) | `useState` |
| `items` (server) | TanStack Query | `useExplorerFeedQuery` |
| `searchValue` (input) | `SearchBar` molecule | `useState` (local) |

### Cache Policy

| Property | Value | Reason |
|---|---|---|
| `staleTime` | `CACHE_TIMES.MEDIUM` (10 min) | Feed doesn't need real-time freshness |
| `gcTime` | `CACHE_TIMES.LONG` (30 min) | Keep cache alive across tab switches |
| `placeholderData` | previous data | No blank flash on filter change |
| `refetchOnWindowFocus` | `false` (global default) | Mobile has no window focus concept |

**Tab switch behaviour:** TanStack Query's MEDIUM stale time + Expo Router's tab state persistence means the feed is **instantly available** when returning to the Explorer tab — zero network requests until data is 10 minutes old.

---

## 6. UI Components Reference

### `Badge` Atom (`src/components/atoms/Badge.tsx`)

| Variant | Background | Text | Icon | Default Label |
|---|---|---|---|---|
| `eco` | `#74A643` | `#ffffff` | `leaf-outline` | EcoService |
| `product` | `#e87010` | `#ffffff` | `cube-outline` | Product |
| `co2` | `#3A5B13` | `#74A643` | `leaf` | (from prop) |
| `verified` | `rgba(34,197,94,0.2)` | `#4ade80` | — | ✓ Verified |

### `ExplorerCard` Molecule

| Element | Token | Value |
|---|---|---|
| Card surface | `explorerSurface` | `#333333` |
| Title text | high emphasis | `#FFFFFF` |
| Location / meta | medium emphasis | `#9E9E9E` |
| Price label | `primary-400` | `#4ade80` |
| Quick-action overlay | semi-transparent | `rgba(0,0,0,0.45)` |

### `ExplorerFeedOrganism` — Stagger Algorithm

```
items = [A, B, C, D, E, F]
Left column  (height 220px): A, C, E   (even indices)
Right column (height 185px): B, D, F   (odd indices)
```

Both columns are rendered in a `flex-row` `ScrollView`. The height difference creates
the Pinterest-style stagger. The split is computed once via `useMemo`.

---

## 7. Filter Pill Spec

| Key | Label | Repository Effect |
|---|---|---|
| `all` | All | No filter applied |
| `near_me` | 📍 Near Me | `region: 'bolivia'` passed to repo (placeholder) |
| `products` | Products | `type: 'product'` filter applied |
| `ecoservices` | 🌿 EcoServices | `type: 'ecoservice'` filter applied |
| `carbon` | ♻️ Carbon Footprint | `carbonFocus: true` → keeps items with CO2 ≥ 20% |
| `price` | 💰 Price | `priceSort: true` → sorts by `rawProduct.price` ascending |

---

## 8. Design Tokens

| Token | Hex | Used For |
|---|---|---|
| `explorerBg` | `#191616` | Screen `backgroundColor` |
| `explorerSurface` | `#333333` | Card background, SearchBar background |
| `greenMid` | `#74A643` | EcoService badge, CO2 text |
| `greenDark` | `#3A5B13` | CO2 badge background |
| `textMedium` | `#9E9E9E` | Location text, placeholders, meta |
| `#FFFFFF` | white | Titles, high-emphasis text |
| `primary-500` | `#22c55e` | Active filter pill background |

All Explorer-specific tokens are defined in `src/constants/index.ts` under `COLORS`.

---

## 9. Adding a New Filter

1. Add the new key to `ExplorerFilter` union in `src/types/index.ts`.
2. Add a `{ key, label }` entry to `FILTER_OPTIONS` in `FilterBarOrganism.tsx`.
3. Add the mapping logic in `app/(customer)/index.tsx` inside the `filters` `useMemo`.
4. Add the filter logic in `explorerRepository.applyClientFilters` (or pass it to the API).

---

## 10. Future Enhancements

| Enhancement | Where to implement | Effort |
|---|---|---|
| Infinite scroll | Replace `useExplorerFeedQuery` with `useInfiniteExplorerQuery` (new hook) | Medium |
| Detail screen | Create `app/(customer)/detail.tsx`, update `handlePress` in screen | Low |
| Quick-View bottom sheet | Install `@gorhom/bottom-sheet`, replace `Alert` in `handleQuickView` | Medium |
| Save to wishlist | Create wishlist repository + Zustand slice, update `handleSave` | Medium |
| Real "Near Me" filter | Bolivia region picker modal → pass selected region to repo | Low |
| Real `/explorer/feed` endpoint | Update repository body only (see §4 refactor path) | Low |
| Animations | Wrap `ExplorerCard` in `Animated.View` with entrance animation | Low |

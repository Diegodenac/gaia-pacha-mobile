# Session Progress — Gaia Pacha Mobile

**Last updated:** 2026-05-17  
**Platform:** React Native · Expo Router v6 · NativeWind v4  
**Backend:** `https://gaia-pacha-backend.onrender.com`

---

## 1. Project Status Overview

| Area | Status | Notes |
|------|--------|-------|
| Navigation — Customer (3 tabs) | ✅ Done | Home, Explore, Profile |
| Navigation — EcoService (5 tabs) | ✅ Done | Home, Explore, Profile, PDP Editor, Products |
| Anonymous customer access | ✅ Done | No auth guard on `(customer)` group |
| Dev preview switch (Customer ↔ EcoService) | ✅ Done | Toggle in Profile tab |
| Customer Home screen | ✅ Done | Hero, search, category chips, paginated enterprise list |
| Customer Explore screen | ✅ Done | 2-col product grid, search, chips, product detail |
| Customer Profile — Guest state | ✅ Done | Hero CTA, Log In / Sign Up modal |
| Customer Profile — Auth state | ✅ Done | Initials avatar, user card, logout |
| EcoService Home & Explore | ✅ Done | Exact replicas of Customer screens |
| EcoService PDP Editor | ✅ Done | Own enterprise in preview-only mode |
| EcoService Products tab | ✅ Done | Filtered grid by active enterprise, Add CTA (disabled) |
| EcoService Switcher | ✅ Done | Fetches real enterprise list from DB, selectable |
| Auth — Login screen | ✅ Done | Email + password with show/hide toggle, special-char fix |
| Auth — Register screen | ✅ Done | Name, email, password x2 with toggle, role selector, defaultValues fix |
| Auth — Forgot Password | ✅ Done | Email form + success state; calls `authRepository.forgotPassword` |
| EcoService Sign Up flow | ⬜ Pending | Design exists in Claude-Designs prototype |
| Add Product functionality | ⬜ Pending | CTA button exists (disabled) |
| PDP Editor — editing | ⬜ Pending | Preview-only for now |
| EcoService Switcher — multi-enterprise | ⬜ Pending | API returns all enterprises; filter by owner pending backend |
| Orders tab (Customer) | ⬜ Preserved | File kept, hidden from tab bar |
| Map tab (Customer) | ⬜ Preserved | File kept, hidden from tab bar |
| EcoService Inventory / Orders / Insights | ⬜ Preserved | Files kept, hidden from tab bar |

---

## 2. Navigation Architecture

### Tab Groups

```
app/
├── index.tsx              ← Root guard: unauthenticated → /(customer)
│                                        ecoservice     → /(ecoservice)
├── (auth)/                ← Reverse guard: authenticated users are redirected out
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
│
├── (customer)/            ← NO auth guard — always public
│   ├── index.tsx          ← Home (hero, search, enterprise list)
│   ├── catalog.tsx        ← Explore tab (product grid)
│   ├── profile.tsx        ← Guest or Authenticated profile
│   ├── producto/[id].tsx  ← Product detail (hidden from tab bar)
│   ├── map.tsx            ← Hidden (preserved)
│   └── orders.tsx         ← Hidden (preserved)
│
├── (ecoservice)/          ← Guard: role === 'ecoservice' OR devStore.previewAsEcoService
│   ├── index.tsx          ← Home (same as customer home)
│   ├── explore.tsx        ← Explore (same as customer catalog)
│   ├── profile.tsx        ← Profile + EcoService switcher
│   ├── pdp-editor.tsx     ← Own enterprise PDP in preview mode
│   ├── products.tsx       ← Own products grid (filtered by activeEcoServiceId)
│   ├── inventory.tsx      ← Hidden (preserved)
│   ├── orders.tsx         ← Hidden (preserved)
│   └── insights.tsx       ← Hidden (preserved)
│
└── enterprise/[id].tsx    ← Full enterprise detail (navigated from Home cards)
```

### Tab Icons

| Group | Tab | Icon |
|-------|-----|------|
| Customer | Home | `home-outline` |
| Customer | Explore | `compass-outline` |
| Customer | Profile | `person-outline` |
| EcoService | Home | `home-outline` |
| EcoService | Explore | `compass-outline` |
| EcoService | Profile | `person-outline` |
| EcoService | PDP Editor | `storefront-outline` |
| EcoService | Products | `cube-outline` |

---

## 3. State Management — Stores

| Store | File | Persisted | Purpose |
|-------|------|-----------|---------|
| `useAuthStore` | `src/store/authStore.ts` | ✅ SecureStore | User auth, login, register, logout |
| `useDevStore` | `src/store/devStore.ts` | ❌ | Dev preview toggle (Customer ↔ EcoService) |
| `useEcoServiceStore` | `src/store/ecoServiceStore.ts` | ❌ | Active enterprise selection for Products tab |

### Auth Store Actions
```ts
login(email, password)      // POST /auth/login
register(name, email, password, role)  // POST /auth/register
logout()                    // POST /auth/logout (client clears regardless)
setUser(user)
```

---

## 4. Key Feature Hooks

| Hook | Location | What it does |
|------|----------|-------------|
| `useEnterprisesQuery` | `features/customer/home/hooks/` | Infinite paginated enterprise list |
| `useEnterpriseDetailQuery` | `features/customer/home/hooks/` | Single enterprise by ID (seeds from list cache) |
| `useCatalogQuery` | `features/customer/catalog/hooks/` | Product list with filters |
| `useProductQuery` | `features/customer/catalog/hooks/` | Single product by ID |
| `useMyProductsQuery` | `features/ecoservice/products/hooks/` | Products filtered by `ecoServiceId` |
| `useEcoServiceListQuery` | `features/ecoservice/switcher/hooks/` | Flat enterprise list for the switcher (limit 50) |

---

## 5. Data Layer

### Backend Endpoints (Render)

| Endpoint | Method | Used by | Status |
|----------|--------|---------|--------|
| `/api/enterprises` | GET | Home, EcoService Switcher | ✅ |
| `/api/enterprises/:id` | GET | Enterprise Detail, PDP Editor | ✅ |
| `/api/products` | GET | Explore, Products tab | ✅ |
| `/auth/register` | POST | Register form | ✅ Implemented |
| `/auth/login` | POST | Login form | ✅ Implemented |
| `/auth/logout` | POST | Logout action | ✅ Implemented |
| `/auth/me` | GET | Session validation | ✅ Implemented |
| `/auth/forgot-password` | POST | Forgot password screen | ✅ Stub (200 only) |

> **Render deploy note:** Set `JWT_SECRET` in the Render environment variables before deploying. The `usuarios` table is created automatically on first startup via `CREATE TABLE IF NOT EXISTS`.

### Product Schema (DB → App mapping)
```ts
id_producto         → Product.id
nombre_producto     → Product.name
descripcion_producto → Product.description
precio              → Product.price
foto_producto_url   → Product.imageUrls[0]
id_ecoservice       → Product.ecoServiceId   ← used to filter in Products tab
disponible          → Product.isAvailable
nombre_categoria    → Product.categoryName
nombre_emprendimiento → Product.enterpriseName
```

### `CatalogFilters` (catalog.repository.ts)
```ts
{ category?, search?, page?, perPage?, sortBy?, minPrice?, maxPrice?, ecoServiceId? }
```
`ecoServiceId` was added to support server-side filtering for the Products tab. Client-side filter is applied as fallback.

---

## 6. Auth & Profile UX

### Customer Profile — Guest State
- Hero with leaf icon + tagline + two CTAs
- "Crear cuenta" → opens `AuthModal` in signup view
- "Iniciar sesión" → opens `AuthModal` in login view
- `AuthModal`: bottom-sheet `Modal` (slide animation) with login ↔ signup toggle
- All password fields have show/hide toggle (`eye-outline` / `eye-off-outline`)
- Errors: field-level (zod) + submit-level (API error message)
- On success: modal closes, `isAuthenticated` becomes `true`, profile re-renders as authenticated

### Customer Profile — Authenticated State
- Initials avatar (derived from `user.name`, max 2 chars)
- Name + email + `Customer` badge
- Dev preview switch (flask icon)
- "Cerrar Sesión" button with icon

### Standalone Auth Screens (`(auth)/`)
- **Login**: same fields as modal, with `KeyboardAvoidingView`, links to register + forgot-password
- **Register**: role toggle (Customer / EcoService), name, email, password x2, zod validation
- These screens are primarily used for the EcoService login flow (customers use the modal)

---

## 7. EcoService Profile — EcoService Switcher

- Fetches all enterprises via `useEcoServiceListQuery()` (calls `GET /api/enterprises?limit=50`)
- Renders each as a row: thumbnail, name, location, radio/checkmark
- Tapping a row calls `useEcoServiceStore().setActiveEcoServiceId(id)`
- Auto-selects the first enterprise on load if nothing is active
- Products tab reads `activeEcoServiceId` from the store (falls back to `user.id`)

> **Known limitation:** The backend currently returns ALL enterprises, not only those owned by the logged-in user. A `owner_id` filter endpoint is needed on the backend to properly scope this.

---

## 8. Design System Reference

All screens use NativeWind v4 with these custom classes:

| Class | Description |
|-------|-------------|
| `screen-container` | `flex-1 bg-surface` (`#0d1117`) |
| `card` | `bg-surface-raised rounded-2xl p-4 shadow-card` |
| `input-field` | `bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-white` |
| `btn-primary` | `bg-primary-500 rounded-xl px-6 py-3 items-center` |
| `btn-primary-text` | `text-white font-semi text-base` |
| `btn-ghost` | `border border-surface-border rounded-xl px-6 py-3 items-center` |
| `badge-eco` | `bg-primary-500/20 text-primary-400 rounded-full px-2 py-0.5 text-xs` |
| `section-title` | `text-white font-bold text-xl mb-3` |

**Color tokens:**
```
surface:         #0d1117   (bg default)
surface-raised:  #161b22   (cards)
surface-overlay: #21262d   (inputs)
surface-border:  #30363d   (borders, dividers)
primary-500:     #22c55e   (green brand)
primary-400:     #4ade80   (lighter green, links)
error:           #ef4444
```

**Password input pattern** (used in login, register, profile modal):
```tsx
<View style={{ flexDirection: 'row', backgroundColor: '#21262d', borderWidth: 1, borderColor: '#30363d', borderRadius: 12 }}>
  <TextInput style={{ flex: 1, ... }} secureTextEntry={!visible} />
  <Pressable onPress={() => setVisible(v => !v)}>
    <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6b7280" />
  </Pressable>
</View>
```

---

## 9. Pending Work (Next Session)

### High Priority

1. **EcoService Sign-Up form**
   - Design prototype exists in Claude-Designs directory
   - Path: `C:\Users\Diego\Desktop\9no Semestre\PracticasPreProfesionales\AndeanUX\Projects\Pocket Habit\Claude-Designs`
   - Should be a dedicated screen (likely `(auth)/register.tsx` with `role='ecoservice'` preselected, or a new `(auth)/register-ecoservice.tsx`)
   - May need additional fields beyond the basic customer signup (business name, category, location)

2. **EcoService Switcher — owner filter**
   - Backend needs a `GET /api/enterprises?owner_id=:userId` endpoint
   - Currently returns all enterprises; `useEcoServiceListQuery` needs filter param once available

3. ~~**Forgot Password screen**~~ ✅ Done — email form + success state implemented

### Medium Priority

4. **Add Product — PDP Editor**
   - "Agregar" CTA in Products tab is `disabled`, UI only
   - Needs: product creation form (name, description, price, image, category)
   - Consider: new screen `(ecoservice)/product-form.tsx` opened as a modal stack

5. **PDP Editor — editing mode**
   - Currently renders the enterprise PDP in read-only preview
   - Next: add edit fields overlaid on the preview, or a side-by-side edit/preview toggle
   - Data: `PATCH /api/enterprises/:id` endpoint needed

6. **Real-time product availability toggle**
   - In Products tab, unavailable items show a badge
   - Add swipe or long-press to toggle `isAvailable` → `PATCH /api/products/:id`

### Low Priority / Future

7. **Customer Orders tab** — file exists at `(customer)/orders.tsx`, hidden from nav
8. **Customer Map tab** — file exists at `(customer)/map.tsx`, hidden from nav
9. **EcoService Insights / Orders / Inventory** — files exist and hidden, need full implementation
10. **Push notifications** — `expo-notifications` not yet configured
11. **Image upload** — product and enterprise images currently URL-based only

---

## 10. File Map — Modified in These Sessions

```
app/
  index.tsx                         ← Unauthenticated → /(customer) (permanent, no dev flag)
  (auth)/
    login.tsx                       ← Password visibility toggle, error handling, new design
    register.tsx                    ← Full implementation: role toggle, all fields, validation
  (customer)/
    _layout.tsx                     ← 3 tabs (Home, Explore, Profile), no auth guard
    profile.tsx                     ← Guest/Auth states, AuthModal with login+signup
  (ecoservice)/
    _layout.tsx                     ← 5 tabs, guard accepts devStore.previewAsEcoService
    index.tsx                       ← Replicated customer Home
    explore.tsx                     ← Replicated customer Explore
    profile.tsx                     ← Person icon, EcoService switcher from DB, dev toggle
    pdp-editor.tsx                  ← Enterprise PDP preview via useEnterpriseDetailQuery(user.id)
    products.tsx                    ← Filtered grid via activeEcoServiceId, Add CTA (disabled)

src/
  store/
    authStore.ts                    ← Added register() action
    devStore.ts                     ← New: previewAsEcoService toggle
    ecoServiceStore.ts              ← New: activeEcoServiceId for Products tab
  repositories/
    catalog.repository.ts           ← Added ecoServiceId to CatalogFilters
  features/
    ecoservice/
      products/hooks/
        useMyProductsQuery.ts       ← New: filters by ecoServiceId (server + client-side)
      switcher/hooks/
        useEcoServiceListQuery.ts   ← New: flat enterprise list for the switcher

docs/
  MULTI_PROFILE_NAVIGATION.md      ← Full navigation + auth guard documentation
  SESSION_PROGRESS.md              ← This file
```

---

## 11. Running the Project

```bash
cd "C:\Users\Diego\Desktop\9no Semestre\CochaTech\mobile-project"
npx expo start
```

- Press `i` for iOS simulator, `a` for Android emulator
- Backend is live on Render — no local backend needed
- On cold start, app lands on Customer Home (anonymous, no login required)
- Dev preview: open Profile tab → toggle "Preview EcoService tabs"

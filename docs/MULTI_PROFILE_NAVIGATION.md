# Multi-Profile Navigation

## Overview

The app supports two distinct user profiles — **Customer** and **EcoService** — each with its own tab bar and feature set. Navigation is handled via two Expo Router route groups: `(customer)` and `(ecoservice)`.

---

## Profile Tab Structures

### Customer — 3 tabs

| Tab     | File                        | Screen                                       |
|---------|-----------------------------|----------------------------------------------|
| Home    | `app/(customer)/index.tsx`  | Enterprise discovery: hero, search, categories, listing with pagination |
| Explore | `app/(customer)/catalog.tsx`| Product catalog: grid view, search, category chips, links to product detail |
| Profile | `app/(customer)/profile.tsx`| User card, dev preview switch, sign out       |

Hidden routes (not in tab bar, still navigable):
- `app/(customer)/producto/[id].tsx` — product detail, opened from Explore via `Link`
- `app/(customer)/map.tsx` — preserved for future use
- `app/(customer)/orders.tsx` — preserved for future use

### EcoService — 5 tabs

| Tab        | File                              | Screen                          |
|------------|-----------------------------------|---------------------------------|
| Home       | `app/(ecoservice)/index.tsx`      | Dashboard: KPIs, recent orders  |
| Explore    | `app/(ecoservice)/explore.tsx`    | Marketplace browse (placeholder)|
| Profile    | `app/(ecoservice)/profile.tsx`    | Business card, dev toggle, sign out |
| PDP Editor | `app/(ecoservice)/pdp-editor.tsx` | Product detail page builder (placeholder) |
| Products   | `app/(ecoservice)/products.tsx`   | Inventory management (placeholder) |

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

## Dev Preview Switch (Profile Tab)

A `Switch` in the Profile screen lets developers render the EcoService tab bar without creating an EcoService account. The state is held in `src/store/devStore.ts` (Zustand, no persistence — resets on app reload).

**Flow: Customer → EcoService preview**
1. Customer opens Profile tab.
2. Toggles "Preview EcoService tabs" ON.
3. `router.replace('/(ecoservice)')` — app navigates to EcoService group.
4. EcoService layout guard checks `previewAsEcoService === true` and allows access.

**Flow: Exit preview**
1. Inside EcoService Preview, open Profile tab.
2. The switch is visible only when `previewAsEcoService` is true.
3. Toggle OFF → `router.replace('/(customer)')` and store resets.

**Store** (`src/store/devStore.ts`):
```ts
{ previewAsEcoService: boolean; togglePreview: () => void }
```
No persistence — intentional. The preview is a dev tool, not a user state.

---

## Auth Guard Summary

| Route group     | Guard condition                                                     |
|-----------------|---------------------------------------------------------------------|
| `(customer)`    | None — always accessible                                           |
| `(ecoservice)`  | `(isAuthenticated && role === 'ecoservice') || previewAsEcoService` |
| `(auth)`        | Reverse guard — redirects away if already authenticated            |

---

## Next Steps (out of scope here)

- EcoService sign-up form (design in Claude-Designs prototype).
- Feature implementation for EcoService Explore, PDP Editor, Products screens.

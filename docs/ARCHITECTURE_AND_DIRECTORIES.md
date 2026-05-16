# ARCHITECTURE_AND_DIRECTORIES.md
## Software Architecture, Multi-Profile Support & Directory Structure

---

## 1. Architectural Philosophy

The project combines two complementary patterns:

| Pattern | Purpose |
|---|---|
| **Feature-First (Vertical Slicing)** | Each user-facing capability is a self-contained module with its own UI, state, and data layers |
| **Clean Architecture** | Hard dependency direction: UI → Use Case/Hook → Repository → Data Source |

This allows two developers to work on `customer/` and `ecoservice/` simultaneously with **zero merge conflicts** on feature logic.

---

## 2. Dependency Direction Rule

```
Screen/Component  →  Feature Hook  →  Repository  →  API Client
      (UI)             (Use Case)       (Data)       (External)
```

- **Screens** import hooks only — never repositories directly.
- **Hooks** import repositories only — never API clients directly.
- **Repositories** import `apiClient` only.
- **Atoms/Molecules** import nothing from features — they are pure UI.

---

## 3. Full Directory Structure

```
mobile-project/
│
├── app/                            # Expo Router file-based routes
│   ├── _layout.tsx                 # Root layout (fonts, providers, root Stack)
│   ├── index.tsx                   # Auth/role guard → redirect
│   │
│   ├── (auth)/                     # Unauthenticated route group
│   │   ├── _layout.tsx             # Auth Stack layout + reverse guard
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── (customer)/                 # Customer Tab group
│   │   ├── _layout.tsx             # Customer Tabs + role guard
│   │   ├── index.tsx               # Home / Featured
│   │   ├── catalog.tsx             # Browse & Search
│   │   ├── map.tsx                 # Nearby Map
│   │   ├── orders.tsx              # Order History
│   │   └── profile.tsx             # Customer Profile
│   │
│   └── (ecoservice)/               # EcoService Tab group
│       ├── _layout.tsx             # EcoService Tabs + role guard
│       ├── index.tsx               # Dashboard / KPIs
│       ├── inventory.tsx           # Product Management
│       ├── orders.tsx              # Incoming Orders
│       ├── insights.tsx            # Analytics & Eco Reports
│       └── profile.tsx             # Business Profile
│
├── src/
│   ├── components/                 # Atomic Design UI library (SHARED)
│   │   ├── atoms/                  # Indivisible primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Typography.tsx
│   │   │   └── index.ts
│   │   ├── molecules/              # Atoms composed together
│   │   │   ├── ServiceCard.tsx
│   │   │   └── index.ts
│   │   ├── organisms/              # Complex, stateful UI sections
│   │   │   └── index.ts
│   │   └── templates/              # Full-screen layout skeletons
│   │       └── index.ts
│   │
│   ├── features/                   # Feature modules (profile-scoped)
│   │   ├── customer/
│   │   │   ├── catalog/hooks/useCatalogQuery.ts
│   │   │   └── orders/hooks/useCustomerOrdersQuery.ts
│   │   └── ecoservice/
│   │       ├── dashboard/hooks/useSalesMetricsQuery.ts  [TODO]
│   │       ├── inventory/hooks/useInventoryQuery.ts     [TODO]
│   │       └── orders/hooks/useServiceOrdersQuery.ts
│   │
│   ├── repositories/               # Data layer — all API calls
│   │   ├── auth.repository.ts
│   │   ├── catalog.repository.ts
│   │   └── orders.repository.ts
│   │
│   ├── store/                      # Zustand global stores
│   │   └── authStore.ts
│   │
│   ├── lib/                        # Shared infrastructure singletons
│   │   ├── apiClient.ts
│   │   └── queryClient.ts
│   │
│   ├── types/index.ts
│   ├── constants/index.ts
│   ├── hooks/                      # Global utility hooks
│   ├── utils/                      # Pure utility functions
│   └── styles/global.css
│
├── assets/images/
├── docs/                           # Architecture documentation
├── app.json
├── babel.config.js
├── eas.json
├── metro.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 4. Atomic Design Placement Rules

| Layer | Definition | Lives In | Examples |
|---|---|---|---|
| **Atom** | Single-purpose, no internal state, no data fetching | `src/components/atoms/` | `Button`, `Input`, `Typography`, `Card`, `Badge`, `Avatar` |
| **Molecule** | 2–5 atoms composed with simple logic | `src/components/molecules/` | `ServiceCard`, `SearchBar`, `OrderRow`, `KpiCard` |
| **Organism** | Complex sections with internal state or hooks | `src/components/organisms/` | `ServiceListOrganism`, `OrderManagementOrganism` |
| **Template** | Full-screen layout scaffolds (no real data) | `src/components/templates/` | `TabScreenTemplate`, `AuthScreenTemplate` |
| **Page/Screen** | Expo Router screen files; compose templates + organisms | `app/(profile)/screen.tsx` | `catalog.tsx`, `inventory.tsx` |

### Golden Rules
> An **Atom** must not import from Molecules, Organisms, Templates, or feature hooks.
> A **Molecule** must not import from feature hooks.
> Only **Organisms** and above may call feature hooks.

---

## 5. Cloud Provider Integration

The data layer is provider-agnostic. To integrate **[Service Provider/Hosting, e.g., Firebase / Supabase / AWS / Custom Services]**:

1. Update `API_BASE_URL` in `app.json > extra.apiUrl` and per EAS `env` block.
2. If using an SDK directly (e.g., Supabase, Firebase): replace `apiClient` calls inside the repository with SDK calls.
3. The repository **function signatures never change** — only the body.

Screens and hooks require **zero changes** when switching providers.

---

## 6. Adding a New Feature — Checklist

```
[ ] 1. Define types in src/types/index.ts
[ ] 2. Add QUERY_KEYS entry in src/constants/index.ts
[ ] 3. Create repository function in src/repositories/[domain].repository.ts
[ ] 4. Create hook in src/features/[profile]/[feature]/hooks/use[X]Query.ts
[ ] 5. Build Organism in src/components/organisms/[Name]Organism.tsx
[ ] 6. Wire Organism into the correct app/(profile)/screen.tsx
```

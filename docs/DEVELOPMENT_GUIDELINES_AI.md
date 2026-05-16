# DEVELOPMENT_GUIDELINES_AI.md
## Hackathon Efficiency, Code Conventions & AI-Assisted Development

---

## 1. Team Split Strategy — Conflict-Free Parallel Work

| Developer | Ownership Zone | Files/Folders |
|---|---|---|
| **Dev A** (Customer) | All customer-facing UI and hooks | `app/(customer)/`, `src/features/customer/` |
| **Dev B** (EcoService) | All business-facing UI and hooks | `app/(ecoservice)/`, `src/features/ecoservice/` |
| **Dev C** (Shared / Backend) | Atoms, repositories, types, auth | `src/components/atoms/`, `src/repositories/`, `src/types/` |

### Git Branching
```
main
├── feat/customer-[name]    ← Dev A
├── feat/ecoservice-[name]  ← Dev B
└── feat/shared-[name]      ← Dev C
```

---

## 2. TypeScript Conventions

### File Naming
```
Components (PascalCase):  ServiceCard.tsx, KpiCard.tsx
Hooks (camelCase):        useCatalogQuery.ts, useAuthStore.ts
Repositories:             catalog.repository.ts
```

### Interface vs Type
```ts
interface ServiceCard { id: string; name: string; }  // extendable shapes
type UserRole = 'customer' | 'ecoservice';            // unions, primitives
```

### Props Pattern
```ts
interface ButtonProps extends TouchableOpacityProps {
  variant?: Variant;
  loading?: boolean;
  children: React.ReactNode;
}
export function Button({ variant = 'primary', ...props }: ButtonProps) { ... }
```

### Export Convention
```ts
// ✅ Named exports always (tree-shaking + AI autocomplete)
export function useCatalogQuery() { ... }
// ❌ No default exports in src/ (only in app/ for Expo Router)
```

---

## 3. AI Prompt Snippets

### New Atom
```
Generate a React Native atom named [Name] using NativeWind v4 (className),
strict TypeScript, named exports. Props extends base RN props.
Location: src/components/atoms/[Name].tsx
Follow the pattern in src/components/atoms/Button.tsx.
The component should [describe behavior].
```

### New Molecule
```
Generate a React Native molecule [Name]Molecule that composes [Atom1] and [Atom2]
from @atoms. Accepts [describe props]. Uses NativeWind classes.
Location: src/components/molecules/[Name].tsx
Follow the ServiceCard.tsx pattern. Import atoms from @atoms barrel.
```

### New Feature Query Hook
```
Generate a TanStack Query hook named use[X]Query in:
src/features/[profile]/[feature]/hooks/use[X]Query.ts

- Import queryKey from QUERY_KEYS in @constants
- Import cache time from CACHE_TIMES in @constants
- Call [repository].[method] from @repositories/[name].repository
- Use staleTime: CACHE_TIMES.[LONG|MEDIUM|SHORT]
- Disable with `enabled: !!someId` if dependent on user ID
```

### New Repository Method
```
Add a method to src/repositories/[name].repository.ts:
- Call apiClient.[get|post|patch|delete]('/[endpoint]', payload)
- Return Promise<[TypeName]> from src/types/index.ts
- Unwrap response.data.data (ApiResponse<T> wrapper)
- Add JSDoc comment explaining the endpoint
```

### New Zustand Action
```
Add action [actionName] to useAuthStore in src/store/authStore.ts:
- Parameters: [params]
- Calls: authRepository.[method] from @repositories/auth.repository
- Updates state: set({ [field]: value })
- Wraps in set({ isLoading: true }) before, false after
```

---

## 4. Code Comment Convention (AI-Friendly)

```ts
/**
 * [Name] — [one-line description]
 *
 * Layer: [Atom | Molecule | Organism | Feature Hook | Repository]
 * Used by: [list of consumers]
 *
 * AI Hint: [What an AI needs to know to extend this correctly]
 *
 * @example
 * <ComponentName prop="value" />
 */
```

The `AI Hint` line is **mandatory** on all shared components.

---

## 5. NativeWind Conventions

```tsx
// ✅ className for styling
<View className="flex-1 bg-surface px-4 pt-6">

// ✅ Design system classes from global.css
<View className="card">
<TouchableOpacity className="btn-primary">

// ✅ Dynamic classes
<Text className={`font-semi ${isActive ? 'text-primary-500' : 'text-gray-400'}`}>

// ❌ Avoid inline StyleSheet.create unless NativeWind can't handle it
// ❌ Avoid hardcoded color values — use COLORS from @constants
```

---

## 6. Hackathon Pragmatic Rules

### Build Properly
- Auth flow, navigation guards, type definitions
- Repository interfaces (provider-swappable)
- Atoms and molecules (reused everywhere)

### Cut for Speed
- Unit tests → skip for MVP
- Error boundaries → use simple `if (error) return <Text>Error</Text>`
- Pagination → single page fetch first, infinite scroll later
- Optimistic updates → use `invalidateQueries`, not optimistic writes

### The "Good Enough" Principle
> If a component works visually and doesn't break another developer's work, ship it. Perfect is the enemy of demo.

---

## 7. Quick Reference — Import Aliases

| Alias | Resolves To |
|---|---|
| `@/` | `src/` |
| `@atoms` | `src/components/atoms` |
| `@molecules` | `src/components/molecules` |
| `@organisms` | `src/components/organisms` |
| `@hooks` | `src/hooks` |
| `@store` | `src/store` |
| `@repositories` | `src/repositories` |
| `@types` | `src/types` |
| `@constants` | `src/constants` |
| `@assets` | `assets/` |

---

## 8. Daily Hackathon Sync Protocol

```
09:00  5-min standup: ownership assignments for next session
12:00  Merge all feature branches to main (conflict resolution window)
Demo   npm run build:preview → shareable APK link
```

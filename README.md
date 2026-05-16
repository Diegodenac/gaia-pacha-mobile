# Gaia Pacha — Mobile MVP

> 🌿 **Green Entrepreneurship meets sustainable consumption.**
> A React Native + Expo application connecting Customers with EcoService providers, built during a CochaTech hackathon.

---

## Quick Start

### Prerequisitos
- **Node.js 20+** — verificar con `node --version`
- **Expo Go** instalado en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- PC y celular **en la misma red Wi-Fi**

### Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone [YOUR_REPO_URL]
cd mobile-project

# 2. Instalar dependencias
npm install

# 3. Lanzar el servidor de desarrollo
npx expo start
```

> 📱 Escanea el código QR con **Expo Go** (Android) o la app de **Cámara** (iOS).
> El proyecto se abre automáticamente en tu dispositivo.

### Solución de problemas

```bash
# Si hay errores de cache después de un pull
npx expo start -c

# Si faltan dependencias nativas después de un merge
npx expo install --fix
```

---

## Architecture Documentation

The following documents constitute the complete architectural specification for this MVP. **Read them in order** before writing any code.

| # | Document | Location | Purpose |
|---|---|---|---|
| 1 | **TECH_STACK_CONFIG.md** | `docs/TECH_STACK_CONFIG.md` | Full technology stack rationale, NativeWind v4 setup, EAS Build commands, Metro optimizations, and zero-to-running installation guide. **Start here.** |
| 2 | **ARCHITECTURE_AND_DIRECTORIES.md** | `docs/ARCHITECTURE_AND_DIRECTORIES.md` | Feature-First + Clean Architecture explanation, complete annotated directory tree, Atomic Design placement rules (Atoms → Molecules → Organisms → Templates → Pages), dependency direction law, and cloud provider integration strategy. |
| 3 | **NAVIGATION_FLOWS.md** | `docs/NAVIGATION_FLOWS.md` | Complete Expo Router routing map, auth guard pattern, role-based redirect logic, Customer and EcoService tab navigation specs, deep linking configuration, lazy loading and tab state persistence implementation details. |
| 4 | **DATA_OPTIMIZATION_CACHING.md** | `docs/DATA_OPTIMIZATION_CACHING.md` | TanStack Query client configuration, three-tier cache time policy (LONG/MEDIUM/SHORT), centralized QUERY_KEYS factory, repository data flow diagram, mutation + cache invalidation patterns, Zustand auth persistence, and EcoService polling strategy. |
| 5 | **DEVELOPMENT_GUIDELINES_AI.md** | `docs/DEVELOPMENT_GUIDELINES_AI.md` | Team split strategy for conflict-free parallel development, TypeScript naming conventions, reusable AI prompt snippets for atoms/molecules/hooks/repositories, NativeWind code conventions, hackathon pragmatic trade-offs, and import alias quick reference. |

---

## User Profiles

| Profile | Route Group | Description |
|---|---|---|
| **Customer** (End User) | `app/(customer)/` | Browse EcoServices, discover products on map, place orders |
| **EcoService** (Green Entrepreneur) | `app/(ecoservice)/` | Manage inventory, receive orders, view analytics |

---

## Tech Stack Summary

| Concern | Technology |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Routing | Expo Router v6 (file-based) |
| Styling | NativeWind v4 (TailwindCSS) |
| Client State | Zustand v5 + SecureStore |
| Server State & Cache | TanStack Query v5 |
| HTTP | Axios with auth interceptor |
| Forms | React Hook Form + Zod |
| Build | EAS Build (preview APK / production AAB) |
| Backend | [Service Provider/Hosting, e.g., Firebase / Supabase / AWS / Custom Services] |

---

## Available Scripts

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run lint           # ESLint check
npm run type-check     # TypeScript type check
npm run build:preview  # EAS Build — shareable APK
npm run build:production # EAS Build — production AAB
```

---

## Directory Highlights

```
app/           → Expo Router screens & layouts (route groups per profile)
src/
  components/  → Atomic Design UI library (atoms → molecules → organisms)
  features/    → Profile-scoped feature hooks (customer/ | ecoservice/)
  repositories/→ Data access layer (all API calls live here)
  store/       → Zustand stores (auth, UI state)
  lib/         → Singletons (apiClient, queryClient)
  types/       → TypeScript interfaces
  constants/   → Query keys, cache times, storage keys, color tokens
docs/          → Architecture documentation (5 markdown files)
```

---

## Team

| Role | Focus |
|---|---|
| Dev A | Customer flows (`app/(customer)/`, `src/features/customer/`) |
| Dev B | EcoService flows (`app/(ecoservice)/`, `src/features/ecoservice/`) |
| Dev C | Shared components, repositories, auth (`src/components/atoms/`, `src/repositories/`) |

> See `docs/DEVELOPMENT_GUIDELINES_AI.md` for the full parallel-work strategy and AI prompt snippets.

---

*Built with 💚 for the CochaTech Hackathon — Gaia Pacha MVP*

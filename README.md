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

## Documentation Index

Start with these **core documentation** files to understand the app:

| Document | Location | Purpose |
|---|---|---|
| **Setup.md** | `docs/Setup.md` | Local development environment setup, prerequisites, and installation steps. **Start here for new developers.** |
| **Architecture.md** | `docs/Architecture.md` | System design, file organization, data flow patterns, and key design decisions. |
| **Features.md** | `docs/Features.md` | Implemented features, core modules, dependencies, and roadmap. |

### Extended Architecture Documentation

Additional comprehensive reference documents:

| Document | Location | Purpose |
|---|---|---|
| **TECH_STACK_CONFIG.md** | `docs/TECH_STACK_CONFIG.md` | Full technology stack rationale, NativeWind v4 setup, EAS Build commands, Metro optimizations. |
| **ARCHITECTURE_AND_DIRECTORIES.md** | `docs/ARCHITECTURE_AND_DIRECTORIES.md` | Detailed feature-first architecture explanation, directory tree with annotations, Atomic Design rules. |
| **NAVIGATION_FLOWS.md** | `docs/NAVIGATION_FLOWS.md` | Complete Expo Router routing map, auth guards, role-based redirects, deep linking configuration. |
| **DATA_OPTIMIZATION_CACHING.md** | `docs/DATA_OPTIMIZATION_CACHING.md` | TanStack Query configuration, cache strategy, mutations, Zustand persistence patterns. |
| **DEVELOPMENT_GUIDELINES_AI.md** | `docs/DEVELOPMENT_GUIDELINES_AI.md` | Team development strategy, naming conventions, AI prompt templates, pragmatic trade-offs. |
| **SESSION_PROGRESS.md** | `docs/SESSION_PROGRESS.md` | Current feature status, known issues, blockers, and roadmap progress. |

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

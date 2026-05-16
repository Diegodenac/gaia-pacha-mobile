# TECH_STACK_CONFIG.md
## Tech Stack & Base Configuration Guide — Gaia Pacha Mobile MVP

> **Read this first.** This document explains every technology choice in the project and how to get the app running from zero.

---

## 1. Core Technology Decisions

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | **React Native + Expo** | SDK 52 | Managed workflow = zero native config for hackathon speed |
| Routing | **Expo Router** | v4 | File-based routing, typed routes, deep linking out-of-the-box |
| Styling | **NativeWind v4** | ^4.1 | TailwindCSS syntax on React Native; Atomic Design friendly |
| UI Tokens | **Tailwind CSS** | ^3.4 | Design system backbone for NativeWind |
| State | **Zustand** | ^5.0 | Minimal boilerplate, built-in persist middleware |
| Server State & Cache | **TanStack Query** | ^5.59 | Query deduplication, cache-first, staleTime policies |
| HTTP Client | **Axios** | ^1.7 | Interceptors for auto auth-token injection |
| Forms | **React Hook Form + Zod** | latest | Type-safe forms with schema validation |
| Auth Persistence | **expo-secure-store** | ^14 | Encrypted key-value storage (keychain on iOS, Keystore on Android) |
| Bundler | **Metro** (Expo-managed) | built-in | Optimised via `metro.config.js` with NativeWind integration |
| Build & Distribution | **EAS Build** | latest CLI | One-command APK/AAB generation; free tier sufficient for hackathon |
| Backend Integration | **[Service Provider/Hosting, e.g., Firebase / Supabase / AWS / Custom Services]** | — | Plug the API URL into `app.json` > `extra.apiUrl` |

---

## 2. Prerequisites

```bash
# Node.js 20+ (LTS)
node --version  # ≥ 20.0.0

# Expo CLI (global)
npm install -g expo-cli eas-cli

# EAS CLI login (required for builds)
eas login
```

---

## 3. Installation — Zero to Running

```bash
# 1. Clone the repository
git clone [YOUR_REPO_URL]
cd mobile-project

# 2. Install dependencies
npm install

# 3. Start development server (Expo Go compatible)
npx expo start

# 4. Open on device
#    → Scan the QR code with Expo Go (iOS/Android)
#    → Press 'a' for Android emulator | 'i' for iOS simulator
```

> After `npm install`, `npx expo start` is the **only** command needed to run the app.

---

## 4. NativeWind v4 Configuration

NativeWind v4 differs significantly from v2/v3:

### 4.1 metro.config.js
```js
const { withNativeWind } = require('nativewind/metro');
module.exports = withNativeWind(config, { input: './src/styles/global.css' });
```

### 4.2 babel.config.js
```js
presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
plugins: ['nativewind/babel'],
```

### 4.3 global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4.4 TypeScript
```ts
// nativewind-env.d.ts (already in project root)
/// <reference types="nativewind/types" />
```

---

## 5. EAS Build — Fast APK for Demo

```bash
npm install -g eas-cli
eas login
eas build:configure     # First time only
npm run build:preview   # → Shareable APK download link
npm run build:production # → Play Store AAB
```

### Build Profiles (`eas.json`)

| Profile | Output | Use Case |
|---|---|---|
| `development` | APK (debug) | Local dev with Expo Dev Client |
| `preview` | APK | Hackathon demo — share download link |
| `production` | AAB | Play Store submission |

---

## 6. Environment Variables

```bash
# .env.local (git-ignored)
EXPO_PUBLIC_API_URL=[YOUR_DEV_API_URL]
```

Only variables prefixed with `EXPO_PUBLIC_` are bundled client-side. Never expose secret keys.

---

## 7. Metro Optimisations

`metro.config.js` applies:
- NativeWind integration via `withNativeWind()`
- Lottie support via `assetExts.push('lottie')`
- React deduplication resolver
- Hermes enabled by default (Expo SDK 52, `newArchEnabled: true`)

---

## 8. Fonts

Inter font family loaded via `@expo-google-fonts/inter`:

```ts
// app/_layout.tsx
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
```

Tailwind font aliases (in `tailwind.config.js`):

```js
fontFamily: {
  sans:   ['Inter_400Regular'],
  medium: ['Inter_500Medium'],
  semi:   ['Inter_600SemiBold'],
  bold:   ['Inter_700Bold'],
}
```

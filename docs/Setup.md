# Mobile Application Setup Guide

## Prerequisites

Before starting local development, ensure you have the following installed:

1. **Node.js v18 or higher**
   ```bash
   node -v  # Should print v18.x.x or higher
   ```
   Download: https://nodejs.org

2. **npm v9 or higher** (comes with Node.js)
   ```bash
   npm -v   # Should print 9.x.x or higher
   ```

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Git**
   ```bash
   git --version  # Should print git version
   ```
   Download: https://git-scm.com

5. **Mobile Simulator/Emulator** (choose one)
   - **iOS**: Xcode with iOS Simulator (macOS only)
     ```bash
     xcode-select --install
     ```
   - **Android**: Android Studio with Emulator (Windows, macOS, Linux)
     Download: https://developer.android.com/studio
   - **Real Device**: Install Expo Go app from App Store or Google Play

---

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd mobile-project
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages specified in `package.json`:
- React Native, Expo, Expo Router
- UI libraries (NativeWind, Tailwind CSS)
- State management (Zustand)
- Data fetching (TanStack Query, Axios)
- Form handling (React Hook Form, Zod)

### 3. Environment Configuration

Create a `.env` file in the root directory. Copy from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your local values:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_PLAY_VERSION=1.0.0
```

#### Environment Variables Explained

- **EXPO_PUBLIC_API_BASE_URL**: Backend API server URL
  - Local development: `http://localhost:3000` or `http://192.168.1.x:3000`
  - Production: `https://api.yourdomain.com`
  - Note: Must use HTTPS in production for security

- **EXPO_PUBLIC_GOOGLE_PLAY_VERSION**: App version for Play Store metadata
  - Update this when pushing new app versions
  - Format: semantic versioning (X.Y.Z)

### 4. Start Development Server

```bash
npm run dev
```

Expected output:
```
Starting Expo dev server...
Available on:
  http://192.168.1.x:8081
  Scan this QR code with Expo Go app
```

---

## Running on Different Devices

### iOS Simulator (macOS only)

1. Install Xcode from App Store
2. Start simulator:
   ```bash
   open -a Simulator
   ```
3. In another terminal, run:
   ```bash
   npm run dev
   ```
4. Press `i` in the terminal to open app in simulator

### Android Emulator

1. Install Android Studio
2. Open Android Studio > Device Manager > Create Virtual Device
3. Start emulator from Device Manager
4. In terminal, run:
   ```bash
   npm run dev
   ```
5. Press `a` to open app in emulator

### Physical Device (Any Platform)

1. Install Expo Go app on your phone
2. Run `npm run dev` on your computer
3. Scan QR code with Expo Go
4. Ensure phone and computer are on same WiFi network
5. For local backend testing:
   - Backend must be accessible from phone's network
   - Use phone's WiFi IP address: `http://192.168.1.x:3000`
   - Don't use `localhost` or `127.0.0.1`

---

## Local Backend Connection

### Setup Backend Server

1. Navigate to backend folder:
   ```bash
   cd ../mobile-project/backend
   npm install
   npm run dev
   ```
   Backend starts on `http://localhost:3000`

2. Update mobile `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

3. Verify connection:
   - Check backend logs show incoming requests
   - Mobile app should login/register without errors

### Network Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend refused connection | Ensure backend running on port 3000 |
| Timeout errors | Check firewall allows localhost:3000 |
| CORS errors | Backend CORS_ORIGIN env var should include mobile URL |
| Physical device can't reach backend | Use phone's WiFi IP instead of localhost |

---

## Environment Setup for Different Stages

### Development (Local)

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Testing (QA)

```
EXPO_PUBLIC_API_BASE_URL=http://qa-api.example.com
NODE_ENV=staging
```

### Production

```
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
NODE_ENV=production
```

---

## Building for Testing (EAS Build)

To test on real devices without Expo Go, build an APK or IPA.

### Build APK for Android Testing

```bash
eas build --platform android --profile preview
```

- Takes 10-15 minutes
- Generates APK file you can transfer to Android device
- More reliable than Expo Go for testing production behavior

### Build IPA for iOS Testing (macOS)

```bash
eas build --platform ios --profile preview
```

- Generates testflight-compatible IPA
- Requires Apple Developer account

---

## Common Issues & Solutions

### Issue: "Port 8081 already in use"

```bash
# Use different port
npm run dev -- --port 8082
```

### Issue: "Module not found" after installation

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Backend connection timeout

1. Verify backend is running: `npm run dev` in `/backend` folder
2. Check .env has correct `EXPO_PUBLIC_API_BASE_URL`
3. Restart Expo dev server: `Ctrl+C` then `npm run dev`

### Issue: "Can't find variable: window" errors

- This is expected in React Native (no browser APIs)
- Make sure code doesn't use browser-only APIs (localStorage, window, etc.)
- Use `SecureStore` instead of localStorage for tokens

### Issue: Emulator/Simulator slow

```bash
# Clear Expo cache
expo start --clear

# Restart emulator completely
# Android: Close and reopen from Device Manager
# iOS: xcrun simctl erase all
```

### Issue: Form validation not working

- Ensure Zod schema is properly defined
- Check React Hook Form is initialized in component
- Verify error messages display in JSX

---

## Testing Locally

### Manual Testing Checklist

1. Start both mobile and backend servers
2. Test authentication flow:
   - Register new account
   - Login with credentials
   - Logout
3. Test customer profile:
   - Browse products
   - View product details
   - Check recommendations load
4. Test ecoservice profile:
   - View EcoService dashboard
   - Create new product
   - Upload product image
5. Test navigation:
   - Switch between tabs
   - Navigate between screens
   - Go back/forward

### Running Tests (if configured)

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Development Workflow

### Daily Development Loop

1. Make code changes in `src/` or `app/`
2. Save file - Expo auto-reloads app
3. Test changes in simulator/device
4. Check console for errors (Expo debug panel)

### Hot Reload vs. Cold Reload

- **Fast Refresh** (automatic): Most JS changes reload without losing state
- **Cold Reload** (manual): Press `r` in terminal to reload from scratch

### Debugging

Enable Expo debugger:
1. Open app in device/emulator
2. Shake device or press `Cmd+M` (iOS sim) / `Cmd+M` (Android)
3. Select "Open Debugger"
4. Chrome DevTools opens - inspect network, console, etc.

---

## File Structure Reference

After `npm install`, your local structure should be:

```
mobile-project/
├── app/                    # Expo Router screens
├── src/
│   ├── components/         # UI components
│   ├── features/           # Business logic hooks
│   ├── repositories/       # API calls
│   ├── store/              # Zustand state
│   ├── lib/                # Utilities & singletons
│   ├── types/              # TypeScript interfaces
│   └── constants/          # App constants
├── docs/                   # Documentation (including this file)
├── node_modules/           # Dependencies (created by npm install)
├── .env                    # Environment variables (create manually)
├── .env.example            # Environment template
├── package.json
├── package-lock.json
├── tsconfig.json
├── babel.config.js
├── eas.json
├── app.json
└── metro.config.js
```

---

## Next Steps

1. Complete the setup steps above
2. Verify backend is running on port 3000
3. Start mobile dev server: `npm run dev`
4. Open app in simulator or scan QR code
5. Test login with test credentials
6. Read Architecture.md for system design overview
7. Read Features.md for implemented functionality
8. Check SESSION_PROGRESS.md for known issues and roadmap

---

## Getting Help

- Expo documentation: https://docs.expo.dev
- React Native docs: https://reactnative.dev
- Check backend/docs/Setup.md for backend-specific setup
- Review existing features in `src/features/` for examples
- Look at sample screens in `app/(customer)/` and `app/(ecoservice)/`

---

## Production Deployment

For deploying to production (beyond MVP):
1. Update API URL in .env to production backend
2. Build signed APK/IPA via EAS
3. Submit to Play Store / App Store
4. See EAS documentation for detailed steps

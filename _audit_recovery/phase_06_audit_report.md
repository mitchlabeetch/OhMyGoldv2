# Phase 6 Audit Report — Native Mobile App Implementation

## Summary

| Metric | Value |
|--------|-------|
| **Total Findings** | 42 |
| **CRITICAL** | 14 |
| **HIGH** | 18 |
| **MEDIUM** | 7 |
| **LOW** | 3 |
| **Phase Status** | **INCOMPLETE** |
| **Expo SDK** | **52.0.0** (roadmap requires 53) |
| **App Build Viability** | **BROKEN** — multiple syntax errors and missing dependencies prevent compilation |

---

## 6.1: Mobile App Scaffolding

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Expo SDK version | ❌ FAIL | Uses SDK 52; roadmap mandates SDK 53 | HIGH |
| Expo Router file-based routing | ⚠️ PARTIAL | Router v3 present, but route groups misnamed (`auth` vs `(auth)`), duplicate exports, missing `+not-found.tsx` | CRITICAL |
| Bottom tab navigator (role-based) | ❌ FAIL | Only generic 4-tab client layout; no Employee/Manager/Teacher tabs | HIGH |
| Stack navigator for drill-down | ⚠️ PARTIAL | Root Stack exists, but `modal` screen referenced and missing | HIGH |
| Theme provider (light/dark) | ❌ FAIL | No ThemeProvider; no `useColorScheme` hook; app hardcoded to dark mode | HIGH |
| Safe area handling | ✅ PASS | `SafeAreaProvider` used on root layout; `SafeAreaView` on screens | — |
| Status bar theming | ⚠️ PARTIAL | Hardcoded `style="light"`; no dynamic theme switching | MEDIUM |
| Font loading (Inter, JetBrains Mono) | ❌ FAIL | `expo-font` plugin present but no font assets configured; no custom font usage in code | HIGH |
| Auth state routing | ⚠️ PARTIAL | Redirect logic exists but no `expo-dev-client`; no deep-link handler tested | MEDIUM |
| Deep linking (`ohmygold://`) | ⚠️ PARTIAL | Scheme configured in `app.json`; no `Linking` handlers or route interceptors implemented | MEDIUM |
| App icon & splash screen | ✅ PASS | Icons and splash assets referenced and verified on disk | — |
| `eas.json` build profiles | ❌ FAIL | File completely missing | HIGH |
| `expo-dev-client` | ❌ FAIL | Not in dependencies or plugins | HIGH |
| `+not-found.tsx` | ❌ FAIL | Missing | MEDIUM |

---

## 6.2: Mobile Authentication Screens

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Login screen | ⚠️ PARTIAL | `login.tsx` exists with basic email/password; missing OAuth, biometric, "Remember me", password visibility toggle | HIGH |
| Register screen | ⚠️ PARTIAL | `register.tsx` exists but is single-step; roadmap requires multi-step with progress dots and password strength | HIGH |
| Forgot password | ✅ PASS | `forgot-password.tsx` exists with deep-link redirect | — |
| Reset password (deep link) | ❌ FAIL | `reset-password.tsx` missing | HIGH |
| OAuth callback | ❌ FAIL | `oauth-callback.tsx` missing | HIGH |
| KeyboardAvoidingView | ✅ PASS | Present on all auth form screens | — |
| Biometric prompt | ❌ FAIL | `BiometricPrompt.tsx`, `useBiometricAuth.ts`, `biometric.ts` all missing | CRITICAL |
| OAuth buttons (Google/Apple) | ❌ FAIL | `OAuthButtons.tsx` missing; no `expo-auth-session` or `expo-apple-authentication` in deps | CRITICAL |
| LoginForm / RegisterForm components | ❌ FAIL | `LoginForm.tsx`, `RegisterForm.tsx` missing (logic inline in screens) | MEDIUM |
| Password visibility toggle | ❌ FAIL | Not implemented | MEDIUM |
| "Remember me" with SecureStore | ❌ FAIL | Not implemented | MEDIUM |
| Smooth transitions | ⚠️ PARTIAL | `animation: "fade"` on auth stack, but no slide animations between individual screens | LOW |

---

## 6.3: Client Mobile Experience

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Home dashboard | ⚠️ PARTIAL | `index.tsx` exists but file has **duplicate default exports** (compile error); static placeholder data only; no API-driven upcoming class card | CRITICAL |
| Class booking | ⚠️ PARTIAL | `booking.tsx` queries `gym_classes` but `@tanstack/react-query` is **not in package.json** (compile error); no cancel, no waitlist | CRITICAL |
| My bookings list | ❌ FAIL | `bookings/index.tsx` and `bookings/[id].tsx` missing | HIGH |
| Digital membership card (QR) | ⚠️ PARTIAL | `card.tsx` exists with fake QR grid; not a real QR code; no shake-to-refresh, no barcode toggle | HIGH |
| Progress / stats | ❌ FAIL | `progress/index.tsx`, `progress/goals.tsx` missing; no charts | HIGH |
| Settings menu | ⚠️ PARTIAL | `profile.tsx` acts as settings but missing sub-screens (`settings/index`, `settings/profile`, `settings/notifications`) | HIGH |
| Profile edit | ❌ FAIL | Alert placeholder only | MEDIUM |
| Notification preferences | ❌ FAIL | Toggle exists but not wired to backend; no per-category opt-out | MEDIUM |
| Language switch | ❌ FAIL | Placeholder alert only | MEDIUM |
| Pull-to-refresh | ❌ FAIL | Not implemented on any list | MEDIUM |
| Deep links from push | ❌ FAIL | No push notification system at all | CRITICAL |
| Offline: cached schedule/bookings | ❌ FAIL | No offline cache implementation | CRITICAL |

---

## 6.4: Employee Mobile Tools

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Check-in (QR/barcode scan) | ❌ FAIL | `checkin/` directory and all screens missing | CRITICAL |
| QR/barcode scanner overlay | ❌ FAIL | `scanner/` components missing; `expo-barcode-scanner` in deps but unused | CRITICAL |
| POS interface | ❌ FAIL | `pos/` directory and all screens missing | CRITICAL |
| Issue reporting (camera) | ❌ FAIL | `issues/` directory and all screens missing | CRITICAL |
| Attendance taking | ❌ FAIL | No employee attendance screen | CRITICAL |
| Member lookup | ❌ FAIL | `members/lookup.tsx` missing | CRITICAL |
| Large touch targets (56dp) | ❌ FAIL | Not applicable — screens missing | HIGH |
| Offline queue for check-ins | ❌ FAIL | No offline queue | CRITICAL |
| Photo upload with compression | ❌ FAIL | No camera components, no `expo-image-manipulator` | CRITICAL |

---

## 6.5: Manager Mobile Dashboard

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Manager dashboard screen | ❌ FAIL | `manager-dashboard.tsx` missing | CRITICAL |
| KPI cards | ❌ FAIL | Missing | CRITICAL |
| Revenue chart | ❌ FAIL | Missing; `react-native-chart-kit` not installed | CRITICAL |
| Occupancy gauge | ❌ FAIL | Missing | CRITICAL |
| Quick enrollment | ❌ FAIL | `enroll/index.tsx` missing | CRITICAL |
| Announcements composer | ❌ FAIL | `announcements/new.tsx` missing | CRITICAL |
| Real-time data (Supabase Realtime) | ❌ FAIL | No Realtime subscriptions in any file | HIGH |
| Responsive phone/tablet | ❌ FAIL | No tablet-specific layouts | MEDIUM |

---

## 6.6: Teacher Mobile Tools

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Teacher schedule | ❌ FAIL | `teacher-schedule.tsx` missing | CRITICAL |
| Attendance roster | ❌ FAIL | `attendance/` directory missing | CRITICAL |
| Large toggle buttons (64dp) | ❌ FAIL | Not applicable — screens missing | HIGH |
| Student progress notes | ❌ FAIL | `students/[id].tsx` missing | CRITICAL |
| Substitution requests | ❌ FAIL | `substitutions/` directory missing | CRITICAL |
| Messages to class attendees | ❌ FAIL | `teacher-messages/` directory missing | CRITICAL |
| Offline attendance sync | ❌ FAIL | No offline queue | CRITICAL |
| Class reminder notifications | ❌ FAIL | No notification system | CRITICAL |

---

## 6.7: Push Notification System

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Token registration | ❌ FAIL | `usePushNotifications.ts`, `NotificationProvider.tsx` missing | CRITICAL |
| FCM / APNs via Expo | ❌ FAIL | `expo-notifications` in deps but zero usage | CRITICAL |
| Rich notifications (images, actions) | ❌ FAIL | Missing | CRITICAL |
| Deep links from notification tap | ❌ FAIL | Missing | CRITICAL |
| Quiet hours (22:00-08:00) | ❌ FAIL | Missing | HIGH |
| Batching (09:00, 13:00, 17:00) | ❌ FAIL | Missing | HIGH |
| Delivery tracking | ❌ FAIL | Missing | HIGH |
| Edge Functions (`push-notifications/`) | ❌ FAIL | Directory and all functions missing | CRITICAL |
| Badge count management | ❌ FAIL | Missing | HIGH |
| Per-category opt-out | ❌ FAIL | Missing | HIGH |

---

## 6.8: Offline-First Implementation

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Offline cache strategy (TanStack Query persistent cache) | ❌ FAIL | No `QueryProvider`; no `AsyncStorage` cache persistence configured | CRITICAL |
| SQLite structured data | ❌ FAIL | `sqlite.ts` missing; `expo-sqlite` not in deps | CRITICAL |
| Action queue (syncQueue.ts) | ❌ FAIL | `syncQueue.ts`, `useSyncQueue.ts` missing | CRITICAL |
| Conflict resolution | ❌ FAIL | `conflictResolver.ts` missing | HIGH |
| Network status hook | ❌ FAIL | `useNetworkStatus.ts` missing; no `NetInfo` dependency | HIGH |
| Sync status indicator (SyncStatusBar) | ❌ FAIL | `SyncStatusBar.tsx` missing | HIGH |
| Offline check-ins queued | ❌ FAIL | No check-in implementation at all | CRITICAL |
| Offline attendance queued | ❌ FAIL | No teacher attendance implementation | CRITICAL |
| Offline bookings queued | ❌ FAIL | No queue for bookings | CRITICAL |
| Auto-sync on reconnect | ❌ FAIL | Missing | HIGH |

---

## 6.9: Biometric Authentication (roadmap extra)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Face ID / Touch ID / Fingerprint | ❌ FAIL | `useBiometricAuth.ts`, `biometric.ts` missing | CRITICAL |
| Setup prompt after first login | ❌ FAIL | Missing | CRITICAL |
| Settings toggle | ❌ FAIL | Missing | HIGH |
| Fallback to password | ❌ FAIL | Missing | HIGH |
| SecureStore for preference | ❌ FAIL | `expo-secure-store` in deps but unused for biometric | HIGH |

---

## 6.10: Camera Integration (roadmap extra)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Camera capture (expo-camera v16) | ❌ FAIL | `CameraView.tsx`, `useCamera.ts` missing; `expo-camera` v15 in deps (not v16) | CRITICAL |
| Photo preview | ❌ FAIL | `PhotoPreview.tsx` missing | CRITICAL |
| Annotation overlay | ❌ FAIL | `AnnotationOverlay.tsx` missing | CRITICAL |
| Photo compression / upload | ❌ FAIL | `photoUpload.ts`, `expo-image-manipulator` missing | CRITICAL |

---

## 6.11: QR/Barcode Scanning (roadmap extra)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| QRScanner component | ❌ FAIL | `QRScanner.tsx`, `useQRScanner.ts` missing | CRITICAL |
| Scan overlay | ❌ FAIL | `ScanOverlay.tsx` missing | CRITICAL |
| Scan result handlers | ❌ FAIL | `scanHandlers.ts` missing | CRITICAL |
| Haptic + sound feedback | ❌ FAIL | `expo-haptics` in deps but unused | HIGH |
| Scan history | ❌ FAIL | Missing | HIGH |

---

## 6.12: GPS Features (roadmap extra)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Location hook | ❌ FAIL | `useLocation.ts` missing; `expo-location` not in deps | CRITICAL |
| Gym finder / map | ❌ FAIL | `GymMap.tsx`, `NearbyGymsList.tsx` missing; `react-native-maps` not in deps | CRITICAL |
| GPS-verified check-in | ❌ FAIL | `gpsCheckIn.ts` missing | CRITICAL |
| Directions to gym | ❌ FAIL | Missing | HIGH |
| Location-based offers / geofencing | ❌ FAIL | Missing | HIGH |

---

## Findings Detail

### CRITICAL-001: Duplicate Default Exports in `(tabs)/_layout.tsx`
- **Item**: 6.1
- **Description**: The file `app/(tabs)/_layout.tsx` contains **two** `export default function TabsLayout()` declarations. JavaScript/TypeScript does not allow duplicate default exports in the same module. This causes an immediate **build failure**.
- **Impact**: App will not compile or bundle.
- **Fix Required**: Remove the second duplicate export; consolidate the two tab configurations into a single role-aware navigator.

### CRITICAL-002: Duplicate Default Exports in `(tabs)/index.tsx`
- **Item**: 6.3
- **Description**: `app/(tabs)/index.tsx` contains two `export default` functions (`HomeScreen` and `DashboardScreen`), each with its own `StyleSheet.create`. The second uses `useTranslation` without importing it.
- **Impact**: App will not compile.
- **Fix Required**: Remove the second default export and unused `useTranslation` reference.

### CRITICAL-003: Missing Dependency `@tanstack/react-query`
- **Item**: 6.1 / 6.3
- **Description**: `booking.tsx` imports `useQuery` and `useMutation` from `@tanstack/react-query`, but this package is **absent** from `package.json` dependencies. Additionally, there is no `QueryProvider` wrapping the app.
- **Impact**: App will not compile; runtime crash on booking screen.
- **Fix Required**: Add `@tanstack/react-query` to dependencies and create `QueryProvider.tsx` wrapping the root layout.

### CRITICAL-004: Missing Dependency `lucide-react-native`
- **Item**: 6.1
- **Description**: `(tabs)/_layout.tsx` imports icons from `lucide-react-native`, but the package is not listed in `package.json`. The second duplicate layout also references `Users` and `CreditCard` without importing them.
- **Impact**: App will not compile.
- **Fix Required**: Add `lucide-react-native` to dependencies and fix missing icon imports.

### CRITICAL-005: Route Group Naming Mismatch `(auth)` vs `auth`
- **Item**: 6.1
- **Description**: The root layout references `<Stack.Screen name="(auth)" ... />`, but the actual directory is `app/auth/` (no parentheses). In Expo Router, the screen name must match the directory name. This mismatch will break navigation to auth screens.
- **Impact**: Auth screens may not render; deep links to auth routes will fail.
- **Fix Required**: Rename directory to `app/(auth)/` or update root layout references to `name="auth"`.

### CRITICAL-006: Missing `+not-found.tsx`
- **Item**: 6.1
- **Description**: Expo Router requires a `+not-found.tsx` file for handling unmatched routes. It is completely missing.
- **Impact**: Unmatched routes crash or show a blank screen instead of a controlled error UI.
- **Fix Required**: Create `app/+not-found.tsx` with a branded 404/not-found screen.

### CRITICAL-007: Missing `reset-password.tsx` Deep-Link Screen
- **Item**: 6.2
- **Description**: The forgot-password screen sets `redirectTo: "ohmygold://auth/reset-password"`, but `app/auth/reset-password.tsx` does not exist.
- **Impact**: Users clicking the email reset link will land on a non-existent route.
- **Fix Required**: Create `app/auth/reset-password.tsx` that parses the deep-link hash and calls `supabase.auth.updateUser({ password })`.

### CRITICAL-008: No OAuth Implementation
- **Item**: 6.2
- **Description**: The roadmap requires Google Sign-In and Apple Sign-In with equal prominence. Neither `expo-auth-session`, `@react-native-google-signin/google-signin`, nor `expo-apple-authentication` is in dependencies. `OAuthButtons.tsx` is missing.
- **Impact**: App Store rejection risk (Apple mandates Sign in with Apple if other OAuth is present); users cannot use social login.
- **Fix Required**: Install required OAuth packages and implement `OAuthButtons.tsx` with native bottom-sheet behavior.

### CRITICAL-009: No Biometric Authentication
- **Item**: 6.9
- **Description**: Entire biometric stack is missing: `useBiometricAuth.ts`, `BiometricPrompt.tsx`, `biometric.ts`. `expo-local-authentication` is in plugins but never invoked.
- **Impact**: No Face ID / fingerprint login; falls short of roadmap success criteria.
- **Fix Required**: Implement full biometric setup flow after first login with SecureStore persistence and fallback handling.

### CRITICAL-010: No Push Notification System
- **Item**: 6.7
- **Description**: `expo-notifications` is in dependencies/plugins but **zero** client-side code uses it. `NotificationProvider.tsx`, `usePushNotifications.ts`, `lib/notifications.ts`, and all Edge Functions are missing.
- **Impact**: No push notifications; no token registration; no deep links from notifications; no engagement.
- **Fix Required**: Build client token registration, server-side Edge Function for sending, quiet-hours logic, batching, and delivery tracking.

### CRITICAL-011: No Offline-First Architecture
- **Item**: 6.8
- **Description**: Every offline-first file is missing (`offlineStorage.ts`, `sqlite.ts`, `syncQueue.ts`, `conflictResolver.ts`, `useOfflineCache.ts`, `useSyncQueue.ts`, `useNetworkStatus.ts`, `SyncStatusBar.tsx`). `expo-sqlite` and `@react-native-community/netinfo` are not installed.
- **Impact**: App requires constant connectivity; unusable in gym basement/WiFi dead zones.
- **Fix Required**: Implement SQLite-based action queue, persistent TanStack Query cache, conflict resolution, and sync status UI.

### CRITICAL-012: No Camera / QR / Barcode Implementation
- **Item**: 6.10 / 6.11
- **Description**: Despite `expo-camera` and `expo-barcode-scanner` being in dependencies, there is **no** scanner component, no camera view, no photo preview, no annotation overlay, and no scan result handling.
- **Impact**: Cannot perform QR check-in, product scan, or photo-based issue reporting.
- **Fix Required**: Build `QRScanner.tsx`, `CameraView.tsx`, `PhotoPreview.tsx`, `AnnotationOverlay.tsx`, and corresponding hooks/lib files.

### CRITICAL-013: No Employee, Manager, or Teacher Screens
- **Item**: 6.4 / 6.5 / 6.6
- **Description**: **All** role-specific screens beyond the generic 4-tab client layout are absent. No `checkin/`, `pos/`, `issues/`, `members/lookup.tsx`, `manager-dashboard.tsx`, `enroll/`, `announcements/`, `occupancy.tsx`, `teacher-schedule.tsx`, `attendance/`, `substitutions/`, `teacher-messages/`.
- **Impact**: Employees, managers, and teachers have **zero** mobile tooling.
- **Fix Required**: Create the full role-based screen trees and integrate with BottomTabConfig role filtering.

### CRITICAL-014: No GPS / Location Features
- **Item**: 6.12
- **Description**: `expo-location` and `react-native-maps` are not in dependencies. `useLocation.ts`, `GymMap.tsx`, `NearbyGymsList.tsx`, `gpsCheckIn.ts` are all missing.
- **Impact**: No gym finder, no GPS-verified check-in fraud prevention, no location-based offers.
- **Fix Required**: Install `expo-location` and `react-native-maps`; implement GPS check-in with haversine distance validation.

---

### HIGH-001: Expo SDK 52 Instead of 53
- **Item**: 6.1
- **Description**: `package.json` pins `expo` to `^52.0.0`. The roadmap explicitly requires Expo SDK 53.
- **Impact**: Potential compatibility issues with requested plugin versions; missing SDK 53 features.
- **Fix Required**: Upgrade to Expo SDK 53 (or document explicit exception if 53 is not yet stable).

### HIGH-002: No `eas.json` Build Profiles
- **Item**: 6.1
- **Description**: `eas.json` is completely missing. The roadmap requires development, preview, and production build profiles.
- **Impact**: Cannot create development builds or CI/CD builds for preview/production.
- **Fix Required**: Create `eas.json` with `development`, `preview`, and `production` profiles.

### HIGH-003: No `expo-dev-client` Configuration
- **Item**: 6.1
- **Description**: The roadmap specifies "Configure expo-dev-client". It is neither in `dependencies` nor in `app.json` plugins.
- **Impact**: Development workflows rely on Expo Go limitations; cannot use native modules requiring dev client.
- **Fix Required**: Add `expo-dev-client` to dependencies and plugins; update start scripts if needed.

### HIGH-004: No ThemeProvider / useColorScheme
- **Item**: 6.1
- **Description**: `ThemeProvider.tsx` and `useColorScheme.ts` are missing. The app hardcodes `#0A0A0A` background and light status bar everywhere. `app.json` sets `userInterfaceStyle: "dark"` with no automatic support.
- **Impact**: No light/dark mode switching; not accessible for users who prefer light mode.
- **Fix Required**: Implement Context-based theme provider with design tokens and a working `useColorScheme` hook.

### HIGH-005: No Font Loading (Inter, JetBrains Mono)
- **Item**: 6.1
- **Description**: `expo-font` plugin is in `app.json` but without font asset declarations. No font family usage (`Inter`, `JetBrains Mono`) appears in any screen.
- **Impact**: Falls short of brand identity requirements; typography is system-default.
- **Fix Required**: Add font assets to the project, configure `expo-font` plugin with asset paths, and apply families in styles.

### HIGH-006: No `QueryProvider` Wrapper
- **Item**: 6.1 / 6.8
- **Description**: Even if `@tanstack/react-query` were added, there is no `QueryProvider.tsx` to wrap the app. `booking.tsx` uses hooks that would fail at runtime.
- **Impact**: Data fetching architecture is broken.
- **Fix Required**: Create `QueryProvider.tsx` with `QueryClient` and persistent cache strategy, then wrap it in `app/_layout.tsx`.

### HIGH-007: Missing `modal.tsx` Screen
- **Item**: 6.1
- **Description**: `app/_layout.tsx` registers a `<Stack.Screen name="modal" ... />`, but `app/modal.tsx` does not exist.
- **Impact**: Navigating to `/modal` will crash or show a blank screen.
- **Fix Required**: Either create `app/modal.tsx` or remove the Stack.Screen reference.

### HIGH-008: Single-Step Registration (Not Multi-Step)
- **Item**: 6.2
- **Description**: `register.tsx` is a single long form. Roadmap requires 3-step registration with progress dots and password strength indicator.
- **Impact**: Lower UX quality; not aligned with roadmap success criteria.
- **Fix Required**: Refactor into multi-step wizard with progress indicator and strength meter.

### HIGH-009: No Progress / Goals / Charts Screens
- **Item**: 6.3
- **Description**: `progress/index.tsx`, `progress/goals.tsx`, and chart dependencies (`react-native-chart-kit` or similar) are all missing.
- **Impact**: Members cannot track workout stats or attendance streaks.
- **Fix Required**: Build progress dashboard with charts and goal management.

### HIGH-010: No Real QR Code Generation
- **Item**: 6.3
- **Description**: `card.tsx` renders a fake 9×9 grid of squares as a "QR code". It is not scannable and does not encode the member ID in a real QR format.
- **Impact**: Check-in scanners cannot read the code; member card is useless.
- **Fix Required**: Use a real QR code library (e.g., `react-native-qrcode-svg`) to encode the member ID.

### HIGH-011: No My Bookings List / Cancel Flow
- **Item**: 6.3
- **Description**: There is no `bookings/index.tsx` or `bookings/[id].tsx`. Users cannot view or cancel their bookings.
- **Impact**: Incomplete client experience.
- **Fix Required**: Create bookings list with segmented control (Upcoming / Past) and cancel action.

### HIGH-012: No Settings Sub-Screens
- **Item**: 6.3
- **Description**: `settings/` directory is missing. `profile.tsx` is a monolithic screen with placeholder alerts for every action.
- **Impact**: Users cannot edit profile, change password, or manage 2FA on mobile.
- **Fix Required**: Create `settings/index.tsx`, `settings/profile.tsx`, `settings/notifications.tsx` with real forms.

### HIGH-013: No Offline Storage Wrapper (`offlineStorage.ts`)
- **Item**: 6.8
- **Description**: `offlineStorage.ts` is missing. `AsyncStorage` is imported only in `supabase.ts` for auth persistence.
- **Impact**: No structured offline data layer.
- **Fix Required**: Create `offlineStorage.ts` with TTL, LRU eviction, and cache eviction policies as specified.

### HIGH-014: No Conflict Resolution Logic
- **Item**: 6.8
- **Description**: `conflictResolver.ts` is missing. No strategy defined for server-wins vs last-write-wins vs merge.
- **Impact**: Data conflicts during sync will be unhandled.
- **Fix Required**: Implement conflict resolution per data type.

### HIGH-015: No Scanner / Camera Hooks
- **Item**: 6.10 / 6.11
- **Description**: `useCamera.ts`, `useQRScanner.ts` are missing. `expo-camera` v15 is installed (roadmap wants v16).
- **Impact**: Camera and scanner cannot be used even if UI components were present.
- **Fix Required**: Implement hooks with permissions, capture, and scan result handling.

### HIGH-016: No Manager / Teacher / Employee Navigation Config
- **Item**: 6.1 / 6.4 / 6.5 / 6.6
- **Description**: `BottomTabConfig.ts`, `AppNavigator.tsx`, `AuthNavigator.tsx` are missing. The tab layout is hardcoded to 4 generic client tabs.
- **Impact**: No role-based navigation architecture.
- **Fix Required**: Create `BottomTabConfig.ts` with role-to-tab mapping and integrate into `(tabs)/_layout.tsx`.

### HIGH-017: No `expo-sqlite` or `expo-location` Dependencies
- **Item**: 6.8 / 6.12
- **Description**: Critical native packages required by the roadmap are absent from `package.json`.
- **Impact**: Cannot build offline SQLite layer or GPS features.
- **Fix Required**: Add `expo-sqlite` and `expo-location` (and `react-native-maps`) to dependencies and re-run prebuild.

### HIGH-018: No `expo-image-manipulator` or `expo-skia`
- **Item**: 6.10
- **Description**: Photo compression/annotation dependencies missing.
- **Impact**: Cannot compress photos to 2MB or annotate issue images.
- **Fix Required**: Add `expo-image-manipulator` and `expo-skia` (or `@shopify/react-native-skia`) to dependencies.

---

### MEDIUM-001: Auth Screens Not Using i18n Translations
- **Item**: 6.2
- **Description**: `login.tsx`, `register.tsx`, and `forgot-password.tsx` contain hardcoded English strings. The `auth.json` translation files exist but are not used in auth screens.
- **Impact**: Not fully bilingual; inconsistent with i18n setup.
- **Fix Required**: Replace hardcoded strings with `t('key')` from `react-i18next`.

### MEDIUM-002: No `expo-updates` / OTA Configuration
- **Item**: 6.1
- **Description**: No OTA update channel or runtime version is configured.
- **Impact**: Cannot push critical fixes to users without store review.
- **Fix Required**: Configure `expo-updates` with production channel and runtime version strategy.

### MEDIUM-003: No Pull-to-Refresh on Lists
- **Item**: 6.3 / 6.5 / 6.6
- **Description**: No `RefreshControl` is used on any `ScrollView` or flat list.
- **Impact**: Users cannot manually refresh data.
- **Fix Required**: Add `RefreshControl` to all data-driven scroll views.

### MEDIUM-004: No Password Visibility Toggle
- **Item**: 6.2
- **Description**: Login and register screens use `secureTextEntry` without an eye icon to toggle visibility.
- **Impact**: Minor UX friction.
- **Fix Required**: Add visibility toggle button next to password inputs.

### MEDIUM-005: No "Remember Me" / SecureStore Usage
- **Item**: 6.2
- **Description**: `expo-secure-store` is in plugins but never used to persist email or biometric preference.
- **Impact**: User must retype email every time; biometric preference not stored.
- **Fix Required**: Use `SecureStore` for "Remember me" email and biometric enabled flag.

### MEDIUM-006: `expo-camera` v15 Instead of v16
- **Item**: 6.10 / 6.11
- **Description**: `package.json` has `expo-camera` `~15.0.16`. Roadmap specifies v16.
- **Impact**: Potential API differences; not aligned with roadmap.
- **Fix Required**: Upgrade to `expo-camera` v16 and adjust any breaking API changes.

### MEDIUM-007: `expo-barcode-scanner` Legacy Package Present
- **Item**: 6.11
- **Description**: `expo-barcode-scanner` is installed, but the roadmap says to use `expo-camera` barcode scanning (new unified API in v16). Having both is redundant.
- **Impact**: Dead dependency; potential native module conflicts.
- **Fix Required**: Remove `expo-barcode-scanner` and migrate to `expo-camera` barcode scanning.

---

### LOW-001: No Haptic Feedback on Actions
- **Item**: 6.3 / 6.4
- **Description**: `expo-haptics` is in dependencies but never called. Roadmap requests haptic feedback on booking, check-in, etc.
- **Impact**: Slightly less premium feel.
- **Fix Required**: Add `Haptics.impactAsync` on key actions.

### LOW-002: No Dark Mode Splash / System UI
- **Item**: 6.1
- **Description**: `expo-system-ui` is present but no `setBackgroundColorAsync` or dark-mode splash variants are configured.
- **Impact**: Minor visual inconsistency during launch.
- **Fix Required**: Configure system UI background and dark splash in `app.json`.

### LOW-003: Hardcoded French Locale in Date Strings
- **Item**: 6.3
- **Description**: `index.tsx` uses `toLocaleDateString("fr-FR", ...)` and `toLocaleTimeString("fr-FR", ...)` regardless of device locale.
- **Impact**: Minor localization inconsistency.
- **Fix Required**: Use the active i18n locale or `expo-localization` locale for formatting.

---

## Recommended Fix Priority Order

1. **CRITICAL-001 through CRITICAL-005** — Fix syntax errors and missing dependencies so the app **compiles**.
2. **CRITICAL-006, HIGH-007** — Add missing route files (`+not-found.tsx`, `modal.tsx` or remove reference).
3. **CRITICAL-005** — Rename `auth` to `(auth)` or fix root layout references to match Expo Router conventions.
4. **CRITICAL-003, HIGH-006** — Add `@tanstack/react-query` and create `QueryProvider.tsx`.
5. **CRITICAL-007** — Create `reset-password.tsx` deep-link handler.
6. **CRITICAL-008** — Install OAuth packages and implement `OAuthButtons.tsx`.
7. **CRITICAL-009** — Implement biometric authentication stack.
8. **CRITICAL-010** — Build push notification client (`NotificationProvider`, `usePushNotifications`) and Edge Functions.
9. **CRITICAL-011** — Implement offline-first architecture (SQLite, sync queue, conflict resolver, network hook).
10. **CRITICAL-012** — Build camera, photo preview, annotation overlay, and QR scanner components.
11. **CRITICAL-013** — Create **all** Employee, Manager, and Teacher screen directories and files.
12. **CRITICAL-014** — Add GPS dependencies and implement gym finder + verified check-in.
13. **HIGH-001** — Evaluate Expo SDK 53 upgrade feasibility (or document deviation).
14. **HIGH-002, HIGH-003** — Add `eas.json` and `expo-dev-client`.
15. **HIGH-004, HIGH-005** — Implement ThemeProvider, `useColorScheme`, and load Inter / JetBrains Mono fonts.
16. **HIGH-009, HIGH-010, HIGH-011, HIGH-012** — Fill out missing Client screens (bookings, progress, settings, real QR code).
17. **MEDIUM-001, LOW-003** — Wire up i18n translations across all screens and respect device locale for dates.
18. **MEDIUM-002** — Configure `expo-updates` for OTA delivery.

---

*Audit completed. The mobile app implementation is at an extremely early scaffolding stage with fatal compile errors, almost no native feature implementation, and zero coverage for Employee, Manager, Teacher, Push Notifications, Offline-First, Biometric, Camera, QR Scanning, and GPS requirements.*

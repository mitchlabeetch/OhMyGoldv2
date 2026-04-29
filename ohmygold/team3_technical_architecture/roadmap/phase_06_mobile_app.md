# Phase 6: Native Mobile App Implementation

> **Phase ID:** P6
> **Duration:** 4-6 weeks
> **Prerequisites:** Phase 4 at 50%+ (core APIs available), Phase 2 (design system with mobile variants)
> **Goal:** Build a complete, feature-rich React Native mobile app for iOS and Android

---

## Phase Overview

Phase 6 builds the native mobile experience for OhMyGold using React Native with Expo. The mobile app serves as the primary interface for Clients and Teachers, and a powerful tool for Employees and Managers on the gym floor. The app leverages native capabilities: camera, GPS, biometrics, push notifications, and offline storage.

The mobile app follows the same architecture patterns as the webapp: TanStack Query for data, Zustand for state, shared TypeScript types and Zod schemas. UI components are the mobile variants from the design system (NativeWind + custom StyleSheet where needed).

**Key principle:** The mobile app is not a "webapp port" — it is a native-first experience optimized for touch, mobility, and gym floor usage.

---

## 6.1 Mobile App Scaffolding (Expo + Navigation)

### Description and Scope
Set up the Expo React Native app with file-based routing (Expo Router v3), navigation structure for all roles, theme provider (light/dark mode), safe area handling, status bar configuration, and font loading. Create the app shell: navigation, providers, and layout.

### Why This Matters
The app scaffolding determines the entire mobile architecture. Navigation structure, provider hierarchy, and theme setup are foundational decisions that affect every screen. Getting this right means smooth development; getting it wrong means constant refactoring.

### Technical Approach
Expo SDK 53 with development builds. Expo Router v3 for file-based routing. React Navigation v7 under the hood. Theme provider with Context + useColorScheme. Font loading via expo-font (Inter, JetBrains Mono). Safe area handling with react-native-safe-area-context. Status bar theming. Bottom tab navigator for main app, stack navigators for drill-down screens.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── (app)/
│   │   ├── _layout.tsx          # Authenticated app layout (tabs)
│   │   ├── index.tsx            # Home screen
│   │   ├── bookings/
│   │   ├── classes/
│   │   ├── profile/
│   │   └── settings/
│   ├── (auth)/
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── +not-found.tsx
├── providers/
│   ├── ThemeProvider.tsx
│   ├── AuthProvider.tsx
│   ├── QueryProvider.tsx
│   └── NotificationProvider.tsx
├── navigation/
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── BottomTabConfig.ts
└── hooks/
    └── useColorScheme.ts
```

### Dependencies on Other Items
- 1.4 (mobile dev environment)
- 2.1 (design tokens for theme)
- 3.2 (auth flow)

### Success Criteria
```
[ ] Expo app builds successfully (iOS and Android)
[ ] Expo Router file-based navigation works
[ ] Bottom tab navigator with 4-5 tabs per role
[ ] Stack navigator for detail screens
[ ] Theme provider: light/dark mode switching
[ ] Safe area handling on all screens
[ ] Status bar matches theme
[ ] Fonts loaded: Inter, JetBrains Mono
[ ] Auth state: unauthenticated → auth screens, authenticated → app
[ ] Deep linking configured for auth callbacks and push notifications
[ ] App icon and splash screen
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Set up the OhMyGold mobile app scaffolding with Expo and navigation.

CONTEXT: React Native app with Expo SDK 53, file-based routing, role-based navigation, and theme support.

TASK:
1. Expo configuration:
   - app.json: app name, slug, icon, splash screen, scheme
   - eas.json: build profiles (development, preview, production)
   - Configure expo-dev-client

2. Root layout (app/_layout.tsx):
   - ThemeProvider (light/dark)
   - AuthProvider (session management)
   - QueryProvider (TanStack Query)
   - NotificationProvider (push notifications)
   - SafeAreaProvider
   - StatusBar configuration

3. App layout with tabs (app/(app)/_layout.tsx):
   - Bottom tab navigator
   - Role-based tab items:
     * Client: Home, Bookings, QR Code, Progress, Settings
     * Employee: Check-In, POS, Classes, Issues
     * Manager: Dashboard, Members, Sales, Analytics, Settings
     * Teacher: Schedule, Students, Messages, Settings
   - Gold active indicator on tabs

4. Auth layout (app/(auth)/_layout.tsx):
   - Stack navigator for auth screens
   - No tab bar
   - Slide animations

5. Theme setup:
   - useColorScheme hook
   - Theme context with design tokens
   - Dark mode detection
   - Manual override option

6. Font loading:
   - Inter (headings and body)
   - JetBrains Mono (data/numbers)
   - Load via expo-font with splash screen

REQUIREMENTS:
- Expo SDK 53
- Expo Router v3
- Development builds (not Expo Go)
- File-based routing
- Safe area on all screens
- Deep linking: ohmygold:// scheme

FILES TO CREATE:
- apps/mobile/app.json
- apps/mobile/eas.json
- apps/mobile/src/app/_layout.tsx
- apps/mobile/src/app/(app)/_layout.tsx
- apps/mobile/src/app/(auth)/_layout.tsx
- apps/mobile/src/app/+not-found.tsx
- apps/mobile/src/providers/ThemeProvider.tsx
- apps/mobile/src/providers/AuthProvider.tsx
- apps/mobile/src/providers/QueryProvider.tsx
- apps/mobile/src/navigation/BottomTabConfig.ts
- apps/mobile/src/hooks/useColorScheme.ts

VERIFICATION STEPS:
1. Build app: npx expo prebuild → npx expo run:ios/android
2. Navigate between tabs
3. Toggle theme light/dark
4. Auth state: login → app screens, logout → auth screens
5. Deep link: ohmygold://classes opens classes screen
6. Splash screen and icon display

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Expo SDK: 53
- Navigation: Expo Router v3
- Tabs per role: Client/Employee/Manager/Teacher
- Theme: light/dark/auto
- Build successful: iOS/Yes, Android/Yes
```

---

## 6.2 Mobile Authentication Screens

### Description and Scope
Build native login, registration, password reset, and OAuth screens optimized for mobile. Use platform-specific patterns: bottom sheets for actions, native keyboard types, biometric login setup, and smooth transitions between auth states.

### Why This Matters
Auth screens are the entry point. A clunky mobile login experience loses users before they see the app. Native patterns (bottom sheets, proper keyboard types, Face ID) create a seamless experience that feels like a first-class app, not a webview.

### Technical Approach
Login: email/password with native TextInput (keyboardType="email-address"). Password visibility toggle. "Remember me" with SecureStore. OAuth: Google Sign-In via expo-auth-session, Apple Sign-In via expo-apple-authentication (native iOS UI). Biometric setup flow after first login. Password reset via deep link. All screens with proper KeyboardAvoidingView.

### Files/Directories to Create/Modify
```
apps/mobile/src/app/(auth)/
├── login.tsx                # Email/password login
├── register.tsx             # Multi-step registration
├── forgot-password.tsx      # Request reset email
├── reset-password.tsx       # New password (deep link)
└── oauth-callback.tsx       # Handle OAuth redirect
apps/mobile/src/components/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── OAuthButtons.tsx
│   └── BiometricPrompt.tsx
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- 3.2 (login logic)
- 3.3 (OAuth integration)

### Success Criteria
```
[ ] Login: email + password, native keyboard, loading state
[ ] Password visibility toggle
[ ] "Remember me" persists email
[ ] Google Sign-In: native bottom sheet on Android
[ ] Apple Sign-In: native iOS UI
[ ] Registration: multi-step with progress indicator
[ ] Password reset: deep link opens reset form
[ ] KeyboardAvoidingView: no keyboard overlap
[ ] Biometric prompt: setup after first successful login
[ ] Smooth transitions between auth screens
[ ] Error handling: inline errors, retry option
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Build mobile authentication screens for OhMyGold.

CONTEXT: Native auth screens optimized for mobile. Use platform-specific patterns.

TASK:
1. Login screen (login.tsx):
   - Logo at top
   - Email input (keyboardType="email-address", autoCapitalize="none")
   - Password input with visibility toggle
   - "Remember me" toggle (stores email in SecureStore)
   - Login button (full width, large touch target)
   - "Forgot password?" link
   - OAuth buttons: Google, Apple (equal prominence)
   - "Don't have an account? Sign up" link
   - KeyboardAvoidingView

2. Registration (register.tsx):
   - Multi-step with progress dots
   - Step 1: email, password, confirm
   - Step 2: first name, last name, phone
   - Step 3: review and submit
   - Password strength indicator
   - Terms acceptance checkbox

3. Password reset (forgot-password.tsx, reset-password.tsx):
   - Forgot: email input → success message
   - Reset: new password + confirm (deep link from email)

4. OAuth buttons (OAuthButtons.tsx):
   - Google: @react-native-google-signin/google-signin
   - Apple: expo-apple-authentication (native iOS)
   - Equal prominence (Apple App Store requirement)

5. Biometric prompt (BiometricPrompt.tsx):
   - After first login: "Enable Face ID for faster login?"
   - Setup: expo-local-authentication
   - Skip option (ask again later)

REQUIREMENTS:
- KeyboardAvoidingView on all forms
- Return key advances to next field
- Auto-fill support (password managers)
- Error states: inline red text
- Loading: button spinner
- Touch targets: minimum 48dp
- French and English

FILES TO CREATE:
- apps/mobile/src/app/(auth)/login.tsx
- apps/mobile/src/app/(auth)/register.tsx
- apps/mobile/src/app/(auth)/forgot-password.tsx
- apps/mobile/src/app/(auth)/reset-password.tsx
- apps/mobile/src/components/auth/LoginForm.tsx
- apps/mobile/src/components/auth/RegisterForm.tsx
- apps/mobile/src/components/auth/OAuthButtons.tsx
- apps/mobile/src/components/auth/BiometricPrompt.tsx

VERIFICATION STEPS:
1. Login with email/password
2. Login with Google (Android)
3. Login with Apple (iOS)
4. Register multi-step flow
5. Password reset via deep link
6. Enable Face ID/Touch ID
7. Keyboard doesn't overlap inputs
8. Form auto-fill works

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Auth methods: email/Google/Apple/biometric
- Platform tested: iOS/Android
- Keyboard handling: Yes/No
- Biometric: Face ID/Yes, Touch ID/Yes, Fingerprint/Android/Yes
```

---

## 6.3 Client Mobile Experience (Booking, Stats, Card)

### Description and Scope
Build the complete client mobile experience: home dashboard with upcoming classes and quick actions, class booking with schedule and filters, booking management (view, cancel), digital membership card with QR code, personal stats and progress tracking, and profile settings. This is the primary member-facing mobile experience.

### Why This Matters
The client mobile app is the face of OhMyGold to members. They book classes, show their QR code at check-in, track their progress, and manage their membership — all from their phone. A polished, fast client experience directly impacts retention and satisfaction.

### Technical Approach
Home screen: personalized dashboard with upcoming class card, quick action buttons (Book, My Card, Progress), and announcement feed. Booking: week view with horizontal scroll, class cards with book action, filter chips for type/instructor. Digital card: full-screen QR code with shake-to-refresh animation. Stats: charts from react-native-chart-kit, streak counters, goal progress. Settings: profile edit, notification toggles, language switch.

### Files/Directories to Create/Modify
```
apps/mobile/src/app/(app)/
├── index.tsx                # Home dashboard
├── bookings/
│   ├── index.tsx            # My bookings
│   └── [id].tsx             # Booking detail
├── classes/
│   ├── index.tsx            # Class schedule
│   └── [id].tsx             # Class detail
├── card.tsx                 # Digital membership card
├── progress/
│   ├── index.tsx            # Progress dashboard
│   └── goals.tsx            # Goal management
└── settings/
    ├── index.tsx            # Settings menu
    ├── profile.tsx          # Edit profile
    └── notifications.tsx    # Notification preferences
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- 6.2 (auth screens)
- Phase 4 (booking, membership, stats APIs)

### Success Criteria
```
[ ] Home: upcoming class with countdown, quick actions, announcements
[ ] Class booking: week view, filters, book in < 5 seconds
[ ] My bookings: list with cancel option
[ ] Digital card: full-screen QR, shake to refresh, barcode toggle
[ ] Progress: workout stats, attendance streak, charts
[ ] Goals: set, track, celebrate achievements
[ ] Profile: edit info, upload photo
[ ] Notifications: toggle preferences
[ ] Pull-to-refresh on all data screens
[ ] Deep links: from push notifications to relevant screen
[ ] Works offline: cached schedule, booked classes
```

### Estimated Effort
6-7 days

### LLM Agent Launch Prompt

```
Build the client mobile experience for OhMyGold.

CONTEXT: Primary member-facing mobile app. Must be fast, beautiful, and leverage native capabilities.

TASK:
1. Home screen (index.tsx):
   - Greeting with member name
   - Next class card: time, instructor, countdown
   - Quick actions: Book Class, My Card, My Progress (large buttons)
   - Announcement feed (horizontal scroll)
   - Membership status banner

2. Class booking (classes/index.tsx, classes/[id].tsx):
   - Day selector: horizontal scroll (Mon-Sun)
   - Class cards: time, name, instructor, spots left
   - Filter chips: type (Yoga, HIIT, etc.), instructor
   - Book button with confirmation
   - Class detail: description, intensity, requirements

3. My bookings (bookings/index.tsx):
   - Segmented control: Upcoming / Past
   - Booking cards with cancel option
   - Cancellation policy reminder
   - Add to calendar

4. Digital card (card.tsx):
   - Full-screen QR code (shake to refresh)
   - Member name, plan, expiry
   - Barcode toggle
   - Gold branding

5. Progress (progress/index.tsx, progress/goals.tsx):
   - Stats cards: workouts this month, streak, total check-ins
   - Attendance chart (weekly)
   - Goal progress bars
   - Achievement badges

6. Settings (settings/*):
   - Profile: edit, photo upload
   - Notifications: toggle per type
   - Language: FR/EN
   - 2FA management
   - Logout

REQUIREMENTS:
- Book class: < 5 seconds
- QR code: scannable, refresh on shake
- Charts: react-native-chart-kit
- Pull-to-refresh on all lists
- Offline: cache schedule and bookings
- French and English
- Haptic feedback on actions

FILES TO CREATE: All client screen files listed above

VERIFICATION STEPS:
1. Book class flow → confirmation
2. Display QR code → scannable at check-in
3. View progress charts
4. Cancel booking → policy enforced
5. Pull-to-refresh works
6. Offline: view cached schedule
7. Push deep link opens correct screen

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Booking time: ___ seconds
- QR refresh: shake/Yes
- Offline support: Yes/No
```

---

## 6.4 Employee Mobile Tools (Check-in, Photo Reporting, Scanner)

### Description and Scope
Build the employee mobile toolkit: check-in processing via QR/barcode scan, POS sales interface, facility issue reporting with camera, attendance taking, and member lookup. Optimized for speed with large touch targets and minimal navigation.

### Why This Matters
Employees use mobile devices on the gym floor — not desktops. A fast mobile check-in tool that processes a member in under 3 seconds keeps lines moving. Photo-based issue reporting (broken equipment, cleanliness) is a major differentiator vs competitors.

### Technical Approach
Check-in: expo-camera for QR/barcode scanning with real-time overlay. POS: simplified mobile cart with product search and payment. Issue reporting: camera capture → annotate → categorize → submit. Attendance: scrollable roster with large toggle buttons. Member lookup: search by name/card with quick profile view.

### Files/Directories to Create/Modify
```
apps/mobile/src/app/(app)/
├── checkin/
│   ├── index.tsx            # Check-in home (scan or search)
│   ├── scanner.tsx          # QR/barcode scanner
│   └── result.tsx           # Check-in result
├── pos/
│   ├── index.tsx            # POS product catalog
│   ├── cart.tsx             # Cart and payment
│   └── receipt.tsx          # Receipt
├── issues/
│   ├── index.tsx            # Issue list
   ├── new.tsx               # New issue (camera + form)
│   └── [id].tsx             # Issue detail
└── members/
    └── lookup.tsx           # Member lookup
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (check-in, POS, issues APIs)

### Success Criteria
```
[ ] Check-in: QR scan → validation → result in < 3 seconds
[ ] Barcode scanning for product lookup
[ ] POS: product search, cart, payment, receipt
[ ] Issue reporting: camera → annotate → categorize → submit
[ ] Issue list: status, priority, assigned to
[ ] Member lookup: search by name/card, view profile
[ ] Large touch targets (56dp minimum)
[ ] Works on tablet (front desk)
[ ] Offline: queue check-ins, sync when online
[ ] Photo upload with compression
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Build employee mobile tools for OhMyGold.

CONTEXT: Employee mobile toolkit for gym floor operations. Speed-optimized with native capabilities.

TASK:
1. Check-in (checkin/*):
   - Home: "Scan QR" or "Search Member" buttons
   - Scanner: expo-camera with QR/barcode overlay
   - Auto-detect and validate on scan
   - Result: green (welcome) or red (denied + reason)
   - Processing time: < 3 seconds
   - Offline: queue check-ins, batch sync

2. POS (pos/*):
   - Product grid with images and prices
   - Search by name or barcode scan
   - Cart: add/remove, quantity, total
   - Payment: cash or card
   - Receipt: generate and email
   - Large touch targets for tablet use

3. Issue Reporting (issues/*):
   - New issue: camera capture with annotation overlay
   - Category: equipment, cleanliness, safety, other
   - Priority: low, medium, high, critical
   - Description textarea
   - Submit with location auto-tagging
   - List: submitted issues with status

4. Member Lookup (members/lookup.tsx):
   - Search by name or card number
   - Results: photo, name, membership status
   - Tap to view full profile
   - Quick actions: message, view history

REQUIREMENTS:
- Touch targets: 56dp minimum
- Check-in: < 3 seconds
- Camera: expo-camera v16
- Photo compression: max 2MB
- Offline: queue and sync
- Tablet-optimized

FILES TO CREATE: All employee screen files

VERIFICATION STEPS:
1. Check-in: scan QR → result in < 3s
2. POS: complete sale → receipt
3. Issue: photo → annotate → submit
4. Member lookup: search → profile
5. Offline mode: queue check-ins
6. Tablet layout verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Tools implemented: ___
- Check-in time: ___ seconds
- Offline sync: Yes/No
```

---

## 6.5 Manager Mobile Dashboard

### Description and Scope
Build the manager mobile dashboard: quick overview of location KPIs, member enrollment quick action, daily revenue summary, class occupancy, staff on-duty, real-time occupancy, and push notification composition. Designed for managers who walk the floor.

### Why This Matters
Managers are rarely at their desks. They need quick-access mobile tools to check occupancy, enroll members, review revenue, and send announcements — all while walking the gym floor. The mobile dashboard is their command center on the go.

### Technical Approach
Dashboard with KPI cards (scrollable horizontally), action buttons for common tasks (enroll member, process refund, send announcement), real-time occupancy gauge, today's schedule summary, and alert feed. Revenue charts with date range selection. Member enrollment: quick form with essential fields.

### Files/Directories to Create/Modify
```
apps/mobile/src/app/(app)/
├── manager-dashboard.tsx    # Manager overview
├── enroll/
│   └── index.tsx            # Quick member enrollment
├── announcements/
│   └── new.tsx              # Compose and send push announcement
└── occupancy.tsx            # Real-time occupancy view
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (analytics, member enrollment APIs)

### Success Criteria
```
[ ] Dashboard: KPI cards (revenue, check-ins, occupancy, active members)
[ ] Revenue chart: daily/weekly toggle
[ ] Real-time occupancy gauge (color-coded)
[ ] Today's schedule: class list with enrollment counts
[ ] Quick enrollment: essential fields, 3-step flow
[ ] Announcement: compose, target audience, send push
[ ] Alert feed: failed payments, low stock, staff no-shows
[ ] Staff on-duty list
[ ] Responsive: phone and tablet
[ ] Data refreshes on pull-to-refresh
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Build the manager mobile dashboard for OhMyGold.

CONTEXT: Manager needs quick-access mobile tools for floor operations. KPI overview, quick actions, real-time data.

TASK:
1. Dashboard (manager-dashboard.tsx):
   - KPI cards: horizontal scroll
     * Revenue (today vs yesterday)
     * Check-ins (today)
     * Current occupancy
     * Active members
   - Revenue mini-chart
   - Action buttons: Enroll Member, Send Announcement, View Occupancy
   - Alert feed: latest notifications

2. Quick Enrollment (enroll/index.tsx):
   - 3-step: personal → plan → payment
   - Essential fields only (name, email, phone, plan, payment)
   - Camera for photo capture
   - Digital card generated on completion
   - Target: enroll in < 2 minutes

3. Announcements (announcements/new.tsx):
   - Compose message
   - Target: all members, class attendees, specific segment
   - Preview push notification
   - Send with confirmation

4. Occupancy (occupancy.tsx):
   - Large gauge: current / max
   - Color: green < 70%, amber 70-90%, red > 90%
   - Per-zone breakdown
   - Historical graph (today)

REQUIREMENTS:
- KPI cards with trend indicators
- Real-time via Supabase Realtime
- Enrollment: < 2 minutes
- Occupancy: large readable gauge
- French and English

FILES TO CREATE: All manager screen files

VERIFICATION STEPS:
1. Dashboard loads with KPIs
2. Revenue chart renders
3. Enroll member in < 2 minutes
4. Send announcement push
5. Occupancy gauge shows real-time data

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Dashboard widgets: ___
- Enrollment time: ___ minutes
- Real-time updates: Yes/No
```

---

## 6.6 Teacher Mobile Tools (Schedule, Attendance, Notifications)

### Description and Scope
Build teacher mobile tools: personal class schedule with lock screen widget support, attendance taking with large tap targets, student progress notes, class detail with enrollment list, substitution request, and direct messaging to class attendees. Designed for in-class use.

### Why This Matters
Teachers are on the move — they check their schedule between classes, take attendance during class, and communicate with students. Mobile tools must work reliably in a gym environment (potentially spotty WiFi). Large tap targets are essential because teachers may be marking attendance while wearing gloves or with sweaty hands.

### Technical Approach
Schedule: calendar view with class cards, tap to expand. Attendance: large toggle buttons per student (Present/Absent), auto-save, progress bar showing how many marked. Progress notes: quick text entry per student. Substitution: select class, reason, submit request. Messages: compose to all attendees of a specific class.

### Files/Directories to Create/Modify
```
apps/mobile/src/app/(app)/
├── teacher-schedule.tsx     # Personal class schedule
├── attendance/
│   ├── index.tsx            # Class list for attendance
│   └── [classId].tsx        # Attendance roster
├── students/
│   └── [id].tsx             # Student profile + notes
├── substitutions/
│   ├── index.tsx            # Substitution requests
│   └── new.tsx              # New substitution request
└── teacher-messages/
    ├── index.tsx            # Message history
    └── compose.tsx          # Compose to class
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (classes, attendance APIs)

### Success Criteria
```
[ ] Schedule: week view with class cards, tap for detail
[ ] Attendance: roster with large Present/Absent toggles
[ ] Auto-save attendance marks
[ ] Progress notes: quick add per student
[ ] Substitution: request coverage with reason
[ ] Messages: compose to class attendees
[ ] Large touch targets (teachers may wear gloves)
[ ] Offline: take attendance, sync after class
[ ] Today's next class widget (iOS/Android widgets)
[ ] Class reminder notifications
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Build teacher mobile tools for OhMyGold.

CONTEXT: Teacher needs in-class tools. Large tap targets for gloved hands. Offline attendance support.

TASK:
1. Schedule (teacher-schedule.tsx):
   - Week view with class cards
   - Show: time, name, room, enrollment count
   - Tap: expand for details
   - Next class highlighted

2. Attendance (attendance/*):
   - Class list with enrollment counts
   - Roster: student photo, name, large toggle
   - Toggle: PRESENT (green) / ABSENT (red) / NOT MARKED (gray)
   - Auto-save on toggle
   - Progress bar: "15/20 marked"
   - Submit when complete
   - Offline: store locally, sync after class

3. Student Notes (students/[id].tsx):
   - Student profile: photo, attendance rate
   - Notes: add, edit, view history
   - Quick note templates

4. Substitutions (substitutions/*):
   - List: pending, approved, history
   - New request: select class, reason, submit
   - Push notification to potential replacements

5. Messages (teacher-messages/*):
   - List: past messages
   - Compose: select class, type message, send
   - Push to all class attendees

REQUIREMENTS:
- Touch targets: 64dp minimum (glove-friendly)
- Attendance: mark 20 students in < 30 seconds
- Offline: queue attendance, sync later
- Auto-save: no manual save button needed
- French and English

FILES TO CREATE: All teacher screen files

VERIFICATION STEPS:
1. Schedule shows teacher's classes
2. Mark attendance: 20 students in < 30s
3. Add progress note
4. Request substitution
5. Send message to class
6. Offline attendance → sync

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Tools: ___
- Attendance speed: ___ students/30s
- Offline sync: Yes/No
```

---

## 6.7 Push Notification System

### Description and Scope
Implement the complete push notification system: token registration per device, notification types per role, rich notifications with images and action buttons, deep linking, quiet hours, batching, and delivery tracking. Uses Firebase Cloud Messaging (Android) and Apple Push Notification Service (iOS).

### Why This Matters
Push notifications drive 80% of mobile engagement for fitness apps. Class reminders, booking confirmations, payment alerts, achievement celebrations — all delivered via push. The 71% opt-in rate for fitness apps (vs 51% average) makes this a high-ROI feature. Every notification must be personalized, timely, and actionable.

### Technical Approach
Expo Notifications for cross-platform push. Server-side token management via Edge Function. Token stored per user-device pair. Rich notifications: images, action buttons. Deep links: notification tap → specific screen. Quiet hours: 22:00-08:00. Batching: non-urgent notifications grouped. Delivery tracking: sent, delivered, opened rates.

### Files/Directories to Create/Modify
```
supabase/functions/push-notifications/
├── index.ts                 # Send push notification
├── register-token.ts        # Register device token
└── delivery-tracking.ts     # Track delivery status
apps/mobile/src/
├── hooks/
│   └── usePushNotifications.ts
├── lib/
│   └── notifications.ts
└── providers/
    └── NotificationProvider.tsx
```

### Dependencies on Other Items
- 6.1 (app scaffolding with NotificationProvider)
- Phase 4 (booking, billing, classes APIs trigger notifications)

### Success Criteria
```
[ ] Token registration: on login, per device
[ ] iOS notifications: APNs via Expo
[ ] Android notifications: FCM via Expo
[ ] Notification types: booking, reminder, payment, achievement, announcement
[ ] Rich notifications: images, action buttons
[ ] Deep links: tap opens correct screen
[ ] Quiet hours: no non-critical pushes 22:00-08:00
[ ] Batching: non-urgent grouped and sent at 09:00, 13:00, 17:00
[ ] Delivery tracking: sent, delivered, opened
[ ] Unsubscribe: per-category opt-out
[ ] Badge count on app icon
[ ] Sound and vibration configurable
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement the push notification system for OhMyGold mobile app.

CONTEXT: Push notifications are critical for engagement. Must support all roles with personalized, actionable notifications.

TASK:
1. Token management:
   - Register token on login (Expo Notifications.getExpoPushTokenAsync)
   - Store in database per user-device
   - Handle token refresh
   - Remove token on logout

2. Notification types:
   - Booking: confirmed, cancelled, waitlist promoted
   - Reminder: class starting (15 min before), membership expiring
   - Payment: successful, failed, refund
   - Achievement: streak milestones, badges earned
   - Announcement: gym news, promotions
   - Staff: new lead, issue reported, shift reminder

3. Rich notifications:
   - Images: class preview, achievement celebration
   - Action buttons: "Book Now", "Check In", "View", "Dismiss"
   - Deep link: tap → specific in-app screen

4. Delivery configuration:
   - Quiet hours: 22:00 - 08:00 (no non-critical)
   - Batch window: 09:00, 13:00, 17:00 for non-urgent
   - Retry: 3 retries at 5-min intervals
   - Expiration: 24 hours

5. Tracking:
   - Sent, delivered, opened
   - Per-user notification history
   - Opt-out tracking per category

6. Implementation:
   - Edge Function: send push notification
   - Client: handle incoming notifications, deep link
   - Badge count management
   - Sound/vibration settings

REQUIREMENTS:
- Expo Notifications
- APNs (iOS) + FCM (Android)
- Quiet hours: 22:00-08:00 France timezone
- Deep links: ohmygold://screen/params
- Opt-out: per category in settings

REFERENCE:
- Mobile Research §7.3: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md
- Feature List §14: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

FILES TO CREATE:
- apps/mobile/src/hooks/usePushNotifications.ts
- apps/mobile/src/lib/notifications.ts
- apps/mobile/src/providers/NotificationProvider.tsx
- supabase/functions/push-notifications/index.ts

VERIFICATION STEPS:
1. Register token on login
2. Receive booking confirmation push
3. Tap notification → opens correct screen
4. Action buttons work
5. Quiet hours respected
6. Badge count updates
7. Opt-out: disable category, verify no more

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Notification types: ___
- Rich features: images/Yes, actions/Yes
- Delivery tracking: Yes/No
- Quiet hours: Yes/No
```

---

## 6.8 Offline-First Implementation

### Description and Scope
Implement offline-first architecture
#### Offline-First Cache Strategy (TanStack Query)

| Data Type | Cache TTL | Max Size | Invalidation Trigger |
|-----------|-----------|----------|---------------------|
| Class schedules | 24 hours | 5 MB | New schedule published, class cancelled |
| User bookings | 1 hour | 1 MB | Booking created/cancelled, check-in recorded |
| User profile | 6 hours | 500 KB | Profile edit, role change |
| Location info | 24 hours | 500 KB | Location settings changed |
| Membership status | 6 hours | 200 KB | Subscription event, payment processed |
| Notifications | 1 hour | 2 MB | New notification received |

**Cache eviction policy:**
- Maximum total cache: 50 MB on mobile
- LRU (Least Recently Used) eviction when limit reached
- Brand-critical data (membership QR code) never evicted
- Images: separate 20 MB cache with 7-day TTL

**Background refresh (stale-while-revalidate):**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
```
 for critical features: cached schedule data, queued bookings, offline check-ins, attendance taking, and draft notes. Data syncs automatically when connection restored. Clear sync status indicators.

### Why This Matters
Gyms often have spotty WiFi — basement locations, rural areas, network congestion during peak hours. Employees must be able to check in members and take attendance regardless of connectivity. Clients should see their schedule even offline. An app that requires constant connectivity is unreliable in a gym environment.

### Technical Approach
TanStack Query with persistent cache (AsyncStorage). SQLite via expo-sqlite for structured offline data. Action queue: pending actions stored locally, synced when online. Conflict resolution: server-wins for most data, last-write-wins for notes. Sync indicator: banner showing status. Background sync: periodic when app is foregrounded.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── lib/
│   ├── offlineStorage.ts      # AsyncStorage wrapper
│   ├── sqlite.ts              # SQLite operations
│   ├── syncQueue.ts           # Action queue management
│   └── conflictResolver.ts    # Conflict resolution logic
├── hooks/
│   ├── useOfflineCache.ts     # Cache data offline
│   ├── useSyncQueue.ts        # Queue and sync actions
│   └── useNetworkStatus.ts    # Online/offline detection
└── components/
    └── SyncStatusBar.tsx      # Sync indicator banner
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (all APIs — needs caching strategy per endpoint)

### Success Criteria
```
[ ] Schedule data cached and viewable offline
[ ] Booked classes viewable offline
[ ] Check-ins queued offline, synced when online
[ ] Attendance marks queued offline, synced when online
[ ] Booking requests queued, sent when online
[ ] Draft notes saved locally, synced when online
[ ] Sync status indicator: "Synced", "Syncing...", "X pending"
[ ] Auto-sync on reconnect (every 30 seconds check)
[ ] Manual sync: pull-to-refresh triggers sync
[ ] Conflict resolution: clear strategy per data type
[ ] Sync errors: retry with exponential backoff
[ ] No data loss: all queued actions eventually sync
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement offline-first architecture for OhMyGold mobile app.

CONTEXT: Gyms have spotty WiFi. Critical features must work offline and sync when connected.

TASK:
1. Offline storage:
   - AsyncStorage: cache API responses
   - expo-sqlite: structured data (schedule, bookings, check-ins)
   - Cache strategy: stale-while-revalidate
   - Cache expiry: 24 hours for schedule, 1 hour for bookings

2. Action queue:
   - Queue: array of pending actions
   - Action: type, payload, timestamp, retry_count
   - Types: check_in, book_class, mark_attendance, add_note
   - Persist in SQLite
   - Process FIFO when online

3. Sync manager:
   - Detect online/offline (NetInfo)
   - On reconnect: process queue
   - Interval: check every 30 seconds
   - Pull-to-refresh: force sync
   - Background sync: when app foregrounded

4. Conflict resolution:
   - Server-wins: schedule, bookings, member data
   - Last-write-wins: notes, profile changes
   - Merge: attendance (both marks recorded)
   - On conflict: show notification

5. UI indicators:
   - SyncStatusBar: subtle banner
   - "Synced" → green dot
   - "Syncing..." → spinner
   - "X pending" → amber dot with count
   - "Offline" → red dot

6. Error handling:
   - Retry: 3 attempts with exponential backoff
   - On failure: keep in queue, notify user
   - Never drop pending actions

FILES TO CREATE:
- apps/mobile/src/lib/offlineStorage.ts
- apps/mobile/src/lib/sqlite.ts
- apps/mobile/src/lib/syncQueue.ts
- apps/mobile/src/lib/conflictResolver.ts
- apps/mobile/src/hooks/useOfflineCache.ts
- apps/mobile/src/hooks/useSyncQueue.ts
- apps/mobile/src/hooks/useNetworkStatus.ts
- apps/mobile/src/components/SyncStatusBar.tsx

VERIFICATION STEPS:
1. View schedule offline
2. Queue check-in offline
3. Reconnect → auto-sync
4. Verify no data loss
5. Conflict resolution tested
6. Sync status indicator accurate
7. Pull-to-refresh triggers sync

REFERENCE:
- Mobile Research §7.4: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md
- Feature List §17: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Cached data types: ___
- Queued action types: ___
- Conflict strategy: ___
- Sync verified: Yes/No
```

---


#### Biometric Authentication Fallback

When Face ID / Touch ID is unavailable or fails:

| Scenario | Fallback Behavior |
|----------|-------------------|
| Biometric hardware unavailable | Prompt for device PIN/password |
| Biometric match fails (3 attempts) | Fall back to app password prompt |
| New biometric enrolled (security) | Require full password re-authentication on next app open |
| User disables biometric at OS level | Detect via `isEnrolledAsync()`, show password prompt |
| Biometric changed (e.g., new fingerprint) | Invalidate stored credentials, require password login |

```typescript
async function authenticateWithFallback(): Promise<AuthResult> {
  const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

  // Check if biometrics are available
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    // Fallback 1: Device PIN/password
    const pinResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access OhMyGold',
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });
    return pinResult;
  }

  // Check if biometric type changed since last auth
  const storedType = await SecureStore.getItemAsync('biometric_type');
  const currentType = biometricTypes[0]?.toString();
  if (storedType && storedType !== currentType) {
    // Biometric changed — require full password
    return { success: false, requiresPassword: true };
  }

  // Primary: Biometric
  const bioResult = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to access OhMyGold',
    biometricsSecurityLevel: 'strong',
  });

  if (!bioResult.success && bioResult.error === 'user_fallback') {
    // User chose fallback option
    return authenticateWithPassword();
  }

  return bioResult;
}
```

**`biometricType` detection:**
- `FACIAL_RECOGNITION` → Face ID (iOS) / Face Unlock (Android)
- `FINGERPRINT` → Touch ID (iOS) / Fingerprint (Android)
- `IRIS` → Iris scan (Samsung)
- Store detected type on first successful setup; re-check on every auth

## 6.9 Biometric Authentication

### Description and Scope
Implement biometric authentication for the mobile app: Face ID on iOS, fingerprint on Android. Setup prompt after first login, settings toggle to enable/disable, and fallback to password if biometric fails. Store credential validation result securely.

### Why This Matters
Members check the app frequently (booking classes, showing QR code). Typing a password every time is friction. Biometric auth provides security without friction — the ideal balance. In a gym context, users often have their hands full or are wearing gloves, so Face ID is especially valuable on iOS.

### Technical Approach
expo-local-authentication for cross-platform biometric support. After first successful login: prompt "Enable Face ID for faster login?" Store preference in SecureStore. On app launch: if biometric enabled, prompt for biometric instead of showing login screen. Fallback: password entry if biometric fails or user cancels. Can be disabled in settings.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── hooks/
│   └── useBiometricAuth.ts
├── components/
│   └── BiometricPrompt.tsx
└── lib/
    └── biometric.ts
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- 6.2 (auth screens)

### Success Criteria
```
[ ] Face ID works on iOS (iPhone X+)
[ ] Touch ID works on older iOS devices
[ ] Fingerprint works on Android
[ ] Setup prompt after first login
[ ] Skip option with "ask again later"
[ ] Settings toggle: enable/disable biometric
[ ] Fallback to password on biometric failure
[ ] Secure: uses device Keychain/Keystore
[ ] Works with app kill and relaunch
[ ] Does not interfere with session timeout
```

### Estimated Effort
1-2 days

### LLM Agent Launch Prompt

```
Implement biometric authentication for OhMyGold mobile app.

CONTEXT: Biometric login for frictionless app access. Face ID (iOS), fingerprint (Android).

TASK:
1. Biometric setup:
   - After first login: prompt "Enable Face ID for faster login?"
   - Check device capability: expo-local-authentication.hasHardwareAsync()
   - Check enrolled: isEnrolledAsync()
   - If capable and enrolled → offer setup
   - Store preference in SecureStore

2. Login flow with biometric:
   - App launch: check if biometric enabled
   - If enabled: show biometric prompt instead of login form
   - On success: restore session (refresh token from SecureStore)
   - On failure/cancel: show login form
   - First-time: always show login form

3. Settings toggle:
   - Settings > Security: "Use Face ID" toggle
   - On enable: verify biometric
   - On disable: immediate, no confirmation

4. Security:
   - Use SecureStore (Keychain/Keystore)
   - Store only refresh token (not password)
   - Handle biometric change (new fingerprint enrolled)

REQUIREMENTS:
- expo-local-authentication
- Face ID (iOS), Touch ID (iOS), Fingerprint (Android)
- Secure storage via SecureStore
- Graceful fallback to password
- French and English prompt text

FILES TO CREATE:
- apps/mobile/src/hooks/useBiometricAuth.ts
- apps/mobile/src/components/BiometricPrompt.tsx
- apps/mobile/src/lib/biometric.ts

VERIFICATION STEPS:
1. Setup Face ID after login
2. Kill app → relaunch → Face ID prompt
3. Cancel → login form appears
4. Disable in settings → login form on next launch
5. Test on iOS (Face ID) and Android (fingerprint)

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Biometric types: Face ID/Yes, Touch ID/Yes, Fingerprint/Yes
- Fallback working: Yes/No
- Security verified: Yes/No
```

---

## 6.10 Camera Integration for Issue Reporting

### Description and Scope
Integrate the device camera for facility issue reporting: take photos, annotate with text/shapes, attach to issue reports, and upload to Supabase Storage. Used by Managers and Employees for equipment issues, cleanliness reports, and safety concerns.

### Why This Matters
Photo-based issue reporting is a major differentiator. When a treadmill breaks, a staff member snaps a photo, adds a note, and submits — the entire process takes under 30 seconds. Maintenance gets a visual of the problem before they even arrive. This feature addresses a genuine gap in the market (Research Synthesis Insight 2).

### Technical Approach
expo-camera v16 for photo capture. expo-image-manipulator for compression. react-native-canvas or expo-skia for annotation overlay (draw arrows, circles, text). Supabase Storage for upload. Issue creation with photo attachment and metadata (location, timestamp, reporter).

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── components/
│   └── camera/
│       ├── CameraView.tsx
│       ├── PhotoPreview.tsx
│       └── AnnotationOverlay.tsx
├── hooks/
│   └── useCamera.ts
└── lib/
    └── photoUpload.ts
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (issue reporting API)

### Success Criteria
```
[ ] Camera opens from issue reporting screen
[ ] Photo capture with tap-to-focus
[ ] Flash control: on/off/auto
[ ] Front/back camera toggle
[ ] Photo preview before submission
[ ] Annotation: draw arrows, circles, text on photo
[ ] Photo compression: max 2MB
[ ] Upload to Supabase Storage with metadata
[ ] Attach to issue report
[ ] Gallery upload option (select from camera roll)
[ ] Works offline: photo saved locally, upload when online
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Integrate camera for issue reporting in OhMyGold mobile app.

CONTEXT: Photo-based issue reporting is a key differentiator. Staff snap, annotate, and submit facility issues.

TASK:
1. Camera component (CameraView.tsx):
   - Full-screen camera preview
   - Capture button (large, centered)
   - Flash toggle: on/off/auto
   - Camera switch: front/back
   - Tap to focus
   - expo-camera v16

2. Photo preview (PhotoPreview.tsx):
   - Display captured photo
   - Retake or continue buttons
   - Zoom/pan for annotation

3. Annotation overlay (AnnotationOverlay.tsx):
   - Draw: arrow, circle, rectangle
   - Add text annotation
   - Color picker (red, yellow, green)
   - Undo/clear
   - expo-skia for drawing

4. Upload flow:
   - Compress: max 2MB, JPEG quality 0.8
   - Upload to Supabase Storage: issues/{location_id}/{timestamp}.jpg
   - Attach URL to issue report
   - Offline: save to temp directory, upload later

5. Gallery option:
   - expo-image-picker for camera roll selection
   - Same annotation and upload flow

REQUIREMENTS:
- Photo capture: < 2 seconds
- Annotation: intuitive drawing
- Compression: max 2MB
- Upload: with progress indicator
- Offline: queue and sync
- French and English labels

FILES TO CREATE:
- apps/mobile/src/components/camera/CameraView.tsx
- apps/mobile/src/components/camera/PhotoPreview.tsx
- apps/mobile/src/components/camera/AnnotationOverlay.tsx
- apps/mobile/src/hooks/useCamera.ts
- apps/mobile/src/lib/photoUpload.ts

VERIFICATION STEPS:
1. Open camera → capture photo
2. Annotate with arrow and text
3. Submit issue with photo
4. Verify upload in Supabase Storage
5. Test gallery selection
6. Offline: queue photo, sync online

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Camera: expo-camera v16
- Annotation: expo-skia/Yes
- Upload compression: ___ MB
- Offline photo queue: Yes/No
```

---

## 6.11 QR Code/Barcode Scanning

### Description and Scope
Implement QR code and barcode scanning for check-in, product lookup, and equipment identification. Real-time camera preview with auto-detect, scan history, and result handling. Used by Employees (check-in, product scan) and Clients (self check-in at gym entrance).

### Why This Matters
QR check-in is the fastest entry method. A member shows their phone, staff scans, and they're in — under 3 seconds. Barcode scanning at POS eliminates manual product entry. QR codes on equipment enable quick equipment status checks. Camera-based scanning is the primary native capability leveraged by OhMyGold.

### Technical Approach
expo-camera with barcode scanning (BarcodeScanningResult). Custom overlay with scan area frame. Beep + haptic feedback on successful scan. Result handlers: check-in validation (Employee), membership display (self check-in), product lookup (POS). History of recent scans. Flash toggle for low-light environments.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── components/
│   └── scanner/
│       ├── QRScanner.tsx
│       ├── ScanOverlay.tsx
│       └── ScanResult.tsx
├── hooks/
│   └── useQRScanner.ts
└── lib/
    └── scanHandlers.ts      # Handle different scan types
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (check-in, POS APIs)

### Success Criteria
```
[ ] QR code scanning: real-time camera preview
[ ] Barcode scanning: EAN-13 for products
[ ] Auto-detect: no manual trigger needed
[ ] Scan overlay: target frame with corner brackets
[ ] Haptic feedback on successful scan
[ ] Beep sound on successful scan
[ ] Result handling: check-in, product lookup, equipment
[ ] Scan history: recent scans list
[ ] Flash toggle for low light
[ ] Employee check-in: scan member QR → validate → result
[ ] Client self check-in: scan gym QR → check in
[ ] POS product scan: scan barcode → add to cart
[ ] Processing time: < 1 second from scan to result
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Implement QR code and barcode scanning for OhMyGold mobile app.

CONTEXT: QR scanning is the primary check-in method. Must be fast and reliable.

TASK:
1. Scanner component (QRScanner.tsx):
   - Full-screen camera preview
   - expo-camera barcode scanning
   - Real-time detection (no manual trigger)
   - Support: QR_CODE, EAN_13, CODE_128

2. Scan overlay (ScanOverlay.tsx):
   - Target frame in center
   - Corner brackets (gold color)
   - Instructions text
   - Flash toggle button
   - Close button

3. Result handling (scanHandlers.ts):
   - Member QR: validate membership, show result
   - Gym QR (self check-in): record check-in
   - Product barcode: lookup product, add to cart
   - Equipment QR: show equipment info
   - Invalid: show error, allow retry

4. Feedback:
   - Haptic: light impact on scan
   - Sound: short beep on success
   - Visual: gold flash on scan

5. Scan history:
   - Store recent scans locally
   - Show in list with timestamp and result
   - Clear history option

REQUIREMENTS:
- Processing: < 1 second scan to result
- Auto-detect: no manual trigger
- Multiple barcode formats
- Haptic + sound feedback
- Works in low light (flash)
- French and English labels

FILES TO CREATE:
- apps/mobile/src/components/scanner/QRScanner.tsx
- apps/mobile/src/components/scanner/ScanOverlay.tsx
- apps/mobile/src/components/scanner/ScanResult.tsx
- apps/mobile/src/hooks/useQRScanner.ts
- apps/mobile/src/lib/scanHandlers.ts

VERIFICATION STEPS:
1. Scan member QR → validate → result
2. Scan product barcode → lookup
3. Scan in low light with flash
4. Haptic feedback on scan
5. Scan history recorded
6. Processing time < 1 second

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Barcode formats: ___
- Processing time: ___ seconds
- Feedback: haptic/Yes, sound/Yes
```

---

## 6.12 GPS Features

### Description and Scope
Implement GPS-based features: location-aware gym finder (nearby locations), GPS-verified check-in (prevent remote check-in fraud), directions to gym, and location-based offers. Uses expo-location for GPS access.

### Why This Matters
GPS verification prevents check-in fraud — members can't check in from home. Gym finder helps visitors and members find the nearest Gold's Gym. Location-based offers drive engagement when members are near the gym. These features leverage native GPS capabilities that web apps can't match.

### Technical Approach
expo-location for GPS access. Gym finder: query locations, calculate distance, sort by proximity, show on map (react-native-maps). GPS check-in: verify member is within configurable radius (e.g., 100m) of gym coordinates. Directions: open native maps app with gym address. Location-based offers: push notification when near gym.

### Files/Directories to Create/Modify
```
apps/mobile/src/
├── hooks/
│   └── useLocation.ts
├── components/
│   └── map/
│       ├── GymMap.tsx
│       └── NearbyGymsList.tsx
└── lib/
    └── gpsCheckIn.ts
```

### Dependencies on Other Items
- 6.1 (app scaffolding)
- Phase 4 (locations API)

### Success Criteria
```
[ ] Gym finder: list nearby Gold's Gym locations
[ ] Map view: pins for all locations
[ ] Distance calculation and sorting
[ ] Directions: open native maps app
[ ] GPS check-in: verify within 100m of gym
[ ] Location permissions: request with explanation
[ ] Location-based push offers
[ ] Works with GPS only (no WiFi needed)
[ ] Graceful fallback if GPS unavailable
[ ] Battery-efficient: don't track continuously
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Implement GPS features for OhMyGold mobile app.

CONTEXT: GPS verification prevents fraud. Gym finder helps discovery. Location-based offers drive engagement.

TASK:
1. Location hook (useLocation.ts):
   - Request permission: expo-location.requestForegroundPermissionsAsync()
   - Get current position: getCurrentPositionAsync()
   - Watch position: watchPositionAsync()
   - Accuracy: balanced (battery efficient)

2. Gym finder (NearbyGymsList.tsx, GymMap.tsx):
   - Query all locations from API
   - Calculate distance from current position
   - Sort by distance (nearest first)
   - List view: name, address, distance, hours
   - Map view: react-native-maps with pins
   - Tap pin → location detail with directions button

3. GPS check-in (gpsCheckIn.ts):
   - Get gym coordinates from location record
   - Calculate distance: haversine formula
   - Configurable radius: 100m default
   - If within radius: allow check-in
   - If outside: show "You must be at the gym to check in"
   - Timestamp + coordinates logged

4. Location-based offers:
   - Geofence around gym (expo-location geofencing)
   - Enter geofence: trigger push offer
   - "You're near Gold's Gym! Book a class?"
   - Configurable per location

5. Directions:
   - Link to open native Maps app
   - iOS: Apple Maps
   - Android: Google Maps
   - Pre-filled destination address

REQUIREMENTS:
- Permission request with explanation
- Battery efficient (no continuous tracking)
- Haversine distance calculation
- Configurable check-in radius
- Graceful fallback if GPS denied

FILES TO CREATE:
- apps/mobile/src/hooks/useLocation.ts
- apps/mobile/src/components/map/GymMap.tsx
- apps/mobile/src/components/map/NearbyGymsList.tsx
- apps/mobile/src/lib/gpsCheckIn.ts

VERIFICATION STEPS:
1. Request location permission
2. View nearby gyms sorted by distance
3. View gyms on map
4. GPS check-in: at gym → success, away → denied
5. Open directions in native maps
6. Battery usage acceptable

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- GPS features: gym finder/Yes, check-in verify/Yes, offers/Yes
- Check-in radius: ___ meters
- Battery impact: ___
```

---

## Phase 6 Completion Checklist

```
[ ] 6.1 App scaffolding: Expo, navigation, theme, fonts, safe area
[ ] 6.2 Auth screens: login, register, OAuth, biometric setup
[ ] 6.3 Client experience: booking, stats, digital card, progress
[ ] 6.4 Employee tools: check-in, POS, issue reporting, scanner
[ ] 6.5 Manager dashboard: KPIs, enrollment, announcements, occupancy
[ ] 6.6 Teacher tools: schedule, attendance, substitutions, messages
[ ] 6.7 Push notifications: all types, rich, deep links, quiet hours
[ ] 6.8 Offline-first: cache, queue, sync, conflict resolution
[ ] 6.9 Biometric auth: Face ID, fingerprint, secure storage
[ ] 6.10 Camera: photo capture, annotation, upload
[ ] 6.11 QR/Barcode: scanning, check-in, product lookup
[ ] 6.12 GPS: gym finder, verified check-in, directions
[ ] iOS build successful and tested on device
[ ] Android build successful and tested on device
[ ] All screens: loading states, error handling
[ ] Offline mode: critical features work without connectivity
[ ] Push notifications: received on both platforms
[ ] Biometric login: works on both platforms
[ ] QR scanning: < 1 second processing
[ ] App icon, splash screen, store screenshots
```

---

*Phase 6 notes: The mobile app is where OhMyGold truly shines. Native capabilities — camera, GPS, biometrics, push notifications — create experiences that web apps cannot match. The offline-first architecture ensures reliability in gym environments. Test on real devices, not just simulators. Battery usage matters: optimize location tracking, camera usage, and background sync.*

# Phase 5 Audit Report
## OhMyGoldv2 Webapp Screen Implementation

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Findings** | 28 |
| **CRITICAL** | 8 |
| **HIGH** | 10 |
| **MEDIUM** | 7 |
| **LOW** | 3 |
| **Phase Status** | **INCOMPLETE** |
| **Screens Found** | 33 / 72 Expected (45.8%) |
| **Screens Missing** | 39 / 72 Expected (54.2%) |

### Coverage by Role Package
| Role Package | Found | Expected | Coverage |
|-------------|-------|----------|----------|
| 5.1 Admin Screens | 9 | 15 | 60.0% |
| 5.2 Manager Screens | 6 | 16 | 37.5% |
| 5.3 Employee Screens | 3 | 8 | 37.5% |
| 5.4 Teacher Screens | 4 | 10 | 40.0% |
| 5.5 Client Screens | 6 | 10 | 60.0% |
| 5.6 Visitor Screens | 3 | 6 | 50.0% |
| 5.7 Shared Screens | 2 | 7 | 28.6% |

---

## 5.1 Admin Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /admin/dashboard | `pages/admin/dashboard.tsx` | Implemented | Hardcoded French labels mixed with i18n; no error boundary | MEDIUM |
| /admin/locations | `pages/admin/locations/index.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/locations/[id] | `pages/admin/locations/detail.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/users | `pages/admin/users/index.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/users/[id] | `pages/admin/users/detail.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/settings | `pages/admin/settings/index.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/analytics | `pages/admin/analytics/index.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/audit-log | `pages/admin/audit-log/index.tsx` | Implemented | No error boundary | MEDIUM |
| /admin/locations/new | `pages/admin/locations/new.tsx` | Implemented | No error boundary | MEDIUM |
| **/admin/users/new** | **—** | **MISSING** | User creation screen not implemented | **CRITICAL** |
| **/admin/settings/integrations** | **—** | **MISSING** | Payment gateway / API key config missing | **HIGH** |
| **/admin/settings/security** | **—** | **MISSING** | Password policy / 2FA config missing | **HIGH** |
| **/admin/roles** | **—** | **MISSING** | Role & permission matrix editor missing | **CRITICAL** |
| **/admin/backup** | **—** | **MISSING** | Backup management screen missing | **HIGH** |
| **/admin/reports** | **—** | **MISSING** | Global report generation missing | **HIGH** |
| **/admin/notifications** | **—** | **MISSING** | Global announcement composer missing | **HIGH** |

---

## 5.2 Manager Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /manager/dashboard | `pages/manager/dashboard.tsx` | Implemented | No error boundary; some hardcoded French | MEDIUM |
| /manager/members | `pages/manager/members/index.tsx` | Implemented | No error boundary | MEDIUM |
| /manager/members/[id] | `pages/manager/members/detail.tsx` | Implemented | No error boundary | MEDIUM |
| /manager/members/enroll | `pages/manager/members/enroll.tsx` | Implemented | No error boundary | MEDIUM |
| /manager/classes | `pages/manager/classes/index.tsx` | Implemented | No error boundary | MEDIUM |
| /manager/billing | `pages/manager/billing/index.tsx` | Implemented | No error boundary | MEDIUM |
| **/manager/classes/[id]** | **—** | **MISSING** | Class detail with attendee list missing | **HIGH** |
| **/manager/bookings** | **—** | **MISSING** | Booking management missing | **CRITICAL** |
| **/manager/staff** | **—** | **MISSING** | Staff list missing | **HIGH** |
| **/manager/staff/[id]** | **—** | **MISSING** | Staff profile missing | **HIGH** |
| **/manager/pos** | **—** | **MISSING** | Point of sale interface missing | **CRITICAL** |
| **/manager/inventory** | **—** | **MISSING** | Stock / purchase orders missing | **HIGH** |
| **/manager/crm** | **—** | **MISSING** | Lead pipeline missing | **HIGH** |
| **/manager/marketing** | **—** | **MISSING** | Campaign creation missing | **HIGH** |
| **/manager/analytics** | **—** | **MISSING** | Location analytics missing | **HIGH** |
| **/manager/reports** | **—** | **MISSING** | Location reports missing | **HIGH** |
| **/manager/settings** | **—** | **MISSING** | Location settings missing | **HIGH** |

---

## 5.3 Employee Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /employee/check-in | `pages/employee/check-in.tsx` | Implemented | No QR scan; no offline queue; no error boundary | MEDIUM |
| /employee/bookings | `pages/employee/bookings.tsx` | Implemented | No error boundary | MEDIUM |
| /employee/pos | `pages/employee/pos.tsx` | Implemented | No error boundary | MEDIUM |
| **/employee/dashboard** | **—** | **MISSING** | Daily overview missing | **HIGH** |
| **/employee/classes** | **—** | **MISSING** | Today's classes schedule missing | **HIGH** |
| **/employee/classes/[id]** | **—** | **MISSING** | Class attendance roster missing | **HIGH** |
| **/employee/members** | **—** | **MISSING** | Member lookup missing | **HIGH** |
| **/employee/issues** | **—** | **MISSING** | Facility issue reporting missing | **HIGH** |
| **/employee/schedule** | **—** | **MISSING** | Personal work schedule missing | **MEDIUM** |

---

## 5.4 Teacher Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /teacher/dashboard | `pages/teacher/dashboard.tsx` | Implemented | **Hardcoded mock data** — not connected to API; no i18n; no error boundary | **CRITICAL** |
| /teacher/classes | `pages/teacher/classes/index.tsx` | Implemented | No error boundary | MEDIUM |
| /teacher/classes/[id] | `pages/teacher/classes/detail.tsx` | Implemented | No error boundary | MEDIUM |
| /teacher/roster | `pages/teacher/roster.tsx` | Implemented | No error boundary | MEDIUM |
| **/teacher/schedule** | **—** | **MISSING** | Personal week view schedule missing | **HIGH** |
| **/teacher/classes/[id]/attendance** | **—** | **MISSING** | Attendance roster route missing (only `/teacher/roster` exists) | **HIGH** |
| **/teacher/students** | **—** | **MISSING** | Student list missing | **HIGH** |
| **/teacher/students/[id]** | **—** | **MISSING** | Student profile missing | **HIGH** |
| **/teacher/progress** | **—** | **MISSING** | Progress tracking missing | **HIGH** |
| **/teacher/substitutions** | **—** | **MISSING** | Substitution requests missing | **HIGH** |
| **/teacher/messages** | **—** | **MISSING** | Message students missing | **HIGH** |
| **/teacher/analytics** | **—** | **MISSING** | Personal performance analytics missing | **HIGH** |

---

## 5.5 Client Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /client/dashboard | `pages/client/dashboard.tsx` | Implemented | No error boundary; some hardcoded English | MEDIUM |
| /client/booking | `pages/client/booking/index.tsx` | Implemented | No error boundary | MEDIUM |
| /client/booking/my-bookings | `pages/client/booking/my-bookings.tsx` | Implemented | No error boundary | MEDIUM |
| /client/card | `pages/client/card/index.tsx` | Implemented | No error boundary | MEDIUM |
| /client/profile | `pages/client/profile/index.tsx` | Implemented | No error boundary | MEDIUM |
| /client/subscription | `pages/client/subscription/index.tsx` | Implemented | No error boundary | MEDIUM |
| **/client/book** | **—** | **MISSING** | Dedicated book screen (separate from `/client/booking`) | **HIGH** |
| **/client/bookings** | **—** | **MISSING** | Top-level bookings page missing | **MEDIUM** |
| **/client/membership** | **—** | **MISSING** | Membership details screen missing (only `/client/subscription` exists) | **MEDIUM** |
| **/client/membership/change** | **—** | **MISSING** | Upgrade/downgrade plan missing | **HIGH** |
| **/client/billing** | **—** | **MISSING** | Invoices & payments missing | **HIGH** |
| **/client/progress** | **—** | **MISSING** | Personal stats/goal tracking missing | **HIGH** |
| **/client/settings** | **—** | **MISSING** | Settings page missing | **HIGH** |
| **/client/settings/profile** | **—** | **MISSING** | Profile edit sub-page missing | **MEDIUM** |

---

## 5.6 Visitor Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /visitor | `pages/visitor/index.tsx` | Implemented | Hardcoded English text (not i18n); no error boundary | MEDIUM |
| /visitor/pricing | `pages/visitor/pricing.tsx` | Implemented | No error boundary | MEDIUM |
| /visitor/locations | `pages/visitor/locations.tsx` | Implemented | No error boundary | MEDIUM |
| **/** | **—** | **MISSING** | Landing page at root `/` missing — root redirects to `/dashboard` | **CRITICAL** |
| **/classes** | **—** | **MISSING** | Public class schedule browser missing | **HIGH** |
| **/pricing** | **—** | **MISSING** | Top-level pricing missing (only `/visitor/pricing` exists) | **MEDIUM** |
| **/locations** | **—** | **MISSING** | Top-level locations missing (only `/visitor/locations` exists) | **MEDIUM** |
| **/trial** | **—** | **MISSING** | Trial signup flow missing | **HIGH** |
| **/contact** | **—** | **MISSING** | Contact form missing | **HIGH** |

---

## 5.7 Shared Screens

| Required Screen | File Found | Status | Finding | Severity |
|-----------------|------------|--------|---------|----------|
| /404 | `pages/errors/not-found.tsx` | Implemented | French-only, no i18n | LOW |
| /unauthorized | `pages/errors/unauthorized.tsx` | Implemented | French-only, no i18n | LOW |
| **/settings** | **—** | **MISSING** | User settings page missing | **CRITICAL** |
| **/notifications** | **—** | **MISSING** | Notification center missing | **HIGH** |
| **/help** | **—** | **MISSING** | Help/FAQ missing | **HIGH** |
| **/403** | **—** | **MISSING** | Forbidden error page missing | **MEDIUM** |
| **/500** | **—** | **MISSING** | Server error page missing | **MEDIUM** |
| **/maintenance** | **—** | **MISSING** | Maintenance mode page missing | **MEDIUM** |

---

## Findings Detail

### CRITICAL-001: Root Route Redirects to Dashboard Instead of Landing Page
- **Screen**: `/` (root)
- **Description**: `App.tsx` line 233 routes `/` to `<Navigate to="/dashboard" replace />`. There is no public landing page. Visitors hitting the root are forced to auth, breaking the conversion funnel.
- **Impact**: Visitors cannot browse gym information without logging in. SEO and trial conversion are impossible.
- **Fix Required**: Create `pages/index.tsx` as the public landing page and map `/` to it. Only redirect authenticated users to `/dashboard`.

### CRITICAL-002: No Error Boundaries Anywhere in the Application
- **Screen**: ALL screens
- **Description**: Search across entire `src/` found zero (`0`) error boundary components. No `componentDidCatch`, no `ErrorBoundary` wrappers, no React error boundary packages. Every page can crash the entire app.
- **Impact**: Any unhandled exception in any screen crashes the entire SPA. Users see a white screen of death.
- **Fix Required**: Create an `ErrorBoundary` component and wrap every lazy-loaded page route, the AppShell, and the root App.

### CRITICAL-003: Teacher Dashboard Uses Hardcoded Mock Data
- **Screen**: `/teacher/dashboard`
- **Description**: `teacher/dashboard.tsx` contains hardcoded `todayClasses` and `upcomingWeek` arrays with fake data. No API hooks are used. No `useTranslation`. The page does not reflect real schedules.
- **Impact**: Teachers see fake data in production. Attendance, stats, and class lists are entirely non-functional.
- **Fix Required**: Replace mock data with `useClasses`, `useMyBookings`, or teacher-specific API hooks. Add i18n.

### CRITICAL-004: Missing Admin Roles Screen
- **Screen**: `/admin/roles`
- **Description**: Role definitions and permission matrix editor is not implemented. The `roles` array in `NAV_ITEMS` references `/admin/reports` (which also doesn't exist as a file) but there is no roles management UI.
- **Impact**: Admin cannot view or edit role permissions. RBAC configuration requires database direct access.
- **Fix Required**: Create `pages/admin/roles.tsx` with a permission matrix table (read/edit per role).

### CRITICAL-005: Missing Admin User Creation Screen
- **Screen**: `/admin/users/new`
- **Description**: The roadmap requires `/admin/users/new` for creating users with role assignment. The file `pages/admin/users/new.tsx` does not exist. Only `index.tsx` (list) and `detail.tsx` (view/edit) exist.
- **Impact**: Admins cannot create new users through the UI.
- **Fix Required**: Create `pages/admin/users/new.tsx` with a form including role, location, and personal info.

### CRITICAL-006: Missing Manager POS Screen
- **Screen**: `/manager/pos`
- **Description**: The POS interface is a core manager workflow but is entirely missing. The `Sidebar` nav references `/manager/pos` for `receptionist` role, but no file exists and no route is registered in `App.tsx`.
- **Impact**: Managers cannot process in-person sales. Revenue tracking via POS is impossible.
- **Fix Required**: Create `pages/manager/pos.tsx` with product catalog, cart, and payment flow.

### CRITICAL-007: Missing Manager Booking Management Screen
- **Screen**: `/manager/bookings`
- **Description**: Booking management (list, override capacity, waitlist, cancel) is missing. Only `/manager/classes` exists.
- **Impact**: Managers cannot manage class bookings, handle waitlists, or override capacity.
- **Fix Required**: Create `pages/manager/bookings.tsx`.

### CRITICAL-008: Missing Shared Settings Screen
- **Screen**: `/settings`
- **Description**: No top-level `/settings` page exists. The `Sidebar` has a "Settings" nav item for some roles but it routes to role-specific settings (`/admin/settings`, `/client/profile`, etc.). There is no unified user settings page with profile, password, notifications, 2FA, and language tabs.
- **Impact**: Users cannot manage their own profile, password, notification preferences, or 2FA from a single location.
- **Fix Required**: Create `pages/settings.tsx` with tabbed interface for profile, password, notifications, security, language.

---

### HIGH-001: Missing Admin Integrations Settings
- **Screen**: `/admin/settings/integrations`
- **Description**: Payment gateway config (Stripe keys), SendGrid, Twilio, webhook URL management is missing.
- **Impact**: Admins cannot configure third-party integrations via UI.
- **Fix Required**: Create `pages/admin/settings/integrations.tsx`.

### HIGH-002: Missing Admin Security Settings
- **Screen**: `/admin/settings/security`
- **Description**: Password policy, 2FA requirements, session timeout configuration missing.
- **Impact**: Security policies cannot be managed via UI.
- **Fix Required**: Create `pages/admin/settings/security.tsx`.

### HIGH-003: Missing Admin Backup Screen
- **Screen**: `/admin/backup`
- **Description**: Backup trigger, schedule, restore UI missing.
- **Impact**: Admins cannot trigger or schedule backups.
- **Fix Required**: Create `pages/admin/backup.tsx`.

### HIGH-004: Missing Admin Reports & Notifications Screens
- **Screen**: `/admin/reports`, `/admin/notifications`
- **Description**: Global report generation and announcement composer missing.
- **Impact**: No global reporting or mass notification capability.
- **Fix Required**: Create `pages/admin/reports.tsx` and `pages/admin/notifications.tsx`.

### HIGH-005: Missing Employee Dashboard, Classes, Attendance, Members, Issues, Schedule
- **Screen**: `/employee/dashboard`, `/employee/classes`, `/employee/classes/[id]`, `/employee/members`, `/employee/issues`, `/employee/schedule`
- **Description**: Only check-in, bookings, and POS exist for employees. Dashboard, class schedule, attendance roster, member lookup, issue reporting, and personal schedule are all missing.
- **Impact**: Front desk staff cannot view their daily overview, take class attendance, look up members, or report facility issues.
- **Fix Required**: Create all missing employee screens.

### HIGH-006: Missing Teacher Schedule, Students, Progress, Substitutions, Messages, Analytics
- **Screen**: `/teacher/schedule`, `/teacher/students`, `/teacher/students/[id]`, `/teacher/progress`, `/teacher/substitutions`, `/teacher/messages`, `/teacher/analytics`
- **Description**: Only dashboard, classes list, class detail, and generic roster exist. Personal schedule, student management, progress tracking, substitutions, messaging, and analytics are missing.
- **Impact**: Teachers cannot manage their full workflow.
- **Fix Required**: Create all missing teacher screens.

### HIGH-007: Missing Client Billing, Progress, Settings, Membership Change
- **Screen**: `/client/billing`, `/client/progress`, `/client/settings`, `/client/settings/profile`, `/client/membership/change`
- **Description**: Client cannot view invoices, track progress, manage settings, or change membership plan.
- **Impact**: Incomplete self-service portal.
- **Fix Required**: Create all missing client screens.

### HIGH-008: Missing Visitor Trial and Contact Screens
- **Screen**: `/trial`, `/contact`
- **Description**: Trial signup flow and contact form are missing. These are critical conversion funnel steps.
- **Impact**: No way for visitors to sign up for trials or contact the gym via web.
- **Fix Required**: Create `pages/trial.tsx` and `pages/contact.tsx`.

### HIGH-009: Missing Shared Notification Center and Help/FAQ
- **Screen**: `/notifications`, `/help`
- **Description**: Notification center (list, mark read, settings) and Help/FAQ (searchable, categorized) are missing.
- **Impact**: Users have no central notification UI or self-service help.
- **Fix Required**: Create `pages/notifications.tsx` and `pages/help.tsx`.

### HIGH-010: No E2E Tests Exist
- **Screen**: ALL
- **Description**: Zero E2E test files found. No Cypress, Playwright, or any `.spec.ts` / `.cy.ts` files exist in the web app. `package.json` only lists `vitest` for unit tests.
- **Impact**: Critical user journeys (login, booking, check-in, POS) are untested. Regressions will go undetected.
- **Fix Required**: Add Playwright or Cypress E2E suite with tests for login flow, role-based routing, booking flow, check-in, and POS transaction.

---

### MEDIUM-001: No Error Pages for 403, 500, Maintenance
- **Screen**: `/403`, `/500`, `/maintenance`
- **Description**: Only `/404` and `/unauthorized` exist. Missing dedicated 403 (Forbidden), 500 (Server Error), and maintenance mode pages.
- **Impact**: Users see generic browser errors or unhelpful messages.
- **Fix Required**: Create `pages/errors/forbidden.tsx`, `pages/errors/server-error.tsx`, `pages/errors/maintenance.tsx`.

### MEDIUM-002: Admin Dashboard Has Mixed i18n and Hardcoded French
- **Screen**: `/admin/dashboard`
- **Description**: Lines 80-95 contain hardcoded French strings ("Abonnements actifs", "Cours aujourd'hui", "Accès aujourd'hui") while other labels use `t()`.
- **Impact**: Inconsistent language display for English users.
- **Fix Required**: Extract all hardcoded labels into `dashboard.json` i18n files.

### MEDIUM-003: Manager Dashboard Has Hardcoded French
- **Screen**: `/manager/dashboard`
- **Description**: KPI card titles and section headers are hardcoded in French.
- **Impact**: English managers see French labels.
- **Fix Required**: Extract into i18n keys.

### MEDIUM-004: Visitor Home Page Is English-Only
- **Screen**: `/visitor`
- **Description**: All text on the landing page is hardcoded in English ("Start Your Journey", "Join Now", "How It Works"). No `useTranslation` usage except for nav.
- **Impact**: French visitors see English-only content. Brand requirement is FR/EN.
- **Fix Required**: Wrap all text in `t()` and add entries to `common.json` for both locales.

### MEDIUM-005: No Offline Support for Employee Check-In
- **Screen**: `/employee/check-in`
- **Description**: The roadmap requires offline queueing with Workbox + IndexedDB + Background Sync. The current implementation is a pure online React component with no service worker integration, no Dexie.js, no queue badge, no sync button.
- **Impact**: Front desk check-in fails when WiFi is spotty. No resilience.
- **Fix Required**: Implement Workbox routing for `/api/v1/check-ins`, Dexie.js `offlineDB`, background sync registration, and visual offline indicators.

### MEDIUM-006: Route Guards Do Not Verify Data Scope (Location Isolation)
- **Screen**: Manager & Employee routes
- **Description**: `ProtectedRoute` only checks role arrays. It does not verify that a manager/employee's `location_id` matches the data being requested. A manager could theoretically access another location's data by modifying the URL parameter.
- **Impact**: Potential data leakage across locations.
- **Fix Required**: Add middleware/hook that validates `locationId` from URL against user's `profile.location_id` for manager and employee roles.

### MEDIUM-007: Sidebar Nav References Non-Existent Routes
- **Screen**: Layout / Sidebar
- **Description**: `NAV_ITEMS` for `admin` and `super_admin` references `/admin/reports` which does not exist as a file or route. `receptionist` references `/manager/staff` which does not exist.
- **Impact**: Users clicking these nav items get 404 errors.
- **Fix Required**: Remove or implement missing routes. Add route existence validation to nav config.

---

### LOW-001: Error Pages Are French-Only
- **Screen**: `/404`, `/unauthorized`
- **Description**: Both error pages have hardcoded French text with no `useTranslation`.
- **Impact**: Minor — error pages are edge cases, but still violates i18n requirement.
- **Fix Required**: Wrap text in `t()` and add to `errors.json`.

### LOW-002: Visitor Routes Are Nested Under `/visitor` Instead of Root
- **Screen**: `/visitor/pricing`, `/visitor/locations`
- **Description**: Roadmap specifies `/pricing` and `/locations` at root level for SEO. Current implementation nests them under `/visitor/*`.
- **Impact**: Slightly worse SEO and non-standard URL structure.
- **Fix Required**: Map `/pricing` and `/locations` directly to visitor components (no auth required).

### LOW-003: No Axe-Core or Automated Accessibility Testing
- **Screen**: ALL
- **Description**: No `axe-core` imports, no `@axe-core/react`, no accessibility test scripts. Manual inspection shows good `aria-*` usage (38/40 files), but no automated verification.
- **Impact**: Cannot guarantee WCAG AA+ compliance or axe score >= 95.
- **Fix Required**: Add `@axe-core/react` in dev mode and accessibility CI checks.

---

## Missing Screens List (Consolidated)

### Admin (6 missing)
1. `/admin/users/new` — Create user with role assignment
2. `/admin/settings/integrations` — Payment/API integrations
3. `/admin/settings/security` — Password policy, 2FA
4. `/admin/roles` — Role & permission matrix
5. `/admin/backup` — Backup management
6. `/admin/reports` — Global reports
7. `/admin/notifications` — Global announcements

### Manager (11 missing)
1. `/manager/classes/[id]` — Class detail with attendees
2. `/manager/bookings` — Booking management
3. `/manager/staff` — Staff list
4. `/manager/staff/[id]` — Staff profile
5. `/manager/pos` — Point of sale
6. `/manager/inventory` — Stock & purchase orders
7. `/manager/crm` — Lead pipeline
8. `/manager/marketing` — Campaigns
9. `/manager/analytics` — Location analytics
10. `/manager/reports` — Location reports
11. `/manager/settings` — Location settings

### Employee (6 missing)
1. `/employee/dashboard` — Daily overview
2. `/employee/classes` — Today's classes
3. `/employee/classes/[id]` — Class attendance
4. `/employee/members` — Member lookup
5. `/employee/issues` — Facility issue reporting
6. `/employee/schedule` — Personal schedule

### Teacher (7 missing)
1. `/teacher/schedule` — Personal week view
2. `/teacher/classes/[id]/attendance` — Attendance roster (dedicated)
3. `/teacher/students` — Student list
4. `/teacher/students/[id]` — Student profile
5. `/teacher/progress` — Progress tracking
6. `/teacher/substitutions` — Substitution requests
7. `/teacher/messages` — Message students
8. `/teacher/analytics` — Personal performance

### Client (6 missing)
1. `/client/billing` — Invoices & payments
2. `/client/progress` — Personal stats
3. `/client/settings` — Settings page
4. `/client/settings/profile` — Profile edit
5. `/client/membership/change` — Upgrade/downgrade plan

### Visitor (5 missing)
1. `/` — Landing page (root)
2. `/classes` — Public class browser
3. `/trial` — Trial signup
4. `/contact` — Contact form

### Shared (5 missing)
1. `/settings` — User settings (unified)
2. `/notifications` — Notification center
3. `/help` — Help & FAQ
4. `/403` — Forbidden error page
5. `/500` — Server error page
6. `/maintenance` — Maintenance mode

---

## Architecture & Code Quality Observations

### Positive Findings
1. **Lazy Loading**: All role-specific pages are correctly lazy-loaded in `App.tsx` with a `Suspense` fallback.
2. **Route Guards**: `ProtectedRoute` supports role arrays, single permissions, and `anyPermission` checks. `Gate` component exists for conditional UI rendering.
3. **Responsive Design**: Good Tailwind responsive class usage (`grid-cols-2 lg:grid-cols-5`, `sm:`, `md:`, `lg:`) across pages.
4. **Loading States**: `isLoading` / `animate-pulse` patterns used in 106+ places. `KPICard`, `DataTable` have built-in skeletons.
5. **Accessibility Patterns**: 38/40 page files use `aria-*` attributes. `role="status"`, `aria-live="polite"`, `aria-label`, `sr-only` labels present.
6. **i18n Infrastructure**: `i18n/config.ts` properly initializes with `fr`/`en`, `LanguageDetector`, `localStorage` cache. 22/40 page files use `useTranslation`.
7. **AppShell**: Well-structured with sidebar (desktop + mobile drawer), topbar, bottom tabs, skip-to-content link, and persisted collapsed state.
8. **Query Client**: Properly configured with `staleTime`, `gcTime`, `retry` strategy.

### Negative Findings
1. **No Error Boundaries**: Zero error boundaries in the entire app.
2. **No E2E Tests**: Zero E2E test files.
3. **Mixed i18n Compliance**: Many pages have hardcoded French or English strings.
4. **Mock Data in Production**: Teacher dashboard uses entirely fake data.
5. **No Offline Mode**: Employee check-in lacks offline resilience despite roadmap requirement.
6. **Missing Nav Route Validation**: Sidebar references routes that don't exist.

---

## Recommended Fix Priority Order

### Wave 1 — Blockers (CRITICAL)
1. Add ErrorBoundary component and wrap all routes
2. Create root `/` landing page and fix visitor routing
3. Implement `/admin/roles` — permission matrix
4. Implement `/admin/users/new` — user creation
5. Fix `/teacher/dashboard` — replace mock data with real API
6. Implement `/manager/pos` — point of sale
7. Implement `/manager/bookings` — booking management
8. Implement `/settings` — unified user settings

### Wave 2 — Core Workflows (HIGH)
9. Implement `/employee/dashboard`, `/employee/classes`, `/employee/members`, `/employee/issues`
10. Implement `/teacher/schedule`, `/teacher/students`, `/teacher/progress`, `/teacher/substitutions`
11. Implement `/client/billing`, `/client/progress`, `/client/settings`
12. Implement `/trial`, `/contact` — visitor conversion funnel
13. Implement `/notifications`, `/help` — shared screens
14. Add E2E tests for login, booking, check-in, POS

### Wave 3 — Polish & Compliance (MEDIUM + LOW)
15. Implement `/admin/settings/integrations`, `/admin/settings/security`, `/admin/backup`, `/admin/reports`
16. Implement `/manager/staff`, `/manager/analytics`, `/manager/reports`, `/manager/settings`
17. Implement `/403`, `/500`, `/maintenance` error pages
18. Audit all pages for hardcoded text → extract to i18n JSON
19. Add offline check-in support (Workbox + IndexedDB)
20. Add `axe-core` automated accessibility testing
21. Add data-scope validation to route guards

---

## Files Referenced in This Audit

- `/mnt/agents/OhMyGoldv2-main/apps/web/src/App.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/main.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/auth/ProtectedRoute.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/layout/AppShell.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/layout/Sidebar.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/layout/BottomTabs.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/layout/Topbar.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/ui/DataTable.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/ui/EmptyState.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/components/ui/KPICard.tsx`
- `/mnt/agents/OhMyGoldv2-main/apps/web/src/i18n/config.ts`
- All page files under `/mnt/agents/OhMyGoldv2-main/apps/web/src/pages/`

---

*Audit completed. Phase 5 is INCOMPLETE with 45.8% screen coverage. 39 screens missing. 8 CRITICAL blockers must be resolved before release.*

# Phase 3 Audit Report — Authentication & Authorization
## OhMyGoldv2 EXTREME SEVERITY Security Audit

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Findings** | 37 |
| **CRITICAL** | 9 |
| **HIGH** | 11 |
| **MEDIUM** | 11 |
| **LOW** | 6 |

- **Phase Status:** INCOMPLETE
- **Security Risk Level:** CRITICAL
- **Primary Blockers:** Role name mismatch breaks entire RBAC/RLS system; missing route guards for half the roles; exposed service-role key naming; incomplete mobile auth; missing session tracking.

---

## Item-by-Item Criterion Matrix

### 3.1: Implement Supabase Auth (Self-Hosted)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Auth service accessible at localhost:54323 | Partial | Ports configured but no running verification | LOW |
| Email/password sign up works | Pass | signUp() used in web & mobile | — |
| Email confirmation flow works | Partial | Templates exist but auto-confirm not configurable per-env | MEDIUM |
| JWT expiry 1h / refresh 7d | Partial | JWT_EXPIRY=3600 set; no REFRESH_TOKEN_ROTATION_ENABLED flag | MEDIUM |
| Refresh token rotation prevents replay | Fail | No explicit config in .env or client | HIGH |
| Custom email templates FR+EN | Pass | 4 templates created, bilingual, dark mode | — |
| SMTP configured for production | Partial | SMTP_* vars present but all placeholder values | MEDIUM |
| Auth config documented in docs/ | Fail | No docs/ auth configuration file | MEDIUM |
| MFA enabled | Partial | ENABLE_MFA=true in .env; no TOTP enforced | MEDIUM |
| **Helper functions** getCurrentUser(), isAuthenticated(), getUserRole() | Fail | Not implemented | MEDIUM |
| **Auth events logged** | Fail | No automatic audit logging on login/logout/register | HIGH |

### 3.2: Build Login/Registration Flows (Web + Mobile)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Login: email + password + submit | Pass | Both platforms | — |
| Login: "Remember me" | Pass | Web only; **MISSING on mobile** | MEDIUM |
| Login: "Forgot password" link | Pass | Both platforms | — |
| Login: password visibility toggle | Pass | Web only; **MISSING on mobile** | MEDIUM |
| Login: loading state | Pass | Both platforms | — |
| Login: error message for invalid credentials | Pass | Both platforms | — |
| Login: rate limiting feedback | Fail | **Not implemented on either platform** | HIGH |
| Registration: multi-step form | Partial | Web yes; **mobile is single-step** | MEDIUM |
| Registration: email validation (format + uniqueness) | Partial | Web uses Zod; **mobile has no format validation** | HIGH |
| Registration: password strength indicator | Pass | Web only; **MISSING on mobile** | MEDIUM |
| Registration: terms acceptance | Pass | Both platforms | — |
| Registration: role pre-selected for invites | Fail | **Not implemented** | MEDIUM |
| Post-login: redirect to role-appropriate dashboard | Fail | **All users go to generic /dashboard** | HIGH |
| Post-login: user profile loaded into global state | Pass | Both platforms | — |
| Mobile keyboard handling | Pass | KeyboardAvoidingView used | — |

### 3.3: Integrate OAuth (Google, Apple)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Google OAuth web (redirect flow) | Pass | signInWithOAuth configured with PKCE | — |
| Apple OAuth web (redirect flow) | Pass | signInWithOAuth configured | — |
| Google OAuth mobile (native) | Fail | **No OAuth buttons or native sign-in on mobile** | HIGH |
| Apple Sign-In iOS (native) | Fail | **No Apple Sign-In on mobile** | HIGH |
| New OAuth users get "client" role | Fail | **No role assignment for OAuth users** | HIGH |
| Existing email users can link OAuth | Fail | **Account linking not implemented** | HIGH |
| Profile data extraction (name, email, avatar) | Partial | Web callback sets user but **no profile creation for OAuth** | HIGH |
| Error handling: cancelled auth, network failure | Partial | Basic redirect on error; **no retry/account linking prompt** | MEDIUM |
| Apple compliance: equal prominence | Fail | **Mobile has NO OAuth at all** — App Store rejection risk | CRITICAL |
| Deep link redirect handling | Partial | Mobile scheme set; **no deep link auth callback handler** | HIGH |

### 3.4: Implement RBAC with Row Level Security

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| RLS enabled on ALL tables | Partial | 22+ tables have RLS enabled; **views (member_details, class_details, daily_stats) lack RLS** | CRITICAL |
| Admin role: CRUD all records | Partial | super_admin/admin covered; but **"admin" in code vs "super_admin"/"admin" in DB** | CRITICAL |
| Manager role: CRUD own location | Fail | **"manager" role does NOT EXIST in DB enum** | CRITICAL |
| Employee role: read own location, write check-ins/POS | Fail | **"employee" role does NOT EXIST in DB enum** | CRITICAL |
| Teacher role: read own classes, write attendance | Fail | **"teacher" role does NOT EXIST in DB enum** | CRITICAL |
| Client role: read/write own data | Fail | **"client" role does NOT EXIST in DB enum** (uses "member") | CRITICAL |
| Visitor role: read own trial data | Partial | "visitor" exists in DB but **no specific visitor policies** | MEDIUM |
| Policies use helper functions (DRY) | Fail | **No helper functions created** — all inline EXISTS queries | HIGH |
| Policies tested with automated SQL tests | Fail | **No SQL test files found** | HIGH |
| Unauthorized access returns zero rows | Partial | Most policies do; some may error on missing roles | MEDIUM |

**Role Name Catastrophe:** The Phase 3 roadmap specifies 6 roles: `admin, manager, employee, teacher, client, visitor`. The actual DB enum (`0001_extensions_and_types.sql`) defines: `super_admin, admin, coach, receptionist, member, visitor`. The frontend route guards and RLS policies are written using the roadmap roles (`manager`, `employee`, `teacher`, `client`) which **do not exist** in the database. This means:
- POS RLS (`0021_pos.sql`) references `admin`, `manager` — `manager` doesn't exist → POS table silently blocks most staff.
- CRM RLS (`0020_crm.sql`) references `admin`, `manager`, `employee` — two don't exist.
- Facility zones (`0016_facility_zones.sql`) references `admin`, `manager`.
- Subscription RLS (`0019_subscriptions_enhanced.sql`) references `admin`, `manager`, `employee`.
- Route guards in App.tsx require `"manager"`, `"employee"`, `"teacher"`, `"client"` — these will **always redirect to unauthorized** for legitimate users.

### 3.5: Build Role-Based Routing and Guards

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Unauthenticated → redirected to /login | Pass | Both web and mobile | — |
| Client accessing /admin → redirected | Fail | **Route guards use wrong role names → false negatives/positives** | CRITICAL |
| Admin accessing any route → allowed | Fail | **super_admin excluded from /admin/* routes** (only `["admin"]` allowed) | CRITICAL |
| Manager accessing own location routes | Fail | **"manager" role doesn't exist** | CRITICAL |
| Employee accessing billing → forbidden redirect | Fail | **"employee" role doesn't exist** | CRITICAL |
| Role-based sidebar highlights | Fail | **Not implemented** | MEDIUM |
| 403 Forbidden page shown | Pass | `/unauthorized` page exists | — |
| Deep links respect role guards | Fail | **Mobile has no role guards at all** | HIGH |
| Guards work on both web and mobile | Fail | **Mobile tabs layout has no role checks** | HIGH |

**Additional Issues:**
- Mobile `TabsLayout` (`(tabs)/_layout.tsx`) has a **duplicate `export default function TabsLayout`** — the second overwrites the first, so the 5-tab staff layout is dead code. Only the first 4-tab member layout runs.
- Missing: `useRoleGuard.ts` hook (roadmap requirement)
- Missing: `routeConfig.ts` (roadmap requirement)
- Missing: `NavigationGuard.tsx` for mobile (roadmap requirement)
- Missing: `roleBasedStacks.ts` for mobile (roadmap requirement)
- Missing: 403 page for mobile

### 3.6: Implement Password Reset and Recovery

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| "Forgot password?" link on login | Pass | Both platforms | — |
| Email form validates format | Partial | Web uses Zod; **mobile has no format validation** | MEDIUM |
| Reset email sent with secure token | Pass | Uses Supabase built-in | — |
| Token expiry: 1 hour | Pass | Template states 1h; Supabase default is 1h | — |
| Reset link works | Pass | Web works | — |
| New password strength requirements | Partial | Web reset page has no strength indicator | MEDIUM |
| Password confirmation match | Pass | Web uses Zod; mobile N/A (no reset page) | — |
| Success → redirect to login | Pass | Web redirects | — |
| Token already used → "expired" | Fail | **Not handled** — Supabase handles but UI doesn't differentiate | MEDIUM |
| Token expired → "expired" | Fail | **Not handled** | MEDIUM |
| Both web and mobile flows | Fail | **Mobile reset-password.tsx is MISSING** | HIGH |
| Mobile forgot-password redirectTo uses `ohmygold://auth/reset-password` | Pass | Deep link configured | — |

### 3.7: Build User Profile Management

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Profile page shows name, email, phone, avatar, role | Partial | Web shows most; **role not displayed**; **avatar is initials only** | MEDIUM |
| Edit mode: inline editing | Pass | Web has inline editing | — |
| Avatar: upload new, remove, fallback | Fail | **Avatar upload NOT implemented** — only initials fallback | HIGH |
| Password change: current + new + confirm | Fail | **Web profile page does NOT require current password** | CRITICAL |
| Notification preferences per event type | Fail | **Not implemented** | HIGH |
| 2FA setup: QR code, backup codes | Partial | `/settings/security` has MFA page; **not linked from profile**; **no backup codes** | HIGH |
| Session list: active sessions, device info | Fail | **Not implemented** | HIGH |
| "Logout all devices" button | Fail | **Not in profile UI** (function exists in hook only) | HIGH |
| GDPR data export: JSON download | Fail | **Button exists but is no-op** | HIGH |
| All changes saved via API with optimistic UI | Fail | **No optimistic UI** | MEDIUM |
| Mobile profile management | Fail | **All features are "Coming soon" alerts** | HIGH |

### 3.8: Implement Session Management

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Multi-device login support | Pass | Supabase Auth supports it | — |
| Session list: device, browser, IP, last active | Fail | **Not implemented** | HIGH |
| Idle timeout: 30 min staff, 24h clients | Fail | **Fixed 30 min for ALL roles** — no role-based differentiation | HIGH |
| Activity detection (mouse/keyboard/touch) | Pass | Web listens to 5 event types | — |
| Token auto-refresh | Pass | Supabase autoRefreshToken enabled | — |
| "Logout all devices" invalidates all | Partial | `signOut({ scope: "global" })` exists in hook; **not exposed in UI** | MEDIUM |
| "Logout this device" | Fail | **Not implemented** | HIGH |
| Session expiry → redirect with message | Pass | useSession handles SIGNED_OUT | — |
| Secure: sessions stored server-side | Fail | **Sessions stored in localStorage (web) and AsyncStorage (mobile)** — vulnerable to XSS/theft | CRITICAL |
| `user_sessions` tracking table | Fail | **Table does not exist** | HIGH |
| Mobile idle timeout hook | Fail | **Not implemented** | HIGH |

---

## Findings Detail

### CRITICAL-001: Role Name Mismatch Breaks Entire RBAC/RLS System
- **Item**: 3.4, 3.5
- **Description**: The Phase 3 roadmap specifies 6 roles: `admin, manager, employee, teacher, client, visitor`. The database enum defines: `super_admin, admin, coach, receptionist, member, visitor`. The frontend route guards (`App.tsx`), shared types (`types.ts`), RLS policies (`0021_pos.sql`, `0020_crm.sql`, `0016_facility_zones.sql`, `0019_subscriptions_enhanced.sql`), and permission matrices all reference the non-existent roadmap roles. This means legitimate users with `coach`, `receptionist`, or `member` roles will be denied access to their intended routes, and RLS policies referencing `manager`/`employee` will silently block staff from accessing POS, CRM, facility, and subscription data.
- **Security Impact**: Complete breakdown of authorization. Staff cannot do their jobs. Potential for unauthorized access if developers patch by disabling guards. RLS policies with non-existent roles evaluate to `false`, creating data silos that break operations.
- **Fix Required**: Align the entire codebase to ONE role naming scheme. Either update the DB enum and all migrations to match the roadmap, or update the frontend/shared types to match the DB. Update every RLS policy, route guard, and permission matrix consistently.

### CRITICAL-002: super_admin Excluded from Admin Routes
- **Item**: 3.5
- **Description**: In `App.tsx`, all `/admin/*` routes are guarded with `roles={["admin"]}`, excluding `super_admin`. A `super_admin` user navigating to `/admin/dashboard` will be redirected to `/unauthorized`.
- **Security Impact**: Highest-privilege users cannot access admin functions. Forces workaround usage of lower-privilege accounts.
- **Fix Required**: Change all admin route guards to `roles={["admin", "super_admin"]}` or use `hasMinimumRole(role, "admin")`.

### CRITICAL-003: Service Role Key Uses `VITE_` Prefix (Frontend Exposure Risk)
- **Item**: 3.1
- **Description**: `apps/web/src/lib/supabase-admin.ts` imports `import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY`. In Vite, all `VITE_` prefixed env variables are **injected into the client bundle** at build time. Even though the file has a comment warning, the variable naming convention makes accidental exposure highly likely.
- **Security Impact**: If this file is ever imported in a client-side route or if the build system tree-shakes incorrectly, the service role key leaks to all users, granting full database access.
- **Fix Required**: Rename to `SUPABASE_SERVICE_ROLE_KEY` (no `VITE_` prefix). Ensure server-side-only usage. Add a build-time lint rule that blocks `VITE_*SERVICE_ROLE*` from client bundles.

### CRITICAL-004: Sessions Stored in localStorage / AsyncStorage (XSS Vulnerable)
- **Item**: 3.1, 3.8
- **Description**: Web Supabase client uses `storage: localStorage`. Mobile uses `AsyncStorage`. Both are vulnerable to XSS/SSRF token extraction. A successful XSS attack can steal refresh tokens and maintain persistent access.
- **Security Impact**: Session hijacking via XSS. Refresh tokens stolen from localStorage can be used to mint new access tokens indefinitely.
- **Fix Required**: Use `httpOnly` cookie-based sessions for web. For mobile, use Expo Secure Store instead of AsyncStorage. Configure Supabase Auth with cookie-based sessions.

### CRITICAL-005: No Current Password Required for Password Change
- **Item**: 3.7
- **Description**: The web profile page (`client/profile/index.tsx`) calls `supabase.auth.updateUser({ password: pwForm.next })` without requiring the user's current password. If a user's session is compromised (e.g., XSS, physical access to unlocked computer), an attacker can change the password and lock out the legitimate user.
- **Security Impact**: Account takeover via session compromise.
- **Fix Required**: Require current password verification before allowing password change. Use `supabase.auth.signInWithPassword({ email, password: currentPassword })` to verify before `updateUser`.

### CRITICAL-006: POS/CRM/Facility RLS References Non-Existent Roles
- **Item**: 3.4
- **Description**: Multiple migrations use `role IN ('admin','manager')` or `role IN ('admin','manager','employee')`. Since `manager` and `employee` do not exist in the `app_role` enum, these policies evaluate to false for all users.
- **Affected Files**: `0021_pos.sql` (pos_products_write, pos_transactions_access), `0020_crm.sql` (leads_access, lead_activities_access), `0016_facility_zones.sql` (all write policies), `0019_subscriptions_enhanced.sql` (subscriptions_write, subscription_events_insert)
- **Security Impact**: Staff operations (POS, CRM, facility management) are completely blocked at the database level for all users.
- **Fix Required**: Replace `'manager'` with `'admin'` or `'super_admin'` as appropriate. Replace `'employee'` with `'receptionist'`. Add `super_admin` to all admin-level write policies.

### CRITICAL-007: Views Lack RLS — Data Exposure Risk
- **Item**: 3.4
- **Description**: The `member_details`, `class_details`, and `daily_stats` views in `0014_views_and_functions.sql` join sensitive tables but have NO RLS policies. Any authenticated user can query these views and see all members, all classes, and financial stats across all locations.
- **Security Impact**: Mass data breach of member PII, financial data, and gym operations data.
- **Fix Required**: Either disable direct view access with `ALTER VIEW ... OWNER TO ...` and force access through RLS-backed functions, or add `SECURITY INVOKER` context and wrap views with RLS policies.

### CRITICAL-008: Apple Sign-In Missing on Mobile — App Store Rejection
- **Item**: 3.3
- **Description**: The iOS app (`apps/mobile/app.json`) configures Face ID but has NO Apple Sign-In implementation. Apple mandates Sign-In with Apple for any app offering third-party authentication (OAuth). The mobile login screen has zero OAuth buttons.
- **Security Impact**: App Store rejection. Business cannot ship iOS app.
- **Fix Required**: Add `expo-apple-authentication` plugin. Add Apple Sign-In button to mobile login with equal prominence. Configure Apple client ID in Supabase and .env.

### CRITICAL-009: Mobile Tabs Layout Has Duplicate Export (Dead Code + Broken Role Routing)
- **Item**: 3.5
- **Description**: `(tabs)/_layout.tsx` exports `TabsLayout` twice. The second export (staff tabs: Accueil, Cours, Membres, Paiements, Profil) completely overwrites the first export in JavaScript module semantics, but in React Native / Metro bundler, this causes a syntax/ runtime error or the second is silently ignored depending on bundler behavior. Regardless, **there is no role-based conditional tab rendering**.
- **Security Impact**: No role-based navigation on mobile. All users see the same tabs. Deep links bypass any non-existent guards.
- **Fix Required**: Remove duplicate export. Implement role-based conditional tab/screens. Add `NavigationGuard` component.

---

### HIGH-001: No Rate Limiting on Login/Registration
- **Item**: 3.2
- **Description**: Neither web nor mobile implements client-side rate limiting display. Supabase may throttle on the backend, but the UI does not show "Too many attempts, try in X minutes." Brute force attacks are possible.
- **Security Impact**: Credential stuffing and brute force attacks against user accounts.
- **Fix Required**: Parse Supabase rate limit errors (`429` status / `over_email_send_rate_limit`) and display countdown timer. Implement exponential backoff on client.

### HIGH-002: No Account Linking for OAuth Users
- **Item**: 3.3
- **Description**: When an OAuth user signs in with the same email as an existing password account, no linking prompt or automatic linking occurs. Supabase may create a separate identity, leading to duplicate/confused accounts.
- **Security Impact**: Users cannot access their existing data after OAuth login. Support tickets. Potential for account takeover if an attacker creates OAuth account before the real user.
- **Fix Required**: Implement OAuth account linking flow. On OAuth callback, check if email exists in `auth.users`. If so, offer to link or reject.

### HIGH-003: Mobile Auth Lacks Zod Validation / Schema Enforcement
- **Item**: 3.2
- **Description**: Mobile login and register screens use manual string checks (`!email.trim()`, `password.length < 8`) instead of the shared Zod schemas (`LoginSchema`, `RegisterSchema`). No email format validation. No password complexity enforcement.
- **Security Impact**: Weak passwords accepted on mobile. Invalid emails stored. Data quality issues.
- **Fix Required**: Import and use shared Zod schemas on mobile. Reject weak passwords before Supabase call.

### HIGH-004: No Helper Functions for RLS (DRY Violation + Maintenance Risk)
- **Item**: 3.4
- **Description**: The roadmap requires `get_current_user_role()`, `get_current_user_location()`, `is_admin()`, `is_manager_of()`, etc. None exist. Every policy repeats inline `EXISTS (SELECT 1 FROM user_profiles ...)`, making updates error-prone and slow.
- **Security Impact**: Policy maintenance is brittle. Adding a new role requires touching dozens of policies. Risk of inconsistent security rules.
- **Fix Required**: Create `supabase/migrations/00000000000017_rbac_functions.sql` with all helper functions. Refactor all existing policies to use them.

### HIGH-005: No Automated SQL Tests for RLS Policies
- **Item**: 3.4
- **Description**: No SQL test files verify that each role can/cannot access each table. Changes to policies or roles have no regression safety net.
- **Security Impact**: Silent policy regressions during schema migrations. Unintended data exposure after updates.
- **Fix Required**: Create `supabase/tests/rlc_tests.sql` with pgtap or custom assertions testing every role+table+operation combination.

### HIGH-006: Missing `routeConfig.ts` and `useRoleGuard.ts`
- **Item**: 3.5
- **Description**: The roadmap explicitly requires `apps/web/src/routes/routeConfig.ts` and `apps/web/src/hooks/useRoleGuard.ts`. Neither exists. Route guards are hardcoded in `App.tsx`.
- **Security Impact**: Route authorization is not centralized or maintainable. Adding a new route requires modifying App.tsx. Risk of missing guards on new routes.
- **Fix Required**: Create `routeConfig.ts` with route-to-role mapping. Create `useRoleGuard.ts` with `useHasRole`, `useCanAccess`, `useIsAdmin` hooks.

### HIGH-007: Missing Mobile `reset-password.tsx`
- **Item**: 3.6
- **Description**: Mobile has `forgot-password.tsx` but no `reset-password.tsx`. Users clicking the reset link on mobile deep link have no screen to land on.
- **Security Impact**: Mobile users cannot complete password reset. Broken user journey.
- **Fix Required**: Create `apps/mobile/app/auth/reset-password.tsx` with token handling and Supabase `updateUser`.

### HIGH-008: No GDPR Data Export Implementation
- **Item**: 3.7
- **Description**: The web profile page has a "Download my data" button that does nothing. No JSON generation, no API endpoint, no data aggregation from bookings, payments, access logs, etc.
- **Security Impact**: GDPR non-compliance (Article 15-17). Legal risk for EU operations.
- **Fix Required**: Create `apps/web/src/pages/api/export-data.ts` edge function that aggregates all personal data across tables and returns a downloadable JSON.

### HIGH-009: No Avatar Upload Implementation
- **Item**: 3.7
- **Description**: Profile pages on both web and mobile show initials as avatar. The storage bucket for avatars exists (`0013_storage_buckets.sql`) but no upload UI or API integration is implemented.
- **Security Impact**: Feature gap. Not directly security-critical but part of profile completeness.
- **Fix Required**: Add avatar upload component using Supabase Storage. Resize to 512x512. Enforce 5MB limit.

### HIGH-010: Mobile OAuth Completely Missing
- **Item**: 3.3
- **Description**: Mobile login has zero OAuth integration. No Google Sign-In button, no Apple Sign-In button, no `expo-auth-session`, no `expo-apple-authentication`.
- **Security Impact**: User friction. App Store rejection (Apple requirement). Reduced security options for users.
- **Fix Required**: Add OAuth buttons to mobile login. Implement `expo-auth-session` for Google. Implement `expo-apple-authentication` for Apple.

### HIGH-011: No Session Tracking Table (`user_sessions`)
- **Item**: 3.8
- **Description**: The roadmap requires a `user_sessions` table with device_type, ip_address, last_active, refresh_token_hash. No such table exists. The `auth.sessions` table exists natively but is not extended with device info.
- **Security Impact**: Cannot list active sessions, cannot detect suspicious logins, cannot revoke specific sessions.
- **Fix Required**: Create `user_sessions` table migration. Hook into `onAuthStateChange` to create/update records.

---

### MEDIUM-001: No Auth Event Audit Logging
- **Item**: 3.1
- **Description**: `audit_logs` table and `log_audit_event()` function exist, but login, logout, register, and password reset events are never automatically logged from the auth flow.
- **Security Impact**: No audit trail for authentication events. Cannot investigate breaches.
- **Fix Required**: Add audit log calls in `useAuth.ts` login/logout, `authStore.ts` signUp, and password reset flows.

### MEDIUM-002: No Password Strength on Reset Page
- **Item**: 3.6
- **Description**: The web reset-password page (`apps/web/src/pages/auth/reset-password.tsx`) does not show a password strength indicator.
- **Security Impact**: Users may set weak passwords after reset.
- **Fix Required**: Add `passwordStrength()` indicator to reset page.

### MEDIUM-003: Web Auth Store Persists User Data in localStorage via Zustand
- **Item**: 3.2
- **Description**: `authStore.ts` uses Zustand `persist` middleware with `name: "omg-auth"`. The `partialize` function stores `user.id`, `email`, and `user_metadata` in localStorage. While session tokens are handled by Supabase separately, this still leaks user identity info to XSS.
- **Security Impact**: Minor PII leak under XSS.
- **Fix Required**: Remove persistence of user data. Use session-only storage for auth state.

### MEDIUM-004: Mobile Register Missing Phone Field
- **Item**: 3.2
- **Description**: The mobile register screen does not collect phone number, which is required by the web multi-step form and French gym operations.
- **Security Impact**: Incomplete user profiles. Cannot contact users via SMS.
- **Fix Required**: Add phone field to mobile register.

### MEDIUM-005: No Optimistic UI for Profile Updates
- **Item**: 3.7
- **Description**: Profile save blocks UI until API returns. No rollback on error.
- **Security Impact**: UX issue. Not directly security-related.
- **Fix Required**: Implement optimistic updates with rollback.

### MEDIUM-006: No Notification Preferences Per Event Type
- **Item**: 3.7
- **Description**: Profile page has no notification preference management. The `user_preferences` JSONB column is not mentioned in any UI.
- **Security Impact**: Users cannot control communication channels. GDPR compliance risk.
- **Fix Required**: Add notification toggles per event type (class reminders, billing, promotions, announcements).

### MEDIUM-007: No 2FA Backup Codes
- **Item**: 3.7
- **Description**: The MFA page (`mfa.tsx`) displays QR code and TOTP secret but no backup/recovery codes. If user loses authenticator, account recovery requires admin intervention.
- **Security Impact**: Account lockout risk. Support burden.
- **Fix Required**: Generate and display backup codes during MFA enrollment. Allow download.

### MEDIUM-008: `handle_new_user()` Auto-Creates Profile Without Role Assignment Logic
- **Item**: 3.4
- **Description**: The trigger `handle_new_user()` inserts a profile with default role `'member'`. Admin-invited users or OAuth users cannot be pre-assigned roles.
- **Security Impact**: All new users default to `member`. Admin invites and OAuth users need manual role reassignment.
- **Fix Required**: Read role from `raw_user_meta_data->>'role'` during signUp, or implement invite token system.

### MEDIUM-009: No `refresh_token_rotation_enabled` Config
- **Item**: 3.1
- **Description**: The `.env.example` does not set `REFRESH_TOKEN_ROTATION_ENABLED=true` or document it. The Supabase client does not configure it.
- **Security Impact**: Refresh token replay attacks possible if token is stolen.
- **Fix Required**: Add `REFRESH_TOKEN_ROTATION_ENABLED=true` to `.env.example` and verify in Supabase dashboard.

### MEDIUM-010: Supabase Admin Client Lacks `auth.schema` Restriction
- **Item**: 3.1
- **Description**: `supabaseAdmin` is created with default auth settings. If used in a server context, it should explicitly disable session persistence.
- **Security Impact**: Minor. The client is only safe in SSR/edge contexts.
- **Fix Required**: Add `auth: { persistSession: false, autoRefreshToken: false }` (partially done). Document server-side-only usage more strongly.

### MEDIUM-011: Magic Link Redirect URL Uses HTTP Origin (No Mobile Deep Link)
- **Item**: 3.1
- **Description**: `sendMagicLink` in `useAuth.ts` uses `${window.location.origin}/auth/callback` which only works for web. Mobile magic links would redirect to web.
- **Security Impact**: Mobile users cannot use magic links.
- **Fix Required**: Detect platform and set `emailRedirectTo` to mobile deep link when applicable.

---

### LOW-001: `omg_remember_email` Stored in localStorage Without Encryption
- **Item**: 3.2
- **Description**: Login "Remember me" stores the email address in localStorage as plain text.
- **Security Impact**: Minor PII exposure under XSS.
- **Fix Required**: Store in a cookie or use sessionStorage.

### LOW-002: No `docs/` Auth Configuration Documentation
- **Item**: 3.1
- **Description**: The roadmap requires auth configuration documented in `docs/`. No such file exists.
- **Security Impact**: Onboarding risk. Not runtime security.
- **Fix Required**: Create `docs/auth-configuration.md`.

### LOW-003: Unused `hasMinimumRole` in `usePermissions.ts` Maps to Non-Existent Roles
- **Item**: 3.5
- **Description**: `ROLE_HIERARCHY` in `permissions.ts` includes `manager` (value 2) which doesn't exist in the DB enum.
- **Security Impact**: Hierarchy calculations may be incorrect.
- **Fix Required**: Align hierarchy with actual DB roles.

### LOW-004: Mobile `forgot-password.tsx` Uses Non-Localised Strings
- **Item**: 3.6
- **Description**: All mobile auth screens are hardcoded in English with no i18n integration, unlike web which uses `react-i18next`.
- **Security Impact**: UX issue. Not security-related.
- **Fix Required**: Integrate `react-i18next` into mobile app.

### LOW-005: `ENABLE_GOOGLE_SIGNUP=false` and `ENABLE_APPLE_SIGNUP=false` by Default
- **Item**: 3.3
- **Description**: OAuth is disabled by default in `.env.example`. While this is safe for initial setup, it means OAuth will not work until manually enabled.
- **Security Impact**: None (safe default). Operational gap.
- **Fix Required**: Document the need to enable OAuth providers for production.

### LOW-006: No `max_sessions_per_user` Config
- **Item**: 3.1, 3.8
- **Description**: The roadmap requires max 10 sessions per user. No configuration for this limit exists.
- **Security Impact**: A compromised account could have unlimited active sessions.
- **Fix Required**: Add `MAX_SESSIONS_PER_USER=10` to `.env` and enforce via custom session table or Supabase config.

---

## Recommended Fix Priority Order

### P0 — Security Blockers (Fix Immediately)
1. **CRITICAL-001**: Align role names across DB enum, RLS policies, route guards, and shared types. This is the #1 blocker.
2. **CRITICAL-003**: Rename `VITE_SUPABASE_SERVICE_ROLE_KEY` to `SUPABASE_SERVICE_ROLE_KEY` (no VITE prefix).
3. **CRITICAL-005**: Require current password before password change in profile UI.
4. **CRITICAL-004**: Move session storage from localStorage/AsyncStorage to httpOnly cookies (web) and SecureStore (mobile).
5. **CRITICAL-007**: Add RLS or access control to `member_details`, `class_details`, and `daily_stats` views.
6. **CRITICAL-002**: Include `super_admin` in all admin route guards.
7. **CRITICAL-006**: Fix POS/CRM/facility/subscription RLS policies to use existing DB roles.
8. **CRITICAL-008**: Implement Apple Sign-In on mobile to prevent App Store rejection.
9. **CRITICAL-009**: Fix mobile tabs layout duplicate export and implement role-based stacks.

### P1 — High Security & Functionality (Fix This Sprint)
10. **HIGH-001**: Add rate limiting display and client-side backoff to login.
11. **HIGH-004**: Create RLS helper functions (`get_current_user_role`, `is_admin`, etc.) and refactor all policies.
12. **HIGH-005**: Write automated SQL tests for all RLS policies.
13. **HIGH-002**: Implement OAuth account linking flow.
14. **HIGH-003**: Enforce shared Zod schemas on mobile auth screens.
15. **HIGH-006**: Create `routeConfig.ts` and `useRoleGuard.ts`.
16. **HIGH-007**: Create mobile `reset-password.tsx`.
17. **HIGH-008**: Implement GDPR data export endpoint.
18. **HIGH-010**: Add Google and Apple OAuth to mobile login.
19. **HIGH-011**: Create `user_sessions` table and device tracking.

### P2 — Medium Security & Compliance (Fix Next Sprint)
20. **MEDIUM-001**: Add automatic audit logging for all auth events.
21. **MEDIUM-002**: Add password strength indicator to reset page.
22. **MEDIUM-007**: Generate and display 2FA backup codes.
23. **MEDIUM-008**: Support role pre-selection during user creation/invite.
24. **MEDIUM-009**: Enable refresh token rotation in config.
25. **HIGH-009**: Implement avatar upload with resize and limit.
26. **MEDIUM-006**: Build notification preferences UI.

### P3 — Polish & Documentation (Fix Before GA)
27. **LOW-001**: Move remember-me email out of localStorage.
28. **LOW-002**: Write auth configuration documentation.
29. **MEDIUM-004**: Add phone field to mobile registration.
30. **MEDIUM-011**: Support magic link deep links for mobile.
31. **LOW-006**: Enforce max sessions per user.

---

## Appendix: File Inventory

### Files That Exist (Partial Implementation)
- `apps/web/src/lib/supabase.ts` — Web client (PKCE, localStorage)
- `apps/web/src/lib/supabase-admin.ts` — Admin client (VITE_ prefix risk)
- `apps/web/src/stores/authStore.ts` — Zustand auth store (persist middleware)
- `apps/web/src/hooks/useAuth.ts` — Auth hook with MFA methods
- `apps/web/src/hooks/useSession.ts` — Idle timeout hook (30 min fixed)
- `apps/web/src/hooks/usePermissions.ts` — RBAC hook
- `apps/web/src/components/auth/AuthProvider.tsx` — Auth context provider
- `apps/web/src/components/auth/ProtectedRoute.tsx` — Route guard component
- `apps/web/src/lib/permissions.ts` — Permission matrix (role mismatch)
- `apps/web/src/App.tsx` — Router with guards (role mismatch)
- `apps/web/src/pages/auth/login.tsx` — Web login (complete)
- `apps/web/src/pages/auth/register.tsx` — Web register (multi-step)
- `apps/web/src/pages/auth/forgot-password.tsx` — Web forgot password
- `apps/web/src/pages/auth/reset-password.tsx` — Web reset password
- `apps/web/src/pages/auth/callback.tsx` — OAuth callback
- `apps/web/src/pages/auth/mfa.tsx` — MFA management page
- `apps/web/src/pages/client/profile/index.tsx` — Profile page (no upload)
- `apps/web/src/pages/errors/unauthorized.tsx` — 403 page
- `apps/mobile/src/lib/supabase.ts` — Mobile client (AsyncStorage)
- `apps/mobile/src/stores/authStore.ts` — Mobile auth store
- `apps/mobile/src/components/AuthProvider.tsx` — Mobile auth provider
- `apps/mobile/app/auth/login.tsx` — Mobile login (basic)
- `apps/mobile/app/auth/register.tsx` — Mobile register (basic)
- `apps/mobile/app/auth/forgot-password.tsx` — Mobile forgot password
- `apps/mobile/app/auth/_layout.tsx` — Mobile auth layout
- `apps/mobile/app/(tabs)/_layout.tsx` — Mobile tabs (duplicate export bug)
- `apps/mobile/app/(tabs)/profile.tsx` — Mobile profile (all "coming soon")
- `apps/mobile/app.json` — Expo config (scheme configured, no Apple Sign-In plugin)
- `docker/.env.example` — Environment template (placeholders)
- `docker/email-templates/*.html` — 4 bilingual templates
- `supabase/migrations/0001-0021*.sql` — Schema + RLS (role mismatch issues)
- `supabase/functions/_shared/auth.ts` — Edge function auth helpers

### Files That Are MISSING (Per Roadmap)
- `apps/web/src/routes/routeConfig.ts`
- `apps/web/src/hooks/useRoleGuard.ts`
- `apps/web/src/pages/403.tsx` (exists as `/errors/unauthorized.tsx` — close but wrong path)
- `apps/mobile/src/hooks/useRoleGuard.ts`
- `apps/mobile/src/components/NavigationGuard.tsx`
- `apps/mobile/src/navigation/roleBasedStacks.ts`
- `apps/mobile/app/auth/reset-password.tsx`
- `apps/mobile/lib/oauth.ts`
- `apps/mobile/plugins/apple-auth-plugin.ts`
- `supabase/migrations/00000000000017_rbac_functions.sql`
- `supabase/migrations/00000000000018_user_sessions.sql`
- `docs/auth-configuration.md`

---

*Report generated by EXTREME SEVERITY security auditor.*
*Phase 3 status: INCOMPLETE — CRITICAL security blockers prevent production deployment.*

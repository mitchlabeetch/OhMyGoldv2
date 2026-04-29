# Phase 3: Authentication & Authorization

> **Phase ID:** P3
> **Duration:** 2-3 weeks
> **Prerequisites:** Phase 1 complete (monorepo, Supabase, CI/CD, DB schema, dev environments)
> **Parallelizable with:** Phase 2 (Design System) — auth UI can use placeholder styling initially
> **Goal:** Implement a complete, secure, multi-platform authentication system with RBAC and RLS

---

## Phase Overview

Phase 3 implements the security backbone of OhMyGold. Every data read, every feature access, every screen permission flows through the auth system built here. This phase is the gatekeeper — it determines who can do what, and enforces those rules at the database level via Row Level Security.

The system must handle 6 roles with varying permission levels (Full Access, Read+Write, Read Only, Conditional), 2 OAuth providers (Google, Apple), multi-device sessions, audit logging, and GDPR-compliant data handling.

---

## 3.1 Implement Supabase Auth (Self-Hosted)

### Description and Scope
Configure Supabase Auth (GoTrue) for the self-hosted instance. Set up email/password authentication with secure defaults, SMTP for transactional emails, email templates (confirmation, password reset, magic link), and JWT configuration. Customize auth settings for OhMyGold's requirements.

### Why This Matters
Auth is the entry point for every user. A broken auth system means nobody can use the app. Supabase Auth provides a production-ready auth system that handles password hashing, session management, and JWT tokens — but it must be configured correctly for our multi-role, multi-platform use case.

### Technical Approach
Configure auth via Supabase dashboard/CLI and environment variables. Settings: JWT expiry 1 hour, refresh token rotation enabled, MFA supported (TOTP), email confirmations required, password min length 8, password strength requirements. Custom SMTP (SendGrid/Mailgun) for production email delivery. Email templates in French and English.

### Files/Directories to Create/Modify
```
docker/
├── .env                     # SUPABASE_* auth configuration
└── email-templates/
    ├── confirm-signup.html      # French + English
    ├── reset-password.html
    ├── magic-link.html
    └── change-email.html
apps/web/src/lib/
├── supabase.ts              # Web Supabase client with auth
└── supabase-admin.ts        # Admin client (server-side only)
apps/mobile/src/lib/
└── supabase.ts              # Mobile Supabase client with auth
```

### Dependencies on Other Items
- 1.2 (Supabase Docker running)
- 1.4 (dev environments configured)
- 1.7 (database schema with user_profiles table)

### Success Criteria
```
[ ] Supabase Auth service accessible at localhost:54323
[ ] Email/password sign up creates user in auth.users
[ ] Email confirmation flow works (token verified, account activated)
[ ] JWT tokens generated with correct expiry (1 hour access, 7 days refresh)
[ ] Refresh token rotation prevents replay attacks
[ ] Custom email templates render in French and English
[ ] SMTP configured for production email delivery
[ ] Auth configuration documented in docs/
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Email delivery landing in spam | Use authenticated SMTP (SPF, DKIM); warm up domain |
| JWT secret exposure | Use strong random secret; rotate periodically |

### LLM Agent Launch Prompt

```
Configure Supabase Auth for OhMyGold.

CONTEXT: OhMyGold uses self-hosted Supabase with 6 user roles. Auth must support email/password + OAuth (Google, Apple) + MFA. Primary users are in France.

TASK:
1. Configure Supabase Auth in docker/.env:
   - SITE_URL (web app URL)
   - ADDITIONAL_REDIRECT_URLS (mobile deep links)
   - JWT_SECRET (strong random, 32+ chars)
   - JWT_EXPIRY (3600 seconds = 1 hour)
   - REFRESH_TOKEN_ROTATION_ENABLED (true)
   - MFA_ENABLED (true)
   - MAILER_* settings for SMTP

2. Create email templates in docker/email-templates/:
   - confirm-signup.html: French + English, Gold's Gym branding, confirmation button
   - reset-password.html: French + English, secure reset link
   - magic-link.html: French + English, one-click login
   - change-email.html: French + English, verify new email
   - All templates: responsive, dark mode support, OhMyGold logo

3. Configure auth settings via Supabase:
   - Password: min 8 chars, require uppercase, lowercase, number
   - Email confirmations: required
   - Auto-confirm: false (except dev environment)
   - Session timeout: 1 hour
   - Max sessions per user: 10 (for multi-device)

4. Create Supabase client utilities:
   - apps/web/src/lib/supabase.ts: createClient with auth config
   - apps/web/src/lib/supabase-admin.ts: service role client (server only)
   - apps/mobile/src/lib/supabase.ts: createClient with deep link redirects

5. Add auth helper functions:
   - getCurrentUser(): returns user with profile data
   - isAuthenticated(): boolean check
   - getUserRole(): returns app_role enum value

REQUIREMENTS:
- Email templates in French (primary) and English
- JWT secret minimum 32 characters
- Refresh token rotation enabled
- Mobile deep links configured for auth redirects
- All auth events logged (for audit)

FILES TO CREATE/MODIFY:
- docker/.env (auth settings)
- docker/email-templates/confirm-signup.html
- docker/email-templates/reset-password.html
- docker/email-templates/magic-link.html
- docker/email-templates/change-email.html
- apps/web/src/lib/supabase.ts
- apps/web/src/lib/supabase-admin.ts
- apps/mobile/src/lib/supabase.ts

VERIFICATION STEPS:
1. Sign up with email — verify confirmation email sent
2. Click confirmation link — account activated
3. Sign in — JWT token received, user object populated
4. Verify JWT expiry is 1 hour
5. Verify refresh token rotation works
6. Check email template rendering in both languages
7. Verify auth users appear in auth.users table

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5.5 (Access & Authorization)

NOTES AREA (fill on completion):
- Date completed: ___
- Auth provider: Supabase GoTrue
- JWT expiry: ___ seconds
- Email templates created: ___
- MFA enabled: Yes/No
- Any config issues: ___
```

---

## 3.2 Build Login/Registration Flows (Web + Mobile)

### Description and Scope
Implement complete login and registration screens for both web and mobile platforms. Login: email + password with "remember me," error handling, rate limiting display. Registration: multi-step form with email, password, personal info, role selection (for admin-created accounts), terms acceptance.

### Why This Matters
The login screen is the first thing every user sees. A smooth, fast, reliable login experience sets the tone for the entire application. Registration must be intuitive enough for visitors to sign up independently while capturing all required data for Gold's Gym membership.

### Technical Approach
Web: React Hook Form + Zod schemas for validation, react-i18next for labels, shared UI components. Mobile: Same form logic, platform-specific inputs (keyboard types, auto-capitalize). Both use Supabase Auth signIn/signUp methods. Post-login: fetch user profile, store in global state (Zustand), redirect to role-appropriate dashboard.

### Files/Directories to Create/Modify
```
apps/web/src/
├── pages/
│   └── (auth)/
│       ├── login.tsx
│       ├── register.tsx
│       └── layout.tsx
├── hooks/
│   └── useAuth.ts
└── stores/
    └── authStore.ts
apps/mobile/src/
├── app/
│   └── (auth)/
│       ├── login.tsx
│       ├── register.tsx
│       └── _layout.tsx
├── hooks/
│   └── useAuth.ts
└── stores/
    └── authStore.ts
```

### Dependencies on Other Items
- 3.1 (Supabase Auth configured)
- 2.2 (UI components — Input, Button, Card)
- 2.3 (i18n for labels)
- 2.7 (Form components)

### Success Criteria
```
[ ] Login form: email + password + submit + error display
[ ] Login: "Remember me" checkbox (persists email)
[ ] Login: "Forgot password" link
[ ] Login: password visibility toggle
[ ] Login: loading state during submission
[ ] Login: error message for invalid credentials
[ ] Login: rate limiting feedback ("Too many attempts, try in X minutes")
[ ] Registration: multi-step form (account → personal → confirm)
[ ] Registration: email validation (format + uniqueness)
[ ] Registration: password strength indicator (weak/medium/strong)
[ ] Registration: terms and conditions acceptance (required)
[ ] Registration: role pre-selected (for admin-invited accounts)
[ ] Post-login: redirect to role-appropriate dashboard
[ ] Post-login: user profile loaded into global state
[ ] Both web and mobile login screens functional
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Form validation UX (too strict/too lenient) | Zod schemas shared; test with real users |
| Mobile keyboard covering form | Use KeyboardAvoidingView; scroll to focused field |

### LLM Agent Launch Prompt

```
Build the login and registration flows for OhMyGold web and mobile.

CONTEXT: OhMyGold has 6 user roles. Login and registration are the entry points. Forms must be accessible, i18n-ready, and work on both web and mobile.

TASK:

LOGIN SCREEN (web + mobile):
1. Create login form with:
   - Email input (type="email", autoComplete="email")
   - Password input (type="password", show/hide toggle)
   - "Remember me" checkbox
   - Submit button ("Se connecter" / "Log In")
   - "Forgot password?" link
   - "Don't have an account? Sign up" link
   - Loading state on submit
   - Error display: "Invalid credentials" or "Account not confirmed"
   - Rate limiting: "Too many attempts. Try again in X minutes."

2. Login flow:
   - Validate with Zod (email format, password not empty)
   - Call supabase.auth.signInWithPassword()
   - On success: fetch user profile, store in authStore, redirect
   - On error: display appropriate message
   - Store "remember me" preference

REGISTRATION SCREEN (web + mobile):
1. Create multi-step registration:
   Step 1 - Account: email, password, confirm password
   Step 2 - Personal: first name, last name, phone, location
   Step 3 - Confirm: review details, accept terms

2. Validation:
   - Email: valid format, not already registered
   - Password: min 8 chars, uppercase, lowercase, number
   - Password strength indicator (colors: red/amber/green)
   - Phone: French format +33 X XX XX XX XX
   - Terms: must be checked to submit

3. Registration flow:
   - Validate each step before proceeding
   - Call supabase.auth.signUp() with user metadata
   - Show "Check your email" confirmation screen
   - Auto-assign "client" role (or pre-selected role for invites)

AUTH STORE:
- Create Zustand store: authStore.ts
- State: user, profile, role, isLoading, isAuthenticated
- Actions: login, logout, setUser, setProfile, checkSession

FILES TO CREATE:
- apps/web/src/pages/(auth)/login.tsx
- apps/web/src/pages/(auth)/register.tsx
- apps/web/src/pages/(auth)/layout.tsx
- apps/web/src/hooks/useAuth.ts
- apps/web/src/stores/authStore.ts
- apps/mobile/src/app/(auth)/login.tsx
- apps/mobile/src/app/(auth)/register.tsx
- apps/mobile/src/app/(auth)/_layout.tsx
- apps/mobile/src/hooks/useAuth.ts
- apps/mobile/src/stores/authStore.ts

VERIFICATION STEPS:
1. Login with valid credentials — redirects to dashboard
2. Login with invalid credentials — shows error
3. Login with unconfirmed email — shows "check your email"
4. Register new account — multi-step flow works
5. Password strength indicator changes color
6. Rate limiting after 5 failed attempts
7. Mobile: keyboard doesn't cover inputs
8. Both FR and EN labels render correctly

REQUIREMENTS REF:
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md

NOTES AREA (fill on completion):
- Date completed: ___
- Login flow tested: Yes/No
- Registration flow tested: Yes/No
- Rate limiting verified: Yes/No
- Mobile keyboard handling: ___
```

---

## 3.3 Integrate OAuth (Google, Apple)

### Description and Scope
Implement OAuth authentication with Google and Apple providers. Support both web (redirect flow) and mobile (native sign-in buttons). Handle account linking (OAuth user connects to existing email account), profile data extraction, and role assignment for OAuth-created accounts.

### Why This Matters
OAuth reduces friction — users don't need to create a new password. Google and Apple are the dominant identity providers in France. For mobile especially, native sign-in (Apple Sign-In on iOS, Google Sign-In on Android) is expected by users. Apple requires Sign-In with Apple for any app that uses third-party auth (App Store policy).

### Technical Approach
Supabase Auth OAuth providers configured in dashboard. Web: redirect-based OAuth flow with PKCE. Mobile: expo-auth-session for Google, expo-apple-authentication for Apple (iOS native UI). Post-OAuth: extract profile (name, email, avatar), create/update user profile record, assign default role.

### Files/Directories to Create/Modify
```
apps/web/src/pages/(auth)/
├── oauth-callback.tsx       # Handle OAuth redirect
apps/mobile/src/
├── lib/
│   └── oauth.ts             # OAuth helper functions
├── app/(auth)/
│   └── login.tsx            # Add OAuth buttons
├── plugins/
│   └── apple-auth-plugin.ts # iOS Apple Sign-In config
docker/.env                  # GOOGLE_CLIENT_ID, APPLE_CLIENT_ID
```

### Dependencies on Other Items
- 3.1 (Supabase Auth configured)
- 3.2 (login screens exist — add OAuth buttons)

### Success Criteria
```
[ ] Google OAuth login works on web (redirect flow)
[ ] Google OAuth login works on mobile (native sign-in)
[ ] Apple Sign-In works on iOS (native Apple UI)
[ ] Apple Sign-In works on web (redirect flow)
[ ] New OAuth users get "client" role by default
[ ] Existing email users can link OAuth account
[ ] Profile data extracted: name, email, avatar URL
[ ] User profile created/updated after OAuth login
[ ] Error handling: cancelled auth, network failure
[ ] Apple compliance: Sign-In with Apple available alongside other options
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Apple Sign-In rejection | Must be equal prominence with other auth options |
| OAuth token expiry | Handle refresh; gracefully degrade to email login |
| Account linking conflicts | Prompt user to link or create new account |

### LLM Agent Launch Prompt

```
Integrate Google and Apple OAuth into OhMyGold auth system.

CONTEXT: OhMyGold must support OAuth login for reduced friction. Apple Sign-In is mandatory for iOS apps (App Store policy). Both web and mobile need OAuth support.

TASK:
1. Configure OAuth providers in Supabase:
   - Google: Create client ID in Google Cloud Console
   - Apple: Create App ID in Apple Developer Portal
   - Add credentials to docker/.env and GitHub Secrets
   - Configure redirect URLs for web and mobile

2. Web OAuth implementation:
   - Add Google and Apple sign-in buttons to login screen
   - Google: supabase.auth.signInWithOAuth({ provider: 'google' })
   - Apple: supabase.auth.signInWithOAuth({ provider: 'apple' })
   - Handle callback at /auth/callback route
   - Extract profile data from OAuth response

3. Mobile OAuth implementation:
   - Google: expo-auth-session with Google provider
   - Apple: expo-apple-authentication (native iOS UI)
   - Handle deep link back to app after OAuth
   - Extract profile data from native auth response

4. Post-OAuth processing:
   - Check if user exists (by email)
   - If new: create user profile with "client" role
   - If existing: update avatar, name if not set
   - Store OAuth provider info
   - Log auth event in audit log

5. UI components:
   - OAuthButton component (Google/Apple variants)
   - Divider with "or continue with email" text
   - Equal prominence for all auth options (Apple requirement)

FILES TO CREATE/MODIFY:
- apps/web/src/pages/(auth)/login.tsx (add OAuth buttons)
- apps/web/src/pages/(auth)/oauth-callback.tsx
- apps/mobile/src/app/(auth)/login.tsx (add OAuth buttons)
- apps/mobile/src/lib/oauth.ts
- apps/mobile/app.json (iOS bundle identifier for Apple Sign-In)

VERIFICATION STEPS:
1. Sign in with Google (web) — account created, redirected
2. Sign in with Apple (web) — account created, redirected
3. Sign in with Google (mobile) — native flow works
4. Sign in with Apple (iOS) — native Apple UI shown
5. Verify profile data extracted correctly
6. Verify existing email account can link OAuth
7. Verify Apple Sign-In has equal prominence

NOTES AREA (fill on completion):
- Date completed: ___
- OAuth providers: Google, Apple
- Platform coverage: Web/Yes, iOS/Yes, Android/Yes
- Any Apple review issues: ___
```

---

## 3.4 Implement RBAC with Row Level Security

### Description and Scope
Implement the complete Role-Based Access Control system using Supabase RLS. Create policies on all database tables that enforce the permission matrix. 6 roles (admin, manager, employee, teacher, client, visitor) with scoped access — admin sees all, manager sees own location, client sees own data, etc.

### Why This Matters
RLS is the security backbone. Without it, any authenticated user can read/write any data. The permission matrix has 80+ sub-features with 6 roles — every single one must be enforced at the database level. RLS ensures security even if application code has bugs.

### Technical Approach
RLS policies on every table using `auth.uid()` and the user_profiles role/location. Helper SQL functions: `get_current_user_role()`, `get_current_user_location()`, `is_admin()`, `is_manager_of(location_id)`. Policies combine role checks with data scoping (own records, location records, all records).

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000016_rls_policies.sql    # RLS policies for all tables
└── 00000000000017_rbac_functions.sql  # Helper functions
```

### Dependencies on Other Items
- 1.7 (database schema with all tables)
- 3.1 (Supabase Auth working — RLS depends on auth.uid())

### Success Criteria
```
[ ] RLS enabled on ALL tables with active policies
[ ] Admin role: can CRUD all records in all tables
[ ] Manager role: can CRUD records at own location only
[ ] Employee role: can read own location, write check-ins/attendance/POS
[ ] Teacher role: can read own classes, write attendance/notes
[ ] Client role: can read/write own data only
[ ] Visitor role: can read own trial data only
[ ] Policies use helper functions (DRY — not repeated logic)
[ ] All policies tested with automated SQL tests
[ ] Unauthorized access returns zero rows (not errors)
```

### Estimated Effort
4-5 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Policy logic errors | Comprehensive SQL tests for each role + table combo |
| Performance impact of complex policies | Benchmark queries; use indexes on role/location columns |
| Policy maintenance as schema changes | Document policy patterns; use helper functions |

### LLM Agent Launch Prompt

```
Implement Row Level Security (RLS) policies for OhMyGold.

CONTEXT: OhMyGold has 6 roles with different data access levels. RLS must enforce the complete permission matrix at the database level. This is the security foundation.

TASK:

1. Create helper functions (supabase/migrations/00000000000017_rbac_functions.sql):
   - get_current_user_role() → returns app_roles enum
   - get_current_user_location() → returns uuid or null
   - is_admin() → boolean
   - is_manager_of(loc_id uuid) → boolean
   - is_employee_of(loc_id uuid) → boolean
   - is_teacher_of(class_id uuid) → boolean
   - is_own_record(user_id uuid) → boolean

2. Create RLS policies for ALL tables (00000000000016_rls_policies.sql):

   user_profiles:
   - Admin: all operations
   - Manager: read/write at own location
   - Employee: read own location users, write own profile
   - Teacher: read own class students, write own profile
   - Client: read/write own profile only

   members:
   - Admin: all operations
   - Manager: all at own location
   - Employee: read at own location, write enrollments
   - Client: read own member record

   classes/class_schedules:
   - Admin: all
   - Manager: all at own location
   - Teacher: read own classes, write own attendance
   - Client/Visitor: read (public schedule)

   bookings:
   - Admin: all
   - Manager: all at own location
   - Employee: read at own location
   - Client: own bookings only

   access_logs:
   - Admin: all
   - Manager: own location
   - Employee: own location (check-in processing)
   - Client: own entries only

   invoices/payments:
   - Admin: all
   - Manager: own location
   - Client: own invoices only

   products/inventory:
   - Admin: all
   - Manager: own location
   - Employee: read at own location

   leads:
   - Admin: all
   - Manager: own location
   - Employee: own location (read/write)

   campaigns:
   - Admin: all
   - Manager: own location

   audit_logs:
   - Admin: read all
   - Others: own activity only

REQUIREMENTS:
- Every table must have RLS enabled with policies
- Use helper functions to avoid repeating logic
- Test with SQL: set role, execute queries, verify results
- Policies should return zero rows for unauthorized (not error)
- Document policy patterns for future table additions

REFERENCE FILES:
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Feature Workflows: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md

FILES TO CREATE:
- supabase/migrations/00000000000017_rbac_functions.sql
- supabase/migrations/00000000000016_rls_policies.sql

VERIFICATION STEPS:
1. Test as Admin: can query all records
2. Test as Manager: sees only own location records
3. Test as Client: sees only own records
4. Test unauthorized INSERT: silently blocked
5. Test unauthorized UPDATE: silently blocked
6. Test unauthorized DELETE: silently blocked
7. Run automated SQL tests for all role+table combinations
8. Verify performance: queries return in < 100ms

NOTES AREA (fill on completion):
- Date completed: ___
- Tables with RLS: ___
- Total policies created: ___
- Test coverage: ___ role+table combinations tested
- Any policy complexity issues: ___
```

---

## 3.5 Build Role-Based Routing and Guards

### Description and Scope
Implement frontend route guards that prevent unauthorized users from accessing restricted screens. Redirect unauthenticated users to login, role-mismatched users to their dashboard, and handle "forbidden" scenarios gracefully. Works on both web (React Router) and mobile (React Navigation).

### Why This Matters
Frontend guards are the second line of defense (RLS being the first). A manager who bookmarks an admin URL should be redirected, not shown an error page. Guards provide a clean user experience while reinforcing security boundaries.

### Technical Approach
Web: React Router v7 with route guards as layout components. Check auth state and role before rendering. Redirect to login if unauthenticated, to dashboard if wrong role. Mobile: React Navigation with conditional screen rendering based on role. Stack navigator guards prevent deep-linking to unauthorized screens.

### Files/Directories to Create/Modify
```
apps/web/src/
├── components/
│   └── RouteGuard.tsx       # Route guard component
├── hooks/
│   └── useRoleGuard.ts      # Role checking hook
└── routes/
    └── routeConfig.ts       # Route definitions with role requirements
apps/mobile/src/
├── components/
│   └── NavigationGuard.tsx  # Navigation guard
├── hooks/
│   └── useRoleGuard.ts
└── navigation/
    └── roleBasedStacks.ts   # Conditional stack definitions
```

### Dependencies on Other Items
- 3.2 (login flow — auth state available)
- 3.4 (RBAC policies — roles defined)

### Success Criteria
```
[ ] Unauthenticated user → redirected to /login
[ ] Client accessing /admin → redirected to /dashboard (client)
[ ] Admin accessing any route → allowed
[ ] Manager accessing own location routes → allowed
[ ] Manager accessing other location routes → forbidden redirect
[ ] Employee accessing billing routes → forbidden redirect
[ ] Role-based sidebar highlights only accessible routes
[ ] 403 Forbidden page shown for URL-level blocks
[ ] Deep links respect role guards
[ ] Guards work on both web and mobile
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Route guard bypass | RLS is the real security; guards are UX layer |
| Flash of unauthorized content | Show loading spinner while auth state resolves |

### LLM Agent Launch Prompt

```
Build role-based routing guards for OhMyGold.

CONTEXT: OhMyGold has 6 roles with different route access. Guards must prevent unauthorized navigation on both web and mobile.

TASK:

1. Web Route Guard (RouteGuard.tsx):
   - Check auth state (loading → spinner, unauthenticated → /login)
   - Check required roles for current route
   - If wrong role → redirect to role-appropriate dashboard
   - If forbidden → show 403 page
   - Support nested routes (parent guard applies to children)

2. Route Configuration (routeConfig.ts):
   Define routes with required roles:
   ```
   /admin/* → admin only
   /manager/* → manager, admin
   /employee/* → employee, manager, admin
   /teacher/* → teacher, manager, admin
   /client/* → client, manager, admin
   /visitor/* → public (no auth required)
   /settings → all authenticated
   ```

3. Mobile Navigation Guard (NavigationGuard.tsx):
   - Check auth before navigating to protected screen
   - If unauthorized → redirect to login
   - Handle deep links with role validation
   - Conditional tab rendering based on role

4. Role Hook (useRoleGuard.ts):
   - useRoleGuard(requiredRoles: string[]): { allowed, isLoading }
   - useHasRole(role: string): boolean
   - useIsAdmin(): boolean
   - useCanAccess(feature: string): boolean

5. Forbidden Page:
   - Illustration, "Access Denied" message
   - Link to user's dashboard
   - Support email for access requests

FILES TO CREATE:
- apps/web/src/components/RouteGuard.tsx
- apps/web/src/hooks/useRoleGuard.ts
- apps/web/src/routes/routeConfig.ts
- apps/web/src/pages/403.tsx
- apps/mobile/src/components/NavigationGuard.tsx
- apps/mobile/src/hooks/useRoleGuard.ts
- apps/mobile/src/navigation/roleBasedStacks.ts

VERIFICATION STEPS:
1. Visit /admin as unauthenticated → /login redirect
2. Visit /admin as client → client dashboard redirect
3. Visit /admin as admin → admin dashboard loads
4. Visit /manager as manager → loads correctly
5. Deep link to unauthorized screen → blocked
6. Mobile: tab items filtered by role

NOTES AREA (fill on completion):
- Date completed: ___
- Routes guarded: ___
- Role checks implemented: ___
- Any redirect loop issues: ___
```

---

## 3.6 Implement Password Reset and Recovery

### Description and Scope
Build the complete password reset flow: "Forgot password" form, email with secure reset link, password reset form with token validation, password strength requirements, and confirmation. Both web and mobile implementations.

### Why This Matters
Password reset is a critical user journey — when someone forgets their password, they need a fast, secure way to regain access. A broken reset flow leads to support tickets and frustrated users. Security is paramount: tokens must be single-use, time-limited, and cryptographically secure.

### Technical Approach
Supabase Auth built-in password reset. Request: `supabase.auth.resetPasswordForEmail()`. Token sent via email with link to `/auth/reset-password?token=xxx`. Reset page validates token, shows new password form, submits via `supabase.auth.updateUser()`. Token expiry: 1 hour. Single-use enforced.

### Files/Directories to Create/Modify
```
apps/web/src/pages/(auth)/
├── forgot-password.tsx      # Request reset email form
└── reset-password.tsx       # New password form (token validation)
apps/mobile/src/app/(auth)/
├── forgot-password.tsx
└── reset-password.tsx
```

### Dependencies on Other Items
- 3.1 (Supabase Auth configured with email templates)
- 3.2 (auth screens pattern)

### Success Criteria
```
[ ] "Forgot password?" link on login screen
[ ] Email form validates email format
[ ] Reset email sent with secure token
[ ] Token expiry: 1 hour
[ ] Reset link works: opens reset password form
[ ] New password must meet strength requirements
[ ] Password confirmation field must match
[ ] Success: password updated, redirect to login
[ ] Token already used → show "link expired" message
[ ] Token expired → show "link expired" message
[ ] Both web and mobile flows functional
```

### Estimated Effort
1-2 days

### LLM Agent Launch Prompt

```
Implement the password reset flow for OhMyGold.

CONTEXT: Standard password reset with email token. Must be secure and work on both platforms.

TASK:
1. Forgot Password Screen (forgot-password.tsx):
   - Email input field
   - Submit button "Send Reset Link"
   - Loading state
   - Success: "Check your email for reset instructions"
   - Error: email not found (don't reveal — same success message)
   - Link back to login

2. Reset Password Screen (reset-password.tsx):
   - Token from URL parameter
   - New password input with strength indicator
   - Confirm password input
   - Submit button "Reset Password"
   - Validation: passwords match, meet strength requirements
   - Error: "Link expired or invalid" if token bad
   - Success: redirect to login with "Password updated" toast

3. Email Template:
   - Use existing reset-password.html from Phase 3.1
   - Link to web and mobile reset routes

4. Flow:
   - Request: supabase.auth.resetPasswordForEmail(email)
   - Validate: supabase.auth.verifyOtp(token)
   - Update: supabase.auth.updateUser({ password })

FILES TO CREATE:
- apps/web/src/pages/(auth)/forgot-password.tsx
- apps/web/src/pages/(auth)/reset-password.tsx
- apps/mobile/src/app/(auth)/forgot-password.tsx
- apps/mobile/src/app/(auth)/reset-password.tsx

VERIFICATION STEPS:
1. Request reset → email received with link
2. Click valid link → reset form loads
3. Submit matching passwords → success
4. Login with new password → works
5. Try reused link → "expired" error
6. Mismatched passwords → validation error

NOTES AREA (fill on completion):
- Date completed: ___
- Token expiry: ___
- Email delivery time: ___
- Any security issues: ___
```

---

## 3.7 Build User Profile Management

### Description and Scope
Implement user profile management screens where users can view and edit their profile information: name, email, phone, avatar, password, notification preferences, and 2FA settings. Role-based profile fields (admin sees more, client sees less).

### Why This Matters
Users need to manage their own information — GDPR requires it (right to rectification). Profile management is also a security feature: password changes, 2FA setup, session management. Each role has different profile fields and edit capabilities.

### Technical Approach
Profile data stored in `user_profiles` table (extends `auth.users`). Edit form with React Hook Form + Zod. Avatar upload to Supabase Storage. Password change via Supabase Auth. 2FA setup via Supabase MFA API (TOTP). Session list with "logout all devices" option.

### Files/Directories to Create/Modify
```
apps/web/src/pages/
├── settings/
│   └── profile.tsx          # Profile edit page
├── api/
│   └── update-profile.ts    # API route for profile update
apps/mobile/src/app/
├── (app)/settings/
│   └── profile.tsx          # Profile edit screen
```

### Dependencies on Other Items
- 3.2 (auth state and login)
- 2.7 (form components)
- 2.2 (avatar component)

### Success Criteria
```
[ ] Profile page shows: name, email, phone, avatar, role
[ ] Edit mode: inline editing with save/cancel
[ ] Avatar: upload new, remove current, fallback to initials
[ ] Password change: current + new + confirm
[ ] Notification preferences: toggle email/push/SMS per event type
[ ] 2FA setup: QR code scan, verification code, backup codes
[ ] Session list: show active sessions, device info
[ ] "Logout all devices" button
[ ] GDPR data export: download all personal data as JSON
[ ] All changes saved via API with optimistic UI
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Avatar upload size | Limit to 5MB; resize to 512x512 |
| 2FA QR code display | Use react-qr-code; test with authenticator apps |

### LLM Agent Launch Prompt

```
Build user profile management for OhMyGold.

CONTEXT: Users need to manage their profile. Different roles have different editable fields. GDPR requires data export capability.

TASK:
1. Profile View/Edit Screen:
   - Display: avatar, name, email, phone, role, location
   - Edit mode with Form components
   - Avatar upload: Supabase Storage, 5MB limit, resize to 512x512
   - Save: update user_profiles table
   - Optimistic UI: immediate update, rollback on error

2. Password Change Section:
   - Current password (required)
   - New password (with strength indicator)
   - Confirm password
   - Submit: supabase.auth.updateUser({ password })

3. Notification Preferences:
   - Toggle switches for: email, push, SMS
   - Per-event types: class reminders, billing, promotions, announcements
   - Stored in user_preferences JSONB column

4. 2FA Setup:
   - Enable button → supabase.auth.mfa.enroll()
   - Display QR code (react-qr-code)
   - User scans with authenticator app
   - Enter verification code to confirm
   - Show backup codes (downloadable)
   - Disable 2FA option

5. Session Management:
   - List active sessions with device, location, last active
   - "Logout this device" per session
   - "Logout all other devices" button

6. GDPR Data Export:
   - "Export my data" button
   - Generate JSON with all personal data
   - Include: profile, bookings, payments, access logs, communications
   - Download link

FILES TO CREATE:
- apps/web/src/pages/settings/profile.tsx
- apps/mobile/src/app/(app)/settings/profile.tsx
- Shared profile form components

VERIFICATION STEPS:
1. Edit profile — changes saved and reflected
2. Upload avatar — displays correctly
3. Change password — login with new password works
4. Toggle notification preferences — persisted
5. Enable 2FA — QR code scans, verification works
6. View sessions — list accurate
7. Export data — JSON contains all personal data

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5.7 (Forms)

NOTES AREA (fill on completion):
- Date completed: ___
- Profile fields editable: ___
- 2FA tested with: Google Authenticator/Authy/Both
- Data export size (test user): ___
```

---

## 3.8 Implement Session Management

### Description and Scope
Build a comprehensive session management system: multi-device support (users can be logged in on phone, tablet, and web), session listing with device info, idle timeout (30 minutes for staff, 24 hours for clients), "logout all devices" functionality, and automatic token refresh.

### Why This Matters
Gym staff often share devices (front desk terminals). Session management prevents unauthorized access from abandoned sessions. Token refresh ensures users aren't constantly re-authenticated while maintaining security. Multi-device support is expected — users check their phone while working on the web dashboard.

### Technical Approach
Supabase Auth handles session management with JWT tokens. Refresh token rotation prevents replay attacks. Custom session tracking table (`user_sessions`) stores device info, IP, last active. Idle timeout implemented via activity listeners. Token refresh: automatic before expiry via interceptor.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000018_user_sessions.sql    # Session tracking table
apps/web/src/
├── hooks/
│   └── useSessionTimeout.ts            # Idle timeout detection
├── lib/
│   └── sessionManager.ts               # Session utilities
apps/mobile/src/
├── hooks/
│   └── useSessionTimeout.ts
```

### Dependencies on Other Items
- 3.1 (Supabase Auth configured)
- 3.7 (profile management — session list)

### Success Criteria
```
[ ] User can be logged in on multiple devices simultaneously
[ ] Session list shows: device, browser/app, IP, location, last active
[ ] Idle timeout: 30 minutes staff, 24 hours clients
[ ] Activity detection: mouse/keyboard (web), touch (mobile)
[ ] Token auto-refresh: silent, no user interruption
[ ] "Logout all devices" invalidates all sessions
[ ] "Logout this device" removes specific session
[ ] Session expiry: user redirected to login with message
[ ] Secure: sessions stored server-side, not localStorage only
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Implement session management for OhMyGold.

CONTEXT: Multi-device session support with idle timeouts and security controls.

TASK:
1. Create user_sessions table:
   - id, user_id, device_type, device_name, ip_address, location
   - created_at, last_active_at, expires_at
   - is_active, refresh_token_hash

2. Session tracking:
   - On login: create session record
   - On activity: update last_active_at
   - On token refresh: update refresh_token_hash

3. Idle timeout:
   - Staff (admin/manager/employee/teacher): 30 minutes
   - Client/Visitor: 24 hours
   - Detect activity: mousemove, keydown (web), touchstart (mobile)
   - Show warning at 5 minutes before timeout
   - Auto-logout on timeout expiry

4. Token refresh:
   - Intercept API calls, check token expiry
   - Auto-refresh 5 minutes before expiry
   - Queue concurrent requests during refresh
   - On refresh failure → redirect to login

5. Session list:
   - Query user_sessions for current user
   - Display with device icons, last active "2 minutes ago"
   - "Logout this device" button per session
   - "Logout all other devices" button

6. Logout:
   - Clear local auth state
   - Revoke refresh token server-side
   - Mark session inactive
   - Redirect to login

FILES TO CREATE:
- supabase/migrations/00000000000018_user_sessions.sql
- apps/web/src/hooks/useSessionTimeout.ts
- apps/web/src/lib/sessionManager.ts
- apps/mobile/src/hooks/useSessionTimeout.ts

VERIFICATION STEPS:
1. Login on web + mobile — both sessions active
2. Session list shows both devices
3. Wait 30 min without activity (staff) — warning shown, then logout
4. Token refreshes silently before expiry
5. "Logout all other devices" — other session invalidated
6. Check server-side: revoked sessions can't refresh

NOTES AREA (fill on completion):
- Date completed: ___
- Idle timeout: Staff ___ min, Client ___ hours
- Token refresh interval: ___ minutes before expiry
- Max concurrent sessions: ___
```

---

## 3.9 Create Audit Logging for Auth Events

### Description and Scope
Implement comprehensive audit logging for all authentication events: login success/failure, logout, password change, OAuth connection, 2FA enable/disable, session creation/deletion, role changes, and failed access attempts. Logs stored in `audit_logs` table with full metadata.

### Why This Matters
Audit logging is required for SOC2 compliance and essential for security monitoring. When a breach occurs, audit logs are the only way to understand what happened. For gym management, tracking who accessed what and when is critical — especially for financial and personal health data.

### Technical Approach
Database trigger on auth.events or Edge Function called from auth hooks. Log all auth actions to `audit_logs` table with: event_type, user_id, ip_address, user_agent, location, timestamp, details JSONB. Edge Function for post-auth hooks (onLogin, onLogout). Admin dashboard for viewing audit logs.

### Files/Directories to Create/Modify
```
supabase/
├── migrations/
│   └── 00000000000019_auth_audit.sql    # Audit logging setup
└── functions/
    └── auth-hooks/
        └── index.ts                     # Edge Function for auth events
```

### Dependencies on Other Items
- 1.7 (audit_logs table)
- 3.1 (Supabase Auth configured)

### Success Criteria
```
[ ] Every login attempt logged (success and failure)
[ ] Every logout logged
[ ] Password changes logged with timestamp
[ ] OAuth connections logged (provider, account linked)
[ ] 2FA enable/disable logged
[ ] Session creation and deletion logged
[ ] Role changes logged (who changed, old role, new role)
[ ] Failed access attempts logged (user, resource, timestamp)
[ ] Logs include: IP address, user agent, location
[ ] Admin can view and filter audit logs
[ ] Logs immutable (no UPDATE/DELETE allowed)
[ ] Retention: 2 years (configurable)
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Create audit logging for OhMyGold authentication events.

CONTEXT: Comprehensive audit logging required for SOC2 compliance and security monitoring. All auth events must be tracked.

TASK:
1. Update audit_logs table if needed:
   - Ensure columns: id, event_type, user_id, target_user_id, ip_address, user_agent, location, details (JSONB), created_at
   - Add RLS: admin can read all, users can read own
   - Prevent UPDATE/DELETE (immutable logs)

2. Create Edge Function (supabase/functions/auth-hooks/index.ts):
   - Triggered on auth events
   - Events to log:
     * user.created (registration)
     * user.deleted (account deletion)
     * token_revoked (logout)
   - Insert into audit_logs with metadata

3. Create database triggers:
   - On user_profiles UPDATE: log role changes, location changes
   - On user_sessions INSERT/UPDATE: log session events
   - On failed login: log attempt (stored in auth schema)

4. Log format:
   ```json
   {
     "event_type": "login.success",
     "user_id": "uuid",
     "ip_address": "192.168.1.1",
     "user_agent": "Mozilla/5.0...",
     "location": "Paris Gym",
     "details": {
       "method": "email_password",
       "device": "Chrome on macOS"
     }
   }
   ```

5. Admin audit log viewer:
   - Filter by: event type, user, date range
   - Sort by: timestamp (newest first)
   - Export to CSV
   - Pagination

REQUIREMENTS:
- Logs must be immutable (no edit/delete)
- Include geolocation if available
- 2-year retention policy
- Admin-only access to all logs
- Users can view own activity log (GDPR transparency)

FILES TO CREATE:
- supabase/migrations/00000000000019_auth_audit.sql
- supabase/functions/auth-hooks/index.ts
- Web audit log viewer component

VERIFICATION STEPS:
1. Login → check audit log entry created
2. Failed login → check failed attempt logged
3. Change password → check audit entry
4. Verify logs can't be deleted
5. Admin can view filtered logs
6. Verify retention policy

NOTES AREA (fill on completion):
- Date completed: ___
- Events logged: ___ types
- Retention period: ___
- Immutability verified: Yes/No
```

---

## 3.10 Implement JWT Refresh Token Flow

### Description and Scope
Implement and verify the JWT refresh token flow: access tokens expire in 1 hour, refresh tokens (rotated) valid for 7 days, automatic silent refresh before expiry, handling of expired tokens (redirect to login), and multi-tab synchronization of auth state.

### Why This Matters
JWT tokens are the currency of authentication in OhMyGold. Every API request carries an access token. Short-lived access tokens + long-lived refresh tokens is the industry standard for security. A broken refresh flow means users are kicked out unexpectedly — the #1 source of auth-related complaints.

### Technical Approach
Supabase Auth handles refresh token rotation automatically. Custom interceptor in Supabase client checks token expiry before API calls. If expiring soon (< 5 min), trigger refresh. On refresh failure (expired, revoked), clear auth state and redirect. Broadcast auth state changes across browser tabs via `BroadcastChannel` API.

### Files/Directories to Create/Modify
```
packages/shared/src/utils/
├── tokenRefresh.ts          # Token refresh logic
└── authSync.ts              # Cross-tab auth sync
apps/web/src/lib/
└── supabase.ts              # Add refresh interceptor
apps/mobile/src/lib/
└── supabase.ts              # Add refresh interceptor
```

### Dependencies on Other Items
- 3.1 (Supabase Auth configured)
- 3.2 (login flow — auth state management)

### Success Criteria
```
[ ] Access token expires in 1 hour (configurable)
[ ] Refresh token valid for 7 days
[ ] Refresh token rotation: new refresh token on each use
[ ] Auto-refresh: triggered 5 minutes before access token expiry
[ ] Silent refresh: no user interruption
[ ] On refresh failure: redirect to login with message
[ ] Multi-tab sync: logout in one tab logs out all tabs
[ ] Refresh during offline: queues, retries on reconnect
[ ] Concurrent requests during refresh: queued, not failed
[ ] Refresh token theft detection: old token use revokes session
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Implement the JWT refresh token flow for OhMyGold.

CONTEXT: Supabase Auth handles JWT tokens. We need to configure expiry, implement automatic refresh, and handle edge cases.

TASK:
1. Configure token settings:
   - Access token expiry: 3600 seconds (1 hour)
   - Refresh token expiry: 604800 seconds (7 days)
   - Refresh token rotation: enabled (new token on each refresh)

2. Implement auto-refresh:
   - Check token expiry before each API call
   - If expiring in < 5 minutes → trigger refresh
   - Supabase client: `supabase.auth.onAuthStateChange()`
   - Silent: user doesn't see any interruption

3. Handle refresh failures:
   - Token expired → redirect to login
   - Token revoked → redirect to login (session ended elsewhere)
   - Network error → retry with exponential backoff
   - Show toast: "Your session has expired. Please log in again."

4. Multi-tab synchronization:
   - Use BroadcastChannel API (web)
   - On logout: broadcast to all tabs
   - On login: broadcast auth state
   - All tabs stay in sync

5. Concurrent request handling:
   - If refresh in progress, queue other requests
   - After refresh completes, retry queued requests
   - Prevent multiple simultaneous refresh calls

6. Mobile considerations:
   - Handle app background/foreground transitions
   - Refresh on foreground if token may have expired
   - Handle push notifications while in background

FILES TO CREATE/MODIFY:
- apps/web/src/lib/supabase.ts (add refresh logic)
- apps/mobile/src/lib/supabase.ts (add refresh logic)
- packages/shared/src/utils/tokenRefresh.ts
- packages/shared/src/utils/authSync.ts

VERIFICATION STEPS:
1. Login → verify token received with 1h expiry
2. Wait 55 minutes → verify silent refresh
3. Open 2 tabs → logout in one, other tab logs out
4. Revoke session server-side → client detects on next request
5. Simulate offline → refresh queued, retry on reconnect
6. Test concurrent requests during refresh

NOTES AREA (fill on completion):
- Date completed: ___
- Token expiry: Access ___s, Refresh ___s
- Rotation: Enabled/Disabled
- Multi-tab sync: Working/Not working
- Mobile foreground refresh: Yes/No
```

---

## Phase 3 Completion Checklist

```
[ ] 3.1 Supabase Auth configured: email, JWT, refresh rotation, MFA, SMTP
[ ] 3.2 Login/registration flows: web + mobile, multi-step registration
[ ] 3.3 OAuth integration: Google + Apple, web + mobile, account linking
[ ] 3.4 RBAC with RLS: all tables have policies, 6 roles enforced
[ ] 3.5 Role-based routing guards: redirect unauthorized, 403 page
[ ] 3.6 Password reset: forgot password, email token, reset form
[ ] 3.7 User profile management: edit, avatar, password, 2FA, sessions
[ ] 3.8 Session management: multi-device, idle timeout, auto-logout
[ ] 3.9 Audit logging: all auth events, immutable, admin viewer
[ ] 3.10 JWT refresh token flow: auto-refresh, multi-tab sync
[ ] All RLS policies tested for each role
[ ] Auth flows tested on web and mobile
[ ] 2FA works with Google Authenticator and Authy
[ ] Audit logs are immutable and queryable
[ ] Cross-tab auth synchronization working
```

---

*Phase 3 notes: Auth is the fortress wall. RLS policies are the guards at every door. Every policy must be tested, every flow must work on both platforms. A security flaw here compromises the entire system. Take the time to write comprehensive SQL tests for RLS policies — they are your safety net.*

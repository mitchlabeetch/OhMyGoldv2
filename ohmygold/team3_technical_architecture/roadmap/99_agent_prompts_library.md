# OhMyGold — LLM Agent Prompts Library

> **File:** 99_agent_prompts_library.md
> **Purpose:** Reusable prompt templates for LLM coding agents implementing OhMyGold features
> **Usage:** Copy the relevant template, fill in [BRACKETS], and send to agent

---

## Table of Contents

1. [How to Use These Prompts](#how-to-use-these-prompts)
2. [Webapp Component Developer Prompt](#1-webapp-component-developer-prompt)
3. [Mobile Screen Developer Prompt](#2-mobile-screen-developer-prompt)
4. [Backend API Developer Prompt](#3-backend-api-developer-prompt)
5. [Database Migration Developer Prompt](#4-database-migration-developer-prompt)
6. [Auth/RLS Developer Prompt](#5-authrls-developer-prompt)
7. [UI Component Developer Prompt](#7-ui-component-developer-prompt)
8. [Testing Developer Prompt](#8-testing-developer-prompt)
9. [Prompt Customization Guide](#prompt-customization-guide)

---

## How to Use These Prompts

Each prompt template follows a consistent structure:

1. **CONTEXT**: What OhMyGold is, relevant architecture decisions
2. **TASK**: What to build, specific requirements
3. **REQUIREMENTS**: Technical constraints, compliance needs
4. **FILES TO CREATE/MODIFY**: Explicit file paths
5. **VERIFICATION STEPS**: How to confirm it works
6. **NOTES AREA**: Template for agent to fill on completion

**Before sending a prompt to an agent:**
1. Read the relevant phase file (e.g., `phase_04_core_gym.md`)
2. Copy the appropriate template below
3. Fill in all `[BRACKETED]` placeholders
4. Add specific context from phase files
5. Specify which previous items the agent must check
6. Send to agent

**After agent completes:**
1. Review the filled NOTES AREA
2. Verify all tickboxes are checked
3. Run the VERIFICATION STEPS
4. Update the phase file with completion status

---

## 1. Webapp Component Developer Prompt

```
You are implementing a web screen for OhMyGold, Gold's Gym France's all-in-one gym management platform.

CONTEXT:
OhMyGold is a React 19 + TypeScript + Vite webapp with Tailwind CSS and shadcn/ui. It uses TanStack Query for data fetching, Zustand for state, React Hook Form + Zod for forms, and react-i18next for i18n (FR/EN). The design system is in packages/ui with shared components.

ROLE CONTEXT: [Admin/Manager/Employee/Teacher/Client/Visitor]
This screen is for the [ROLE] role. The user has [PERMISSIONS] permissions.

TASK:
Implement the following screen(s) in the OhMyGold webapp:

SCREEN(S) TO IMPLEMENT:
- [Screen path, e.g., /manager/members]
- [Screen description and purpose]
- [Key features and functionality]
- [Data needed from API]

SPECIFIC REQUIREMENTS:
- [List specific features, e.g., data table with search, form with validation, etc.]
- [Any specific business logic]

DESIGN SYSTEM REFERENCES:
- Read packages/ui-shared/src/components/ for available components (Button, Input, Card, DataTable, Modal, etc.)
- Use design tokens from packages/ui-shared/src/tokens/
- Follow accessibility patterns from packages/ui-shared/src/a11y/
- All text must use t() from react-i18next
- Colors: use token values, no hardcoded colors

DATA FETCHING:
- Use TanStack Query (useQuery, useMutation)
- API endpoints: [list relevant Supabase/Edge Function endpoints]
- Loading states: skeleton placeholders
- Error states: error boundary with retry

FORMS (if applicable):
- Use React Hook Form + Zod validation
- Import schemas from @ohmygold/shared
- Top-aligned labels (for French text expansion)
- Inline validation with error messages

FILES TO CREATE/MODIFY:
- apps/web/src/pages/[role]/[screen].tsx
- [Any supporting hooks, components, or utilities]

VERIFICATION STEPS:
1. Screen loads without errors
2. All features work as specified
3. Data fetches and displays correctly
4. Forms validate and submit
5. French and English labels render
6. Responsive on xs → 2xl breakpoints
7. axe accessibility audit passes (score >= 95)
8. Loading and error states handled

CROSS-REFERENCES:
- Design System: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §[relevant section]
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md §[relevant section]
- Feature List: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md §[relevant section]

PREREQUISITES TO CHECK:
- [ ] Phase [X].[Y] completed: [specific prerequisite]
- [ ] Design system components available
- [ ] API endpoints available

NOTES AREA (fill on completion):
- Date completed: ___
- Files created: ___
- Components used from design system: ___
- API endpoints consumed: ___
- Forms implemented: ___
- Accessibility score: ___
- Responsive breakpoints tested: ___
- Issues encountered: ___
- Deviation from spec: ___
```

---

## 2. Mobile Screen Developer Prompt

```
You are implementing a mobile screen for OhMyGold, Gold's Gym France's gym management platform.

CONTEXT:
OhMyGold's mobile app is built with React Native + Expo SDK 53, using Expo Router v3 for file-based navigation. UI uses NativeWind (Tailwind for RN) with design tokens from packages/ui. State management via Zustand, data fetching via TanStack Query.

PLATFORM: [iOS / Android / Both]
ROLE: [Admin/Manager/Employee/Teacher/Client/Visitor]

TASK:
Implement the following mobile screen(s):

SCREEN(S) TO IMPLEMENT:
- [Screen path, e.g., app/(app)/bookings/index.tsx]
- [Screen description and purpose]
- [Key features]

SPECIFIC REQUIREMENTS:
- [List features, e.g., scrollable list, pull-to-refresh, camera integration, etc.]

DESIGN SYSTEM REFERENCES:
- Read packages/ui-shared/src/components/ for mobile variants (.native.tsx files)
- Use design tokens: packages/ui-shared/src/theme.ts
- i18n: use t() hook for all text
- Touch targets: minimum [44/48/56/64]dp
- Platform-specific patterns: [bottom sheet / action sheet / native picker]

NATIVE CAPABILITIES (if applicable):
- Camera: expo-camera v16
- GPS: expo-location
- Notifications: expo-notifications
- Biometrics: expo-local-authentication
- [Specify which native features to use]

DATA FETCHING:
- Use TanStack Query
- Offline: cache data with AsyncStorage/SQLite
- Sync queue: queue mutations when offline

FILES TO CREATE/MODIFY:
- apps/mobile/src/app/(app)/[screen].tsx
- [Any supporting components or hooks]

VERIFICATION STEPS:
1. Screen loads in Expo dev client
2. All features work
3. Data fetches correctly
4. Native features work (camera/GPS/etc.)
5. French and English text renders
6. Touch targets adequate
7. Works offline (if applicable)
8. No memory leaks (test with Flipper)

CROSS-REFERENCES:
- Design System: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §[section]
- Mobile Accessibility Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/03_mobile_accessibility_matrix.md
- Mobile Research: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md

PREREQUISITES TO CHECK:
- [ ] Mobile app scaffolding (Phase 6.1) complete
- [ ] Auth screens (Phase 6.2) complete
- [ ] Relevant API endpoints available

NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Native features used: ___
- Platform tested: iOS/Yes/No Android/Yes/No
- Offline support: Yes/No
- Performance: ___
- Issues encountered: ___
```

---

## 3. Backend API Developer Prompt

```
You are implementing backend API functionality for OhMyGold using Supabase Edge Functions.

CONTEXT:
OhMyGold uses self-hosted Supabase with PostgreSQL 16. Backend logic is implemented as Edge Functions (Deno runtime) and database triggers/plpgSQL functions. APIs are consumed by React webapp and React Native mobile app.

TASK:
Implement the following backend functionality:

FEATURE TO IMPLEMENT:
- [Feature name, e.g., "Class booking engine"]
- [Description of business logic]
- [API endpoints to create]

DATABASE CHANGES:
- [Tables to create/modify]
- [Indexes needed]
- [Triggers to create]

EDGE FUNCTIONS:
- [Function name]: [method] [path] → [description]
- [Input validation, output format]

BUSINESS LOGIC:
- [Specific rules and constraints]
- [Edge cases to handle]
- [Error scenarios]

SECURITY:
- RLS policies must enforce role-based access
- Input validation: Zod schemas
- Rate limiting: implement per endpoint
- Audit logging: log all mutations

FILES TO CREATE/MODIFY:
- supabase/migrations/[timestamp]_[description].sql
- supabase/functions/[function-name]/index.ts
- [Any shared utilities]

VERIFICATION STEPS:
1. Migration applies cleanly
2. Edge Function deploys successfully
3. API responds with correct data
4. Input validation rejects invalid data
5. RLS policies enforce access control
6. Error handling returns proper status codes
7. Rate limiting works
8. Audit logs capture mutations

CROSS-REFERENCES:
- Feature List: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Feature Workflows: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md

PREREQUISITES TO CHECK:
- [ ] Database schema (Phase 1.7) in place
- [ ] RLS policies (Phase 3.4) active
- [ ] Audit logging (Phase 3.9) configured

NOTES AREA (fill on completion):
- Date completed: ___
- Migrations created: ___
- Edge Functions created: ___
- API endpoints: ___
- RLS policies added/updated: ___
- Performance tested: ___ requests/sec
- Issues encountered: ___
```

---

## 4. Database Migration Developer Prompt

```
You are creating a database migration for OhMyGold using Supabase migrations.

CONTEXT:
OhMyGold uses PostgreSQL 16 via self-hosted Supabase. Migrations use Supabase CLI with timestamp-prefixed SQL files. All tables must have: uuid primary key, created_at, updated_at, RLS enabled. Foreign keys with proper ON DELETE rules. Indexes on frequently queried columns.

MIGRATION TO CREATE:
- [Migration number]: [description]
- [Tables to create]
- [Tables to modify]
- [Data to seed]

TABLE SPECIFICATIONS:
For each table, specify:
- Name, purpose
- Columns: name, type, constraints, defaults
- Foreign keys: references, ON DELETE
- Indexes: columns, type
- RLS: policies (role-based)
- Triggers: auto-updated_at, audit logging

CONSTRAINTS:
- Use uuid for all primary keys (gen_random_uuid())
- Every table: created_at, updated_at (timestamptz)
- Enable RLS on every table
- Foreign keys: proper ON DELETE (CASCADE or SET NULL)
- CHECK constraints where applicable
- Unique constraints where needed
- Comments on tables and columns

SEED DATA:
- [Any seed data to include]
- [Useful for development/testing]

FILES TO CREATE:
- supabase/migrations/[timestamp]_[description].sql

VERIFICATION STEPS:
1. supabase db reset → migration applies cleanly
2. Schema matches specification
3. Foreign keys work correctly
4. Indexes created
5. RLS enabled and policies active
6. Seed data present
7. Types auto-generated correctly

CROSS-REFERENCES:
- Database Schema: docs/architecture/003-database-design.md
- Feature List: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

PREREQUISITES TO CHECK:
- [ ] Previous migrations applied successfully
- [ ] No migration number conflicts
- [ ] pnpm gen:types works after migration

NOTES AREA (fill on completion):
- Date completed: ___
- Tables created: ___
- Tables modified: ___
- Indexes created: ___
- RLS policies: ___
- Triggers: ___
- Seed data records: ___
- Any issues: ___
```

---

## 5. Auth/RLS Developer Prompt

```
You are implementing authentication or authorization functionality for OhMyGold using Supabase Auth and Row Level Security.

CONTEXT:
OhMyGold has 6 roles: admin, manager, employee, teacher, client, visitor. Auth uses Supabase Auth (GoTrue) with email/password and OAuth (Google, Apple). RLS policies enforce role-based data access at the database level. All auth events are audited.

TASK:
Implement the following auth/RLS functionality:

FEATURE TO IMPLEMENT:
- [e.g., "RLS policies for bookings table"]
- [e.g., "OAuth Google Sign-In integration"]
- [e.g., "Session timeout for staff roles"]

AUTH REQUIREMENTS:
- Supabase Auth configuration
- JWT settings (expiry, refresh)
- OAuth provider setup
- Session management
- Password policy

RLS REQUIREMENTS:
- Role: [which roles need access]
- Operations: [SELECT/INSERT/UPDATE/DELETE]
- Scope: [all records / own location / own records]
- Helper functions to use

AUDIT REQUIREMENTS:
- Events to log
- Log format
- Retention policy

FILES TO CREATE/MODIFY:
- supabase/migrations/[timestamp]_rls_[description].sql
- apps/[web|mobile]/src/lib/supabase.ts
- [Any auth-related components]

VERIFICATION STEPS:
1. Test as Admin: can perform all operations
2. Test as Manager: scoped to own location
3. Test as Client: only own records
4. Test unauthorized: zero rows returned (not error)
5. Audit log captures all events
6. JWT refresh works correctly
7. OAuth login works end-to-end
8. Session timeout works

CROSS-REFERENCES:
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Feature Workflows: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md
- Phase 3 auth docs: phase_03_auth.md

PREREQUISITES TO CHECK:
- [ ] Supabase Auth configured (Phase 3.1)
- [ ] RBAC helper functions exist (Phase 3.4)
- [ ] Audit logging table exists (Phase 3.9)

NOTES AREA (fill on completion):
- Date completed: ___
- RLS policies created: ___
- Auth flows updated: ___
- Roles tested: ___
- Audit events: ___
- Issues encountered: ___
```

---

## 6. UI Component Developer Prompt

```
You are implementing a UI component for the OhMyGold shared design system.

CONTEXT:
OhMyGold's design system is in packages/ui-shared/. Components have three files: [Component].types.ts (shared props), [Component].tsx (web implementation with Tailwind), [Component].native.tsx (mobile with NativeWind/StyleSheet). All components must be accessible, i18n-ready, support dark mode, and work on both platforms.

COMPONENT TO IMPLEMENT:
- Name: [ComponentName]
- Purpose: [what it does]
- Variants: [list variants]
- States: [default, hover, active, disabled, loading, error]

DESIGN SPECIFICATIONS:
- Colors: use tokens from packages/ui-shared/src/tokens/colors.ts
- Typography: use tokens from packages/ui-shared/src/tokens/typography.ts
- Spacing: use tokens from packages/ui-shared/src/tokens/spacing.ts
- Animations: use tokens from packages/ui-shared/src/tokens/animations.ts
- Dark mode: support via design tokens

ACCESSIBILITY REQUIREMENTS:
- ARIA roles and states
- Keyboard navigation
- Screen reader labels
- Focus management
- Color contrast >= 4.5:1
- Touch targets >= 44px mobile

FILES TO CREATE:
- packages/ui-shared/src/components/[ComponentName]/[ComponentName].types.ts
- packages/ui-shared/src/components/[ComponentName]/[ComponentName].tsx
- packages/ui-shared/src/components/[ComponentName]/[ComponentName].native.tsx
- packages/ui-shared/src/components/[ComponentName]/index.ts

VERIFICATION STEPS:
1. Component renders in Storybook (web)
2. Component renders in Expo (mobile)
3. All variants display correctly
4. All states work (hover, disabled, loading)
5. Dark mode switches correctly
6. axe accessibility audit passes
7. French text renders without overflow
8. Touch targets adequate on mobile

CROSS-REFERENCES:
- Design System: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §[component section]
- Accessibility: packages/ui-shared/src/a11y/

PREREQUISITES TO CHECK:
- [ ] Design tokens implemented (Phase 2.1)
- [ ] Accessibility primitives available (Phase 2.4)
- [ ] Animation tokens available (Phase 2.5)

NOTES AREA (fill on completion):
- Date completed: ___
- Variants implemented: ___
- States implemented: ___
- Accessibility score: ___
- Mobile tested: Yes/No
- Dark mode: Yes/No
- Storybook story: Yes/No
```

---

## 7. Testing Developer Prompt

```
You are writing tests for OhMyGold functionality.

CONTEXT:
OhMyGold uses Vitest for unit tests, Playwright for web E2E, Detox for mobile E2E, and React Testing Library for component tests. MSW (Mock Service Worker) mocks API calls in tests. All tests run in CI on every push.

TYPE OF TESTS TO WRITE:
- [ ] Unit tests (functions, hooks, utilities)
- [ ] Component tests (React Testing Library)
- [ ] Integration tests (API + data flow)
- [ ] E2E web tests (Playwright)
- [ ] E2E mobile tests (Detox)
- [ ] Accessibility tests (axe-core)
- [ ] Visual regression tests

FUNCTIONALITY TO TEST:
- [Feature/module to test]
- [Specific behaviors to cover]
- [Edge cases to test]
- [Error scenarios to test]

TEST REQUIREMENTS:
- Unit: > 80% coverage target
- Mock external APIs with MSW
- Mock Supabase with @supabase/supabase-js testing utils
- Test error states, loading states, empty states
- Test accessibility (keyboard nav, ARIA)
- French text rendering in tests
- No test interdependencies (isolated)
- Descriptive test names (given/when/then format)

FILES TO CREATE:
- tests/unit/[path]/[feature].test.ts
- tests/integration/[feature].test.ts
- tests/e2e/web/[feature].spec.ts
- tests/e2e/mobile/[feature].spec.js

VERIFICATION STEPS:
1. All tests pass: pnpm test
2. Coverage report: > 80% for unit
3. No test warnings or errors
4. Tests run in CI environment
5. Tests are deterministic (no flakiness)

CROSS-REFERENCES:
- Test best practices: docs/development/testing-guide.md

PREREQUISITES TO CHECK:
- [ ] Test framework configured
- [ ] MSW setup complete
- [ ] Mock data available

NOTES AREA (fill on completion):
- Date completed: ___
- Tests written: ___
- Unit tests: ___
- Integration tests: ___
- E2E tests: ___
- Coverage: ___%
- Flaky tests: ___
- Issues encountered: ___
```

---

## Prompt Customization Guide

### Required Customizations

Every prompt must have these fields filled:

| Field | Description | Example |
|-------|-------------|---------|
| `[ROLE]` | User role for the feature | `Manager` |
| `[Screen path]` | File path for the screen | `apps/web/src/pages/manager/members.tsx` |
| `[Feature name]` | Name of the feature | `Member enrollment wizard` |
| `[Platform]` | iOS, Android, or Both | `Both` |

### Optional Additions

Add these when relevant:

- **Performance targets**: "Booking must complete in < 5 seconds"
- **Offline requirements**: "Must work without connectivity"
- **Security notes**: "All inputs must be sanitized"
- **Compliance notes**: "Must log audit event on mutation"
- **Dependencies**: "Requires Phase 4.6 (booking system) to be complete"
- **Mock data**: "Use these test records..."

### Cross-Reference Priority

When referencing previous work, always check in this order:

1. **Phase files** in this directory — most detailed guidance
2. **DESIGN.MD** — visual and interaction specifications
3. **Permission matrix** — role-based access rules
4. **Feature lists** — functional requirements
5. **Research files** — technical best practices

### Agent Completion Checklist

Before marking an item complete, verify:

```
[ ] All files created/modified as specified
[ ] TypeScript compiles without errors
[ ] Lint passes
[ ] Tests pass (if test prompt)
[ ] Verification steps completed
[ ] Notes area filled
[ ] No console errors
[ ] French text renders correctly
[ ] Responsive breakpoints verified (web)
[ ] Touch targets adequate (mobile)
[ ] Accessibility verified
[ ] Dark mode works
```

---

## Quick Reference: Which Prompt to Use

| Work Type | Prompt Template | Example |
|-----------|----------------|---------|
| Web screen/dashboard | #1 Webapp Component | Admin dashboard, Manager reports |
| Mobile screen | #2 Mobile Screen | Client booking, Employee check-in |
| API endpoint/business logic | #3 Backend API | Booking engine, billing logic |
| New database table | #4 Database Migration | Add challenges table for gamification |
| Auth flow/permission fix | #5 Auth/RLS | Fix RLS for new table |
| Shared UI component | #6 UI Component | New Badge variant, Chart component |
| Test writing | #7 Testing | E2E booking flow, RLS policy tests |

---

*These prompt templates are living documents. Update them as the project evolves and new patterns emerge. The quality of the prompt directly determines the quality of the agent's output — invest time in crafting detailed, specific prompts.*

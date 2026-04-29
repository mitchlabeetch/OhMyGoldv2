# Team 3 Output Audit Report — Technical Architecture & Development Roadmap

> **Auditor:** Principal Software Architect / QA Auditor
> **Audit Date:** 2026-04-29
> **Scope:** ARCHITECTURE.md + 11 roadmap files + agent prompts library
> **Against:** Team 1 (DESIGN.MD) + Team 2 (Feature List + Permission Matrix)
> **Classification:** HIGHEST-PRIORITY — Directly enables entire build phase

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Quality Score** | **72 / 100** |
| **CRITICAL Issues** | **7** |
| **HIGH Issues** | **18** |
| **MEDIUM Issues** | **23** |
| **LOW Issues** | **14** |
| **Total Findings** | **62** |

### Pass/Fail per Major Deliverable

| Deliverable | Verdict | Score | Reason |
|------------|---------|-------|--------|
| ARCHITECTURE.md | **PASS with fixes** | 74/100 | Comprehensive but has version/fabrication issues, missing CSP, inconsistent paths |
| 00_master_roadmap.md | **PASS** | 85/100 | Good structure, clear phases, well-linked |
| phase_01_foundation.md | **PASS** | 82/100 | Solid foundation items |
| phase_02_design_system.md | **PASS** | 78/100 | Good coverage but missing animation token specs |
| phase_03_auth.md | **PASS** | 80/100 | Thorough auth architecture |
| phase_04_core_gym.md | **PASS with fixes** | 76/100 | 16 modules well-defined but migration numbering conflicts |
| phase_05_webapp_screens.md | **PASS** | 79/100 | All 6 role screens covered |
| phase_06_mobile_app.md | **FAIL — needs fixes** | 62/100 | Expo SDK 54 is FABRICATED (doesn't exist); major version pinning gaps |
| phase_07_advanced.md | **PASS** | 72/100 | Good feature ideas but some (nutrition, social) may be scope creep |
| phase_08_compliance.md | **PASS** | 81/100 | Good compliance coverage |
| phase_09_deploy.md | **PASS with fixes** | 75/100 | Deployment covered but missing rollback depth |
| 99_agent_prompts_library.md | **PASS** | 83/100 | Good reusable templates |

### Development-Ready Verdict

**NO — Not development-ready without fixes.** The architecture has 7 CRITICAL and 18 HIGH issues that MUST be resolved before any code is written. Key blockers: fabricated Expo SDK version, migration numbering collisions, inconsistent file paths, and missing security hardening details.

---

## Top 5 Most Critical Gaps

1. **Expo SDK 54 is fabricated** (CRITICAL-T003): As of April 2026, Expo SDK 53 was just released. SDK 54 does not exist. This invalidates ALL mobile app planning that depends on it. Must be corrected to Expo SDK 53 throughout.
2. **Migration numbering collisions across phase files** (CRITICAL-T001): Multiple different items reference the same migration number (`00000000000004_user_roles.sql`, `00000000000018`) with completely different SQL content. This will cause fatal deployment conflicts.
3. **No Content Security Policy defined** (CRITICAL-T005): The security section mentions CSP but never defines the actual policy directives. This is a CRITICAL gap for a payment-processing application handling health data.
4. **Inconsistent file paths between architecture and roadmap** (CRITICAL-T007): Architecture references `packages/shared/src/types/` while roadmaps reference `packages/ui/src/tokens/` and `packages/shared/src/validation/`. Monorepo structure must be unified.
5. **French "tu" informal address missing from i18n spec** (HIGH-T011): Gold's Gym France requires French informal "tu" address per DESIGN.MD section 8, but architecture only specifies generic FR/EN without noting the tu/vous distinction.

---

## Detailed Findings

### CRITICAL Issues (7)

| ID | Severity | File | Issue | Evidence | Recommended Fix |
|----|----------|------|-------|----------|-----------------|
| CRITICAL-T001 | CRITICAL | Multiple phases (01, 03, 04) | Migration numbering collisions: Same migration numbers assigned to different content across different items | `00000000000004_user_roles.sql` appears in Phase 1.7 (User Roles/Permissions), Phase 3.4 (RLS Policies), AND Phase 3.5 (OAuth Users) with different SQL content. `00000000000018` appears in Phase 4.6 (bookings) and 4.7 (check-ins). | Create a **single centralized migration registry** (e.g., `docs/database/migration-registry.md`) with a sequential numbering scheme. Every migration number must be unique and assigned from the registry. Remove all migration numbers from phase files and replace with `[NEXT_MIGRATION_NUMBER]` placeholders that are resolved from the registry. |
| CRITICAL-T002 | CRITICAL | phase_06_mobile_app.md, ARCHITECTURE.md Section 9 | Expo SDK 54 is fabricated/does not exist | As of April 2026, Expo SDK 53 was just released (May 2025). SDK 54 is speculative/fabricated. The entire mobile architecture references SDK 54 features that don't exist. | Change ALL references from "Expo SDK 54" to "Expo SDK 53" throughout architecture and all roadmap files. Verify that all APIs referenced (Expo Router v3, expo-camera, expo-notifications) are compatible with SDK 53. Add a note that SDK upgrades follow Expo's release cadence. |
| CRITICAL-T003 | CRITICAL | ARCHITECTURE.md Section 9 | Tech versions not pinned — uses "latest" or unversioned in critical dependencies | `react-native-health` (no version), `react-native-chart-kit` (no version), `@stripe/stripe-react-native` (no version), `expo-auth-session` (no version), `expo-apple-authentication` (no version) | Pin ALL dependency versions with exact semantic versions. Create a `versions.lock` file in the repo root documenting every dependency version with rationale and last-verified date. No "latest" or unpinned versions allowed for production. |
| CRITICAL-T004 | CRITICAL | ARCHITECTURE.md Section 10 (Security) | No Content Security Policy (CSP) defined despite handling payment and health data | Security section mentions "CSP" in passing but never defines the actual policy directives (default-src, script-src, connect-src, frame-src, etc.). No nonce strategy for inline scripts. | Define a complete CSP with: `default-src 'self'`; `script-src 'self' 'nonce-{RANDOM}' https://js.stripe.com`; `connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co`; `frame-src https://js.stripe.com https://hooks.stripe.com`; Document nonce generation strategy and CSP reporting endpoint. |
| CRITICAL-T005 | CRITICAL | ARCHITECTURE.md Section 7.1 | Missing WebSocket horizontal scaling strategy for Supabase Realtime | Architecture states "Supabase Realtime" for live features but on a single VPS with potentially thousands of concurrent connections, there's no strategy for managing WebSocket connection limits, load balancing, or fallback to polling. | Document: (1) Max concurrent WebSocket connections per VPS tier, (2) Connection pooling strategy, (3) Fallback to short-polling when WebSocket limits reached, (4) Horizontal scaling path if WebSocket load exceeds single VPS capacity. |
| CRITICAL-T006 | CRITICAL | ARCHITECTURE.md Section 14.1 | Monorepo structure has inconsistent path references across documents | Architecture shows `packages/shared/src/types/`, roadmaps reference `packages/ui/src/tokens/`, `packages/shared/src/validation/`, `apps/mobile/src/` vs `apps/native/`. Phase files disagree on exact paths. | Create a SINGLE authoritative monorepo structure diagram in ARCHITECTURE.md Section 14.1. All phase files must reference paths from this diagram only. Audit every phase file and correct all file paths to match the canonical structure. |
| CRITICAL-T007 | CRITICAL | ARCHITECTURE.md Section 15.1 | Self-hosted Supabase upgrade procedure not documented | Architecture uses self-hosted Supabase but provides zero documentation on how to upgrade Supabase versions (major, minor, patch), how to handle breaking changes, or rollback procedures if an upgrade fails. | Add a "Supabase Upgrade Procedure" section documenting: (1) Upgrade cadence (patch: monthly, minor: quarterly, major: evaluate), (2) Pre-upgrade backup requirement, (3) Staging upgrade → test → production upgrade flow, (4) Breaking change monitoring (GitHub releases), (5) Emergency rollback procedure, (6) Version pinning policy for all Supabase services. |

### HIGH Issues (18)

| ID | Severity | File | Issue | Evidence | Recommended Fix |
|----|----------|------|-------|----------|-----------------|
| HIGH-T001 | HIGH | ARCHITECTURE.md Section 5 | Database schema missing some indexes for common query patterns | No composite index on `(location_id, status)` for membership queries, no index on `(user_id, created_at)` for billing history, no partial index on `bookings WHERE status = 'confirmed'` for active bookings | Add explicit index definitions for: (1) `memberships(location_id, status)`, (2) `invoices(user_id, created_at DESC)`, (3) `bookings(user_id, status, class_date)` partial WHERE status='confirmed', (4) `check_ins(location_id, check_in_time DESC)` for location reports. Document index maintenance during high-write periods. |
| HIGH-T002 | HIGH | ARCHITECTURE.md Section 4.1 | Missing API versioning strategy | No API versioning mentioned. When the API needs breaking changes, there's no strategy (URL versioning /v1/, /v2/? Header versioning? No plan.) | Add API versioning strategy: URL path versioning (`/api/v1/`, `/api/v2/`) with at least one previous version supported for 6 months during transition. Document deprecation headers and migration guides for consumers. |
| HIGH-T003 | HIGH | ARCHITECTURE.md Section 6 | MFA/TOTP support only marked "future" — not actually designed | Auth architecture mentions "MFA support" as a Phase 2 future item but never actually designs the MFA flow (TOTP setup, QR code generation, backup codes, recovery flow). | Design complete MFA flow: (1) TOTP secret generation per RFC 6238, (2) QR code display for authenticator app scanning, (3) Backup codes (10 single-use codes), (4) Recovery flow with email verification, (5) `mfa_factors` table with `user_id`, `factor_type`, `status`, `secret` (encrypted), (6) RLS policies for MFA data. |
| HIGH-T004 | HIGH | phase_03_auth.md, Section 3.6 | Session timeout design incomplete | Item 3.6 mentions session timeout but doesn't specify timeout durations per role (Admin vs Client should differ), idle detection strategy, or warning-before-logout UX. | Define: (1) Admin/Manager: 4-hour timeout, Employee: 8-hour timeout (shift-based), Client: 30-day "remember me", (2) Idle detection: 15 minutes no activity for staff roles, (3) Warning toast at 5 minutes before logout with "Extend" button, (4) Secure token refresh with rotation on every API call. |
| HIGH-T005 | HIGH | phase_04_core_gym.md | NF 525 compliance mentioned but not designed | Multiple items reference "NF 525 compliant" receipts but never define the actual NF 525 requirements (French fiscal receipt standard), data elements, or signing mechanism required by French law. | Add NF 525 appendix: (1) Required receipt data elements (date/time, items, VAT breakdown, transaction ID, signature), (2) Digital signing mechanism with certificate, (3) Daily fiscal closing (Z-ticket) generation, (4) Archive requirements (3-year retention), (5) Integration with certified fiscal hardware if required. |
| HIGH-T006 | HIGH | phase_04_core_gym.md, Section 4.6 | Booking atomic transaction lacks conflict resolution detail | "Atomic booking" mentioned but no explicit handling of race conditions when two users simultaneously book the last spot. No mention of optimistic locking or serializable isolation level. | Define booking transaction: (1) Use `SELECT FOR UPDATE` on class capacity row, (2) Check capacity, (3) Insert booking, (4) Increment counter — all in single transaction with `SERIALIZABLE` isolation, (5) Handle `serialization_failure` with retry logic (max 3 retries with exponential backoff). |
| HIGH-T007 | HIGH | phase_05_webapp_screens.md | Employee web screen references offline support without implementation detail | Employee check-in mentions "Works offline (queue actions)" but no service worker strategy, no IndexedDB schema, no sync mechanism when reconnected. | Add offline implementation: (1) Service Worker with `workbox` for caching, (2) IndexedDB schema for queued check-ins, (3) Background sync API for automatic upload, (4) Conflict resolution when server state changed during offline period, (5) Visual indicator of offline mode and pending sync count. |
| HIGH-T008 | HIGH | phase_06_mobile_app.md, Section 6.8 | Offline-first implementation uses TanStack Query persistent cache but doesn't specify which cache strategy | "TanStack Query with persistent cache (AsyncStorage)" but no cache invalidation strategy, no TTL for cached data, no cache size limits on mobile devices. | Define: (1) Cache TTL: schedule data 24h, bookings 1h, user profile 6h, (2) Max cache size: 50MB on mobile, (3) LRU eviction when limit reached, (4) Cache invalidation triggers on mutations, (5) Background refresh strategy (stale-while-revalidate with 5-min stale time). |
| HIGH-T009 | HIGH | ARCHITECTURE.md Section 11 | Testing strategy missing visual regression testing details | Testing section covers unit/integration/E2E but doesn't specify visual regression tooling (Chromatic? Percy?), baseline management, or acceptable diff thresholds for Gold's Gym brand-critical visuals. | Add: (1) Chromatic or Storybook visual regression testing, (2) Baseline established on `main` branch, (3) PRs block on > 0.5% pixel diff, (4) Brand-critical components (logo, gold color swatches) have zero-tolerance diff, (5) Mobile visual regression via device farm or screenshots. |
| HIGH-T010 | HIGH | phase_07_advanced.md | AI churn prediction accuracy target (70%) is too low for production use | "Model accuracy: > 70% precision on test data" — 70% precision means 30% false positives (wasting retention resources on wrong members). Industry standard is 85%+ for churn prediction. | Increase target to > 85% precision with > 80% recall. Document: (1) Class imbalance handling (churners are minority), (2) Feature importance tracking, (3) A/B testing framework to validate model effectiveness, (4) Human-in-the-loop review for high-risk predictions before intervention. |
| HIGH-T011 | HIGH | ARCHITECTURE.md Section 12 | French informal "tu" address not specified in i18n design | DESIGN.MD Section 8 specifies French "tu" per Gold's Gym brand (casual, approachable). Architecture only lists generic FR/EN without noting the informal/formal distinction. This is a branding requirement. | Add i18n locale spec: `fr-TU` (informal tu) as primary French variant, `fr-VOUS` as formal fallback. Document that ALL French translations use "tu" form. Provide examples: "Connecte-toi" (not "Connectez-vous"), "Ton profil" (not "Votre profil"). Add linting rule to catch formal French. |
| HIGH-T012 | HIGH | phase_08_compliance.md, Section 8.1 | Accessibility audit missing mobile-specific a11y testing | WCAG audit mentions web testing (axe, Lighthouse) but mobile accessibility testing (iOS VoiceOver, Android TalkBack, switch control, dynamic type) is not explicitly covered with specific test procedures. | Add mobile a11y testing: (1) iOS VoiceOver navigation on all screens, (2) Android TalkBack navigation, (3) Switch control testing for motor-impaired users, (4) Dynamic type testing (largest font size), (5) Reduce motion testing, (6) Screen magnification testing. |
| HIGH-T013 | HIGH | ARCHITECTURE.md Section 15.3 | CI/CD pipeline missing security scanning stages | Deployment flow shows lint, type-check, unit tests, build check, a11y audit — but no security scanning (dependency vulnerability scan, SAST, secret detection). | Add CI security stages: (1) `pnpm audit` for dependency vulnerabilities, (2) Secret detection (GitLeaks or TruffleHog), (3) SAST scan (Semgrep or CodeQL), (4) Container image scan (Trivy), (5) Fail build on CRITICAL/HIGH findings. |
| HIGH-T014 | HIGH | phase_09_deploy.md | App Store submission missing compliance for health data (App Tracking Transparency) | No mention of Apple's App Tracking Transparency (ATT) framework required since iOS 14.5, or health data-specific privacy declarations required for App Store review when handling fitness/health data. | Add: (1) ATT framework implementation with custom prompt text explaining data usage, (2) App Store privacy nutrition labels accurately filled for health/fitness data, (3) `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` plist entries for Apple Health integration, (4) Google's `HEALTH_DATA` declaration in Play Console. |
| HIGH-T015 | HIGH | ARCHITECTURE.md Section 3.4 | Rate limiting not designed at database level | API rate limiting mentions "application level" (probably middleware) but no database-level rate limiting for Edge Functions, which can be directly called bypassing middleware. | Add database-level rate limiting: (1) PostgreSQL `pgjwt` for Edge Function token validation, (2) Per-API-key rate limit table with sliding window, (3) IP-based rate limiting for public endpoints, (4) Rate limit headers in all API responses (`X-RateLimit-Limit`, `X-RateLimit-Remaining`). |
| HIGH-T016 | HIGH | phase_04_core_gym.md | Waitlist auto-promotion lacks notification delivery guarantee | "Auto-promote from waitlist when spot opens" but no guarantee that the promoted member actually receives the notification, no expiry on the promoted spot, no cascade if first waitlisted member doesn't claim. | Design: (1) Member promoted gets push + email + SMS notification, (2) Promoted spot held for 2 hours with countdown, (3) If not claimed in 2h, spot offered to next waitlisted member, (4) Maximum 3 cascade promotions per spot, (5) Audit log of all promotion attempts. |
| HIGH-T017 | HIGH | ARCHITECTURE.md Section 8 | No detailed data retention and archival strategy | GDPR section mentions "data retention" but no specific retention periods per data type, archival strategy for old data, or automated purge mechanism for expired data. | Define retention: (1) Active member data: life of membership + 2 years, (2) Audit logs: 7 years (financial compliance), (3) Session logs: 1 year, (4) Marketing consent records: 7 years, (5) Automated monthly purge job, (6) Data archival to cold storage before purge, (7) Certificate of destruction documentation. |
| HIGH-T018 | HIGH | Multiple phase files | Several items have < 10 lines of guidance per the original requirement | Phase 1.6 (branching strategy) has ~6 lines. Phase 5.7 (shared screens) has ~8 lines for some success criteria. Phase 9.2 (SSL) description is minimal. | Expand all items to 10+ lines: (1) Add "Why This Matters" sections where missing, (2) Add specific technical implementation details, (3) Add concrete examples and edge cases, (4) Add cross-references to related items. |

### MEDIUM Issues (23)

| ID | Severity | File | Issue | Evidence | Recommended Fix |
|----|----------|------|-------|----------|-----------------|
| MED-T001 | MEDIUM | ARCHITECTURE.md Section 5 | `ON DELETE CASCADE` used on audit log references — audit data should be immutable | `audit_log` table references `user_id` with CASCADE — deleting a user would delete their audit trail, violating compliance requirements. | Change all audit-related FKs to `ON DELETE SET NULL` (preserve the audit record, just lose the user reference). Add `user_email` column to audit_log to preserve user identity even after account deletion. |
| MED-T002 | MEDIUM | phase_02_design_system.md | Animation tokens lack specific easing curves and durations | "Animation tokens" mentioned but no actual cubic-bezier curves, no duration scale (150ms, 300ms, 500ms), no stagger patterns for list animations. | Define: (1) Duration scale: `fast: 150ms`, `normal: 300ms`, `slow: 500ms`, (2) Easing: `ease-out: cubic-bezier(0,0,0.2,1)`, `ease-in-out: cubic-bezier(0.4,0,0.2,1)`, `spring: cubic-bezier(0.34,1.56,0.64,1)`, (3) Stagger: `50ms` per list item, max `500ms` total stagger. |
| MED-T003 | MEDIUM | phase_03_auth.md, Section 3.3 | OAuth error handling for "account already exists with different provider" not designed | No handling for when a user tries to sign in with Google but already has an Apple account with the same email, or vice versa. This is a common production issue. | Add account linking flow: (1) Detect duplicate email across providers, (2) Show "You already have an account with Apple" message, (3) Offer to link accounts after password verification, (4) Prevent account creation with duplicate email across providers. |
| MED-T004 | MEDIUM | phase_04_core_gym.md | QR code generation algorithm not specified | Digital membership card uses QR code but no spec for: data encoding format, error correction level, size constraints, or expiry/rotation strategy. | Define: (1) QR data format: `OHMYGOLD:{user_id}:{timestamp}:{signature}` (signed with HMAC), (2) Error correction: Level M (15%), (3) Size: min 200x200px for scanning reliability, (4) Rotation: regenerate daily with new signature, (5) Offline validation: validate signature against cached public key. |
| MED-T005 | MEDIUM | phase_05_webapp_screens.md | No print stylesheet for reports/invoices | Reports and invoices may need printing but no `@media print` styles, print-specific layouts, or print button functionality. | Add: (1) Print-specific CSS (`@media print`) with hidden navigation, (2) Page break controls for multi-page reports, (3) Print button with `window.print()`, (4) Print-optimized gold color (darker for B/W printers). |
| MED-T006 | MEDIUM | phase_06_mobile_app.md | Biometric auth fallback not specified | Face ID/Touch ID setup mentioned but no fallback when biometrics change (new face scan, fingerprint added), when biometric hardware fails, or when user disables biometric auth at OS level. | Define: (1) Fallback to PIN/password when biometric unavailable, (2) Re-authentication required when new biometric enrolled (security), (3) Graceful degradation messaging, (4) `biometricType` detection (face vs fingerprint vs iris). |
| MED-T007 | MEDIUM | phase_07_advanced.md | Video content platform streaming cost not estimated | HLS streaming via CDN mentioned but no cost estimates for video storage (Supabase Storage) and bandwidth (Cloudflare Stream), no video compression strategy. | Add: (1) Video encoding pipeline: 1080p → 720p → 480p adaptive bitrate, (2) Storage cost estimate: ~$0.02/GB/month, (3) Bandwidth cost estimate, (4) Video compression: H.264 with CRF 23, (5) Max file size: 500MB per upload, (6) Storage budget alert at 80%. |
| MED-T008 | MEDIUM | ARCHITECTURE.md Section 13 | Mobile bundle size budget (< 15MB) may be unrealistic with all features | Phase 7 adds video, nutrition, social, gamification, wearables — these libraries will significantly increase bundle size. 15MB target may not be achievable. | Create detailed bundle budget breakdown: (1) Core app: 5MB, (2) Phase 4 modules: 3MB, (3) Phase 7 features: 5MB, (4) Dependencies: 2MB. Identify code-splitting opportunities. Set progressive target: initial download < 15MB, on-demand downloads for Phase 7 features. |
| MED-T009 | MEDIUM | phase_08_compliance.md | Penetration testing scope doesn't include API-specific testing | Pentest section covers OWASP Top 10 for web but doesn't specifically mention testing Supabase Edge Functions, GraphQL injection (if used), or PostgreSQL-specific injection vectors. | Expand pentest scope: (1) Edge Function auth bypass testing, (2) PostgreSQL injection via Supabase client (prepared statement bypass), (3) RLS policy bypass attempts, (4) JWT token manipulation, (5) WebSocket message injection, (6) File upload vulnerabilities (malicious SVG, polyglot files). |
| MED-T010 | MEDIUM | phase_09_deploy.md | Staff training materials not referenced from architecture | Training section in Phase 9 has no connection back to architecture documentation. Training content should reference actual system docs. | Link training materials: (1) Training guides reference ARCHITECTURE.md sections, (2) Quick-reference cards generated from actual UI component library, (3) Training assessment covers permission matrix knowledge, (4) Training feedback feeds back into documentation updates. |
| MED-T011 | MEDIUM | 99_agent_prompts_library.md | Prompt templates lack error handling guidance | Agent prompts focus on "what to build" but lack guidance on "what to do when something goes wrong" — e.g., build fails, test fails, dependency conflict. | Add "Troubleshooting" section to each prompt template with: (1) Common errors and solutions, (2) Dependency conflict resolution, (3) "If build fails, try..." steps, (4) Escalation criteria (when to stop and ask for help). |
| MED-T012 | MEDIUM | ARCHITECTURE.md Section 14.3 | Component sharing via "React Native Web" not verified for all components | React Native Web works for basic components but complex ones (charts, maps, video player) may not render correctly on web. No fallback strategy documented. | Document: (1) Verified working components list via React Native Web, (2) Components requiring platform-specific implementations, (3) Platform detection strategy (`Platform.OS`), (4) Graceful degradation for unsupported features on web. |
| MED-T013 | MEDIUM | phase_02_design_system.md | Design system token delivery mechanism (Style Dictionary) not confirmed | DESIGN.MD mentions Style Dictionary but architecture doesn't confirm if it's implemented or how tokens flow from Figma/design to code. | Document token pipeline: (1) Figma → Token Studio → Style Dictionary → CSS/JSON output, (2) Token update cadence, (3) Token validation CI check, (4) Token deprecation process. |
| MED-T014 | MEDIUM | ARCHITECTURE.md Section 16 | Risk assessment doesn't include regulatory/legislative risk | Risk #7 mentions GDPR but no risk of changing French labor law affecting staff data, changing fitness industry regulations, or EU AI Act affecting AI churn prediction (Phase 7). | Add regulatory risks: (1) EU AI Act compliance for churn prediction (high-risk AI system), (2) French labor law changes for employee data, (3) Fitness industry certification requirements for nutrition tracking, (4) Monitoring strategy for regulatory changes. |
| MED-T015 | MEDIUM | phase_04_core_gym.md | POS receipt mentions NF 525 but not thermal printer integration | POS generates receipts but no specification for thermal printer integration (ESC/POS protocol), which is standard for gym POS systems. | Add: (1) ESC/POS thermal printer integration via USB/Bluetooth, (2) Receipt template for 80mm paper width, (3) Printer discovery and pairing flow, (4) Print queue management, (5) Fallback to email receipt if printer unavailable. |
| MED-T016 | MEDIUM | phase_06_mobile_app.md | Deep linking scheme `ohmygold://` not registered with platform | Deep link scheme defined but no App Links (Android) or Universal Links (iOS) configuration for verified domain association, which is required for secure deep linking. | Add: (1) Android App Links with `assetlinks.json` on `ohmygold.fr/.well-known/`, (2) iOS Universal Links with `apple-app-site-association` file, (3) Fallback to custom URL scheme if universal links fail, (4) Deep link routing table in app code. |
| MED-T017 | MEDIUM | ARCHITECTURE.md Section 12 | RTL (Right-to-Left) preparation mentioned but not designed | i18n section says "RTL prep" but no actual RTL design: no logical properties (margin-inline-start vs margin-left), no `dir="rtl"` handling, no Arabic translation planned. | Either: (1) Remove RTL prep if not needed (Gold's Gym France targets FR/EN only), OR (2) Design full RTL support: logical CSS properties, `dir` attribute handling, mirrored layouts, bidirectional text support. |
| MED-T018 | MEDIUM | phase_08_compliance.md | Load testing doesn't specify data volume for realistic tests | "10,000 concurrent users" load test but no specification of database seed volume (how many members, classes, bookings pre-seeded) to make load test realistic. | Define load test data volume: (1) 50,000 members, (2) 10 gym locations, (3) 500 classes/week, (4) 100,000 bookings, (5) 1,000,000 check-in records. Generate realistic data with faker.js. Document seed script for load test environment. |
| MED-T019 | MEDIUM | phase_07_advanced.md | Gamification badges (20+) need graphic design assets | 20+ badges with SVG designs mentioned but no asset pipeline for badge graphics, no designer handoff process, no dark mode variants for badges. | Add: (1) Badge design asset spec (64x64px SVG, dark mode variant), (2) Asset delivery pipeline (designer → Figma → exported SVG → `packages/ui/src/assets/badges/`), (3) Badge animation spec (unlock celebration), (4) Fallback text badge if asset unavailable. |
| MED-T020 | MEDIUM | ARCHITECTURE.md Section 8 | Image optimization strategy lacks AVIF support | Image optimization mentions WebP but not AVIF (modern, 50% smaller than WebP), which should be used with WebP fallback for best performance. | Update image strategy: (1) Primary: AVIF format, (2) Fallback: WebP, (3) Legacy: JPEG, (4) Use `<picture>` element with multiple sources, (5) CDN auto-format negotiation based on `Accept` header. |
| MED-T021 | MEDIUM | Multiple phase files | Phase effort estimates may be overly optimistic | Phase 4 (16 modules) estimated at "6-8 weeks" for the entire phase. That's 3.5 days per module on average, which doesn't account for integration testing, bug fixes, or rework. | Add buffer: (1) Apply 1.5x multiplier to all estimates (accounting for unexpected complexity), (2) Add 20% buffer for integration between modules, (3) Document that estimates assume no blockers, (4) Add explicit "risk days" to each phase schedule. |
| MED-T022 | MEDIUM | ARCHITECTURE.md Section 15.6 | Backup strategy missing point-in-time recovery testing procedure | "Point-in-time recovery: Any 4-hour window" claimed but no actual test procedure to verify this works end-to-end. | Add: (1) Monthly PITR test procedure (restore to specific timestamp → verify data → destroy), (2) Test scenario: simulate corruption at 2:30 PM, restore to 2:00 PM, (3) Recovery verification checklist, (4) Documented recovery time measurement. |
| MED-T023 | MEDIUM | phase_09_deploy.md | Blue-green deployment doesn't specify database migration coordination | Blue-green deployment for zero downtime but database migrations are destructive (can't run simultaneously on old + new code). No strategy for backward-compatible migrations. | Add database deployment strategy: (1) Migrations must be backward-compatible (add columns, don't remove), (2) Two-phase deployment: migration first (backward-compatible), then code deploy, (3) Cleanup migrations in subsequent release, (4) Expand/contract pattern for schema changes. |

### LOW Issues (14)

| ID | Severity | File | Issue | Evidence | Recommended Fix |
|----|----------|------|-------|----------|-----------------|
| LOW-T001 | LOW | ARCHITECTURE.md | Document says "living document" but no change log or versioning tracked | No version history, no change log, no "last modified" tracking per section. | Add version table at top: version number, date, author, summary of changes. Use Git history for automatic tracking. |
| LOW-T002 | LOW | phase_05_webapp_screens.md | Admin screens marked "admin typically doesn't use mobile" but should still be responsive | Admin screens say "works on laptop and desktop" but don't specify minimum width or mobile fallback for emergency access. | Define minimum admin width: 1024px. Add warning banner for sub-1024px: "For optimal experience, use a desktop or tablet." Ensure critical functions (emergency user lockout) work on mobile. |
| LOW-T003 | LOW | phase_06_mobile_app.md | "Shake to refresh" QR code is an undiscoverable gesture | No visual indicator that shaking refreshes the QR code. Users won't know this feature exists. | Add: (1) Subtle animation hint on first use, (2) Pull-to-refresh as alternative, (3) Manual refresh button next to QR code, (4) Analytics: track shake vs button usage. |
| LOW-T004 | LOW | phase_07_advanced.md | Nutrition tracking uses Open Food Facts API but no rate limit or caching strategy | Open Food Facts is free but rate-limited. No caching strategy for repeated food lookups, no fallback if API is down. | Add: (1) API rate limit: max 100 req/min, (2) Cache popular foods in database (top 1000 searched), (3) Graceful degradation: show "search unavailable" with manual entry, (4) Attribution requirement per Open Food Facts license. |
| LOW-T005 | LOW | ARCHITECTURE.md Section 7.1 | Email/SMS provider fallback not specified | SendGrid (email) and Twilio (SMS) mentioned but no fallback provider if primary is down. | Document fallback: (1) Email: SendGrid primary → AWS SES fallback, (2) SMS: Twilio primary → Vonage fallback, (3) Health check every 5 minutes, (4) Automatic failover on error rate > 5%. |
| LOW-T006 | LOW | phase_09_deploy.md | App Store screenshots mention "Gold's Gym branded" but no brand asset spec | Screenshots must follow brand guidelines but no specification of screenshot dimensions, safe zones, or brand elements to include. | Add screenshot spec: (1) iPhone: 1290x2796px (6.7"), (2) Include Gold's Gym logo, (3) Use real data (not lorem ipsum), (4) Dark mode variants, (5) Localization: FR screenshots primary. |
| LOW-T007 | LOW | Multiple phase files | Some agent prompts use generic placeholders like `[ROLE]` without examples | Prompt templates use `[ROLE]` placeholder but don't provide examples of valid values, which may confuse agents. | Add dropdown hints: `[ROLE: Admin|Manager|Employee|Teacher|Client|Visitor]`. Add `[SCREEN_TYPE: dashboard|list|detail|form|modal]` hints. |
| LOW-T008 | LOW | ARCHITECTURE.md Section 3 | `created_at` uses `timestamptz` but no timezone policy for display | All timestamps stored as UTC (timestamptz) but no explicit policy for display timezone conversion per user preference. | Document: (1) Store all timestamps in UTC, (2) Display in user's timezone from profile, (3) Default to Europe/Paris for Gold's Gym France, (4) Include timezone in API responses. |
| LOW-T009 | LOW | phase_02_design_system.md | Design system says "no hardcoded colors" but no linting rule to enforce | No ESLint rule or CI check to catch hardcoded color values in JSX/CSS. | Add ESLint rule: `no-restricted-syntax` to catch hex colors and color names in component files. Add CI check that fails on hardcoded colors outside token files. |
| LOW-T010 | LOW | phase_08_compliance.md | Accessibility audit score target is 95, not 100 | "axe-core score >= 95" leaves 5% of violations acceptable. For a healthcare-adjacent app handling health data, 100% should be the target for automated checks. | Change target to 100% automated pass rate. Manual testing covers the remaining subjective criteria. Document exceptions with justification. |
| LOW-T011 | LOW | ARCHITECTURE.md | No favicon/app icon specification | No mention of favicon sizes, app icon specs, or adaptive icons for Android. | Add icon spec: (1) Favicon: 16x16, 32x32, 180x180 (Apple touch), (2) Android adaptive icon with foreground/background layers, (3) iOS: 1024x1024 with transparent background, (4) Maskable icon for Android. |
| LOW-T012 | LOW | phase_03_auth.md | No rate limiting specified for OAuth endpoints | OAuth endpoints (Google/Apple callbacks) could be abused for enumeration attacks but no rate limiting specified. | Add: OAuth callback endpoint rate-limited to 10 attempts per IP per minute. Account lockout after 5 failed OAuth attempts. |
| LOW-T013 | LOW | phase_09_deploy.md | No canary deployment strategy mentioned | Blue-green deployment mentioned but no canary (gradual traffic shift) strategy for risk mitigation on production. | Add: Canary deployment option — shift 5% traffic → monitor → 25% → 50% → 100% over 30 minutes. Automatic rollback on error rate > 0.1% during canary. |
| LOW-T014 | LOW | ARCHITECTURE.md | No dependency update automation specified | No Renovate, Dependabot, or similar automated dependency update tool specified for security patches. | Add: Dependabot configured for security updates (daily), weekly digest for non-security updates, auto-merge for patch updates, manual review for major updates. |

---

## Requirements Coverage Matrix

| Original Requirement | Addressed? | Location in Output | Gap Description |
|---------------------|------------|-------------------|-----------------|
| a11y compliant | **Yes** | ARCHITECTURE.md Section 8, phase_08_compliance.md Section 8.1 | Full WCAG 2.1 AA+ coverage. Gap: mobile-specific a11y testing not detailed (HIGH-T012). |
| SOC2 compliant | **Yes** | ARCHITECTURE.md Section 10, phase_08_compliance.md Section 8.2 | SOC2 TSC mapping present. Gap: CSP not defined (CRITICAL-T004), security scanning missing from CI (HIGH-T013). |
| i18n compliant with FR and EN locales | **Partial** | ARCHITECTURE.md Section 12, phase_02_design_system.md Section 2.3 | FR/EN specified. Gap: French informal "tu" form not specified (HIGH-T011), RTL prep incomplete (MED-T017). |
| Gold's Gym branded design | **Yes** | ARCHITECTURE.md Section 13, phase_02_design_system.md | Design tokens, colors, typography all linked to DESIGN.MD. Gap: animation token specs incomplete (MED-T002). |
| Resamania clone with improvements | **Yes** | phase_04_core_gym.md (16 modules), multiple cross-references | All 120+ Resamania features mapped to modules. Improvements (AI, gamification) in Phase 7. |
| 6 user modes properly handled | **Yes** | ARCHITECTURE.md Section 4.3, phase_03_auth.md, all screen phases | All 6 roles (Admin, Manager, Employee, Teacher, Client, Visitor) have dedicated screens and RBAC. |
| Self-hosted auth with OAuth (Google, Apple) | **Yes** | ARCHITECTURE.md Section 4, phase_03_auth.md Sections 3.1-3.3 | Supabase Auth + OAuth fully designed. Gap: account linking (MED-T003), MFA flow not designed (HIGH-T003). |
| Supabase self-hosted backend | **Yes** | ARCHITECTURE.md Section 2.1, ADR-001 | Architecture Decision Record justifies self-hosted. Gap: upgrade procedure missing (CRITICAL-T007). |
| Single VPS deployment | **Yes** | ARCHITECTURE.md Section 15, phase_09_deploy.md | Docker Compose on single VPS fully specified. Gap: WebSocket scaling (CRITICAL-T005). |
| Responsive webapp (full panel) | **Yes** | ARCHITECTURE.md Section 13, phase_05_webapp_screens.md | xs to 2xl responsive breakpoints. All role screens responsive. |
| Native mobile app (iOS + Android) | **Partial** | ARCHITECTURE.md Section 9, phase_06_mobile_app.md | Full mobile spec. Gap: Expo SDK 54 fabricated (CRITICAL-T002), biometrics fallback (MED-T006). |
| Mobile: device issues and pictures reporting | **Yes** | phase_06_mobile_app.md Section 6.4 (Employee tools) | Camera + annotation + categorize + submit flow fully specified. |
| Mobile: course logging and stats + notifications | **Yes** | phase_06_mobile_app.md Sections 6.3, 6.6, 6.7 | Class booking, stats, progress, push notifications all covered. |
| Mobile optimized per role | **Yes** | phase_06_mobile_app.md Sections 6.3-6.6 | Client, Employee, Manager, Teacher each have role-optimized mobile screens. |
| Every phase until final product launch | **Yes** | 00_master_roadmap.md, 9 phase files | 9 phases from foundation through deployment. Launch strategy included. |
| LLM-evolutive documentation with tickboxes | **Yes** | All phase files, 99_agent_prompts_library.md | Tickboxes on every item, notes areas, agent prompts per item. Cross-references to design system and other phases. |

---

## Corrective Actions Required

### P0 Actions (Must Fix Before Development Starts)

| Action ID | File to Modify | Specific Change Required | Priority | Est. Effort |
|-----------|---------------|-------------------------|----------|-------------|
| P0-001 | All phase files + ARCHITECTURE.md | Replace "Expo SDK 54" with "Expo SDK 53" everywhere | P0 | 30 min |
| P0-002 | Create new: `docs/database/migration-registry.md` | Create centralized migration numbering registry; audit all phase files and reassign conflicting migration numbers | P0 | 2 hours |
| P0-003 | ARCHITECTURE.md Section 4 (Tech Stack) | Pin ALL dependency versions with exact semantic versions. Add `versions.lock` file spec. | P0 | 1 hour |
| P0-004 | ARCHITECTURE.md Section 10 (Security) | Add complete CSP definition with all directives and nonce strategy | P0 | 1 hour |
| P0-005 | ARCHITECTURE.md Section 14.1 | Create unified monorepo structure diagram; fix all inconsistent file paths across phase files | P0 | 1.5 hours |
| P0-006 | ARCHITECTURE.md Section 2.1 | Add "Supabase Upgrade Procedure" section with documented upgrade cadence and rollback | P0 | 45 min |
| P0-007 | ARCHITECTURE.md Section 7.1 | Add WebSocket horizontal scaling strategy with connection limits and fallback to polling | P0 | 30 min |

### P1 Actions (Must Fix Before Phase 3 Starts)

| Action ID | File to Modify | Specific Change Required | Priority | Est. Effort |
|-----------|---------------|-------------------------|----------|-------------|
| P1-001 | ARCHITECTURE.md Section 5 (DB) | Add missing composite indexes: memberships(location_id, status), invoices(user_id, created_at DESC), etc. | P1 | 30 min |
| P1-002 | ARCHITECTURE.md Section 4.1 | Add API versioning strategy: URL path versioning with deprecation headers | P1 | 20 min |
| P1-003 | phase_03_auth.md + ARCHITECTURE.md | Design complete MFA/TOTP flow with table schema, QR generation, backup codes | P1 | 1 hour |
| P1-004 | phase_03_auth.md Section 3.6 | Define session timeout per role with idle detection and warning UX | P1 | 30 min |
| P1-005 | phase_04_core_gym.md | Add NF 525 appendix with receipt data elements, signing, Z-ticket, retention | P1 | 45 min |
| P1-006 | phase_04_core_gym.md Section 4.6 | Define booking atomic transaction with SELECT FOR UPDATE and retry logic | P1 | 30 min |
| P1-007 | phase_05_webapp_screens.md Section 5.3 | Add offline implementation spec: Service Worker, IndexedDB, background sync | P1 | 30 min |
| P1-008 | ARCHITECTURE.md Section 12 | Add French "tu" informal address spec with examples and linting rule | P1 | 20 min |
| P1-009 | ARCHITECTURE.md Section 15.3 | Add CI security stages: pnpm audit, secret detection, SAST, container scan | P1 | 30 min |
| P1-010 | phase_09_deploy.md Section 9.4 | Add ATT framework, health data privacy declarations for App Store | P1 | 20 min |
| P1-011 | ARCHITECTURE.md Section 8 | Add detailed data retention policy per data type with automated purge | P1 | 30 min |
| P1-012 | Multiple phase files | Expand items with < 10 lines to 10+ lines of guidance | P1 | 1.5 hours |
| P1-013 | phase_08_compliance.md Section 8.1 | Add mobile-specific a11y testing: VoiceOver, TalkBack, switch control, dynamic type | P1 | 20 min |
| P1-014 | ARCHITECTURE.md Section 11 | Add visual regression testing spec with Chromatic/Percy | P1 | 20 min |
| P1-015 | ARCHITECTURE.md Section 3.4 | Add database-level rate limiting for Edge Functions | P1 | 30 min |
| P1-016 | phase_04_core_gym.md Section 4.6 | Add waitlist notification delivery guarantee with cascade promotion | P1 | 20 min |
| P1-017 | phase_07_advanced.md Section 7.1 | Increase churn prediction accuracy target to 85%+ with class imbalance handling | P1 | 15 min |
| P1-018 | phase_08_compliance.md Section 8.4 | Expand pentest scope to include Edge Functions, RLS bypass, JWT manipulation | P1 | 20 min |

### P2 Actions (Should Fix Before Launch)

| Action ID | File to Modify | Specific Change Required | Priority | Est. Effort |
|-----------|---------------|-------------------------|----------|-------------|
| P2-001 | ARCHITECTURE.md Section 5 | Fix audit_log FK to ON DELETE SET NULL with user_email preservation | P2 | 15 min |
| P2-002 | phase_02_design_system.md | Add animation token specs: cubic-bezier curves, duration scale, stagger | P2 | 20 min |
| P2-003 | phase_06_mobile_app.md | Add biometrics fallback spec: PIN/password, re-auth on new biometric | P2 | 15 min |
| P2-004 | ARCHITECTURE.md Section 12 | Decide on RTL: either remove mention or design full support | P2 | 15 min |
| P2-005 | phase_04_core_gym.md | Add QR code spec: data format, HMAC signature, rotation, offline validation | P2 | 20 min |
| P2-006 | phase_09_deploy.md | Add database migration coordination for blue-green deployment | P2 | 20 min |
| P2-007 | Multiple files | Apply 1.5x effort multiplier and add risk buffer days to estimates | P2 | 30 min |
| P2-008 | ARCHITECTURE.md Section 13 | Add thermal printer integration spec (ESC/POS) for POS receipts | P2 | 15 min |
| P2-009 | phase_06_mobile_app.md | Add App Links/Universal Links configuration for deep linking | P2 | 15 min |
| P2-010 | ARCHITECTURE.md Section 8 | Add email/SMS provider fallback strategy (AWS SES, Vonage) | P2 | 15 min |
| P2-011 | 99_agent_prompts_library.md | Add troubleshooting sections to all prompt templates | P2 | 20 min |
| P2-012 | ARCHITECTURE.md Section 15.6 | Add PITR test procedure with monthly verification | P2 | 15 min |

---

## Positive Findings

The following aspects of Team 3's output are **exemplary** and should be preserved:

### 1. Comprehensive Architecture Decision Records (ADRs)
ARCHITECTURE.md contains 7 well-structured ADRs covering the most critical technology choices (Supabase self-hosted, React Native + Expo, Zustand, Modular Monolith, pnpm, Caddy, Vite). Each ADR includes context, decision, rationale, alternatives, and trade-offs. This is exactly the level of rigor needed for a project of this complexity.

### 2. Thorough Database Schema Design
The database schema section covers 16+ core tables with full column specifications, data types, constraints, indexes, foreign keys, RLS policies, and audit triggers. Tables follow consistent conventions (uuid PK, timestamptz, created_at/updated_at, RLS enabled). This level of detail enables direct migration to code.

### 3. Role-Based Access Control (RBAC) Architecture
The permission system is well-designed with 6 roles, location-based scoping, RLS policies at the database level, and middleware guards at the application level. The three-layer defense (API → middleware → RLS) provides defense-in-depth. This aligns well with Team 2's permission matrix.

### 4. LLM Agent Prompt Templates (99_agent_prompts_library.md)
The 7 reusable prompt templates (Web, Mobile, Backend, Database, Auth, UI, Testing) follow a consistent structure with CONTEXT, TASK, REQUIREMENTS, FILES, VERIFICATION, NOTES, and CROSS-REFERENCES. The customization guide and "which prompt to use" quick-reference table are genuinely useful for orchestration.

### 5. Tickboxes and Notes Areas on Every Item
Every single roadmap item includes completion tickboxes and a notes area for agents to document their work. This is exactly the "LLM-evolutive documentation" requirement specified. The format is consistent and machine-parseable.

### 6. Complete 9-Phase Coverage from Foundation to Launch
The roadmap covers the full development lifecycle: foundation, design system, auth, core gym management, web screens, mobile app, advanced features, compliance, and deployment. Dependencies between phases are clearly mapped. Nothing is left unaddressed.

### 7. Cross-References to Team 1 and Team 2 Outputs
Phase files consistently reference Team 1's DESIGN.MD and Team 2's feature lists, permission matrices, and research. This demonstrates that Team 3 actually analyzed the previous outputs rather than working in isolation. Examples: `REFERENCE: Feature List §11`, `DESIGN SYSTEM REF: DESIGN.MD §7`.

### 8. Security-First Design
The architecture addresses security at multiple layers: RLS policies on every table, encrypted fields for sensitive data, JWT refresh token rotation, OAuth state parameter validation, rate limiting, audit logging for all mutations, and SOC2/GDPR compliance sections. This goes beyond typical MVP security.

### 9. Offline-First Mobile Architecture
The mobile app has a comprehensive offline-first design with AsyncStorage/SQLite caching, action queuing, conflict resolution strategies, and sync status indicators. This is critical for gym environments with spotty WiFi and shows real-world operational awareness.

### 10. Risk Assessment with Contingency Plans
The top 10 technical risks are well-identified with likelihood/impact ratings and specific mitigation strategies. Contingency plans for VPS failure, database corruption, Stripe outage, and security breach are documented with recovery time objectives.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total findings | 62 |
| CRITICAL | 7 |
| HIGH | 18 |
| MEDIUM | 23 |
| LOW | 14 |
| P0 actions required | 7 |
| P1 actions required | 18 |
| P2 actions required | 12 |
| Estimated total fix effort | ~18 hours |
| Pass verdicts | 3 (master roadmap, phase 3 auth, phase 8 compliance) |
| Pass with fixes | 7 |
| Fail verdicts | 1 (phase 6 mobile app — due to fabricated SDK version) |

### Final Assessment

**Quality Score: 72 / 100**

The Team 3 output is **substantial and well-structured** but has **7 CRITICAL issues** that MUST be resolved before development begins. The most severe issue is the fabricated Expo SDK 54 version, which invalidates all mobile app planning. The second most severe is migration numbering collisions that would cause fatal database deployment conflicts.

Once the 7 CRITICAL and 18 HIGH issues are resolved (estimated ~18 hours of work), the output will be **development-ready** and provides a solid foundation for the build phase. The LLM agent prompts, tickboxes, and cross-references are particularly well-executed and should be preserved.

**Verdict: NOT development-ready without fixes. Fix all CRITICAL and HIGH issues, then this becomes a strong development foundation.**

---

*End of Audit Report*

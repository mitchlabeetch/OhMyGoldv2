# Phase 1 Audit Report — OhMyGoldv2

## Summary
- **Total Findings**: 35 (CRITICAL: 9, HIGH: 14, MEDIUM: 9, LOW: 3)
- **Phase Status**: INCOMPLETE

---

## Item 1.1: Monorepo Initialization (Turborepo + pnpm Workspaces)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `pnpm install` completes | ✅ | `pnpm-workspace.yaml`, root `package.json` present | — |
| `pnpm dev` starts both web and mobile | ❌ | Mobile has no `dev` script (only `start`); turbo `dev` task will fail for mobile | CRITICAL |
| `pnpm build` produces bundles | ⚠️ | Mobile outputs `.expo/**` in turbo.json but mobile `package.json` has no `clean` script | MEDIUM |
| `pnpm lint` runs across packages | ✅ | Configured in turbo.json | — |
| `pnpm typecheck` passes | ⚠️ | Configured but mobile uses React 18 types, not 19 | HIGH |
| `pnpm test` runs unit tests | ⚠️ | Mobile uses `jest` but no jest config file exists | HIGH |
| `@ohmygold/shared` importable | ✅ | Both apps reference `workspace:*` | — |
| Turbo caching works | ⚠️ | `turbo.json` has `dependsOn: ["^build"]` for lint/typecheck/test which forces unnecessary builds | MEDIUM |

**Key Gaps:**
- Mobile uses **React 18.3.1** and **Expo SDK 52**; spec requires **React 19** and **Expo SDK 53** (CRITICAL)
- `package-lock.json` exists alongside pnpm — package manager conflict (CRITICAL)
- Missing `apps/mobile/metro.config.js` for monorepo compatibility (HIGH)
- `packages/ui-shared` exists but spec only calls for `packages/shared` and `packages/tsconfig` in Phase 1 (MEDIUM)
- `.npmrc` uses `shamefully-hoist=true` (npm-centric) instead of pnpm-native workspace config (LOW)

---

## Item 1.2: Docker Compose for Local Supabase

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `docker compose up -d` starts services | ⚠️ | `docker-compose.yml` exists but references missing `./volumes/` paths | CRITICAL |
| Studio on :54321 | ✅ | Configured | — |
| PostgreSQL on :54322 | ⚠️ | Image is `supabase/postgres:15.8.1.030` — **PostgreSQL 15, not 16** | HIGH |
| Auth on :54323 | ✅ | Configured | — |
| Kong routes services | ✅ | Kong service present | — |
| Can create test table | ❌ | `docker/volumes/` directory missing; compose will fail on volume mounts | CRITICAL |
| Volume persistence | ⚠️ | Named volumes declared but host volume paths (`./volumes/...`) don't exist | HIGH |

**Key Gaps:**
- PostgreSQL image is v15, spec requires **PostgreSQL 16** (HIGH)
- `docker/volumes/` directory **completely missing** — compose references `volumes/db/roles.sql`, `volumes/api/kong.yml`, etc. (CRITICAL)
- `docker/seed.sql` **missing** (HIGH)
- `docker/README.md` **missing** (MEDIUM)
- No Edge Functions service in docker-compose.yml (MEDIUM)
- Root `package.json` missing `supabase:start`, `supabase:stop`, `supabase:reset` scripts (HIGH)
- `.gitignore` does not explicitly include `docker/.env` (MEDIUM)

---

## Item 1.3: CI/CD Pipeline (GitHub Actions)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| CI on every PR | ✅ | `ci.yml` triggers on push/PR | — |
| Build workflow | ⚠️ | Build is embedded in `ci.yml`; no separate `build.yml` | HIGH |
| < 5 min with caching | ⚠️ | pnpm caching present; but no Turbo remote caching | MEDIUM |
| pnpm caching | ✅ | `actions/setup-node` with cache: pnpm | — |
| Staging deploy on merge | ✅ | `deploy.yml` triggers on main push | — |
| Health check / rollback | ❌ | No health check in deploy workflow | HIGH |
| Slack/Discord notification | ❌ | No notification on failure | MEDIUM |

**Key Gaps:**
- `.github/workflows/build.yml` **missing** — spec requires separate build workflow (HIGH)
- `.github/workflows/deploy-staging.yml` **missing** — file is named `deploy.yml` and combines staging+production (HIGH)
- `.github/SECRETS.md` **missing** — no secrets documentation (HIGH)
- `.nvmrc` **missing** — spec requires Node version pinning (HIGH)
- No health check or rollback mechanism in deploy workflow (HIGH)
- No Slack/Discord webhook notification (MEDIUM)
- CI workflow runs lint + typecheck + build sequentially in one job instead of parallel matrix (MEDIUM)

---

## Item 1.4: Development Environments

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Web dev on :5173 | ✅ | Vite config has port 5173, host true | — |
| Mobile starts via Expo | ⚠️ | `app.json` used instead of spec-required `app.config.ts` | HIGH |
| Web queries Supabase | ✅ | `src/lib/supabase.ts` exists | — |
| Mobile queries Supabase | ⚠️ | `src/lib/supabase.ts` exists but uses placeholder `supabaseAnonKey: "placeholder"` | MEDIUM |
| Path aliases resolve | ✅ | `@/*` configured in both apps | — |
| Env vars load | ❌ | No `.env.development` or `.env.example` in either app | HIGH |
| Source maps | ✅ | Vite `sourcemap: true` | — |
| React Fast Refresh | ✅ | `@vitejs/plugin-react` included | — |

**Key Gaps:**
- `apps/web/.env.development` or `.env.example` **missing** (HIGH)
- `apps/mobile/.env.development` or `.env.example` **missing** (HIGH)
- `apps/mobile/app.config.ts` **missing** — using `app.json` instead (HIGH)
- `apps/mobile/metro.config.js` **missing** — required for monorepo compatibility (HIGH)
- Vite config missing dev server proxy for `/rest/*` → localhost:54320 (MEDIUM)
- Mobile `tsconfig.json` has hardcoded path to `../../packages/shared/src/index.ts` instead of workspace resolution (MEDIUM)
- Mobile supabase client uses `Constants.expoConfig?.extra?.supabaseAnonKey` with value `"placeholder"` (MEDIUM)
- No `app/index.tsx` or `app/(auth)/login.tsx` verified present (need to check — but `(auth)` dir exists) (LOW)

---

## Item 1.5: TypeScript Shared Packages

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| ESM + CJS output | ❌ | Build script is `tsc` only; no `tsup.config.ts`; no dual output | CRITICAL |
| Subpath imports | ❌ | `package.json` exports only `"."` — no `/types`, `/schemas`, `/utils` subpaths | HIGH |
| Zod schemas importable | ✅ | `schemas.ts` exists with login, register, member, class, booking schemas | — |
| Supabase types auto-generated | ❌ | No `database.ts`; no `gen:types` script | HIGH |
| Importable from both apps | ✅ | Both apps import from `@ohmygold/shared` | — |
| Strict mode | ✅ | `tsconfig/base.json` has `strict: true` | — |
| Tree-shaking | ❌ | No ESM output; CJS only via `tsc` | MEDIUM |

**Key Gaps:**
- `tsup.config.ts` **missing** — spec requires tsup for fast bundling (CRITICAL)
- `src/types/database.ts` **missing** — auto-generated Supabase types (HIGH)
- `src/constants/roles.ts` and `src/constants/permissions.ts` **missing** — permissions mixed into `types.ts` (MEDIUM)
- `src/utils/validation.ts` **missing** — validation helpers are in `schemas.ts` (MEDIUM)
- `src/utils/dates.ts` **missing** — date utilities are in `utils.ts` (MEDIUM)
- `gen:types` script **missing** from `package.json` (HIGH)
- Directory structure is flat (`types.ts`, `schemas.ts`, `utils.ts`) instead of spec's folder-per-concern (`types/`, `schemas/`, `utils/`, `constants/`) (MEDIUM)

---

## Item 1.6: Linting, Formatting, Pre-commit Hooks

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `pnpm lint` passes | ⚠️ | ESLint flat config exists; but missing several required plugins | HIGH |
| `pnpm format` works | ✅ | `.prettierrc` and scripts present | — |
| Pre-commit blocks bad commits | ❌ | `.husky/` directory **missing entirely** | CRITICAL |
| Pre-commit auto-formats | ❌ | No husky = no pre-commit hook | CRITICAL |
| Commit message validation | ❌ | No husky = no commit-msg hook | CRITICAL |
| CI runs same checks | ✅ | `ci.yml` runs lint, format:check, typecheck | — |
| VS Code extensions recommended | ❌ | `.vscode/extensions.json` **missing** | MEDIUM |
| VS Code format-on-save | ❌ | `.vscode/settings.json` **missing** | MEDIUM |

**Key Gaps:**
- `.husky/` directory **completely missing** despite `prepare: "husky"` in root package.json — hooks are non-functional (CRITICAL)
- `lint-staged.config.js` **missing** (CRITICAL)
- `.commitlintrc.js` **missing** — using `.json` instead (not a flat config as spec implies) (LOW)
- ESLint missing `jsx-a11y` plugin (HIGH)
- ESLint missing import ordering rules (HIGH)
- ESLint missing React Native specific rules for `apps/mobile` (MEDIUM)
- `.prettierrc` has `singleQuote: false` — spec requires `singleQuote: true` (MEDIUM)
- `.prettierrc` has `trailingComma: "all"` — spec requires `trailingComma: "es5"` (LOW)

---

## Item 1.7: Database Schema (Migrations System)

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| All migrations apply cleanly | ⚠️ | 21 migrations exist but `docker/volumes/` missing prevents clean `db reset` | HIGH |
| Schema matches permission matrix | ⚠️ | Core tables present but some spec tables missing | HIGH |
| UUID PKs, timestamps, audit cols | ✅ | All tables have UUID PKs, `created_at`, `updated_at` | — |
| Foreign keys with ON DELETE | ✅ | Proper FKs with CASCADE/SET NULL | — |
| Indexes on query columns | ✅ | Indexes present on email, role, location_id, etc. | — |
| RLS enabled on all tables | ⚠️ | 11 migrations enable RLS; some later migrations (0016-0021) may not | MEDIUM |
| Seed data 50+ records | ❌ | `0015_seed_dev_data.sql` only seeds ~7 membership plans; no users/classes/products | HIGH |
| Generated types match schema | ❌ | No type generation configured | HIGH |

**Key Gaps:**
- Migration file names don't match spec's required naming (`00000000000000_init.sql`, etc.); actual files use `0001_...sql` format (MEDIUM)
- Spec requires exactly **16 migrations**; repo has **21** (extra is fine, but naming convention deviates) (LOW)
- Missing spec-required tables: `permissions`, `role_permissions`, `invoices`, `waitlist`, `access_cards`, `products`, `inventory`, `leads`, `pipeline_stages`, `campaigns`, `messages` (some exist in later migrations but not all) (HIGH)
- `docker/volumes/db/` init scripts **missing** — referenced in compose for roles.sql, webhooks.sql, logs.sql, jwt.sql, realtime.sql (CRITICAL)
- Seed data is sparse: no test users, no class types, no products as spec requires (HIGH)
- No `seed.sql` at `docker/seed.sql` or `supabase/seed.sql` (HIGH)

---

## Item 1.8: Caddy Reverse Proxy

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| HTTPS for web app | ❌ | No Caddy configuration exists | CRITICAL |
| HTTPS for Supabase API | ❌ | No Caddy configuration exists | CRITICAL |
| HTTPS for Studio | ❌ | No Caddy configuration exists | CRITICAL |
| No SSL warnings | ❌ | No Caddy CA setup | CRITICAL |
| WebSocket passthrough | ❌ | No Caddyfile | CRITICAL |
| Auto-reload | ❌ | No Caddy container | CRITICAL |

**Key Gaps:**
- `docker/caddy/Caddyfile` **missing** (CRITICAL)
- `docker/docker-compose.override.yml` **missing** (CRITICAL)
- Caddy service **entirely absent** from infrastructure (CRITICAL)
- No `pnpm proxy:start` script (MEDIUM)
- No `/etc/hosts` documentation (MEDIUM)

---

## Item 1.9: Monitoring Infrastructure

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Grafana on :3001 | ❌ | No monitoring stack | CRITICAL |
| Prometheus targets UP | ❌ | No monitoring stack | CRITICAL |
| Loki receiving logs | ❌ | No monitoring stack | CRITICAL |
| Overview dashboard | ❌ | No dashboards | CRITICAL |
| API performance dashboard | ❌ | No dashboards | CRITICAL |
| Database health dashboard | ❌ | No dashboards | CRITICAL |
| Alertmanager configured | ❌ | No alertmanager | CRITICAL |

**Key Gaps:**
- `docker/docker-compose.monitoring.yml` **missing** (CRITICAL)
- `docker/monitoring/prometheus/prometheus.yml` **missing** (CRITICAL)
- `docker/monitoring/loki/loki-config.yml` **missing** (CRITICAL)
- `docker/monitoring/alertmanager/alertmanager.yml` **missing** (CRITICAL)
- `docker/monitoring/grafana/dashboards/` **missing** (CRITICAL)
- No `pnpm monitoring:start` script (MEDIUM)

---

## Item 1.10: Documentation

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| README quick start < 10 min | ❌ | Root `README.md` is essentially empty (`# OhMyGold` + blank lines) | CRITICAL |
| Developer onboarding guide | ❌ | `docs/guides/developer-onboarding.md` **missing** | HIGH |
| ADR template + 3 ADRs | ❌ | `docs/architecture/` directory **missing entirely** | HIGH |
| API docs structure | ❌ | `docs/api/openapi.yaml` **missing** | MEDIUM |
| Major decisions in ADRs | ❌ | No ADR directory | HIGH |
| Docs build/deploy | ❌ | No `pnpm docs:serve` or `pnpm docs:build` scripts | MEDIUM |

**Key Gaps:**
- Root `README.md` is a placeholder — completely inadequate for a project of this scope (CRITICAL)
- `docs/architecture/ADR-TEMPLATE.md` **missing** (HIGH)
- `docs/architecture/001-monorepo-structure.md` **missing** (HIGH)
- `docs/architecture/002-auth-strategy.md` **missing** (HIGH)
- `docs/architecture/003-database-design.md` **missing** (HIGH)
- `docs/guides/developer-onboarding.md` **missing** (HIGH)
- `docs/guides/local-development.md` **missing** (HIGH)
- `docs/guides/deployment.md` **missing** (HIGH)
- `docs/ops/runbooks/database-backup.md` **missing** (MEDIUM)
- `docs/ops/runbooks/incident-response.md` **missing** (MEDIUM)
- `docs/ops/troubleshooting/common-issues.md` **missing** (MEDIUM)

---

## Findings Detail

### CRITICAL-001: Husky / Pre-commit Hooks Completely Missing
- **Item**: 1.6
- **Description**: Root `package.json` declares `"prepare": "husky"` but `.husky/` directory does not exist. No `pre-commit`, `commit-msg`, or any hooks are installed. Git commits will proceed without lint, format, or commit message validation.
- **Impact**: Code quality guarantees are bypassed; bad commits and non-conventional commit messages will enter the repo.
- **Fix Required**: Initialize husky (`npx husky init`), create `.husky/pre-commit` and `.husky/commit-msg`, and verify they execute.

### CRITICAL-002: Docker Volume Mounts Missing
- **Item**: 1.2
- **Description**: `docker-compose.yml` references `./volumes/db/roles.sql`, `./volumes/db/webhooks.sql`, `./volumes/api/kong.yml`, etc. The `docker/volumes/` directory does not exist.
- **Impact**: `docker compose up` will fail immediately with volume mount errors. Supabase stack cannot start.
- **Fix Required**: Create `docker/volumes/db/` and `docker/volumes/api/` with required initialization files, or remove volume mounts if not needed.

### CRITICAL-003: Caddy Reverse Proxy Entirely Missing
- **Item**: 1.8
- **Description**: No `docker/caddy/Caddyfile`, no `docker-compose.override.yml`, no Caddy service anywhere.
- **Impact**: No HTTPS local development; no unified entry point; production architecture mismatch.
- **Fix Required**: Create Caddyfile with reverse proxy rules and docker-compose override.

### CRITICAL-004: Monitoring Stack Entirely Missing
- **Item**: 1.9
- **Description**: No `docker-compose.monitoring.yml`, no Prometheus, Loki, Grafana, or Alertmanager configs.
- **Impact**: Zero observability from day one; performance issues and errors invisible.
- **Fix Required**: Create full monitoring Docker Compose extension with dashboards and configs.

### CRITICAL-005: Root README.md is Empty Placeholder
- **Item**: 1.10
- **Description**: `README.md` contains only `# OhMyGold` and blank lines. No quick start, badges, tech stack, or setup instructions.
- **Impact**: New developers cannot onboard; repo looks unprofessional; spec's "< 10 min" quick start is impossible.
- **Fix Required**: Write comprehensive README with clone → running steps, badges, and links to docs.

### CRITICAL-006: Shared Package Build Uses tsc, Not tsup
- **Item**: 1.5
- **Description**: `packages/shared/package.json` build script is `"build": "tsc"`. No `tsup.config.ts` exists. Output is single-format, not ESM + CJS.
- **Impact**: Slower builds; no tree-shaking; consumers may bundle unused code.
- **Fix Required**: Install tsup, create `tsup.config.ts` with ESM + CJS outputs, update exports map.

### CRITICAL-007: package-lock.json Conflict with pnpm
- **Item**: 1.1
- **Description**: `package-lock.json` exists in a pnpm-managed monorepo. pnpm uses `pnpm-lock.yaml` (not present either).
- **Impact**: Inconsistent dependency resolution; CI may use wrong lockfile; developer confusion.
- **Fix Required**: Remove `package-lock.json`, run `pnpm install` to generate `pnpm-lock.yaml`, commit it.

### CRITICAL-008: No pnpm-lock.yaml / Lockfile Missing
- **Item**: 1.1
- **Description**: Neither `pnpm-lock.yaml` nor a valid committed lockfile exists. `package-lock.json` is present but is for npm.
- **Impact**: `pnpm install --frozen-lockfile` (used in CI) will fail. Builds are non-reproducible.
- **Fix Required**: Generate and commit `pnpm-lock.yaml`.

### CRITICAL-009: Mobile App Missing `dev` Script for Turbo
- **Item**: 1.1 / 1.4
- **Description**: `apps/mobile/package.json` has no `dev` script. `turbo.json` defines `dev` task, but mobile can't participate.
- **Impact**: `pnpm dev` (which runs `turbo run dev --parallel`) will fail or skip mobile.
- **Fix Required**: Add `"dev": "expo start"` to mobile `package.json` scripts.

### HIGH-001: PostgreSQL 15 Used Instead of 16
- **Item**: 1.2
- **Description**: `docker-compose.yml` uses `supabase/postgres:15.8.1.030`. Spec requires PostgreSQL 16.
- **Impact**: Version mismatch with production target; potential feature/compatibility issues.
- **Fix Required**: Update to PostgreSQL 16 image tag.

### HIGH-002: Docker seed.sql Missing
- **Item**: 1.2
- **Description**: No `docker/seed.sql` for initial seed data as spec requires.
- **Impact**: Developers must manually seed data or rely only on migration 0015.
- **Fix Required**: Create `docker/seed.sql` with minimal seed data.

### HIGH-003: CI Build Workflow Missing (Separate File)
- **Item**: 1.3
- **Description**: Spec requires `.github/workflows/build.yml` as a separate workflow. Build is instead embedded in `ci.yml`.
- **Impact**: Cannot trigger build independently; no artifact upload on manual dispatch.
- **Fix Required**: Extract build job into `.github/workflows/build.yml`.

### HIGH-004: Deploy Workflow Missing Staging-Specific File
- **Item**: 1.3
- **Description**: Spec requires `.github/workflows/deploy-staging.yml`. File is named `deploy.yml` and handles both staging and production.
- **Impact**: Deviation from spec; combined workflow harder to maintain.
- **Fix Required**: Rename/refactor to match spec's separate staging deploy workflow.

### HIGH-005: .nvmrc Missing
- **Item**: 1.3
- **Description**: No `.nvmrc` file to pin Node version. CI uses hardcoded `NODE_VERSION: "22"`.
- **Impact**: Local/CI Node version drift; spec explicitly requires `.nvmrc`.
- **Fix Required**: Create `.nvmrc` with `22` and reference it in CI via `node-version-file: '.nvmrc'`.

### HIGH-006: .github/SECRETS.md Missing
- **Item**: 1.3
- **Description**: No documentation of required GitHub Secrets.
- **Impact**: New team members cannot set up CI/CD; secret management is opaque.
- **Fix Required**: Create `.github/SECRETS.md` documenting all required secrets.

### HIGH-007: Web Env File Missing
- **Item**: 1.4
- **Description**: No `apps/web/.env.development` or `.env.example`.
- **Impact**: Developers must guess required environment variables.
- **Fix Required**: Create `apps/web/.env.example` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

### HIGH-008: Mobile Env File Missing
- **Item**: 1.4
- **Description**: No `apps/mobile/.env.development` or `.env.example`.
- **Impact**: Mobile developers don't know which env vars to set.
- **Fix Required**: Create `apps/mobile/.env.example` with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.

### HIGH-009: Mobile metro.config.js Missing
- **Item**: 1.4
- **Description**: No Metro bundler config for monorepo compatibility.
- **Impact**: Metro may not resolve workspace packages correctly; bundler errors likely.
- **Fix Required**: Create `apps/mobile/metro.config.js` with `expo` and monorepo settings.

### HIGH-010: app.config.ts Missing (Mobile)
- **Item**: 1.4
- **Description**: Mobile uses `app.json` instead of spec-required `app.config.ts`.
- **Impact**: Cannot use TypeScript for app config; env var injection harder; spec deviation.
- **Fix Required**: Convert `app.json` to `app.config.ts`.

### HIGH-011: Shared Package Missing Subpath Exports
- **Item**: 1.5
- **Description**: `package.json` exports only `"."` barrel. Spec requires `import { Member } from '@ohmygold/shared/types'`.
- **Impact**: Consumers must import everything from barrel; tree-shaking limited.
- **Fix Required**: Add exports map entries for `./types`, `./schemas`, `./utils`, `./constants`.

### HIGH-012: Supabase Database Types Missing
- **Item**: 1.5 / 1.7
- **Description**: No `src/types/database.ts` (auto-generated from Supabase schema). No `gen:types` script.
- **Impact**: No typed Supabase client; database changes don't trigger compile-time errors.
- **Fix Required**: Add `supabase gen types` script and commit generated `database.ts`.

### HIGH-013: Seed Data Insufficient
- **Item**: 1.7
- **Description**: `0015_seed_dev_data.sql` only inserts ~7 membership plans. Spec requires 50+ test records including 2 locations, 5 users, 3 class types, 5 products.
- **Impact**: Development database is nearly empty; testing workflows hard.
- **Fix Required**: Expand seed data to include users, classes, products, bookings, etc.

### HIGH-014: Deploy Workflow Missing Health Check
- **Item**: 1.3
- **Description**: `deploy.yml` deploys via rsync but never verifies the deployment is healthy.
- **Impact**: Failed deployments could take staging offline without detection.
- **Fix Required**: Add health check curl and rollback step after deployment.

### MEDIUM-001: Mobile React Version Mismatch (18 vs 19)
- **Item**: 1.1
- **Description**: `apps/mobile/package.json` uses `react: 18.3.1`. Spec requires React 19.
- **Impact**: Type mismatches with `@types/react` and shared packages; future compatibility issues.
- **Fix Required**: Upgrade mobile to React 19 (may require Expo SDK 53).

### MEDIUM-002: Mobile Expo SDK Mismatch (52 vs 53)
- **Item**: 1.1
- **Description**: `apps/mobile/package.json` uses `expo: ^52.0.0`. Spec requires Expo SDK 53.
- **Impact**: Deviation from spec; may block React 19 upgrade.
- **Fix Required**: Upgrade to Expo SDK 53 when available/stable.

### MEDIUM-003: turbo.json lint/typecheck Depends on Build
- **Item**: 1.1
- **Description**: `lint` and `typecheck` tasks have `dependsOn: ["^build"]` which forces builds before linting.
- **Impact**: Slower CI; unnecessary builds for lint-only checks.
- **Fix Required**: Remove `dependsOn: ["^build"]` from lint and typecheck tasks.

### MEDIUM-004: Docker README.md Missing
- **Item**: 1.2
- **Description**: No `docker/README.md` documenting ports and services.
- **Impact**: Developers must inspect compose file to understand stack.
- **Fix Required**: Create `docker/README.md` with service map and port reference.

### MEDIUM-005: Vite Missing Proxy for Supabase REST
- **Item**: 1.4
- **Description**: `vite.config.ts` has no `server.proxy` for `/rest/*` → `localhost:54320`.
- **Impact**: CORS issues possible during local dev; spec requires proxy.
- **Fix Required**: Add proxy configuration to Vite dev server.

### MEDIUM-006: Prettier Config Deviates from Spec
- **Item**: 1.6
- **Description**: `.prettierrc` uses `singleQuote: false` and `trailingComma: "all"`. Spec requires `singleQuote: true`, `trailingComma: "es5"`.
- **Impact**: Code formatting inconsistent with spec; style drift.
- **Fix Required**: Update `.prettierrc` to match spec values.

### MEDIUM-007: ESLint Missing Required Plugins
- **Item**: 1.6
- **Description**: ESLint config missing `jsx-a11y`, import ordering, and React Native rules.
- **Impact**: Accessibility issues and import chaos not caught; mobile code quality lower.
- **Fix Required**: Install and configure `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, and `@react-native/eslint-config`.

### MEDIUM-008: .vscode Directory Missing
- **Item**: 1.6
- **Description**: No `.vscode/extensions.json` or `.vscode/settings.json`.
- **Impact**: Developers lack recommended extensions and format-on-save setup.
- **Fix Required**: Create `.vscode/` with extensions recommendations and settings.

### MEDIUM-009: Missing Spec-Required Tables in Schema
- **Item**: 1.7
- **Description**: Several spec-required tables absent: `permissions`, `role_permissions` (from 00000000000001_roles.sql), `waitlist`, `access_cards`, `invoices`, `products`, `inventory`, `leads`, `pipeline_stages`, `campaigns`, `messages`. Some exist in later migrations (0020_crm has leads) but not all.
- **Impact**: Schema doesn't fully match permission matrix and feature requirements.
- **Fix Required**: Audit all spec-required tables and create missing migrations.

### LOW-001: .npmrc shamefully-hoist
- **Item**: 1.1
- **Description**: `.npmrc` contains `shamefully-hoist=true` which is npm-centric.
- **Impact**: Minor; pnpm works but hoisting behavior deviates from pnpm defaults.
- **Fix Required**: Evaluate if `shamefully-hoist` is necessary for Expo; remove if not.

### LOW-002: packages/ui-shared Created Early
- **Item**: 1.1
- **Description**: `packages/ui-shared` exists but spec says `packages/ui` should be Phase 2.
- **Impact**: Minor deviation; doesn't block Phase 1.
- **Fix Required**: Acceptable if needed early; rename to `packages/ui` if desired.

### LOW-003: commitlint Uses JSON Instead of JS
- **Item**: 1.6
- **Description**: `commitlint.config.json` instead of `.commitlintrc.js`.
- **Impact**: Minor; JSON config is functional but spec example shows JS.
- **Fix Required**: Optional rename for consistency.

---

## Recommended Fix Priority Order

1. **CRITICAL-007 / CRITICAL-008**: Remove `package-lock.json`, generate and commit `pnpm-lock.yaml`
2. **CRITICAL-002**: Create `docker/volumes/` directory with required init files (or fix compose)
3. **CRITICAL-009**: Add `"dev": "expo start"` to mobile `package.json`
4. **CRITICAL-001**: Initialize husky, create `.husky/pre-commit` and `.husky/commit-msg`
5. **CRITICAL-006**: Add `tsup` to `packages/shared`, create `tsup.config.ts`
6. **CRITICAL-005**: Write comprehensive root `README.md`
7. **CRITICAL-003**: Create Caddy reverse proxy configuration
8. **CRITICAL-004**: Create monitoring Docker Compose stack
9. **HIGH-001**: Upgrade PostgreSQL to version 16 in docker-compose.yml
10. **HIGH-007 / HIGH-008**: Create `.env.example` files for web and mobile
11. **HIGH-009 / HIGH-010**: Create `metro.config.js` and `app.config.ts` for mobile
12. **HIGH-003 / HIGH-004 / HIGH-005 / HIGH-006**: Fix CI/CD workflow structure, add `.nvmrc`, add `SECRETS.md`
13. **HIGH-013**: Expand seed data to 50+ records
14. **HIGH-012**: Add Supabase type generation and commit `database.ts`
15. **HIGH-014**: Add health check to deploy workflow
16. **MEDIUM-001 / MEDIUM-002**: Plan mobile React 19 + Expo SDK 53 upgrade

---

*Audit completed. Phase 1 is INCOMPLETE with 9 CRITICAL blockers preventing deployment and 14 HIGH severity gaps significantly degrading developer experience and spec compliance.*

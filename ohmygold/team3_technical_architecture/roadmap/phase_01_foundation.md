# Phase 1: Project Foundation & Infrastructure

> **Phase ID:** P1
> **Duration:** 2-3 weeks
> **Prerequisites:** None — this is the project kickoff phase
> **Goal:** Establish a rock-solid development foundation that all subsequent phases build upon

---

## Phase Overview

Phase 1 creates the entire development infrastructure for OhMyGold. Every line of code written in Phases 2-9 depends on the decisions made here. A strong foundation means faster development later; a weak foundation means constant refactoring and firefighting.

This phase is about **developer experience first** — if developers can't spin up their environment in under 10 minutes, we've failed.

---

## 1.1 Initialize Monorepo (Turborepo + pnpm Workspaces)

### Description and Scope
Initialize a Turborepo-based monorepo with pnpm workspaces containing three packages: `apps/web` (React webapp), `apps/mobile` (React Native with Expo), and `packages/shared` (TypeScript shared code including types, utilities, and validation schemas).

### Why This Matters
The monorepo structure enables code sharing between web and mobile, unified dependency management, and atomic deployments. Without it, types and utilities would be duplicated, leading to bugs when web and mobile drift out of sync.

### Technical Approach
Use `create-turbo@latest` with pnpm, then customize the structure. The shared package exports TypeScript types (generated from Supabase), Zod validation schemas, i18n translation keys, utility functions, and design token definitions. Both web and mobile apps import from `@ohmygold/shared`.

### Files/Directories to Create/Modify
```
ohmygold/
├── package.json              # Root with pnpm workspace config
├── pnpm-workspace.yaml       # apps/*, packages/*
├── turbo.json                # Pipeline config (build, lint, test, typecheck)
├── apps/
│   ├── web/                  # React 19 + Vite app
│   └── mobile/               # Expo app (blank template)
└── packages/
    ├── shared/               # TypeScript types, schemas, utils
    ├── ui/                   # Shared UI components (Phase 2)
    └── ts-config/            # Shared TypeScript configurations
```

### Dependencies on Other Items
- None — this is the first item

### Success Criteria
```
[ ] `pnpm install` completes from clean clone in < 2 minutes
[ ] `pnpm dev` starts both web (localhost:5173) and mobile (Expo) simultaneously
[ ] `pnpm build` produces production bundles for both web and mobile
[ ] `pnpm lint` runs ESLint across all packages
[ ] `pnpm typecheck` passes TypeScript checks in all packages
[ ] `pnpm test` runs unit tests across all packages
[ ] `@ohmygold/shared` can be imported from both apps
[ ] Turbo caching works (repeated builds are instant when no changes)
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| pnpm workspace conflicts | Pin exact versions; use `.npmrc` with `strict-peer-dependencies=false` |
| React Native + Expo version incompatibility | Use Expo SDK 53 with React 19; test on fresh machine |
| Turbo pipeline misconfiguration | Start simple; add tasks incrementally |

### LLM Agent Launch Prompt

```
You are initializing the OhMyGold monorepo from scratch.

CONTEXT: OhMyGold is Gold's Gym France's gym management system with a webapp (React 19 + Vite) and a mobile app (React Native + Expo). Code sharing between platforms is critical for maintaining type consistency.

TASK: Create a Turborepo monorepo with pnpm workspaces containing:
1. apps/web — React 19 + TypeScript + Vite scaffold
2. apps/mobile — Expo SDK 53 + React Native + TypeScript scaffold  
3. packages/shared — TypeScript package exporting:
   - A sample type (e.g., `User { id: string; email: string; role: Role }`)
   - A sample Zod schema for that type
   - A sample utility function
4. packages/tsconfig — shared tsconfig.json files

REQUIREMENTS:
- Root package.json with pnpm workspace config for "apps/*" and "packages/*"
- turbo.json with pipelines for build, lint, test, typecheck, dev
- Web app runs on localhost:5173 with hot reload
- Mobile app starts via `npx expo start` (configure with devClient if needed)
- Shared package builds correctly and is importable from both apps
- All TypeScript strict mode enabled
- ESLint configured with recommended rules
- .gitignore configured for all three package types

FILES TO CREATE/MODIFY:
- /ohmygold/package.json (root)
- /ohmygold/pnpm-workspace.yaml
- /ohmygold/turbo.json
- /ohmygold/.gitignore
- /ohmygold/apps/web/ (full Vite React scaffold)
- /ohmygold/apps/mobile/ (full Expo scaffold)
- /ohmygold/packages/shared/ (TypeScript library)
- /ohmygold/packages/tsconfig/ (shared configs)

VERIFICATION STEPS:
1. Run `pnpm install` — should complete without errors
2. Run `pnpm build` — should build all packages
3. Verify web app loads at localhost:5173
4. Verify mobile app starts with Expo
5. Verify shared types are importable in both apps

CROSS-REFERENCES: None (first task)

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Turborepo version used: ___
- Expo SDK version: ___
- Any issues encountered: ___
- Deviation from spec (if any): ___
```

---

## 1.2 Set up Docker Compose for Local Supabase

### Description and Scope
Deploy a self-hosted Supabase stack locally using Docker Compose. This includes PostgreSQL 16, Supabase Auth, Supabase Realtime, Supabase Storage, Kong gateway, and Supabase Studio (UI). Configuration must be production-like while remaining developer-friendly.

### Why This Matters
All backend development (database, auth, storage, real-time) depends on Supabase being available. Using Docker Compose ensures every developer has an identical environment, eliminating "works on my machine" issues. Self-hosting aligns with the production architecture (self-hosted on VPS).

### Technical Approach
Use the official `supabase/supabase` Docker Compose configuration from the supabase/self-hosted repository. Customize `.env` with OhMyGold-specific settings. Expose Studio on port 54321, PostgreSQL on 54322, Auth on 54323, Kong on 54320. Seed initial data via `seed.sql`.

### Files/Directories to Create/Modify
```
docker/
├── docker-compose.yml       # Supabase stack
├── .env.example             # Template environment variables
├── .env                     # Local dev secrets (gitignored)
├── volumes/                 # Persistent data
└── seed.sql                 # Initial seed data
```

### Dependencies on Other Items
- 1.1 (monorepo initialized — Docker files live in the repo)

### Success Criteria
```
[ ] `docker compose up -d` starts all Supabase services
[ ] Supabase Studio accessible at http://localhost:54321
[ ] PostgreSQL accessible at localhost:54322
[ ] Auth service accessible at localhost:54323
[ ] Kong gateway routes to all services
[ ] Can create a test table via Studio SQL editor
[ ] Can connect to database via psql/pgAdmin
[ ] Container restart preserves data (volume mounted)
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Port conflicts | Document all ports; allow overrides via .env |
| ARM64 compatibility (Apple Silicon) | Use `platform: linux/arm64` overrides; test on M1/M2 |
| Volume data corruption | Add `make reset` target to nuke and restart |
| Environment drift | Commit `.env.example`; never commit `.env` |

### LLM Agent Launch Prompt

```
Set up self-hosted Supabase locally using Docker Compose for the OhMyGold project.

CONTEXT: OhMyGold uses self-hosted Supabase on a VPS for production. Local development must mirror production as closely as possible. Supabase provides PostgreSQL 16, Auth, Storage, Realtime, and Edge Functions.

TASK:
1. Create docker/docker-compose.yml with the official Supabase self-hosted stack including:
   - kong (API gateway) on port 54320
   - supabase-studio (UI) on port 54321
   - postgrest (REST API) 
   - postgres (PostgreSQL 16) on port 54322
   - auth (GoTrue) on port 54323
   - realtime (Elixir/WebSocket)
   - storage
   - meta
   - edge-functions
2. Create docker/.env.example with all required environment variables
3. Create docker/.env with local dev values (use strong passwords)
4. Create docker/seed.sql with minimal seed data (roles enum, test user)
5. Add convenience scripts to root package.json:
   - `pnpm supabase:start` → docker compose up -d
   - `pnpm supabase:stop` → docker compose down
   - `pnpm supabase:reset` → docker compose down -v && docker compose up -d
6. Document ports and services in docker/README.md

FILES TO CREATE/MODIFY:
- /ohmygold/docker/docker-compose.yml
- /ohmygold/docker/.env.example
- /ohmygold/docker/.env
- /ohmygold/docker/seed.sql
- /ohmygold/docker/README.md
- /ohmygold/package.json (add scripts)
- /ohmygold/.gitignore (add docker/.env)

VERIFICATION STEPS:
1. Run `pnpm supabase:start`
2. Verify Studio loads at http://localhost:54321
3. Connect to PostgreSQL: `psql postgresql://postgres:password@localhost:54322/postgres`
4. Create a test table and verify it persists after restart
5. Verify Kong routes correctly: `curl http://localhost:54320/rest/v1/` returns expected response
6. Run `pnpm supabase:reset` and verify data clears then re-seeds

DESIGN SYSTEM REF: N/A (infrastructure)
REQUIREMENTS REF: Technical Best Practices §5.2.2 (Supabase recommendation)

NOTES AREA (fill on completion):
- Date completed: ___
- Supabase version/tag used: ___
- PostgreSQL version: ___
- Any port conflicts resolved: ___
- Seed data created: ___
```

---

## 1.3 Configure CI/CD Pipeline (GitHub Actions)

### Description and Scope
Create a comprehensive CI/CD pipeline using GitHub Actions with three workflows: (1) `ci.yml` — lint, typecheck, test on every PR, (2) `build.yml` — build web and mobile bundles, (3) `deploy-staging.yml` — auto-deploy to staging on merge to main. Include caching, parallel jobs, and artifact upload.

### Why This Matters
Without CI/CD, code quality degrades rapidly, deployment becomes manual and error-prone, and rollbacks are impossible. A green CI pipeline is the definition of "deployable code." This must be set up before the first feature is merged.

### Technical Approach
Use GitHub Actions with pnpm caching, Turbo remote caching (optional), and job matrices for parallel execution. CI runs on every PR push. Build produces artifacts. Staging deploy triggers on merge to main using SSH + Docker Compose on the staging VPS.

### Files/Directories to Create/Modify
```
.github/
├── workflows/
│   ├── ci.yml               # Lint, typecheck, test
│   ├── build.yml            # Build web + mobile bundles
│   └── deploy-staging.yml   # Deploy to staging VPS
```

### Dependencies on Other Items
- 1.1 (monorepo structure with turbo.json)
- 1.2 (Docker Compose for staging deploy)

### Success Criteria
```
[ ] CI workflow runs on every PR with lint, typecheck, test
[ ] Build workflow produces web and mobile artifacts
[ ] All workflows complete in < 5 minutes (cached)
[ ] pnpm caching works across workflow runs
[ ] Staging deploy triggers automatically on merge to main
[ ] Failed deployments don't take staging offline (health check)
[ ] Slack/Discord notification on failure
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Runner minutes consumption | Use caching; skip unchanged packages with Turbo |
| Secrets exposure | Use GitHub Secrets; never log credentials |
| Staging downtime during deploy | Blue-green deploy via Docker Compose |

### LLM Agent Launch Prompt

```
Create the CI/CD pipeline for OhMyGold using GitHub Actions.

CONTEXT: OhMyGold is a Turborepo monorepo with web (React+Vite), mobile (Expo), and shared TypeScript packages. Uses pnpm and Docker Compose.

TASK: Create three GitHub Actions workflows:

WORKFLOW 1: .github/workflows/ci.yml
- Trigger: push to any branch, pull_request
- Jobs: lint (eslint), typecheck (tsc --noEmit), test (vitest/jest)
- Use pnpm caching (actions/setup-node with cache: pnpm)
- Use Turbo for incremental task running
- Run in parallel where possible
- Fail fast on first error

WORKFLOW 2: .github/workflows/build.yml
- Trigger: push to main, manual dispatch
- Jobs: build-web (Vite production build), build-mobile (Expo prebuild)
- Upload build artifacts
- Run after CI passes

WORKFLOW 3: .github/workflows/deploy-staging.yml
- Trigger: push to main (after build passes)
- Deploy to staging VPS via SSH
- Steps: SSH in, git pull, docker compose up -d, health check
- Rollback on health check failure
- Slack webhook notification on success/failure

REQUIREMENTS:
- All workflows use ubuntu-latest runners
- pnpm version pinned to 9.x
- Node version pinned to 20.x (via .nvmrc)
- Secrets referenced via ${{ secrets.XXX }}
- Staging VPS IP, SSH key, and Slack webhook stored in GitHub Secrets
- Document all required secrets in .github/SECRETS.md

FILES TO CREATE:
- .github/workflows/ci.yml
- .github/workflows/build.yml
- .github/workflows/deploy-staging.yml
- .github/SECRETS.md (required secrets documentation)
- .nvmrc (Node version)

VERIFICATION STEPS:
1. Push workflows to a test branch
2. Open a PR and verify CI triggers
3. Verify lint, typecheck, and test run
4. Verify build produces artifacts
5. Verify deploy workflow syntax is valid

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Average CI run time: ___
- Any workflow failures: ___
- Required secrets documented: ___
```

---

## 1.4 Set up Development Environments (Web + Mobile)

### Description and Scope
Configure both development environments with hot reload, environment variable management, path aliases, and debug tooling. The web app uses Vite with React 19, and the mobile app uses Expo with development builds. Both connect to the local Supabase instance.

### Why This Matters
Developer productivity is directly correlated with environment quality. Slow reloads, missing type information, and environment configuration issues waste hours per developer per week. Get this right on day one.

### Technical Approach
For web: Vite config with `@/` path alias, environment variables via `.env` files, React Fast Refresh, source maps. For mobile: Expo Router v3 with file-based routing, environment variables via `app.config.ts`, Expo Dev Client for native debugging. Both use `SUPABASE_URL` and `SUPABASE_ANON_KEY` from local Docker.

### Files/Directories to Create/Modify
```
apps/web/
├── vite.config.ts           # Path aliases, dev server proxy to Supabase
├── tsconfig.json            # Path mapping for @/
├── .env.development         # Local Supabase URLs
└── src/
    └── lib/
        └── supabase.ts      # Supabase client initialization

apps/mobile/
├── app.config.ts            # Environment variables, app config
├── tsconfig.json            # Path mapping
├── .env.development         # Local Supabase URLs
├── src/
│   └── lib/
│       └── supabase.ts      # Supabase client initialization
└── app/                     # Expo Router file-based routes
```

### Dependencies on Other Items
- 1.1 (monorepo initialized)
- 1.2 (Supabase Docker running — needed for Supabase client config)

### Success Criteria
```
[ ] Web app: `pnpm dev` opens on localhost:5173 with hot reload < 200ms
[ ] Mobile app: `npx expo start` opens with Expo Go / Dev Client
[ ] Web app can query local Supabase (fetch test data)
[ ] Mobile app can query local Supabase (fetch test data)
[ ] Path aliases (@/components, @/lib) resolve in both IDEs
[ ] Environment variables load correctly in both apps
[ ] Source maps work for debugging in Chrome/Safari DevTools
[ ] React Fast Refresh preserves component state on edit
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Expo Go limitations | Use development builds for native modules |
| Metro bundler issues | Clear cache script; document troubleshooting |
| CORS between web and Supabase | Configure Kong CORS headers |

### LLM Agent Launch Prompt

```
Configure the development environments for both web and mobile apps in the OhMyGold monorepo.

CONTEXT: OhMyGold has two frontend apps in a Turborepo: web (React 19 + Vite) and mobile (Expo + React Native). Both connect to a self-hosted Supabase instance running in Docker locally.

TASK:

FOR WEB (apps/web/):
1. Configure vite.config.ts with:
   - @/ path alias pointing to src/
   - Dev server proxy for /rest/* to localhost:54320 (Kong)
   - React Fast Refresh plugin
   - Source maps enabled for dev
2. Create src/lib/supabase.ts that initializes the Supabase client:
   - Reads URL and anon key from environment variables
   - Exports typed client using @supabase/supabase-js
3. Create .env.development with local Supabase connection details
4. Update tsconfig.json with baseUrl and paths for @/

FOR MOBILE (apps/mobile/):
1. Configure app.config.ts with:
   - App name, slug, version
   - Environment variables for Supabase URL and anon key
   - Expo Router plugin enabled
2. Create src/lib/supabase.ts (same pattern as web)
3. Create .env.development with local Supabase connection
4. Set up Expo Router with file-based routing:
   - app/_layout.tsx (root layout with providers)
   - app/index.tsx (home screen)
   - app/(auth)/login.tsx (auth route group)
5. Configure metro.config.js for monorepo compatibility

REQUIREMENTS:
- Both apps must successfully fetch data from local Supabase
- Create a simple test component in each app that displays a count from a Supabase table
- Path aliases must work in both TypeScript compilation and IDE (VS Code)
- Environment files must be gitignored

FILES TO CREATE/MODIFY:
- apps/web/vite.config.ts
- apps/web/tsconfig.json
- apps/web/.env.development
- apps/web/src/lib/supabase.ts
- apps/mobile/app.config.ts
- apps/mobile/tsconfig.json
- apps/mobile/.env.development
- apps/mobile/src/lib/supabase.ts
- apps/mobile/app/_layout.tsx
- apps/mobile/app/index.tsx
- apps/mobile/metro.config.js

VERIFICATION STEPS:
1. `pnpm dev` in web app — loads with hot reload
2. Web app test component displays data from Supabase
3. `npx expo start` in mobile app — loads in Expo Go
4. Mobile app test component displays data from Supabase
5. Edit a component in both apps — verify hot reload works

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Hot reload time (web): ___
- Any bundler issues: ___
- Supabase connection verified: Yes/No
```

---

## 1.5 Configure TypeScript Shared Packages

### Description and Scope
Set up the `packages/shared` TypeScript library with proper build configuration, exports for types, schemas, utilities, and constants. This package is the single source of truth for all shared code between web and mobile.

### Why This Matters
Type consistency across web and mobile prevents an entire class of bugs. When the API changes, both platforms get compile-time errors rather than runtime failures. Zod schemas shared between frontend forms and backend validation ensure data integrity.

### Technical Approach
TypeScript project references with `tsup` for fast bundling. Export structure: `types/` (auto-generated Supabase types + custom types), `schemas/` (Zod validation schemas), `utils/` (shared utility functions), `constants/` (app constants, enums), `i18n/` (translation key definitions). Generate Supabase types via `supabase gen types`.

### Files/Directories to Create/Modify
```
packages/shared/
├── package.json             # tsup build scripts, exports map
├── tsconfig.json            # Strict TypeScript config
├── tsup.config.ts           # Bundle config (ESM + CJS)
├── src/
│   ├── types/
│   │   ├── database.ts      # Auto-generated from Supabase
│   │   ├── auth.ts          # Auth-related types
│   │   └── gym.ts           # Domain types (member, class, booking)
│   ├── schemas/
│   │   ├── auth.ts          # Zod: login, register, password reset
│   │   └── member.ts        # Zod: member profile, enrollment
│   ├── utils/
│   │   ├── dates.ts         # Date formatting utilities
│   │   └── validation.ts    # Shared validation helpers
│   ├── constants/
│   │   ├── roles.ts         # User role enum definitions
│   │   └── permissions.ts   # Permission constants
│   └── index.ts             # Package exports
```

### Dependencies on Other Items
- 1.1 (monorepo structure)
- 1.2 (Supabase running — needed for type generation)

### Success Criteria
```
[ ] `pnpm build` in packages/shared produces ESM and CJS output
[ ] Types are importable: `import { Member } from '@ohmygold/shared/types'`
[ ] Zod schemas are importable: `import { loginSchema } from '@ohmygold/shared/schemas'`
[ ] Supabase types auto-generated from database schema
[ ] Both web and mobile can import from @ohmygold/shared
[ ] No TypeScript errors in shared package (strict mode)
[ ] Tree-shaking works (only imported code is bundled)
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Type generation breaking on schema changes | Auto-generate in CI; commit generated types |
| Circular dependencies | Enforce via ESLint rule; use barrel exports carefully |
| Package not resolving in consumer apps | Verify exports map in package.json |

### LLM Agent Launch Prompt

```
Configure the shared TypeScript packages for the OhMyGold monorepo.

CONTEXT: The @ohmygold/shared package is the single source of truth for types, validation schemas, and utilities shared between web and mobile apps.

TASK:
1. Set up packages/shared/ with:
   - tsup for fast TypeScript bundling (ESM + CJS outputs)
   - Strict TypeScript config (strict: true, noImplicitAny: true)
   - Proper exports map in package.json for subpath imports
2. Create directory structure with initial content:
   - src/types/ with: database.ts (Database type placeholder), auth.ts (UserRole enum, User type), gym.ts (Member, Class, Booking types)
   - src/schemas/ with: auth.ts (Zod loginSchema, registerSchema), member.ts (Zod memberProfileSchema)
   - src/utils/ with: dates.ts (formatDate, parseDate utilities), validation.ts (shared Zod helpers)
   - src/constants/ with: roles.ts (USER_ROLES enum), permissions.ts (PERMISSION_* constants)
   - src/index.ts (barrel exports)
3. Configure type generation from Supabase:
   - Add script: `pnpm gen:types` that runs `supabase gen types --lang=typescript --local > src/types/database.ts`
4. Ensure both web and mobile apps can import from @ohmygold/shared

FILES TO CREATE:
- packages/shared/package.json
- packages/shared/tsconfig.json
- packages/shared/tsup.config.ts
- packages/shared/src/types/database.ts
- packages/shared/src/types/auth.ts
- packages/shared/src/types/gym.ts
- packages/shared/src/schemas/auth.ts
- packages/shared/src/schemas/member.ts
- packages/shared/src/utils/dates.ts
- packages/shared/src/utils/validation.ts
- packages/shared/src/constants/roles.ts
- packages/shared/src/constants/permissions.ts
- packages/shared/src/index.ts

VERIFICATION STEPS:
1. Run `pnpm build` in packages/shared — verify ESM + CJS output
2. Import types from web app: `import type { Member } from '@ohmygold/shared'`
3. Import schemas from mobile: `import { loginSchema } from '@ohmygold/shared'`
4. Run `pnpm gen:types` — verify database.ts is generated
5. Ensure no TypeScript errors in shared package

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- tsup version: ___
- Build output verified: ESM/Yes, CJS/Yes
- Any import resolution issues: ___
```

---

## 1.6 Set up Linting, Formatting, Pre-commit Hooks

### Description and Scope
Configure ESLint (flat config), Prettier, and Husky + lint-staged pre-commit hooks. Enforce code quality across the entire monorepo with consistent rules for TypeScript, React, React Native, and import ordering.

### Why This Matters
Code quality tools catch bugs before they reach code review. Consistent formatting eliminates style debates. Pre-commit hooks ensure every commit meets quality standards — fixing issues in CI is too late.

### Technical Approach
ESLint flat config (eslint.config.js) with TypeScript ESLint, React hooks rules, import ordering, and accessibility rules (jsx-a11y). Prettier for formatting with consistent config across all packages. Husky for Git hooks, lint-staged to run checks only on changed files. Commitlint for conventional commit messages.

### Files/Directories to Create/Modify
```
eslint.config.js             # Flat config, monorepo-aware
.prettierrc                  # Shared formatting config
.husky/
├── pre-commit               # Runs lint-staged
└── commit-msg               # Runs commitlint
lint-staged.config.js        # Per-package lint commands
.commitlintrc.js             # Conventional commits
```

### Dependencies on Other Items
- 1.1 (monorepo initialized)

### Success Criteria
```
[ ] `pnpm lint` passes across all packages
[ ] `pnpm format` formats all files consistently
[ ] Pre-commit hook blocks commits with lint/type errors
[ ] Pre-commit hook auto-formats staged files with Prettier
[ ] Commit message hook validates conventional commit format
[ ] CI pipeline runs the same lint checks as pre-commit
[ ] VS Code extensions recommended in .vscode/extensions.json
[ ] .vscode/settings.json configures format-on-save
```

### Estimated Effort
1-2 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Pre-commit hooks too slow | Use lint-staged (only changed files); Turbo for parallel |
| React Native ESLint conflicts | Use @react-native/eslint-config with overrides |
| Team resistance to hooks | Document bypass method (`--no-verify` for emergencies) |

### LLM Agent Launch Prompt

```
Configure linting, formatting, and pre-commit hooks for the OhMyGold monorepo.

CONTEXT: OhMyGold is a Turborepo with React web, React Native mobile, and TypeScript shared packages. Uses pnpm workspaces.

TASK:
1. Create eslint.config.js (flat config) with:
   - @typescript-eslint/parser and recommended rules
   - react and react-hooks ESLint plugins
   - jsx-a11y plugin for accessibility rules
   - import ordering rules (alphabetical, groups)
   - React Native specific rules for apps/mobile
   - Override rules for specific directories if needed
2. Create .prettierrc with:
   - singleQuote: true, trailingComma: es5, semi: true, tabWidth: 2
   - printWidth: 100
3. Set up Husky pre-commit hook:
   - Install husky and lint-staged
   - Configure lint-staged to run ESLint and Prettier on staged files only
4. Set up commitlint for conventional commits (feat:, fix:, docs:, etc.)
5. Add VS Code workspace settings:
   - .vscode/extensions.json (recommended extensions)
   - .vscode/settings.json (format on save, ESLint auto-fix)
6. Add package.json scripts: lint, lint:fix, format, format:check

FILES TO CREATE:
- eslint.config.js (root)
- .prettierrc (root)
- lint-staged.config.js (root)
- .commitlintrc.js (root)
- .husky/pre-commit
- .husky/commit-msg
- .vscode/extensions.json
- .vscode/settings.json

VERIFICATION STEPS:
1. Run `pnpm lint` — should pass with no errors
2. Run `pnpm format` — should format all files
3. Create a test commit with lint error — verify pre-commit blocks it
4. Create a test commit with conventional message — verify passes
5. Verify VS Code formats on save

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- ESLint config type: Flat/Traditional
- Pre-commit hook avg time: ___ seconds
- Any rules disabled: ___
```

---

## 1.7 Initialize Database Schema (Migrations System)

### Description and Scope
Set up the Supabase migrations system with the initial database schema. Create migration files for core tables: users (extended profile), locations, membership_plans, members (enrollment), subscriptions, classes, class_schedules, bookings, access_logs, products, inventory, transactions, leads, campaigns, audit_logs, and role-permission junction tables. Include RLS policy stubs.

### Why This Matters
The database schema is the foundation of the entire application. All features, all screens, all APIs depend on the data model. A well-designed schema with proper relationships, indexes, and RLS policies from day one prevents costly migrations later.

### Technical Approach
Use Supabase CLI migrations (`supabase migration new`). Create tables with proper foreign keys, indexes, and triggers. Include `created_at`, `updated_at` timestamps on every table. Use `uuid` for primary keys. Add `created_by`/`updated_by` audit columns. Enable Row Level Security on all tables with stub policies (full policies in Phase 3). Create a `seed.sql` for development data.

### Files/Directories to Create/Modify
```
supabase/
├── migrations/
│   ├── 00000000000000_init.sql          # Enable extensions, schemas
│   ├── 00000000000001_roles.sql         # Role definitions, permissions
│   ├── 00000000000002_users.sql         # Extended user profiles
│   ├── 00000000000003_locations.sql     # Gym locations
│   ├── 00000000000004_memberships.sql   # Membership plans
│   ├── 00000000000005_members.sql       # Member enrollments
│   ├── 00000000000006_subscriptions.sql # Active subscriptions
│   ├── 00000000000007_classes.sql       # Class types and schedules
│   ├── 00000000000008_bookings.sql      # Class bookings and waitlist
│   ├── 00000000000009_access.sql        # Check-in logs, access control
│   ├── 00000000000010_billing.sql       # Invoices, payments
│   ├── 00000000000011_inventory.sql     # Products, stock levels
│   ├── 00000000000012_crm.sql           # Leads, pipeline stages
│   ├── 00000000000013_communications.sql # Campaigns, messages
│   ├── 00000000000014_audit.sql         # Audit log triggers
│   └── 00000000000015_functions.sql     # Database functions
└── seed.sql                             # Development seed data
```

### Dependencies on Other Items
- 1.2 (Supabase Docker running)

### Success Criteria
```
[ ] All migration files apply cleanly via `supabase db reset`
[ ] Schema matches permission matrix entity model
[ ] All tables have uuid primary keys, timestamps, audit columns
[ ] Foreign key relationships defined with ON DELETE rules
[ ] Indexes on frequently queried columns (email, role, location_id, etc.)
[ ] RLS enabled on all tables (stub policies returning true)
[ ] Seed data populates the database with 50+ test records
[ ] Generated types match the actual schema
```

### Estimated Effort
4-5 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Schema changes after other phases start | Freeze core schema after Phase 3; additive changes only |
| Migration ordering issues | Use timestamp prefixes; never modify applied migrations |
| Seed data becoming stale | Automate seed generation from schema |

### LLM Agent Launch Prompt

```
Initialize the OhMyGold database schema using Supabase migrations.

CONTEXT: OhMyGold is a gym management system for Gold's Gym France. The database needs tables for users (6 roles), locations, memberships, members, classes, bookings, access control, billing, inventory, CRM, communications, and audit logging.

TASK: Create Supabase migration files for the complete initial schema:

MIGRATION 1 (00000000000000_init.sql):
- Enable uuid-ossp, pgcrypto extensions
- Create schemas: public, auth (exists), storage (exists)

MIGRATION 2 (00000000000001_roles.sql):
- Create app_roles enum: 'admin', 'manager', 'employee', 'teacher', 'client', 'visitor'
- Create permissions table (id, code, description, category)
- Create role_permissions junction table
- Seed with the 6 roles and key permissions from the permission matrix

MIGRATION 3 (00000000000002_users.sql):
- user_profiles table extending auth.users:
  - id (uuid, FK to auth.users)
  - role (app_roles)
  - first_name, last_name, phone, avatar_url
  - location_id (nullable, FK to locations)
  - is_active (boolean, default true)
  - timestamps

MIGRATION 4 (00000000000003_locations.sql):
- locations table: id, name, address, city, postal_code, phone, email, timezone, opening_hours JSONB, settings JSONB, is_active, timestamps

MIGRATION 5 (00000000000004_memberships.sql):
- membership_plans table: id, location_id, name, description, price, billing_interval, features JSONB, is_active, timestamps

MIGRATION 6 (00000000000005_members.sql):
- members table: id, user_id (FK user_profiles), plan_id, enrollment_date, status, freeze_reason, freeze_until, timestamps

MIGRATION 7 (00000000000006_subscriptions.sql):
- subscriptions table: id, member_id, plan_id, status, start_date, end_date, next_billing_date, payment_method_id, timestamps

MIGRATION 8 (00000000000007_classes.sql):
- class_types table: id, location_id, name, description, duration, max_capacity, intensity, image_url, is_active
- class_schedules table: id, class_type_id, instructor_id, room, day_of_week, start_time, end_time, capacity, is_recurring, timestamps

MIGRATION 9 (00000000000008_bookings.sql):
- bookings table: id, schedule_id, member_id, status, booked_at, cancelled_at, cancellation_reason
- waitlist table: id, schedule_id, member_id, position, added_at, notified_at

MIGRATION 10 (00000000000009_access.sql):
- access_logs table: id, user_id, location_id, entry_time, exit_time, access_method (qr, rfid, manual)
- access_cards table: id, user_id, card_number, is_active, issued_at

MIGRATION 11 (00000000000010_billing.sql):
- invoices table: id, member_id, amount, status, due_date, paid_at, payment_method
- payments table: id, invoice_id, amount, status, processor_ref, processed_at

MIGRATION 12 (00000000000011_inventory.sql):
- products table: id, location_id, name, description, sku, category, price, cost, image_url
- inventory table: id, product_id, quantity, reorder_level, last_updated

MIGRATION 13 (00000000000012_crm.sql):
- leads table: id, first_name, last_name, email, phone, source, status, assigned_to, notes, timestamps
- pipeline_stages table: id, location_id, name, order_index, is_active

MIGRATION 14 (00000000000013_communications.sql):
- campaigns table: id, location_id, name, type, status, content, scheduled_at, sent_at
- messages table: id, campaign_id, recipient_id, channel, status, sent_at, opened_at

MIGRATION 15 (00000000000014_audit.sql):
- audit_logs table: id, table_name, record_id, action, old_data, new_data, performed_by, performed_at
- Create audit trigger function that logs all changes

MIGRATION 16 (00000000000015_functions.sql):
- Helper functions: update_updated_at(), generate_member_id(), check_capacity()

REQUIREMENTS:
- Every table: uuid primary key, created_at, updated_at
- Enable RLS on every table with stub policy (CREATE POLICY ... ON ... FOR ALL USING (true))
- Add appropriate indexes (email, role, location_id, status, date fields)
- Use proper ON DELETE rules (CASCADE where appropriate, SET NULL where not)
- Add CHECK constraints where applicable
- Include seed data for development (2 locations, 5 users with different roles, 3 class types, 5 products)

REFERENCE FILES:
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Feature List: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

FILES TO CREATE: All migration files listed above

VERIFICATION STEPS:
1. Run `supabase db reset` — all migrations apply cleanly
2. Verify schema in Supabase Studio
3. Verify seed data is present
4. Run `pnpm gen:types` — verify types are generated correctly
5. Verify RLS is enabled on all tables: `SELECT relname, relrowsecurity FROM pg_class WHERE relrowsecurity = true;`

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Total migrations created: ___
- Tables created: ___
- Any schema changes from spec: ___
- Seed data records: ___
```

---

## 1.8 Configure Caddy Reverse Proxy for Local Dev

### Description and Scope
Configure Caddy 2 as the local reverse proxy routing traffic to the web app (5173), Supabase Kong (54320), and Supabase Studio (54321). Provide automatic HTTPS for local development with internal certificates.

### Why This Matters
A reverse proxy provides a single entry point for all services, mimics the production architecture, and enables HTTPS locally (required for features like camera access, geolocation, and OAuth redirects). Caddy's automatic HTTPS simplifies certificate management.

### Technical Approach
Caddyfile with reverse_proxy directives for each service. Web app at `app.ohmygold.localhost`, Supabase API at `api.ohmygold.localhost`, Studio at `studio.ohmygold.localhost`. Internal TLS certificates via Caddy's local CA. Include a docker-compose.override.yml for Caddy container.

### Files/Directories to Create/Modify
```
docker/
├── Caddyfile                # Reverse proxy configuration
└── docker-compose.override.yml  # Caddy service addition
docker/caddy/Caddyfile       # Detailed route config
```

### Dependencies on Other Items
- 1.2 (Docker Compose for Supabase)
- 1.4 (dev environments — web needs proxying)

### Success Criteria
```
[ ] https://app.ohmygold.localhost serves the web app
[ ] https://api.ohmygold.localhost proxies to Supabase Kong
[ ] https://studio.ohmygold.localhost serves Supabase Studio
[ ] All routes work without SSL warnings (Caddy internal CA trusted)
[ ] WebSocket connections (Realtime) work through the proxy
[ ] Caddy auto-reloads config on file change
```

### Estimated Effort
1-2 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Local DNS resolution | Add to /etc/hosts; document for all OS |
| Caddy CA trust issues | Document how to trust Caddy's local CA |
| Port conflicts with existing services | Use high-numbered ports as fallback |

### LLM Agent Launch Prompt

```
Configure Caddy 2 as the local reverse proxy for OhMyGold development.

CONTEXT: OhMyGold runs multiple local services: web app (Vite, port 5173), Supabase Kong (port 54320), Supabase Studio (port 54321). A reverse proxy provides a unified HTTPS entry point.

TASK:
1. Create docker/caddy/Caddyfile with:
   - app.ohmygold.localhost → reverse_proxy web:5173
   - api.ohmygold.localhost → reverse_proxy kong:8000
   - studio.ohmygold.localhost → reverse_proxy studio:3000
   - WebSocket upgrade headers for Realtime
   - Internal TLS (Caddy auto-HTTPS with local CA)
   - Logging
2. Update docker/docker-compose.override.yml to add Caddy service:
   - Caddy container with Caddyfile mounted
   - Ports 80 and 443 exposed
   - Depends on: kong, studio
3. Update docker-compose.yml networks to include Caddy
4. Add /etc/hosts entries documentation
5. Add convenience script: `pnpm proxy:start`

REQUIREMENTS:
- HTTPS on all local domains (no browser warnings after trusting Caddy CA)
- WebSocket passthrough for Supabase Realtime
- WebSocket passthrough for Vite HMR
- Proper logging for debugging

FILES TO CREATE:
- docker/caddy/Caddyfile
- docker/docker-compose.override.yml

VERIFICATION STEPS:
1. Add `127.0.0.1 app.ohmygold.localhost api.ohmygold.localhost studio.ohmygold.localhost` to /etc/hosts
2. Run `pnpm proxy:start`
3. Visit https://app.ohmygold.localhost — loads web app
4. Visit https://api.ohmygold.localhost — Supabase API responds
5. Visit https://studio.ohmygold.localhost — Studio loads
6. Verify WebSocket connections work (check network tab)

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Caddy version: ___
- Any SSL issues: ___
- WebSocket passthrough verified: Yes/No
```

---

## 1.9 Set up Monitoring Infrastructure

### Description and Scope
Configure local monitoring with Grafana (dashboards), Prometheus (metrics), Loki (logs), and Alertmanager (alerts). Include pre-built dashboards for application health, API response times, error rates, and database performance.

### Why This Matters
"You can't improve what you don't measure." Monitoring from day one means performance issues are caught early, not discovered in production. Local monitoring also gives developers visibility into their code's behavior.

### Technical Approach
Grafana stack via Docker Compose extension. Prometheus scrapes metrics from web app, Supabase, and custom application metrics. Loki aggregates logs from all containers. Alertmanager configured for Slack/email alerts. Pre-built Grafana dashboards for: HTTP requests, database queries, authentication events, error tracking.

### Files/Directories to Create/Modify
```
docker/
├── docker-compose.monitoring.yml    # Grafana, Prometheus, Loki, Alertmanager
├── monitoring/
│   ├── grafana/
│   │   └── dashboards/
│   │       ├── ohmygold-overview.json
│   │       ├── api-performance.json
│   │       └── database-health.json
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── loki/
│   │   └── loki-config.yml
│   └── alertmanager/
│       └── alertmanager.yml
```

### Dependencies on Other Items
- 1.2 (Docker Compose base)

### Success Criteria
```
[ ] Grafana accessible at localhost:3001 with login
[ ] Prometheus targets all showing UP
[ ] Loki receiving logs from all containers
[ ] OhMyGold overview dashboard shows data
[ ] API performance dashboard shows request latencies
[ ] Database health dashboard shows query stats
[ ] Alertmanager configured (Slack webhook ready)
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Monitoring stack too heavy for dev machines | Make optional via separate compose file |
| Grafana data loss | Mount volumes for persistence |

### LLM Agent Launch Prompt

```
Set up the monitoring infrastructure for OhMyGold local development.

CONTEXT: OhMyGold needs observability from day one. Use Grafana stack (Grafana + Prometheus + Loki + Alertmanager) running in Docker.

TASK:
1. Create docker/docker-compose.monitoring.yml with:
   - Grafana (port 3001) with provisioning
   - Prometheus (port 9090) scraping targets
   - Loki (port 3100) for log aggregation
   - Alertmanager (port 9093) for alerts
   - All services on a shared monitoring network

2. Create monitoring configuration:
   - prometheus.yml: scrape jobs for web app, Supabase PostgreSQL, node exporter
   - loki-config.yml: log ingestion config
   - alertmanager.yml: route alerts to Slack webhook placeholder

3. Create Grafana dashboards:
   - ohmygold-overview.json: Service health, uptime, request rate
   - api-performance.json: Response times (p50, p95, p99), error rate, throughput
   - database-health.json: Connection count, query duration, slow queries

4. Add script: `pnpm monitoring:start` → docker compose -f docker-compose.monitoring.yml up -d

REQUIREMENTS:
- All dashboards should auto-provision on first start
- Prometheus retention: 15 days locally
- Loki retention: 7 days locally
- Use JSON model for dashboards (version controlled)
- Document how to access and use the monitoring stack

FILES TO CREATE:
- docker/docker-compose.monitoring.yml
- docker/monitoring/prometheus/prometheus.yml
- docker/monitoring/loki/loki-config.yml
- docker/monitoring/alertmanager/alertmanager.yml
- docker/monitoring/grafana/dashboards/ohmygold-overview.json
- docker/monitoring/grafana/dashboards/api-performance.json
- docker/monitoring/grafana/dashboards/database-health.json

VERIFICATION STEPS:
1. Run `pnpm monitoring:start`
2. Open http://localhost:3001 (Grafana)
3. Verify Prometheus targets: http://localhost:9090/targets
4. Verify dashboards are pre-loaded
5. Generate some traffic and verify metrics appear

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Grafana version: ___
- Dashboards verified: ___
- Any memory issues on dev machine: ___
```

---

## 1.10 Create Project Documentation Structure

### Description and Scope
Establish the documentation framework with README files, API documentation structure, architecture decision records (ADRs), onboarding guides, and a living changelog. Set up automated doc generation from TypeScript types and OpenAPI specs.

### Why This Matters
Documentation is not a Phase 9 afterthought — it's a living artifact that evolves with the codebase. Starting with a documentation structure ensures every decision is captured, every API is documented, and new developers can onboard in under an hour.

### Technical Approach
README at root with badges and quick start. `/docs` directory with subdirectories: `architecture/` (ADRs, system diagrams), `api/` (OpenAPI specs, auto-generated from Supabase), `guides/` (developer onboarding, deployment), `ops/` (runbooks, troubleshooting). Use TypeDoc for API docs from TypeScript comments. PlantUML or Mermaid for diagrams.

### Files/Directories to Create/Modify
```
README.md                        # Project overview, quick start, badges
docs/
├── README.md                    # Documentation index
├── architecture/
│   ├── 001-monorepo-structure.md    # ADR template
│   ├── 002-auth-strategy.md
│   └── 003-database-design.md
├── api/
│   └── openapi.yaml             # OpenAPI spec (auto-generated)
├── guides/
│   ├── developer-onboarding.md  # New dev setup guide
│   ├── local-development.md     # Detailed dev environment setup
│   └── deployment.md            # Deployment procedures
└── ops/
    ├── runbooks/
    │   ├── database-backup.md
    │   └── incident-response.md
    └── troubleshooting/
        ├── common-issues.md
        └── faq.md
```

### Dependencies on Other Items
- 1.1 through 1.9 (all preceding items inform documentation)

### Success Criteria
```
[ ] README.md has clear quick start (clone → running in < 10 min)
[ ] Developer onboarding guide verified by new team member
[ ] ADR template in place; at least 3 initial ADRs written
[ ] API documentation structure established
[ ] All major decisions captured in ADRs
[ ] Documentation builds and deploys (optional: GitHub Pages)
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Documentation becoming stale | Make docs part of Definition of Done |
| ADR process feeling bureaucratic | Lightweight format; focus on decisions |

### LLM Agent Launch Prompt

```
Create the project documentation structure for OhMyGold.

CONTEXT: OhMyGold is a complex gym management system. Documentation must serve developers, DevOps, and future maintainers.

TASK:
1. Create root README.md with:
   - Project description and logo placeholder
   - Tech stack badges (React, React Native, Supabase, TypeScript)
   - Quick start: clone, install, dev environment up (5-10 steps)
   - Link to full documentation in /docs
   - Contributing guidelines link
   - License section

2. Create documentation structure:
   - docs/README.md — Documentation index with navigation
   - docs/architecture/ADR-TEMPLATE.md — Architecture Decision Record template
   - docs/architecture/001-monorepo-structure.md — Why Turborepo + pnpm
   - docs/architecture/002-auth-strategy.md — Auth architecture (Supabase Auth + OAuth + RBAC)
   - docs/architecture/003-database-design.md — Schema overview with entity diagram
   - docs/guides/developer-onboarding.md — Step-by-step for new developers
   - docs/guides/local-development.md — Detailed environment setup
   - docs/guides/deployment.md — Staging and production deployment
   - docs/ops/runbooks/database-backup.md — Backup and restore procedures
   - docs/ops/runbooks/incident-response.md — Incident response playbook
   - docs/ops/troubleshooting/common-issues.md — Known issues and fixes

3. Add package.json scripts:
   - `pnpm docs:serve` — Serve docs locally (if using a doc generator)
   - `pnpm docs:build` — Build documentation

REQUIREMENTS:
- Use Mermaid syntax for diagrams (renders in GitHub)
- Keep ADRs concise: context, decision, consequences
- Developer onboarding should be testable: a new dev can follow it
- All docs written in Markdown
- Include table of contents in each doc

FILES TO CREATE:
- README.md (root)
- docs/README.md
- docs/architecture/ADR-TEMPLATE.md
- docs/architecture/001-monorepo-structure.md
- docs/architecture/002-auth-strategy.md
- docs/architecture/003-database-design.md
- docs/guides/developer-onboarding.md
- docs/guides/local-development.md
- docs/guides/deployment.md
- docs/ops/runbooks/database-backup.md
- docs/ops/runbooks/incident-response.md
- docs/ops/troubleshooting/common-issues.md

VERIFICATION STEPS:
1. README renders correctly on GitHub
2. All internal links work
3. Mermaid diagrams render
4. Follow onboarding guide from clean machine (or container)
5. Verify all docs are in Markdown with consistent formatting

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Docs created: ___
- Mermaid diagrams verified: ___
- Onboarding steps tested: ___
```

---

## Phase 1 Completion Checklist

```
[ ] 1.1 Monorepo initialized with Turborepo + pnpm
[ ] 1.2 Supabase Docker Compose running locally
[ ] 1.3 CI/CD pipeline with lint, build, deploy workflows
[ ] 1.4 Web and mobile dev environments with hot reload
[ ] 1.5 TypeScript shared packages building and importable
[ ] 1.6 Linting, formatting, pre-commit hooks active
[ ] 1.7 Database schema with 16 migration files applied
[ ] 1.8 Caddy reverse proxy with HTTPS for local dev
[ ] 1.9 Monitoring stack (Grafana, Prometheus, Loki) running
[ ] 1.10 Project documentation structure established
[ ] CI pipeline passing (green build)
[ ] All developers can run `pnpm dev` successfully
[ ] Database migrations apply cleanly with seed data
[ ] Code quality tools (lint, format, typecheck) running on every commit
[ ] Monitoring dashboards accessible and showing data
```

---

*Phase 1 notes: This is the foundation. Every hour spent getting this right saves 10 hours later. Do not rush. Verify everything works before moving to Phase 2.*

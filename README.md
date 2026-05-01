# OhMyGold — Gold's Gym France 🏋️

> **All-in-one gym management system** — bookings, memberships, POS, CRM, access control, and analytics for Gold's Gym France.

[![CI](https://github.com/mitchlabeetch/OhMyGoldv2/actions/workflows/ci.yml/badge.svg)](https://github.com/mitchlabeetch/OhMyGoldv2/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node 22](https://img.shields.io/badge/Node-22-green.svg)](https://nodejs.org)
[![pnpm 9](https://img.shields.io/badge/pnpm-9-blue.svg)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/built_with-Turborepo-EF4444.svg)](https://turbo.build)

---

## 📦 Monorepo Structure

```
OhMyGoldv2/
├── apps/
│   ├── web/          # Next.js/Vite web app (React 18 + Tailwind)
│   └── mobile/       # Expo SDK 52 mobile app (React Native)
├── packages/
│   ├── shared/       # Shared types, schemas, utilities (tsup ESM+CJS)
│   ├── ui-shared/    # Shared UI components (web + native)
│   └── tsconfig/     # Shared TypeScript configs
├── supabase/
│   └── migrations/   # 22 ordered PostgreSQL migrations
├── docker/           # Self-hosted Supabase stack
│   ├── docker-compose.yml
│   └── volumes/      # Init scripts and Kong config
└── _audit_recovery/  # Architecture audit documents
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 22+ ([nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- **pnpm** 9+ (`npm install -g pnpm`)
- **Docker Desktop** (for local Supabase)

### 1. Clone & Install

```bash
git clone https://github.com/mitchlabeetch/OhMyGoldv2.git
cd OhMyGoldv2
pnpm install
```

### 2. Configure Environment

```bash
# Web app
cp apps/web/.env.example apps/web/.env.local

# Mobile app
cp apps/mobile/.env.example apps/mobile/.env

# Docker / Supabase
cp docker/.env.example docker/.env
```

Fill in your Supabase project URL, anon key, and other secrets.

### 3. Start Local Supabase (Docker)

```bash
cd docker
docker compose up -d
```

This starts: PostgreSQL 16, Kong, GoTrue (Auth), PostgREST, Realtime, Storage.

### 4. Run Database Migrations

```bash
pnpm supabase db push
# or with the Supabase CLI:
supabase db push --db-url postgresql://supabase:your-password@localhost:54322/postgres
```

### 5. Start Development

```bash
# Start all apps in parallel
pnpm dev

# Or start individually:
pnpm --filter @ohmygold/web dev     # Web: http://localhost:5173
pnpm --filter @ohmygold/mobile dev  # Mobile: Expo DevTools
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in parallel |
| `pnpm build` | Build all packages and apps |
| `pnpm typecheck` | TypeScript type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm test` | Run all test suites |
| `pnpm clean` | Remove all build artifacts |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Mobile App | Expo SDK 52, React Native, Expo Router |
| Shared UI | `@ohmygold/ui-shared` (web + `.native.tsx` variants) |
| Backend | Supabase (PostgreSQL 16, GoTrue, PostgREST, Realtime) |
| Auth | Supabase Auth + RBAC (10-role hybrid model) |
| State | Zustand + TanStack Query |
| i18n | i18next (French 🇫🇷 + English 🇬🇧) |
| Build | Turborepo + tsup (ESM + CJS dual output) |
| Infra | Docker Compose + Kong API Gateway |

---

## 🔑 Role System (RBAC)

OhMyGold uses a **10-role hybrid model** with backward-compatible legacy aliases:

| Role | Description | Legacy Alias |
|------|-------------|--------------|
| `super_admin` | Full system access across all gyms | — |
| `admin` | Full access to a specific gym location | — |
| `manager` | Location-level management | — |
| `employee` | Front-desk operations + check-in | `receptionist` |
| `teacher` | Class management + roster access | `coach` |
| `client` | Registered paying gym member | `member` |
| `visitor` | Unauthenticated / trial user | — |

---

## 🗄️ Database Migrations

Migrations are applied in order from `supabase/migrations/`:

| # | Migration | Description |
|---|-----------|-------------|
| 0001 | extensions_and_types | Extensions, enums |
| 0002–0014 | Core tables | Members, plans, classes, bookings, payments, access, notifications, audit, storage |
| 0015 | seed_dev_data | Development seed data |
| 0016–0021 | Feature extensions | Facility zones, enhanced plans, CRM, POS |
| 0022 | rls_helpers | Role enum extension + SECURITY DEFINER helper functions + security-barrier views |

---

## 🔒 Security Notes

- **Service role key** is NEVER exposed to client bundles (`VITE_` prefix is forbidden for service keys)
- All sensitive views use `WITH (security_barrier = true)`
- RLS is enabled on all tables; helper functions are `SECURITY DEFINER`
- Sessions use `sessionStorage` on web (not `localStorage`)
- Mobile uses `expo-secure-store` for token storage

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit using conventional commits: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

Pre-commit hooks (Husky + lint-staged) will run ESLint and Prettier automatically.

---

## 📄 License

MIT © 2024 OhMyGold / Gold's Gym France



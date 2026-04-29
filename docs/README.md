# OhMyGold Developer Documentation

> **Gold's Gym France — All-in-One Gym Management System**  
> Monorepo: `apps/web` (React 19 + Vite) + `apps/mobile` (Expo SDK 52)  
> Backend: Self-hosted Supabase (PostgreSQL 16 + GoTrue + Realtime + Storage)

---

## Quick Start

```bash
# 1. Clone & install dependencies
git clone https://github.com/mitchlabeetch/OhMyGoldv2
cd OhMyGoldv2
pnpm install

# 2. Start Supabase locally
cd docker && cp .env.example .env  # Fill in values
docker compose up -d

# 3. Apply migrations
for f in supabase/migrations/*.sql; do
  psql "postgresql://supabase:your-password@localhost:54322/postgres" -f "$f"
done

# 4. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 5. Start development
pnpm dev
```

**Web App:** http://localhost:5173  
**Supabase Studio:** http://localhost:54321  
**PostgreSQL:** localhost:54322  

---

## Architecture

See `ohmygold/team3_technical_architecture/ARCHITECTURE.md` for the full technical architecture document.

```
OhMyGoldv2/
├── apps/
│   ├── web/          # React 19 + Vite + Tailwind (PWA)
│   └── mobile/       # Expo SDK 52 + Expo Router v3
├── packages/
│   ├── shared/       # TypeScript types, schemas, utils
│   ├── ui-shared/    # Design tokens + UI components
│   └── tsconfig/     # Shared TypeScript configs
├── supabase/
│   └── migrations/   # 15 PostgreSQL migrations
├── docker/           # Self-hosted Supabase Docker Compose
└── docs/             # This documentation
```

---

## Development Workflow

### pnpm Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + mobile in parallel |
| `pnpm build` | Build all packages (production) |
| `pnpm lint` | ESLint across all packages |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm test` | Run unit tests |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting (CI) |

### Per-App Scripts

```bash
pnpm --filter=@ohmygold/web dev
pnpm --filter=@ohmygold/mobile start
pnpm --filter=@ohmygold/shared build
```

---

## Environment Variables

### Web App (`apps/web/.env.local`)

```env
VITE_SUPABASE_URL=http://localhost:54320
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Mobile App (`apps/mobile/.env`)

```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54320
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Implementation Phases

| Phase | Status | Description |
|-------|--------|-------------|
| P1 — Foundation | ✅ | Monorepo, Docker, migrations, CI/CD |
| P2 — Design System | ✅ | Tokens, UI components, i18n |
| P3 — Authentication | ✅ | Auth flows, RBAC, RLS, MFA |
| P4 — Core Gym | 🔜 | Members, classes, bookings, payments |
| P5 — Web Screens | 🔜 | Full web app screens per role |
| P6 — Mobile App | 🔜 | Full mobile app screens |
| P7 — Advanced | 🔜 | Analytics, exports, integrations |
| P8 — Compliance | 🔜 | RGPD, security audit |
| P9 — Deploy | 🔜 | Production VPS deployment |

---

## User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| `super_admin` | Full system access | All |
| `admin` | Full gym access | All except multi-gym |
| `coach` | Class management | Classes, member read |
| `receptionist` | Front desk | Members, check-in, payments |
| `member` | Gym member | Own bookings, own payments |
| `visitor` | Trial/public | Class list, locations |

---

## Links

- [Architecture](../ohmygold/team3_technical_architecture/ARCHITECTURE.md)
- [Master Roadmap](../ohmygold/team3_technical_architecture/roadmap/00_master_roadmap.md)
- [Design System](../ohmygold/team1_golds_gym_resource_base/DESIGN.MD)
- [Permission Matrix](../ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md)
- [Migration Registry](../supabase/migrations/README.md)
- [Docker Setup](../docker/.env.example)

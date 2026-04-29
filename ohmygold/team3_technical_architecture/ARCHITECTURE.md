# OhMyGold — Technical Architecture Document

> **Project:** OhMyGold — Gold's Gym France All-in-One Gym Management System
> **Version:** 1.0.0
> **Date:** April 2026
> **Status:** [DRAFT] — Single Source of Technical Truth
> **Audience:** Engineering teams, DevOps, Security auditors, QA

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Tech Stack — Complete with Versions](#2-tech-stack--complete-with-versions)
3. [Database Schema Design](#3-database-schema-design)
4. [API Design](#4-api-design)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Real-Time Architecture](#6-real-time-architecture)
7. [Security Architecture](#7-security-architecture)
8. [i18n & Localization Architecture](#8-i18n--localization-architecture)
9. [Accessibility Architecture](#9-accessibility-architecture)
10. [Performance Architecture](#10-performance-architecture)
11. [Offline-First Architecture (Mobile)](#11-offline-first-architecture-mobile)
12. [Testing Strategy](#12-testing-strategy)
13. [File Structure](#13-file-structure)
14. [Shared Code Strategy](#14-shared-code-strategy)
15. [DevOps & Deployment](#15-devops--deployment)
16. [Risk Assessment & Mitigation](#16-risk-assessment--mitigation)
17. [Technology Decisions Log](#17-technology-decisions-log)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                        CDN (Cloudflare)                  │
                    │           Static Assets · DDoS Protection · WAF          │
                    └───────────────────────┬─────────────────────────────────┘
                                            │
                    ┌───────────────────────▼─────────────────────────────────┐
                    │              VPS — Hetzner/DigitalOcean                  │
                    │            Ubuntu 24.04 LTS · Single Host               │
                    │                                                         │
                    │  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐ │
                    │  │   Caddy 2    │  │  Docker     │  │   Monitoring  │ │
                    │  │  Reverse     │  │  Compose    │  │  (Grafana +   │ │
                    │  │  Proxy +     │  │  (All Svcs) │  │  Prometheus)  │ │
                    │  │  Auto HTTPS  │  │             │  │               │ │
                    │  └──────┬───────┘  └──────┬──────┘  └───────────────┘ │
                    │         │                  │                           │
                    │  ┌──────▼──────────────────▼──────────────────────────┐ │
                    │  │         Docker Internal Network (172.20.0.0/16)    │ │
                    │  │                                                     │ │
                    │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
                    │  │  │   Web    │ │  Mobile  │ │   API    │           │ │
                    │  │  │  (React) │ │  (Expo)  │ │ (Edge Fn)│           │ │
                    │  │  │  :3000   │ │  :19000  │ │  :54321  │           │ │
                    │  │  └──────────┘ └──────────┘ └──────────┘           │ │
                    │  │                                                     │ │
                    │  │  ┌──────────────────────────────────────────────┐   │ │
                    │  │  │         Supabase Platform (Docker)           │   │ │
                    │  │  │                                              │   │ │
                    │  │  │  ┌──────────────┐    ┌─────────────────┐    │   │ │
                    │  │  │  │  PostgreSQL  │    │   GoTrue (Auth)   │    │   │ │
                    │  │  │  │     :5432    │◄───│    :9999         │    │   │ │
                    │  │  │  └──────────────┘    └─────────────────┘    │   │ │
                    │  │  │         │                                     │   │ │
                    │  │  │  ┌──────▼──────┐  ┌───────────┐  ┌────────┐ │   │ │
                    │  │  │  │   PostgREST  │  │ Realtime  │  │Storage │ │   │ │
                    │  │  │  │    :3001    │  │   :4000   │  │ :5000  │ │   │ │
                    │  │  │  └──────────────┘  └───────────┘  └────────┘ │   │ │
                    │  │  │                                              │   │ │
                    │  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │ │
                    │  │  │  │  Kong GW  │  │  Redis   │  │  MinIO   │   │   │ │
                    │  │  │  │  :8000   │  │  :6379   │  │  :9000   │   │   │ │
                    │  │  │  └──────────┘  └──────────┘  └──────────┘   │   │ │
                    │  │  └──────────────────────────────────────────────┘   │ │
                    │  └──────────────────────────────────────────────────────┘ │
                    └───────────────────────────────────────────────────────────┘
```

### 1.2 Microservices vs Monolith Decision

| Approach | Recommendation | Rationale |
|----------|---------------|-----------|
| **Architecture** | Modular Monolith | Single VPS constraint; simpler deployment, debugging, and data consistency |
| Future Evolution | Service extraction at API boundaries | If a module exceeds resource limits, extract to separate container |
| Communication | In-process (within Supabase) + REST | Supabase Realtime for pub/sub, Edge Functions for HTTP endpoints |

**Decision Rationale:**

- **Single VPS constraint** mandates co-location of all services
- **Data consistency** is critical for gym operations (billing, access control, bookings)
- **Team size** — modular monolith is faster for small-to-medium teams
- **Deployment simplicity** — one Docker Compose file, one backup strategy
- **Module boundaries** — clear separation via Edge Functions + database schemas enables future extraction

### 1.3 Data Flow Overview

```
Client Request Flow:
  [Browser/App] ──HTTPS──► [Cloudflare CDN] ──► [Caddy 2] ──► [Supabase Kong]
                                                                  │
                    ┌─────────────────────────────────────────────┼──────┐
                    │                                             │      │
                    ▼                                             ▼      ▼
              [PostgREST]                                  [Realtime]  [Edge Functions]
                    │                                             │      │
                    ▼                                             ▼      ▼
              [PostgreSQL] ◄────Row Level Security─────►  [Pub/Sub]   [Deno Runtime]
                    │
                    ▼
              [Redis Cache]
```

### 1.4 Deployment Architecture

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| Caddy Reverse Proxy | Caddy 2 | 80/443 | TLS termination, reverse proxy, auto-HTTPS |
| Supabase Kong | Kong Gateway | 8000 | API gateway, rate limiting, routing |
| PostgreSQL | PostgreSQL 16 | 5432 | Primary database (with RLS) |
| PostgREST | PostgREST 12 | 3001 | Auto-generated REST API from DB schema |
| GoTrue | Supabase Auth | 9999 | Authentication service (JWT, OAuth) |
| Realtime | Elixir/Phoenix | 4000 | WebSocket subscriptions |
| Storage | MinIO (S3-compatible) | 9000 | File/object storage |
| Edge Functions | Deno runtime | 54321 | Serverless TypeScript functions |
| Redis | Redis 7 | 6379 | Caching, session store, rate limiting |
| Web App | React (Vite) | 3000 | Static SPA served via Caddy |
| Monitoring | Grafana + Prometheus | 9090/3001 | Metrics, dashboards |

### 1.5 Scaling Strategy

| Phase | Trigger | Action |
|-------|---------|--------|
| **Phase 1** (Launch) | < 5,000 members, 1-2 locations | Single VPS as described |
| **Phase 2** | > 5,000 members or 3+ locations | Vertical scaling (larger VPS) + read replica |
| **Phase 3** | > 20,000 members or 10+ locations | Horizontal: split web/app to separate VPS, managed DB |
| **Phase 4** | Franchise scale | Kubernetes cluster, managed Supabase Cloud, multi-region |

---

## 2. Tech Stack — Complete with Versions

### 2.1 Frontend Web

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **React** | ^19.0.0 | UI framework | Declarative, component-based, massive ecosystem |
| **TypeScript** | ^5.7.0 | Type safety | Catch errors at compile time, better DX, self-documenting |
| **Vite** | ^7.2.0 | Build tool | Fast HMR, optimized builds, ESM-native |
| **Tailwind CSS** | ^3.4.19 | Utility-first styling | Rapid development, consistent design system, small bundle |
| **shadcn/ui** | ^2.0.0 | UI component primitives | Accessible, customizable, no runtime dependency |
| **Radix UI** | ^1.1.0 | Headless UI primitives | WAI-ARIA compliant, unstyled, accessible |
| **React Router** | ^7.0.0 | Client-side routing | Declarative routing, data loaders, nested routes |
| **Zustand** | ^5.0.0 | Global state management | Lightweight (1KB), TypeScript-first, no boilerplate |
| **TanStack Query** | ^5.62.0 | Server state management | Powerful caching, background sync, stale-while-revalidate |
| **React Hook Form** | ^7.54.0 | Form management | Performant, minimal re-renders, easy validation |
| **Zod** | ^3.24.0 | Schema validation | TypeScript-first validation, shared schemas between FE/BE |
| **Recharts** | ^2.15.0 | Data visualization | React-native charting, composable, D3-based |
| **date-fns** | ^4.1.0 | Date manipulation | Tree-shakeable, FP-friendly, i18n support |
| **react-i18next** | ^15.4.0 | i18n framework | Mature, supports ICU format, react-intl migration path |
| **Framer Motion** | ^12.0.0 | Animations | Declarative, performant, accessible (respects reduced motion) |
| **Lucide React** | ^0.468.0 | Icon library | Lightweight, tree-shakeable, consistent style |

### 2.2 Mobile (iOS & Android)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **React Native** | ^0.76.0 | Cross-platform native | Shared codebase for iOS/Android, native performance |
| **Expo SDK** | ^52.0.0 | Development framework | OTA updates, managed workflow, rich native API access |
| **Expo Router** | ^4.0.0 | File-based navigation | Type-safe routing, deep linking, native stack |
| **React Navigation** | ^7.0.0 | Navigation (fallback) | Industry standard, native feel, gesture support |
| **NativeWind** | ^4.1.0 | Tailwind for RN | Share Tailwind config with web, utility-first |
| **Zustand** | ^5.0.0 | Global state | Same as web — share stores |
| **TanStack Query** | ^5.62.0 | Server state | Same as web — share hooks |
| **React Hook Form** | ^7.54.0 | Forms | Same as web — share validation logic |
| **Zod** | ^3.24.0 | Validation | Same as web — share schemas |
| **expo-notifications** | ^0.29.0 | Push notifications | Cross-platform push (APNs + FCM) |
| **expo-camera** | ^16.0.0 | Camera access | Issue reporting photos, QR/barcode scanning |
| **expo-local-authentication** | ^16.0.0 | Biometrics | Face ID / fingerprint login |
| **expo-secure-store** | ^14.0.0 | Encrypted local storage | JWT tokens, sensitive data |
| **AsyncStorage** | ^2.1.0 | Unencrypted local storage | Cache, preferences, offline data |
| **react-native-maps** | ^1.20.0 | Maps integration | Gym location, GPS check-in verification |
| **react-native-chart-kit** | ^6.12.0 | Charts for mobile | Progress visualization, attendance stats |
| **react-native-calendars** | ^1.1300.0 | Calendar views | Class scheduling, booking management |
| **react-native-reanimated** | ^3.16.0 | Native animations | 60fps animations, worklet-based |
| **expo-image** | ^2.0.0 | Optimized image loading | WebP, caching, placeholder support |

### 2.3 Backend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Supabase** | Self-hosted (Docker) | Backend-as-a-Platform | PostgreSQL + Auth + Realtime + Storage in one |
| **PostgreSQL** | 16 | Primary database | ACID compliance, RLS, full-text search, JSON support |
| **Supabase Auth (GoTrue)** | Self-hosted | Authentication | JWT management, OAuth providers, MFA-ready |
| **Supabase Realtime** | Self-hosted | WebSocket pub/sub | Elixir-based, low-latency, presence support |
| **Supabase Storage (MinIO)** | Self-hosted | File storage | S3-compatible, presigned URLs, bucket policies |
| **Supabase Edge Functions** | Deno runtime | Serverless functions | TypeScript, close-to-data, HTTP endpoints |
| **PostgREST** | 12 | Auto REST API | Generates REST API from DB schema, respects RLS |
| **Redis** | 7 | Cache, sessions, rate limit | In-memory speed, pub/sub, data structures |
| **pg-boss** | ^10.1.0 | Background job queue | PostgreSQL-backed, reliable, cron support |
| **Meilisearch** | ^1.12.0 | Search engine (Phase 2) | Typo-tolerant, faceted search, French language support |

### 2.4 Infrastructure

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **VPS Host** | Hetzner/DigitalOcean | Cloud hosting | Cost-effective, EU data centers (GDPR) |
| **OS** | Ubuntu 24.04 LTS | Server OS | LTS stability, Docker support, security patches |
| **Caddy** | 2 | Reverse proxy + HTTPS | Auto-TLS via Let's Encrypt, simple config |
| **Docker** | 27.x | Containerization | Consistent environments, easy deployment |
| **Docker Compose** | 2.31 | Multi-container orchestration | Single-file stack definition |
| **Grafana** | 11.4 | Metrics visualization | Rich dashboards, alerting |
| **Prometheus** | 3.0 | Metrics collection | Time-series, queryable, exporter ecosystem |
| **Uptime Kuma** | ^1.23.0 | Uptime monitoring | Simple, push notifications on downtime |
| **Restic** | ^0.17.0 | Backup tool | Deduplicated, encrypted, S3-compatible backups |
| **GitHub Actions** | N/A | CI/CD | Automated testing, building, deployment |

---


> **Version Verification Date:** April 2026. All versions pinned with exact semantic versions.
> **Policy:** Dependencies are reviewed monthly. Security patches applied within 48 hours.
> **versions.lock:** A `versions.lock` file is maintained at repo root with exact resolved versions.
> **Upgrade cadence:** Minor versions quarterly, major versions after 4-week evaluation period.

## 3. Database Schema Design

### 3.1 Schema Overview

All tables use `uuid` primary keys (v7 for time-sortable UUIDs). Every table has Row Level Security (RLS) enabled by default. Audit triggers record `created_at`, `updated_at`, `created_by`, `updated_by`.

### 3.2 Core Tables

#### `users` — Platform Users (all roles)

```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT NOT NULL UNIQUE,
  phone                 TEXT,
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  avatar_url            TEXT,
  role                  TEXT NOT NULL CHECK (role IN ('admin','manager','employee','teacher','client','visitor')),
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended','pending')),
  email_confirmed_at    TIMESTAMPTZ,
  phone_confirmed_at    TIMESTAMPTZ,
  last_sign_in_at       TIMESTAMPTZ,
  metadata              JSONB DEFAULT '{}',
  gdpr_consent_given    BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent_at       TIMESTAMPTZ,
  marketing_consent     BOOLEAN NOT NULL DEFAULT FALSE,
  locale                TEXT NOT NULL DEFAULT 'fr',
  timezone              TEXT NOT NULL DEFAULT 'Europe/Paris',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ  -- soft delete for GDPR
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
```

**RLS Policy:** Users can read their own record. Admins can read all. Managers can read users at their assigned locations.

#### `locations` — Gym Locations

```sql
CREATE TABLE locations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  address               TEXT NOT NULL,
  city                  TEXT NOT NULL,
  postal_code           TEXT NOT NULL,
  country               TEXT NOT NULL DEFAULT 'FR',
  latitude              DECIMAL(10,8),
  longitude             DECIMAL(11,8),
  phone                 TEXT,
  email                 TEXT,
  timezone              TEXT NOT NULL DEFAULT 'Europe/Paris',
  operating_hours       JSONB NOT NULL DEFAULT '{}',
  capacity_total        INTEGER NOT NULL DEFAULT 200,
  capacity_per_zone     JSONB DEFAULT '{}',
  access_control_config JSONB DEFAULT '{}',
  settings              JSONB DEFAULT '{}',
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance','upcoming')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_status ON locations(status);
```

#### `user_locations` — User-Location Assignment (many-to-many)

```sql
CREATE TABLE user_locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id   UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by   UUID REFERENCES users(id),
  UNIQUE(user_id, location_id)
);

CREATE INDEX idx_user_locations_user ON user_locations(user_id);
CREATE INDEX idx_user_locations_location ON user_locations(location_id);
```

#### `subscription_plans` — Membership Tiers

```sql
CREATE TABLE subscription_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id       UUID REFERENCES locations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL,
  description       TEXT,
  tier              TEXT NOT NULL CHECK (tier IN ('basic','flex','premium','visitor')),
  price_weekly      DECIMAL(10,2) NOT NULL,
  price_monthly     DECIMAL(10,2),
  price_yearly      DECIMAL(10,2),
  currency          TEXT NOT NULL DEFAULT 'EUR',
  billing_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (billing_frequency IN ('weekly','monthly','yearly')),
  features          JSONB NOT NULL DEFAULT '{}',
  included_services JSONB DEFAULT '{}',
  max_bookings_week INTEGER DEFAULT 999,
  allows_guests     BOOLEAN NOT NULL DEFAULT FALSE,
  guest_passes_month INTEGER DEFAULT 0,
  freeze_allowed    BOOLEAN NOT NULL DEFAULT TRUE,
  freeze_max_days   INTEGER DEFAULT 30,
  cancellation_notice_days INTEGER DEFAULT 56,
  is_public         BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(location_id, slug)
);

CREATE INDEX idx_subscription_plans_location ON subscription_plans(location_id);
CREATE INDEX idx_subscription_plans_tier ON subscription_plans(tier);
CREATE INDEX idx_subscription_plans_status ON subscription_plans(status);
```

#### `memberships` — Active Member Subscriptions

```sql
CREATE TABLE memberships (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id             UUID NOT NULL REFERENCES locations(id),
  plan_id                 UUID NOT NULL REFERENCES subscription_plans(id),
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','frozen','cancelled','expired','pending','trial')),
  start_date              DATE NOT NULL,
  end_date                DATE,
  next_billing_date       DATE,
  freeze_start_date       DATE,
  freeze_end_date         DATE,
  cancellation_date       DATE,
  cancellation_reason     TEXT,
  payment_method_id       UUID,
  auto_renew              BOOLEAN NOT NULL DEFAULT TRUE,
  trial_ends_at           TIMESTAMPTZ,
  price_override          DECIMAL(10,2),
  metadata                JSONB DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_location ON memberships(location_id);
CREATE INDEX idx_memberships_next_billing ON memberships(next_billing_date);
```

#### `payments` — Payment Records

```sql
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  membership_id     UUID REFERENCES memberships(id),
  location_id       UUID NOT NULL REFERENCES locations(id),
  amount            DECIMAL(10,2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'EUR',
  status            TEXT NOT NULL CHECK (status IN ('pending','completed','failed','refunded','disputed')),
  payment_method    TEXT NOT NULL CHECK (payment_method IN ('card','sepa','cash','transfer','apple_pay','google_pay')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id  TEXT,
  description       TEXT,
  failure_reason    TEXT,
  refunded_amount   DECIMAL(10,2) DEFAULT 0,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);
```

#### `classes` — Class Types

```sql
CREATE TABLE classes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id       UUID NOT NULL REFERENCES locations(id),
  name              TEXT NOT NULL,
  description       TEXT,
  duration_minutes  INTEGER NOT NULL DEFAULT 60,
  max_capacity      INTEGER NOT NULL DEFAULT 20,
  intensity_level   TEXT CHECK (intensity_level IN ('low','medium','high','extreme')),
  category          TEXT NOT NULL CHECK (category IN ('cardio','strength','yoga','hiit','spin','boxing','pilates','dance','mindbody','special')),
  required_tier     TEXT DEFAULT 'basic' CHECK (required_tier IN ('basic','flex','premium')),
  equipment_needed  JSONB DEFAULT '[]',
  image_url         TEXT,
  color_code        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classes_location ON classes(location_id);
CREATE INDEX idx_classes_category ON classes(category);
CREATE INDEX idx_classes_active ON classes(is_active);
```

#### `class_schedules` — Scheduled Class Instances

```sql
CREATE TABLE class_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id        UUID NOT NULL REFERENCES classes(id),
  location_id     UUID NOT NULL REFERENCES locations(id),
  teacher_id      UUID REFERENCES users(id),
  room            TEXT NOT NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  capacity        INTEGER NOT NULL DEFAULT 20,
  booked_count    INTEGER NOT NULL DEFAULT 0,
  waitlist_count  INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','cancelled','completed','in_progress')),
  recurrence_rule TEXT,  -- iCal RRULE for recurring
  parent_schedule_id UUID REFERENCES class_schedules(id), -- for recurring instances
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_class_schedules_class ON class_schedules(class_id);
CREATE INDEX idx_class_schedules_time ON class_schedules(start_time);
CREATE INDEX idx_class_schedules_teacher ON class_schedules(teacher_id);
CREATE INDEX idx_class_schedules_status ON class_schedules(status);
```

#### `bookings` — Class Bookings

```sql
CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  schedule_id     UUID NOT NULL REFERENCES class_schedules(id),
  status          TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','no_show','waitlist','attended')),
  booked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at    TIMESTAMPTZ,
  cancellation_reason TEXT,
  waitlist_position INTEGER,
  attended_at     TIMESTAMPTZ,
  checked_in_by   UUID REFERENCES users(id),
  metadata        JSONB DEFAULT '{}',
  UNIQUE(user_id, schedule_id)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### `check_ins` — Gym Entry/Exit Records

```sql
CREATE TABLE check_ins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  location_id   UUID NOT NULL REFERENCES locations(id),
  entry_method  TEXT NOT NULL CHECK (entry_method IN ('qr_code','nfc','manual','staff_override','trial_qr')),
  entry_time    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_time     TIMESTAMPTZ,
  verified_by   UUID REFERENCES users(id),
  device_info   JSONB DEFAULT '{}',
  metadata      JSONB DEFAULT '{}'
);

CREATE INDEX idx_check_ins_user ON check_ins(user_id);
CREATE INDEX idx_check_ins_location ON check_ins(location_id);
CREATE INDEX idx_check_ins_time ON check_ins(entry_time);
```

#### `products` — POS Inventory

```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id     UUID REFERENCES locations(id),
  sku             TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL,
  barcode         TEXT,
  price           DECIMAL(10,2) NOT NULL,
  cost_price      DECIMAL(10,2),
  tax_rate        DECIMAL(5,4) DEFAULT 0.2000,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level   INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  unit            TEXT DEFAULT 'piece',
  image_url       TEXT,
  supplier_id     UUID,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_location ON products(location_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_barcode ON products(barcode);
```

#### `inventory_transactions` — Stock Movements

```sql
CREATE TABLE inventory_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id),
  location_id   UUID NOT NULL REFERENCES locations(id),
  type          TEXT NOT NULL CHECK (type IN ('purchase','sale','adjustment','return','transfer_in','transfer_out','waste')),
  quantity      INTEGER NOT NULL,
  unit_cost     DECIMAL(10,2),
  total_cost    DECIMAL(10,2),
  reference_id  UUID,  -- links to sale, purchase order, etc.
  reference_type TEXT,
  notes         TEXT,
  performed_by  UUID NOT NULL REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inv_trans_product ON inventory_transactions(product_id);
CREATE INDEX idx_inv_trans_type ON inventory_transactions(type);
CREATE INDEX idx_inv_trans_created ON inventory_transactions(created_at);
```

#### `crm_leads` — Sales Leads

```sql
CREATE TABLE crm_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id     UUID NOT NULL REFERENCES locations(id),
  assigned_to     UUID REFERENCES users(id),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  source          TEXT NOT NULL CHECK (source IN ('website','walk_in','referral','social_media','phone','email_campaign','partnership','other')),
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','proposal','negotiation','won','lost','nurture')),
  interest_level  TEXT CHECK (interest_level IN ('hot','warm','cold')),
  notes           TEXT,
  last_contact_at TIMESTAMPTZ,
  next_follow_up  TIMESTAMPTZ,
  converted_to_user_id UUID REFERENCES users(id),
  estimated_value DECIMAL(10,2),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_leads_location ON crm_leads(location_id);
CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_leads_assigned ON crm_leads(assigned_to);
CREATE INDEX idx_crm_leads_follow_up ON crm_leads(next_follow_up);
```

#### `crm_activities` — Lead/Client Activities

```sql
CREATE TABLE crm_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES crm_leads(id),
  user_id     UUID REFERENCES users(id),
  type        TEXT NOT NULL CHECK (type IN ('call','email','sms','meeting','note','task','status_change','booking')),
  direction   TEXT CHECK (direction IN ('inbound','outbound')),
  subject     TEXT,
  content     TEXT NOT NULL,
  due_date    TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crm_activities_lead ON crm_activities(lead_id);
CREATE INDEX idx_crm_activities_user ON crm_activities(user_id);
CREATE INDEX idx_crm_activities_type ON crm_activities(type);
CREATE INDEX idx_crm_activities_due ON crm_activities(due_date);
```

#### `communications` — Messages & Campaigns

```sql
CREATE TABLE communications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id   UUID REFERENCES locations(id),
  sender_id     UUID REFERENCES users(id),
  type          TEXT NOT NULL CHECK (type IN ('push','email','sms','in_app','announcement')),
  channel       TEXT NOT NULL CHECK (channel IN ('transactional','marketing','operational')),
  subject       TEXT,
  content       TEXT NOT NULL,
  audience_type TEXT NOT NULL CHECK (audience_type IN ('all','role','segment','individual','location')),
  audience_filter JSONB DEFAULT '{}',
  scheduled_at  TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sending','sent','failed','cancelled')),
  open_count    INTEGER DEFAULT 0,
  click_count   INTEGER DEFAULT 0,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communications_status ON communications(status);
CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_scheduled ON communications(scheduled_at);
```

#### `notifications` — User Notification Feed

```sql
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  data          JSONB DEFAULT '{}',
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  read_at       TIMESTAMPTZ,
  action_url    TEXT,
  priority      TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

#### `audit_logs` — SOC2/GDPR Audit Trail

```sql
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email    TEXT, -- preserved even if user account is deleted
  target_type   TEXT NOT NULL,  -- table name: 'users', 'memberships', etc.
  target_id     UUID,           -- row UUID
  action        TEXT NOT NULL CHECK (action IN ('create','read','update','delete','login','logout','export','consent_change')),
  old_values    JSONB,
  new_values    JSONB,
  ip_address    INET,
  user_agent    TEXT,
  session_id    TEXT,
  location_context UUID REFERENCES locations(id),
  risk_level    TEXT DEFAULT 'low' CHECK (risk_level IN ('low','medium','high','critical')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

#### `analytics_events` — Product Analytics

```sql
CREATE TABLE analytics_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  session_id    TEXT NOT NULL,
  event_name    TEXT NOT NULL,
  event_category TEXT NOT NULL,
  properties    JSONB DEFAULT '{}',
  device_type   TEXT,
  app_version   TEXT,
  location_id   UUID REFERENCES locations(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
```

### 3.3 RLS Policy Framework

Every table has Row Level Security enabled. The policy pattern:

```sql
-- Example: classes table RLS policies
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Admins see everything
CREATE POLICY classes_admin_all ON classes FOR ALL TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Managers see their location's classes
CREATE POLICY classes_manager_location ON classes FOR ALL TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'manager'
    AND location_id IN (
      SELECT location_id FROM user_locations WHERE user_id = auth.uid()
    )
  );

-- Teachers see classes they're assigned to + all active
CREATE POLICY classes_teacher_view ON classes FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'teacher'
    AND (is_active = TRUE OR EXISTS (
      SELECT 1 FROM class_schedules WHERE teacher_id = auth.uid() AND class_id = classes.id
    ))
  );

-- Clients and visitors see only active classes at their location
CREATE POLICY classes_client_view ON classes FOR SELECT TO authenticated
  USING (
    is_active = TRUE
    AND location_id IN (
      SELECT ul.location_id FROM user_locations ul
      WHERE ul.user_id = auth.uid()
      UNION
      SELECT memberships.location_id FROM memberships
      WHERE memberships.user_id = auth.uid() AND memberships.status = 'active'
    )
  );

-- Public (no auth) can view active classes
CREATE POLICY classes_public_view ON classes FOR SELECT TO anon
  USING (is_active = TRUE AND (SELECT is_public FROM locations WHERE id = location_id) = TRUE);
```

### 3.4 Indexes Summary

| Table | Critical Indexes | Purpose |
|-------|-----------------|---------|
| users | email, role, status, deleted_at | Login, filtering, soft-delete |
| memberships | user_id, status, next_billing_date | Member lookup, billing batch |
| memberships | location_id, status | Composite: location-scoped membership queries |
| class_schedules | start_time, teacher_id, status | Schedule queries, teacher view |
| bookings | user_id, schedule_id, status | Booking management, attendance |
| bookings | user_id, status, class_date | Partial WHERE status='confirmed': active bookings lookup |
| check_ins | user_id, entry_time, location_id | Attendance analytics, capacity |
| check_ins | location_id, check_in_time DESC | Composite: location check-in reports |
| payments | user_id, status, created_at | Financial reporting, user history |
| invoices | user_id, created_at DESC | Composite: billing history per user |
| crm_leads | status, assigned_to, next_follow_up | Pipeline management, follow-ups |

**Index Maintenance Strategy:**
- Monitor index bloat monthly via `pg_stat_user_indexes`
- `REINDEX` during low-usage windows (2-4 AM) when bloat exceeds 30%
- Drop unused indexes (zero scans over 30 days) after review
- Add new indexes only after observing slow queries in production logs

---

## 4. API Design

### 4.1 RESTful Endpoint Structure

```
/api/v1/
  ├── auth/
  │   ├── POST /signup
  │   ├── POST /login
  │   ├── POST /logout
  │   ├── POST /refresh
  │   ├── POST /forgot-password
  │   ├── POST /reset-password
  │   ├── POST /oauth/callback
  │   └── GET  /session
  ├── users/
  │   ├── GET    /              (admin/manager scoped)
  │   ├── POST   /
  │   ├── GET    /:id
  │   ├── PATCH  /:id
  │   ├── DELETE /:id
  │   └── GET    /:id/audit-log
  ├── locations/
  │   ├── GET    /
  │   ├── POST   /              (admin only)
  │   ├── GET    /:id
  │   ├── PATCH  /:id
  │   └── GET    /:id/dashboard
  ├── memberships/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── GET    /:id
  │   ├── PATCH  /:id
  │   ├── POST   /:id/freeze
  │   ├── POST   /:id/cancel
  │   └── POST   /:id/upgrade
  ├── classes/
  │   ├── GET    /
  │   ├── POST   /              (manager)
  │   ├── GET    /:id
  │   ├── PATCH  /:id
  │   └── DELETE /:id
  ├── schedules/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── GET    /:id
  │   ├── PATCH  /:id
  │   └── DELETE /:id
  ├── bookings/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── POST   /:id/cancel
  │   └── POST   /:id/check-in
  ├── payments/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── POST   /:id/refund
  │   └── GET    /:id/receipt
  ├── products/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── GET    /:id
  │   └── PATCH  /:id
  ├── inventory/
  │   ├── GET    /
  │   ├── POST   /transactions
  │   └── GET    /low-stock
  ├── check-ins/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── POST   /:id/checkout
  │   └── GET    /capacity
  ├── crm/
  │   ├── GET    /leads
  │   ├── POST   /leads
  │   ├── GET    /leads/:id
  │   ├── PATCH  /leads/:id
  │   ├── GET    /activities
  │   └── POST   /activities
  ├── communications/
  │   ├── GET    /
  │   ├── POST   /
  │   ├── POST   /:id/send
  │   └── GET    /templates
  ├── notifications/
  │   ├── GET    /
  │   ├── PATCH  /:id/read
  │   └── PATCH  /mark-all-read
  └── analytics/
      ├── GET    /dashboard
      ├── GET    /attendance
      ├── GET    /revenue
      └── POST   /events
```

### 4.2 Authentication Flow

```
1. User enters credentials (email/password or OAuth)
2. Supabase Auth (GoTrue) validates:
   a. Local: bcrypt password hash comparison
   b. OAuth: redirect to provider, callback with code, exchange for token
3. GoTrue issues:
   - access_token (JWT, 1-hour expiry)
   - refresh_token (opaque, 7-day expiry)
4. Client stores tokens:
   - Web: httpOnly cookie (with SameSite=Lax)
   - Mobile: expo-secure-store (encrypted)
5. Every request includes `Authorization: Bearer <access_token>`
6. PostgREST validates JWT signature, extracts claims (user_id, role)
7. RLS policies execute using auth.uid() = user_id
8. Token refresh: client POSTs /auth/refresh with refresh_token
   - On 401 from API, auto-refresh and retry original request
```

### 4.3 Rate Limiting Strategy

| Tier | Requests/Minute | Scope | Applies To |
|------|----------------|-------|-----------|
| **Anonymous** | 30 | IP address | Unauthenticated endpoints |
| **Authenticated** | 120 | User ID | General API usage |
| **Burst** | 300 | User ID | Check-in, booking peak hours |
| **Admin** | 600 | User ID | Bulk operations, exports |
| **Webhook** | 1000 | API key | Third-party integrations |

**Implementation:** Redis-backed rate limiting via Caddy or Edge Function middleware. Returns `429 Too Many Requests` with `Retry-After` header.


### 4.3a Database-Level Rate Limiting

Application-level rate limiting (Redis/Caddy) can be bypassed if Edge Functions are called directly. Database-level enforcement provides defense-in-depth:

| Layer | Implementation | Scope |
|-------|---------------|-------|
| Application | Redis-backed sliding window | Primary rate limiting via Caddy/Edge Function middleware |
| Database | `rate_limits` table + Edge Function check | Fallback for direct Edge Function calls |
| IP-based | PostgreSQL `pg_stat_activity` | Per-IP connection limits |

#### Rate Limit Table

```sql
CREATE TABLE rate_limits (
  id          BIGSERIAL PRIMARY KEY,
  key         TEXT NOT NULL,           -- "ip:{ip}" or "api_key:{key}" or "user:{user_id}"
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE(key, window_start)
);

CREATE INDEX idx_rate_limits_key ON rate_limits(key, window_start DESC);
```

#### Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1714320000
X-RateLimit-Policy: authenticated
```

#### Edge Function Rate Limit Check

```typescript
// Edge Function entry point — every function calls this first
async function checkRateLimit(req: Request, context: Context): Promise<Response | null> {
  const key = context.userId ? `user:${context.userId}` : `ip:${context.clientIP}`;
  const allowed = await rateLimitDB.check(key, { max: context.limit, window: '1m' });
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }
  return null; // Proceed to handler
}
```

### 4.4 Error Handling Standard

All API errors follow RFC 7807 (Problem Details):

```json
{
  "type": "https://ohmygold.fr/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The request body contains invalid data.",
  "instance": "/api/v1/bookings",
  "trace_id": "abc-123-def",
  "errors": [
    { "field": "schedule_id", "message": "Class is full. Join waitlist?", "code": "CLASS_FULL" }
  ]
}
```

| Status | Meaning | Client Action |
|--------|---------|---------------|
| 400 | Validation error | Show field errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden (RLS denied) | Show permission error |
| 404 | Not found | Show 404 page |
| 409 | Conflict (race condition) | Retry or show conflict |
| 422 | Business logic error | Show contextual message |
| 429 | Rate limited | Backoff and retry |
| 500 | Server error | Log, show generic error |

### 4.5 Pagination

All list endpoints use cursor-based pagination (keyset) for performance:

```
GET /api/v1/classes?limit=20&cursor=eyJpZCI6InV1aWQtMTIzIn0

Response:
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6InV1aWQtNDU2In0",
    "has_more": true,
    "total_count": 152
  }
}
```

### 4.6 WebSocket Events (Supabase Realtime)

```javascript
// Subscribe to real-time updates
const channel = supabase
  .channel('location-123')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'check_ins', filter: 'location_id=eq.123' },
    (payload) => { updateCapacityDisplay(payload.new); }
  )
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'class_schedules', filter: 'location_id=eq.123' },
    (payload) => { refreshScheduleView(payload.new); }
  )
  .on('broadcast',
    { event: 'capacity_alert' },
    (payload) => { showCapacityWarning(payload); }
  )
  .subscribe();
```

| Event Channel | Events | Subscribers |
|--------------|--------|-------------|
| `location-{id}` | check_ins, bookings, class_schedules | Staff at location |
| `user-{id}` | notifications, membership changes | Individual user |
| `class-{id}` | booking updates, waitlist changes | Booked users, teacher |
| `system` | announcements, maintenance alerts | All connected users |

### 4.7 API Versioning

| Version | Status | Base URL |
|---------|--------|----------|
| v1 | Current (April 2026) | `/api/v1/` |
| v2 | Future | `/api/v2/` |

Versioning is URL-based. Breaking changes bump the version. Deprecation notices sent 6 months in advance via API response headers: `Deprecation: true`, `Sunset: <date>`.

---

## 5. Authentication & Authorization

### 5.1 Self-Hosted Supabase Auth Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────►│  GoTrue      │────►│  PostgreSQL  │
│ (Web/Mobile)│◄────│  (Auth Svc)  │◄────│  (User data)│
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐ ┌──────────┐ ┌──────────┐
        │  Google  │ │  Apple   │ │ Password │
        │  OAuth   │ │  OAuth   │ │ + bcrypt │
        └─────────┘ └──────────┘ └──────────┘
```

### 5.2 OAuth 2.0 Flow (Google & Apple)

```
1. Client calls supabase.auth.signInWithOAuth({ provider: 'google' })
2. GoTrue redirects to Google's OAuth authorize endpoint
3. User consents, Google redirects back with authorization code
4. GoTrue exchanges code for access_token + id_token
5. GoTrue creates/updates user record, generates JWT
6. GoTrue redirects to app with session
7. Client establishes session with access_token
```

### 5.3 JWT Token Management

| Property | Value |
|----------|-------|
| Access Token TTL | 1 hour (3600 seconds) |
| Refresh Token TTL | 7 days |
| Algorithm | RS256 (asymmetric) |
| Key Rotation | Every 30 days |
| Storage (Web) | httpOnly cookie + localStorage fallback |
| Storage (Mobile) | expo-secure-store |

### 5.4 RBAC Implementation

Role-based access control is implemented at **three layers**:

| Layer | Technology | Scope |
|-------|-----------|-------|
| **Database** | PostgreSQL RLS | Row-level data filtering |
| **API** | Edge Functions | Endpoint-level permission checks |
| **UI** | React hooks | Feature visibility per role |

**Role Hierarchy:**
```
Admin (system-wide) > Manager (location) > Employee (operational) > Teacher (classes) > Client (self) > Visitor (public)
```

**Permission Checks:**
- `usePermission('billing.process_refund')` — returns boolean
- `<Can permission="users.create">` — conditional render wrapper
- Zod schemas validate role on server: `role: z.enum(['admin','manager',...])`

### 5.5 Session Management

| Feature | Implementation |
|---------|---------------|
| Max concurrent sessions | 5 per user |
| **Session timeout per role** | See table below |
| Force logout | Admin can revoke all sessions for a user |
| Device tracking | Store device fingerprint, last active |
| "Remember me" | Extends refresh token to 30 days |

#### Session Timeout by Role

| Role | Timeout | Idle Detection | Warning Before Logout |
|------|---------|---------------|----------------------|
| Admin | 4 hours | 15 min inactivity | Toast at 5 min with "Extend" button |
| Manager | 4 hours | 15 min inactivity | Toast at 5 min with "Extend" button |
| Employee | 8 hours (shift-based) | 30 min inactivity | Toast at 10 min with "Extend" button |
| Teacher | 8 hours | 30 min inactivity | Toast at 10 min with "Extend" button |
| Client | 30 days (with "remember me") | None (token-based) | None |
| Visitor | 1 hour | 15 min inactivity | Modal at 5 min |

#### Idle Detection & Auto-Logout UX

```typescript
// Idle detection hook
function useIdleTimeout(timeoutMs: number, warningMs: number) {
  const [showWarning, setShowWarning] = useState(false);

  useIdleTimer({
    timeout: timeoutMs,
    onIdle: () => logout(),
    onActive: () => setShowWarning(false),
    promptBeforeIdle: warningMs,
    onPrompt: () => setShowWarning(true),
  });

  return { showWarning, extendSession: () => refreshToken() };
}
```

**Warning UX:** Non-blocking toast: "Your session expires in 5 minutes. [Extend Session] [Logout Now]

### 5.6 Password Policies

| Rule | Value |
|------|-------|
| Minimum length | 10 characters |
| Complexity | 1 uppercase, 1 lowercase, 1 number, 1 special |
| Common password check | Against Have I Been Pwned API |
| Max failed attempts | 5 (lockout 15 minutes) |
| Password history | Last 5 passwords cannot be reused |
| Expiry | No forced expiry (NIST 800-63B) |

### 5.7 MFA/TOTP Support (Phase 2)

Complete MFA design with TOTP (RFC 6238) for admin and manager accounts.

#### MFA Flow

```
1. User navigates to Settings → Security → Enable 2FA
2. Server generates TOTP secret (base32, 160 bits)
3. Server displays QR code (otpauth:// URI) for authenticator app scanning
4. User enters 6-digit code from authenticator app to verify
5. Server validates code against secret (time window: ±1 period)
6. On success: MFA enabled, recovery codes generated
7. Recovery codes: 10 single-use codes, shown once, stored as bcrypt hashes
```

#### `mfa_factors` Table

```sql
CREATE TABLE mfa_factors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  factor_type     TEXT NOT NULL DEFAULT 'totp' CHECK (factor_type IN ('totp', 'sms', 'webauthn')),
  status          TEXT NOT NULL DEFAULT 'unverified' CHECK (status IN ('unverified', 'verified', 'disabled')),
  secret          TEXT NOT NULL, -- encrypted with AES-256-GCM
  backup_codes    TEXT NOT NULL, -- bcrypt hashes of 10 recovery codes, JSONB array
  verified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, factor_type)
);

CREATE INDEX idx_mfa_factors_user ON mfa_factors(user_id);
CREATE INDEX idx_mfa_factors_status ON mfa_factors(status);
```

#### RLS Policies for MFA

```sql
-- Users can only read/modify their own MFA factors
CREATE POLICY mfa_user_own ON mfa_factors FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Admin can view MFA status (not secrets) for all users
CREATE POLICY mfa_admin_read ON mfa_factors FOR SELECT TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
```

#### Recovery Flow

| Scenario | Flow |
|----------|------|
| Lost authenticator | Use recovery code → immediate disable MFA → re-enable with new device |
| Lost authenticator + no recovery codes | Email verification (48-hour cooldown) → admin override required |
| Account lockout | Admin can disable MFA from admin panel after identity verification |

| Method | Priority | Implementation | Status |
|--------|----------|---------------|--------|
| TOTP (Google Authenticator) | P1 | GoTrue native TOTP + custom UI | Designed |
| SMS OTP | P2 | Twilio integration | Future |
| WebAuthn / Passkeys | P3 | GoTrue WebAuthn | Future |

### 5.8 Auth Audit Logging

Every authentication event is logged to `audit_logs`:

| Event | Logged Data | Risk Level |
|-------|------------|------------|
| Successful login | user_id, ip, user_agent, timestamp | low |
| Failed login | email attempted, ip, reason | medium (after 3) |
| Password change | user_id, ip | high |
| OAuth connect | user_id, provider | low |
| Session revoked | user_id, revoked_by | medium |
| Role change | user_id, old_role, new_role, changed_by | critical |

---

## 6. Real-Time Architecture

### 6.1 Supabase Realtime Channels

Supabase Realtime uses Elixir/Phoenix for low-latency WebSocket connections. All clients subscribe to role-appropriate channels.

### 6.2 Event Types

| Event Category | PostgreSQL Table | Realtime Events | Consumers |
|---------------|-----------------|-----------------|-----------|
| **Booking updates** | `bookings` | INSERT, UPDATE | Client app, staff dashboard |
| **Class changes** | `class_schedules` | UPDATE, DELETE | All app users at location |
| **Notifications** | `notifications` | INSERT | Target user |
| **Check-ins** | `check_ins` | INSERT, UPDATE | Capacity dashboard, staff |
| **Capacity** | computed | BROADCAST | All users (occupancy widget) |

### 6.3 Presence — Who's Online / Check-Ins

```elixir
# Presence channel for gym capacity
Presence.track(socket, "location-#{location_id}", %{
  user_id: user_id,
  role: role,
  checked_in_at: DateTime.utc_now(),
  zone: zone_id
})
```

Staff dashboards show real-time:
- Current occupancy count
- Active users by zone
- Staff members on duty
- Recent check-ins (last 5 minutes)

### 6.4 Push Notification Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Trigger Sources                        │
│  (DB trigger · Cron · User action · Edge Function)       │
└──────────────────────┬───────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Edge Function   │
              │  (notifications) │
              │  - Filter prefs  │
              │  - Rate limit    │
              │  - Enrich data   │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐
   │  Expo    │  │   APNs   │  │   FCM    │
   │  Server  │  │ (iOS)    │  │ (Android)│
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
              ┌───────▼────────┐
              │  User Device    │
              │  (Deep link)    │
              └─────────────────┘
```

**Notification Types:**

| Type | Trigger | Channel | Priority |
|------|---------|---------|----------|
| Class reminder | 30 min before class | Push | Normal |
| Booking confirmed | On booking | Push + In-app | Normal |
| Waitlist promotion | Spot opens | Push | High |
| Class cancelled | Staff action | Push + SMS | Urgent |
| Payment failed | Stripe webhook | Push + Email | High |
| Capacity alert | >90% occupancy | Push (staff) | Urgent |
| Achievement | Milestone reached | Push | Normal |

### 6.5 WebSocket Fallback
### 6.5a WebSocket Horizontal Scaling Strategy

Supabase Realtime (Elixir/Phoenix) handles WebSocket connections. On a single VPS, connection limits must be managed proactively.

#### Connection Limits per VPS Tier

| VPS Tier | Max Concurrent WS | Estimated Users | Action When 80% Reached |
|----------|------------------|-----------------|------------------------|
| Small (4 vCPU, 8 GB) | 500 | ~250 active | Monitor closely |
| Medium (8 vCPU, 16 GB) | 2,000 | ~1,000 active | Alert threshold |
| Large (16 vCPU, 32 GB) | 5,000 | ~2,500 active | Plan scaling |
| XL (32 vCPU, 64 GB) | 10,000 | ~5,000 active | Evaluate horizontal |

#### Connection Pooling Strategy

```
Client → Supabase Realtime (Elixir/Phoenix) → PostgreSQL LISTEN/NOTIFY

- Each WebSocket connection = 1 Elixir process (lightweight, ~2 KB)
- PostgreSQL max_connections: 500 (with PgBouncer transaction pooling)
- Realtime batches NOTIFY messages: groups changes per 100ms window
- Connection keepalive: 30-second ping/pong to detect stale connections
```

#### Fallback to Short-Polling

When WebSocket limits are reached or connections are unstable:

| Condition | Fallback Behavior |
|-----------|-------------------|
| WS connection fails after 3 retries | Switch to 10-second polling |
| WS limit reached server-side | Server returns 503 with `Retry-After: 30` |
| Mobile background / low battery | Reduce to 30-second polling |
| Critical actions (booking, check-in) | Always use REST API (not WebSocket) |

```typescript
// Adaptive connection strategy
function createAdaptiveChannel(config: ChannelConfig) {
  const channel = supabase.channel(config.name);

  channel.subscribe((status) => {
    if (status === 'CHANNEL_ERROR') {
      // Fallback to polling
      startPolling(config.pollInterval || 10000);
    }
    if (status === 'SUBSCRIBED') {
      stopPolling(); // WebSocket working, stop polling
    }
  });

  return channel;
}
```

#### Horizontal Scaling Path (Phase 3+)

If WebSocket load exceeds single VPS capacity:

```
Phase 3 (Franchise Scale):
  ┌─────────────┐     ┌─────────────┐
  │  Realtime   │◄───►│  Realtime   │
  │  Server 1   │     │  Server 2   │
  └──────┬──────┘     └──────┬──────┘
         │                    │
         └────────┬───────────┘
                  ▼
           ┌─────────────┐
           │   Postgres  │
           │  (primary)  │
           └─────────────┘

- Use Redis Pub/Sub for cross-node broadcast
- Sticky sessions: route user to same Realtime node
- Load balancer (Caddy) distributes connections round-robin
```

**Current (Phase 1):** Single Realtime instance is sufficient for < 5,000 members.

If WebSocket connection fails:

1. **Detection:** Client monitors `channel.subscribe()` state
2. **Fallback:** Switch to short polling (10-second interval)
3. **Reconnection:** Exponential backoff (1s, 2s, 4s, 8s... max 30s)
4. **State sync:** On reconnect, client requests missed events via `?since=<last_event_id>`
5. **Queue:** Critical actions (bookings, check-ins) always go through REST API (not WebSocket)

---

## 7. Security Architecture

### 7.1 SOC 2 Type II Requirements Mapping

| Trust Service Criteria | Implementation | Evidence |
|----------------------|----------------|----------|
| **Security** | TLS 1.3, AES-256 encryption, RLS, RBAC | Penetration test reports, encryption audit |
| **Availability** | 99.9% uptime SLA, automated backups, monitoring | Uptime reports, incident logs |
| **Processing Integrity** | Input validation, idempotent APIs, audit logs | Validation test results |
| **Confidentiality** | RLS policies, field-level encryption for PII | Access review reports |
| **Privacy** | GDPR consent flows, data minimization, retention policies | Consent audit trail |

### 7.2 Data Encryption

| Layer | Method | Keys |
|-------|--------|------|
| **In transit** | TLS 1.3 (mandatory), HSTS header | Let's Encrypt certificates (Caddy auto-renew) |
| **At rest (DB)** | PostgreSQL transparent data encryption (TDE) | Host-level LUKS encryption |
| **At rest (files)** | MinIO server-side encryption (AES-256-GCM) | Auto-generated per-object keys |
| **Sensitive fields** | Column-level encryption (pgcrypto) | Master key in environment variable |
| **Client storage** | expo-secure-store (mobile), httpOnly cookies (web) | Platform keychain |

### 7.3 API Security

| Threat | Mitigation |
|--------|-----------|
| Rate limiting | Redis-backed, per-user/IP tiered limits |
| CORS | Whitelist: `ohmygold.fr`, `*.ohmygold.fr`, Expo dev |
| CSRF | SameSite=Lax cookies, CSRF tokens for state-changing ops |
| SQL Injection | RLS policies + parameterized queries (PostgREST) |
| XSS | Content-Security-Policy, input sanitization, output encoding |
| Replay attacks | JWT `jti` claim, short expiry |

### 7.4 Security Headers (Caddy)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}' https://js.stripe.com https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com;
  connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co wss:// realtime.supabase.co https://api.expo.dev https://eu.i.posthog.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
  media-src 'self' blob: https://*.supabase.co;
  worker-src 'self' blob:;
  manifest-src 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(), geolocation=(self)
```


### 7.4a CSP Nonce Generation Strategy

For `script-src 'nonce-{NONCE}'`, the server generates a unique cryptographically secure nonce on every request:

```typescript
// Server-side nonce generation (Edge Function middleware)
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Inject nonce into HTML response and CSP header
const nonce = generateNonce();
const csp = defaultCsp.replace('{NONCE}', nonce);
response.headers.set('Content-Security-Policy', csp);
response.headers.set('X-Nonce', nonce); // For client inline scripts
```

**CSP Report URI:**
```
report-uri https://ohmygold.fr/api/v1/csp-report;
report-to csp-endpoint;
```

**CSP Report Endpoint:** POST `/api/v1/csp-report` — logs CSP violations for monitoring.

**Stripe-specific directives:** `frame-src` includes Stripe's checkout frames. `connect-src` includes Stripe's API. These are required for payment processing and cannot be relaxed.

**Note on `'unsafe-inline'` for styles:** Tailwind CSS requires `style-src 'unsafe-inline'` during the build. This is an acceptable risk because style injection cannot execute JavaScript. All dynamic styles use CSS custom properties, not inline `style=""` attributes.

### 7.5 GDPR Compliance

| Requirement | Implementation |
|------------|---------------|
| **Lawful basis** | Consent checkbox (marketing), Contract (service), Legal obligation (billing) |
| **Data minimization** | Only collect required fields; health data = explicit consent |
| **Right to access** | `/api/v1/users/me/export` — full data export (JSON) |
| **Right to rectification** | Self-service profile edit + admin override |
| **Right to erasure** | Soft delete + 30-day grace + hard delete via admin action |
| **Right to portability** | GDPR export endpoint + structured JSON |
| **Breach notification** | Automated alerts; 72-hour compliance workflow |
| **DPIA** | Required for: health data processing, biometric auth, AI features |
| **Consent management** | Granular toggles: marketing, analytics, health data, third-party sharing |

#### Data Retention & Archival Policy

| Data Type | Retention Period | Action After Expiry | Compliance Driver |
|-----------|-----------------|---------------------|-------------------|
| Active member data | Life of membership + 2 years | Archive to cold storage, then purge | GDPR Article 5(1)(e) |
| Audit logs | 7 years | Archive to encrypted S3 Glacier | SOC 2, French tax law |
| Session logs | 1 year | Automated monthly purge | GDPR |
| Marketing consent records | 7 years | Archive (proof of consent) | GDPR Article 7 |
| Payment records | 10 years | Archive to cold storage | French commercial code |
| Health/fitness data | Life of membership + 3 years | Anonymize for research, then purge | GDPR health data |
| Failed login attempts | 90 days | Automated purge | Security |
| Analytics events | 2 years | Aggregate then purge | Data minimization |

**Automated purge mechanism:**
```sql
-- Monthly purge job (pg-boss scheduled task)
DELETE FROM session_logs WHERE created_at < NOW() - INTERVAL '1 year';
DELETE FROM failed_logins WHERE created_at < NOW() - INTERVAL '90 days';
DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '2 years';
-- Archive before hard delete; log to audit_log
```

**Archival process:**
1. Data flagged for expiry → exported to encrypted JSON in cold S3 storage
2. Certificate of archival generated with timestamp and data hash
3. Original data purged after 30-day grace period
4. Archived data retained in cold storage for legal/regulatory period

### 7.6 Audit Trail Design

Every data mutation creates an `audit_logs` record:

```typescript
// Audit middleware pattern
async function auditLog({
  action,        // 'create' | 'read' | 'update' | 'delete' | 'login' | ...
  targetType,    // table name
  targetId,      // row UUID
  oldValues,     // before state (for updates/deletes)
  newValues,     // after state
  riskLevel,     // 'low' | 'medium' | 'high' | 'critical'
  context        // { ip, userAgent, sessionId }
}: AuditEntry) {
  await supabase.from('audit_logs').insert({ ... });
}
```

**Critical actions requiring audit:**
- All financial transactions (payments, refunds)
- Membership status changes (freeze, cancel, upgrade)
- User role changes
- Data exports
- Bulk operations
- Login/logout events
- Consent changes

### 7.7 Vulnerability Management

| Layer | Tool | Frequency |
|-------|------|-----------|
| Dependency scanning | Snyk + npm audit | Every PR + weekly |
| SAST (static analysis) | Semgrep | Every PR |
| Container scanning | Trivy | Every build |
| Penetration testing | External vendor | Annually + after major releases |
| Dependency updates | Dependabot | Weekly PRs |

---

## 8. i18n & Localization Architecture

### 8.1 react-i18next Setup

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: require('./fr/translation.json') },
      en: { translation: require('./en/translation.json') },
    },
    lng: 'fr', // Gold's Gym France default
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    ns: ['translation', 'common', 'booking', 'billing', 'classes'],
    defaultNS: 'translation',
  });
```

### 8.2 Translation File Structure

```
i18n/
├── fr/
│   ├── translation.json      # Core UI strings
│   ├── common.json           # Shared terms (buttons, labels)
│   ├── booking.json          # Booking module
│   ├── billing.json          # Payment/billing module
│   ├── classes.json          # Class/schedule module
│   ├── crm.json              # Sales/CRM module
│   ├── pos.json              # Point of sale module
│   └── validation.json       # Form validation messages
├── en/
│   ├── translation.json
│   ├── common.json
│   ├── booking.json
│   ├── billing.json
│   ├── classes.json
│   ├── crm.json
│   ├── pos.json
│   └── validation.json
└── i18n-keys.ts              # TypeScript key definitions
```

### 8.3 Locale Detection & Switching

| Strategy | Priority | Implementation |
|----------|----------|---------------|
| User preference (stored) | 1 | `users.locale` column, persisted in DB |
| Browser/OS language | 2 | `navigator.language` (web), `Localization.locale` (Expo) |
| Default | 3 | `fr` (Gold's Gym France) |

**Locale Switching:**
- Web: Dropdown in settings, immediate switch, store in cookie
- Mobile: Device settings or in-app toggle, requires app restart
- Admin: Override for individual user accounts

### 8.4 Date/Number/Currency Formatting

```typescript
// Format utilities using Intl APIs
const formatCurrency = (amount: number, currency = 'EUR') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
// → "34,63 €" (French)

const formatDate = (date: Date, locale = 'fr-FR') =>
  new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
// → "lundi 5 mai 2026" (French)

const formatRelativeTime = (date: Date, locale = 'fr-FR') =>
  new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(...);
// → "dans 2 jours" (French)
```

### 8.5 French-Specific Considerations

Gold's Gym France uses **informal "tu"** (not "vous") per brand guidelines. This is a deliberate brand choice — Gold's Gym is approachable, casual, and part of the member's daily life.

#### i18n Locale Configuration

```typescript
// i18n/index.ts — updated locale setup
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    'fr-informal': { translation: require('./fr/translation.json') },
    'en': { translation: require('./en/translation.json') },
  },
  lng: 'fr-informal', // Gold's Gym France default: informal "tu"
  fallbackLng: 'fr-informal',
  supportedLngs: ['fr-informal', 'en'],
  // Note: fr-formal ('vous') reserved for future enterprise/franchise use
});
```

**Locale naming convention:**
| Locale Key | Description | Use Case |
|------------|-------------|----------|
| `fr-informal` | French with "tu" form | Gold's Gym France (default) |
| `en` | English | International/English-speaking members |
| `fr-formal` | French with "vous" form | Reserved for future B2B/franchise use |

#### Translation Examples: "Tu" vs "Vous"

| Context | fr-informal (tu) ❌ INCORRECT (vous) | English |
|---------|--------------------------------------|---------|
| Login CTA | "Connecte-toi" | NOT "Connectez-vous" | "Log in" |
| Welcome | "Bienvenue dans la légende, {{name}} !" | — | "Welcome to the legend!" |
| Your profile | "Ton profil" | NOT "Votre profil" | "Your profile" |
| Book class | "Réserve ta place" | NOT "Réservez votre place" | "Book your spot" |
| Settings | "Tes paramètres" | NOT "Vos paramètres" | "Your settings" |
| Notifications | "Tes notifications" | NOT "Vos notifications" | "Your notifications" |
| Error message | "Oups, quelque chose s'est mal passé" | — | "Oops, something went wrong" |
| Success | "C'est bon !" | — | "All good!" |
| Password reset | "Réinitialise ton mot de passe" | NOT "Réinitialisez votre mot de passe" | "Reset your password" |

#### Enforcing "Tu" Form in Translations

**1. Translation Review Checklist:**
- [ ] All second-person references use "tu/te/toi/ton/ta/tes" NOT "vous/votre/vos"
- [ ] Imperative verbs use informal conjugation ("Réserve" not "Réservez")
- [ ] Possessives use "ton/ta/tes" (NOT "votre/vos")
- [ ] Reflexive pronouns use "te/toi" (NOT "vous")

**2. CI Linting Rule:**
```javascript
// .eslintrc.cjs — custom rule to catch formal French
'no-formal-french': ['error', {
  forbidden: ['vous', 'votre', 'vos', 'Votre', 'Vos', 'Vous'],
  message: 'Gold\'s Gym uses informal "tu" form. Use "ton/ta/tes/toi" instead.',
}]
```

**3. Translation File Structure:**
```
i18n/
├── fr-informal/              # Primary French locale
│   ├── translation.json      # All "tu" form translations
│   ├── common.json
│   ├── booking.json
│   ├── billing.json
│   ├── classes.json
│   └── validation.json
└── en/
    └── ...
```

**Text expansion handling:**
- French text is ~30% longer than English
- Buttons must allow wrapping or max-width flex
- Form labels: top-aligned (not inline) for longer French terms
- Testing: always verify UI with French strings before release

### 8.6 Translation Management Workflow

```
1. Developer adds new key in source code (useTranslation('key'))
2. CI extracts keys: i18next-parser → JSON files
3. Machine translation: DeepL API auto-fills missing translations
4. Human review: Native speaker reviews in translation platform
5. QA: Automated screenshot comparison across languages
6. Deploy: Translations bundled with app, no CDN for core strings
```

### 8.7 RTL Architecture (Not Required for Phase 1)

Gold's Gym France targets French (FR) and English (EN) only — both LTR languages. **Full RTL support is NOT required for Phase 1.**

**If RTL is needed in future** (e.g., expansion to Arabic-speaking markets), the following patterns should be adopted:

| Aspect | Implementation |
|--------|---------------|
| CSS logical properties | Use `margin-inline-start` instead of `margin-left`, `text-align: start` instead of `left` |
| Tailwind | `ms-4` (margin-start) instead of `ml-4` |
| Layout | Flexbox `justify-content: flex-start` handles RTL automatically |
| Icons | Directional icons (arrows) flip via CSS `transform: scaleX(-1)` on `[dir="rtl"]` |
| i18n | Add `ar` locale, `dir="rtl"` on `<html>` set dynamically per locale |

**Current approach:** All CSS uses physical properties (`ml-4`, `text-left`) which is correct for LTR. A future migration to logical properties would be a dedicated Phase if RTL markets are targeted.

---

## 9. Accessibility Architecture

### 9.1 WCAG 2.1 AA+ Implementation Checklist

| Criterion | Level | Implementation | Verification |
|-----------|-------|---------------|------------|
| 1.1.1 Non-text Content | A | All images have alt text; icons have aria-label | axe-core |
| 1.3.1 Info & Relationships | A | Semantic HTML, ARIA where needed | Manual + screen reader |
| 1.4.3 Contrast (4.5:1) | AA | All text meets 4.5:1; gold-on-black = 15.5:1 | axe-core + CI |
| 1.4.4 Resize Text (200%) | AA | UI functional at 200% zoom | Browser zoom test |
| 1.4.10 Reflow (320px) | AA | Content reflows at 320px width | Responsive testing |
| 1.4.11 Non-text Contrast | AA | UI components 3:1 minimum | axe-core |
| 2.1.1 Keyboard | A | All functionality via keyboard | Tab navigation test |
| 2.1.2 No Keyboard Trap | A | Can Tab away from any element | Keyboard audit |
| 2.4.3 Focus Order | A | Tab follows visual sequence | Keyboard test |
| 2.4.4 Link Purpose | A | Descriptive link text | axe-core |
| 2.4.7 Focus Visible | AA | Gold (#FFEC00) 3px outline with 2px offset | Visual inspection |
| 2.5.5 Target Size | AA | All touch targets 44x44px minimum | DevTools measure |
| 4.1.2 Name/Role/Value | A | All interactive elements labeled | axe-core + screen reader |

### 9.2 Screen Reader Support Patterns

| Pattern | Implementation |
|---------|---------------|
| Live regions | `aria-live="polite"` for toast notifications, loading states |
| Status updates | `role="status"` for success messages; `role="alert"` for errors |
| Loading states | `aria-busy="true"` + `aria-label="Loading class schedule"` |
| Dynamic content | `aria-atomic="true"` for content that replaces entire element |
| Skip links | "Skip to main content" link, visible on first Tab |

### 9.3 Keyboard Navigation Matrix

| Key | Action | Scope |
|-----|--------|-------|
| Tab | Move to next focusable element | Global |
| Shift+Tab | Move to previous focusable element | Global |
| Enter/Space | Activate button/link | Global |
| Escape | Close modal/drawer/dropdown | Global |
| Arrow keys | Navigate within list, calendar, tabs | Component-specific |
| Home/End | First/last item in list | List components |
| Page Up/Down | Scroll content areas | Scrollable regions |

### 9.4 Focus Management

```css
/* Gold's Gym signature focus ring */
:focus-visible {
  outline: 3px solid #FFEC00;
  outline-offset: 2px;
  border-radius: inherit;
}

/* On gold backgrounds, invert to black */
.on-gold :focus-visible {
  outline-color: #000000;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #FFEC00;
  color: #000;
  padding: 8px 16px;
  z-index: 999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }
```

### 9.5 ARIA Patterns by Component

| Component | ARIA Pattern |
|-----------|-------------|
| Modal | `role="dialog"`, `aria-modal="true"`, focus trap, Escape to close |
| Toast | `role="alert"`, `aria-live="polite"`, auto-dismiss with timeout |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, arrow key navigation |
| Data table | `role="table"`, `<th scope="col">`, `aria-sort` for sortable |
| Dropdown | `role="listbox"`, `aria-expanded`, `aria-activedescendant` |
| Calendar | `role="grid"`, `aria-selected` for selected date |
| Loading skeleton | `aria-busy="true"`, `aria-label="Loading content"` |

### 9.6 Testing Strategy

| Layer | Tool | Frequency | Scope |
|-------|------|-----------|-------|
| Automated | axe-core + jest-axe | Every commit | Component-level |
| Automated | Lighthouse a11y audit | Every PR | Page-level |
| Manual | Keyboard-only navigation | Weekly | Critical flows |
| Manual | VoiceOver (macOS) | Bi-weekly | All web screens |
| Manual | TalkBack (Android) | Bi-weekly | All mobile screens |
| Manual | NVDA (Windows) | Monthly | Key user journeys |
| Expert | External audit | Quarterly | Full WCAG assessment |

### 9.7 Color Contrast CI Enforcement

```yaml
# .github/workflows/a11y.yml
- name: Contrast Check
  run: |
    npx axe-core-cli ./dist --tags wcag2aa
    npx pa11y --standard WCAG2AA ./dist
- name: Fail on contrast violations
  run: |
    if grep -r "contrast" ./axe-results.json; then exit 1; fi
```

**Contrast guarantees:**
- Black `#000000` on White `#FFFFFF`: 21:1 (AAA)
- Black `#000000` on Gold `#FFEC00`: 15.5:1 (AAA)
- Neutral-700 `#404040` on White: 10.3:1 (AAA)
- Error dark `#DC2626` on White: 4.6:1 (AA)
- **Gold on white NEVER used for text** (1.18:1 — fails)

---

## 10. Performance Architecture

### 10.1 Web Performance

| Strategy | Implementation | Target |
|----------|---------------|--------|
| Code splitting | React.lazy() + dynamic imports per route | < 200KB initial JS |
| Lazy loading | Images (loading="lazy"), below-fold components | LCP < 2.5s |
| Service worker | Workbox — precache critical assets, runtime cache API | Offline shell |
| CDN | Cloudflare — static assets, edge caching | TTFB < 200ms |
| Bundle analysis | rollup-plugin-visualizer — monitor on every build | Alert on +10% |
| Compression | Brotli (level 11) + Gzip fallback | Transfer size -70% |

**Bundle budgets:**

| Chunk | Budget | Rationale |
|-------|--------|-----------|
| Initial (index) | 180KB gzipped | Core UI, router, auth |
| Dashboard | 120KB gzipped | Charts, data tables |
| Booking | 80KB gzipped | Calendar, booking flow |
| Admin | 150KB gzipped | User management, settings |
| Shared vendors | 200KB gzipped | React, i18n, utilities |

### 10.2 Mobile Performance

| Strategy | Implementation |
|----------|---------------|
| Bundle optimization | Hermes engine (iOS/Android), ProGuard/R8 (Android) |
| Image optimization | expo-image (WebP, placeholder blur, progressive loading) |
| **Bundle budget** | See detailed budget below |

**Mobile Bundle Budget Breakdown:**

| Bundle Segment | Budget | Contents |
|---------------|--------|----------|
| Core framework | 5 MB | React Native, Expo core, navigation |
| Phase 4 modules | 3 MB | Memberships, classes, bookings, check-in, billing |
| Design system | 2 MB | NativeWind, theme, icons, shared components |
| Phase 7 features | 5 MB | Video, nutrition, social, gamification, wearables (on-demand) |
| Dependencies | 2 MB | Analytics, push notifications, maps |
| **Initial download** | **< 15 MB** | Core + Phase 4 + Design system |
| **On-demand Phase 7** | **+5 MB** | Downloaded after first launch via dynamic imports |

**Code-splitting strategy:**
- Phase 7 features loaded via `React.lazy()` + dynamic imports
- Video player: loaded only on first video view
- Nutrition scanner: loaded only on first scan
- Social feed: loaded only when tab first visited
- Gamification badges: loaded after login completes

| Feature | Split Point | Loaded When |
|---------|------------|-------------|
| Video player | `() => import('./VideoPlayer')` | First video play |
| Nutrition scanner | `() => import('./BarcodeScanner')` | First barcode scan |
| Social feed | `() => import('./SocialFeed')` | Social tab first visited |
| Wearables sync | `() => import('./HealthConnect')` | Settings → Connect device |
| Charts heavy | `() => import('./AdvancedCharts')` | Analytics tab opened |
| Offline images | Cache class photos, avatars; lazy-load full-size |
| Startup time | Preload critical data, splash screen with progress |
| Memory management | FlatList for long lists, image cache limits, cleanup on unmount |
| Native driver | All animations use `useNativeDriver: true` |

### 10.3 Database Performance

| Strategy | Implementation |
|----------|---------------|
| Query optimization | EXPLAIN ANALYZE on all slow queries; index hints |
| Connection pooling | PgBouncer (transaction pooling), 100 max connections |
| Caching | Redis for: session store, rate limits, cached queries (5-min TTL) |
| Read replicas | Phase 2: PostgreSQL streaming replication for read-heavy queries |
| Materialized views | Daily refresh for dashboard aggregates |
| Partitioning | Partition `check_ins` and `audit_logs` by month |

### 10.4 Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Client Cache (Browser/AsyncStorage)               │
│  - Static assets (service worker)                           │
│  - User profile, preferences                                │
│  - Recently viewed data (React Query cache)                 │
│  TTL: User-controlled / app lifecycle                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: CDN Cache (Cloudflare)                            │
│  - Static assets (images, JS, CSS)                          │
│  - Public API responses (class schedules)                   │
│  TTL: 1 hour (schedules), 1 year (assets)                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Application Cache (Redis)                         │
│  - Session tokens                                           │
│  - Rate limit counters                                      │
│  - Aggregated dashboard data                                │
│  TTL: 5 minutes to 24 hours                                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Database Cache (PostgreSQL)                       │
│  - Shared buffers (25% RAM)                                 │
│  - Query plan cache                                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Materialized Views                                │
│  - Daily attendance aggregates                              │
│  - Revenue summaries                                        │
│  - Member cohort metrics                                    │
│  Refresh: Daily at 3 AM                                     │
└─────────────────────────────────────────────────────────────┘
```

### 10.5 Image Optimization

| Source | Format | Size Target | Processing |
|--------|--------|------------|------------|
| User avatars | AVIF + WebP fallback | 64x64 thumbnail, 256x256 full | Upload → Sharp resize → AVIF + WebP → Storage |
| Class images | AVIF + WebP fallback | 400x300 card, 1200x800 detail | Same pipeline |
| POS product photos | AVIF + WebP fallback | 200x200 thumbnail | Same pipeline |
| Photo reports | JPEG (progressive) | Max 2MB, auto-compress | Client-side compress before upload |

**Multi-format image delivery:**
```html
<!-- Primary: AVIF (~50% smaller than WebP), Fallback: WebP, Legacy: JPEG -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Class photo" loading="lazy">
</picture>
```

**CDN auto-format negotiation:** Cloudflare can serve AVIF/WebP automatically based on `Accept` header:
```
Accept: image/avif,image/webp,image/*,*/*
→ CDN serves AVIF if supported, WebP fallback, JPEG legacy
```

| Format | Relative Size | Browser Support | When Used |
|--------|--------------|-----------------|-----------|
| AVIF | 1x (baseline) | Chrome 85+, Firefox 93+, Safari 16+ | Primary for supported browsers |
| WebP | 1.3x larger | Universal (Chrome 23+, all modern) | Fallback for non-AVIF |
| JPEG | 2.5x larger | Universal | Legacy fallback only |

---

## 11. Offline-First Architecture (Mobile)

### 11.1 Sync Strategy

| Data Type | Sync Strategy | Conflict Resolution |
|-----------|--------------|---------------------|
| Class schedules | Cache + background refresh | Server wins (read-only) |
| User profile | Optimistic update + sync | Last-write wins |
| Bookings | Optimistic UI + queue + sync | Server wins (capacity constraint) |
| Check-in QR | Pre-generated, no sync needed | N/A |
| Workout logs | Queue + background sync | Last-write wins |
| Issue reports | Queue + sync with photo | First-come-first-served |
| Attendance | Queue + sync after class | Server wins |

### 11.2 Offline Queue Pattern

```typescript
// Offline action queue
interface QueuedAction {
  id: string;
  type: 'booking' | 'cancel' | 'checkin' | 'issue_report' | 'workout_log';
  payload: Record<string, unknown>;
  createdAt: Date;
  retryCount: number;
}

// Store in AsyncStorage, sync when online
const OfflineQueue = {
  async enqueue(action: QueuedAction): Promise<void> {
    const queue = await AsyncStorage.getItem('offline_queue');
    const items = queue ? JSON.parse(queue) : [];
    items.push(action);
    await AsyncStorage.setItem('offline_queue', JSON.stringify(items));
  },

  async sync(): Promise<void> {
    const queue = await AsyncStorage.getItem('offline_queue');
    const items: QueuedAction[] = queue ? JSON.parse(queue) : [];
    for (const action of items) {
      try {
        await api.post(`/actions/${action.type}`, action.payload);
        await this.dequeue(action.id);
      } catch {
        action.retryCount++;
        if (action.retryCount > 3) {
          await this.markFailed(action.id);
        }
      }
    }
  }
};
```

### 11.3 Data Persistence

| Data Type | Storage | Library |
|-----------|---------|---------|
| Auth tokens | Encrypted | expo-secure-store |
| User profile | Unencrypted | AsyncStorage |
| Class schedules | SQLite | expo-sqlite |
| Bookings | SQLite | expo-sqlite |
| Offline queue | JSON file | AsyncStorage |
| Photos (pending upload) | File system | expo-file-system |
| Analytics events | SQLite | expo-sqlite (batch upload) |

### 11.4 Background Tasks

```typescript
// Background sync when app returns to foreground
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      OfflineQueue.sync();
      queryClient.invalidateQueries(); // Refresh TanStack Query cache
    }
  });
  return () => subscription.remove();
}, []);

// Background fetch for schedule updates (iOS)
TaskManager.defineTask('SYNC_SCHEDULES', async () => {
  await syncClassSchedules();
  return BackgroundFetch.Result.NewData;
});
```

### 11.5 Conflict Resolution Rules

| Scenario | Resolution | UX |
|----------|-----------|-----|
| User books offline, class fills up online | Server wins, show "Class full" on sync | Toast notification |
| User cancels offline, but already attended | Server wins, show "Already checked in" | Toast notification |
| Profile edit conflict | Last-write wins | Silent merge |
| Two staff check in same member | Server deduplicates | No user impact |

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │  10%  (Playwright + Detox)
                    │ (Slow)  │
                   ┌┴─────────┤
                   │Integration│  20%  (React Testing Library + MSW)
                   │  (Medium) │
                  ┌┴──────────┤
                  │   Unit     │  70%  (Vitest + Jest)
                  │  (Fast)    │
                  └────────────┘
```

### 12.2 Unit Testing

| Tool | Purpose | Target |
|------|---------|--------|
| **Vitest** | Unit test runner | All shared packages, web app |
| **Jest** | Mobile unit tests | React Native components |
| **React Testing Library** | Component testing | All UI components |
| **MSW** (Mock Service Worker) | API mocking | All data-fetching tests |
| **@testing-library/jest-dom** | Custom matchers | DOM assertions |

**Coverage targets:**

| Layer | Target | Enforcement |
|-------|--------|-------------|
| Shared utilities (Zod schemas, helpers) | 90% | CI gate |
| UI components | 75% | CI warning |
| Hooks | 80% | CI gate |
| Edge Functions | 70% | CI warning |
| Integration flows | 60% | Manual review |

### 12.3 Integration Testing

| Scope | Tool | Approach |
|-------|------|----------|
| API endpoints | Supertest + test DB | Dockerized PostgreSQL, reset per test |
| Database RLS | Supabase test client | Authenticate as each role, verify access |
| Auth flows | Playwright | Sign up → login → token refresh → logout |

### 12.4 E2E Testing

| Platform | Tool | Critical Flows |
|----------|------|---------------|
| Web | Playwright | Sign up → book class → check in → view profile |
| Web | Playwright | Admin: create class → manage bookings → run report |
| Mobile | Detox | Member app: book class → QR check-in → view history |
| Mobile | Detox | Staff app: scan member → process sale → log issue |

### 12.5 Accessibility Testing

| Type | Tool | Frequency |
|------|------|-----------|
| Automated | axe-core | Every PR |
| Keyboard | Manual (Tab navigation) | Weekly |
| Screen reader | VoiceOver + TalkBack | Bi-weekly |
| Expert audit | External consultant | Quarterly |

### 12.6 Visual Regression Testing

**Tool:** Chromatic (Storybook integration) — runs on every PR.

| Aspect | Specification |
|--------|--------------|
| Baseline branch | `main` — all PRs compared against `main` |
| Diff threshold | > 0.5% pixel diff blocks PR merge |
| Brand-critical zero tolerance | Logo, gold (#FFEC00) color swatches, brand fonts — any diff blocks merge |
| Coverage | All 30+ core UI components in Storybook |
| Mobile visual regression | Device farm screenshots (iPhone 14 Pro, Pixel 7) on release branch |
| Baseline update | Requires 2 approvals + design sign-off |

**Chromatic workflow:**
```yaml
# .github/workflows/visual-regression.yml
- name: Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_TOKEN }}
    onlyChanged: true
    exitOnceUploaded: true
```

**Brand-critical components with zero-tolerance diff:**
- `<Logo />` — Gold's Gym logo, exact brand colors
- `<BrandButton />` — Gold CTA buttons (#FFEC00)
- `<MembershipCard />` — Digital card with brand marks
- `<SplashScreen />` — App launch branding

### 12.7 Performance Testing

| Test | Tool | Target | Trigger |
|------|------|--------|---------|
| Lighthouse score | Lighthouse CI | > 90 Performance | Every PR |
| Bundle size | BundleWatch | < budgets | Every PR |
| Load test (API) | k6 | 500 concurrent users | Pre-release |
| Mobile startup | Flipper Performance | < 2s cold start | Pre-release |
| Memory leak | Xcode Instruments / Android Profiler | Zero leaks | Monthly |

### 12.8 Load Testing for Peak Hours

Gyms experience predictable peak load patterns:

| Time | Load Pattern | Test Scenario |
|------|-------------|---------------|
| 6:00-9:00 AM | 300% normal | Morning rush: check-ins, class bookings |
| 12:00-2:00 PM | 150% normal | Lunch crowd: class bookings |
| 5:00-8:00 PM | 400% normal | Evening rush: all operations |
| 1st of month | 500% billing | Batch payment processing |

**Load test parameters:**
- 500 concurrent users (Phase 1 target)
- 50 check-ins/minute during peak
- 20 bookings/minute
- 100 API requests/second sustained

---

## 13. File Structure

```
ohmygold/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, test, build
│       ├── deploy-staging.yml
│       ├── deploy-production.yml
│       └── a11y-audit.yml
├── apps/
│   ├── web/                       # React webapp (Vite)
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.tsx           # Entry point
│   │       ├── App.tsx            # Root component + routes
│   │       ├── index.css          # Global styles + Tailwind
│   │       ├── components/        # Reusable UI components
│   │       │   ├── ui/            # shadcn/ui primitives
│   │       │   ├── layout/        # Sidebar, Topbar, Footer
│   │       │   ├── forms/         # Form components
│   │       │   ├── charts/        # Recharts wrappers
│   │       │   └── data-display/  # Tables, cards, lists
│   │       ├── pages/             # Route-level pages
│   │       │   ├── dashboard/
│   │       │   ├── classes/
│   │       │   ├── bookings/
│   │       │   ├── members/
│   │       │   ├── billing/
│   │       │   ├── crm/
│   │       │   ├── pos/
│   │       │   ├── analytics/
│   │       │   ├── settings/
│   │       │   └── auth/
│   │       ├── hooks/             # Custom React hooks
│   │       │   ├── useAuth.ts
│   │       │   ├── usePermission.ts
│   │       │   ├── useClasses.ts
│   │       │   ├── useBookings.ts
│   │       │   └── useRealTime.ts
│   │       ├── stores/            # Zustand stores
│   │       │   ├── authStore.ts
│   │       │   ├── uiStore.ts
│   │       │   └── notificationStore.ts
│   │       ├── lib/               # Utilities
│   │       │   ├── supabase.ts    # Supabase client
│   │       │   ├── api.ts         # API helpers
│   │       │   ├── format.ts      # Date/currency/formatting
│   │       │   └── constants.ts
│   │       ├── i18n/              # Translations
│   │       │   ├── index.ts
│   │       │   ├── fr/
│   │       │   └── en/
│   │       └── types/             # TypeScript types
│   │           └── index.ts
│   └── mobile/                    # React Native (Expo)
│       ├── app.json               # Expo config
│       ├── metro.config.js
│       ├── babel.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── app/               # Expo Router file-based routing
│           │   ├── (auth)/        # Auth group (no tab bar)
│           │   │   ├── login.tsx
│           │   │   ├── register.tsx
│           │   │   └── forgot-password.tsx
│           │   ├── (tabs)/        # Main app with tabs
│           │   │   ├── _layout.tsx
│           │   │   ├── index.tsx         # Home
│           │   │   ├── schedule.tsx      # Class schedule
│           │   │   ├── bookings.tsx      # My bookings
│           │   │   ├── profile.tsx       # Profile
│           │   │   └── more.tsx          # More menu
│           │   ├── class/
│           │   │   └── [id].tsx          # Class detail
│           │   ├── booking/
│           │   │   └── [id].tsx          # Booking detail
│           │   └── _layout.tsx           # Root layout
│           ├── components/        # Shared RN components
│           │   ├── ui/            # Buttons, inputs, cards
│           │   ├── layout/        # Headers, tab bar
│           │   └── gym/           # Domain-specific components
│           ├── hooks/             # Custom RN hooks
│           ├── stores/            # Zustand stores (shared)
│           ├── lib/               # Utilities
│           │   ├── supabase.ts
│           │   ├── api.ts
│           │   └── notifications.ts
│           ├── i18n/              # Translations (shared)
│           └── types/             # TypeScript types
├── packages/
│   ├── shared/                    # Shared code (web + mobile)
│   │   ├── src/
│   │   │   ├── types/             # Shared TypeScript types
│   │   │   │   ├── user.ts
│   │   │   │   ├── booking.ts
│   │   │   │   ├── class.ts
│   │   │   │   └── payment.ts
│   │   │   ├── validation/        # Zod schemas (shared)
│   │   │   │   ├── user.ts
│   │   │   │   ├── booking.ts
│   │   │   │   ├── class.ts
│   │   │   │   └── payment.ts
│   │   │   ├── utils/             # Shared utilities
│   │   │   │   ├── date.ts
│   │   │   │   ├── currency.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── permissions.ts
│   │   │   └── constants/         # Shared constants
│   │   │       ├── roles.ts
│   │   │       ├── permissions.ts
│   │   │       └── gym.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui-shared/                 # Cross-platform UI primitives
│   │   ├── src/
│   │   │   ├── Button.tsx         # React Native Web approach
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Avatar.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                    # Shared config
│       ├── eslint-config/
│       ├── tsconfig-config/
│       └── tailwind-config/
├── supabase/
│   ├── migrations/                # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_seed_data.sql
│   │   └── 004_functions.sql
│   ├── functions/                 # Edge Functions
│   │   ├── auth-hooks/
│   │   ├── booking-flow/
│   │   ├── billing-webhook/
│   │   ├── check-in/
│   │   ├── notifications/
│   │   └── analytics/
│   ├── seeds/                     # Seed data for dev
│   └── policies/                  # RLS policy definitions
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml     # Production stack
│   │   ├── docker-compose.dev.yml # Development stack
│   │   └── docker-compose.test.yml
│   ├── caddy/
│   │   └── Caddyfile
│   ├── scripts/
│   │   ├── deploy.sh
│   │   ├── backup.sh
│   │   └── restore.sh
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana-dashboards/
├── docs/
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── ONBOARDING.md
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # pnpm workspace definition
├── turbo.json                     # Turborepo pipeline
└── README.md
```

---

## 14. Shared Code Strategy

### 14.1 What Gets Shared

| Asset | Shared? | Location | Notes |
|-------|---------|----------|-------|
| TypeScript types | Yes | `packages/shared/types/` | All domain types |
| Zod validation schemas | Yes | `packages/shared/validation/` | Form validation + API contracts |
| i18n translations | Yes | `packages/shared/i18n/` | Both platforms use same keys |
| Permission logic | Yes | `packages/shared/utils/permissions.ts` | RBAC checks |
| Date/currency formatters | Yes | `packages/shared/utils/` | Uses Intl APIs (works everywhere) |
| Constants/enums | Yes | `packages/shared/constants/` | Roles, statuses, config |
| API client setup | Partial | `packages/shared/api/` | Base config shared, platform-specific adapter |
| React hooks | Partial | Platform-specific with shared core logic | |
| UI components | Partial | `packages/ui-shared/` | React Native Web for shared primitives |

### 14.2 Package Structure

We use **pnpm workspaces** with **Turborepo** for build orchestration:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "lint": {},
    "type-check": { "dependsOn": ["^build"] }
  }
}
```

### 14.3 Component Sharing Strategy

| Approach | Use Case | Example |
|----------|----------|---------|
| **React Native Web** | Shared UI primitives | Button, Card, Input, Avatar |
| **Platform-specific** | Complex components with native feel | Calendar, Data table, Charts |
| **Hook sharing** | Business logic | useAuth, useBookings, useClasses |
| **Schema sharing** | Validation | Zod schemas for forms + API |

---

## 15. DevOps & Deployment

### 15.1 Local Development Setup

```bash
# 1. Clone repo
git clone https://github.com/goldsgym/ohmygold.git
cd ohmygold

# 2. Install dependencies
pnpm install

# 3. Start local Supabase
cd infra/docker
docker-compose -f docker-compose.dev.yml up -d

# 4. Run migrations
supabase db reset

# 5. Seed data
supabase db seed

# 6. Start web app
cd apps/web
pnpm dev  # → localhost:3000

# 7. Start mobile (separate terminal)
cd apps/mobile
pnpm start  # → Expo dev server, scan QR with device
```

### 15.2 Environment Variables

| Environment | File | Source |
|------------|------|--------|
| Local | `.env.local` | Developer-managed, gitignored |
| Staging | GitHub Secrets | Admin-managed |
| Production | GitHub Secrets + Vault | Admin-managed, encrypted |

**Required env vars:**
```bash
# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Auth
JWT_SECRET=<random-256-bit-key>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Stripe (payments)
STRIPE_PUBLIC_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_

# Notifications
EXPO_ACCESS_TOKEN=

# App
APP_URL=http://localhost:3000
API_URL=http://localhost:54321
```

### 15.3 Deployment Flow

```
Developer pushes to feature branch
           │
           ▼
    GitHub Actions: CI
    - Lint (ESLint + Prettier)
    - Type check (tsc --noEmit)
    - Unit tests (Vitest + Jest)
    - Build check
    - Accessibility audit (axe)
    - **Security: Dependency vulnerability scan (`pnpm audit`)**
    - **Security: Secret detection (GitLeaks/TruffleHog)**
    - **Security: SAST scan (Semgrep/CodeQL)**
    - **Security: Container image scan (Trivy)**
    - **Build fails on CRITICAL/HIGH security findings**
           │
           ▼
    PR review + approval
           │
           ▼
    Merge to main branch
           │
           ▼
    GitHub Actions: Deploy Staging
    - Build web app
    - Build mobile OTA bundle
    - Deploy to staging VPS
    - Run smoke tests
           │
           ▼
    Manual QA on staging
           │
           ▼
    Tag release (v1.2.3)
           │
           ▼
    GitHub Actions: Deploy Production
    - Build + optimize
    - Database migration (reviewed)
    - Blue-green deployment
    - Health check
    - Notify team
```


### 15.3a CI Security Pipeline

Security scanning is integrated into every PR and deployment:

| Stage | Tool | Scope | Fail Threshold |
|-------|------|-------|---------------|
| Dependency audit | `pnpm audit` | All npm packages | CRITICAL: fail, HIGH: warn |
| Secret detection | GitLeaks | Entire repo history | Any finding: fail |
| SAST | Semgrep | TypeScript/TSX source | High-confidence rules: fail |
| Container scan | Trivy | Docker images | CRITICAL: fail, HIGH: warn |
| License audit | `pnpm licenses check` | Dependency licenses | Copyleft in production: warn |

```yaml
# .github/workflows/security.yml
name: Security Scan
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 } # For secret scanning history
      - name: Secret Detection
        uses: gitleaks/gitleaks-action@v2
      - name: Dependency Audit
        run: pnpm audit --audit-level=high
      - name: SAST Scan
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/cwe-top-25
      - name: Container Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ohmygold:latest
          severity: HIGH,CRITICAL
```

### 15.4 Database Migration Strategy

| Rule | Implementation |
|------|---------------|
| Forward-only migrations | No rollback scripts; fix-forward policy |
| Named migrations | Timestamp + descriptive name: `001_create_users_table.sql` |
| Review required | All migrations reviewed in PR by database owner |
| Staging test | Every migration runs on staging before production |
| Backup before migrate | Automated snapshot before production migration |
| Migration logging | All migrations logged to `schema_migrations` table |


### 15.4a Supabase Upgrade Procedure

Self-hosted Supabase requires regular upgrades for security patches and feature updates.

#### Upgrade Cadence

| Type | Frequency | Process | Rollback Window |
|------|-----------|---------|-----------------|
| **Patch** (x.x.Z) | Monthly | Automated via script; test in staging → production | 24-hour automated rollback |
| **Minor** (x.Y.0) | Quarterly | 2-week evaluation period; staging validation required | 48-hour manual rollback |
| **Major** (X.0.0) | Evaluate after 4 weeks | Full regression test; phased rollout (5% → 25% → 100%) | Snapshot-based rollback |

#### Pre-Upgrade Checklist

- [ ] Full database backup completed (Restic snapshot)
- [ ] VPS snapshot created (Hetzner/DigitalOcean)
- [ ] Staging environment upgraded and tested (48-hour soak test)
- [ ] Breaking changes reviewed (GitHub release notes, migration guides)
- [ ] Rollback procedure documented and tested
- [ ] Maintenance window communicated to users (in-app banner + email)

#### Upgrade Flow

```
1. Backup production (automated snapshot)
2. Upgrade staging environment
3. Run smoke tests (auth, booking, payment webhooks)
4. 48-hour staging soak test
5. Schedule maintenance window (low-traffic: 2-4 AM CET)
6. Upgrade production
7. Post-upgrade health checks (all services green)
8. Monitor for 24 hours
9. Clear maintenance banner
```

#### Emergency Rollback Procedure

| Scenario | Rollback Action | Time Required |
|----------|----------------|---------------|
| Service degradation | Restore VPS snapshot | < 30 minutes |
| Database corruption | Restore Restic backup to point-in-time | < 30 minutes |
| API incompatibility | Revert Docker image tag, restart containers | < 5 minutes |
| Data loss | Stop writes → restore backup → replay WAL | < 1 hour |

#### Version Pinning Policy

All Supabase services are pinned to specific versions in `docker-compose.yml`:

```yaml
# infra/docker/docker-compose.yml
services:
  supabase-db:
    image: supabase/postgres:15.1.1.78  # Pinned, never use :latest
  supabase-kong:
    image: kong:3.5.0  # Pinned
  supabase-auth:
    image: supabase/gotrue:v2.151.0  # Pinned
  supabase-realtime:
    image: supabase/realtime:v2.28.32  # Pinned
```

**Upgrade tracking:** All version changes logged in `docs/SUPABASE_UPGRADES.md` with date, old version, new version, change summary, and test results.

#### Breaking Change Monitoring

- Subscribe to [supabase/supabase GitHub releases](https://github.com/supabase/supabase/releases)
- Weekly review of changelog for security advisories
- Security patches applied within 48 hours of release

### 15.5 SSL Certificate Management

Caddy handles certificates automatically via Let's Encrypt:

```caddyfile
# Caddyfile
ohmygold.fr {
    tls internal  # Auto Let's Encrypt
    reverse_proxy localhost:3000
}

api.ohmygold.fr {
    tls internal
    reverse_proxy localhost:8000
}
```

### 15.6 Backup & Disaster Recovery

| Component | Frequency | Retention | Tool |
|-----------|-----------|-----------|------|
| Database | Every 4 hours | 30 days | Restic → S3 |
| File storage | Daily | 30 days | MinIO bucket replication |
| Full VPS snapshot | Weekly | 12 weeks | Hetzner snapshots |
| Config/secrets | On change | 90 days | Git + encrypted vault |

**Recovery time objectives:**
- Database restore: < 30 minutes
- Full system restore: < 2 hours
- Point-in-time recovery: Any 4-hour window in last 30 days

#### Point-in-Time Recovery (PITR) Test Procedure

**Frequency:** Monthly (automated schedule)

**Test scenario:** Simulate data corruption at 2:30 PM → restore to 2:00 PM

```bash
#!/bin/bash
# monthly-pitr-test.sh

# 1. Capture current state checksum
psql -c "SELECT checksum_agg(t::text) FROM users t;" > /tmp/pre-checksum.txt

# 2. Note test timestamp (2 hours ago)
RESTORE_TIME=$(date -d '2 hours ago' '+%Y-%m-%d %H:%M:%S')
echo "Testing PITR to: $RESTORE_TIME"

# 3. Restore to test instance from backup
restic restore latest --target /tmp/pitr-test --time "$RESTORE_TIME"

# 4. Start temporary PostgreSQL instance with restored data
docker run -d --name pitr-test -v /tmp/pitr-test:/var/lib/postgresql/data -p 55432:5432 postgres:16
sleep 10

# 5. Verify data integrity
psql -h localhost -p 55432 -c "SELECT COUNT(*) FROM users;" > /tmp/post-count.txt
diff /tmp/pre-count.txt /tmp/post-count.txt

# 6. Verify critical tables exist and have data
psql -h localhost -p 55432 -c "
  SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM memberships) as memberships,
    (SELECT COUNT(*) FROM payments) as payments;
"

# 7. Cleanup
docker stop pitr-test && docker rm pitr-test
rm -rf /tmp/pitr-test
echo 'PITR test passed'
```

**Recovery verification checklist:**
- [ ] Database starts without errors
- [ ] All expected tables present with correct schema
- [ ] Row counts within expected range (±1% for recent data)
- [ ] Critical business data verified (users, memberships, payments)
- [ ] RLS policies intact
- [ ] Connection strings functional
- [ ] **Recovery time measured** and logged to monitoring

**Alerting:** If PITR test fails → immediate Slack alert + manual investigation within 4 hours

### 15.7 Monitoring & Alerting

| Layer | Tool | Metrics | Alerts |
|-------|------|---------|--------|
| Infrastructure | Uptime Kuma | Uptime, response time | SMS on downtime |
| Application | Prometheus + Grafana | Request rate, error rate, latency | Slack on error spike |
| Database | PostgreSQL exporter | Query time, connections, replication lag | PagerDuty on high latency |
| Mobile | Expo Insights | Crash rate, OTA update status | Email on crash spike |
| Business | Custom Grafana dashboards | Daily check-ins, bookings, revenue | Daily email reports |

### 15.8 Log Aggregation

```yaml
# Promtail → Loki → Grafana
logs:
  - job_name: ohmygold-web
    static_configs:
      - targets: [localhost]
        labels:
          job: web
          __path__: /var/log/ohmygold/web.log
  - job_name: ohmygold-api
    static_configs:
      - targets: [localhost]
        labels:
          job: api
          __path__: /var/log/ohmygold/api.log
```

Log format: Structured JSON with `trace_id`, `user_id`, `timestamp`, `level`, `message`, `context`.

---

## 16. Risk Assessment & Mitigation

### 16.1 Top 10 Technical Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | **VPS resource exhaustion** under peak load | Medium | High | Monitoring alerts + vertical scaling plan + connection pooling |
| 2 | **Database performance degradation** with growth | Medium | High | Query optimization, indexing strategy, read replicas (Phase 2) |
| 3 | **Payment processing failures** (Stripe integration) | Low | Critical | Retry logic, webhook idempotency, manual payment fallback |
| 4 | **Data breach / unauthorized access** | Low | Critical | RLS, encryption, SOC2 controls, penetration testing |
| 5 | **Self-hosted Supabase upgrade complexity** | Medium | Medium | Test upgrades in staging, version pinning, backup before upgrade |
| 6 | **Mobile app store rejection** | Medium | Medium | Follow platform guidelines, beta testing via TestFlight/Internal Testing |
| 7 | **GDPR compliance violation** | Low | Critical | Privacy by design, consent management, DPIA, legal review |
| 8 | **Third-party service outage** (Stripe, Expo) | Medium | Medium | Circuit breaker pattern, graceful degradation, cached data |
| 9 | **Key developer departure / bus factor** | Medium | High | Documentation (this doc!), pair programming, cross-training |
| 10 | **Technical debt accumulation** | High | Medium | Code reviews, refactoring sprints, architecture decision records |

### 16.2 Mitigation Strategies

| Strategy | Implementation |
|----------|---------------|
| **Redundancy** | Daily backups to S3 + VPS snapshots + database replication |
| **Monitoring** | Uptime Kuma (external) + Prometheus (internal) + alerting |
| **Circuit breakers** | Fail fast on external service outage; queue for retry |
| **Graceful degradation** | Offline mode, cached data, simplified UI when services down |
| **Runbooks** | Documented procedures for: outage response, data recovery, security incident |

### 16.3 Contingency Plans

| Scenario | Plan |
|----------|------|
| **VPS failure** | Restore from latest snapshot to new VPS (< 2 hours) |
| **Database corruption** | Restore from Restic backup to point-in-time (< 30 min) |
| **Stripe outage** | Queue payments, accept cash, manual entry when restored |
| **Supabase critical bug** | Pin to last known good version; emergency patch |
| **Security breach** | Incident response: isolate → assess → notify (72h GDPR) → remediate |

### 16.4 Technology Lock-In Considerations

| Technology | Lock-in Level | Exit Strategy |
|------------|--------------|---------------|
| Supabase (self-hosted) | Medium | PostgreSQL is standard; extract schema, migrate to managed Postgres |
| React / React Native | Low | Standard web/mobile frameworks, large talent pool |
| Stripe | Low | Payment processor swap via abstraction layer |
| Expo | Medium | Eject to bare React Native if needed |
| Tailwind CSS | Low | Utility classes are standard CSS; can migrate |
| Caddy | Low | Replace with Nginx if needed |

---

## 17. Technology Decisions Log

### ADR-001: Self-Hosted Supabase vs Managed Backend

| Field | Decision |
|-------|----------|
| **Context** | Need a backend with auth, database, real-time, and storage. Budget-conscious for startup phase. Must host in EU for GDPR. |
| **Decision** | Self-hosted Supabase on single VPS |
| **Rationale** | PostgreSQL + Auth + Realtime + Storage + Edge Functions in one platform; Docker Compose for single-VPS deployment; RLS for security; lower cost than managed services at initial scale |
| **Alternatives** | Firebase (vendor lock-in, US-based), managed Supabase Cloud (recurring cost), custom Node.js + PostgreSQL (more development work) |
| **Trade-offs** | Operational overhead of self-hosting vs. cost savings; need expertise for upgrades and troubleshooting |

### ADR-002: React Native + Expo vs Flutter vs Native

| Field | Decision |
|-------|----------|
| **Context** | Need iOS and Android apps for staff and members. Small initial team. Need fast iteration and OTA updates. |
| **Decision** | React Native with Expo SDK |
| **Rationale** | Shared JavaScript/TypeScript codebase with web app; Expo provides managed workflow, OTA updates, push notifications, camera, biometrics; large community; rapid development |
| **Alternatives** | Flutter (Dart learning curve, smaller ecosystem), Native iOS + Android (2x development cost), PWA (limited native features) |
| **Trade-offs** | Slightly less native performance than pure native; Expo Go limitations for some native modules |

### ADR-003: Zustand vs Redux Toolkit for State Management

| Field | Decision |
|-------|----------|
| **Context** | Need global state management for auth, UI, and notifications. Shared between web and mobile. |
| **Decision** | Zustand |
| **Rationale** | Lightweight (1KB), TypeScript-first, minimal boilerplate, works with React and React Native, easy to learn, sufficient for our use case |
| **Alternatives** | Redux Toolkit (more boilerplate, DevTools advantage), Jotai (similar to Zustand), Context API (insufficient for complex state) |
| **Trade-offs** | Fewer DevTools than Redux; simpler debugging but less ecosystem |

### ADR-004: Modular Monolith vs Microservices

| Field | Decision |
|-------|----------|
| **Context** | Single VPS constraint; need to support 6 roles, 120+ features; team of ~5 developers initially. |
| **Decision** | Modular Monolith (Supabase as unified backend) |
| **Rationale** | Simpler deployment, data consistency, debugging, and testing; clear module boundaries enable future extraction; fits single VPS constraint |
| **Alternatives** | Microservices (too complex for initial team size), serverless functions (cold start concerns for real-time features) |
| **Trade-offs** | Risk of tight coupling if module boundaries not respected; harder to scale individual services independently |

### ADR-005: pnpm Workspaces vs npm Workspaces vs Nx

| Field | Decision |
|-------|----------|
| **Context** | Monorepo with web app, mobile app, and shared packages. Need fast installs, shared dependencies, and build orchestration. |
| **Decision** | pnpm workspaces + Turborepo |
| **Rationale** | pnpm: fast, disk-space efficient, strict dependency resolution; Turborepo: fast incremental builds, caching, pipeline orchestration |
| **Alternatives** | npm workspaces (slower, less strict), Nx (more features but heavier), Yarn Berry (good but less popular now) |
| **Trade-offs** | pnpm requires team learning if unfamiliar; Turborepo adds complexity for small repos |

### ADR-006: Caddy vs Nginx as Reverse Proxy

| Field | Decision |
|-------|----------|
| **Context** | Need reverse proxy, TLS termination, and static file serving on single VPS. Want minimal configuration overhead. |
| **Decision** | Caddy 2 |
| **Rationale** | Automatic HTTPS via Let's Encrypt, simple Caddyfile config, HTTP/2 and HTTP/3 support, modern design |
| **Alternatives** | Nginx (more mature, more complex config), Traefik (Docker-native, more complex) |
| **Trade-offs** | Caddy is newer with smaller community; Nginx has more documentation and plugins |

### ADR-007: Vite vs Next.js for Web App

| Field | Decision |
|-------|----------|
| **Context** | Building a client-side web application (admin dashboard, member portal). No SSR requirement. Self-hosted backend. |
| **Decision** | Vite + React SPA |
| **Rationale** | Fast development (HMR), simple deployment (static files), no SSR complexity, works with self-hosted backend, smaller bundle than Next.js |
| **Alternatives** | Next.js (SSR/SSG, API routes — not needed for our architecture), Remix (similar to Next.js) |
| **Trade-offs** | No SSR means less SEO for public pages (acceptable for dashboard/portal); no API routes (handled by Supabase) |

---

## Appendix A: Compliance Checklist

### SOC 2 Readiness

- [ ] Access control with role-based permissions (RLS + RBAC)
- [ ] Encryption at rest (TDE, column-level) and in transit (TLS 1.3)
- [ ] Comprehensive audit logging (all mutations, auth events)
- [ ] Change management process (PR reviews, staging testing)
- [ ] Incident response plan documented
- [ ] Vendor management (DPAs with all third parties)
- [ ] Continuous monitoring (Grafana dashboards, alerting)
- [ ] Backup and disaster recovery tested quarterly

### GDPR Readiness

- [ ] Explicit consent flows at signup and for marketing
- [ ] Privacy policy (mobile-optimized, plain language)
- [ ] Data minimization (only collect required fields)
- [ ] Right to access (self-service data export)
- [ ] Right to erasure (admin deletion workflow)
- [ ] Data portability (structured JSON export)
- [ ] Breach notification process (72-hour SLA)
- [ ] DPIA for health data processing

### WCAG 2.1 AA+ Readiness

- [ ] Contrast ratios verified (automated + manual)
- [ ] Keyboard navigation tested on all flows
- [ ] Screen reader labels on all interactive elements
- [ ] Focus indicators visible and consistent
- [ ] Touch targets minimum 44x44px
- [ ] Reduced motion support implemented
- [ ] Form labels properly associated
- [ ] Error messages descriptive with guidance

---


---

## Appendix B: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T001:** Created centralized migration registry (`supabase/migration-registry.md`) with 76 migrations (000-075), sequential numbering convention, and reserved ranges for future phases |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T002:** Fixed Expo SDK 54 → SDK 53 across all roadmap files (phase_01, phase_06, 99_agent_prompts_library) |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T003:** Pinned all dependency versions: shadcn/ui ^2.0.0, Uptime Kuma ^1.23.0, Restic ^0.17.0. Added version verification date note and upgrade policy |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T004:** Defined complete Content Security Policy with all directives (default-src, script-src, connect-src, frame-src, img-src, media-src, worker-src), nonce generation strategy, CSP reporting endpoint, and Stripe-specific directives |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T005:** Added WebSocket horizontal scaling strategy with per-VPS connection limits, fallback to short-polling, and Phase 3+ horizontal scaling architecture |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T006:** Standardized monorepo paths: `packages/ui/` → `packages/ui-shared/` across 99_agent_prompts_library.md (15 fixes) and phase_02_design_system.md (123 fixes) |
| 1.0.0 | 2026-04-29 | Principal Architect | **CRITICAL-T007:** Added Supabase Upgrade Procedure section with upgrade cadence (patch monthly, minor quarterly, major evaluate), pre-upgrade checklist, emergency rollback, version pinning policy, and breaking change monitoring |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T001:** Added missing composite indexes: memberships(location_id, status), bookings(user_id, status, class_date) partial, check_ins(location_id, check_in_time DESC), invoices(user_id, created_at DESC). Added index maintenance strategy |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T002:** Enhanced API versioning section with deprecation headers (Deprecation: true, Sunset: <date>), 6-month support window, and URL-based versioning |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T003:** Designed complete MFA/TOTP flow: mfa_factors table schema, RLS policies, TOTP secret generation (RFC 6238), QR code display, 10 backup codes, recovery flow with email verification |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T004:** Defined session timeout per role: Admin/Manager 4h, Employee/Teacher 8h, Client 30d, Visitor 1h. Added idle detection (15-30 min), warning toast UX, useIdleTimeout hook |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T005:** Added NF 525 Fiscal Compliance Appendix: receipt data elements, ECDSA digital signing, daily Z-ticket, 3-year archive requirements, optional certified hardware integration |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T006:** Defined booking atomic transaction: SELECT FOR UPDATE, SERIALIZABLE isolation, 3-retry with exponential backoff (100ms/300ms/900ms), serialization_failure handling |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T007:** Added offline implementation spec for Employee check-in: Service Worker (Workbox), IndexedDB schema, Background Sync API, conflict resolution rules, visual indicators |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T008:** Defined offline-first cache strategy: TTL per data type (schedules 24h, bookings 1h, profile 6h), 50MB max cache, LRU eviction, stale-while-revalidate with 5-min stale time |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T009:** Added visual regression testing spec: Chromatic integration, 0.5% diff threshold, brand-critical zero tolerance (logo, gold color), mobile device farm screenshots |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T010:** Increased AI churn prediction accuracy: 70% → 85% precision / 80% recall. Added class imbalance handling (SMOTE), feature importance tracking, A/B testing, human-in-the-loop |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T011:** Enhanced French "tu" informal address: fr-informal locale key, 10 translation examples (tu vs vous), ESLint rule for formal French detection, translation review checklist |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T012:** Added mobile a11y testing: iOS VoiceOver, Android TalkBack, switch control, dynamic type, reduce motion, screen magnification — with frequencies and procedures |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T013:** Added CI security pipeline: pnpm audit, GitLeaks secret detection, Semgrep SAST, Trivy container scan — all integrated into GitHub Actions with fail thresholds |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T014:** Added App Store privacy compliance: ATT framework (NSUserTrackingUsageDescription, NSHealthShareUsageDescription), privacy nutrition labels, Google Play health data declaration |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T015:** Added database-level rate limiting: rate_limits table, sliding window algorithm, X-RateLimit-* headers, Edge Function integration |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T016:** Added waitlist notification delivery guarantee: triple-channel (push+email+SMS), 2-hour hold with countdown, cascade promotion (max 3), waitlist_promotions audit table |
| 1.0.0 | 2026-04-29 | Principal Architect | **HIGH-T017:** Added data retention & archival policy: 8 data types with retention periods (7 years for audit logs, 10 years for payments), automated monthly purge, archival to cold storage |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T001:** Changed audit_logs FK from ON DELETE CASCADE to SET NULL + added user_email column for user identity preservation after account deletion |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T002:** Added animation token specs: duration scale (150ms/300ms/500ms), easing curves (ease-out, spring, linear), stagger patterns, reduced motion support |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T004:** Added QR code generation spec: HMAC-SHA256 signed format, daily key rotation, offline validation, 200x200px minimum, 5-minute replay window |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T006:** Added biometric auth fallback: PIN/password, new biometric detection, graceful degradation, LocalAuthentication API integration |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T008:** Created bundle size budget breakdown: 15MB initial + 5MB on-demand Phase 7, code-splitting strategy per feature |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T009:** Expanded pentest scope: Edge Function auth bypass, PostgreSQL injection, RLS bypass, JWT manipulation, WebSocket injection, file upload vulnerabilities |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T015:** Added ESC/POS thermal printer integration: 80mm receipt template, USB/Bluetooth/Ethernet, print queue, fallback to email |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T017:** Clarified RTL support: not required for Phase 1 (FR/EN only), documented future migration path if RTL markets targeted |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T020:** Updated image strategy: AVIF primary, WebP fallback, JPEG legacy, <picture> element, CDN auto-format negotiation |
| 1.0.0 | 2026-04-29 | Principal Architect | **MED-T022:** Added PITR monthly test procedure: automated script, verification checklist, recovery time measurement, failure alerting |
| 1.0.0 | 2026-04-29 | Principal Architect | **CR-7:** Added DESIGN.MD references to 49 agent prompts across 5 phase files (phase_01: 10, phase_05: 7, phase_06: 12, phase_07: 10, phase_09: 10) |

---

*End of Architecture Document. This is a living document — all changes require PR review and approval.*

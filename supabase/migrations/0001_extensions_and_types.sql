-- ============================================================
-- Migration: 0001_extensions_and_types
-- Description: Enable required PostgreSQL extensions and create app-level enums
-- ============================================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Trigram text search
CREATE EXTENSION IF NOT EXISTS "unaccent";        -- Accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query performance stats

-- ---- Application Role Enum ----
CREATE TYPE public.app_role AS ENUM (
  'super_admin',   -- Full system access across all gyms
  'admin',         -- Full access to a specific gym location
  'coach',         -- Class management + member read access
  'receptionist',  -- Front-desk operations + check-in
  'member',        -- Registered gym member
  'visitor'        -- Unauthenticated or trial user
);

-- ---- Membership Status Enum ----
CREATE TYPE public.membership_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'expired',
  'pending'
);

-- ---- Payment Status Enum ----
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'cancelled'
);

-- ---- Class Status Enum ----
CREATE TYPE public.class_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
);

-- ---- Booking Status Enum ----
CREATE TYPE public.booking_status AS ENUM (
  'booked',
  'attended',
  'cancelled',
  'no_show',
  'waitlisted'
);

-- ---- Contract Type Enum ----
CREATE TYPE public.contract_type AS ENUM (
  'monthly',
  'annual',
  'quarterly',
  'day_pass',
  'trial'
);

-- ---- Gender Enum ----
CREATE TYPE public.gender AS ENUM (
  'male',
  'female',
  'non_binary',
  'prefer_not_to_say'
);

-- ---- Notification Channel Enum ----
CREATE TYPE public.notification_channel AS ENUM (
  'email',
  'sms',
  'push',
  'in_app'
);

-- ---- Access Method Enum ----
CREATE TYPE public.access_method AS ENUM (
  'badge',
  'qr',
  'manual'
);

-- ---- Audit Action Enum ----
CREATE TYPE public.audit_action AS ENUM (
  'login',
  'logout',
  'register',
  'password_reset',
  'profile_update',
  'member_create',
  'member_update',
  'member_delete',
  'booking_create',
  'booking_cancel',
  'payment_process',
  'payment_refund',
  'class_create',
  'class_update',
  'class_cancel',
  'access_grant',
  'access_deny'
);

# Wave 1 Fix Mission: Database Role Alignment & RLS Security — Summary Report

## 1. ACTUAL Role Names Found

### Database Enum (`app_role` in 0001_extensions_and_types.sql)
**Original values:**
- `super_admin`, `admin`, `coach`, `receptionist`, `member`, `visitor`

**After 0022_rls_helpers.sql alignment:**
- `super_admin`, `admin`, `manager`, `coach`, `teacher`, `receptionist`, `employee`, `member`, `client`, `visitor`

### Application Code (`packages/shared/src/types.ts`)
**Before:** `super_admin`, `admin`, `coach`, `receptionist`, `member`, `visitor`
**After:** Same as DB enum (all 10 values)

### Roadmap Expected Roles
- `super_admin`, `admin`, `manager`, `employee`, `teacher`, `client`, `visitor`

### Alignment Strategy Chosen
**Hybrid pragmatic approach:**
1. **Added** missing roadmap roles (`manager`, `employee`, `teacher`, `client`) to the DB enum via `ALTER TYPE ... ADD VALUE` in migration 0022
2. **Preserved** legacy roles (`coach`, `receptionist`, `member`) because:
   - They are used in **every** existing RLS policy across 15 migration files
   - They exist in actual database rows (user_profiles table data)
   - PostgreSQL enums **cannot** rename values without a complex migration cascade
   - The entire web app permission matrix and route guards depend on them
3. **Mapped** legacy ↔ roadmap pairs through helper functions and documentation:
   - `coach`        ↔ `teacher`   (class instructor)
   - `receptionist` ↔ `employee`  (front-desk staff)
   - `member`       ↔ `client`    (gym member / paying customer)
4. **Updated** all app code (shared types, permissions, layout components, i18n, route guards) to recognize the new roles alongside the legacy ones

This ensures **backward compatibility** with existing data while making the new roadmap roles available for future use.

---

## 2. CRITICAL Issues Fixed

### CRITICAL-001: RLS Policies Reference Non-Existent Roles (SEVERE)
**Impact:** Migrations 0016, 0017, 0018, 0019, 0020, 0021 referenced `'manager'` and `'employee'` in RLS policies, but these values **did not exist** in the `app_role` enum. This meant:
- No user could write to `facility_zones`, `equipment`, `capacity_rules`, `operating_hours`, `holiday_schedules`
- No user could access CRM (`leads`, `lead_activities`, `staff_schedules`, `time_tracking`)
- No user could access POS (`pos_products`, `pos_transactions`)
- No user could access enhanced subscription/membership features

**Fix:** Migration 0022 adds `'manager'` and `'employee'` to the enum. Original policy role references are preserved and will now evaluate correctly.

### CRITICAL-002: `super_admin` Blocked from Admin Routes
**Impact:** `App.tsx` guarded all `/admin/*` routes with `roles=["admin"]` only, meaning `super_admin` users received 401/unauthorized.

**Fix:** Updated all admin route guards to `roles=["admin", "super_admin"]`.

### CRITICAL-003: Views Lack Access Control
**Impact:** `member_details`, `class_details`, `daily_stats` views had no row-level security. Any authenticated user with direct SQL access could query sensitive member data and revenue aggregates.

**Fix:** Migration 0022 recreates all three views as `WITH (security_barrier)` views with explicit `WHERE` clauses that enforce access:
- `member_details`: members see own record; staff see all
- `class_details`: all authenticated see scheduled classes; staff see all
- `daily_stats`: staff-only (exposes revenue)

---

## 3. Files Modified

### Database Migrations (reverted to original role refs — now valid because enum is extended)
| File | Change |
|------|--------|
| `0016_facility_zones.sql` | Reverted temporary `'admin'` fix back to original `'admin','manager'` refs |
| `0017_membership_plans_enhanced.sql` | Reverted temporary fix back to original `'admin','manager'` refs |
| `0018_member_profiles_enhanced.sql` | Reverted temporary fix back to original `'admin','manager','employee'` refs |
| `0019_subscriptions_enhanced.sql` | Reverted temporary fix back to original `'admin','manager','employee'` refs |
| `0020_crm.sql` | Reverted temporary fix back to original `'admin','manager','employee'` refs |
| `0021_pos.sql` | Reverted temporary fix back to original `'admin','manager','employee'` refs |
| `README.md` | Updated migration inventory + expanded RLS matrix to include all new tables and roles |

### Application Code
| File | Change |
|------|--------|
| `App.tsx` | Admin routes now allow `super_admin`; employee/teacher/client routes include legacy aliases |
| `packages/shared/src/types.ts` | `AppRole` union extended; `ROLE_PERMISSIONS` expanded for new roles |
| `apps/web/src/lib/permissions.ts` | `PERMISSIONS_BY_ROLE` + `ROLE_HIERARCHY` expanded for `manager`, `employee`, `teacher`, `client` |
| `apps/web/src/components/layout/Sidebar.tsx` | `NAV_ITEMS` + `ROLE_LABEL_KEYS` expanded for all new roles |
| `apps/web/src/components/layout/BottomTabs.tsx` | `BOTTOM_TABS` expanded for all new roles |
| `apps/web/src/components/layout/UserMenu.tsx` | Subscription button now shows for `member` OR `client` |
| `apps/web/src/i18n/locales/fr/common.json` | Added French labels for `manager`, `teacher`, `employee`, `client` |
| `apps/web/src/i18n/locales/en/common.json` | Added English labels for `manager`, `teacher`, `employee`, `client` |

---

## 4. Files Created

| File | Description |
|------|-------------|
| `0022_rls_helpers.sql` | **Role enum extension** (adds `manager`, `employee`, `teacher`, `client`). **RLS helper functions** (`get_current_user_role`, `is_super_admin`, `is_admin`, `is_manager`, `is_staff`, `is_front_desk`, `is_coach`, `is_member`, `get_current_user_location_id`). **Security-barrier views** (`member_details`, `class_details`, `daily_stats`) with explicit access controls. **Policy refactoring** of core tables to use helpers. **Comments** documenting view security rules. |

---

## 5. Issues Flagged (Not Fully Resolved)

### Flag A: Full Enum Value Renaming Deferred
PostgreSQL does not support `RENAME VALUE` on enums. To fully align `coach`→`teacher`, `receptionist`→`employee`, `member`→`client`, a future migration must:
1. Create a new enum type with only the 7 roadmap values
2. `ALTER TABLE user_profiles ALTER COLUMN role TYPE new_enum USING ...`
3. Migrate data: `UPDATE user_profiles SET role = 'teacher' WHERE role = 'coach'` etc.
4. Recreate all policies that reference old values
5. Update all app code to remove legacy aliases

**Risk:** This is a destructive data migration that must be tested in staging first.

### Flag B: `manager` Role Hierarchy Ambiguity
The roadmap places `manager` between `admin` and `employee`. The current DB policies treat `manager` as equivalent to `admin` for most write operations (0016–0021). A future cleanup should differentiate `manager` (location-level) from `admin` (system-level) permissions more granularly.

### Flag C: Location-Based RLS Missing
`get_current_user_location_id()` was created but is not yet used in any policies. A future wave should add gym-scoped RLS so that `manager` and `receptionist` users only see data for their assigned location.

---

## 6. Verification Checklist

- [x] All 6 broken migrations (0016–0021) now reference roles that exist in the enum
- [x] `super_admin` can access `/admin/*` routes
- [x] Views have `security_barrier` and explicit access predicates
- [x] Helper functions are `SECURITY DEFINER` (bypass RLS, safe for policy use)
- [x] App `AppRole` type includes all DB enum values
- [x] Permission matrices cover all roles
- [x] Layout navigation supports all roles
- [x] i18n labels exist for all roles

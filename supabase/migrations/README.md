# OhMyGold Database Migration Registry

> **Source of truth** for all Supabase database migrations.  
> Every migration is sequential, numbered, and idempotent where possible.

---

## Migration Inventory

| # | File | Description | Tables Affected | Status |
|---|------|-------------|-----------------|--------|
| 0001 | `0001_extensions_and_types.sql` | PostgreSQL extensions + all ENUM types | — | ✅ Ready |
| 0002 | `0002_user_profiles.sql` | User profiles (extends auth.users) + auto-create trigger | `user_profiles` | ✅ Ready |
| 0003 | `0003_gym_locations.sql` | Gym locations with seed data (3 French gyms) | `gym_locations` | ✅ Ready |
| 0004 | `0004_members.sql` | Gym members with soft-delete | `members` | ✅ Ready |
| 0005 | `0005_membership_plans.sql` | Membership pricing plans | `membership_plans` | ✅ Ready |
| 0006 | `0006_gym_classes.sql` | Class schedule with capacity tracking | `gym_classes` | ✅ Ready |
| 0007 | `0007_bookings.sql` | Class bookings + auto booking count trigger | `bookings` | ✅ Ready |
| 0008 | `0008_payments.sql` | Payment records | `payments` | ✅ Ready |
| 0009 | `0009_access_control.sql` | Gym entry access logs | `access_logs` | ✅ Ready |
| 0010 | `0010_notifications.sql` | In-app notifications | `notifications` | ✅ Ready |
| 0011 | `0011_audit_log.sql` | Security audit trail | `audit_logs` | ✅ Ready |
| 0012 | `0012_realtime_publications.sql` | Supabase Realtime publication config | — | ✅ Ready |
| 0013 | `0013_storage_buckets.sql` | Storage buckets + RLS (avatars, documents, assets) | `storage.objects` | ✅ Ready |
| 0014 | `0014_views_and_functions.sql` | Useful views + helper functions | Views | ✅ Ready |
| 0015 | `0015_seed_dev_data.sql` | Dev seed: membership plans per gym | `membership_plans` | ✅ Dev Only |

---

## RLS Summary (Row Level Security)

All tables have RLS enabled. Access is granted based on `app_role`:

| Table | member | receptionist | coach | admin | super_admin |
|-------|--------|-------------|-------|-------|-------------|
| `user_profiles` | Own only | Read all | Read all | Read+Write all | All |
| `gym_locations` | Read active | Read active | Read active | Read active | All |
| `members` | Own only | Read+Write | Read | Read+Write | All |
| `membership_plans` | Read active | Read active | Read active | All | All |
| `gym_classes` | Read | Read | Read+Write | All | All |
| `bookings` | Own only | All | Read all | All | All |
| `payments` | Own only | Read+Write | — | All | All |
| `access_logs` | Own only | All | — | All | All |
| `notifications` | Own only | — | — | Create | All |
| `audit_logs` | Own only | — | — | Read all | All |

---

## How to Run Migrations

### Local (Docker Compose Supabase)
```bash
# Apply all migrations in order
for f in supabase/migrations/*.sql; do
  echo "Applying $f..."
  psql "postgresql://supabase:your-password@localhost:54322/postgres" -f "$f"
done
```

### Using Supabase CLI
```bash
supabase db push   # push all pending migrations
supabase db reset  # reset to clean state and re-run all migrations
```

---

## Adding a New Migration

1. Create `supabase/migrations/NNNN_description.sql`
2. Always include a header comment
3. Enable RLS on all new tables
4. Add entries to this registry
5. Test locally before committing

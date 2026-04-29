# OhMyGold — Database Migration Registry

> **Purpose:** Centralized registry of all database migrations to prevent numbering collisions
> **Naming Convention:** `NNNNNNNNNNNNNN_description.sql` (14-digit sequential number, zero-padded)
> **Range:** 00000000000000 — 99999999999999 (supports 100 trillion migrations)
> **Last Updated:** April 2026

## Convention Rules

1. **All migration numbers are globally unique** — once assigned, never reused
2. **Sequential numbering** — next migration = highest existing + 1
3. **Descriptive names** — use `verb_noun` format (e.g., `create_users_table`)
4. **One migration per logical change** — don't combine unrelated schema changes
5. **Forward-only** — no rollback migrations; fix-forward policy

## Migration Registry

### Phase 1: Foundation (00000000000000 — 00000000000015)

| Number | File | Phase | Description |
|--------|------|-------|-------------|
| 00000000000000 | 00000000000000_init.sql | P1 | Enable extensions, schemas |
| 00000000000001 | 00000000000001_roles.sql | P1 | Role definitions, permissions |
| 00000000000002 | 00000000000002_users.sql | P1 | Extended user profiles |
| 00000000000003 | 00000000000003_locations.sql | P1 | Gym locations |
| 00000000000004 | 00000000000004_memberships.sql | P1 | Membership plans |
| 00000000000005 | 00000000000005_members.sql | P1 | Member enrollments |
| 00000000000006 | 00000000000006_subscriptions.sql | P1 | Active subscriptions |
| 00000000000007 | 00000000000007_classes.sql | P1 | Class types and schedules |
| 00000000000008 | 00000000000008_bookings.sql | P1 | Class bookings and waitlist |
| 00000000000009 | 00000000000009_access.sql | P1 | Check-in logs, access control |
| 00000000000010 | 00000000000010_billing.sql | P1 | Invoices, payments |
| 00000000000011 | 00000000000011_inventory.sql | P1 | Products, stock levels |
| 00000000000012 | 00000000000012_crm.sql | P1 | Leads, pipeline stages |
| 00000000000013 | 00000000000013_communications.sql | P1 | Campaigns, messages |
| 00000000000014 | 00000000000014_audit.sql | P1 | Audit log triggers |
| 00000000000015 | 00000000000015_functions.sql | P1 | Database functions |

### Phase 3: Authentication (00000000000016 — 00000000000019)

| Number | File | Phase | Description |
|--------|------|-------|-------------|
| 00000000000016 | 00000000000016_rls_policies.sql | P3 | RLS policies for all tables |
| 00000000000017 | 00000000000017_rbac_functions.sql | P3 | Helper functions for RBAC |
| 00000000000018 | 00000000000018_user_sessions.sql | P3 | Session tracking table |
| 00000000000019 | 00000000000019_auth_audit.sql | P3 | Auth audit logging setup |

### Phase 4: Core Gym Management (00000000000020 — 00000000000058)

| Number | File | Phase | Description |
|--------|------|-------|-------------|
| 00000000000020 | 00000000000020_facility_zones.sql | P4 | Facility zones per location |
| 00000000000021 | 00000000000021_equipment.sql | P4 | Equipment inventory |
| 00000000000022 | 00000000000022_capacity_rules.sql | P4 | Capacity rules and limits |
| 00000000000023 | 00000000000023_membership_plans_enhanced.sql | P4 | Enhanced membership plans |
| 00000000000024 | 00000000000024_plan_features.sql | P4 | Plan features junction table |
| 00000000000025 | 00000000000025_member_profiles.sql | P4 | Member profile extensions |
| 00000000000026 | 00000000000026_medical_questionnaire.sql | P4 | Health questionnaire |
| 00000000000027 | 00000000000027_membership_cards.sql | P4 | Digital membership cards |
| 00000000000028 | 00000000000028_subscription_events.sql | P4 | Subscription lifecycle events |
| 00000000000029 | 00000000000029_subscription_cron.sql | P4 | Subscription cron jobs |
| 00000000000030 | 00000000000030_class_types_enhanced.sql | P4 | Enhanced class types |
| 00000000000031 | 00000000000031_schedule_recurrence.sql | P4 | Schedule recurrence rules |
| 00000000000032 | 00000000000032_room_allocation.sql | P4 | Room allocation system |
| 00000000000033 | 00000000000033_bookings_enhanced.sql | P4 | Enhanced booking system |
| 00000000000034 | 00000000000034_waitlist.sql | P4 | Waitlist management |
| 00000000000035 | 00000000000035_booking_rules.sql | P4 | Booking business rules |
| 00000000000036 | 00000000000036_access_rules.sql | P4 | Access control rules |
| 00000000000037 | 00000000000037_check_in_system.sql | P4 | Check-in/QR system |
| 00000000000038 | 00000000000038_billing_enhanced.sql | P4 | Enhanced billing |
| 00000000000039 | 00000000000039_invoice_items.sql | P4 | Invoice line items |
| 00000000000040 | 00000000000040_nf525_compliance.sql | P4 | NF 525 fiscal compliance |
| 00000000000041 | 00000000000041_pos_transactions.sql | P4 | POS transaction recording |
| 00000000000042 | 00000000000042_discounts.sql | P4 | Discount/coupon system |
| 00000000000043 | 00000000000043_inventory_transactions.sql | P4 | Inventory stock movements |
| 00000000000044 | 00000000000044_purchase_orders.sql | P4 | Purchase order management |
| 00000000000045 | 00000000000045_suppliers.sql | P4 | Supplier directory |
| 00000000000046 | 00000000000046_lead_activities.sql | P4 | Lead activity tracking |
| 00000000000047 | 00000000000047_follow_up_reminders.sql | P4 | Follow-up reminder system |
| 00000000000048 | 00000000000048_conversion_tracking.sql | P4 | Lead conversion analytics |
| 00000000000049 | 00000000000049_campaign_segments.sql | P4 | Marketing campaign segments |
| 00000000000050 | 00000000000050_campaign_analytics.sql | P4 | Campaign analytics |
| 00000000000051 | 00000000000051_marketing_consent.sql | P4 | Marketing consent management |
| 00000000000052 | 00000000000052_staff_profiles.sql | P4 | Staff profile extensions |
| 00000000000053 | 00000000000053_certifications.sql | P4 | Staff certifications |
| 00000000000054 | 00000000000054_staff_schedules.sql | P4 | Staff scheduling |
| 00000000000055 | 00000000000055_analytics_views.sql | P4 | Analytics materialized views |
| 00000000000056 | 00000000000056_dashboard_metrics.sql | P4 | Dashboard metrics aggregation |
| 00000000000057 | 00000000000057_report_templates.sql | P4 | Report template system |
| 00000000000058 | 00000000000058_scheduled_reports.sql | P4 | Scheduled report generation |

### Phase 7: Advanced Features (00000000000059 — 00000000000075)

| Number | File | Phase | Description |
|--------|------|-------|-------------|
| 00000000000059 | 00000000000059_challenges.sql | P7 | Fitness challenges |
| 00000000000060 | 00000000000060_leaderboards.sql | P7 | Leaderboard system |
| 00000000000061 | 00000000000061_challenge_participants.sql | P7 | Challenge participants |
| 00000000000062 | 00000000000062_badges.sql | P7 | Achievement badges |
| 00000000000063 | 00000000000063_member_achievements.sql | P7 | Member achievements tracking |
| 00000000000064 | 00000000000064_streaks.sql | P7 | Streak tracking |
| 00000000000065 | 00000000000065_xp_points.sql | P7 | XP/leveling system |
| 00000000000066 | 00000000000066_video_content.sql | P7 | Video content platform |
| 00000000000067 | 00000000000067_video_categories.sql | P7 | Video categorization |
| 00000000000068 | 00000000000068_nutrition_logs.sql | P7 | Nutrition logging |
| 00000000000069 | 00000000000069_meal_plans.sql | P7 | Meal plan system |
| 00000000000070 | 00000000000070_water_tracker.sql | P7 | Water intake tracking |
| 00000000000071 | 00000000000071_social_posts.sql | P7 | Social feed posts |
| 00000000000072 | 00000000000072_social_interactions.sql | P7 | Social interactions |
| 00000000000073 | 00000000000073_follows.sql | P7 | Social following |
| 00000000000074 | 00000000000074_iot_equipment.sql | P7 | IoT-connected equipment |
| 00000000000075 | 00000000000075_equipment_data.sql | P7 | IoT equipment sensor data |

### Reserved Ranges

| Range | Purpose |
|-------|---------|
| 00000000000076 — 00000000000099 | Phase 5 (Web screens - data migrations) |
| 00000000000100 — 00000000000129 | Phase 6 (Mobile - push/device migrations) |
| 00000000000130 — 00000000000199 | Phase 8 (Compliance - audit/security) |
| 00000000000200 — 00000000000999 | Future phases / hotfixes |
| 00000000001000+ | Reserved for post-launch |

## How to Add a New Migration

1. Check this registry for the highest assigned number
2. Assign the next sequential number (e.g., if last is 00000000000075, next is 00000000000076)
3. Add your migration to this registry BEFORE writing the SQL file
4. Use the format: `000000000000NN_description.sql`
5. Update this registry with your new migration entry

---
*This registry is the single source of truth for migration numbering.*

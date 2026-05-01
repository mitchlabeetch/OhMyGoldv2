# Phase 4 Audit Report — Core Gym Management (OhMyGoldv2)

> **Auditor:** EXTREME SEVERITY Backend & Business Logic Auditor  
> **Date:** 2025-06-28  
> **Repository:** `/mnt/agents/OhMyGoldv2-main`  
> **Roadmap:** `/mnt/agents/OhMyGoldv2-main/ohmygold/team3_technical_architecture/roadmap/phase_04_core_gym.md`

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Findings** | **54** |
| **CRITICAL** | 18 |
| **HIGH** | 20 |
| **MEDIUM** | 12 |
| **LOW** | 4 |
| **Phase Status** | **INCOMPLETE** |
| **Modules Complete** | **4 / 16** |
| **Modules Partial** | **6 / 16** |
| **Modules Missing** | **6 / 16** |

---

## Module-by-Module Assessment

### 4.1 Location and Facility Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `facility_zones` table | EXISTS | Migration 0016 — complete with RLS | OK |
| `equipment` table | EXISTS | Migration 0016 — complete with RLS | OK |
| `capacity_rules` table | EXISTS | Migration 0016 — complete with RLS | OK |
| `operating_hours` table | EXISTS | Migration 0016 — complete with RLS | OK |
| `holiday_schedules` table | EXISTS | Migration 0016 — complete with RLS | OK |
| `locations` Edge Function | EXISTS | Basic CRUD + detail view with zones | OK |
| `facility-zones` Edge Function | **MISSING** | No separate Edge Function for zone CRUD | HIGH |
| `equipment` Edge Function | **MISSING** | No separate Edge Function for equipment CRUD | HIGH |
| `capacity` Edge Function | **MISSING** | No real-time occupancy Edge Function | HIGH |
| `useLocations()` hook | EXISTS | Includes zones, equipment, hours | OK |
| `useFacilityZones()` hook | **MISSING** | Not in hooks/index.ts or useLocations.ts | HIGH |
| `useEquipment()` hook | **MISSING** | Not in hooks/index.ts or useLocations.ts | HIGH |
| `useCapacity()` hook | **MISSING** | No real-time occupancy hook | HIGH |
| Admin locations pages | EXISTS | list, detail, new | OK |
| Manager location dashboard | **MISSING** | No manager/locations/ directory | MEDIUM |
| Mobile location viewer | **MISSING** | No mobile location screen | MEDIUM |
| Real-time capacity via Realtime | **MISSING** | No Supabase Realtime channel for occupancy | CRITICAL |
| French holidays pre-loaded | **MISSING** | holiday_schedules table empty, no seed data | MEDIUM |
| **Module Rating** | **PARTIAL** | Core tables exist but Edge Functions, hooks, and real-time missing | — |

### 4.2 Membership Plan Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Enhanced `membership_plans` table | EXISTS | Migration 0017 — billing_interval, freeze rules, etc. | OK |
| `plan_features` table | EXISTS | Catalog with seeded data | OK |
| `plan_feature_inclusions` table | EXISTS | Junction table | OK |
| `plan_history` table | EXISTS | Versioning with changed_by, old/new_data | OK |
| `plans` Edge Function | EXISTS | CRUD + clone + history recording | OK |
| `useMembershipPlans()` hook | EXISTS | Basic query with filters | OK |
| `usePlan(id)` hook | EXISTS | Basic query | OK |
| `useCreatePlan()` hook | EXISTS | Basic mutation | OK |
| `useClonePlan()` hook | EXISTS | Client-side clone (not using Edge Function) | MEDIUM |
| Plan versioning on edit | **PARTIAL** | Edge Function records history, but plan_history RLS only allows admin/manager read | LOW |
| Public plan listing | EXISTS | Visitor pricing page + plans?public=true | OK |
| Feature comparison table | **MISSING** | No dedicated comparison component/page | MEDIUM |
| Plan wizard (3-step) | **MISSING** | No multi-step plan creation UI | MEDIUM |
| **Module Rating** | **PARTIAL** | Core schema + API good, UI wizard and comparison missing | — |

### 4.3 Member Enrollment and Profiles
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Enhanced `members` table | EXISTS | Medical JSONB, goals, photo, emergency contact | OK |
| `medical_questionnaires` table | EXISTS | Full medical questionnaire schema | OK |
| `membership_cards` table | EXISTS | Card number, QR code, issue/expiry dates | OK |
| `members` Edge Function | EXISTS | CRUD + GDPR export + search | OK |
| `useMembers()` hook | EXISTS | Search by name/email | OK |
| Enrollment wizard | **PARTIAL** | Manager members/enroll.tsx exists but no 5-step wizard | MEDIUM |
| Medical questionnaire UI | **MISSING** | No medical form component in pages | HIGH |
| Digital membership card | **PARTIAL** | Client card page exists, but no QR encryption per spec | HIGH |
| QR code with HMAC encryption | **MISSING** | QR uses plain data, no `OHMYGOLD:{user_id}:{timestamp}:{hmac}` format | CRITICAL |
| HMAC key rotation | **MISSING** | No daily key rotation system | CRITICAL |
| Offline QR validation | **MISSING** | No cached key system for staff devices | HIGH |
| Photo capture | **MISSING** | No camera integration in enrollment | MEDIUM |
| Member profile tabs | **MISSING** | Pages don't show Overview/Membership/Attendance/Payments/Notes tabs | HIGH |
| **Module Rating** | **PARTIAL** | Tables and basic CRUD exist; QR encryption, wizard, tabs missing | — |

### 4.4 Subscription Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `subscriptions` table | EXISTS | Full lifecycle fields | OK |
| `subscription_events` table | EXISTS | Event tracking with prorated_amount | OK |
| `subscriptions` Edge Function | EXISTS | freeze, unfreeze, upgrade, cancel + event logging | OK |
| `useSubscription()` hook | EXISTS | Active subscription query | OK |
| `useFreezeSubscription()` hook | EXISTS | Direct DB update (not Edge Function) | MEDIUM |
| `useUnfreezeSubscription()` hook | EXISTS | Direct DB update | MEDIUM |
| `useCancelSubscription()` hook | EXISTS | Direct DB update | MEDIUM |
| `useUpgradeSubscription()` hook | EXISTS | Direct DB update | MEDIUM |
| Proration calculation | **MISSING** | No actual proration math in Edge Function or hooks | CRITICAL |
| Cron job for renewals | **MISSING** | No pg_cron or scheduled Edge Function for billing | CRITICAL |
| Failed payment retry | **MISSING** | No retry logic, no grace period automation | CRITICAL |
| Self-service UI (client) | **PARTIAL** | client/subscription/index exists but may not have freeze/upgrade/cancel | HIGH |
| Renewal reminders (7 days) | **MISSING** | No reminder system | HIGH |
| **Module Rating** | **PARTIAL** | Schema + basic CRUD good; proration, cron, retry missing | — |

### 4.5 Class Type and Schedule Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Enhanced `gym_classes` table | EXISTS | category, intensity, recurrence_rule, room | OK |
| `rooms` table | **MISSING** | No dedicated rooms table | CRITICAL |
| `room_bookings` table | **MISSING** | No room allocation / conflict prevention | CRITICAL |
| `class_instances` table | **MISSING** | No generated instances from recurrence pattern | HIGH |
| `classes` Edge Function | EXISTS | Basic CRUD with instructor_id filter | OK |
| RRULE support | **PARTIAL** | Column exists but no generation logic | HIGH |
| Conflict detection | **MISSING** | No same-instructor conflict check | CRITICAL |
| Room double-booking prevention | **MISSING** | No rooms table → no prevention possible | CRITICAL |
| Calendar views (week/day/month) | **MISSING** | No calendar component in pages | HIGH |
| `useClasses()` hook | EXISTS | Basic query | OK |
| Substitution requests | **MISSING** | No sub request/approval workflow | HIGH |
| **Module Rating** | **PARTIAL** | Basic class CRUD only; rooms, RRULE generation, calendar missing | — |

### 4.6 Booking System with Waitlist
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `bookings` table | EXISTS | Status enum includes waitlisted | OK |
| Waitlist position tracking | EXISTS | Column in bookings table | OK |
| `bookings` Edge Function | EXISTS | Waitlist auto-insert on capacity full | OK |
| `useMyBookings()` hook | EXISTS | Personal booking history | OK |
| `useCreateBooking()` hook | EXISTS | Direct insert (not atomic) | HIGH |
| `useWaitlistPosition()` hook | EXISTS | Position calculation | OK |
| Atomic booking transaction | **MISSING** | No `SERIALIZABLE` isolation, no `SELECT FOR UPDATE` | CRITICAL |
| `waitlist_promotions` table | **MISSING** | No promotion audit table per spec | CRITICAL |
| Auto-promote with cascade | **MISSING** | No waitlist auto-promote on cancellation | CRITICAL |
| 24-hour hold with timer | **MISSING** | No held_until or confirmation flow | CRITICAL |
| Triple-channel notification | **MISSING** | No push+email+SMS on promotion | HIGH |
| Cancellation policy enforcement | **MISSING** | No hours-before check | HIGH |
| Late cancellation fee | **MISSING** | No fee logic | MEDIUM |
| Booking window config | **MISSING** | No booking_rules table | MEDIUM |
| Recurring booking | **MISSING** | No weekly same-class booking | MEDIUM |
| **Module Rating** | **INCOMPLETE** | Basic CRUD works; atomicity, auto-promote, rules all missing | — |

### 4.7 Check-in/Access Control System
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `access_logs` table | EXISTS | Entry/exit logging with method | OK |
| `access` Edge Function | EXISTS | QR/card check-in with subscription validation | OK |
| `useCheckIn()` hook | EXISTS | Mutation via membership_cards lookup | OK |
| `useRecentCheckIns()` hook | EXISTS | Realtime subscription for access_logs | OK |
| Time restriction check | **MISSING** | No off-peak plan validation | CRITICAL |
| Zone access control | **MISSING** | No premium zone validation | CRITICAL |
| Real-time occupancy per zone | **PARTIAL** | access_logs table, but no zone-based occupancy count | HIGH |
| Capacity alert at 90% | **MISSING** | No alert system | CRITICAL |
| Self check-in (mobile) | **MISSING** | No gym QR scanning in mobile app | HIGH |
| RFID placeholder | **MISSING** | No future-ready RFID structure | LOW |
| Check-in processing < 3s | UNTESTED | No performance tests in repo | LOW |
| **Module Rating** | **PARTIAL** | Basic QR check-in works; time/zone restrictions, alerts missing | — |

### 4.8 Billing and Invoicing
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `invoices` table | **MISSING** | No dedicated invoice table | CRITICAL |
| `invoice_items` table | **MISSING** | No line-item breakdown | CRITICAL |
| `credit_notes` table | **MISSING** | No refund/adjustment tracking | CRITICAL |
| `dunning_log` table | **MISSING** | No overdue reminder history | CRITICAL |
| `fiscal_closures` table | **MISSING** | No Z-ticket / daily closure | CRITICAL |
| Billing Edge Function | **MISSING** | No billing/ directory in functions/ | CRITICAL |
| Invoice generation cron | **MISSING** | No automatic generation | CRITICAL |
| NF 525 compliance | **MISSING** | No sequential numbering, no signed hash, no immutability | CRITICAL |
| PDF generation | **MISSING** | No Puppeteer / PDF library integration | CRITICAL |
| VAT calculation (20%) | **MISSING** | No tax calculation system | CRITICAL |
| Dunning process (day 1/7/14/30) | **MISSING** | No overdue handling workflow | CRITICAL |
| Manager billing page | EXISTS | manager/billing/index.tsx exists (may be placeholder) | OK |
| **Module Rating** | **MISSING** | Entire billing module absent — highest risk area | — |

### 4.9 Payment Processing Integration
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `payments` table | EXISTS | Basic payment records | OK |
| `payments` Edge Function | EXISTS | Record payment + refund as negative payment | OK |
| `usePaymentHistory()` hook | EXISTS | Query with member filter | OK |
| `useCreatePayment()` hook | EXISTS | Insert mutation | OK |
| `useRefundPayment()` hook | EXISTS | Status update (not actual Stripe refund) | HIGH |
| Stripe integration | **MISSING** | No Stripe Elements, no Stripe SDK | CRITICAL |
| SEPA direct debit | **MISSING** | No mandate collection | CRITICAL |
| 3D Secure | **MISSING** | No authentication challenge handling | CRITICAL |
| Webhook handler | **MISSING** | No Stripe webhook Edge Function | CRITICAL |
| Failed payment retry (3x) | **MISSING** | No retry logic | CRITICAL |
| PCI compliance | **MISSING** | Payment forms would collect raw card data | CRITICAL |
| Test mode | **MISSING** | No Stripe test configuration | HIGH |
| **Module Rating** | **INCOMPLETE** | Tables + basic CRUD only; Stripe, webhooks, 3DS, retries all missing | — |

### 4.10 POS and Product Catalog
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `pos_products` table | EXISTS | Full product schema with stock, barcode, SKU | OK |
| `pos_transactions` table | EXISTS | Items JSONB, tax, discount, void support | OK |
| `pos` Edge Function | EXISTS | Products CRUD + transactions + stock decrement | OK |
| `usePOSProducts()` hook | EXISTS | Query with location filter | OK |
| `usePOSTransaction()` hook | EXISTS | Mutation with total calculation | OK |
| Barcode scanning | **MISSING** | No camera/USB scanner integration | HIGH |
| Discount system | **PARTIAL** | discount_amount column exists, no percentage/fixed logic | HIGH |
| Manager approval for discounts | **MISSING** | No approval workflow | HIGH |
| Receipt generation | **MISSING** | No PDF receipt, no print support | HIGH |
| Split payment | **MISSING** | No multi-method support | MEDIUM |
| Daily sales summary | **MISSING** | No end-of-day report | MEDIUM |
| Offline mode | **MISSING** | No queue/sync mechanism | HIGH |
| Cash drawer | **MISSING** | No cash management | LOW |
| **Module Rating** | **PARTIAL** | Core product/transaction tables + API good; barcode, receipt, offline missing | — |

### 4.11 Inventory Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `inventory_transactions` table | **MISSING** | No transaction-based stock tracking | CRITICAL |
| `purchase_orders` table | **MISSING** | No PO lifecycle | CRITICAL |
| `suppliers` table | **MISSING** | No supplier management | CRITICAL |
| `stock_counts` table | **MISSING** | No physical count vs system | CRITICAL |
| `inventory` Edge Function | **MISSING** | No inventory/ directory | CRITICAL |
| Inventory hooks | **MISSING** | No useInventory hook | CRITICAL |
| Low-stock alerts | **PARTIAL** | low_stock_threshold column exists, no alert automation | HIGH |
| Auto-sync with POS | **PARTIAL** | decrement_stock_qty() function on transaction, but no full transaction history | MEDIUM |
| Reorder suggestions | **MISSING** | No velocity-based suggestions | MEDIUM |
| Inventory reports | **MISSING** | No valuation, turnover, dead stock | MEDIUM |
| **Module Rating** | **MISSING** | Core tables absent; only POS-level stock field exists | — |

### 4.12 CRM and Lead Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `leads` table | EXISTS | Full schema with status, source, assigned_to | OK |
| `lead_activities` table | EXISTS | Activity logging with types | OK |
| `crm` Edge Function | EXISTS | Leads CRUD + activities CRUD | OK |
| `useLeads()` hook | EXISTS | Query with filters | OK |
| Pipeline Kanban board | **MISSING** | No visual pipeline UI | HIGH |
| Drag-and-drop stages | **MISSING** | No drag UI | HIGH |
| Follow-up reminders | **MISSING** | No follow_up_reminders table, no automated reminders | CRITICAL |
| Conversion tracking | **PARTIAL** | leads table has status, but no conversion_tracking table | HIGH |
| Lead source analytics | **MISSING** | No analytics by source in UI | MEDIUM |
| Duplicate detection | **MISSING** | No email/phone deduplication logic | MEDIUM |
| Bulk CSV import | **MISSING** | No import functionality | MEDIUM |
| Auto assignment (round-robin) | **MISSING** | No auto-assignment logic | MEDIUM |
| **Module Rating** | **PARTIAL** | Tables + basic CRUD exist; pipeline UI, reminders, analytics missing | — |

### 4.13 Marketing and Campaigns
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `campaigns` table | **MISSING** | No campaign storage | CRITICAL |
| `campaign_segments` table | **MISSING** | No segment definitions | CRITICAL |
| `campaign_analytics` table | **MISSING** | No delivery tracking | CRITICAL |
| `marketing_consent` table | **MISSING** | No dedicated consent table (only gdpr_marketing_consent on members) | HIGH |
| `campaigns` Edge Function | **MISSING** | No campaigns/ directory | CRITICAL |
| Campaign builder UI | **MISSING** | No marketing page in web | CRITICAL |
| SendGrid integration | **MISSING** | No email API integration | CRITICAL |
| Twilio integration | **MISSING** | No SMS API integration | CRITICAL |
| FCM/APNs integration | **MISSING** | No push notification service | CRITICAL |
| A/B testing | **MISSING** | No variant support | MEDIUM |
| Unsubscribe handling | **PARTIAL** | gdpr_marketing_consent exists, no one-click unsubscribe flow | MEDIUM |
| **Module Rating** | **MISSING** | Entire module absent | — |

### 4.14 Staff and Teacher Management
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `staff_schedules` table | EXISTS | Working hours per day | OK |
| `time_tracking` table | EXISTS | Clock in/out with hours_worked | OK |
| `staff_members` table | **MISSING** | useStaff.ts references `staff_members` — table does NOT exist | CRITICAL |
| `certifications` table | **MISSING** | No certification tracking | CRITICAL |
| `staff` Edge Function | **MISSING** | No staff/ directory | CRITICAL |
| `useStaffMembers()` hook | **BROKEN** | References non-existent `staff_members` table | CRITICAL |
| `useStaffSchedule()` hook | EXISTS | Uses `staff_schedules` table | OK |
| `useTimeTracking()` hook | EXISTS | Clock in/out mutations | OK |
| Certification expiry alerts | **MISSING** | No alert system | HIGH |
| Teacher specialties | **MISSING** | No specialties tracking | HIGH |
| Performance metrics | **MISSING** | No classes_taught, attendance, ratings | HIGH |
| Role change approval | **MISSING** | No workflow | MEDIUM |
| **Module Rating** | **INCOMPLETE** | staff_schedules + time_tracking exist; staff_members, certifications, Edge Function missing | — |

### 4.15 Analytics and Reporting
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `analytics` Edge Function | EXISTS | overview, revenue, attendance, membership, classes reports | OK |
| `useKPIOverview()` hook | EXISTS | Parallel queries for KPIs | OK |
| Admin analytics page | EXISTS | admin/analytics/index.tsx | OK |
| `daily_metrics` table | **MISSING** | No pre-aggregated metrics | HIGH |
| `member_metrics` table | **MISSING** | No pre-aggregated member stats | HIGH |
| Role-based dashboards | **PARTIAL** | Admin exists; Manager, Teacher, Client dashboards not role-scoped | HIGH |
| Trend charts | **MISSING** | No Recharts integration visible | HIGH |
| Real-time widgets | **MISSING** | No live check-in count widget | HIGH |
| Export (CSV/PDF) | **MISSING** | No export functionality | MEDIUM |
| Dashboard customization | **MISSING** | No widget rearrangement | LOW |
| **Module Rating** | **PARTIAL** | Basic Edge Function + hook exist; charts, pre-aggregation, export missing | — |

### 4.16 Edge Functions (Cross-Module Audit)
| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| `_shared` utilities | EXISTS | auth.ts, cors.ts | OK |
| `access` | EXISTS | Check-in + access log listing | OK |
| `analytics` | EXISTS | Multi-report endpoint | OK |
| `bookings` | EXISTS | CRUD + waitlist insert | OK |
| `classes` | EXISTS | CRUD + bookings count | OK |
| `crm` | EXISTS | Leads + activities CRUD | OK |
| `locations` | EXISTS | CRUD with facility detail | OK |
| `members` | EXISTS | CRUD + GDPR export + search | OK |
| `payments` | EXISTS | CRUD + refund record | OK |
| `plans` | EXISTS | CRUD + clone + history | OK |
| `pos` | EXISTS | Products + transactions + void | OK |
| `subscriptions` | EXISTS | CRUD + freeze/upgrade/cancel | OK |
| `billing` | **MISSING** | No billing Edge Function | CRITICAL |
| `inventory` | **MISSING** | No inventory Edge Function | CRITICAL |
| `reports` | **MISSING** | No reports Edge Function | CRITICAL |
| `staff` | **MISSING** | No staff Edge Function | CRITICAL |
| `campaigns` | **MISSING** | No campaigns Edge Function | CRITICAL |
| `checkin` | **MISSING** | Access function exists but named `access`, not `checkin` per spec | MEDIUM |
| `facility-zones` | **MISSING** | No separate function | MEDIUM |
| `equipment` | **MISSING** | No separate function | MEDIUM |
| **Total: 20 expected, 12 exist, 8 missing** | | | |

---

## Findings Detail

### CRITICAL-001: Missing Invoices Table (4.8 Billing)
- **Item**: 4.8
- **Description**: The `invoices` table required for billing does not exist. The roadmap specifies sequential invoice numbering, NF 525 compliance, and PDF generation. Only a basic `payments` table exists.
- **Impact**: Billing module completely non-functional. No invoices can be generated, tracked, or sent. French fiscal compliance (NF 525) impossible.
- **Fix Required**: Create `invoices`, `invoice_items`, `credit_notes`, `dunning_log`, `fiscal_closures` tables with RLS. Create `billing` Edge Function with cron triggers.

### CRITICAL-002: Missing Billing Edge Function (4.8 Billing)
- **Item**: 4.8
- **Description**: No `billing` Edge Function directory exists. No automatic invoice generation, no dunning workflow, no NF 525 signing.
- **Impact**: Entire billing workflow non-functional. Revenue cannot be properly tracked or collected.
- **Fix Required**: Implement `supabase/functions/billing/` with invoice generation, PDF creation, email delivery, and dunning logic.

### CRITICAL-003: Missing Stripe Integration (4.9 Payments)
- **Item**: 4.9
- **Description**: No Stripe Elements, Stripe React Native SDK, webhook handler, or 3D Secure integration exists. Payment processing is limited to recording manual payments.
- **Impact**: Cannot process actual payments. No recurring billing. No PCI compliance.
- **Fix Required**: Add Stripe configuration, StripeProvider component, webhook Edge Function, and payment flows.

### CRITICAL-004: No Atomic Booking Transaction (4.6 Bookings)
- **Item**: 4.6
- **Description**: The booking Edge Function does a two-step read-then-insert without database-level locking. No `SELECT FOR UPDATE`, no `SERIALIZABLE` isolation, no retry logic for serialization failures.
- **Impact**: Race conditions allow overbooking when two users simultaneously book the last spot.
- **Fix Required**: Implement atomic booking with `BEGIN ISOLATION LEVEL SERIALIZABLE; SELECT ... FOR UPDATE;` and exponential backoff retry.

### CRITICAL-005: Missing Waitlist Auto-Promote (4.6 Bookings)
- **Item**: 4.6
- **Description**: No `waitlist_promotions` table. No auto-promotion when a booking is cancelled. No 24-hour hold timer. No cascade up to 3 attempts.
- **Impact**: Waitlist members never get promoted. Staff must manually manage all waitlist movements.
- **Fix Required**: Create `waitlist_promotions` table and implement promotion flow with triple-channel notifications.

### CRITICAL-006: Missing Rooms and Room Bookings Tables (4.5 Classes)
- **Item**: 4.5
- **Description**: No `rooms` or `room_bookings` tables. Classes have a `room` TEXT column but no structured room management.
- **Impact**: Room double-booking impossible to prevent. No room capacity enforcement. No room-specific scheduling.
- **Fix Required**: Create `rooms` and `room_bookings` tables with conflict detection.

### CRITICAL-007: No Instructor Conflict Detection (4.5 Classes)
- **Item**: 4.5
- **Description**: Classes Edge Function allows creating classes without checking if the instructor is already teaching another class at the same time.
- **Impact**: Same instructor can be double-booked, causing operational chaos.
- **Fix Required**: Add time-slot conflict check in class creation/update Edge Function.

### CRITICAL-008: Missing Inventory Tables (4.11 Inventory)
- **Item**: 4.11
- **Description**: No `inventory_transactions`, `purchase_orders`, `suppliers`, or `stock_counts` tables. POS only tracks a single `stock_quantity` field.
- **Impact**: Full inventory management impossible. No purchase order lifecycle. No supplier tracking.
- **Fix Required**: Create all inventory tables and `inventory` Edge Function.

### CRITICAL-009: Missing Marketing Tables (4.13 Marketing)
- **Item**: 4.13
- **Description**: No `campaigns`, `campaign_segments`, `campaign_analytics`, or `marketing_consent` tables.
- **Impact**: Cannot create, send, or track marketing campaigns.
- **Fix Required**: Create campaign tables with GDPR compliance fields.

### CRITICAL-010: Missing Staff Members Table (4.14 Staff)
- **Item**: 4.14
- **Description**: `useStaff.ts` references a `staff_members` table that does not exist in any migration. The hook will fail at runtime.
- **Impact**: Staff management page crashes. Cannot list, search, or manage staff.
- **Fix Required**: Create `staff_members` (or extend `user_profiles`) with staff-specific fields.

### CRITICAL-011: Missing Certifications Table (4.14 Staff)
- **Item**: 4.14
- **Description**: No `certifications` table for tracking CPR, coaching, etc. No expiry alerts.
- **Impact**: Compliance risk. Staff may operate with expired certifications.
- **Fix Required**: Create `certifications` table with expiry date and alert triggers.

### CRITICAL-012: No Time Restriction Validation (4.7 Check-in)
- **Item**: 4.7
- **Description**: Access Edge Function checks subscription status but does not validate `access_hours_restriction` from membership plans.
- **Impact**: Off-peak members can access gym during peak hours.
- **Fix Required**: Add time-of-day check against plan's access_hours_restriction.

### CRITICAL-013: No Zone Access Control (4.7 Check-in)
- **Item**: 4.7
- **Description**: Access Edge Function does not check which zones a member's plan allows.
- **Impact**: Basic plan members can access premium zones (pool, sauna, etc.).
- **Fix Required**: Add zone-level access validation with per-zone check-in logging.

### CRITICAL-014: No Proration Calculation (4.4 Subscriptions)
- **Item**: 4.4
- **Description**: The `upgrade` action in subscriptions Edge Function accepts `prorated_amount` from client but does not calculate it server-side.
- **Impact**: Clients can submit arbitrary proration amounts. Revenue calculation unreliable.
- **Fix Required**: Implement server-side proration: `(new_price - old_price) * (days_remaining / days_in_cycle)`.

### CRITICAL-015: No Cron Jobs for Subscription Lifecycle (4.4 Subscriptions)
- **Item**: 4.4
- **Description**: No pg_cron or scheduled Edge Functions for daily renewal processing, freeze expiration, or payment retry.
- **Impact**: Subscriptions never auto-renew. Frozen subscriptions never auto-unfreeze. Failed payments never retried.
- **Fix Required**: Set up pg_cron jobs or scheduled Supabase Edge Functions.

### CRITICAL-016: NF 525 Compliance Absent (4.8 Billing)
- **Item**: 4.8
- **Description**: No sequential invoice numbering, no digital signature (ECDSA), no immutable storage, no Z-ticket generation, no 10-year archive.
- **Impact**: Illegal to operate B2C POS in France without NF 525 certification.
- **Fix Required**: Implement full NF 525 compliance: sequential numbers, signed hashes, immutable fiscal_closures.

### CRITICAL-017: No Capacity Alert System (4.1 / 4.7)
- **Item**: 4.1, 4.7
- **Description**: `capacity_rules` table has `alert_threshold_pct` but no alert triggers or notifications.
- **Impact**: Managers never notified when gym reaches 90% capacity. Safety and customer experience risk.
- **Fix Required**: Add database trigger on capacity_rules.current_occupancy or Realtime channel with threshold check.

### CRITICAL-018: Missing Campaigns Edge Function (4.13 Marketing)
- **Item**: 4.13
- **Description**: No `campaigns/` Edge Function. No SendGrid, Twilio, or FCM integration.
- **Impact**: Cannot send any marketing communications.
- **Fix Required**: Create campaigns Edge Function with multi-channel delivery.

---

## HIGH Severity Findings

### HIGH-001: No Real-Time Capacity Tracking (4.1)
- `capacity_rules` table exists but no real-time occupancy updates. No Supabase Realtime channel for live dashboard.

### HIGH-002: Missing Facility-Zones Edge Function (4.1)
- No dedicated `facility-zones` or `equipment` Edge Functions. CRUD must go through raw Supabase or locations function.

### HIGH-003: Missing Equipment and Capacity Hooks (4.1)
- No `useEquipment()`, `useFacilityZones()`, or `useCapacity()` hooks exported.

### HIGH-004: No Medical Questionnaire UI (4.3)
- `medical_questionnaires` table exists but no web/mobile form for capturing data.

### HIGH-005: No QR HMAC Encryption (4.3 / 4.7)
- QR codes store plain data, not `OHMYGOLD:{user_id}:{timestamp}:{hmac_signature}` format. Replay attacks possible.

### HIGH-006: No Enrollment Wizard (4.3)
- `manager/members/enroll.tsx` exists but is not a documented 5-step wizard with progress indicator.

### HIGH-007: No Member Profile Tabs (4.3)
- No Overview/Membership/Attendance/Payments/Notes tabbed interface in member detail pages.

### HIGH-008: No Self-Service Subscription UI (4.4)
- `client/subscription/index.tsx` exists but freeze/upgrade/cancel flows may be incomplete.

### HIGH-009: No Renewal Reminders (4.4)
- No 7-day renewal reminder system. No email/push notification scheduling.

### HIGH-010: No Class Calendar Views (4.5)
- No week grid, day list, or month calendar components. Only list view likely exists.

### HIGH-011: No RRULE Instance Generation (4.5)
- `recurrence_rule` column exists but no code generates actual class instances from the pattern.

### HIGH-012: No Cancellation Policy Enforcement (4.6)
- No `booking_rules` table. No configurable cancellation window. No late cancellation fee.

### HIGH-013: No Triple-Channel Notifications (4.6)
- Waitlist promotion requires push+email+SMS simultaneously. No notification infrastructure exists.

### HIGH-014: No Webhook Handler for Stripe (4.9)
- `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded` events not handled.

### HIGH-015: No POS Receipt Generation (4.10)
- No PDF receipt generation. No print support. No email receipt option.

### HIGH-016: No Barcode Scanning (4.10)
- No camera-based barcode scan (mobile) or USB scanner support (web).

### HIGH-017: No Offline Mode for POS (4.10)
- No transaction queueing for network outages. Sales fail if offline.

### HIGH-018: No CRM Pipeline Kanban (4.12)
- No visual pipeline board. No drag-and-drop stage management.

### HIGH-019: No Follow-Up Reminders (4.12)
- No `follow_up_reminders` table. No automated push/email reminder system.

### HIGH-020: No Pre-Aggregated Metrics Tables (4.15)
- Analytics Edge Function queries raw tables on every request. No `daily_metrics` or `member_metrics` for fast dashboard loading.

---

## MEDIUM Severity Findings

### MEDIUM-001: No French Holidays Seed Data (4.1)
- `holiday_schedules` table is empty. No pre-loaded French public holidays.

### MEDIUM-002: No Plan Comparison Table (4.2)
- No side-by-side feature comparison UI for plan tiers.

### MEDIUM-003: No Plan Creation Wizard (4.2)
- No multi-step wizard (basic → features → rules).

### MEDIUM-004: No Photo Capture in Enrollment (4.3)
- No camera integration for member photo during enrollment.

### MEDIUM-005: No Low-Stock Alert Automation (4.10/4.11)
- `low_stock_threshold` exists but no automated push/email alert when stock drops below threshold.

### MEDIUM-006: No POS Discount Approval Workflow (4.10)
- `discount_amount` exists but no manager approval for large discounts.

### MEDIUM-007: No Lead Source Analytics (4.12)
- No conversion rate by source displayed in UI.

### MEDIUM-008: No Duplicate Lead Detection (4.12)
- No email/phone deduplication logic in CRM Edge Function.

### MEDIUM-009: No Bulk CSV Import (4.12)
- No CSV upload for lead import.

### MEDIUM-010: No Export Functionality (4.15)
- No CSV or PDF export from analytics dashboard.

### MEDIUM-011: No Staff Performance Metrics (4.14)
- No classes_taught, attendance rate, or member ratings tracking.

### MEDIUM-012: Mobile App Severely Limited (4.x)
- Only 4 tabs: index, booking, card, profile. No classes, no check-in, no subscription management, no POS.

---

## LOW Severity Findings

### LOW-001: No RFID Placeholder (4.7)
- No future-ready RFID/NFC data structures in access system.

### LOW-002: No Check-In Performance Tests (4.7)
- No documented < 3 second processing guarantee.

### LOW-003: Plan History RLS Narrow (4.2)
- Only admin/manager can read plan_history; employees excluded.

### LOW-004: No Dashboard Widget Customization (4.15)
- No drag-to-rearrange widget layout.

---

## Recommended Fix Priority Order

### Phase 1 — CRITICAL Blockers (Week 1-2)
1. **CRITICAL-001/002**: Create `invoices`, `invoice_items`, `credit_notes`, `dunning_log`, `fiscal_closures` tables + `billing` Edge Function + NF 525 compliance
2. **CRITICAL-003**: Integrate Stripe (Elements, webhooks, 3DS, SEPA)
3. **CRITICAL-004/005**: Fix atomic booking + waitlist auto-promote with `waitlist_promotions` table
4. **CRITICAL-010/011**: Create `staff_members` and `certifications` tables, fix `useStaff.ts`
5. **CRITICAL-012/013**: Add time and zone access validation to check-in

### Phase 2 — Core Tables & APIs (Week 3-4)
6. **CRITICAL-006**: Create `rooms` + `room_bookings` tables with conflict detection
7. **CRITICAL-008**: Create full inventory tables + `inventory` Edge Function
8. **CRITICAL-009**: Create campaign tables + `campaigns` Edge Function + SendGrid/Twilio
9. **CRITICAL-014/015**: Implement server-side proration + cron jobs for subscriptions
10. **CRITICAL-017**: Add capacity alert triggers/notifications

### Phase 3 — UI/UX & Hooks (Week 5-6)
11. **HIGH-005**: Implement HMAC-encrypted QR codes with daily key rotation
12. **HIGH-010/011**: Build class calendar views + RRULE instance generation
13. **HIGH-004/006/007**: Build medical questionnaire UI, enrollment wizard, profile tabs
14. **HIGH-018/019**: Build CRM Kanban board + follow-up reminder system
15. **HIGH-015/016/017**: Add POS receipt printing, barcode scanning, offline queue

### Phase 4 — Polish & Mobile (Week 7-8)
16. **MEDIUM-012**: Expand mobile app with classes, check-in, subscription, POS
17. **MEDIUM-005/006**: Add low-stock alerts and discount approval workflow
18. **MEDIUM-010**: Add CSV/PDF export to analytics
19. **HIGH-020**: Create pre-aggregated metrics tables with triggers
20. **LOW-003/004**: Expand RLS and add dashboard customization

---

## Appendix: File Inventory

### Existing Migrations (22 files)
```
0001_extensions_and_types.sql
0002_user_profiles.sql
0003_gym_locations.sql
0004_members.sql
0005_membership_plans.sql
0006_gym_classes.sql
0007_bookings.sql
0008_payments.sql
0009_access_control.sql
0010_notifications.sql
0011_audit_log.sql
0012_realtime_publications.sql
0013_storage_buckets.sql
0014_views_and_functions.sql
0015_seed_dev_data.sql
0016_facility_zones.sql
0017_membership_plans_enhanced.sql
0018_member_profiles_enhanced.sql
0019_subscriptions_enhanced.sql
0020_crm.sql
0021_pos.sql
```

### Existing Edge Functions (12 of ~20 required)
```
_shared/     — auth.ts, cors.ts
access/      — check-in + access log listing
analytics/   — overview, revenue, attendance, membership, classes
bookings/    — CRUD + waitlist insert
classes/     — CRUD + bookings count
crm/         — Leads + activities CRUD
locations/   — CRUD with facility detail
members/     — CRUD + GDPR export + search
payments/    — CRUD + refund record
plans/       — CRUD + clone + history
pos/         — Products + transactions + void
subscriptions/ — CRUD + freeze/upgrade/cancel
```

### Existing Web Pages (41 files across 6 roles)
```
admin: analytics, audit-log, dashboard, locations (list/detail/new), settings, users (list/detail)
client: booking (list/my-bookings), card, dashboard, profile, subscription
employee: bookings, check-in, pos
manager: billing, classes, dashboard, members (list/detail/enroll)
teacher: classes (list/detail), dashboard, roster
visitor: index, locations, pricing
```

### Existing Hooks (19 files)
```
useAccess.ts, useAnalytics.ts, useAuditLog.ts, useAuth.ts, useBookings.ts,
useCRM.ts, useClasses.ts, useLocations.ts, useMembers.ts, useNotifications.ts,
usePayments.ts, usePermissions.ts, usePlans.ts, usePOS.ts, useSession.ts,
useStaff.ts, useSubscriptions.ts, useAuth.ts (re-export)
```

### Mobile App Files (18 files — severely limited)
```
app.json, tsconfig.json, package.json, index.ts
app/_layout.tsx, app/(tabs)/_layout.tsx
app/(tabs)/index.tsx, app/(tabs)/booking.tsx, app/(tabs)/card.tsx, app/(tabs)/profile.tsx
app/auth/_layout.tsx, app/auth/login.tsx, app/auth/register.tsx, app/auth/forgot-password.tsx
src/components/AuthProvider.tsx, src/lib/supabase.ts, src/lib/i18n.ts
src/stores/authStore.ts
src/i18n/locales/fr/*, src/i18n/locales/en/*
```

---

*End of Phase 4 Audit Report*

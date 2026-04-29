# Phase 4: Core Gym Management (Resamania Clone + Improvements)

> **Phase ID:** P4
> **Duration:** 6-8 weeks
> **Prerequisites:** Phases 1-3 complete (foundation, design system, auth + RBAC)
> **Goal:** Implement all Resamania features plus targeted improvements — the operational backbone of OhMyGold

---

## Phase Overview

Phase 4 is the heart of OhMyGold. Every feature in this phase maps directly to a Resamania capability that Gold's Gym France currently uses or needs. Each module is a vertical slice: database schema, API endpoints, web screens, and mobile screens. This is the most code-intensive phase of the project.

The 16 modules cover: locations, memberships, members, subscriptions, classes, bookings, access control, billing, payments, POS, inventory, CRM, marketing, staff management, analytics, and reporting. Each module includes database migrations, Edge Functions, API hooks, and screen implementations.

**Critical rule:** Every table must have RLS policies (Phase 3.4). Every API call must respect role-based access. Every screen must check permissions before rendering actions.

---

## 4.1 Location and Facility Management

### Description and Scope
Create the multi-location management system for Gold's Gym France. Each gym is a "location" with its own settings, operating hours, zones, equipment, capacity rules, and staff. Admin can create/manage all locations; Managers see only their assigned location.

### Why This Matters
Gold's Gym France operates multiple locations. The platform must support multi-tenancy at the location level — each location has independent schedules, staff, memberships, and reporting. This is the foundation for all other modules.

### Technical Approach
Locations table already created in Phase 1.7. Add facility zones, equipment inventory, capacity rules, and holiday schedules. Edge Functions for CRUD operations. Web screens for Admin (all locations) and Manager (own location). Mobile screens: location info viewer.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000020_facility_zones.sql
├── 00000000000021_equipment.sql
└── 00000000000022_capacity_rules.sql
supabase/functions/
├── locations/
│   └── index.ts
├── facility-zones/
│   └── index.ts
└── equipment/
    └── index.ts
apps/web/src/pages/
├── admin/locations/
│   ├── index.tsx
│   ├── [id].tsx
│   └── new.tsx
apps/mobile/src/app/
└── (app)/locations/
    └── index.tsx
```

### Dependencies on Other Items
- 1.7 (database schema)
- 3.4 (RLS policies)

### Success Criteria
```
[ ] Create new gym location with full details
[ ] Edit location: name, address, contact, timezone, settings
[ ] Define facility zones (cardio, weights, pool, studio, etc.)
[ ] Manage equipment inventory per zone
[ ] Set per-zone capacity limits
[ ] Configure operating hours (day-by-day with open/close)
[ ] Set holiday/special schedules
[ ] Location-specific settings: cancellation rules, booking windows, check-in rules
[ ] Real-time capacity display
[ ] Multi-location switching (Admin only)
[ ] Location-scoped data: all other modules filter by location
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement location and facility management for OhMyGold.

CONTEXT: Gold's Gym France operates multiple gym locations. Each location has its own configuration. Admin manages all; Manager manages assigned location.

TASK:
1. Database migrations:
   - facility_zones: id, location_id, name, type, capacity, description
   - equipment: id, zone_id, name, type, brand, model, status, last_maintenance, notes
   - capacity_rules: id, location_id, zone_id, max_capacity, current_occupancy, alert_threshold
   - operating_hours: id, location_id, day_of_week, open_time, close_time, is_closed
   - holiday_schedules: id, location_id, date, name, is_closed, open_time, close_time

2. Edge Functions:
   - locations/index.ts: CRUD for locations
   - facility-zones/index.ts: CRUD for zones
   - equipment/index.ts: CRUD for equipment, maintenance logging
   - capacity/index.ts: Real-time occupancy tracking

3. Web screens:
   - Admin: locations list (all), location detail, create/edit
   - Manager: own location dashboard, zone management, equipment list
   - Location settings form with operating hours grid

4. API hooks (TanStack Query):
   - useLocations(), useLocation(id), useCreateLocation(), useUpdateLocation()
   - useFacilityZones(), useEquipment(), useCapacity()

REQUIREMENTS:
- RLS: Admin sees all, Manager sees own location
- Real-time capacity via Supabase Realtime
- French holidays pre-loaded
- Equipment status: operational, maintenance, out_of_order
- Capacity alert at 90% threshold

REFERENCE FILES:
- Permission Matrix §B: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Feature List §1: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Migrations created: ___
- Real-time capacity tested: Yes/No
```

---

## 4.2 Membership Plan Management

### Description and Scope
Create the membership plan configuration system. Plans define pricing, billing intervals (monthly, quarterly, annual), included features (classes, pool, personal training), access hours, and location availability. Admin creates global templates; Managers customize for their location.

### Why This Matters
Membership plans are the revenue foundation. Every subscription, every enrollment, every billing cycle flows from plan definitions. Plans must be flexible enough for Gold's Gym's tiered offering (Basic, Premium, Elite) with location-specific pricing.

### Technical Approach
Membership plans table with JSONB features, pricing tiers, and location associations. Plan templates for cloning. Plan history for audit. Edge Functions for CRUD with pricing validation. Web screens for plan creation wizard.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000023_membership_plans_enhanced.sql
└── 00000000000024_plan_features.sql
supabase/functions/plans/
apps/web/src/pages/
└── [role]/membership-plans/
```

### Success Criteria
```
[ ] Create membership plan with name, description, pricing
[ ] Billing intervals: monthly, quarterly, annual
[ ] Define included features (class access, pool, PT sessions)
[ ] Access hours restriction (e.g., off-peak only)
[ ] Location availability (which gyms accept this plan)
[ ] Plan tiers: Basic, Premium, Elite with feature comparison
[ ] Freeze rules: duration, fee
[ ] Cancellation rules: notice period, early termination fee
[ ] Clone plan template for new location
[ ] Plan history/audit trail
[ ] Public plan listing for visitors (marketing)
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement membership plan management for OhMyGold.

CONTEXT: Gold's Gym France offers tiered membership plans (Basic, Premium, Elite). Plans need flexible configuration with location-specific pricing.

TASK:
1. Enhanced membership_plans table:
   - Add: billing_interval, features (JSONB: {classes: true, pool: true, pt_sessions: 2})
   - Add: access_hours_restriction, freeze_duration_max, freeze_fee
   - Add: cancellation_notice_days, early_termination_fee
   - Add: is_public (visible to visitors)
   - Add: trial_duration_days

2. Plan features table:
   - Feature catalog: name, description, icon, category
   - Plan-features junction: which features included in which plan

3. Edge Functions:
   - CRUD for plans
   - Clone plan (template duplication)
   - Validate pricing (positive, non-zero)

4. Web screens:
   - Plan list with feature comparison table
   - Plan creation wizard (3 steps: basic → features → rules)
   - Plan edit (creates new version, keeps history)
   - Public plan showcase page for visitors

5. API hooks:
   - useMembershipPlans(), usePlan(id), useCreatePlan(), useClonePlan()

REQUIREMENTS:
- Feature comparison table: checkmarks per plan tier
- Plan versioning: edit creates new version, keeps history
- Public plans visible without login
- French pricing format: 49,99 €/mois

REFERENCE: Feature List §3: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Plan tiers configured: ___
- Feature catalog size: ___
```

---

## 4.3 Member Enrollment and Profiles

### Description and Scope
Build the member enrollment system: create member accounts (on-site by staff or self-service online), capture personal info, medical questionnaire, membership assignment, payment method collection, and digital membership card generation. Member profiles are comprehensive — personal, medical, membership, attendance, and progress history.

### Why This Matters
Member enrollment is the first operational touchpoint. A smooth enrollment process converts prospects into members. The member profile is the central record — every booking, payment, check-in, and class attendance links back to this profile. It must be complete, accurate, and GDPR-compliant.

### Technical Approach
Multi-step enrollment wizard: personal info → medical questionnaire → plan selection → payment setup → confirmation. Member profile extends user_profiles with medical data, emergency contacts, goals. Digital membership card: QR code with member ID, generated on enrollment. Photo capture for ID verification.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000025_member_profiles.sql
├── 00000000000026_medical_questionnaire.sql
└── 00000000000027_membership_cards.sql
supabase/functions/members/
apps/web/src/pages/[role]/members/
apps/mobile/src/app/(app)/members/
```

### Success Criteria
```
[ ] Create member account (staff on-site or self-service)
[ ] Multi-step enrollment wizard with progress indicator
[ ] Personal info: name, email, phone, DOB, address, photo
[ ] Medical questionnaire: conditions, medications, emergency contact
[ ] Plan selection with pricing display
[ ] Payment method collection (Stripe tokenization)
[ ] Digital membership card with QR code generated
[ ] Member profile: personal, membership, attendance, progress tabs
[ ] Member search: by name, email, phone, card number
[ ] Member status: active, frozen, expired, cancelled
[ ] GDPR data export for any member
[ ] Photo ID capture (camera on mobile, upload on web)
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement member enrollment and profiles for OhMyGold.

CONTEXT: Member enrollment is the core member lifecycle start. Profiles contain personal, medical, and membership data. Must be GDPR-compliant.

TASK:
1. Member profiles table:
   - medical_conditions (JSONB), medications, allergies
   - emergency_contact_name, emergency_contact_phone
   - goals, notes (staff-only)
   - referral_source, enrollment_date
   - profile_photo_url, id_document_url

2. Medical questionnaire:
   - Standard gym medical questions (heart condition, diabetes, pregnancy, etc.)
   - Stored securely with extra access controls
   - Require acknowledgment before first workout

3. Membership cards:
   - card_number (unique, auto-generated)
   - qr_code_data (encrypted member ID)
   - issue_date, expiry_date
   - is_active, deactivation_reason

4. Enrollment wizard (web + mobile):
   - Step 1: Personal info (with photo capture)
   - Step 2: Medical questionnaire
   - Step 3: Plan selection
   - Step 4: Payment setup
   - Step 5: Review and confirm
   - Digital membership card displayed on completion

5. Member profile screen:
   - Tabs: Overview, Membership, Attendance, Payments, Notes
   - Staff actions: edit, freeze, cancel, send message
   - QR code display for self check-in

REQUIREMENTS:
- Medical data: extra RLS protection (staff-only access)
- GDPR: member can export own data
- Photo capture: mobile camera, web file upload
- QR code: contains encrypted member ID
- Card generation: unique number, barcode + QR

REFERENCE:
- Feature List §4: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Permission Matrix §A.5: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md

NOTES AREA (fill on completion):
- Date completed: ___
- Enrollment wizard steps: ___
- QR code encryption: ___
- Medical data protection: ___
```

---

## 4.4 Subscription Management (Freeze, Upgrade, Cancel)

### Description and Scope
Build the subscription lifecycle management: enrollment in a plan, automatic billing, freeze/pause with configurable duration, upgrade/downgrade with proration, cancellation with notice period, and re-subscription. Self-service for clients; staff-assisted for complex changes.

### Why This Matters
Subscription management is the revenue engine. Every month, subscriptions generate revenue — but only if the system handles billing correctly. Freeze, upgrade, and cancellation are common member requests that currently require staff time. Self-service reduces support load and improves member satisfaction.

### Technical Approach
Subscriptions table linked to members and plans. Billing cycle managed via Edge Function triggered by cron. Freeze: update subscription status, schedule reactivation. Upgrade: calculate proration, charge/refund difference. Cancellation: set end date, handle notice period. Web + mobile self-service UI for clients.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000028_subscription_events.sql
└── 00000000000029_subscription_cron.sql
supabase/functions/subscriptions/
apps/web/src/pages/client/subscription/
apps/mobile/src/app/(app)/subscription/
```

### Success Criteria
```
[ ] Subscribe to plan: immediate activation, first payment
[ ] Automatic recurring billing on billing date
[ ] Freeze subscription: set duration, freeze fee applied
[ ] Unfreeze: reactivate before or on scheduled date
[ ] Upgrade: prorated charge for remainder of cycle
[ ] Downgrade: prorated credit applied
[ ] Cancel: notice period enforced, access until end date
[ ] Re-subscribe after cancellation: new subscription
[ ] Billing history: all invoices, payments, changes
[ ] Self-service: client can freeze, upgrade, cancel
[ ] Staff override: manager can force freeze/cancel
[ ] Renewal reminders: 7 days before billing
[ ] Failed payment handling: retry, grace period, suspension
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement subscription management for OhMyGold.

CONTEXT: Subscription lifecycle is core to revenue. Members need self-service for common changes. Billing must be accurate with proration.

TASK:
1. Subscription events table:
   - subscription_id, event_type (freeze, unfreeze, upgrade, downgrade, cancel, renew)
   - old_plan_id, new_plan_id, reason, performed_by
   - effective_date, prorated_amount

2. Subscription lifecycle logic:
   - Freeze: status → 'frozen', freeze_until date, freeze_fee charged
   - Unfreeze: status → 'active', next_billing_date adjusted
   - Upgrade: calculate proration, charge difference, activate new plan
   - Downgrade: calculate proration, credit account, activate at next cycle
   - Cancel: status → 'cancelled', access until end_date
   - Renew: auto-renewal unless cancelled

3. Cron job (pg_cron):
   - Daily: process renewals, handle freeze expirations
   - Daily: retry failed payments
   - Weekly: send renewal reminders (7 days before)

4. Self-service UI (client):
   - Current subscription card with plan details
   - Freeze button with duration selector
   - Upgrade flow with plan comparison
   - Cancel flow with reason collection
   - Billing history list

5. Staff UI:
   - Override freeze/cancel
   - Force plan change
   - View full subscription history
   - Apply manual discounts

REQUIREMENTS:
- Proration calculation: (new_price - old_price) * (days_remaining / days_in_cycle)
- Freeze fee from plan configuration
- Notice period from plan configuration
- Grace period for failed payments: 3 days
- All subscription changes logged in audit

REFERENCE: Feature Workflows §2.4: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md

NOTES AREA (fill on completion):
- Date completed: ___
- Subscription events tracked: ___
- Proration calculation tested: Yes/No
- Cron jobs scheduled: ___
```

---

## 4.5 Class Type and Schedule Management

### Description and Scope
Build the class management system: create class types (Yoga, HIIT, Spin, etc.), define schedules (recurring and one-time), assign instructors and rooms, set capacity, and manage class descriptions and media. Schedule viewable by all roles; editable by Admin, Manager, and Teacher (own classes).

### Why This Matters
Group classes are a major retention driver and revenue source. The schedule is the most-viewed screen for clients and teachers. A well-designed scheduling system with recurring classes, waitlists, and instructor management directly impacts class attendance and member satisfaction.

### Technical Approach
Class types with categories, intensity levels, and media. Recurring schedules via RRULE pattern (weekly on Mon/Wed/Fri). One-time classes for special events. Room and equipment allocation. Instructor assignment with conflict detection. Schedule displayed in calendar (week/month/day views).

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000030_class_types_enhanced.sql
├── 00000000000031_schedule_recurrence.sql
└── 00000000000032_room_allocation.sql
supabase/functions/classes/
apps/web/src/pages/[role]/classes/
apps/mobile/src/app/(app)/classes/
```

### Success Criteria
```
[ ] Create class type: name, description, duration, intensity, category, image
[ ] Create recurring schedule: day, time, instructor, room, capacity
[ ] RRULE support: weekly, bi-weekly, specific days
[ ] One-time classes: special events, workshops
[ ] Instructor assignment with conflict detection
[ ] Room allocation with availability check
[ ] Capacity management with enrollment count
[ ] Class descriptions with rich text and media
[ ] Schedule views: week grid, day list, month calendar
[ ] Color-coded by class category
[ ] Schedule filters: by type, instructor, time
[ ] Copy/paste schedule week-to-week
[ ] Bulk schedule creation for new semesters
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement class type and schedule management for OhMyGold.

CONTEXT: Group classes are core to gym operations. Need recurring schedules, instructor management, and multiple calendar views.

TASK:
1. Enhanced class types:
   - category (yoga, cardio, strength, mind-body, spin, aquafit)
   - intensity (low, moderate, high)
   - equipment_needed (JSONB array)
   - image_url, video_url
   - calories_estimate, description (rich text)

2. Schedule recurrence:
   - recurring_pattern (JSONB: {frequency: 'weekly', days: [1,3,5]})
   - start_date, end_date (semester boundaries)
   - exception_dates (holidays, cancellations)
   - Generate individual class_instances from pattern

3. Room allocation:
   - rooms table: name, location_id, capacity, equipment
   - room_bookings: prevent double-booking
   - Availability check before assignment

4. Instructor management:
   - Assign teacher to class
   - Conflict detection (same time, different class)
   - Substitution requests and approval
   - Teacher can request sub for own class

5. Calendar views:
   - Week view: grid with time slots, drag to scroll
   - Day view: list of classes with details
   - Month view: compact grid with dots
   - Filters: category, instructor, time of day

REQUIREMENTS:
- Recurring: RRULE-like pattern in JSONB
- Conflict detection: same instructor can't teach 2 classes simultaneously
- Room double-booking prevention
- Color coding by category (from DESIGN.MD)
- French class names and descriptions

REFERENCE:
- Feature List §6: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Permission Matrix §E: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md

NOTES AREA (fill on completion):
- Date completed: ___
- Class categories: ___
- Recurring patterns supported: ___
- Calendar views: ___
```

---

## 4.6 Booking System with Waitlist

### Description and Scope
Build the class booking engine: members browse the schedule, book classes, cancel bookings, join waitlists, and receive confirmations. Staff can book on behalf of members, override capacity, and manage waitlist promotions. Full booking lifecycle with notifications.

### Why This Matters
Booking is the primary client interaction — it must be fast and reliable. A member should be able to book a class in under 5 seconds. Waitlist management ensures classes fill to capacity. Overbooking protection maintains class quality and safety.

### Technical Approach
Bookings table with status enum (booked, cancelled, attended, no_show). Atomic booking transaction: check capacity → decrement available → create booking → send confirmation. Waitlist: ordered queue, auto-promote on cancellation. Real-time availability updates via Supabase Realtime. Booking window: configurable (e.g., 7 days ahead).

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000033_bookings_enhanced.sql
├── 00000000000034_waitlist.sql
└── 00000000000035_booking_rules.sql
supabase/functions/bookings/
apps/web/src/pages/[role]/bookings/
apps/mobile/src/app/(app)/bookings/
```

### Success Criteria
```
[ ] Browse class schedule with availability indicator
[ ] Book class in < 5 seconds (atomic transaction)
[ ] Booking confirmation with email + push notification
[ ] Cancel booking with reason selection
[ ] Cancellation policy enforced (e.g., 4 hours before)
[ ] Waitlist: join, position shown, auto-promote on cancellation
[ ] Waitlist promotion: notification, 24-hour hold to confirm
[ ] Staff book for member: search member, book class
[ ] Override capacity (manager only): with reason
[ ] Booking window: configurable per location
[ ] Real-time availability updates
[ ] Booking history: past and upcoming
[ ] Late cancellation fee (configurable)
[ ] Recurring booking: book same class weekly
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement the booking system with waitlist for OhMyGold.

CONTEXT: Class booking is the most-used client feature. Must be fast, reliable, with waitlist support.

TASK:
1. Enhanced bookings:
   - status: booked, cancelled, attended, no_show, waitlisted
   - booked_at, cancelled_at, cancellation_reason
   - checked_in_at, checked_in_by
   - Atomic booking transaction (prevent overbooking)

2. Waitlist system:
   - Ordered by join time
   - Auto-promote on cancellation
   - Promotion notification with 24h hold
   - Manual promote by staff
   - Waitlist size limit

3. Booking rules:
   - booking_window_days (how far ahead)
   - cancellation_policy_hours (min hours before for free cancel)
   - late_cancellation_fee
   - max_bookings_per_day
   - max_consecutive_bookings

4. Booking flow:
   - Browse schedule → tap class → view details → book
   - Real-time availability (Supabase Realtime)
   - Confirmation: toast + email + push
   - Add to calendar option

5. Staff booking:
   - Search member → select class → book
   - Override capacity with reason
   - Bulk booking for groups

REQUIREMENTS:
- Atomic: use PostgreSQL transaction or Edge Function
- Overbooking: impossible even with concurrent requests
- Waitlist: FIFO auto-promote
- Notifications: email + push on book/cancel/promote
- Cancellation policy: configurable per location

REFERENCE:
- Feature Workflows §2.6: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md
- Mobile Research §7.4: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md

NOTES AREA (fill on completion):
- Date completed: ___
- Atomic booking tested: Yes/No
- Waitlist auto-promote: Yes/No
- Concurrent booking stress test: ___ requests/sec
```

---

## 4.7 Check-in/Access Control System

### Description and Scope
Build the gym check-in system: members check in via QR code scan (self or staff-assisted), RFID card tap, or manual entry. Access rules validate active membership, check time-based restrictions, log entry/exit, display real-time occupancy, and trigger capacity alerts.

### Why This Matters
Check-in is the daily operational heartbeat. Every member visit flows through this system. It validates memberships (prevents expired access), tracks attendance (for analytics), manages capacity (safety), and creates the access log (for security and billing disputes).

### Technical Approach
Check-in via QR code (member shows digital card, staff scans), RFID (future integration), or manual search. Validation: active membership, time restrictions, zone access. Entry log: timestamp, method, location. Real-time occupancy via Realtime. Capacity alert at 90%. Integration with access control hardware (future).

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000036_access_rules.sql
└── 00000000000037_check_in_system.sql
supabase/functions/checkin/
apps/web/src/pages/employee/check-in/
apps/mobile/src/app/(app)/check-in/
```

### Success Criteria
```
[ ] QR code check-in: member shows QR, staff scans, validated
[ ] Self check-in (mobile): member scans QR at gym entrance
[ ] RFID card tap check-in (future-ready)
[ ] Manual check-in: search member by name/card number
[ ] Membership validation: active, not frozen, not expired
[ ] Time restriction check: off-peak plans validated
[ ] Zone access control: premium zones for premium members
[ ] Entry/exit logging with timestamp
[ ] Real-time occupancy display per zone
[ ] Capacity alert at 90% threshold
[ ] Check-in history: member's visit log
[ ] Peak hours analytics from check-in data
[ ] Integration hooks for access control hardware
[ ] Check-in processing time: < 3 seconds
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement the check-in and access control system for OhMyGold.

CONTEXT: Check-in is the daily operational core. Need QR scanning, membership validation, and real-time occupancy tracking.

TASK:
1. Access rules:
   - membership validation rules
   - time-based access (off-peak vs all-hours)
   - zone-based access (premium zones)
   - guest pass rules
   - configurable per location

2. Check-in methods:
   - QR scan: staff camera scans member QR code
   - Self check-in: member app scans gym QR code
   - Manual: search member, tap to check in
   - RFID: placeholder for future integration

3. Check-in flow:
   - Scan/search → validate membership → log entry → show welcome
   - Validation: active, not frozen, within time restrictions
   - On failure: show reason (expired, frozen, time restriction)
   - Success: welcome message, access granted

4. Real-time occupancy:
   - Per-zone headcount (entry - exit)
   - Supabase Realtime updates
   - Capacity alert at 90% (push to managers)
   - Historical occupancy data

5. Access logs:
   - entry_time, exit_time, method, zone
   - Exportable for reporting
   - GDPR: member can view own access history

REQUIREMENTS:
- Check-in processing: < 3 seconds
- QR code: contains encrypted member ID
- Real-time: occupancy updates live
- Hardware integration: API hooks for future RFID/NFC
- Validation failure reasons clearly communicated

REFERENCE:
- Mobile Features §7.2: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md
- Feature List §10: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Check-in methods: ___
- Validation rules: ___
- Real-time occupancy: Yes/No
- Check-in processing time: ___ seconds
```

---

## 4.8 Billing and Invoicing

### Description and Scope
Build the billing engine: automatic invoice generation on billing dates, invoice PDF generation, email delivery, payment status tracking, overdue handling, and billing history. Supports subscription billing, one-off charges, refunds, and credits. French fiscal compliance (NF 525).

### Why This Matters
Billing is the revenue pipeline. Inaccurate billing leads to disputes, churn, and legal issues. French fiscal law requires NF 525 certification for invoicing software — invoices must be immutable, sequentially numbered, and tamper-proof. This is not negotiable for operating in France.

### Technical Approach
Invoice generation triggered by cron job on billing dates. Invoice numbers: sequential, immutable, NF 525 compliant. PDF generation via Puppeteer or similar. Email delivery via SendGrid. Overdue: dunning process with escalating reminders. Credits and refunds tracked separately. All billing data encrypted at rest.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000038_billing_enhanced.sql
├── 00000000000039_invoice_items.sql
└── 00000000000040_nf525_compliance.sql
supabase/functions/billing/
apps/web/src/pages/[role]/billing/
```

### Success Criteria
```
[ ] Automatic invoice generation on billing date
[ ] Invoice numbering: sequential, immutable, NF 525 compliant
[ ] Invoice PDF generation with Gold's Gym branding
[ ] Invoice items: subscription, proration, credits, fees
[ ] Email delivery with PDF attachment
[ ] Payment status tracking: pending, paid, failed, overdue
[ ] Overdue handling: dunning reminders (day 1, 7, 14, 30)
[ ] Credit notes for refunds and adjustments
[ ] Billing history: all invoices per member
[ ] Revenue recognition: proper accounting period
[ ] Tax calculation: French VAT (20%)
[ ] NF 525: tamper-proof invoice storage, audit trail
[ ] Admin dashboard: revenue overview, outstanding invoices
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement billing and invoicing for OhMyGold with NF 525 compliance.

CONTEXT: French fiscal law requires NF 525 certification. Invoices must be immutable, sequential, and tamper-proof. This is legally required for operating in France.

TASK:
1. Enhanced billing:
   - invoices: number (sequential), status, due_date, paid_date
   - invoice_items: description, quantity, unit_price, total, tax_rate
   - credits: credit_notes table for refunds/adjustments
   - dunning_log: reminder history per overdue invoice

2. NF 525 compliance:
   - Invoice numbers: sequential, no gaps, no modification
   - Immutable storage: signed hash of each invoice
   - Audit trail: who created, when, from what data
   - Archive: 10-year retention
   - Certification documentation

3. Invoice generation:
   - Cron: daily check for billing dates
   - Generate from subscription + proration + adjustments
   - PDF: Gold's Gym branded, French format
   - Email: SendGrid with PDF attachment

4. Overdue handling:
   - Day 1: friendly reminder
   - Day 7: second reminder
   - Day 14: final notice + late fee
   - Day 30: suspend membership
   - Configurable per location

5. Revenue dashboard:
   - Monthly recurring revenue (MRR)
   - Outstanding invoices total
   - Overdue rate
   - Revenue by plan
   - Collection rate

REQUIREMENTS:
- NF 525: immutable invoices, sequential numbering, signed hash
- VAT: 20% French rate (configurable)
- Currency: EUR
- Invoice format: French legal requirements
- Retention: 10 years

REFERENCE:
- Feature List §8: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Research §5.3 (SOC2/GDPR): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md

NOTES AREA (fill on completion):
- Date completed: ___
- NF 525 measures: ___
- Invoice numbering: sequential/Yes
- PDF generation: ___ library
- Overdue dunning steps: ___
```

---


#### Waitlist Auto-Promotion with Delivery Guarantee

When a spot opens (cancellation), the waitlist auto-promotion follows a guaranteed delivery protocol:

**Promotion Flow:**
```
1. Booking cancelled → spot freed
2. SELECT first waitlisted member (position = 1)
3. Create promoted booking (status = 'confirmed', held_until = NOW() + 2 hours)
4. Send notification: Push + Email + SMS (triple-channel)
5. Start 2-hour countdown timer
6. Member must confirm or spot is released
```

| Stage | Action | Delivery Guarantee |
|-------|--------|-------------------|
| Spot opens | Auto-promote #1 waitlist member | Atomic transaction (booking + notification enqueue) |
| Notification | Push (primary) + Email (backup) + SMS (fallback) | All three channels attempted simultaneously |
| Hold period | 2-hour countdown with visual indicator | Timer stored in DB, survives app restarts |
| No response | Release spot, promote #2 | Cascade up to 3 times per opening |
| Member declines | Immediate release, promote next | No delay between declines and next promotion |

**Cascade limit:** Maximum 3 promotions per spot opening. After 3 failed promotions, the spot remains open for general booking.

**Audit log:** Every promotion attempt is logged to `waitlist_promotions` table:
```sql
CREATE TABLE waitlist_promotions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id     UUID NOT NULL REFERENCES class_schedules(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  promoted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notification_sent_at TIMESTAMPTZ,
  channels_used   TEXT[], -- ['push', 'email', 'sms']
  response        TEXT CHECK (response IN ('accepted', 'declined', 'expired', 'cancelled')),
  responded_at    TIMESTAMPTZ,
  cascade_number  INTEGER NOT NULL DEFAULT 1, -- 1, 2, or 3
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 4.9 Payment Processing Integration

### Description and Scope
Integrate payment processing via Stripe (primary) with Mollie as EU fallback. Support card payments (one-off and recurring), SEPA direct debit, payment method storage (PCI-compliant via tokenization), failed payment retry logic, and refund processing. Web and mobile payment flows.

### Why This Matters
Payment processing is mission-critical — it literally generates revenue. A failed payment integration means no membership revenue. Stripe provides a robust API with strong EU support. SEPA direct debit is the preferred payment method for subscriptions in France. PCI compliance is mandatory.

### Technical Approach
Stripe Elements for web (PCI-compliant, no card data touches our server), Stripe React Native SDK for mobile. Payment methods stored as Stripe tokens (never raw card data). Recurring payments via Stripe Subscriptions or manual charging on billing dates. Failed payment: 3 retries with 3-day intervals, then suspension. Refunds via Stripe API with approval workflow.

### Files/Directories to Create/Modify
```
supabase/functions/payments/
apps/web/src/components/
└── StripeProvider.tsx
apps/mobile/src/lib/
└── stripe.ts
```

### Success Criteria
```
[ ] Stripe account configured (test + production)
[ ] Card payment: one-off and recurring
[ ] SEPA direct debit: mandate collection, processing
[ ] Payment method storage: secure tokenization
[ ] Payment form: Stripe Elements (web), Stripe SDK (mobile)
[ ] 3D Secure support for EU card payments
[ ] Failed payment: 3 retries, 3-day intervals
[ ] Failed payment notification: email + push
[ ] Refund processing: full and partial, with approval
[ ] Refund reason tracking
[ ] Payment history: all transactions per member
[ ] Webhook handling: Stripe events (payment_intent.succeeded, etc.)
[ ] PCI compliance: no card data on our servers
[ ] Test mode: use Stripe test cards for development
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Integrate Stripe payment processing for OhMyGold.

CONTEXT: Payment processing is mission-critical. Stripe is primary with Mollie as EU fallback. Must support cards and SEPA direct debit.

TASK:
1. Stripe configuration:
   - Set up Stripe account (test + production)
   - Store API keys in environment variables
   - Configure webhooks endpoint
   - Set up products and prices in Stripe

2. Payment flows:
   - Web: Stripe Elements for card capture
   - Mobile: Stripe React Native SDK
   - SEPA: mandate collection form
   - 3D Secure: handle authentication challenge

3. Payment processing:
   - One-off charges: payment intent
   - Recurring: charge saved payment method on billing date
   - Payment method storage: SetupIntent for saving cards
   - Never store raw card data (PCI compliance)

4. Failed payment handling:
   - 3 retries: day 1, day 4, day 7
   - Email + push notification each retry
   - On final failure: suspend membership
   - Grace period: 3 days after final failure

5. Refunds:
   - Full refund: original payment method
   - Partial refund: specified amount
   - Approval workflow: employee requests, manager approves
   - Refund reason tracking

6. Webhook handler:
   - payment_intent.succeeded → mark invoice paid
   - payment_intent.payment_failed → trigger retry
   - invoice.payment_failed (Stripe) → handle
   - charge.refunded → record refund

REQUIREMENTS:
- PCI DSS: SAQ-A (Stripe handles card data)
- SEPA: mandate reference, notification rules
- Currency: EUR
- Webhook: verify Stripe signature
- Idempotency: prevent duplicate charges

REFERENCE:
- Feature List §9: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Feature Workflows §2.5: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md

NOTES AREA (fill on completion):
- Date completed: ___
- Payment methods: Card/Yes, SEPA/Yes
- 3D Secure: Yes/No
- Webhook events handled: ___
- PCI compliance level: SAQ-A
```

---

## 4.10 POS and Product Catalog

### Description and Scope
Build the Point of Sale system: product catalog with categories, barcode support, cart management, discount application, payment processing, receipt generation, and daily sales summary. Used by Employees and Managers at the front desk.

### Why This Matters
POS handles in-gym sales: protein shakes, supplements, merchandise, day passes. For many locations, POS is a significant revenue stream. A fast, reliable POS that processes transactions in under 30 seconds keeps front desk lines moving.

### Technical Approach
Product catalog with categories and SKUs. Cart state managed in React. Barcode scanning via camera (mobile) or USB scanner (web). Discounts: percentage or fixed amount, with approval for large discounts. Payment via Stripe Terminal (future) or manual entry. Receipt generation (print + email). Daily reconciliation report.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000041_pos_transactions.sql
└── 00000000000042_discounts.sql
supabase/functions/pos/
apps/web/src/pages/employee/pos/
apps/mobile/src/app/(app)/pos/
```

### Success Criteria
```
[ ] Product catalog: browse by category, search by name/SKU
[ ] Barcode scanning: camera (mobile), USB scanner (web)
[ ] Cart management: add, remove, update quantity, clear
[ ] Cart summary: subtotal, tax, discount, total
[ ] Discount: percentage or fixed, with approval threshold
[ ] Payment: cash, card (Stripe), split payment
[ ] Receipt: generate PDF, print, email
[ ] Receipt includes: items, prices, tax, total, location, timestamp
[ ] Daily sales summary: transactions, revenue, by category
[ ] Return/exchange processing
[ ] Low-stock alerts at POS
[ ] Transaction processing time: < 30 seconds
[ ] Offline mode: queue transactions, sync when online
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement POS and product catalog for OhMyGold.

CONTEXT: Front desk POS for in-gym sales. Must be fast and work on both web (desktop terminal) and mobile (tablet).

TASK:
1. Product catalog:
   - Categories: supplements, apparel, accessories, drinks, day passes
   - Search: by name, SKU, barcode
   - Product card: image, name, price, stock indicator
   - Quick-add buttons for popular items

2. Cart management:
   - Add/remove items
   - Quantity adjustment (+/-)
   - Cart summary sidebar
   - Subtotal, tax (20% VAT), discount, total

3. Discount system:
   - Percentage (e.g., 10% off) or fixed (e.g., 5 € off)
   - Manager approval for discounts > threshold
   - Promo code support
   - Employee discount tracking

4. Payment:
   - Cash: enter amount received, calculate change
   - Card: Stripe payment intent
   - Split: part cash, part card
   - Receipt: generate, print, email

5. Daily operations:
   - Daily sales report: transactions, revenue, items sold
   - End-of-shift reconciliation
   - Cash drawer management
   - Return/exchange processing

REQUIREMENTS:
- Transaction time: < 30 seconds
- Receipt: Gold's Gym branded, NF 525 compliant
- Barcode: EAN-13 support
- Offline: queue and sync
- Large touch targets for tablet use

REFERENCE: Feature List §11: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Product categories: ___
- Payment methods: ___
- Transaction time: ___ seconds
- Offline support: Yes/No
```

---

## 4.11 Inventory Management

### Description and Scope
Build the inventory management system: stock tracking, purchase orders, supplier management, stock counts, low-stock alerts, and inventory valuation. Managers manage inventory at their location; Admin has global view.

### Why This Matters
Inventory represents capital. Overstock ties up money; stockouts lose sales. Automated low-stock alerts ensure reordering happens before shelves are empty. Purchase orders provide procurement tracking. Inventory valuation feeds financial reporting.

### Technical Approach
Inventory tracking via transactions (every sale, receipt, adjustment creates a transaction). Stock levels calculated from transactions. Purchase orders with status tracking (draft, sent, partial, received). Suppliers table with contact info and order history. Stock counts (physical inventory audits) with variance reporting.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000043_inventory_transactions.sql
├── 00000000000044_purchase_orders.sql
└── 00000000000045_suppliers.sql
supabase/functions/inventory/
apps/web/src/pages/manager/inventory/
```

### Success Criteria
```
[ ] Stock tracking: current quantity per product
[ ] Stock transactions: sale, receipt, adjustment, return
[ ] Low-stock alerts: configurable threshold per product
[ ] Purchase orders: create, send, receive, track
[ ] Supplier management: contacts, order history
[ ] Stock counts: physical count vs system, variance report
[ ] Inventory valuation: cost-based, retail-based
[ ] Stock movement history per product
[ ] Reorder suggestions based on sales velocity
[ ] Inventory reports: turnover, valuation, dead stock
[ ] Integration with POS: auto-decrement on sale
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement inventory management for OhMyGold.

CONTEXT: Track stock for POS products. Manage purchase orders and suppliers. Alert on low stock.

TASK:
1. Inventory transactions:
   - Every sale: auto-create transaction (decrement)
   - Manual adjustments: with reason
   - Stock receipts: from purchase orders
   - Returns: increment stock

2. Purchase orders:
   - Create from low-stock alert or manually
   - Add line items with quantities
   - Status: draft, sent, partially_received, received, cancelled
   - Receive: update stock, close PO

3. Suppliers:
   - Name, contact, email, phone, address
   - Order history
   - Preferred supplier per product

4. Stock management:
   - Current quantity, reorder level, reorder quantity
   - Low-stock alert: push + email when below threshold
   - Stock count: physical vs system, variance
   - Reorder suggestions based on sales velocity

5. Reports:
   - Inventory valuation (cost × quantity)
   - Stock turnover rate
   - Dead stock identification
   - Stock movement log

REQUIREMENTS:
- Auto-sync with POS sales
- Low-stock alert: push + email
- Purchase order PDF generation
- Variance reporting for stock counts

REFERENCE: Feature List §12: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Inventory tracking method: FIFO/Average/___
- Purchase order flow: ___
- Low-stock alerts: Yes/No
```

---

## 4.12 CRM and Lead Management

### Description and Scope
Build the Customer Relationship Management system: lead capture (walk-in, website, referral), pipeline management, follow-up scheduling, activity logging, conversion tracking, and lead source analytics. Staff manage leads; Admin sees global analytics.

### Why This Matters
Lead management directly impacts membership growth. Every walk-in inquiry, website signup, or referral is a potential member. A structured CRM with follow-up reminders ensures no lead falls through the cracks. Conversion analytics identify the most effective lead sources.

### Technical Approach
Leads table with source, status, assigned_to. Pipeline stages: New → Contacted → Trial Booked → Trial Completed → Member/Closed. Activities: calls, emails, meetings, notes. Follow-up reminders via push + email. Conversion tracking: lead → trial → member. Source analytics: which channels produce the most members.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000046_lead_activities.sql
├── 00000000000047_follow_up_reminders.sql
└── 00000000000048_conversion_tracking.sql
supabase/functions/crm/
apps/web/src/pages/manager/crm/
```

### Success Criteria
```
[ ] Lead capture: walk-in form, website form, manual entry
[ ] Lead sources: walk-in, website, referral, social media, phone
[ ] Pipeline stages: New, Contacted, Trial Booked, Trial Completed, Member, Closed
[ ] Lead assignment: auto or manual to staff member
[ ] Activity logging: calls, emails, meetings, notes
[ ] Follow-up scheduling: date/time, reminder notification
[ ] Lead status tracking and history
[ ] Conversion tracking: lead → trial → member rate
[ ] Lead source analytics: conversion by source
[ ] Automated follow-up reminders
[ ] Lead duplication detection
[ ] Bulk import from CSV
[ ] GDPR: consent tracking, data retention
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement CRM and lead management for OhMyGold.

CONTEXT: Lead management drives membership growth. Need pipeline tracking, follow-up reminders, and conversion analytics.

TASK:
1. Lead management:
   - Capture: form fields (name, email, phone, source, interest)
   - Sources: walk-in, website, referral, social, phone, email
   - Assignment: auto-round-robin or manual
   - Status: new, contacted, qualified, trial_booked, member, closed_lost
   - Priority: hot, warm, cold

2. Pipeline:
   - Kanban board view: columns by stage
   - Drag to move between stages
   - Stage history and timestamps
   - Win/loss reasons

3. Activities:
   - Log: call, email, meeting, note, SMS
   - Activity history per lead
   - Next action and due date

4. Follow-up:
   - Schedule follow-up with date and type
   - Reminder: push + email at scheduled time
   - Overdue follow-ups highlighted

5. Analytics:
   - Conversion rate: lead → member
   - Conversion by source
   - Average conversion time
   - Staff performance: leads converted per employee

REQUIREMENTS:
- Pipeline drag-and-drop
- Automated reminders
- Duplicate detection by email/phone
- GDPR consent tracking
- CSV import template

REFERENCE:
- Feature List §13: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Research §5.5 (AI): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md

NOTES AREA (fill on completion):
- Date completed: ___
- Pipeline stages: ___
- Lead sources: ___
- Automated reminders: Yes/No
- Conversion tracking: Yes/No
```

---

## 4.13 Marketing Campaigns (Email, SMS, Push)

### Description and Scope
Build the marketing campaign system: create and send email, SMS, and push notification campaigns. Member segmentation, template management, A/B testing support, scheduling, delivery tracking, and engagement analytics. Compliant with GDPR marketing consent.

### Why This Matters
Marketing campaigns drive retention and revenue. Re-engagement emails bring back lapsed members. Class promotion SMS fills empty spots. Push notifications drive app engagement. But all marketing must be GDPR-compliant — users must consent, and unsubscribes must be honored.

### Technical Approach
Campaign builder with template selection, audience segmentation, and scheduling. Email via SendGrid (HTML templates), SMS via Twilio, push via Firebase Cloud Messaging (Android) and APNs (iOS). Segmentation: by membership type, attendance pattern, location. Delivery tracking: open rates, click rates. A/B testing: subject lines, send times. Unsubscribe handling.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000049_campaign_segments.sql
├── 00000000000050_campaign_analytics.sql
└── 00000000000051_marketing_consent.sql
supabase/functions/campaigns/
apps/web/src/pages/manager/marketing/
```

### Success Criteria
```
[ ] Create campaign: name, type (email/SMS/push), audience, content
[ ] Member segmentation: by plan, location, attendance, join date
[ ] Template library: pre-built templates for common campaigns
[ ] Email campaigns: HTML with Gold's Gym branding
[ ] SMS campaigns: 160-char compliant, sender ID
[ ] Push campaigns: rich media, action buttons
[ ] Scheduling: send now or schedule for later
[ ] Delivery tracking: sent, delivered, opened, clicked
[ ] A/B testing: subject lines, content variants
[ ] Unsubscribe handling: one-click, honored immediately
[ ] GDPR: consent check before send, consent tracking
[ ] Engagement analytics: open rate, click rate, conversion
[ ] Campaign performance dashboard
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement marketing campaigns for OhMyGold.

CONTEXT: Multi-channel marketing with GDPR compliance. Drive engagement and retention through targeted campaigns.

TASK:
1. Campaign builder:
   - Step 1: Select channel (email, SMS, push)
   - Step 2: Select audience (segment or manual list)
   - Step 3: Compose content (template or custom)
   - Step 4: Review and schedule
   - Step 5: Send or schedule

2. Segmentation:
   - By membership plan
   - By location
   - By attendance frequency (active, lapsing, lapsed)
   - By join date (new members, long-term)
   - Custom: combine criteria

3. Templates:
   - Welcome series
   - Class promotion
   - Re-engagement
   - Birthday offer
   - Trial follow-up
   - Custom HTML editor

4. Delivery:
   - Email: SendGrid API, HTML templates
   - SMS: Twilio API, 160-char limit
   - Push: FCM + APNs, rich media, action buttons

5. Analytics:
   - Delivery rate, open rate, click rate
   - Unsubscribe rate
   - Conversion rate (campaign → booking/enrollment)
   - Revenue attribution

REQUIREMENTS:
- GDPR: check marketing consent before sending
- Unsubscribe: one-click, immediate
- Quiet hours: no sends 22:00-08:00
- Rate limiting: max frequency per member
- Bounce handling

REFERENCE:
- Feature List §14: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Mobile Research §7.3: /mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md

NOTES AREA (fill on completion):
- Date completed: ___
- Channels: Email/Yes, SMS/Yes, Push/Yes
- Segments: ___
- Templates: ___
- GDPR compliance: Yes/No
```

---

## 4.14 Staff and Teacher Management

### Description and Scope
Build the staff management system: create and manage Employee, Manager, and Teacher accounts. Role assignment, location assignment, schedule management, certifications tracking, payroll integration hooks, and performance analytics. Admin has full control; Manager manages own staff.

### Why This Matters
Staff management is the HR backbone. Every employee, manager, and teacher needs an account with appropriate permissions. Certification tracking ensures compliance (e.g., CPR certification for coaches). Schedule management shows who's working when. Performance data identifies top performers.

### Technical Approach
User management extends Phase 3. Staff profiles include: certifications, specialties, availability schedule, pay rate. Role assignment via admin interface. Location assignment (staff works at specific gym). Teacher specialties and class assignments. Performance metrics: classes taught, attendance rate, member ratings.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000052_staff_profiles.sql
├── 00000000000053_certifications.sql
└── 00000000000054_staff_schedules.sql
supabase/functions/staff/
apps/web/src/pages/admin/staff/
apps/web/src/pages/manager/staff/
```

### Success Criteria
```
[ ] Create staff account: name, email, role, location
[ ] Role assignment: Admin, Manager, Employee, Teacher
[ ] Location assignment: which gym(s) staff works at
[ ] Certifications: type, issued date, expiry date, document
[ ] Certification expiry alerts (30 days before)
[ ] Teacher specialties: Yoga, HIIT, Spin, etc.
[ ] Staff schedule: working hours, availability
[ ] Teacher class assignments and schedule
[ ] Staff performance: classes taught, attendance, ratings
[ ] Deactivate/reactivate staff accounts
[ ] Staff directory: searchable, filterable
[ ] Payroll integration hooks (future)
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement staff and teacher management for OhMyGold.

CONTEXT: Manage gym staff across 6 roles. Track certifications, schedules, and performance.

TASK:
1. Staff profiles:
   - Extend user_profiles with staff-specific fields
   - Certifications: name, issuing body, issued, expires, document_url
   - Specialties: for teachers (class types they can teach)
   - Pay rate, employment type (full-time, part-time)
   - Start date, end date

2. Schedule management:
   - Working hours per day
   - Availability exceptions (time off, vacation)
   - Class assignments for teachers
   - Shift schedule for employees

3. Certifications:
   - Add/remove certifications
   - Expiry tracking with alerts
   - Required certifications per role
   - Compliance reporting

4. Performance:
   - Classes taught (for teachers)
   - Average class attendance
   - Member ratings
   - Check-ins processed (for employees)
   - Sales processed (for employees)

5. Management actions:
   - Create/edit/deactivate staff
   - Change role (with approval)
   - Transfer between locations
   - Reset password
   - View activity log

REQUIREMENTS:
- Certification alerts: 30 days before expiry
- Role change approval workflow
- GDPR: staff data protection
- Performance data: aggregated only

REFERENCE:
- Permission Matrix §A: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Feature List §2: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Staff fields: ___
- Certification tracking: Yes/No
- Performance metrics: ___
```

---

## 4.15 Analytics Dashboard

### Description and Scope
Build the analytics dashboard: real-time KPIs, trend charts, comparison views, and drill-down capabilities. Role-based dashboards: Admin sees global metrics, Manager sees location metrics, Teacher sees class metrics, Client sees personal progress. Data updated in real-time via Supabase Realtime.

### Why This Matters
Data-driven decisions improve gym performance. Analytics reveal which classes are popular, when peak hours occur, which members are at risk of leaving, and where revenue comes from. A well-designed dashboard answers questions in seconds, not hours of spreadsheet work.

### Technical Approach
Pre-aggregated metrics tables updated via triggers for fast queries. Real-time updates via Supabase Realtime for live dashboards. Charts: Recharts (web), react-native-chart-kit (mobile). Role-based data filtering via RLS. Dashboard widgets: MetricCards with trend indicators. Export to CSV/PDF.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000055_analytics_views.sql
└── 00000000000056_dashboard_metrics.sql
supabase/functions/analytics/
apps/web/src/pages/[role]/dashboard/
apps/mobile/src/app/(app)/dashboard/
```

### Success Criteria
```
[ ] Admin dashboard: global KPIs, all locations, trends
[ ] Manager dashboard: location KPIs, daily/weekly/monthly
[ ] Teacher dashboard: class metrics, attendance, ratings
[ ] Client dashboard: personal stats, bookings, progress
[ ] KPI cards: members, revenue, attendance, churn rate
[ ] Trend charts: line, bar, area with time range selection
[ ] Comparison: period-over-period, location-vs-location
[ ] Real-time updates: live check-ins, current occupancy
[ ] Drill-down: tap KPI → detailed report
[ ] Date range selection: today, week, month, quarter, custom
[ ] Export: CSV and PDF
[ ] Dashboard customization: rearrange widgets
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Build the analytics dashboard for OhMyGold.

CONTEXT: Role-based analytics dashboards with real-time data. Drive data-informed decisions.

TASK:
1. Pre-aggregated metrics:
   - daily_metrics: location_id, date, new_members, checkins, revenue, class_bookings
   - member_metrics: total, active, frozen, churned, by plan
   - Create/update via database triggers

2. Dashboard widgets:
   - MetricCard: label, value, trend (up/down %)
   - LineChart: trends over time
   - BarChart: comparisons
   - DoughnutChart: breakdowns (plans, sources)
   - Recent activity feed

3. Role-based dashboards:
   - Admin: all locations, revenue, growth, churn
   - Manager: location revenue, occupancy, staff performance
   - Teacher: classes taught, attendance, ratings
   - Client: workouts, bookings, streak, goals

4. Real-time:
   - Live check-in count (Supabase Realtime)
   - Current occupancy
   - Today's class bookings

5. Interactions:
   - Date range picker
   - Drill-down: tap metric → detailed view
   - Export: CSV, PDF
   - Customizable layout

REQUIREMENTS:
- Charts: gold primary, blue secondary, semantic colors
- Responsive: stack on mobile
- Loading: skeleton placeholders
- Empty states: "No data for selected period"
- Timezone-aware

REFERENCE:
- Feature List §15: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md
- Design System §5.8: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD

NOTES AREA (fill on completion):
- Date completed: ___
- Dashboards created: ___
- Widget types: ___
- Real-time widgets: ___
- Export formats: ___
```

---

## 4.16 Reporting System

### Description and Scope
Build the reporting engine: pre-built reports (financial, attendance, membership, operational), custom report builder, scheduled report delivery, and export to multiple formats. Admin and Manager can generate and schedule reports.

### Why This Matters
Reports transform raw data into actionable insights. Financial reports inform budgeting. Attendance reports optimize scheduling. Membership reports track growth. Automated report delivery ensures stakeholders receive regular updates without manual work.

### Technical Approach
Pre-built report templates with parameterized queries. Custom report builder: select fields, filters, groupings. Report scheduler: generate and email on schedule. Export: CSV, PDF, Excel. Report caching for performance. Role-based report access.

### Files/Directories to Create/Modify
```
supabase/migrations/
├── 00000000000057_report_templates.sql
└── 00000000000058_scheduled_reports.sql
supabase/functions/reports/
apps/web/src/pages/[role]/reports/
```

### Success Criteria
```
[ ] Pre-built reports: Financial, Attendance, Membership, Sales, Staff, Inventory
[ ] Financial report: revenue, expenses, outstanding, by period
[ ] Attendance report: check-ins, peak hours, class attendance
[ ] Membership report: new, churned, active, by plan, by source
[ ] Custom report builder: fields, filters, groupings, sort
[ ] Report scheduling: daily, weekly, monthly, email delivery
[ ] Export formats: CSV, PDF, Excel
[ ] Report preview before export
[ ] Saved reports: save custom report configurations
[ ] Report sharing: share link to report
[ ] Role-based: Admin sees all, Manager sees own location
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement the reporting system for OhMyGold.

CONTEXT: Generate business intelligence reports for decision-making. Pre-built and custom reports with scheduling.

TASK:
1. Pre-built reports:
   - Financial: revenue, payments, outstanding, refunds
   - Attendance: check-ins, class attendance, peak hours
   - Membership: growth, churn, retention, by plan
   - Sales: POS transactions, by category, by staff
   - Staff: performance, hours, certifications
   - Inventory: stock levels, valuation, movement

2. Custom report builder:
   - Select data source (table/view)
   - Select fields to include
   - Add filters (date range, location, status)
   - Group by field
   - Sort by field
   - Preview before export
   - Save configuration

3. Report scheduler:
   - Select report, frequency (daily/weekly/monthly)
   - Email recipients
   - Select format (PDF/CSV/Excel)
   - Delivery time (timezone-aware)
   - Manage scheduled reports

4. Export:
   - CSV: raw data
   - PDF: formatted report with charts
   - Excel: formatted with multiple sheets
   - Gold's Gym branded headers

5. Performance:
   - Use pre-aggregated metrics tables
   - Query optimization with indexes
   - Report caching: cache for 1 hour
   - Background generation for large reports

REQUIREMENTS:
- Date range: today, yesterday, this week, this month, last month, custom
- Location filter: all or specific
- Role-based: filter data by user role
- Export: CSV, PDF, Excel
- Scheduling: cron-based

REFERENCE: Feature List §16: /mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md

NOTES AREA (fill on completion):
- Date completed: ___
- Pre-built reports: ___
- Custom report builder: Yes/No
- Scheduling: Yes/No
- Export formats: ___
```

---

## Phase 4 Completion Checklist

```
[ ] 4.1 Location and facility management: multi-location, zones, equipment
[ ] 4.2 Membership plan management: tiers, features, pricing, templates
[ ] 4.3 Member enrollment and profiles: wizard, medical, QR card
[ ] 4.4 Subscription management: freeze, upgrade, cancel, billing
[ ] 4.5 Class type and schedule management: recurring, rooms, instructors
[ ] 4.6 Booking system with waitlist: atomic booking, auto-promote
[ ] 4.7 Check-in/access control: QR scan, validation, occupancy
[ ] 4.8 Billing and invoicing: NF 525, PDF, overdue handling
[ ] 4.9 Payment processing: Stripe, SEPA, 3DS, webhooks
[ ] 4.10 POS and product catalog: cart, barcode, receipt
[ ] 4.11 Inventory management: stock, POs, suppliers, alerts
[ ] 4.12 CRM and lead management: pipeline, follow-up, conversion
[ ] 4.13 Marketing campaigns: email, SMS, push, segments, GDPR
[ ] 4.14 Staff and teacher management: roles, certs, schedules
[ ] 4.15 Analytics dashboard: role-based, real-time, charts
[ ] 4.16 Reporting system: pre-built, custom, scheduled, export
[ ] All 16 modules have RLS policies enforced
[ ] All modules have Edge Functions for business logic
[ ] All modules have TanStack Query hooks for data fetching
[ ] Integration tests pass for critical paths
[ ] NF 525 compliance measures in billing module
```

---

*Phase 4 notes: This is the operational core of OhMyGold. 16 modules, each a complete vertical slice. The key to success is building each module as a self-contained unit with proper RLS, Edge Functions, and API hooks. Do not cut corners on billing (NF 525) or booking (atomic transactions) — these are the highest-risk areas. Every module must be tested with real data volumes before moving to Phase 5.*


#### Booking Atomic Transaction & Conflict Resolution

To handle race conditions when two users simultaneously book the last spot:

```sql
-- Atomic booking with SERIALIZABLE isolation
BEGIN ISOLATION LEVEL SERIALIZABLE;

-- 1. Lock the class schedule row (SELECT FOR UPDATE)
SELECT capacity, booked_count 
FROM class_schedules 
WHERE id = :schedule_id 
FOR UPDATE;

-- 2. Check if capacity remains
IF (booked_count >= capacity) THEN
  -- Class full: add to waitlist instead
  INSERT INTO bookings (user_id, schedule_id, status, waitlist_position)
  VALUES (:user_id, :schedule_id, 'waitlist', 
    (SELECT COALESCE(MAX(waitlist_position), 0) + 1 
     FROM bookings WHERE schedule_id = :schedule_id AND status = 'waitlist'));
  COMMIT;
  RETURN 'waitlisted';
END IF;

-- 3. Create booking
INSERT INTO bookings (user_id, schedule_id, status)
VALUES (:user_id, :schedule_id, 'confirmed');

-- 4. Increment counter
UPDATE class_schedules 
SET booked_count = booked_count + 1 
WHERE id = :schedule_id;

COMMIT;
RETURN 'confirmed';
```

**Conflict handling:**

| Scenario | Resolution |
|----------|-----------|
| `serialization_failure` | Retry up to 3 times with exponential backoff (100ms, 300ms, 900ms) |
| Deadlock | Log, return 409 Conflict, client shows "Class is being booked by another member" |
| Booking after capacity reached | Automatic waitlist insertion (position = current max + 1) |
| Simultaneous booking + cancellation | SERIALIZABLE ensures consistent ordering; cancellation frees spot for next booking |

**Retry logic (Edge Function):**
```typescript
async function atomicBooking(scheduleId: string, userId: string, maxRetries = 3): Promise<BookingResult> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await db.transaction('SERIALIZABLE', async (trx) => {
        // ... booking logic
      });
    } catch (err) {
      if (err.code === '40001' && attempt < maxRetries - 1) { // serialization_failure
        await delay(100 * Math.pow(3, attempt)); // 100ms, 300ms, 900ms
        continue;
      }
      throw err;
    }
  }
}
```



#### Digital Membership Card — QR Code Specification

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Data format** | `OHMYGOLD:{user_id}:{timestamp}:{hmac_signature}` | Structured, versioned, signed |
| **HMAC algorithm** | HMAC-SHA256 | Industry standard, fast verification |
| **HMAC key rotation** | Daily, 7-day overlap | Compromised key limited to 24h exposure |
| **Error correction** | Level M (~15%) | Scans reliably even with partial damage |
| **Minimum size** | 200x200px | Reliable scanning at gym entry gates |
| **QR version** | Version 4 (33x33 modules) | Fits structured data with room to grow |
| **Encoding** | Alphanumeric | Optimized for the data format |

**QR data generation:**
```typescript
function generateMembershipQR(userId: string, secretKey: string): string {
  const timestamp = Date.now(); // Unix timestamp in ms
  const payload = `OHMYGOLD:${userId}:${timestamp}`;
  const signature = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
  return `${payload}:${signature}`;
}
```

**Offline validation:**
- Staff devices cache the daily public verification key
- QR can be validated offline by checking HMAC signature against cached key
- Timestamp checked against ±5 minute window to prevent replay attacks
- `timestamp` ensures each QR is unique (can't be screenshot and reused)

**Daily rotation:**
- New secret key generated at midnight Europe/Paris
- Old key remains valid for 24 hours (grace period for timezone differences)
- Staff apps auto-download new key on first online connection after midnight


## 4.16 NF 525 Fiscal Compliance Appendix

French fiscal law (CGI Article 286 ter) requires certified POS systems for all B2C transactions. OhMyGold must generate NF 525-compliant receipts.

### Required Receipt Data Elements

| Element | Format | Example |
|---------|--------|---------|
| Receipt number | Sequential, unique per location | `INV-2026-000042` |
| Date/time | ISO 8601 in Europe/Paris timezone | `2026-04-29T14:30:00+02:00` |
| Seller | Gym name, SIRET number, address | `Gold's Gym Paris 15, SIRET 123 456 789 00012` |
| Items | Description, quantity, unit price, VAT rate | `Membership Basic x1 = 34,63 EUR (TVA 20%)` |
| VAT breakdown | Per-rate totals | `TVA 20%: 5,77 EUR` |
| Total amount | TTC (all taxes included) | `Total TTC: 34,63 EUR` |
| Payment method | Card, cash, SEPA | `CB ****1234` |
| Digital signature | ECDSA signature over receipt hash | `SIG: a3f2b1...` |

### Digital Signing Mechanism

```
1. Receipt data serialized to canonical JSON (sorted keys)
2. SHA-256 hash of canonical JSON
3. ECDSA sign hash with private key (HSM-backed or encrypted file)
4. Signature + certificate ID appended to receipt
5. Verification: hash receipt → verify signature against public cert
```

### Daily Fiscal Closing (Z-Ticket)

- Generated automatically at 3 AM for each location
- Summarizes all transactions for the day
- Includes: total count, total revenue, VAT per rate, payment method totals
- Signed with same certificate as individual receipts
- Stored immutably in `fiscal_closures` table

### Archive Requirements

| Requirement | Implementation |
|-------------|---------------|
| Retention | 3 years minimum (French fiscal law) |
| Format | Original signed JSON + human-readable PDF |
| Storage | PostgreSQL (primary) + encrypted S3 Glacier (archive) |
| Integrity | SHA-256 hash chain linking consecutive receipts |
| Audit | ANFII (Agence Nationale des Fraudes a l'Informatique) can verify signatures |

### Certified Fiscal Hardware Integration (Optional Phase 2)

If required by franchise agreement, integrate with certified fiscal terminals:
- **Ingenico** Link 2500/2500 Plus via USB/Bluetooth
- **Verifone** P400 via Ethernet
- ESC/POS protocol for thermal printer receipts



#### POS Thermal Printer Integration (ESC/POS)

For gym floor receipt printing, support ESC/POS-compatible thermal printers:

| Parameter | Specification |
|-----------|--------------|
| **Protocol** | ESC/POS (Epson Standard Code for Point of Sale) |
| **Connection** | USB (primary), Bluetooth (wireless stations), Ethernet (network printers) |
| **Paper width** | 80mm (standard receipt width) |
| **Print speed** | Minimum 200mm/sec for peak checkout |
| **Libraries** | `escpos` (Node.js), `react-native-esc-pos-printer` (mobile) |

**Receipt template (80mm):**
```
╔══════════════════════════╗
║     GOLD'S GYM FRANCE    ║
║     {Location Name}      ║
╠══════════════════════════╣
║ Date: 29/04/2026 14:30   ║
║ Receipt: INV-2026-000042 ║
║ Cashier: {Employee Name} ║
╠══════════════════════════╣
║ Membership Basic    x1   ║
║                    34.63 ║
║ TVA 20%             5.77 ║
╠══════════════════════════╣
║ TOTAL TTC:       34.63 € ║
║ CB ****1234              ║
╠══════════════════════════╣
║  Merci pour votre fidélité ║
║     À bientôt, champion !  ║
╚══════════════════════════╝
```

**Printer management:**
- Auto-discovery: Scan USB ports and Bluetooth paired devices
- Print queue: FIFO queue with retry on printer unavailable
- Fallback: If printer offline → offer email receipt
- Status: Display printer connection status in POS header (green=connected, red=offline)

# Phase 5: Webapp Screen Implementation

> **Phase ID:** P5
> **Duration:** 4-6 weeks
> **Prerequisites:** Phase 4 at 50%+ (core APIs available, auth complete, design system ready)
> **Goal:** Implement all web screens for every user role using the design system and core APIs

---

## Phase Overview

Phase 5 builds the complete web application interface. Using the design system from Phase 2 and the APIs from Phase 4, we create role-specific screens for all 6 user roles plus shared screens. This is where the OhMyGold webapp comes to life.

The webapp serves as the primary interface for Admin, Manager, and Employee roles. Client and Visitor screens on web serve as fallback and information access. All screens must be responsive (xs to 2xl), accessible (WCAG AA+), and i18n-ready (FR/EN).

**Screen count estimate:** 60-80 screens across all roles.

---

## 5.1 Admin Screens

### Description and Scope
Implement the complete Admin screen set: global dashboard with cross-location KPIs, user management (all 6 roles), location management, system settings, integration configuration, role/permission editing, audit log viewer, backup management, and global analytics. Admin has full system access.

### Why This Matters
Admin is the system superuser. These screens control the entire platform — from creating new gym locations to managing user permissions to monitoring system health. A well-designed admin interface reduces support overhead and empowers Gold's Gym France's IT team.

### Screens to Implement
```
/admin/dashboard           # Global KPIs: locations, members, revenue, system health
/admin/locations           # All locations: list, create, edit, deactivate
/admin/locations/[id]      # Location detail with settings, stats
/admin/users               # User management: all roles, search, filter, create
/admin/users/[id]          # User detail, edit profile, change role, reset password
/admin/users/new           # Create user with role assignment
/admin/settings            # System settings: timezone, locale, defaults
/admin/settings/integrations  # Payment gateways, APIs, webhooks
/admin/settings/security   # Password policies, 2FA requirements, session config
/admin/roles               # Role definitions and permission editing
/admin/audit-log           # System-wide audit log viewer
/admin/backup              # Backup management: trigger, schedule, restore
/admin/analytics           # Cross-location analytics and comparison
/admin/reports             # Global report generation
/admin/notifications       # Global announcement composition
```

### Dependencies on Other Items
- Phase 2 (design system components)
- Phase 3 (auth + RBAC)
- Phase 4 (core APIs — at least 50% complete)

### Success Criteria
```
[ ] Dashboard: global KPIs with cross-location comparison charts
[ ] Locations: CRUD for all gym locations
[ ] Users: search, filter, create, edit, deactivate all user types
[ ] Settings: system-wide configuration forms
[ ] Integrations: payment gateway config, API key management
[ ] Roles: view and edit role permissions matrix
[ ] Audit Log: filterable, searchable, exportable log viewer
[ ] Backup: manual trigger, schedule config, restore verification
[ ] Analytics: cross-location charts with drill-down
[ ] Reports: generate and schedule global reports
[ ] Responsive: works on laptop and desktop (admin typically doesn't use mobile)
[ ] All screens: loading skeletons, error boundaries, empty states
```

### Estimated Effort
8-10 days

### LLM Agent Launch Prompt

```
Implement the Admin screens for OhMyGold webapp.

CONTEXT: Admin is the system superuser with full access. Screens must handle large datasets (all users, all locations) with search, filter, and pagination.

TASK: Create all admin screens in apps/web/src/pages/admin/:

1. Dashboard (admin/dashboard):
   - Global KPI cards: total members, total revenue, active locations, staff count
   - Cross-location revenue comparison (bar chart)
   - Member growth trend (line chart)
   - Recent activity feed
   - System health indicators

2. Locations (admin/locations/*):
   - List: all locations with status, member count, revenue
   - Create: form with address, contact, settings
   - Detail: stats, settings, staff list, operating hours
   - Deactivate with reason

3. Users (admin/users/*):
   - List: all users across all roles, searchable, filterable
   - Create: form with role, location, personal info
   - Detail: profile, activity, permissions
   - Actions: edit, deactivate, reset password, change role

4. Settings (admin/settings/*):
   - General: timezone, locale, language defaults
   - Security: password policy, 2FA requirements, session timeout
   - Integrations: Stripe keys, SendGrid, Twilio, webhook URLs
   - Notifications: global announcement composition
   - Backup: schedule, retention, manual trigger

5. Audit Log (admin/audit-log):
   - Filterable table: event type, user, date range
   - Export to CSV
   - Detail view per event

REQUIREMENTS:
- Use design system components exclusively
- Data tables with search, filter, sort, pagination
- Forms with validation (Zod schemas)
- Responsive: works at 1280px+ (admin primarily desktop)
- Loading states on all data-dependent elements
- Error boundaries on every page
- French and English labels

FILES TO CREATE:
- apps/web/src/pages/admin/dashboard.tsx
- apps/web/src/pages/admin/locations/index.tsx
- apps/web/src/pages/admin/locations/[id].tsx
- apps/web/src/pages/admin/locations/new.tsx
- apps/web/src/pages/admin/users/index.tsx
- apps/web/src/pages/admin/users/[id].tsx
- apps/web/src/pages/admin/users/new.tsx
- apps/web/src/pages/admin/settings/index.tsx
- apps/web/src/pages/admin/settings/integrations.tsx
- apps/web/src/pages/admin/settings/security.tsx
- apps/web/src/pages/admin/roles.tsx
- apps/web/src/pages/admin/audit-log.tsx
- apps/web/src/pages/admin/backup.tsx
- apps/web/src/pages/admin/analytics.tsx
- apps/web/src/pages/admin/reports.tsx

VERIFICATION STEPS:
1. All admin routes load without errors
2. Dashboard shows KPIs from real data
3. User management: create, edit, deactivate users
4. Location management: CRUD operations
5. Audit log: filter and export
6. Settings: save and persist
7. All screens have French labels
8. Responsive at 1280px and 1920px

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Data tables implemented: ___
- Forms with validation: ___
- Any performance issues with large datasets: ___
```

---

## 5.2 Manager Screens

### Description and Scope
Implement the Manager screen set: location dashboard, member management, class scheduling, staff management, booking management, billing overview, POS, inventory, CRM, marketing campaigns, analytics, and reports. Manager sees only their assigned location's data.

### Why This Matters
Managers are the primary day-to-day operators. They manage staff, handle member issues, monitor revenue, and make operational decisions. These screens are the most-used in the platform by staff. Every workflow must be fast and intuitive.

### Screens to Implement
```
/manager/dashboard         # Location KPIs: members, revenue, occupancy, today's classes
/manager/members           # Member list: search, filter, enroll, manage
/manager/members/[id]      # Member profile with full details and actions
/manager/classes           # Class schedule: week grid, create, edit, cancel
/manager/classes/[id]      # Class detail with attendee list, attendance
/manager/bookings          # Booking management: list, override, waitlist
/manager/staff             # Staff list: employees and teachers at location
/manager/staff/[id]        # Staff profile with schedule and performance
/manager/billing           # Billing overview: invoices, payments, failed payments
/manager/pos               # Point of sale interface
/manager/inventory         # Inventory: stock, purchase orders, suppliers
/manager/crm               # CRM: leads, pipeline, follow-ups
/manager/marketing         # Campaigns: create, send, analytics
/manager/analytics         # Location analytics: trends, KPIs
/manager/reports           # Location reports: generate and schedule
/manager/settings          # Location settings: policies, hours, rules
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 3 (auth — manager role guard)
- Phase 4 (core APIs — 100% needed)

### Success Criteria
```
[ ] Dashboard: location KPIs, today's schedule, recent activity
[ ] Members: CRUD, enrollment wizard, profile management
[ ] Classes: schedule grid (week view), create recurring classes
[ ] Bookings: manage bookings, override capacity, promote waitlist
[ ] Staff: manage employees and teachers, view schedules
[ ] Billing: invoice list, payment tracking, failed payment handling
[ ] POS: full point of sale with cart and payment
[ ] Inventory: stock management, purchase orders
[ ] CRM: lead pipeline, follow-up scheduling
[ ] Marketing: campaign creation and analytics
[ ] Analytics: location-specific charts and trends
[ ] Reports: generate and schedule location reports
[ ] Settings: location-specific configuration
[ ] Responsive: works on tablet (common for managers on floor)
```

### Estimated Effort
10-12 days

### LLM Agent Launch Prompt

```
Implement the Manager screens for OhMyGold webapp.

CONTEXT: Manager is the primary day-to-day operator. Screens must handle all location operations. Tablet support is important (managers often use tablets on the gym floor).

TASK: Create all manager screens in apps/web/src/pages/manager/:

1. Dashboard (manager/dashboard):
   - Location KPIs: today's check-ins, active members, revenue, occupancy
   - Today's class schedule with enrollment counts
   - Recent member enrollments
   - Alerts: failed payments, low stock, upcoming renewals

2. Members (manager/members/*):
   - Member list with search, filter (status, plan, join date)
   - Enrollment wizard (reuse from Phase 4.3)
   - Member profile: personal, membership, attendance, payments
   - Actions: freeze, upgrade, cancel, send message

3. Classes (manager/classes/*):
   - Week view schedule grid
   - Create class (one-time or recurring)
   - Class detail with attendee list
   - Attendance tracking (check/noshow)
   - Cancel class with attendee notification

4. Bookings (manager/bookings):
   - List of all bookings with filters
   - Override capacity with reason
   - Promote from waitlist
   - Cancel bookings on behalf of member

5. Staff (manager/staff/*):
   - Staff list with role, status
   - Staff profile with schedule
   - Certifications with expiry alerts
   - Performance metrics

6. Billing (manager/billing):
   - Invoice list with status filters
   - Payment tracking
   - Failed payments with retry
   - Revenue summary

7. Settings (manager/settings):
   - Location policies
   - Operating hours
   - Booking rules
   - Cancellation policy
   - Notification preferences

REQUIREMENTS:
- Tablet-optimized (768px-1024px)
- Fast workflows (member lookup in < 3 seconds)
- All actions have confirmation dialogs
- Error handling with retry
- French and English

FILES TO CREATE: All manager screen files listed above

VERIFICATION STEPS:
1. All manager routes load
2. Dashboard shows location-specific data only
3. Member enrollment wizard works
4. Class schedule CRUD works
5. POS processes a test transaction
6. Tablet layout verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Tablet optimization: Yes/No
- Performance benchmarks: ___
```

---

## 5.3 Employee Screens

### Description and Scope
Implement the Employee screen set: check-in terminal, POS interface, daily class schedule, attendance taking, member lookup, and facility issue reporting. Employee screens are optimized for speed — large touch targets, minimal navigation, quick actions.

### Why This Matters
Employees work at the front desk in a fast-paced environment. They need to check in members quickly, process sales, and handle day-to-day operations. Screens must be optimized for touch and speed — not for browsing.

### Screens to Implement
```
/employee/dashboard        # Daily overview: check-ins, classes, tasks
/employee/check-in         # Check-in terminal: QR scan, manual search, member lookup
/employee/pos              # POS: product catalog, cart, payment
/employee/classes          # Today's classes: schedule, attendance
/employee/classes/[id]     # Class attendance: roster, check/noshov
/employee/members          # Member lookup: search, view profile
/employee/issues           # Facility issue reporting: photo, description, submit
/employee/schedule         # Personal work schedule
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 3 (auth — employee role guard)
- Phase 4 (check-in, POS, classes APIs)

### Success Criteria
```
[ ] Dashboard: daily summary, quick action buttons
[ ] Check-in: QR scan or manual search, validates membership, shows result in < 3s
[ ] POS: product catalog, cart, payment, receipt
[ ] Classes: today's schedule with enrollment counts
[ ] Attendance: roster list with large tap targets, mark present/absent
[ ] Member lookup: search by name/card/email, view profile
[ ] Issue reporting: photo upload, category, description, submit
[ ] Touch-optimized: large buttons, minimal scrolling
[ ] Fast: every action completes in < 3 seconds
[ ] Works on tablet (front desk terminal)
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement the Employee screens for OhMyGold webapp.

CONTEXT: Employee works at front desk. Screens optimized for speed and touch. Large touch targets, minimal navigation.

TASK: Create employee screens in apps/web/src/pages/employee/:

1. Dashboard (employee/dashboard):
   - Today's date and greeting
   - Quick stats: check-ins today, upcoming classes
   - Large quick-action buttons: Check-In, POS, Attendance
   - Recent notifications

2. Check-In (employee/check-in):
   - Large QR scan area (uses device camera)
   - Manual search: member name or card number
   - Member result: photo, name, membership status, expiry
   - Validation result: green (access) or red (denied with reason)
   - Recent check-ins list

3. POS (employee/pos):
   - Product grid with images and prices
   - Cart sidebar with items, quantities, total
   - Large payment buttons: Cash, Card
   - Receipt generation

4. Attendance (employee/classes → employee/classes/[id]):
   - Class roster with member names and photos
   - Large toggle buttons: Present / Absent
   - Auto-save on toggle
   - Attendance summary count

5. Issue Reporting (employee/issues):
   - Category selection: equipment, cleanliness, safety, other
   - Photo upload (camera or file)
   - Description textarea
   - Submit button
   - Issue list: submitted issues with status

REQUIREMENTS:
- Touch targets: minimum 56px
- Fast: < 3 second response time
- Tablet-optimized (front desk)
- Minimal navigation depth
- Large readable fonts
- Works offline (queue actions)

FILES TO CREATE:
- apps/web/src/pages/employee/dashboard.tsx
- apps/web/src/pages/employee/check-in.tsx
- apps/web/src/pages/employee/pos.tsx
- apps/web/src/pages/employee/classes/index.tsx
- apps/web/src/pages/employee/classes/[id].tsx
- apps/web/src/pages/employee/members.tsx
- apps/web/src/pages/employee/issues.tsx
- apps/web/src/pages/employee/schedule.tsx

VERIFICATION STEPS:
1. Check-in flow: scan → validate → result in < 3s
2. POS: add to cart → payment → receipt
3. Attendance: toggle present/absent → save
4. Issue report: photo + description → submit
5. Tablet touch targets verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Average check-in time: ___ seconds
- Touch target sizes: ___ px
```

---

## 5.4 Teacher Screens

### Description and Scope
Implement the Teacher screen set: personal schedule, class rosters with attendance taking, student/client progress tracking, class content management, substitution requests, and personal performance analytics. Teachers manage their classes and students.

### Why This Matters
Teachers are the face of Gold's Gym to members. Their experience directly impacts class quality and member retention. A smooth teacher interface for attendance, progress tracking, and communication improves the member experience.

### Screens to Implement
```
/teacher/dashboard         # Personal overview: today's classes, stats
/teacher/schedule          # Personal class schedule (week view)
/teacher/classes           # My classes: list and detail
/teacher/classes/[id]/attendance  # Attendance roster for specific class
/teacher/students          # Student list: my class attendees
/teacher/students/[id]     # Student profile with progress notes
/teacher/progress          # Progress tracking: notes, measurements
/teacher/substitutions     # Request and manage substitutions
/teacher/messages          # Message students
/teacher/analytics         # Personal performance: classes, attendance, ratings
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 3 (auth — teacher role guard)
- Phase 4 (classes, bookings, member APIs)

### Success Criteria
```
[ ] Dashboard: today's classes, quick stats, notifications
[ ] Schedule: personal week view with class times
[ ] Classes: list of assigned classes with details
[ ] Attendance: roster with quick mark present/absent, auto-save
[ ] Students: list of students from teacher's classes
[ ] Student profile: attendance history, progress notes
[ ] Progress tracking: notes, measurements, goals
[ ] Substitutions: request coverage, view pending requests
[ ] Messages: compose and send to class attendees
[ ] Analytics: classes taught, average attendance, ratings
[ ] Mobile-friendly (teachers often use phones/tablets)
```

### Estimated Effort
5-6 days

### LLM Agent Launch Prompt

```
Implement the Teacher screens for OhMyGold webapp.

CONTEXT: Teachers manage their classes and students. Need schedule, attendance, progress tracking, and substitution management.

TASK: Create teacher screens in apps/web/src/pages/teacher/:

1. Dashboard (teacher/dashboard):
   - Today's classes with times and enrollment
   - Quick stats: classes this week, total students
   - Substitution requests (pending)
   - Recent messages

2. Schedule (teacher/schedule):
   - Week view: personal class schedule only
   - Class cards with time, room, enrollment count
   - Tap to view details

3. Classes and Attendance (teacher/classes/*):
   - Class list with enrollment counts
   - Attendance roster: student name, photo, status toggle
   - Large tap targets for marking attendance
   - Auto-save, attendance summary
   - Add notes per student

4. Students (teacher/students/*):
   - List of students from teacher's classes
   - Student profile: attendance rate, progress notes
   - Add/edit progress notes
   - View attendance history

5. Substitutions (teacher/substitutions):
   - Request coverage: select class, select replacement, reason
   - View pending requests
   - Approve/decline incoming substitution requests
   - Substitution history

6. Messages (teacher/messages):
   - Compose message to class attendees
   - Send via push notification
   - Message history

7. Analytics (teacher/analytics):
   - Classes taught this month
   - Average attendance per class
   - Attendance trend chart
   - Member ratings

REQUIREMENTS:
- Mobile-friendly (teachers use phones)
- Attendance: mark in < 2 taps per student
- Substitutions: simple request/approve flow
- French and English

FILES TO CREATE: All teacher screen files

VERIFICATION STEPS:
1. Schedule shows only teacher's classes
2. Attendance: mark 20 students in < 1 minute
3. Substitution request and approval flow
4. Progress notes: add, edit, view
5. Mobile layout verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Attendance marking speed: ___ students/minute
- Substitution flow: ___
```

---

## 5.5 Client Web Screens

### Description and Scope
Implement the Client web screen set: personal dashboard, class booking, booking history, membership management, digital membership card, billing and payments, personal progress/stats, profile settings, and notification preferences. This is the member self-service portal.

### Why This Matters
Client web screens are the member self-service portal. Members book classes, view their membership, manage payments, and track progress. A polished client experience reduces support tickets and increases engagement. These screens also serve members who prefer web over mobile app.

### Screens to Implement
```
/client/dashboard          # Personal dashboard: upcoming classes, stats, quick actions
/client/book               # Class booking: schedule, filters, book
/client/bookings           # My bookings: upcoming, past, cancel
/client/membership         # Membership details: plan, status, history
/client/membership/change  # Upgrade/downgrade plan
/client/card               # Digital membership card with QR code
/client/billing            # Invoices and payments
/client/progress           # Personal stats: attendance, workouts, goals
/client/settings           # Profile, password, notifications, 2FA
/client/settings/profile   # Edit profile information
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 3 (auth — client role guard)
- Phase 4 (booking, membership, billing APIs)

### Success Criteria
```
[ ] Dashboard: upcoming classes, recent check-ins, membership status
[ ] Class booking: week schedule, filters, book in < 5 seconds
[ ] My bookings: upcoming list, cancel with reason
[ ] Membership: plan details, status, freeze/upgrade options
[ ] Digital card: QR code, membership info, display in fullscreen
[ ] Billing: invoice list, download PDF, payment method management
[ ] Progress: attendance stats, workout history, goal tracking
[ ] Settings: profile edit, password change, notification preferences
[ ] Responsive: works on desktop and mobile web
[ ] Fast: every action completes in < 3 seconds
```

### Estimated Effort
6-7 days

### LLM Agent Launch Prompt

```
Implement the Client web screens for OhMyGold.

CONTEXT: Client web screens are the member self-service portal. Must be polished, fast, and easy to use.

TASK: Create client screens in apps/web/src/pages/client/:

1. Dashboard (client/dashboard):
   - Welcome with name
   - Next booked class with countdown
   - Quick action buttons: Book Class, My QR Code, My Progress
   - Membership status card
   - Recent activity

2. Class Booking (client/book):
   - Week schedule with class cards
   - Filters: type, instructor, time
   - Class detail: description, instructor, capacity
   - Book button with confirmation
   - Booking confirmation toast

3. My Bookings (client/bookings):
   - Upcoming bookings list
   - Cancel with reason selection
   - Booking history
   - Add to calendar

4. Membership (client/membership):
   - Current plan with features
   - Status: active, frozen, expiring
   - Actions: freeze, upgrade, cancel
   - Membership history

5. Digital Card (client/card):
   - Full-screen QR code
   - Membership info
   - Barcode display option
   - Tap to enlarge

6. Billing (client/billing):
   - Invoice list with status
   - Download PDF
   - Payment methods: add, remove, set default
   - Payment history

7. Progress (client/progress):
   - Attendance stats: this month, total
   - Workout streak
   - Goal progress bars
   - Class history chart

8. Settings (client/settings/*):
   - Profile: edit personal info, upload photo
   - Password: change password
   - Notifications: toggle preferences
   - 2FA: enable/disable

REQUIREMENTS:
- Book class in < 5 seconds
- Responsive: mobile web friendly
- QR code: scannable at check-in
- French and English
- Loading skeletons on all data screens

FILES TO CREATE: All client screen files

VERIFICATION STEPS:
1. Book a class — confirmation in < 5s
2. Cancel booking — policy enforced
3. Display QR code — scannable
4. Download invoice PDF
5. Mobile web layout verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Booking time: ___ seconds
- Mobile web tested: Yes/No
```

---


#### Offline Implementation for Employee Check-In

The employee check-in screen must work offline (queue actions) for gym floor usage where WiFi may be spotty:

**1. Service Worker (Workbox):**
```typescript
// sw.ts — register workbox strategies
workbox.routing.registerRoute(
  '/api/v1/check-ins',
  new workbox.strategies.NetworkFirst({
    cacheName: 'check-ins-api',
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('check-in-queue', {
        maxRetentionTime: 24 * 60, // 24 hours (in minutes)
      }),
    ],
  }),
  'POST'
);
```

**2. IndexedDB Schema for Queued Check-Ins:**
```typescript
// db.ts — Dexie.js schema
const offlineDB = new Dexie('ohmygold-offline');
offlineDB.version(1).stores({
  checkInQueue: '++id, memberId, timestamp, synced, retryCount',
  // queued items: { memberId, qrCode, timestamp, locationId, status: 'pending'|'failed' }
});
```

**3. Background Sync API:**
```typescript
// Auto-upload queued check-ins when connection restored
navigator.serviceWorker.ready.then(reg => {
  reg.sync.register('sync-check-ins'); // One-shot background sync
});
```

**4. Conflict Resolution (server state changed during offline):**
| Scenario | Resolution |
|----------|-----------|
| Member checked in offline, already checked in online | Server deduplicates by (user_id, location_id, entry_time within 5 min) |
| Member cancelled membership while offline | Queue item fails on sync → show error toast "Membership inactive — check-in rejected" |
| Class was cancelled while offline | Queue item succeeds (check-in is independent of class booking) |

**5. Visual indicators:**
- Green dot: Online, syncing in real-time
- Yellow dot: Offline, items queued
- Queue badge: Shows count of pending check-ins
- Sync button: Manual trigger for immediate upload

## 5.6 Visitor Screens

### Description and Scope
Implement the Visitor screen set: gym showcase/landing page, class schedule browser, pricing/membership plan comparison, gym location finder, trial signup flow, and contact form. No authentication required. These screens convert visitors into members.

### Why This Matters
Visitor screens are the conversion funnel. Every visitor who signs up for a trial is a potential member. The showcase must communicate Gold's Gym's value proposition, display facilities and classes, and make trial signup frictionless. This is marketing + technology.

### Screens to Implement
```
/                          # Landing page: hero, features, testimonials
/classes                   # Public class schedule browser
/pricing                   # Membership plan comparison
/locations                 # Gym locations with map and details
/trial                     # Trial signup flow: form → confirmation
/contact                   # Contact form: name, email, message
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 4 (class schedule, membership plans APIs — public endpoints)

### Success Criteria
```
[ ] Landing page: hero with CTA, features, testimonials, Gold's Gym branding
[ ] Class browser: public schedule, filterable, no login required
[ ] Pricing: plan comparison with feature checklist, CTA to signup
[ ] Locations: list with map, hours, contact info
[ ] Trial signup: multi-step form, plan selection, confirmation
[ ] Contact form: name, email, phone, message → creates lead in CRM
[ ] No auth required for any visitor screen
[ ] SEO-optimized: meta tags, structured data
[ ] Fast load: < 2 seconds LCP
[ ] French and English
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement the Visitor screens for OhMyGold webapp.

CONTEXT: Visitor screens are the conversion funnel. Must be visually appealing, fast, and drive trial signups. No authentication required.

TASK: Create visitor screens:

1. Landing Page (/):
   - Hero: bold headline, CTA button ("Start Free Trial")
   - Features: key platform features with icons
   - Class categories showcase
   - Testimonials: member quotes
   - Gold's Gym France branding
   - Footer: links, social, contact

2. Class Browser (/classes):
   - Public class schedule (no login)
   - Week view with class cards
   - Filters: type, time, instructor
   - Class detail modal: description, instructor, intensity
   - CTA: "Join to book this class"

3. Pricing (/pricing):
   - Plan comparison table: Basic, Premium, Elite
   - Feature checklist per plan
   - Price display: "49,99 €/mois"
   - CTA buttons: "Start Trial" per plan
   - FAQ accordion

4. Locations (/locations):
   - Map with gym location pins
   - Location cards: address, hours, phone, amenities
   - Tap for directions
   - Photos of facilities

5. Trial Signup (/trial):
   - Multi-step form: personal info → plan selection → confirmation
   - No account creation required (or optional)
   - QR code generated for trial pass
   - Confirmation email sent
   - Lead created in CRM

6. Contact (/contact):
   - Contact form: name, email, phone, message
   - Submits to CRM as new lead
   - Gold's Gym contact info displayed

REQUIREMENTS:
- No auth required
- SEO: meta tags, Open Graph, structured data
- Fast: < 2s LCP
- French and English
- Mobile-first design
- Google Analytics / Meta Pixel ready

FILES TO CREATE:
- apps/web/src/pages/index.tsx (landing)
- apps/web/src/pages/classes.tsx
- apps/web/src/pages/pricing.tsx
- apps/web/src/pages/locations.tsx
- apps/web/src/pages/trial.tsx
- apps/web/src/pages/contact.tsx

VERIFICATION STEPS:
1. All pages load without auth
2. Class browser shows public schedule
3. Pricing comparison renders correctly
4. Trial signup creates lead in CRM
5. Lighthouse score: Performance > 90, SEO > 95
6. Mobile layout verified

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- Lighthouse score: ___
- Trial conversion flow tested: Yes/No
```

---

## 5.7 Shared Screens

### Description and Scope
Implement shared screens accessible to all authenticated users: login/registration (already in Phase 3.2), settings, notifications center, help/FAQ, and error pages (404, 403, 500). These screens provide common functionality regardless of role.

### Why This Matters
Shared screens are the glue that holds the experience together. Every user needs settings, notifications, and help. Error pages must be informative and guide users back to safety. Consistent shared screens reduce confusion.

### Screens to Implement
```
/login, /register, /forgot-password, /reset-password  # Auth screens (Phase 3)
/settings                # User settings (profile, password, notifications)
/notifications           # Notification center
/help                    # Help and FAQ
/404                     # Not found page
/403                     # Forbidden page
/500                     # Server error page
/maintenance             # Maintenance mode page
```

### Dependencies on Other Items
- Phase 2 (design system)
- Phase 3 (auth, profile management)

### Success Criteria
```
[ ] Settings: profile, password, notifications, 2FA, language
[ ] Notification center: list, mark as read, settings
[ ] Help/FAQ: searchable, categorized, contact support CTA
[ ] 404: friendly message, navigation options
[ ] 403: "Access Denied" with explanation, link to dashboard
[ ] 500: error message, retry button, contact support
[ ] Maintenance: branded maintenance page with estimated return time
[ ] All screens responsive and accessible
[ ] French and English
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Implement shared screens for OhMyGold webapp.

CONTEXT: Shared screens used by all authenticated users. Must be consistent and accessible.

TASK: Create shared screens:

1. Settings (/settings):
   - Profile tab: edit info, upload photo
   - Password tab: change password
   - Notifications tab: toggle email/push/SMS per event
   - Security tab: 2FA setup, active sessions
   - Language tab: switch French/English
   - Tabbed interface

2. Notification Center (/notifications):
   - List of all notifications
   - Group by date
   - Mark individual as read
   - Mark all as read
   - Click to navigate to relevant screen
   - Settings link

3. Help/FAQ (/help):
   - Search bar
   - Categories: Account, Booking, Billing, Classes, Technical
   - FAQ accordion items
   - Contact support: form or email link
   - French and English content

4. Error Pages:
   - 404: "Page not found", illustration, link to home
   - 403: "Access denied", explanation, link to dashboard
   - 500: "Something went wrong", retry button, support contact
   - Maintenance: "We'll be back soon", estimated time

REQUIREMENTS:
- Consistent layout with app shell
- Accessible: proper headings, landmarks
- Responsive
- French and English
- Error pages work even if app partially loaded

FILES TO CREATE:
- apps/web/src/pages/settings.tsx
- apps/web/src/pages/notifications.tsx
- apps/web/src/pages/help.tsx
- apps/web/src/pages/404.tsx
- apps/web/src/pages/403.tsx
- apps/web/src/pages/500.tsx
- apps/web/src/pages/maintenance.tsx

VERIFICATION STEPS:
1. Settings: all tabs work, changes persist
2. Notifications: mark as read, navigate
3. Help: search, categories, contact
4. Error pages: render correctly
5. Responsive on all breakpoints

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Screens created: ___
- FAQ items: ___
- Error pages tested: Yes/No
```

---

## Phase 5 Completion Checklist

```
[ ] 5.1 Admin screens: dashboard, users, locations, settings, audit, analytics
[ ] 5.2 Manager screens: dashboard, members, classes, bookings, POS, CRM, reports
[ ] 5.3 Employee screens: check-in, POS, attendance, member lookup, issues
[ ] 5.4 Teacher screens: schedule, attendance, students, substitutions, analytics
[ ] 5.5 Client screens: dashboard, booking, membership, card, billing, progress
[ ] 5.6 Visitor screens: landing, classes, pricing, locations, trial, contact
[ ] 5.7 Shared screens: settings, notifications, help, error pages
[ ] All screens: role guards active, correct data scope
[ ] All screens: responsive (xs to 2xl)
[ ] All screens: accessible (axe score >= 95)
[ ] All screens: French and English
[ ] All screens: loading skeletons, error boundaries, empty states
[ ] E2E tests: critical user journeys covered
[ ] Performance: LCP < 2s on all screens
```

---

*Phase 5 notes: Screen implementation is where users finally interact with OhMyGold. Use the design system components — do not create one-off styles. Every screen must handle loading, error, and empty states. Test on real devices, not just the browser. French text expansion is real — verify every label at its longest translation.*

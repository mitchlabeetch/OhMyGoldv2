# OhMyGold — Final Steering Document

> **Project:** OhMyGold — Gold's Gym France All-in-One Management & Client Solution
> **Version:** 1.0
> **Status:** FINAL
> **Date:** 2026-04-29
> **Purpose:** Constant reference for steering development. Synthesizes project brief, brand research, internet findings, and user persona analysis.

---

## Table of Contents

1. [Project Overview & Key Goals](#1-project-overview--key-goals)
2. [Key Instructions for Development Teams](#2-key-instructions-for-development-teams)
3. [Learnings from Internet Research](#3-learnings-from-internet-research)
4. [Learnings from HTML Source Pages](#4-learnings-from-html-source-pages)
5. [User Personas: Daily Needs & Workflows](#5-user-personas-daily-needs--workflows)
6. [Critical Decisions & Rationale Log](#6-critical-decisions--rationale-log)
7. [Open Questions & Dependencies](#7-open-questions--dependencies)
8. [Reference Documents](#8-reference-documents)

---

## 1. Project Overview & Key Goals

### Mission Statement
Build the **OhMyGold platform** — a unified web application and mobile application for Gold's Gym France that serves all stakeholders in the gym ecosystem: administrators, location managers, employees, coaches/teachers, paying clients, and prospective visitors.

### Primary Goals (Ranked)

| Rank | Goal | Success Metric |
|------|------|----------------|
| 1 | **Enable QR-code-based club access** — The sole entry method for all clubs | 100% of entries via app QR code |
| 2 | **Streamline subscription management** — Sign-up, upgrade, downgrade, cancellation | Self-service completion rate > 90% |
| 3 | **Support class booking & scheduling** — Arena (MMA, Hyrox), CrossZone, coached sessions | Booking completion in < 3 taps |
| 4 | **Provide workout & nutrition tracking** — Core brand promise integration | Daily active tracking users > 60% |
| 5 | **Deliver role-appropriate dashboards** — Each of 6 roles sees only what they need | Role-based feature coverage 100% |
| 6 | **Enable trial-to-member conversion** — Frictionless visitor experience | Trial conversion rate > 25% |

### Brand Foundation

Gold's Gym is the **world's most iconic fitness brand** — founded in 1965 by Joe Gold in Venice Beach, California. The French operation launched in 2025 with two flagship clubs (Thiais and Val d'Europe), combining 60 years of bodybuilding heritage with French fitness culture.

**Brand DNA Formula:**
> *Legendary Heritage (Venice Beach, 1965) + Premium Equipment + Inclusive Community + Digital Innovation = Gold's Gym France*

### Platform Architecture

| Platform | Primary Users | Key Characteristics |
|----------|--------------|-------------------|
| **Web App** | Admin, Manager, Employee, Coach | Desktop-first, data-rich dashboards, sidebar navigation |
| **Mobile App** | Client, Visitor, Employee (quick actions) | Bottom tabs, gesture-driven, QR code access, push notifications |

---

## 2. Key Instructions for Development Teams

### 2.1 Brand Color Canonical Value

The official Gold's Gym gold is **`#FFEC00`** — the PMS 3945 C digital equivalent. This is the canonical value for all design tokens, CSS variables, and theme objects.

- **Web CSS:** `--color-brand-gold: #FFEC00;`
- **Mobile Theme:** `color.brand.gold = '#FFEC00'`
- **Note:** The Gold's Gym France website CSS uses `#fedb00` for web rendering. Use `#FFEC00` as the source of truth; `#fedb00` is acceptable only for web-specific rendering optimizations.

### 2.2 Font Strategy

- **Marketing Website:** Uses "Acumin Pro" / "Acumin Pro ExtraCondensed" (from website CSS)
- **OhMyGold App:** Uses **Inter** — a deliberate departure chosen for open-source availability, weight range, and screen legibility
- **Monospace:** JetBrains Mono for data/numbers
- **Justification:** Documented in DESIGN.MD Section 3.1 and brand_docs/06_brand_identity_visual.md Section 3

### 2.3 Voice & Tone Rules (Non-Negotiable)

1. **Always "tu"** — Never "vous" in user-facing copy
2. **Lead with legacy** — Open with heritage, close with action
3. **Arena metaphors** — Frame workouts as battles and victories
4. **Three-part rhythm** — "X, Y, Z" structures are brand DNA (e.g., "Une vraie salle. Du vrai matos. De la vraie sueur.")
5. **French + English mix** — Certain English terms are brand-embedded ("FOLLOW THE LEGEND", "Home Training", "Best Seller")
6. **Never generic gym language** — Sound like Gold's Gym, not any other gym

### 2.4 Critical UX Constraints

- **QR code must work offline** — Cached credential-based generation for 24h
- **Thiais club is 24/7** — App must support all-hour QR generation
- **8-week cancellation notice** — Self-service via member portal with clear flow
- **14-day cooling-off period** — Legal requirement for all online subscriptions
- **French-first i18n** — All UI must render correctly in French before English
- **Two-club system** — Members can access both clubs; app must show both

### 2.5 Development Priorities (MVP Feature Order)

| Priority | Feature | Business Value |
|----------|---------|---------------|
| P0 | QR Code Access | Critical — only way to enter clubs |
| P0 | User Authentication & Roles | Foundation for all features |
| P1 | Subscription Management | Upgrade, downgrade, cancellation |
| P1 | Class Booking | Arena and CrossZone classes |
| P1 | Club Information | Hours, zones, amenities per location |
| P2 | Workout Tracking | Core brand promise |
| P2 | Nutrition Planning | Differentiator per brand messaging |
| P2 | Progress Photos | Posing room integration |
| P3 | Community Features | Social proof, challenges |
| P3 | Boutique/Shop | E-commerce integration |
| P3 | Fuel Bar Menu | In-app ordering potential |

---

## 3. Learnings from Internet Research

### 3.1 Gold's Gym Global Brand Position

Gold's Gym operates in **29+ countries** with **600+ locations** and **3+ million members**. The brand is built on:
- **60 years of bodybuilding heritage** (since 1965)
- **Arnold Schwarzenegger's training ground** — the most famous gym association in history
- **16 Mr. Olympia winners** trained at Gold's Gym
- **The Mecca** — self-proclaimed and widely recognized center of bodybuilding culture

### 3.2 French Fitness Market Context

- The French fitness market is **highly competitive** with major players (Basic-Fit, Keep Cool, Neoness) and boutique studios
- Gold's Gym France enters with **differentiation through heritage and premium positioning**
- Two initial locations in **Ile-de-France** (Paris metropolitan area) — Thiais (24/7) and Val d'Europe (near Disneyland)
- **QR code access** positions Gold's Gym as digitally advanced vs. competitors still using physical cards
- **Women-exclusive zone (Gold's Queen)** is a rare differentiator in the French market
- **Combat sports integration (Gold's Arena)** with MMA and Hyrox is unique among standard gyms

### 3.3 Competitive Intelligence (Resamania)

Resamania is a leading gym management software provider in Europe. Key competitive features observed:
- Multi-site & franchise management capabilities
- Integrated CRM and member retention tools
- Class booking and scheduling systems
- POS and inventory management
- Marketing automation and retention campaigns
- Branded member apps (white-label)
- Access control integration
- Billing and payment processing

**Implication for OhMyGold:** The platform must match or exceed these capabilities while differentiating through the Gold's Gym brand experience.

### 3.4 User Experience Best Practices (Fitness Apps)

Research into leading fitness apps reveals:
- **Quick access is everything** — Users want to open the app, scan QR, and enter in < 5 seconds
- **Dark mode is preferred** — Especially for gym environments with low lighting
- **Progress visualization drives retention** — Charts, streaks, and personal records keep users engaged
- **Social features increase frequency** — Friend activity, leaderboards, and challenges boost visits
- **Push notification timing matters** — Class reminders 1h before, workout reminders at scheduled times
- **Offline capability is essential** — Gym WiFi is often unreliable; core features must work offline

---

## 4. Learnings from HTML Source Pages

### 4.1 Gold's Gym France Homepage (`goldsgymfrance.fr`)

**Key extracts:**
> *"Tu veux pas juste t'entrainer. Tu veux faire partie de la legende."*
>
> *"Bien plus qu'une salle de sport, nous t'accompagnons dans l'atteinte de tes objectifs sportifs et nutritionnels pour que tu deviennes la meilleure version de toi-meme."*
>
> *"En 2025, Gold's Gym pose ses premiers halteres en France avec l'ouverture d'un club flagship a Paris. Conjuguons l'heritage legendaire de Venice Beach avec l'elegance francaise."*

**Learnings:**
- Brand voice uses **informal "tu"** exclusively
- **Nutrition is paired with fitness** — core brand promise
- **Founder member positioning** — exclusivity and being "first" is a key recruitment driver
- Hero section uses **dark background with gold accents** — validates design system direction

### 4.2 Subscription Page (`abonnements/`)

**Pricing verified:**
| Tier | Weekly | Monthly ~ |
|------|--------|-----------|
| Basic | EUR 7.99 | EUR 34.63 |
| Flex | EUR 9.99 | EUR 43.29 |
| Premium | EUR 10.99 | EUR 47.63 |

**Learnings:**
- All tiers: **no commitment, 8-week cancellation notice**
- Enrollment fees currently **waived** (promotion)
- **Coaching/PT is NOT included** in any tier — sold separately
- Hydromassage and body composition: Flex and Premium only
- Hyrox and MMA classes: Premium only
- Shareable card: Premium only (1 household member)

### 4.3 CGV (Terms & Conditions)

**Critical business rules:**
- Membership is **personal and non-transferable**
- **QR code is the sole access method** — no physical cards
- **Age requirement: 18+ only**
- First payment failure: EUR 8 penalty
- Second consecutive failure: **immediate termination**
- Clubs may modify tariffs with prior notice; members can cancel within 8 weeks if prices increase
- Medical cancellation requires registered mail + medical certificate

### 4.4 Training Zones Page (`nos-espaces/`)

**Seven zones confirmed:**
1. Gold's Iron Ground (Free Weights)
2. Gold's Pulse (Cardio)
3. Gold's Queen (Women-Only)
4. Gold's Arena (Combat Sports)
5. Gold's CrossZone (Functional Training)
6. Musculation Guidee (Machine Weights)
7. Posing Room

### 4.5 Cancellation Page (`resiliation/`)

**Process:** Online via member portal only (except medical which requires registered mail)
- 8-week minimum notice
- Member must pay all subscription fees during notice period
- Re-enrollment: pay current enrollment fee + outstanding amounts
- 14-day cooling-off period for online subscriptions (full refund)

### 4.6 Legal Information (`mentions-legales/`)

- Operating entity: **AGGF Exploitation SAS**
- Headquarters: 34 rue de la Belle Feuille, 92100 Boulogne-Billancourt
- SIRET: 934 958 547 R.C.S. Nanterre
- Share capital: 100 EUR

---

## 5. User Personas: Daily Needs & Workflows

### 5.1 Admin (All Locations)

**Profile:** System administrator with cross-location oversight. Manages user accounts, system configuration, and business-wide analytics.

**Daily Workflow:**
1. Reviews overnight system health and error logs
2. Monitors member signups, churn, and revenue across both clubs
3. Manages user accounts: creates Manager/Employee accounts, resets passwords
4. Configures system settings: pricing, promotion codes, global announcements
5. Reviews audit logs for SOC2 compliance (who accessed what, when)
6. Generates reports for executive team: revenue trends, member growth, class utilization

**Needs:**
- Real-time dashboards with drill-down capability
- Bulk user management (import/export CSV)
- System health monitoring with alerting
- Audit trail for all sensitive operations (GDPR/SOC2)
- Role-based permission configuration
- Cross-location comparison views

**Pain Points:**
- Data scattered across multiple tools
- Manual report generation
- No single source of truth for member data
- Compliance reporting is time-consuming

**Key App Features:**
- Dark mode default (long management sessions)
- Dense data tables with filtering/sorting
- Complex charts: revenue by location, membership trends, churn analysis
- Audit log viewer with search
- System health dashboard
- Bulk operations (export, role assignment)

---

### 5.2 Manager (Single Location)

**Profile:** Location manager responsible for day-to-day operations of one club (Thiais OR Val d'Europe). Manages staff, schedules, member satisfaction, and location P&L.

**Daily Workflow:**
1. Opens app: checks today's schedule — classes, staff shifts, expected foot traffic
2. Reviews overnight check-ins, new signups, cancellations
3. Manages class schedule: assigns coaches, adjusts capacity, cancels underbooked classes
4. Checks staff attendance and shift coverage
5. Reviews member feedback and complaints
6. End of day: exports attendance report, reviews revenue vs. targets

**Needs:**
- Single-location dashboard (not overwhelmed with cross-location data)
- Staff scheduling with drag-and-drop
- Class management: create, edit, assign instructors
- Member communication tools (broadcast announcements, targeted messages)
- Equipment tracking and maintenance scheduling
- Real-time occupancy indicators

**Pain Points:**
- Scheduling conflicts between coaches
- Last-minute member complaints require quick response
- Tracking equipment maintenance manually
- No visibility into real-time club occupancy

**Key App Features:**
- Light mode default (clean, professional)
- Drag-and-drop class calendar
- Staff shift planning with conflict detection
- Member list with search and filters
- Location-specific reports
- Announcement broadcasting

---

### 5.3 Employee (Day-to-Day Operations)

**Profile:** Front-desk staff and day-to-day operators. Handles check-ins, answers member questions, processes payments, and assists with basic member needs.

**Daily Workflow:**
1. Arrives at club, opens app, goes to check-in screen
2. Primary task: scans member QR codes at entry (target: < 3 seconds per check-in)
3. Answers member questions: "How do I book a class?", "Is the Arena free today?"
4. Processes new membership signups (walk-ins)
5. Handles payment issues: failed cards, upgrade requests
6. End of shift: reports any issues to manager via app

**Needs:**
- Ultra-fast QR code scanning
- Quick member lookup (by name, phone, or member ID)
- Simple POS interface for payments
- Ability to see today's class schedule at a glance
- Member profile quick view (subscription tier, status, notes)
- Incident reporting (equipment issues, member complaints)

**Pain Points:**
- Slow check-in process creates queues at peak hours
- Can't quickly verify member status (active/expended/suspended)
- No easy way to look up member information
- Manual payment processing is error-prone

**Key App Features:**
- Large, prominent scan button on home screen
- Search-first member lookup
- Today's class list with attendance counts
- Simplified POS with QR/barcode scanning
- Quick-action buttons for common tasks

---

### 5.4 Teacher / Coach

**Profile:** Fitness instructor, personal trainer, or class teacher. Leads group classes (MMA, Hyrox, CrossZone), provides personal training, and tracks member progress.

**Daily Workflow:**
1. Opens app, views "My Classes" for today
2. Pre-class: reviews roster, checks attendance from previous sessions
3. Class time: uses attendance tracker to mark members present/absent
4. Post-class: notes what was covered, assigns homework/progress targets
5. Reviews messages from members (questions, booking requests)
6. Updates member progress notes for personal training clients

**Needs:**
- Class roster with member photos for easy identification
- Attendance tracking with quick tap-to-mark
- Member progress tracking (workouts completed, goals, PRs)
- Messaging with members (in-app, not personal phone)
- Class preparation notes and equipment checklists
- Schedule visibility: my upcoming classes, substitutions needed

**Pain Points:**
- Taking attendance on paper is slow and error-prone
- No visibility into member progress across sessions
- Members contact coaches on personal phones (privacy issue)
- Can't easily see which members are new and need extra attention

**Key App Features:**
- Class roster with photo avatars
- Tap-to-mark attendance grid
- Per-member workout notes and progress tracking
- In-app messaging (coach↔member, not exposing personal numbers)
- Class preparation checklist
- Achievement badge assignment

---

### 5.5 Client (Gym Subscriber)

**Profile:** Paying gym member. Visits the gym 2-5 times per week. Uses the app for entry, class booking, workout tracking, and progress monitoring.

**Daily Workflow (Gym Day):**
1. Opens app to generate QR code for club entry
2. Checks today's class schedule — any interesting classes?
3. Books a class (Arena MMA at 18:00) with 2 taps
4. At gym: scans QR at turnstile, enters
5. During workout: logs exercises, sets, reps
6. Post-workout: checks progress — weight lifted this week vs. last week
7. Orders a recovery smoothie from Fuel Bar via app
8. Checks body composition stats (if Flex/Premium tier)

**Daily Workflow (Non-Gym Day):**
1. Opens app to check upcoming class bookings
2. Reviews workout history and progress charts
3. Checks nutrition plan and logs meals
4. Browses community challenges and leaderboards
5. Receives push notification: "Ton cours de MMA commence dans 1h"

**Needs:**
- Instant QR code generation (even offline)
- Easy class discovery and booking
- Workout logging with exercise library
- Progress visualization (charts, streaks, personal records)
- Nutrition tracking integrated with workouts
- Body composition history (if tier allows)
- Social features: challenges, friend activity
- In-app Fuel Bar ordering
- Membership management (view tier, upgrade, cancellation)

**Pain Points:**
- QR code fails when gym WiFi is weak
- Booking a class takes too many taps
- Can't see real-time club occupancy before leaving home
- No way to track progressive overload over time
- Nutrition and workout data are in separate apps

**Key App Features:**
- Dark mode option (gold accents feel premium)
- Bottom tabs: Home, Classes, Progress, Profile
- Quick QR code widget (accessible in < 2 seconds)
- Visual class cards with instructor photo
- Workout logger with exercise library
- Progress charts and achievement badges
- Community challenges and leaderboards
- Push notifications for class reminders and achievements

---

### 5.6 Visitor (Prospect / Demo)

**Profile:** Non-member considering joining Gold's Gym. Has heard about the brand, seen advertising, or been referred by a friend. Wants to explore before committing.

**Daily Workflow:**
1. Downloads app or visits web landing page
2. Browses gym showcase: photos, videos, equipment highlights
3. Compares membership tiers (Basic/Flex/Premium)
4. Books a trial session (seance d'essai) at preferred club
5. Visits gym for trial: experiences facilities, meets staff
6. Receives follow-up: push notification or email with membership offer
7. Converts to member OR receives nurturing communications

**Needs:**
- Immersive gym showcase (high-quality photos/videos)
- Clear membership comparison (what's included at each tier)
- Frictionless trial booking (no account creation required)
- Trust signals: testimonials, member count, years established
- Clear pricing with no hidden fees
- Easy conversion path from trial to member

**Pain Points:**
- Can't get a feel for the gym without visiting
- Membership tiers are confusing (what's included?)
- Trial booking requires too much information
- No follow-up after trial visit

**Key App Features:**
- Light mode, bright, welcoming design
- Minimal navigation: Explore, Plans, Trial Signup
- Photo/video gallery with equipment highlights
- Interactive membership tier comparison
- One-tap trial booking (minimal info required)
- Prominent "Join" CTA after trial completion

---

## 6. Critical Decisions & Rationale Log

| # | Decision | Rationale | Impact |
|---|----------|-----------|--------|
| 1 | **Inter over Acumin Pro** | Open-source availability, broader weights, better screen rendering | Easier licensing, superior developer experience |
| 2 | **Dark mode default for Admin/Client** | Admin: long sessions, eye strain. Client: gym lighting, premium feel | Better UX for primary user segments |
| 3 | **QR code (not NFC/bluetooth) for access** | Brand specification: "un controle d'acces par code QR sera utilise" | Simpler implementation, wider device compatibility |
| 4 | **React Native with Expo for mobile** | Cross-platform efficiency, shared web components via RN Web | Faster development, code reuse |
| 5 | **Three-tier subscription model** | Matches Gold's Gym France offering exactly | Accurate business logic |
| 6 | **French-first i18n** | French market default; all UI must work in French first | Regulatory and market alignment |
| 7 | **Role-based UI (6 roles)** | Each role has fundamentally different needs and workflows | Clean, focused interfaces per user type |
| 8 | **PMS 3945 C (#FFEC00) as canonical gold** | Official brand specification | Consistent brand representation |
| 9 | **Offline QR generation** | Thiais is 24/7; gym WiFi is unreliable | Uninterrupted club access |
| 10 | **Separate coaching/PT from memberships** | Website clearly separates these; over-promising causes churn | Accurate feature representation |

---

## 7. Open Questions & Dependencies

### For Backend Team
| # | Question | Blocking? | Target Resolution |
|---|----------|-----------|-------------------|
| 1 | Server-side error message format standardization | Yes (Section 5.2) | 2026-05-06 |
| 2 | Timezone handling strategy (Europe/Paris default?) | Medium (Section 8.3) | 2026-05-06 |
| 3 | QR code generation algorithm (HMAC/JWT?) | Yes (access feature) | 2026-05-06 |
| 4 | Payment processor integration (Stripe? Adyen?) | Yes (subscriptions) | 2026-05-13 |
| 5 | Push notification service (FCM + APNS architecture) | No (post-MVP enhancement) | 2026-05-20 |

### For Product/Design Team
| # | Question | Blocking? | Target Resolution |
|---|----------|-----------|-------------------|
| 1 | Translation management tool selection | Medium (Section 8.6) | 2026-05-13 |
| 2 | Class booking capacity rules (waitlist? overbooking?) | Yes (class feature) | 2026-05-06 |
| 3 | Trial session → member conversion flow design | No (P2 feature) | 2026-05-13 |
| 4 | Community/social features scope (leaderboards? friends?) | No (P3 feature) | 2026-05-20 |
| 5 | Fuel Bar ordering integration (POS API?) | No (P3 feature) | 2026-05-20 |

### For Client/Business
| # | Question | Blocking? | Target Resolution |
|---|----------|-----------|-------------------|
| 1 | Exact public transport info for both clubs | No (locations page) | 2026-05-06 |
| 2 | Club phone numbers for public display | No (locations page) | 2026-05-06 |
| 3 | Parking details (free/paid) for both locations | No (locations page) | 2026-05-06 |
| 4 | Marketing integration (email campaigns, push content) | No (P3 feature) | 2026-05-20 |
| 5 | Equipment brand inventory per location | No (documentation) | 2026-05-13 |

---

## 8. Reference Documents

### Core Design & Brand Documents

| Document | Path | Purpose |
|----------|------|---------|
| **Design System** | `DESIGN.MD` | Complete design tokens, components, accessibility, i18n |
| **Brand Identity Visual** | `brand_docs/06_brand_identity_visual.md` | Colors, typography, logo, imagery, animation |
| **Brand Philosophy** | `brand_docs/01_philosophy.md` | Heritage, values, voice, positioning |
| **Brand Offers** | `brand_docs/02_offers.md` | Subscriptions, pricing, CGV, cancellation |
| **Brand Locations** | `brand_docs/03_locations.md` | Club addresses, hours, amenities, access |
| **Brand Zones** | `brand_docs/04_zones_equipment.md` | Training zones, equipment, facility features |
| **Brand Wording** | `brand_docs/05_wording.md` | Voice, taglines, terminology, content patterns |
| **Summary Report** | `brand_docs/00_summary_report.md` | Executive summary & app design insights |
| **This Document** | `brand_docs/07_steering_document.md` | Steering reference, personas, decisions |

### Asset Documentation

| Document | Path | Purpose |
|----------|------|---------|
| **Asset Manifest** | `assets/ASSET_MANIFEST.md` | All 91 assets with formats, sizes, quality notes |
| **Usage Guidelines** | `assets/USAGE_GUIDELINES.md` | Logo rules, responsive images, dark mode handling |

### Source HTML Archives

| Page | File | Content Extracted |
|------|------|-------------------|
| Gold's Gym France Homepage | `Gold's Gym France | Enseigne...` | Brand voice, hero text, philosophy |
| Gold's Gym International | `Gold's Gym: The Original...` | Global brand information |
| Brand Page | `La Marque Gold's Gym...` | Heritage, franchise info, history |
| Subscriptions | `Abonnements | golds-gym...` | Pricing tiers, membership terms |
| Training Zones | `Les espaces de nos salles...` | Zone descriptions, equipment |
| Terms & Conditions | `CGV | golds-gym...` | Legal terms, cancellation rules |
| Legal Notices | `Mentions legales...` | Entity info, SIRET, hosting |
| Privacy Policy | `Politique de confidentialite...` | GDPR compliance |
| Cancellation | `Resiliation | golds-gym...` | Cancellation process |
| Contact | `Contact | golds-gym...` | Contact forms, club info |

---

*End of OhMyGold Steering Document v1.0*

*This document is a living reference. Update it as decisions are made, questions are resolved, and new learnings emerge. All downstream teams (Teams 2-5) should treat this as their primary orientation document.*

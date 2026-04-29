# OhMyGold - Role-Based UI Specifications

## Document Control
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Final |
| Methodology | Role-based UX design with persona-driven interface customization |
| Coverage | 6 roles with complete UI specifications |

---

## Design System Foundations

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #D4A843 | Gold brand color, CTAs, active states |
| Primary Dark | #B8923A | Hover states, emphasis |
| Secondary | #1A1A2E | Dark backgrounds, admin panels |
| Success | #22C55E | Check-ins, payments success, active |
| Warning | #F59E0B | Capacity alerts, expiration warnings |
| Danger | #EF4444 | Errors, cancellations, failed payments |
| Info | #3B82F6 | Informational badges, links |
| Neutral | #6B7280 | Secondary text, borders, disabled |

### Typography Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 32px | 700 | Dashboard headers, KPI numbers |
| H1 | 24px | 700 | Page titles |
| H2 | 20px | 600 | Section headers, card titles |
| H3 | 16px | 600 | Sub-sections, list items |
| Body | 14px | 400 | Standard text, descriptions |
| Small | 12px | 400 | Captions, timestamps, badges |
| Micro | 10px | 500 | Labels, tags, status indicators |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| XS | 4px | Icon padding, tight gaps |
| SM | 8px | Inline spacing, badge padding |
| MD | 16px | Card padding, section gaps |
| LG | 24px | Page padding, section separators |
| XL | 32px | Dashboard widget gaps |
| XXL | 48px | Page section breaks |

---

## 1. Admin UI Specifications

### Role Accent Color
**#9B59B6 (Purple)** — Signals authority, distinct from all other roles. Purple conveys system-level access.

### Data Density
**Very Dense** — Admin needs maximum information per screen. Compact tables, multi-column dashboards, minimized whitespace. Target: 80%+ viewport utilization.

### Default View
**Global Dashboard** — Cross-location KPI summary with system health status, recent alerts, and quick-action tiles.

### Primary Navigation Items (Left Sidebar)

| Icon | Label | Sub-items | Badge Logic |
|------|-------|-----------|-------------|
| LayoutDashboard | Dashboard | Overview, System Health, Alerts | Alert count (critical only) |
| Users | User Management | Admins, Managers, Employees, Teacher/Coaches, Clients, Visitors | Pending approval count |
| MapPin | Locations | All Locations, Location Comparison | Issues flagged count |
| CreditCard | Billing | Invoices, Payments, Refunds, Reports | Failed payments count |
| Dumbbell | Classes | Class Types, Schedules, Room Allocation | Cancellation alerts |
| Target | CRM | Leads, Pipeline, Follow-ups, Conversions | Follow-ups due today |
| Megaphone | Marketing | Campaigns, Announcements, Automations, Segments | Campaigns pending approval |
| ScanLine | Access Control | Entry Logs, Capacity Monitor, Card Management | Active alerts |
| ShoppingCart | POS & Inventory | Products, Stock, Purchase Orders, Suppliers | Low stock count |
| BarChart3 | Analytics | Dashboards, Reports, KPIs, Trends, Comparisons | Scheduled reports ready |
| FileText | Content | App Content, Class Descriptions, Promotions, Documents | — |
| Settings | System Settings | Global Config, Integrations, Templates, Backups, Audit Logs, Security | Backup/critical alerts |

### Home Dashboard Widgets

| Widget | Position | Size | Data Refresh |
|--------|----------|------|-------------|
| Cross-Location Revenue Chart | Top-left | 2x1 | Every 15 min |
| System Health Status | Top-right | 1x1 | Real-time |
| Critical Alerts Feed | Middle-left | 1x2 | Real-time |
| New Signups (24h) | Middle-center | 1x1 | Every 30 min |
| Failed Payments | Middle-right | 1x1 | Every 15 min |
| User Management Activity | Bottom-left | 2x1 | Every 30 min |
| Location Status Map | Bottom-right | 1x1 | Every 5 min |

### Quick Actions (Floating Action Button / Top Bar)
1. **Add User** — Dropdown: Admin, Manager, Employee, Teacher/Coach, Client
2. **Send Announcement** — Compose modal
3. **View Audit Log** — Direct to filtered log
4. **System Health** — Status overlay

### Search Scope
**Global** — Can search across all users (all types), all locations, all transactions, all system logs. Federated search with type filters.

### Notification Badge Logic
- **Red badge**: Critical alerts (security, payment gateway down, backup failure)
- **Orange badge**: Warnings (failed payments, user lockouts)
- **Blue badge**: Information (new signups, scheduled reports)
- Badge count caps at "99+" for overflow

### Settings Available
- Global system configuration
- Security policies (password, 2FA, session timeout)
- Integration management (payment gateways, APIs)
- Notification template editor
- Backup schedule and manual trigger
- Audit log retention policies
- Role and permission definitions
- Branding and theme settings

---

## 2. Manager UI Specifications

### Role Accent Color
**#E74C3C (Red)** — Signals operational urgency and leadership. Red draws attention to action items.

### Data Density
**Medium-Dense** — Manager needs comprehensive but scannable information. Cards with key metrics, expandable details. Target: 60-70% viewport utilization.

### Default View
**Location Dashboard** — Today's snapshot: attendance, revenue target, staff on duty, upcoming classes, active alerts.

### Primary Navigation Items (Left Sidebar)

| Icon | Label | Sub-items | Badge Logic |
|------|-------|-----------|-------------|
| LayoutDashboard | Dashboard | Overview, Today, This Week, Alerts | Total active alerts |
| Users | Staff & Clients | Employees, Teacher/Coaches, Client Directory, Visitors | Pending tasks |
| Dumbbell | Classes & Schedule | Class Types, Schedule, Rooms, Bookings | Classes needing coach |
| CreditCard | Billing & POS | Invoices, Payments, Refunds, POS, Daily Close | Failed payments today |
| Target | CRM & Sales | Leads, Pipeline, Follow-ups, Online Joining | Follow-ups due today |
| Megaphone | Marketing | Campaigns, Announcements, Automations | Draft campaigns |
| ScanLine | Access Control | Entry Logs, Capacity, Cards | Capacity alerts |
| ShoppingCart | Inventory | Products, Stock, Purchase Orders, Suppliers | Low stock items |
| BarChart3 | Reports | Revenue, Attendance, Sales, Memberships | — |
| MapPin | Facility | Zones, Equipment, Settings, Policies | Equipment issues |
| FileText | Content | App Content, Class Descriptions, Promotions | — |
| Settings | Settings | Location Settings, Notifications, My Profile | — |

### Home Dashboard Widgets

| Widget | Position | Size | Data Refresh |
|--------|----------|------|-------------|
| Today's Revenue vs Target | Top-left | 1x1 | Every 15 min |
| Current Occupancy | Top-center | 1x1 | Real-time |
| Active Follow-ups | Top-right | 1x1 | Every 30 min |
| Today's Schedule | Middle-left | 2x1 | Every 15 min |
| Staff on Duty | Middle-center | 1x1 | Every 30 min |
| Recent Alerts | Middle-right | 1x1 | Real-time |
| New Signups This Week | Bottom-left | 1x1 | Daily |
| Equipment Issues | Bottom-center | 1x1 | Real-time |
| Lead Pipeline | Bottom-right | 1x1 | Every 30 min |

### Quick Actions (Floating Action Button)
1. **Enroll Member** — Membership flow
2. **Process Sale** — POS interface
3. **Report Issue** — Photo-based reporter
4. **Send Announcement** — Quick composer
5. **Take Attendance** — If next class imminent

### Search Scope
**Location-Scoped** — Can search clients, staff, classes, transactions, and products within their assigned location only. Cross-location search is disabled.

### Notification Badge Logic
- **Red badge**: Staff no-shows, critical equipment failures, capacity breach
- **Orange badge**: Failed payments, leads requiring follow-up, equipment issues
- **Blue badge**: New online enrollment, daily summary ready
- Badges reset when viewed (not when resolved)

### Settings Available
- Location configuration (hours, address, contact)
- Location policies (cancellation, booking window, check-in rules)
- Notification preferences (which alerts to receive)
- Push notification template editor (location-specific)
- Staff schedule defaults
- POS settings and discount limits
- Personal profile and password
- Two-factor authentication

---

## 3. Employee UI Specifications

### Role Accent Color
**#3498DB (Blue)** — Signals reliability, service, and trustworthiness. Blue is approachable and professional.

### Data Density
**Low-Medium** — Employee interface prioritizes speed and clarity over density. Large touch targets, minimal text, high contrast. Target: 40-50% viewport utilization.

### Default View
**Check-In Terminal** — Large search/scan field front and center, today's schedule sidebar, occupancy counter.

### Primary Navigation Items (Bottom Tab Bar for Mobile, Left Sidebar for Desktop)

| Icon | Label | Purpose | Badge Logic |
|------|-------|---------|-------------|
| ScanLine | Check-In | Primary check-in interface | — |
| Clipboard | Attendance | Today's classes with rosters | Classes starting within 30 min |
| ShoppingCart | POS | Product sales interface | — |
| Users | Members | Client lookup and assistance | — |
| Camera | Issues | Report facility/equipment issues | — |

### Home Dashboard Widgets (Check-In Screen)

| Widget | Position | Size | Data Refresh |
|--------|----------|------|-------------|
| Search/Scan Field | Top-center | Full width | Always active |
| Current Occupancy | Top-right | Compact | Real-time |
| Today's Schedule | Right sidebar | 1x3 | Every 15 min |
| Recent Check-Ins | Main area | Scrollable list | Real-time |
| Quick Stats (shift) | Bottom | Compact bar | Every 15 min |

### Quick Actions (Floating Action Button on Attendance Tab)
1. **Scan QR** — Camera scanner mode
2. **Manual Entry** — Type member name/ID
3. **View Roster** — Next class attendee list
4. **Report Issue** — Photo + description

### Search Scope
**Location-Scoped, Limited** — Can search clients by name, phone, email, or membership ID within their location. Can search products for POS. Cannot search staff details, financial data, or system settings.

### Notification Badge Logic
- **Orange badge**: Class starting soon (attendance needed)
- **Blue badge**: Manager announcements, issue resolution updates
- **No red badges** — Escalations go to Manager, not Employee
- Badges are dismissible and time-based (class badge disappears after class start)

### Settings Available
- Personal profile (name, photo, contact)
- Notification preferences
- App theme (light/dark)
- Password change
- Biometric login toggle
- Language selection

---

## 4. Teacher/Coach UI Specifications

### Role Accent Color
**#2ECC71 (Green)** — Signals health, fitness, growth, and positivity. Green aligns with wellness and coaching.

### Data Density
**Low-Medium** — Teacher/Coaches need glanceable information between classes. Large text, generous spacing, minimal cognitive load. Target: 45-55% viewport utilization.

### Default View
**My Schedule** — Calendar view of upcoming classes with next-class highlight and quick attendance link.

### Primary Navigation Items (Bottom Tab Bar)

| Icon | Label | Purpose | Badge Logic |
|------|-------|---------|-------------|
| Calendar | My Schedule | Personal class calendar | Classes today |
| Users | Attendance | Class rosters and attendance | Next class attendee count |
| MessageSquare | Messages | Member and staff messages | Unread message count |
| TrendingUp | My Stats | Personal performance analytics | Weekly summary available |
| User | Profile | Coach profile, availability, settings | Substitution requests |

### Home Dashboard Widgets

| Widget | Position | Size | Data Refresh |
|--------|----------|------|-------------|
| Next Class Card | Top | Full width | Real-time countdown |
| Today's Classes | Upper-mid | Scrollable row | Every 30 min |
| Weekly Overview | Middle | Calendar strip | Daily |
| Messages Preview | Lower-mid | 3 recent items | Real-time |
| Quick Stats | Bottom | Compact bar | Daily |

### Quick Actions (Floating Action Button)
1. **Take Attendance** — For next/upcoming class
2. **Request Sub** — Substitution request form
3. **Add Note** — Client progress note
4. **Message Class** — Send message to attendees

### Search Scope
**Self-Scoped** — Can search their own class history, their own client roster, and class content library. Cannot search gym-wide client database or other coaches' data.

### Notification Badge Logic
- **Red badge**: Class cancelled or room changed (urgent)
- **Orange badge**: Substitution requests pending response
- **Blue badge**: New booking in their class, new member message
- **Green badge**: Weekly stats summary available
- Badges persist until explicitly dismissed

### Settings Available
- Coach profile (bio, photo, specialties, certifications)
- Availability calendar (recurring + exceptions)
- Notification preferences (class reminders, sub requests, messages)
- Class content library management
- Password and security
- Biometric login toggle
- Connected calendar integration (Google/Outlook)

---

## 5. Client UI Specifications

### Role Accent Color
**#D4A843 (Gold — Brand Primary)** — Client uses the brand's primary gold color. Premium, aspirational, and member-focused.

### Data Density
**Sparse** — Client UI prioritizes aesthetics, motivation, and ease of use. Large imagery, breathing room, motivational design. Target: 35-45% viewport utilization.

### Default View
**Home Feed** — Next class highlight, quick book section, personalized recommendations, gym announcements.

### Primary Navigation Items (Bottom Tab Bar)

| Icon | Label | Purpose | Badge Logic |
|------|-------|---------|-------------|
| Home | Home | Dashboard feed, next class, quick actions | Upcoming class reminder |
| Search | Explore | Class schedule, filters, discovery | New classes added |
| Ticket | My Card | Digital membership card with QR | Membership status |
| Calendar | My Bookings | Upcoming and past bookings | Pending waitlist count |
| User | Profile | Account, settings, stats, payments | Payment issues |

### Home Dashboard Widgets

| Widget | Position | Size | Data Refresh |
|--------|----------|------|-------------|
| Next Class Countdown | Top | Full width, prominent | Real-time |
| Quick Book Strip | Upper-mid | Horizontal scroll | Daily |
| Attendance Streak | Middle-left | Compact card | Daily |
| This Week Overview | Middle-right | Mini calendar | Daily |
| Gym Announcement | Lower-mid | Single card | When posted |
| Promo / Motivation | Bottom | Banner card | Weekly rotation |

### Quick Actions (Floating Action Button on Home Tab)
1. **Book Class** — Opens explore with today's schedule
2. **My QR Code** — Full-screen membership card
3. **Check In** — GPS + QR check-in flow

### Search Scope
**Public Data Only** — Can search public class schedules, coach profiles, and gym information. Cannot search other members, staff details, or financial records. Search is filtered to their assigned location.

### Notification Badge Logic
- **Red badge**: Payment failed, membership expiring soon
- **Orange badge**: Class changed/cancelled, waitlist status update
- **Blue badge**: Booking confirmed, class reminder, new announcement
- **Green badge**: Achievement unlocked, workout milestone
- Badge on app icon shows total unread count
- In-app badge on specific tabs shows tab-relevant counts

### Settings Available
- Profile (name, photo, contact info, emergency contact)
- Subscription management (view, upgrade, freeze, cancel)
- Payment methods (add, edit, remove cards)
- Notification preferences (push categories, quiet hours)
- Privacy settings (profile visibility, data sharing)
- Connected apps (Apple Health, Google Fit, Strava)
- Password and security (2FA, biometric login)
- Help & support (FAQ, contact support)
- Data export (GDPR request)

---

## 6. Visitor UI Specifications

### Role Accent Color
**#F39C12 (Amber/Orange)** — Signals opportunity, warmth, and invitation. Orange is energetic and encourages action (signup).

### Data Density
**Very Sparse** — Visitor UI is marketing-focused. Large imagery, minimal text, clear CTAs. Every screen drives toward conversion. Target: 30-40% viewport utilization.

### Default View
**Gym Showcase** — Hero image of the gym, value proposition headline, prominent "Start Free Trial" CTA, preview of offerings.

### Primary Navigation Items (Bottom Tab Bar, Minimal)

| Icon | Label | Purpose |
|------|-------|---------|
| Home | Discover | Gym showcase, hero, CTAs |
| Search | Classes | Browse schedule (view-only) |
| Tag | Pricing | Subscription plans and pricing |
| User | Account | Trial account, settings |

### Home Dashboard Widgets

| Widget | Position | Size |
|--------|----------|------|
| Hero Image / Video | Top | Full width, 40% height |
| "Start Your Trial" CTA | Below hero | Full width, prominent button |
| Class Preview Strip | Middle | Horizontal scroll, 3-4 cards |
| Coach Spotlight | Lower-mid | Featured coach card |
| Social Proof | Bottom | Member count, testimonial carousel |
| Plan Teaser | Bottom | Pricing peek with "See All Plans" link |

### Quick Actions (Persistent Bottom Bar)
1. **Start Free Trial** — Primary CTA, always visible
2. **Book a Tour** — Contact form for in-person visit
3. **Call Us** — Direct phone dial
4. **View Plans** — Pricing page

### Search Scope
**Public Only** — Can search public class schedules, coach profiles, and plan information. All search results are read-only and marketing-oriented.

### Notification Badge Logic
- **Orange badge**: Trial expiring soon
- **Blue badge**: Trial reminder, new promotion
- **No red badges** — Visitors don't have critical system access
- Badges are promotional/conversion-focused only

### Settings Available
- Trial account profile (name, email, phone)
- Notification preferences (marketing opt-in/out)
- Preferred gym location
- Fitness goals (for personalized recommendations)
- Referral code entry
- Contact preferences
- Delete trial account (pre-conversion)

---

## Cross-Role UI Comparison Matrix

| Property | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|----------|-------|---------|----------|---------|--------|---------|
| **Accent Color** | Purple | Red | Blue | Green | Gold | Amber |
| **Data Density** | Very Dense | Medium-Dense | Low-Medium | Low-Medium | Sparse | Very Sparse |
| **Nav Style** | Full sidebar | Full sidebar | Bottom tab + sidebar | Bottom tab | Bottom tab | Bottom tab (minimal) |
| **Default Screen** | Global Dashboard | Location Dashboard | Check-In Terminal | My Schedule | Home Feed | Gym Showcase |
| **Primary Action** | User mgmt | Revenue/Sales | Check-in | Attendance | Book class | Start trial |
| **Search Scope** | Global | Location-only | Location limited | Self-only | Public only | Public only |
| **Dark Mode Default** | Yes (dark sidebar) | No | No | No | User pref | No |
| **Font Size Base** | 13px | 14px | 15px | 15px | 16px | 16px |
| **Target Touch Size** | 36px | 40px | 48px | 44px | 48px | 52px |
| **Card Style** | Compact, no image | Standard, occasional image | Large touch targets | Friendly, spaced | Image-rich, premium | Full-bleed imagery |

---

## Notification Badge Rules (Global)

### Badge Color System

| Color | Meaning | Persistence |
|-------|---------|-------------|
| Red (#EF4444) | Requires immediate action | Until resolved |
| Orange (#F59E0B) | Requires attention soon | Until viewed or resolved |
| Blue (#3B82F6) | Informational | Until viewed |
| Green (#22C55E) | Positive/achievement | Until viewed |
| Grey (#6B7280) | Passive count | Dynamic |

### Badge Count Rules

```
IF critical_alerts > 0:
    badge_color = RED
    badge_count = critical_alerts
    badge_persistence = until_resolved

ELSE IF warnings > 0:
    badge_color = ORANGE
    badge_count = warnings
    badge_persistence = until_viewed

ELSE IF notifications > 0:
    badge_color = BLUE
    badge_count = notifications
    badge_persistence = until_viewed

badge_display = min(count, 99) + "+" if count > 99
```

---

## Responsive Behavior

### Admin & Manager (Desktop-First)

| Viewport | Layout |
|----------|--------|
| > 1280px | Full sidebar (220px) + multi-column dashboard |
| 1024-1280px | Collapsed sidebar (icons only) + 2-column layout |
| 768-1024px | Hidden sidebar (hamburger) + single column |
| < 768px | Mobile web view with simplified dashboard |

### Employee (Desktop at Front Desk, Tablet on Floor)

| Viewport | Layout |
|----------|--------|
| > 1024px | Full check-in terminal layout |
| 768-1024px | Split view (check-in + schedule) |
| < 768px | Mobile compact mode (scan-first) |

### Teacher/Coach/Coach/Coach, Client, Visitor (Mobile-First)

| Viewport | Layout |
|----------|--------|
| < 414px | Single column, full-width cards |
| 414-768px | Single column with larger padding |
| > 768px | Centered content (max-width 600px) with side padding |

---

## Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| WCAG Level | AA compliance minimum |
| Color Contrast | 4.5:1 for normal text, 3:1 for large text |
| Touch Targets | Minimum 44x44px (Employee: 48x48px) |
| Screen Reader | All interactive elements labeled |
| Focus Indicators | Visible focus rings on all interactive elements |
| Font Scaling | Support system font scaling up to 200% |
| Reduce Motion | Respect `prefers-reduced-motion` setting |
| Color Independence | Never rely on color alone for information |

---

## Role Switching UI

For users with multiple roles (e.g., a Manager who also teaches classes):

| Element | Behavior |
|---------|----------|
| Role Switcher | Dropdown in top navigation showing available roles |
| Visual Indicator | Accent color changes based on active role |
| Context Preservation | Previous role's state is saved when switching |
| Default Role | User can set preferred default role in settings |
| Quick Switch | Keyboard shortcut (Ctrl/Cmd + Shift + R) or tap role avatar |
| Notification Aggregation | Badges from all roles aggregated in switcher |

---

*Document generated for OhMyGold RBAC UI/UX Architecture. All specifications follow WCAG 2.1 AA guidelines and platform-specific design patterns (iOS Human Interface Guidelines, Material Design 3).*




### European Accessibility Act (EAA) Compliance

> Added per audit finding T2-015: Add correct EAA compliance dates and requirements.

| Regulation | Reference | Key Date | Requirement |
|-----------|-----------|----------|-------------|
| **European Accessibility Act** | Directive 2019/882 | **June 28, 2025** | Deadline for member states to transpose into national law |
| **EAA Enforcement** | Directive 2019/882 | **June 28, 2025** | Private sector compliance required for products/services placed on EU market after this date |
| **Web Accessibility Directive** | Directive 2016/2102 | Already in force | Public sector websites must be accessible |
| **WCAG 2.1 AA** | W3C Recommendation | Baseline standard | Minimum conformance level for EAA compliance |
| **EN 301 549** | ETSI Standard | European standard | Accessibility requirements for ICT products and services |

#### EAA Applicability to OhMyGold

| Aspect | Status | Notes |
|--------|--------|-------|
| **OhMyGold web platform** | In scope | B2C service offered in EU (France) |
| **OhMyGold mobile apps** | In scope | Applications providing gym management services |
| **Club-facing interfaces** | In scope | Services used by clubs to manage operations |
| **Member self-service portal** | In scope | Consumer-facing booking and account management |
| **Deadline for compliance** | **June 28, 2025** | All new services must comply |
| **Existing services grandfathering** | No | All services must comply by deadline |

#### EAA Requirements Checklist

| # | Requirement | WCAG Mapping | Status |
|---|------------|-------------|--------|
| 1 | Perceivable - Information must be presentable in ways users can perceive | WCAG 1.1-1.4 | Required |
| 2 | Operable - Interface components must be operable by all users | WCAG 2.1-2.5 | Required |
| 3 | Understandable - Information and UI operation must be understandable | WCAG 3.1-3.3 | Required |
| 4 | Robust - Content must work with current and future assistive technologies | WCAG 4.1 | Required |
| 5 | Biometric authentication alternatives | WCAG 2.5.4 | Required (N-017 Biometric Login) |
| 6 | Electronic documentation accessibility | EN 301 549 | Required |
| 7 | Two-way communication accessibility | EN 301 549 | Required (contact forms, chat) |

**Key Correction**: The European Accessibility Act (Directive 2019/882) was adopted by the EU in 2019, with a transposition deadline of June 28, 2022 for member states and full enforcement for private sector from June 28, 2025. It was NOT passed in 2015.


---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-29 | Fix T2-003: Changed role name "Teacher" to "Teacher/Coach" throughout for consistency | Audit Fix |

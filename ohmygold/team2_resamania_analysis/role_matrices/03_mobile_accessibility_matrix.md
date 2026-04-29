# OhMyGold - Mobile Accessibility Matrix

## Document Control
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Final |
| Methodology | Role-based mobile-first analysis with workflow optimization |
| Coverage | 6 roles x 13 feature categories = 78 role-feature intersections |

---

## Permission Legend

| Code | Meaning |
|------|---------|
| **Full** | Complete feature available on mobile, optimized for touch |
| **Limited** | Core subset available, simplified interface |
| **View** | Read-only mobile access |
| **No** | Not available on mobile (web-only) |
| **N/A** | Role doesn't have this permission anywhere |

---

## Master Mobile Access Matrix

| Role | Feature Category | Mobile Access | Priority | Rationale | Mobile Optimization Approach |
|------|-----------------|---------------|----------|-----------|------------------------------|
| **Admin** | A. User Management | Limited | P2 | Emergency user unlocks, approval workflows | Search-first interface, quick actions (lock/unlock/reset), no bulk operations |
| **Admin** | B. Location & Facility | View | P3 | Monitor location status on the go | Status cards with color coding, real-time occupancy meters |
| **Admin** | C. Memberships & Subs | View | P3 | Review subscription trends | Chart cards with date range selector, drill-down to location detail |
| **Admin** | D. Billing & Payments | View | P3 | Monitor revenue, failed payments | KPI cards, alert list with severity indicators |
| **Admin** | E. Classes & Scheduling | View | P3 | Monitor class utilization | Schedule grid with enrollment counts, cancellation alerts |
| **Admin** | F. CRM & Sales | View | P3 | Track pipeline performance | Funnel visualization, lead count cards by stage |
| **Admin** | G. Marketing & Comms | Limited | P3 | Approve campaigns, send instant push | Approval queue, one-tap approve/reject, compose push |
| **Admin** | H. Access Control | View | P2 | Monitor occupancy across locations | Multi-location occupancy dashboard, alert for capacity breach |
| **Admin** | I. POS & Inventory | No | P4 | Too complex for mobile | Web-only: inventory management requires desktop precision |
| **Admin** | J. Analytics & Reporting | View | P2 | Dashboard KPIs, exception alerts | At-a-glance KPI cards, trend sparklines, alert feeds |
| **Admin** | K. Content Management | No | P4 | Requires rich text editing, file uploads | Web-only: content creation needs desktop tools |
| **Admin** | L. System Settings | Limited | P1 | Critical alerts, user lockouts, security events | Security alert feed, quick disable/enable toggles |
| **Admin** | M. Mobile-Specific | Full | P1 | Push notifications, biometric, device management | Native push handling, biometric settings, device list |
| **Manager** | A. User Management | Limited | P2 | Approve staff requests, reset passwords | Staff list with quick actions, approve/reject workflows |
| **Manager** | B. Location & Facility | Full | P1 | Real-time facility management, issue response | Zone cards with status, photo-based issue reporting, capacity alerts |
| **Manager** | C. Memberships & Subs | Full | P1 | Enroll members, process upgrades on the floor | Member search, plan selector, card reader integration |
| **Manager** | D. Billing & Payments | Full | P1 | Process payments, issue refunds, view invoices | POS-optimized interface, refund flow with approval PIN |
| **Manager** | E. Classes & Scheduling | Full | P1 | Create schedules, assign coaches, manage bookings | Drag-and-drop schedule, coach assignment picker, room selector |
| **Manager** | F. CRM & Sales | Full | P1 | Lead follow-up, pipeline management, conversion | Lead cards with call/email buttons, pipeline stage drag |
| **Manager** | G. Marketing & Comms | Limited | P2 | Send announcements, schedule campaigns | Announcement composer, campaign list with status |
| **Manager** | H. Access Control | Full | P1 | Override access, view occupancy, manage cards | Override button, occupancy gauge, card deactivation |
| **Manager** | I. POS & Inventory | Full | P1 | Process sales, check stock, receive orders | Barcode scanner, cart interface, stock count tool |
| **Manager** | J. Analytics & Reporting | Full | P1 | Daily revenue, attendance, KPI tracking | Dashboard widgets, chart drill-down, date range picker |
| **Manager** | K. Content Management | Limited | P3 | Post announcements, update class descriptions | Quick post composer, image picker, simple text editing |
| **Manager** | L. System Settings | View | P4 | View location settings | Read-only settings viewer, change requests to Admin |
| **Manager** | M. Mobile-Specific | Full | P1 | Push alerts, photo reporting, QR/barcode, GPS | All native mobile features fully enabled |
| **Employee** | A. User Management | No | N/A | No mobile need for user management | Handled at front-desk web terminal |
| **Employee** | B. Location & Facility | Limited | P2 | Report facility issues with photos | Photo issue reporter, equipment status viewer |
| **Employee** | C. Memberships & Subs | Limited | P2 | Assist members with enrollment | Read-only plan viewer, assist-mode enrollment flow |
| **Employee** | D. Billing & Payments | Full | P1 | Process POS transactions, record payments | Optimized POS interface with large touch targets |
| **Employee** | E. Classes & Scheduling | Limited | P1 | View schedule, take attendance, manage bookings | Today's schedule view, attendance grid, booking search |
| **Employee** | F. CRM & Sales | Limited | P3 | Log walk-in leads, schedule follow-ups | Quick lead capture form, follow-up reminder setter |
| **Employee** | G. Marketing & Comms | No | N/A | Not an employee responsibility | Manager handles marketing |
| **Employee** | H. Access Control | Full | P1 | Process check-ins via QR/barcode scan | Camera-based scanner, manual entry fallback |
| **Employee** | I. POS & Inventory | Full | P1 | Process sales, stock lookup, barcode scan | POS cart, product search, barcode scanner |
| **Employee** | J. Analytics & Reporting | View | P3 | View personal shift summary | End-of-shift card with stats |
| **Employee** | K. Content Management | No | N/A | Not applicable | No content management for employees |
| **Employee** | L. System Settings | No | N/A | Not applicable | No settings access |
| **Employee** | M. Mobile-Specific | Full | P1 | Photo reporting, barcode scan, offline check-in | Native camera, scanner, offline queue sync |
| **Teacher/Coach** | A. User Management | No | N/A | Not a teacher function | Teacher/Coaches don't manage users |
| **Teacher/Coach** | B. Location & Facility | View | P3 | View room assignments | Room info display for their classes |
| **Teacher/Coach** | C. Memberships & Subs | No | N/A | Not a teacher function | Subscription management is staff-only |
| **Teacher/Coach** | D. Billing & Payments | No | N/A | Not a teacher function | No billing access |
| **Teacher/Coach** | E. Classes & Scheduling | Full | P1 | Schedule, attendance, substitution, rosters | Calendar-first UI, tap-to-mark attendance, sub request button |
| **Teacher/Coach** | F. CRM & Sales | No | N/A | Not a teacher function | Sales is handled by staff |
| **Teacher/Coach** | G. Marketing & Comms | Limited | P3 | Send class reminders, notify their members | Message composer for class attendees |
| **Teacher/Coach** | H. Access Control | View | P3 | View class attendance count | Attendee count display |
| **Teacher/Coach** | I. POS & Inventory | No | N/A | Not a teacher function | No POS access |
| **Teacher/Coach** | J. Analytics & Reporting | View | P2 | Class performance, attendance trends | Personal class analytics, trend charts |
| **Teacher/Coach** | K. Content Management | Limited | P2 | Edit class descriptions, upload class media | Rich text editor, image picker for class content |
| **Teacher/Coach** | L. System Settings | No | N/A | Not applicable | No settings access |
| **Teacher/Coach** | M. Mobile-Specific | Full | P1 | Push notifications, attendance camera, biometric | Class reminders, attendance photo capture |
| **Client** | A. User Management | No | N/A | Clients don't manage users | Self-service account only |
| **Client** | B. Location & Facility | View | P2 | View gym hours, capacity, amenities | Clean info cards with real-time occupancy |
| **Client** | C. Memberships & Subs | Full | P1 | Manage subscription, upgrade, freeze, cancel | Plan comparison cards, upgrade flow, freeze toggle |
| **Client** | D. Billing & Payments | Full | P1 | View invoices, manage payment methods, pay | Invoice list, card management, payment flow |
| **Client** | E. Classes & Scheduling | Full | P1 | Book, cancel, view schedule, waitlist | Weekly calendar, filter chips, one-tap book/cancel |
| **Client** | F. CRM & Sales | No | N/A | Not applicable | Clients aren't in CRM |
| **Client** | G. Marketing & Comms | View | P3 | Receive announcements, view promotions | Announcement feed, promo card carousel |
| **Client** | H. Access Control | Full | P1 | Self check-in via QR, view entry history | Digital membership card with QR, check-in history |
| **Client** | I. POS & Inventory | View | P3 | Browse products, view purchase history | Product catalog, order history list |
| **Client** | J. Analytics & Reporting | View | P2 | Personal workout stats, attendance trends | Stats dashboard with streaks, charts, milestones |
| **Client** | K. Content Management | No | N/A | Not applicable | No content creation |
| **Client** | L. System Settings | Full | P1 | Profile, notifications, password, 2FA | Settings menu with native toggles |
| **Client** | M. Mobile-Specific | Full | P1 | Push, biometric auth, GPS check-in, offline | All native features: Face ID, GPS, push, offline cache |
| **Visitor** | A. User Management | No | N/A | Not applicable | Account creation only |
| **Visitor** | B. Location & Facility | View | P1 | Explore gym facilities, view amenities | Photo gallery, facility cards, virtual tour |
| **Visitor** | C. Memberships & Subs | View | P1 | Browse subscription plans and pricing | Plan comparison with pricing, feature checklist |
| **Visitor** | D. Billing & Payments | Limited | P2 | Pay for trial sign-up | Simple payment flow for trial activation |
| **Visitor** | E. Classes & Scheduling | View | P1 | Browse class schedule, view class details | Weekly schedule view, class detail cards |
| **Visitor** | F. CRM & Sales | No | N/A | Not applicable | Visitors are CRM leads but don't access CRM |
| **Visitor** | G. Marketing & Comms | View | P2 | View promotions, announcements | Promo feed, newsletter signup |
| **Visitor** | H. Access Control | Limited | P1 | Display trial QR code for check-in | Trial pass QR, validity countdown |
| **Visitor** | I. POS & Inventory | No | N/A | Not applicable | No product purchase before membership |
| **Visitor** | J. Analytics & Reporting | No | N/A | Not applicable | No data to report on |
| **Visitor** | K. Content Management | No | N/A | Not applicable | No content creation |
| **Visitor** | L. System Settings | Limited | P2 | Manage trial account, notification preferences | Trial account settings, marketing opt-in/out |
| **Visitor** | M. Mobile-Specific | Full | P1 | Push, GPS, trial QR | Trial reminders, location-based gym finder |

---

## Mobile-First Features (Better on Mobile Than Web)

These features are inherently superior on mobile due to native device capabilities:

### For Admin
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Security alert response | Instant push + one-tap action | Native push with action buttons |
| User lock/unlock | Quick biometric auth for sensitive action | PIN/biometric confirmation before unlock |
| System health monitoring | Glanceable status widgets | iOS/Android widgets for system status |

### For Manager
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Photo-based issue reporting | Camera integration is native | In-app camera with annotation overlay |
| Floor capacity check | Walk-around while checking | Large number display, color-coded status |
| Instant push to members | Compose and send from anywhere | Quick compose with template selector |
| POS on tablet | Touch-optimized, portable | Large buttons, cart sidebar, barcode scan |

### For Employee
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Barcode/QR scanning | Camera is the scanner | Real-time camera preview with auto-detect |
| Photo issue reporting | Snap and report in one flow | Camera → annotate → submit in 3 taps |
| Check-in processing | Line-bust with mobile device | Scan → confirm → next (under 3 seconds) |
| Floor capacity count | Walk and count visually | Tap counter with zone breakdown |

### For Teacher
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Attendance taking | In-class, mobile in hand | Scrollable roster with big tap targets |
| Class schedule | Always checking on the go | Lock screen widget with next class |
| Substitution request | Request coverage anywhere | Availability toggle + request form |
| Client progress photo | Capture form/milestone | Camera integration with note attachment |

### For Client
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Self check-in | Phone is always with them | QR code display + GPS verification |
| Class booking | Book while on the go | One-tap booking from push notification |
| Push reminders | Native notification system | Rich push with deep link to booking |
| Biometric login | Face ID / fingerprint | Native biometric APIs |
| GPS gym finder | Location-aware discovery | Map integration with route guidance |

### For Visitor
| Feature | Why Mobile-First | Implementation |
|---------|-----------------|---------------|
| Trial QR pass | Phone is the ticket | Auto-generated QR with countdown timer |
| Gym discovery | Location-based search | Map view with distance and directions |
| Photo showcase | Native image gallery | Swipeable gallery with pinch-to-zoom |

---

## Mobile-Only Features (No Web Equivalent)

These features only make sense on mobile due to hardware dependencies:

| Feature | Roles | Why Mobile-Only |
|---------|-------|----------------|
| GPS-verified check-in | Client | Requires device GPS to verify physical presence at gym |
| Biometric authentication (Face ID/Fingerprint) | All roles | Requires device biometric hardware |
| Push notifications | All roles | Requires native push notification services (APNs/FCM) |
| Camera-based barcode/QR scanning | Admin, Manager, Employee, Teacher | Requires device camera |
| Photo-based issue reporting | Manager, Employee | Camera capture with geolocation tagging |
| Offline mode | Employee, Client, Teacher | Mobile apps can cache data locally; web requires connectivity |
| Lock screen widgets | Client, Teacher | iOS/Android widget framework |
| NFC card emulation | Client | Digital membership card via NFC tap |
| Haptic feedback | All roles | Native device vibration for confirmations |
| Siri/Assistant shortcuts | Client | "Hey Siri, check me into OhMyGold" |
| Background sync | All roles | Queue actions when offline, sync when reconnected |
| Deep linking from push | All roles | Push tap → specific in-app screen |

---

## Web-Only Features (Too Complex for Mobile)

These features should remain web-only due to complexity, data density, or precision requirements:

### For Admin
| Feature | Why Web-Only | Mobile Alternative |
|---------|-------------|-------------------|
| Bulk user import (CSV) | File handling, column mapping, validation preview | View import status only |
| Custom report builder | Drag-and-drop fields, complex filters, preview pane | View saved reports |
| System settings configuration | Complex forms with many interdependent fields | Alert feed + read-only view |
| Integration management | API key management, webhook configuration | View integration status |
| Role & permission editing | Complex matrix UI, granular toggles | View role definitions |
| Backup & restore | Large file operations, progress monitoring | View backup status, trigger backup |

### For Manager
| Feature | Why Web-Only | Mobile Alternative |
|---------|-------------|-------------------|
| Recurring schedule creation | Complex recurrence rules, multi-week patterns | View schedule, make one-time edits |
| Financial report export | Large dataset Excel generation | View dashboard charts |
| Marketing automation setup | Workflow builder with branching logic | Toggle automations on/off |
| Inventory purchase orders | Multi-line forms, supplier management | View PO status, mark received |
| Bulk SMS/email composition | Rich text editor, template variables | Send quick announcements |

### For Employee
| Feature | Why Web-Only | Mobile Alternative |
|---------|-------------|-------------------|
| End-of-day reconciliation | Multi-column transaction matching | View shift summary |
| Detailed client profile editing | Many form fields, document uploads | View client basic info |

### For Teacher
| Feature | Why Web-Only | Mobile Alternative |
|---------|-------------|-------------------|
| Class content library management | File uploads, video embedding, organization | View saved class plans |
| Detailed client progress review | Long-form notes, trend analysis over months | View recent notes only |

### For Client
| Feature | Why Web-Only | Mobile Alternative |
|---------|-------------|-------------------|
| Full subscription history export | GDPR data export (large ZIP) | View recent invoices |
| Payment method detailed management | Billing address, verification, multiple cards | View/add basic card info |

---

## Simplified Mobile Views

How complex web features should be simplified for mobile:

### Schedule View (All Roles)

| Aspect | Web | Mobile |
|--------|-----|--------|
| Display | Full weekly grid with all details | Day view or 3-day carousel, card per class |
| Interaction | Click for detail, drag to reschedule | Tap to expand, swipe between days |
| Filters | Multi-select dropdowns | Horizontal chip scroll (Type, Coach, Time) |
| Booking | Multi-step form | One-tap book with confirmation sheet |

### Financial Dashboard (Admin, Manager)

| Aspect | Web | Mobile |
|--------|-----|--------|
| Display | Multi-chart layout with tables | Single KPI cards, one chart at a time |
| Date Range | Custom date picker | Preset buttons (Today, Week, Month) |
| Drill-Down | Click chart segment → detail table | Tap card → list view |
| Export | CSV/PDF buttons | Share button (generates on server, sends link) |

### Client Profile (Manager, Employee)

| Aspect | Web | Mobile |
|--------|-----|--------|
| Display | Full profile + history sidebar | Avatar + key info card, tabbed sections |
| Navigation | Persistent sidebar menu | Bottom tabs (Profile, History, Bookings, Notes) |
| Actions | Dropdown menus | Bottom action sheet |
| Search | Full-text search bar | Voice search + recent searches |

### Attendance Taking (Teacher, Employee)

| Aspect | Web | Mobile |
|--------|-----|--------|
| Display | Table with checkboxes | Scrollable list with large toggle buttons |
| Action | Click checkbox, save button | Tap to toggle (auto-saves), swipe for notes |
| Notes | Text area per row | Tap name → bottom sheet for quick note |
| Summary | Footer count | Sticky header with count |

---

## Quick Actions by Role

### Admin Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Shield | Security Alerts | Alert feed with severity filter |
| Users | User Search | Global user lookup |
| Chart | KPI Dashboard | Cross-location metrics |
| Bell | Send Push | Compose announcement |

### Manager Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Plus | Enroll Member | New member flow |
| Camera | Report Issue | Photo issue reporter |
| Dollar | POS Sale | Quick sale interface |
| Megaphone | Announcement | Quick post composer |
| Users | Staff List | Staff management |
| Chart | Daily Report | Revenue dashboard |

### Employee Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Scan | Check-In | Camera scanner mode |
| Cart | POS Sale | Product sale flow |
| Users | Client Lookup | Member search |
| Camera | Report Issue | Facility issue reporter |
| Clipboard | Attendance | Today's class list |

### Teacher/Coach/Coach Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Users | Take Attendance | Next class roster |
| Calendar | My Schedule | Personal calendar |
| Swap | Request Sub | Substitution form |
| Message | Message Class | Attendee message composer |
| Chart | My Stats | Performance analytics |

### Client Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Ticket | My QR Code | Digital membership card |
| Search | Find Class | Class schedule with filters |
| Calendar | My Bookings | Upcoming bookings list |
| Gear | Settings | Account settings |
| Bell | Notifications | Notification center |

### Visitor Mobile Quick Actions
| Icon | Action | Destination |
|------|--------|-------------|
| Star | Start Trial | Trial signup flow |
| Search | Browse Classes | Schedule viewer |
| Tag | View Pricing | Plan comparison |
| Map | Find Gym | Location with directions |
| Phone | Contact | Contact options sheet |

---

## Offline Capabilities by Role

### What Works Without Internet

| Role | Offline Feature | Sync Behavior | Conflict Resolution |
|------|----------------|---------------|---------------------|
| **Admin** | View cached KPIs | Sync when reconnected | Server wins for financial data |
| **Admin** | View cached user list | Background sync | Server wins |
| **Manager** | View today's schedule | Immediate sync on reconnect | Server wins for schedule changes |
| **Manager** | View cached member list | Background sync | Server wins |
| **Manager** | Draft announcements | Queue for send | Queue sent in order |
| **Employee** | Check-in via cached member list | Queue check-ins, sync in batch | Server validation on sync |
| **Employee** | POS transactions (cache mode) | Queue sales, sync when online | Server reconciliation |
| **Employee** | Photo issue reporting | Queue with photo, upload later | First-come first-served |
| **Employee** | Attendance taking | Queue marks, sync in background | Server wins if conflict |
| **Teacher/Coach** | View class schedule | Sync on reconnect | Server wins |
| **Teacher/Coach** | Take attendance offline | Queue attendance, sync after class | Server wins |
| **Teacher/Coach** | Draft progress notes | Save locally, sync when connected | Last-write wins for notes |
| **Client** | View cached schedule | Background refresh | Server wins |
| **Client** | Queue booking requests | Send when connected | First-come for waitlist |
| **Client** | View digital membership card | No sync needed (pre-cached QR) | N/A |
| **Client** | View workout history | No changes to sync | N/A |
| **Visitor** | View cached gym info | Background refresh | N/A |
| **Visitor** | Trial QR code (pre-generated) | No sync needed | N/A |

### Offline UI Indicators

| Element | Behavior |
|---------|----------|
| Sync status bar | Subtle banner showing "Syncing..." / "Last synced 2 min ago" / "Offline" |
| Action availability | Greyed-out actions requiring connectivity with "Requires internet" tooltip |
| Queued actions | Badge on sync icon showing pending count |
| Auto-sync | Automatic retry every 30 seconds when connection restored |
| Manual sync | Pull-to-refresh triggers immediate sync attempt |

---

## Push Notification Strategy by Role

### Admin Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Security Alert | Failed login threshold exceeded | As needed | Push + SMS | "Location X: 10 failed login attempts detected" |
| Payment Gateway Down | Gateway health check fails | As needed | Push + SMS | "Stripe integration offline at Location X" |
| System Backup Failed | Scheduled backup fails | Daily check | Push + Email | "Backup failed: [error details]" |
| User Escalation | Manager escalates issue | As needed | Push | "Manager at Location X needs assistance" |
| Daily Summary | End of business day | Daily | Email | Cross-location KPI summary |

### Manager Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Staff No-Show | Coach doesn't check in by class time | As needed | Push + SMS | "Yoga class at 10am has no assigned coach" |
| Capacity Alert | Real-time occupancy > 90% | As needed | Push | "Gym at 92% capacity — consider crowd control" |
| Failed Payment | Auto-payment fails | As needed | Push | "Member John D. payment failed: update required" |
| Lead Follow-Up | Follow-up reminder time reached | Multiple daily | Push | "Follow up with Sarah M. (trial 2 days ago)" |
| Equipment Issue | Employee reports critical issue | As needed | Push | "Treadmill #3 reported broken — see photo" |
| New Online Enrollment | Client signs up online | As needed | Push | "New member enrolled: Jane S. (Premium Plan)" |
| Daily Revenue | End of day summary | Daily | Email | "Today's revenue: $X,YYY (target: $Z,ZZZ)" |

### Employee Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Class Starting | 15 min before class | Per class | Push | "HIIT class starts in 15 min — 12 booked" |
| Member Expired | Expired member attempts check-in | As needed | In-app alert | "Membership expired — prompt renewal" |
| Manager Message | Manager sends announcement | As needed | Push | New announcement from [Manager Name] |
| Issue Resolved | Reported issue marked fixed | As needed | Push | "Treadmill #3 repair completed" |
| Shift Handoff | End of shift approaching | Daily | Push | "Shift ends in 30 min — submit handoff notes" |

### Teacher/Coach/Coach Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Class Reminder | 30 min before class | Per class | Push | "Your Spin class starts in 30 min (Room B)" |
| Substitution Request | Another teacher requests coverage | As needed | Push + SMS | "Mike requests coverage for Yoga tomorrow 9am" |
| New Booking | Member books their class | Per booking | Push (batched) | "+3 new bookings for your 6pm class" |
| Class Cancellation | Manager cancels their class | As needed | Push + SMS | "Your 7pm class has been cancelled (room issue)" |
| Member Message | Direct message from member | As needed | Push | "New message from Jane S. about tomorrow's class" |
| Weekly Summary | End of week | Weekly | Email | "This week: 8 classes, 142 attendees, 98% rating" |

### Client Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Booking Confirmed | Successful class booking | Per booking | Push | "You're booked for HIIT on Monday at 6pm" |
| Class Reminder | 15 min before booked class | Per class | Push | "HIIT starts in 15 min — don't forget your towel!" |
| Booking Cancelled | Class cancelled by gym | As needed | Push + SMS | "Your 6pm Spin class has been cancelled" |
| Waitlist Promotion | Moved from waitlist to booked | As needed | Push | "You're in! Promoted from waitlist for Yoga at 7pm" |
| Payment Successful | Auto-payment processed | Monthly | Push + Email | "Your Premium membership payment of $49 was successful" |
| Payment Failed | Auto-payment fails | As needed | Push + Email + SMS | "Payment failed — update your card to avoid interruption" |
| Membership Expiring | Subscription expires in 7 days | Once | Push + Email | "Your membership expires in 7 days — renew now" |
| Achievement | Workout milestone reached | As needed | Push | "30-day streak! You're on fire!" |
| Promotion | Special offer available | Weekly | Push | "This week only: 20% off personal training packages" |
| Gym Announcement | Manager posts announcement | As needed | Push | "Pool closed for maintenance this Saturday" |

### Visitor Push Notifications

| Notification Type | Trigger | Frequency | Channel | Content |
|-------------------|---------|-----------|---------|---------|
| Trial Confirmed | Trial signup complete | Once | Push + Email | "Your free trial is confirmed! Here's your QR code" |
| Trial Reminder | 24 hours before trial | Once | Push + Email | "Your trial session is tomorrow at 10am" |
| Trial Day Reminder | 2 hours before trial | Once | Push | "Your trial starts in 2 hours — we can't wait to meet you!" |
| Trial Expiring | Trial expires in 24 hours | Once | Push + Email | "Your trial expires tomorrow — join today and save 50%" |
| Follow-Up Offer | 3 days post-trial | Once | Push + Email | "Missing us? Join this week and get your first month free" |
| New Promotion | Special signup offer | Weekly | Email | "New member special: No joining fee this month" |

### Push Delivery Configuration

| Setting | Value |
|---------|-------|
| Quiet Hours | 22:00 - 08:00 (no non-critical pushes) |
| Batch Window | Non-urgent pushes batched and sent at 09:00, 13:00, 17:00 |
| Retry Policy | 3 retries at 5-min intervals for failed deliveries |
| Expiration | Push notifications expire after 24 hours if not delivered |
| Rich Media | Images supported for promotional pushes (max 1MB) |
| Deep Links | Every push includes deep link to relevant in-app screen |
| Action Buttons | Critical pushes include action buttons (Confirm, Dismiss, View) |

---

## Screen Size Adaptations

### Breakpoint Strategy

| Breakpoint | Devices | Layout Approach |
|------------|---------|----------------|
| < 360px | Small phones (iPhone SE) | Single column, minimal padding, compact cards |
| 360-414px | Standard phones | Single column, standard padding |
| 414-768px | Large phones, small tablets | Two-column cards, expanded navigation |
| 768-1024px | Tablets (iPad) | Split view: nav + content, two-column layouts |
| > 1024px | Large tablets, desktop web | Full desktop layout, multi-column dashboards |

### Role-Specific Responsive Notes

| Role | Mobile Focus | Tablet Enhancement |
|------|-------------|-------------------|
| Admin | Alert feed, user search | Side-by-side dashboard widgets |
| Manager | Quick actions, POS | Full scheduling grid, report charts |
| Employee | Scanner, attendance | Split-view schedule + roster |
| Teacher/Coach | Attendance, schedule | Class content editor with preview |
| Client | Booking, check-in | Weekly schedule grid, bigger charts |
| Visitor | Trial signup, gallery | Side-by-side plan comparison |

---

*Document generated for OhMyGold RBAC Mobile Architecture. All mobile specifications subject to iOS/Android design guidelines.*


---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-29 | Fix T2-003: Changed role name "Teacher" to "Teacher/Coach" throughout for consistency | Audit Fix |


---

## Mobile Feature Source Requirement Mapping

> Added per audit finding T2-011: Add source requirement mapping to mobile accessibility matrix.

| # | Feature | Source Requirement | Source File | Reference |
|---|---------|-------------------|-------------|-----------|
| 1 | **Dashboard** | Core member experience | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "Your members can easily book their classes..." |
| 2 | **Class Booking** | Primary app function | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "Book in just a few clicks" |
| 3 | **Schedule View** | Core app feature | `Resamania - Custom Mobile Application (4_29_2026 4_56_35 AM).html` | "Users have access to a full view of their booked classes" |
| 4 | **Membership Card** | Access control integration | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "QR code or NFC for contactless check-in" |
| 5 | **Push Notifications** | Marketing automation | `Resamania - Marketing automation (4_29_2026 4_57_36 AM).html` | "Send targeted push notifications to your members" |
| 6 | **Message Center** | Communication feature | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "Allows you to stay in touch with your members" |
| 7 | **Profile Management** | Self-service | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "Manage their personal information and preferences" |
| 8 | **Payment History** | Billing integration | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "View their payment history" |
| 9 | **Attendance History** | Reporting | `Resamania - Custom branded member app (4_29_2026 4_55_59 AM).html` | "View their attendance history" |
| 10 | **Club Locator** | Multi-club support | `Gold's Gym France | Enseigne de salles de sport en Île-de-France (4_29_2026 5_30_01 AM).html` | Google Maps integration with club locations |
| 11 | **Class Check-in** | Access control | `Resamania - Best Gym Management Software (4_29_2026 4_54_14 AM).html` | "Check-in feature to track attendance" |
| 12 | **Workout Plans** | Fitness content | `Gold's Gym: The Original Home of Serious Strength Training (4_29_2026 5_29_11 AM).html` | Personal training content |
| 13 | **Nutrition Tracking** | Health integration | `Gold's Gym France | Enseigne de salles de sport en Île-de-France (4_29_2026 5_30_01 AM).html` | "plans nutritionnels personnalises" |
| 14 | **Social Sharing** | Community | `Gold's Gym France | Enseigne de salles de sport en Île-de-France (4_29_2026 5_30_01 AM).html` | Instagram, Facebook, YouTube links |
| 15 | **Dark Mode** | Accessibility | WCAG 2.1 Guidelines | Accessibility best practice |
| 16 | **Offline Mode** | Reliability | Resamania App Store reviews | User-reported connectivity issues |
| 17 | **Biometric Login** | Security | Industry Standard | iOS Face ID / Android Fingerprint |
| 18 | **In-App Purchases** | Revenue | `Resamania - POS and Inventory Management (4_29_2026 4_58_14 AM).html` | "Access your boutique" |
| 19 | **Video On-Demand** | Content | `Gold's Gym France | Enseigne de salles de sport en Île-de-France (4_29_2026 5_30_01 AM).html` | Video workout content |
| 20 | **Wearable Sync** | Integration | `Resamania - Experience Led Membership Software (4_29_2026 4_56_51 AM).html` | Wearable device integration |

### Coverage Summary

| Source Type | Features Covered | Percentage |
|-------------|-----------------|------------|
| Resamania HTML pages | 12 | 60% |
| Gold's Gym HTML pages | 5 | 25% |
| Industry standards/WCAG | 2 | 10% |
| User feedback | 1 | 5% |

**Verdict**: Features are primarily derived from competitor analysis with cross-reference to Gold's Gym requirements.


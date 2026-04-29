# OhMyGold - Role Feature Descriptions & Personas

## Document Control
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Final |
| Methodology | Role-based persona analysis with workflow mapping |
| Personas | 6 (Admin, Manager, Employee, Teacher, Client, Visitor) |

---

## 1. Admin

### Role Summary
The Admin is the superuser of OhMyGold with system-wide control across ALL gym locations. They are typically the franchise owner, regional director, or IT/system administrator responsible for platform configuration, user management, and strategic oversight. This role requires the ability to see everything, configure everything, and intervene anywhere.

### Primary Goals
- Ensure all gym locations operate smoothly within a unified system
- Manage user accounts across the entire organization including other Admins
- Configure global settings, integrations, and security policies
- Monitor cross-location performance and identify trends
- Maintain system security, compliance, and data integrity

### Daily Workflow
1. Log in and review the global dashboard — check alerts across all locations
2. Review overnight system health, failed backups, integration status
3. Process user management requests (new Manager onboarding, account issues)
4. Respond to escalations from Managers (billing disputes, policy questions)
5. Review cross-location financial and membership reports
6. Configure system updates, new integrations, or policy changes
7. Review audit logs for security concerns

### Must-Have Features (Top 10)
1. **Global Dashboard** — Cross-location KPIs in a single view
2. **Full User Management** — CRUD operations on ALL user types including Admins
3. **Location Management** — Create, configure, and deactivate gym locations
4. **Financial Reporting** — Cross-location revenue, billing, and tax reports
5. **System Settings** — Global configuration for timezone, language, security
6. **Integration Management** — Payment gateways, APIs, third-party connections
7. **Audit Log Viewer** — Complete system audit trail for compliance
8. **Backup & Recovery** — Manual and scheduled backup controls
9. **Role & Permission Management** — Define and modify role capabilities
10. **Bulk Operations** — CSV imports, mass updates across the system

### Nice-to-Have Features
- AI-powered anomaly detection across locations
- Automated cross-location benchmarking reports
- Custom report builder with advanced visualizations
- Mobile admin app for emergency interventions
- Integration marketplace for third-party tools
- Advanced security features (IP whitelisting, SSO)

### Pain Points to Address
- **Information Overload** — Seeing data from all locations can be overwhelming; needs filtering and alerting
- **Emergency Access** — Needs ability to quickly intervene in any location during crises
- **Delegation Difficulty** — Hard to give limited access to others without creating full Managers
- **System Downtime Risk** — Any system issue affects ALL locations; needs robust monitoring
- **Compliance Complexity** — Must ensure all locations meet GDPR/local data regulations

### Platform Preference
- **Web: 90%** — Admin work is complex, requires multiple windows, large datasets, and detailed configuration
- **Mobile: 10%** — Used only for emergency alerts, quick user unlocks, and push notifications
- **Rationale**: Bulk operations, reporting, and system configuration are impossible on mobile. Mobile is strictly for urgent notifications and quick overrides.

### Dashboard Priorities
1. System health status (all locations)
2. Cross-location revenue trend (7/30/90 days)
3. Active alerts requiring attention
4. New signups across all locations
5. Failed payments summary
6. Recent user management activity
7. Quick links to common admin tasks

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| Critical | Payment gateway failure | Push + Email + SMS |
| Critical | Security breach / failed login spikes | Push + Email + SMS |
| High | System backup failure | Push + Email |
| High | Manager account lockout | Email |
| Medium | New location request | Email |
| Low | Weekly cross-location summary | Email |

### Time Sensitivity
- **Real-Time**: Security alerts, payment gateway failures, critical system errors
- **Near Real-Time**: Manager escalations, user account issues
- **Batch**: Financial reports, audit log analysis, backup verification

---

## 2. Manager

### Role Summary
The Manager is the operational leader of a single gym location. They are responsible for everything that happens at their facility — from staff management to client satisfaction to local P&L. They need comprehensive access to their location's data and operations while having zero visibility into competing locations.

### Primary Goals
- Maximize member retention and satisfaction at their location
- Manage staff schedules, performance, and day-to-day operations
- Drive revenue through local promotions, class offerings, and sales
- Ensure smooth facility operations (equipment, cleanliness, capacity)
- Hit monthly targets for new memberships, retention, and revenue

### Daily Workflow
1. Open the location dashboard — check yesterday's numbers and today's schedule
2. Review staff schedule and ensure all classes have assigned coaches
3. Check capacity monitor and anticipate busy periods
4. Handle any escalated client issues (billing disputes, complaints)
5. Review sales pipeline and follow up on hot leads
6. Check inventory levels and approve any purchase orders
7. Review end-of-day report — revenue, attendance, check-ins
8. Send announcements or schedule tomorrow's communications

### Must-Have Features (Top 10)
1. **Location Dashboard** — Real-time view of their gym's key metrics
2. **Staff Management** — Create/manage Employee, Teacher accounts at their location
3. **Class & Schedule Management** — Full control over class types, schedules, room allocation
4. **Sales Pipeline** — Lead tracking, follow-ups, conversion management
5. **Billing & Refunds** — Invoice management, payment processing, refund approval
6. **Client Management** — Full client profiles, membership management, history
7. **POS System** — Product sales, membership sales, discount application
8. **Marketing Tools** — Email/SMS campaigns, promotions, member segmentation
9. **Facility Management** — Equipment status, capacity rules, zone configuration
10. **Financial Reporting** — Location P&L, revenue trends, outstanding payments

### Nice-to-Have Features
- Automated staff scheduling optimization
- Member churn prediction alerts
- Class recommendation engine for members
- Social media integration for marketing
- Advanced member segmentation (RFM analysis)
- Automated inventory reorder suggestions

### Pain Points to Address
- **Staff No-Shows** — Need quick substitution workflows when coaches cancel last minute
- **Member Complaints** — Easy escalation path and communication history tracking
- **Revenue Pressure** — Need clear visibility into daily/weekly targets vs actuals
- **Facility Issues** — Quick equipment issue reporting and maintenance scheduling
- **Lead Leakage** — Lost follow-ups on trial members and leads

### Platform Preference
- **Web: 75%** — Heavy operational work (scheduling, reporting, billing) is desktop-driven
- **Mobile: 25%** — Quick check on metrics, emergency staff communication, check capacity
- **Rationale**: Scheduling and reporting require screen real estate. Mobile is for situational awareness and urgent actions when away from the desk.

### Dashboard Priorities
1. Today's attendance and check-ins (real-time)
2. Revenue vs daily target
3. Active leads requiring follow-up today
4. Staff on duty / today's schedule
5. Capacity meter (current occupancy)
6. Recent member signups and cancellations
7. Alerts (low stock, equipment issues, failed payments)

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| Critical | Staff no-show | Push + SMS |
| High | Failed payment | Push + Email |
| High | Member cancellation request | Push |
| Medium | Lead follow-up reminder | Push |
| Medium | Equipment issue reported | Push |
| Low | Daily revenue summary | Email |

### Time Sensitivity
- **Real-Time**: Staff no-shows, capacity limits reached, emergency issues
- **Near Real-Time**: Lead follow-ups, payment failures, member complaints
- **Batch**: Daily financial reconciliation, attendance summaries, marketing reports

---

## 3. Employee

### Role Summary
The Employee is the frontline operational staff — receptionists, front-desk associates, and general operational personnel. They are the face of the gym, handling check-ins, answering questions, processing sales, and ensuring smooth day-to-day facility operations. They need fast, simple tools that keep lines moving.

### Primary Goals
- Provide excellent customer service to all members and visitors
- Process check-ins efficiently, especially during peak hours
- Handle POS transactions accurately and quickly
- Log class attendance and facility issues
- Support basic client needs (password resets, booking help)

### Daily Workflow
1. Clock in and open the front-desk interface
2. Process morning rush check-ins (scan cards, verify memberships)
3. Handle phone inquiries and walk-in questions
4. Process any product sales or membership upgrades
5. Log class attendance as sessions complete
6. Report any equipment or facility issues (with photos)
7. Help members with booking, cancellations, basic account issues
8. Review end-of-shift summary (check-ins, sales, issues logged)

### Must-Have Features (Top 10)
1. **Quick Check-In Interface** — Barcode/QR scanning, membership lookup, fast processing
2. **POS System** — Product catalog, cart, payment processing, receipts
3. **Class Attendance Logger** — Mark present/absent, view class rosters
4. **Client Lookup** — Search members by name/card, view basic profile
5. **Issue Reporting** — Photo-based equipment/facility issue logging
6. **Today's Schedule View** — All classes, times, rooms, instructor assignments
7. **Basic Booking Helper** — Book/cancel classes on behalf of members
8. **Capacity Monitor** — Real-time occupancy count
9. **Visitor Registration** — Sign up visitors for trials, create guest records
10. **Shift Summary View** — Personal check-in count, sales, issues for the day

### Nice-to-Have Features
- Member photo display at check-in (personal touch)
- Voice-activated search (hands-free during busy periods)
- Quick-access FAQ for common member questions
- Member birthday alerts (personalization opportunity)
- Digital waiver signing for new members
- Waitlist management with auto-promote notifications

### Pain Points to Address
- **Rush Hour Pressure** — Need ultra-fast check-in during peak times; every second counts
- **Multiple Systems** — Switching between check-in, POS, booking, and issue reporting is frustrating
- **Member Impatience** — Long lines form if the system is slow or confusing
- **Lack of Context** — Not knowing a member's history when they ask a question
- **Equipment Issues** — Reporting is often forgotten or delayed because it's too many steps

### Platform Preference
- **Web: 60%** — POS and check-in are often desktop-based at a front desk
- **Mobile: 40%** — Tablet-based check-in stations, floor roaming, photo issue reporting
- **Rationale**: Front desk typically uses a desktop/tablet. Mobile is essential for roaming the floor, checking capacity, and snapping photos of equipment issues. The mobile app should be optimized for speed over depth.

### Dashboard Priorities
1. Big, prominent check-in search/scan interface
2. Current occupancy count (large number)
3. Next 3 upcoming classes with enrollment counts
4. Pending tasks (issues to report, follow-ups)
5. Today's personal stats (check-ins processed, sales)
6. Active alerts (equipment down, capacity warning)

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| High | Class starting soon (need to take attendance) | Push |
| High | Membership expired at check-in | In-app |
| Medium | Equipment issue assigned to maintenance | Push |
| Medium | Manager message/announcement | Push |
| Low | Shift handoff notes | In-app |

### Time Sensitivity
- **Real-Time**: Check-in processing, capacity alerts, member expiration at entry
- **Near Real-Time**: Class attendance logging, issue reporting
- **Batch**: Daily shift summary, personal performance metrics

---

## 4. Teacher / Coach

### Role Summary
The Teacher/Coach is the fitness professional who delivers classes and personal training sessions. They may work at one or multiple locations, on regular or occasional schedules. Their primary focus is delivering excellent fitness experiences, managing class content, tracking client progress, and maintaining their own availability schedule.

### Primary Goals
- Deliver high-quality classes and training sessions consistently
- Track attendance and engagement for their sessions
- Manage class content, descriptions, and intensity levels
- Maintain accurate availability to avoid scheduling conflicts
- Monitor and record client progress for personalized coaching

### Daily Workflow
1. Open app to view today's class schedule
2. Review class roster — who's attending, any new members
3. Prepare class content based on attendee fitness levels
4. Take attendance at class start (quick tap interface)
5. Record any client progress notes or concerns
6. Respond to substitution requests or availability changes
7. Review upcoming week schedule and confirm availability
8. Check any direct messages from members or management

### Must-Have Features (Top 10)
1. **Personal Schedule View** — Clear, calendar-based view of all assigned classes
2. **Attendance Taking** — Quick tap-to-mark interface for class rosters
3. **Client Progress Notes** — Log notes per client per session (private)
4. **Class Roster Viewer** — See who's booked, their experience level, injuries
5. **Availability Management** — Set recurring and one-off availability
6. **Substitution Request** — Request coverage and swap classes with other coaches
7. **Class Content Library** — Save and reuse class plans, exercises, music
8. **Member Communication** — Direct message members in their classes
9. **Performance Analytics** — Their class attendance trends, ratings, feedback
10. **Profile Management** — Bio, specialties, certifications, photos

### Nice-to-Have Features
- Music playlist integration (Spotify/Apple Music)
- Exercise video library for class planning
- Member fitness assessment forms (digital)
- Class difficulty rating from attendees
- Integration with wearable fitness devices
- Social sharing of class achievements

### Pain Points to Address
- **Schedule Changes** — Last-minute class cancellations or room changes not communicated
- **No-Show Members** — Members who book but don't attend; wasted capacity
- **Limited Client Context** — Not knowing member fitness levels or injuries before class
- **Substitution Hassle** — Finding coverage is often manual (group chat, phone calls)
- **Administrative Burden** — Too much paperwork takes time away from coaching

### Platform Preference
- **Web: 30%** — Class planning, content creation, detailed note review
- **Mobile: 70%** — Schedule checking, attendance taking, quick notes, availability updates
- **Rationale**: Teachers are always on the move between classes. Mobile-first is essential. Web is for deeper planning sessions at home. The mobile experience must be optimized for quick interactions (attendance takes <30 seconds).

### Dashboard Priorities
1. Today's classes with times and room numbers
2. Next class countdown with quick attendance link
3. Weekly schedule overview
4. New messages from members or managers
5. Substitution requests (pending)
6. Class attendance trend (this week vs last)

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| Critical | Class cancellation or room change | Push + SMS |
| High | New substitution request | Push |
| High | Member booked into your class | Push |
| Medium | Availability reminder (gap in schedule) | Push |
| Low | Weekly attendance summary | Email |

### Time Sensitivity
- **Real-Time**: Class changes, substitution requests, emergency notifications
- **Near Real-Time**: Attendance taking (during class), availability updates
- **Batch**: Weekly schedule confirmation, monthly performance review

---

## 5. Client

### Role Summary
The Client is the paying gym member who uses OhMyGold to manage their fitness journey. They range from casual gym-goers to dedicated fitness enthusiasts. Their primary interaction with the platform is through the mobile app — booking classes, tracking progress, managing their subscription, and staying connected with their gym community.

### Primary Goals
- Easily book and manage class reservations
- Track workout history, attendance, and fitness progress
- Manage subscription, payments, and billing information
- Stay informed about gym news, schedule changes, and promotions
- Discover new classes and coaches that match their fitness goals

### Daily Workflow
1. Open the app to check today's class schedule
2. Book a class for today or the upcoming week
3. View booking confirmation and add to calendar
4. Arrive at gym and self check-in via QR code
5. Post-workout: log workout notes or view class history
6. Check progress stats (attendance streak, workouts this month)
7. Review any notifications (schedule changes, promotions)
8. Manage subscription settings if needed

### Must-Have Features (Top 10)
1. **Class Booking** — Browse schedule, filter by type/time/coach, book with one tap
2. **Booking Management** — View upcoming bookings, cancel within policy
3. **Self Check-In** — QR code display, GPS-verified check-in
4. **Subscription Management** — View plan, upgrade/downgrade, freeze
5. **Payment History** — View invoices, payment methods, download receipts
6. **Workout Stats** — Attendance count, streaks, class history, calories
7. **Coach Profiles** — View coach bios, specialties, class schedules
8. **Gym Info** — Hours, location, contact, announcements
9. **Waitlist** — Join waitlist for full classes, auto-promote notifications
10. **Account Settings** — Profile, password, notifications preferences, 2FA

### Nice-to-Have Features
- Fitness goal setting and tracking
- Integration with Apple Health / Google Fit
- Social features (follow friends, class leaderboard)
- Nutrition tracking integration
- In-app messaging with coaches
- Personalized class recommendations
- Rewards/loyalty program
- Video on-demand library

### Pain Points to Address
- **Booking Anxiety** — Popular classes fill up fast; need waitlist and reminders
- **Cancellation Confusion** — Unclear cancellation policies lead to frustration
- **Check-In Friction** — Long front-desk lines ruin the experience
- **Lack of Progress Visibility** — Members lose motivation without clear progress tracking
- **Schedule Changes** — Classes get cancelled/changed without timely notification
- **Payment Surprises** — Unexpected charges or failed auto-payments

### Platform Preference
- **Web: 15%** — Subscription management, payment method updates, detailed progress review
- **Mobile: 85%** — Class booking, check-in, schedule browsing, quick account actions
- **Rationale**: The mobile app IS the gym member experience. Every interaction should be possible in under 30 seconds. Web is a secondary channel for complex tasks like payment management and data export.

### Dashboard Priorities
1. Next booked class with countdown and check-in button
2. Quick book section (popular classes, recommended for you)
3. This week's schedule overview
4. Attendance streak / progress summary
5. Latest gym announcement
6. Active subscription status and next billing date

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| High | Booking confirmed/cancelled | Push |
| High | Class starting reminder (15 min) | Push |
| High | Schedule change (class cancelled) | Push + SMS |
| Medium | Promoted from waitlist | Push |
| Medium | Payment successful/failed | Push + Email |
| Low | New class added, promotion | Push |
| Low | Weekly workout summary | Email |

### Time Sensitivity
- **Real-Time**: Class reminders, schedule changes, waitlist promotions
- **Near Real-Time**: Booking confirmations, payment alerts
- **Batch**: Weekly progress summary, monthly billing statement

---

## 6. Visitor

### Role Summary
The Visitor is a prospective gym member or non-logged-in user exploring OhMyGold. They may have discovered the gym through a web search, social media, referral, or walk-by. Their primary goal is to evaluate whether this gym is right for them. The platform must convert them from curious browser to trial member to paying client.

### Primary Goals
- Explore the gym's offerings, facilities, and class schedule
- Understand subscription options and pricing
- Sign up for a trial session or guest pass
- Get a feel for the gym's community and coaching quality
- Easily contact the gym or book a tour

### Daily Workflow
1. Discover gym website or app (organic search, referral link, ad)
2. Browse class schedule to see what types of classes are offered
3. View coach profiles to assess instructor quality
4. Check subscription plans and pricing
5. View gym photos, virtual tour, or facility info
6. Sign up for a free trial or guest pass
7. Receive trial QR code and gym information
8. (Post-trial) Convert to full membership via guided flow

### Must-Have Features (Top 10)
1. **Gym Showcase** — Photo gallery, virtual tour, facility highlights
2. **Class Schedule Browser** — Full class schedule with descriptions (view-only)
3. **Coach Directory** — View all coaches, their bios, specialties, class types
4. **Subscription Plan Viewer** — Clear pricing, what's included, comparison
5. **Trial Signup Flow** — Simple, low-friction trial registration
6. **Digital Trial Pass** — QR code for trial check-in
7. **Contact/Tour Booking** — Easy contact form or tour scheduling
8. **Gym Information** — Location, hours, amenities, policies
9. **Promotional Content** — Current offers, new member specials
10. **Easy Conversion Flow** — Seamless upgrade from trial to paid membership

### Nice-to-Have Features
- Live chat with gym staff
- Video testimonials from members
- Class difficulty guide for beginners
- Fitness goal matcher ("Find your perfect class")
- Referral code entry (friend referral discount)
- Social media integration (follow gym Instagram)
- Class popularity indicators ("Only 2 spots left!")

### Pain Points to Address
- **Information Overload** — Too much info can overwhelm; needs progressive disclosure
- **Friction to Trial** — Any signup complexity kills conversion
- **Lack of Social Proof** — Need testimonials, ratings, and member count for credibility
- **Pricing Uncertainty** — Hidden fees or unclear pricing destroys trust
- **No Comparison Tool** — Can't compare plans side-by-side
- **Post-Trial Drop-Off** — No follow-up after trial = lost lead

### Platform Preference
- **Web: 60%** — Discovery typically starts on web (Google search, social media links)
- **Mobile: 40%** — Mobile app download happens after initial interest; trial QR on mobile
- **Rationale**: Visitors discover via web but the trial experience is mobile-first (QR code at check-in). The web experience must be compelling enough to drive app download. The mobile app post-download should focus on trial activation and conversion.

### Dashboard Priorities
1. Eye-catching gym hero image / value proposition
2. "Start Your Free Trial" CTA (prominent)
3. Class schedule preview (today/tomorrow)
4. Subscription plan teaser with pricing
5. Coach spotlight / featured trainer
6. Social proof (member count, testimonials)
7. Quick contact options (call, chat, book tour)

### Notification Needs
| Priority | Notification Type | Channel |
|----------|-------------------|---------|
| High | Trial confirmation with QR code | Email + Push |
| High | Trial reminder (day before) | Push + Email |
| High | Trial expiration warning | Push + Email |
| Medium | Special offer / promotion | Push |
| Medium | New class type announcement | Email |
| Low | Weekly gym newsletter | Email |

### Time Sensitivity
- **Real-Time**: Trial check-in QR code availability
- **Near Real-Time**: Trial signup confirmation, welcome message
- **Batch**: Promotional campaigns, newsletter, trial expiration reminders

---

## Role Interaction Map

```
                    +---------+
                    |  Admin  |
                    | (System |
                    |  Owner) |
                    +----+----+
                         |
           +-------------+-------------+
           |                           |
      +----v----+                 +----v----+
      | Manager |                 | Manager |
      |(Gym A)  |                 |(Gym B)  |
      +----+----+                 +----+----+
           |                           |
     +-----+-----+             +-------+-------+
     |     |     |             |       |       |
 +---v--+--v--+--v--+    +----v---+---v--+---v---+
 |Employee|Teacher|Client|    |Employee|Teacher|Client|
 +--------+-------+------+    +--------+-------+------+
     ^      ^      ^               ^      ^      ^
     |      |      |               |      |      |
     +------+------+---------------+------+------+
                         |
                    +----v----+
                    | Visitor |
                    |(Prospect|
                    |  Only)  |
                    +---------+
```

### Key Interaction Patterns

| Interaction | Description | Data Flow |
|-------------|-------------|-----------|
| Visitor → Client | Trial signup → membership conversion | CRM lead → Client account |
| Client → Employee | Help request at front desk | Client profile → Employee view |
| Client → Teacher | Class booking → attendance | Booking → Roster → Attendance |
| Employee → Manager | Escalation (billing, complaint) | Issue ticket → Manager approval |
| Manager → Admin | Location-level issue escalation | Alert → Admin intervention |
| Teacher → Manager | Substitution request | Availability change → Approval |
| Admin → All | Global announcement, policy change | Broadcast → All locations |

---

## Feature Usage Heatmap by Role

| Feature Category | Admin | Manager | Employee | Teacher | Client | Visitor |
|-----------------|-------|---------|----------|---------|--------|---------|
| User Management | High | Medium | Low | None | None | None |
| Location Mgmt | Low | High | Medium | Low | Low | Low |
| Memberships | Low | High | Medium | None | High | Medium |
| Billing | Low | High | Medium | None | Medium | Low |
| Classes | Low | High | High | High | High | High |
| CRM/Sales | Low | High | Medium | None | None | None |
| Marketing | Medium | Medium | Low | None | None | Low |
| Access Control | Low | Medium | High | None | High | Medium |
| POS/Inventory | Low | High | High | None | Low | None |
| Analytics | Medium | High | Low | Medium | Medium | None |
| Content Mgmt | Low | Medium | Low | Medium | Low | Medium |
| System Settings | High | None | None | None | Low | None |
| Mobile Features | Low | Medium | High | High | High | Medium |

---

*Document generated for OhMyGold RBAC System Architecture. Personas based on industry-standard gym management user research.*

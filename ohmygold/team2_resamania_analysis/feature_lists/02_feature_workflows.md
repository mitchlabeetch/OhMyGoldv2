# Top 20 Feature Workflows for OhMyGold
## Detailed Workflow Specifications for Resamania's Most Critical Features
### OhMyGold Workflow Blueprint — Team 2 Product Analysis

---

## Introduction

This document provides detailed, real-world inspired workflows for the **20 most important features** identified in Resamania's platform. Each workflow includes a concrete scenario, step-by-step process, success criteria, edge cases, user stories, screen specifications, and data flow descriptions.

---

## Feature 1: New Member Online Joining (Sales & Online Joining)

### Real-World Scenario
*Sarah discovers Gold's Gym through an Instagram ad. She clicks through to the website at 11 PM on a Tuesday, browses membership options, and decides to sign up for a Premium membership with class access. She completes the entire process in under 5 minutes and receives her digital membership card instantly.*

### Step-by-Step Workflow
1. **Prospect Arrival**: Sarah clicks the Instagram ad and lands on the Gold's Gym membership page
2. **Plan Selection**: She views a comparison of Basic ($29/mo), Premium ($49/mo), and Elite ($79/mo) plans with clear feature breakdowns
3. **AI Recommendation**: Based on her location and stated interests ("I love group classes"), the system highlights Premium as recommended
4. **Personal Details**: Sarah enters name, email, phone, DOB, emergency contact, and address
5. **Payment Setup**: She enters credit card details, selects monthly billing, and sets the billing date to the 1st
6. **Agreement Signing**: Digital membership agreement and waiver presented — Sarah reviews and e-signs
7. **Account Creation**: System creates member profile (ID: GG-2026-004892), sends welcome email with login credentials
8. **Digital Card Generation**: Digital membership card with dynamic QR code generated in the mobile app
9. **Welcome Sequence Triggered**: Automated welcome email sent, onboarding tips scheduled, class recommendation pushed
10. **Access Activated**: Gym access activated immediately — Sarah can visit tomorrow morning

### Success Criteria
- [ ] End-to-end signup completes in under 5 minutes
- [ ] Zero errors in payment processing (99.9% success rate)
- [ ] Digital card accessible within 60 seconds of signup
- [ ] Member can access gym within 5 minutes of signup completion
- [ ] Welcome email delivered within 2 minutes
- [ ] 80%+ of new members complete signup without contacting support

### Edge Cases
- **Payment Declined**: Show friendly error, suggest alternative payment method, save progress for retry
- **Incomplete Signup (Abandoned)**: Trigger email sequence at 1 hour, 24 hours, and 72 hours to re-engage
- **Duplicate Email**: Detect existing account and offer login/link instead of new signup
- **Underage Applicant**: Flag for guardian consent, require guardian co-sign
- **Corporate Membership**: Redirect to corporate verification flow with employer code

### User Story
> "As a prospective gym member, I want to sign up online at any time without visiting the gym, so that I can start my fitness journey immediately with minimal friction."

### Screens Involved
1. Membership Plan Selection Page (marketing site)
2. Personal Details Form (multi-step wizard)
3. Payment Information Entry (PCI-compliant iframe)
4. Digital Agreement Signing (DocuSign-style)
5. Confirmation & Welcome Screen
6. Account Dashboard (member portal)

### Data Flow
```
Prospect (Web Browser)
  → Plan Selection API (GET /membership-plans)
  → Profile Creation API (POST /members)
  → Payment Tokenization API (POST /payments/tokenize)
  → Member Creation API (POST /members/create)
  → Agreement Signing API (POST /agreements/sign)
  → Welcome Trigger (Event: member.created)
  → Access Control Sync (POST /access/activate)
  → Email Service (welcome sequence)
  → Mobile App (digital card generation)
```

---

## Feature 2: 360-Degree Member Profile View (Membership Management)

### Real-World Scenario
*Alex, a front desk staff member, receives a call from an upset member, John, who claims he was charged twice. Alex opens John's profile, sees the complete picture — payment history, recent check-ins, notes from previous interactions — and resolves the issue in under 3 minutes by identifying a processing error and issuing a refund.*

### Step-by-Step Workflow
1. **Profile Search**: Alex types "John Miller" into the global search bar
2. **Profile Load**: 360-degree profile loads showing header with photo, membership tier, status badge, and quick actions
3. **Payment Tab**: Alex clicks the Payments tab — sees last 12 months of transactions
4. **Anomaly Detection**: System highlights the duplicate charge with a red warning badge
5. **Contextual Information**: Side panel shows John's recent visit pattern (3x/week regular), last interaction note ("happy with new classes"), and communication history
6. **Quick Action**: Alex clicks "Issue Refund" on the duplicate charge, selects reason from dropdown
7. **Refund Processed**: System processes refund, logs action in audit trail, sends confirmation to John
8. **Note Added**: Alex adds a note: "Duplicate charge identified and refunded. Member satisfied."

### Success Criteria
- [ ] Profile loads in under 2 seconds
- [ ] All member data accessible within 3 clicks
- [ ] Search returns results in under 1 second
- [ ] Staff can complete common actions (freeze, refund, edit) from profile without navigation
- [ ] Complete interaction history visible in chronological timeline

### Edge Cases
- **Member Not Found**: Fuzzy search with suggestions ("Did you mean...?"), search by phone/email/alternate name
- **Data Loading Failure**: Graceful degradation — show cached data with refresh indicator
- **Concurrent Edit**: Real-time conflict detection with merge options
- **Sensitive Data**: Role-based field visibility (e.g., payment details hidden from non-finance roles)

### User Story
> "As a front desk staff member, I want to see everything about a member on one screen, so that I can quickly answer questions and resolve issues without navigating multiple pages."

### Screens Involved
1. Global Search Bar (omnibox)
2. Member Profile Header (summary card)
3. Profile Tabs: Overview, Membership, Payments, Bookings, Attendance, Notes, Communications
4. Quick Action Menu (freeze, cancel, refund, edit, message)
5. Activity Timeline (chronological feed)
6. Member Notes Editor

### Data Flow
```
Staff Search (GET /members/search?q=john+miller)
  → Member Profile API (GET /members/{id}/profile)
  → Payment History API (GET /members/{id}/payments)
  → Attendance API (GET /members/{id}/attendance)
  → Communications API (GET /members/{id}/communications)
  → Refund API (POST /payments/{id}/refund)
  → Notes API (POST /members/{id}/notes)
  → Audit Log (Event: action.performed)
```

---

## Feature 3: Automated Billing & Recurring Payments (Billing & Payments)

### Real-World Scenario
*Gold's Gym has 5,000 active members on various billing cycles. On the 1st of every month, the system processes approximately $180,000 in recurring payments. 42 payments fail due to expired cards, insufficient funds, or bank blocks. The automated retry system recovers 28 of these over the next 7 days, and the contact center handles the remaining 14 with personalized outreach.*

### Step-by-Step Workflow
1. **Billing Schedule Trigger**: At 6:00 AM on billing date, system initiates batch processing
2. **Payment Preparation**: System prepares payment batch — validates mandates, checks card expiry, flags known issues
3. **Payment Processing**: Payments submitted to payment processor in batches of 500
4. **Status Collection**: Results returned — successes logged, failures categorized by reason code
5. **Success Path**: Successful payments → Invoices generated → Receipts emailed → Revenue recognized
6. **Failure Handling**: Failed payments categorized:
   - Soft declines (insufficient funds): Enter retry schedule (Day 3, Day 7, Day 14)
   - Hard declines (expired card): Immediate notification to member with update link
   - Bank blocks: Flag for manual review
7. **Retry Execution**: Retry 1 fires on Day 3 — 18 more payments succeed
8. **Contact Center Handoff**: After 3 failed attempts, case created for contact center
9. **Member Self-Service**: Members receive SMS/email with payment update link → Can pay online instantly
10. **Reconciliation**: End-of-day reconciliation report generated for finance team

### Success Criteria
- [ ] 99.5%+ of valid payments succeed on first attempt
- [ ] All payments processed within 4 hours of batch start
- [ ] 60%+ of soft declines recovered through retry logic
- [ ] Failed payment notifications sent within 15 minutes
- [ ] End-of-day reconciliation report available by 10 PM

### Edge Cases
- **Bank Holiday**: Billing date falls on holiday — process next business day with advance notice
- **Payment Gateway Outage**: Queue payments, retry every 15 minutes, alert ops team
- **Member Pays During Retry**: Cancel scheduled retry, mark as resolved
- **Disputed Payment**: Freeze disputed amount, create case, notify member services
- **Partial Batch Failure**: Retry failed subset, alert if >10% failure rate

### User Story
> "As a finance manager, I want billing to run automatically and reliably every month, so that I can focus on strategy rather than chasing payments."

### Screens Involved
1. Billing Dashboard (batch status, success/failure rates)
2. Payment Detail View (individual transaction status)
3. Retry Schedule Configuration (rules editor)
4. Failed Payment Queue (contact center worklist)
5. Reconciliation Report (finance export)
6. Member Payment Portal (self-service update)

### Data Flow
```
Billing Scheduler (Cron: 0 6 1 * *)
  → Payment Preparation Service (GET /billing/due)
  → Payment Processor API (POST /batch/payments)
  → Result Processor (Event: payment.processed)
  → Invoice Generator (POST /invoices/generate)
  → Retry Scheduler (POST /retry/schedule)
  → Notification Service (Event: payment.failed)
  → Contact Center API (POST /cases/create)
  → Reconciliation Service (Daily report)
```

---

## Feature 4: Class Booking with Waitlist (Booking & Scheduling)

### Real-World Scenario
*Maria loves the 7 PM Spin class on Tuesdays. She opens the Gold's Gym app at 6:45 PM, sees the class is full with 3 people on the waitlist. She joins the waitlist (position #4). At 6:55 PM, someone cancels — Maria receives a push notification, confirms her spot within 30 seconds, and arrives at the gym just in time for class.*

### Step-by-Step Workflow
1. **Schedule Browsing**: Maria opens app → Taps "Classes" → Filters by Tuesday, cycling
2. **Class Detail View**: She sees the 7 PM Spin class — "FULL" badge, 3 on waitlist, instructor: Jason
3. **Waitlist Join**: Taps "Join Waitlist" → Confirms → Added as position #4
4. **Cancellation Event**: At 6:52 PM, member #3 cancels via app → Spot opens
5. **Auto-Promotion**: System automatically promotes Maria from waitlist (first-come-first-served)
6. **Notification**: Push notification sent: "Spot available in Spin with Jason at 7 PM! Confirm within 5 min."
7. **Confirmation**: Maria taps "Confirm My Spot" within 30 seconds → Booking confirmed
8. **Calendar Sync**: Class added to Maria's phone calendar automatically
9. **Reminder**: At 6:30 PM, reminder notification sent
10. **Check-in**: Maria arrives, scans QR code, class attendance recorded

### Success Criteria
- [ ] Booking confirmation within 2 seconds
- [ ] Waitlist notification delivered within 30 seconds of cancellation
- [ ] 80%+ of promoted waitlist members confirm within the window
- [ ] Zero double-bookings (race condition handling)
- [ ] Calendar sync works on iOS and Android

### Edge Cases
- **No Response to Waitlist**: If Maria doesn't confirm within 5 min, spot offered to next person
- **Multiple Cancellations**: Handle multiple spots opening simultaneously without race conditions
- **Class Cancelled by Instructor**: All booked members notified, waitlist cleared, alternative suggestions offered
- **Late Check-in**: Member arrives 10 min late — can still check in but flagged as late
- **No-Show**: Member doesn't attend — no-show recorded, late cancellation fee applied if <12 hours

### User Story
> "As a gym member, I want to easily book popular classes and join waitlists, so that I never miss my favorite workouts even when classes are full."

### Screens Involved
1. Class Schedule Browser (filterable calendar view)
2. Class Detail Card (instructor, capacity, intensity, equipment)
3. Booking Confirmation Modal
4. Waitlist Position Indicator
5. Push Notification (spot available)
6. Booking Management (my bookings list)
7. Class Check-in Screen

### Data Flow
```
Member opens schedule (GET /classes?date=2026-05-06&type=spin)
  → Class Detail (GET /classes/{id})
  → Join Waitlist (POST /waitlist/join)
  → Cancellation (POST /bookings/{id}/cancel)
  → Auto-Promotion (Event: booking.cancelled)
  → Notification Service (Event: waitlist.promoted)
  → Confirm Booking (POST /bookings/confirm)
  → Calendar Sync (iCal/Google Calendar API)
  → Check-in (POST /attendance/check-in)
```

---

## Feature 5: QR Code Gym Entry (Access Control)

### Real-World Scenario
*David arrives at Gold's Gym at 6:00 AM for his morning workout. There are 12 people ahead of him in line. He opens the app, his dynamic QR code is ready, he scans at the turnstile, gets a green light, and walks through — total time from app open to entry: 4 seconds. The gym capacity display shows "87/200" members currently inside.*

### Step-by-Step Workflow
1. **App Open**: David opens Gold's Gym app → Digital membership card screen appears with dynamic QR
2. **QR Generation**: QR code is dynamically generated with embedded timestamp, member ID, and cryptographic signature
3. **Scan at Turnstile**: QR scanned by reader at entry point → Encoded data extracted
4. **Validation**: System validates:
   - QR signature authentic (not forged)
   - QR not expired (generated within last 5 minutes)
   - Membership active (not expired/frozen)
   - Access permitted for this location and time
   - No payment blocks (failed payments resolved)
5. **Access Decision**: All checks pass → Green light + audible beep → Turnstile unlocks
6. **Entry Logged**: Entry timestamp recorded → Member count incremented to 88
7. **Capacity Update**: Real-time capacity display updated → Available on app for other members
8. **Duration Tracking**: Timer starts for visit duration calculation

### Success Criteria
- [ ] QR generation in under 1 second
- [ ] Entry validation in under 500ms
- [ ] 99.9%+ uptime for access control system
- [ ] Zero unauthorized entries
- [ ] Real-time capacity accurate within 5 seconds

### Edge Cases
- **Phone Battery Dead**: Member can use RFID card backup or verify ID at front desk
- **No Internet**: Offline QR validation with cached membership data + sync when online
- **Expired QR**: QR older than 5 minutes rejected → Member regenerates
- **Membership Lapsed**: Access denied → Friendly message with renewal link
- **Capacity Full**: Entry allowed for existing members but new check-ins paused → Notification sent
- **QR Screenshot Sharing**: Dynamic QR prevents sharing — invalidated when used by different device

### User Story
> "As a gym member, I want to enter the gym quickly and seamlessly using my phone, so that I never have to worry about forgetting my membership card."

### Screens Involved
1. Digital Membership Card (QR display, full screen)
2. Entry Status Indicator (green/red with message)
3. Gym Occupancy Widget (current capacity)
4. Access History (member's entry log)
5. Backup Entry Options (RFID, manual verification)

### Data Flow
```
App loads (GET /members/{id}/access-token)
  → QR Generation (Client-side with server-signed payload)
  → Scan Event (POST /access/validate)
  → Validation Service (Check membership, payments, access rules)
  → Access Log (POST /access/entry)
  → Capacity Counter (Increment)
  → Access Control Hardware (Open signal)
  → Real-time Broadcast (WebSocket: capacity.update)
```

---

## Feature 6: Lead Management & Sales Pipeline (CRM)

### Real-World Scenario
*Tom, a sales manager at Gold's Gym, has a team of 4 sales consultants. He starts his Monday morning by reviewing the sales dashboard — 23 new leads came in over the weekend from website enquiries, walk-ins, and social media. He assigns them to his team based on availability and expertise. By Friday, 8 have booked tours, 5 have joined, and the remaining 10 are in automated nurture sequences.*

### Step-by-Step Workflow
1. **Lead Capture**: Weekend leads collected from:
   - Website "Join Now" enquiries (12 leads)
   - Walk-in registrations (6 leads)
   - Instagram click-to-call (3 leads)
   - Member referrals (2 leads)
2. **Lead Scoring**: AI scores each lead based on demographics, source, and behavior (A, B, C priority)
3. **Auto-Assignment**: High-priority leads auto-assigned to top performers; others distributed round-robin
4. **Sales Dashboard**: Tom views Monday morning dashboard — 23 new leads, pipeline value $47,500, conversion rate at 22%
5. **First Contact**: Sales consultants begin outreach within 2 hours — calls, emails, SMS based on lead preference
6. **Pipeline Progression**: Leads moved through stages:
   - New → Contacted → Qualified → Tour Booked → Proposal → Closed Won/Lost
7. **Automated Nurturing**: Leads not ready to buy enter 14-day nurture sequence with fitness tips, success stories, and limited-time offers
8. **Performance Review**: Tom reviews individual consultant performance — calls made, response time, conversion rate
9. **Weekly Report**: Automated report generated showing pipeline health, forecasted revenue, and coaching recommendations

### Success Criteria
- [ ] All leads contacted within 2 business hours
- [ ] 50%+ of qualified leads book a tour
- [ ] 30%+ tour-to-member conversion rate
- [ ] Sales dashboard updates in real-time
- [ ] Automated nurture sequence has 15%+ engagement rate

### Edge Cases
- **Duplicate Lead**: System detects and merges duplicates, preserving all interaction history
- **Lead Requests Unsubscribe**: Immediately removed from sequences, flagged as do-not-contact
- ** Consultant Sick**: Leads auto-redistributed to available team members
- **Lead Goes Cold**: After 30 days of no activity, moved to long-term nurture with monthly touchpoints
- **Competitor Enquiry**: Flagged in CRM with note about competitor interest

### User Story
> "As a sales manager, I want to see all my leads in one pipeline with automated follow-ups, so that no prospect falls through the cracks and my team can focus on closing."

### Screens Involved
1. Sales Dashboard (KPIs, leaderboard, pipeline value)
2. Lead Inbox (new leads queue)
3. Lead Detail View (contact info, score, history, actions)
4. Pipeline Board (Kanban-style drag-and-drop stages)
5. Activity Log (calls, emails, meetings)
6. Performance Report (individual and team)
7. Nurturing Sequence Editor

### Data Flow
```
Lead Sources (Web form, Walk-in, Social, Referral)
  → Lead Capture API (POST /leads/create)
  → Lead Scoring Engine (AI model)
  → Assignment Service (Round-robin / Load-balanced)
  → CRM Profile (GET /leads/{id})
  → Outreach Actions (POST /communications/send)
  → Pipeline API (PUT /leads/{id}/stage)
  → Nurturing Engine (Event: lead.stage_changed)
  → Analytics Service (Pipeline metrics, forecasts)
```

---

## Feature 7: Marketing Automation — Win-Back Campaign (Marketing & Retention)

### Real-World Scenario
*Lisa was a regular at Gold's Gym but hasn't visited in 21 days. The system flags her as "at-risk." She receives a personalized "We miss you" email on day 22 with a 20% discount on her next month's membership and a class recommendation based on her past attendance. She clicks through, books a yoga class, and returns the next day.*

### Step-by-Step Workflow
1. **Behavioral Monitoring**: System tracks Lisa's attendance — last visit 21 days ago, previously 4x/week
2. **Risk Scoring**: AI calculates churn risk at 78% based on attendance drop + no bookings + support ticket history
3. **Trigger Activation**: Day 22 — "At-Risk Member" automation triggers
4. **Segment Matching**: Lisa matched to "High-Value At-Risk" segment (6+ months tenure, >$50/month)
5. **Personalization Engine**: Email content personalized:
   - Subject: "Lisa, your yoga mat misses you 🧘"
   - Class recommendation: "Thursday 7 PM Yoga with Sarah" (based on her past attendance)
   - Offer: "20% off next month" (high-value segment offer)
   - Social proof: "347 members attended yoga this week"
6. **Multi-Channel Delivery**: Email sent at optimal time (6 PM based on her open history) + App push notification
7. **Engagement Tracking**: Email opened at 6:23 PM, link clicked at 6:25 PM
8. **Action Taken**: Lisa clicks "Book My Class" → Yoga class booked → Notification: "See you Thursday!"
9. **Outcome**: Lisa attends yoga Thursday → Churn risk drops to 15% → Campaign marked successful
10. **ROI Report**: Campaign ROI calculated — $5.20 cost to save $600 annual membership

### Success Criteria
- [ ] At-risk members identified within 24 hours of pattern detection
- [ ] 40%+ email open rate for win-back campaigns
- [ ] 15%+ click-through rate
- [ ] 25%+ of targeted members return within 14 days
- [ ] Positive ROI on all retention campaigns (>$10 saved per $1 spent)

### Edge Cases
- **Member Already Cancelled**: Win-back doesn't trigger — different cancellation recovery flow activates
- **Member on Vacation**: Member set "away" status in app — suppression list respected
- **Multiple Risk Factors**: Member flagged by multiple rules → Priority system prevents spam (max 1 campaign/week)
- **Unsubscribe**: Member opts out → Removed from all automated sequences immediately
- **No Response**: After 7 days, escalation to personal phone call from membership team

### User Story
> "As a marketing manager, I want to automatically identify and re-engage at-risk members with personalized campaigns, so that I can reduce churn without manual intervention."

### Screens Involved
1. Retention Dashboard (at-risk member count, campaign performance)
2. Automation Builder (drag-and-drop journey editor)
3. Segment Definition (criteria builder)
4. Email Template Editor (with personalization tokens)
5. Campaign Performance Report (opens, clicks, conversions)
6. Member Risk Scorecard (individual member view)

### Data Flow
```
Attendance Data (Event: check-in.recorded)
  → Risk Scoring Engine (Daily calculation)
  → Trigger Evaluation (Event: risk.threshold_crossed)
  → Segment Matcher (GET /segments/evaluate)
  → Personalization Engine (GET /members/{id}/preferences)
  → Message Composer (Template + Data)
  → Delivery Service (Email + Push)
  → Engagement Tracker (Event: email.opened, link.clicked)
  → Conversion Tracker (Event: booking.created, check-in.recorded)
  → ROI Calculator (Campaign cost vs. revenue retained)
```

---

## Feature 8: POS Retail Sale (POS & Inventory)

### Real-World Scenario
*After his workout, James buys a protein shake ($6.50), a resistance band ($12.99), and a Gold's Gym t-shirt ($24.99) from the front desk. The staff member rings up all items in under 30 seconds, applies James's 10% member discount, processes contactless payment, and the inventory updates automatically.*

### Step-by-Step Workflow
1. **Item Scanning**: Staff scans protein shake barcode → Product appears on screen with image and price
2. **Manual Add**: Staff searches "resistance band" → Selects from results → Added to cart
3. **T-shirt Selection**: Staff selects t-shirt from favorites → Prompted for size "Large" → Added to cart
4. **Cart Review**: Cart shows 3 items, subtotal $44.48
5. **Member Lookup**: James provides phone number → Member profile linked → 10% member discount auto-applied
6. **Payment**: Total $40.03. James taps contactless card → Payment processed → Receipt printed and emailed
7. **Inventory Update**: Stock levels auto-reduced: protein shake (-1), band (-1), t-shirt L (-1)
8. **Transaction Logged**: Sale recorded against James's profile and staff member

### Success Criteria
- [ ] Transaction completes in under 30 seconds
- [ ] 99.9%+ payment processing success
- [ ] Inventory updates in real-time
- [ ] Member discount applied automatically
- [ ] Receipt delivered within 1 minute

### Edge Cases
- **Item Not in System**: Quick-add product mode for new items
- **Payment Declined**: Friendly prompt, offer alternative payment method
- **Out of Stock**: Visual indicator at POS, suggest alternative product
- **Return/Refund**: Reverse transaction, update inventory, process refund to original payment method
- **No Barcode**: Visual product grid for quick selection
- **Split Payment**: Allow multiple payment methods for single transaction

### User Story
> "As a front desk staff member, I want to quickly process retail sales with automatic member discounts, so that members have a smooth checkout experience after their workout."

### Screens Involved
1. POS Interface (product grid/scanner input)
2. Cart View (items, quantities, discounts)
3. Member Lookup (phone/email search)
4. Payment Screen (card/cash/gift card)
5. Receipt (print + email options)
6. Quick-Add Product (for non-barcoded items)
7. Return/Refund Interface

### Data Flow
```
Barcode Scan (GET /products?barcode=123456)
  → Cart Management (POST /cart/add)
  → Member Lookup (GET /members?phone=5551234)
  → Discount Engine (GET /promotions/apply)
  → Payment Processing (POST /payments/process)
  → Inventory Update (POST /inventory/adjust)
  → Transaction Log (POST /transactions/create)
  → Receipt Generation (POST /receipts/generate)
  → Member Profile Update (POST /members/{id}/purchases)
```

---

## Feature 9: Real-Time Capacity & Occupancy Dashboard (Analytics & Access)

### Real-World Scenario
*It's Monday at 5:30 PM — peak hour at Gold's Gym Downtown. The facility manager, Rachel, monitors the live dashboard showing 187 of 200 capacity. She notices the free weights area is at 95% while the pool is at 30%. She sends a push notification to nearby members suggesting the pool area, and opens the overflow studio for additional training space.*

### Step-by-Step Workflow
1. **Real-Time Tracking**: Every entry/exit updates the live count via access control integration
2. **Dashboard View**: Rachel sees:
   - Total occupancy: 187/200 (93%) — Yellow warning
   - Free weights: 45/50 (95%) — Red
   - Cardio zone: 32/50 (64%) — Green
   - Pool: 8/30 (27%) — Green
   - Studio A: 12/20 (60%) — Green
3. **Trend Analysis**: Graph shows predicted peak at 6:30 PM based on historical data
4. **Alert Trigger**: Free weights area hits 95% → Alert sent to Rachel's phone
5. **Member Communication**: Rachel sends push notification: "Pool area quiet right now! Perfect time for a swim 🏊"
6. **Overflow Action**: Studio B opened as overflow training space → Updated on app
7. **Post-Peak**: At 7:30 PM, capacity drops to 120 → Normal operations resume
8. **Daily Report**: End-of-day occupancy report generated with peak times and zone utilization

### Success Criteria
- [ ] Capacity count accurate within 1 person
- [ ] Dashboard updates within 5 seconds of entry/exit
- [ ] 100% uptime during operating hours
- [ ] Alert delivery within 10 seconds of threshold breach
- [ ] Historical trend prediction within 10% accuracy

### Edge Cases
- **Sensor Malfunction**: Manual override capability, alert maintenance team
- **Emergency Evacuation**: Instant capacity reset to zero, emergency mode activated
- **Multiple Entries**: Group entry (family, class) handled correctly
- **Staff Entry**: Staff entries optionally excluded from member capacity count
- **After-Hours Access**: 24/7 member access tracked separately from staffed hours

### User Story
> "As a facility manager, I want to see real-time occupancy across all gym zones, so that I can optimize space usage and ensure member safety during peak hours."

### Screens Involved
1. Live Capacity Dashboard (real-time numbers + visual floor plan)
2. Zone Breakdown (per-area occupancy)
3. Trend Chart (historical + predicted)
4. Alert Management (threshold configuration)
5. Member Communication (push notification composer)
6. Daily Occupancy Report (exportable)

### Data Flow
```
Access Control Events (WebSocket: access.entry, access.exit)
  → Capacity Calculator (Real-time count per zone)
  → Dashboard Broadcast (WebSocket: capacity.update)
  → Alert Engine (Event: threshold.breached)
  → Notification Service (Push to managers)
  → Historical Store (Time-series database)
  → Prediction Engine (ML model for forecasting)
  → Reporting Service (Daily aggregate reports)
```

---

## Feature 10: Staff Role & Permission Management (Staff Management)

### Real-World Scenario
*Gold's Gym has 25 staff across 3 locations — front desk, personal trainers, class instructors, sales consultants, and managers. The Operations Director needs to ensure that front desk staff can check in members and process sales, but cannot see financial reports or modify membership prices. Trainers can view their class rosters but not member payment information.*

### Step-by-Step Workflow
1. **Role Creation**: Operations Director creates roles:
   - Front Desk (check-in, POS, member lookup, basic profile edits)
   - Personal Trainer (class rosters, member workout notes, own schedule)
   - Sales Consultant (leads, pipeline, member sign-ups, own metrics)
   - Club Manager (all above + reports, staff management, pricing)
   - Finance Manager (all financial data, reports, billing management)
   - Operations Director (full access across all locations)
2. **Permission Granularity**: Each role defined with 50+ granular permissions:
   - Member data: View / Edit / Export
   - Payments: View / Process Refund / Modify
   - Reports: View Own / View All / Export
   - Settings: View / Modify
3. **Site Assignment**: Staff assigned to specific locations with cross-site rules
4. **Approval Workflows**: Sensitive actions require approval:
   - Refunds > $50 → Manager approval
   - Membership cancellations → Manager approval
   - Price changes → Director approval
5. **Audit Trail**: Every action logged with staff ID, timestamp, and before/after values
6. **Access Review**: Quarterly access review with automatic reports of who has what access

### Success Criteria
- [ ] Role assignment takes under 2 minutes per staff member
- [ ] Zero unauthorized access incidents
- [ ] All sensitive actions require appropriate approval
- [ ] Complete audit trail for compliance
- [ ] Quarterly access review completed on schedule

### Edge Cases
- **Staff Transfers Between Locations**: Site permissions updated with effective date
- **Temporary Elevated Access**: Manager on vacation can grant temp access with auto-expiry
- **Shared Accounts Prohibited**: Each staff member has unique login, no shared credentials
- **Terminated Employee**: Immediate access revocation with one click, audit log preserved
- **Role Conflict Detection**: System warns if staff has conflicting roles across locations

### User Story
> "As an operations director, I want granular control over what each staff member can see and do, so that sensitive data is protected and staff can only access what they need for their role."

### Screens Involved
1. Role Manager (create/edit roles)
2. Permission Matrix (grid of roles × permissions)
3. Staff Directory (list with roles and sites)
4. Approval Queue (pending approvals)
5. Audit Log Viewer (searchable action history)
6. Access Review Dashboard (quarterly review tool)

### Data Flow
```
Role Definition (POST /roles/create)
  → Permission Assignment (PUT /roles/{id}/permissions)
  → Staff Assignment (POST /staff/{id}/roles)
  → Site Assignment (POST /staff/{id}/sites)
  → Action Authorization (Middleware: check permissions)
  → Approval Workflow (POST /approvals/request)
  → Audit Log (Event: action.authorized/denied)
  → Access Review (GET /audit/access-report)
```

---

## Feature 11: Multi-Site Management Dashboard (Multi-Site & Franchise)

### Real-World Scenario
*Gold's Gym operates 12 locations across the region. The Regional Director, Michael, starts his week reviewing the consolidated dashboard. He notices that Downtown location has 15% lower visit frequency than last month, while the Suburban location is oversubscribed. He decides to run a targeted promotion at Downtown and transfer some memberships to Suburban.*

### Step-by-Step Workflow
1. **Consolidated Dashboard**: Michael logs in → Sees all 12 locations on one dashboard
   - Total members: 8,450 (+2.3% MoM)
   - Monthly revenue: $412,500 (+1.8% MoM)
   - Average visits/member: 3.2 (-0.4 vs last month)
   - NPS: 72 (stable)
2. **Site Comparison**: Dashboard shows per-site breakdown:
   - Downtown: 2,100 members, 2.8 avg visits (-15% vs last month) 🚨
   - Suburban: 1,800 members, 4.1 avg visits, 94% capacity ⚠️
   - Uptown: 1,200 members, 3.5 avg visits (healthy) ✅
3. **Drill-Down**: Michael clicks Downtown → Sees detailed metrics:
   - Peak hours unchanged but off-peak visits dropped
   - Class attendance down 20%
   - Recent competitor opened nearby
4. **Action Taken**: Michael creates a targeted promotion for Downtown members:
   - "Bring a Friend Free" for off-peak hours
   - New class schedule with trending formats
5. **Deployment**: Promotion deployed to Downtown only via central management
6. **Monitoring**: Week-over-week tracking shows 8% improvement after promotion
7. **Reporting**: Monthly franchise report generated with KPIs for all stakeholders

### Success Criteria
- [ ] All 12 sites visible on single dashboard with <3 second load
- [ ] Cross-site comparisons available with benchmarking
- [ ] Promotions deployable to selected sites within 5 minutes
- [ ] Consolidated financial reporting with per-site breakdown
- [ ] Weekly automated performance summary email to stakeholders

### Edge Cases
- **New Site Opening**: Pre-opening checklist template, gradual member migration
- **Site Closure**: Member transfer workflow, prorated refund handling
- **Franchisee Dispute**: Audit trail of all changes, read-only access for franchisee
- **Different Time Zones**: All reports normalized to local time per location
- **Partial System Outage at One Site**: Other sites unaffected, outage site flagged

### User Story
> "As a regional director, I want to see all my gym locations on one dashboard with the ability to compare performance and deploy changes centrally, so that I can scale efficiently while maintaining quality."

### Screens Involved
1. Multi-Site Dashboard (consolidated KPIs)
2. Site Comparison Table (sortable, filterable)
3. Site Detail View (drill-down per location)
4. Central Promotion Manager (deploy to selected sites)
5. Cross-Site Report Builder (custom comparisons)
6. Franchisee Scorecard (performance ranking)

### Data Flow
```
Per-Site Data (12 locations)
  → Aggregation Service (Real-time roll-up)
  → Multi-Site Dashboard API (GET /dashboard/multi-site)
  → Comparison Engine (Benchmark calculations)
  → Promotion Deployment (POST /promotions/deploy)
  → Site-Specific Config (Per-location overrides)
  → Reporting Service (Consolidated exports)
  → Alert Engine (Cross-site anomaly detection)
```

---

## Feature 12: Member Mobile App Experience (Member App)

### Real-World Scenario
*Emma is a Premium member at Gold's Gym. She uses the app daily — to check class schedules, book sessions, view her workout history, manage her subscription, and scan into the gym. She receives a push notification that her favorite instructor is teaching a new class format, books it immediately, and later that day leaves a 5-star review.*

### Step-by-Step Workflow
1. **Morning Check**: Emma opens app → Home screen shows:
   - Digital membership card (tap to expand QR)
   - Upcoming classes today (2 booked)
   - Gym capacity: "Quiet right now — perfect time!"
   - Weekly progress: 3/4 workouts completed
2. **Class Discovery**: Scrolls to "Recommended for You" → AI suggests "HIIT Blast — new!" based on her history
3. **Booking**: Taps class → Views details (instructor Mike, 45 min, high intensity) → Books → Confirms
4. **Gym Entry**: Arrives at gym → Taps card widget → QR displayed → Scans → Entry granted
5. **Workout Log**: After workout, logs session manually → Selects "Strength Training" → Enters exercises → Saves
6. **Account Management**: Checks billing → Sees next payment June 1st → Views past payments → Downloads invoice
7. **Feedback**: Receives post-class notification → Rates class 5 stars → Leaves comment "Mike is amazing!"
8. **Social**: Shares workout achievement to Instagram story → "Completed 4 workouts this week! 💪"

### Success Criteria
- [ ] App loads in under 2 seconds
- [ ] Class booking completes in under 10 seconds
- [ ] QR code accessible in under 3 seconds
- [ ] 4.5+ star app store rating
- [ ] 70%+ of active members use app weekly
- [ ] Push notification open rate >25%

### Edge Cases
- **No Internet Connection**: Cached data for schedules, offline QR code generation
- **App Crash**: State recovery, crash reporting, graceful error handling
- **Outdated App**: Friendly update prompt with changelog
- **Biometric Login Failure**: Fallback to PIN/password
- **Member Switches Gyms**: App updates to new location automatically

### User Story
> "As a gym member, I want a single app that handles everything — entry, booking, payments, and progress tracking — so that my gym experience is seamless and convenient."

### Screens Involved
1. Home Dashboard (personalized feed)
2. Digital Membership Card (QR + details)
3. Class Schedule (calendar view with filters)
4. Class Detail (instructor, intensity, booking)
5. Workout Logger (exercise tracking)
6. Profile & Settings (membership, payments, preferences)
7. Notifications Center (alerts and messages)
8. Progress Dashboard (workout history, goals)

### Data Flow
```
App Launch (GET /members/{id}/dashboard)
  → Class Data (GET /classes?member={id})
  → Booking API (POST /bookings/create)
  → Access Token (GET /members/{id}/access)
  → Workout Log (POST /workouts/log)
  → Payment Data (GET /members/{id}/payments)
  → Feedback (POST /classes/{id}/feedback)
  → Push Notifications (Firebase/APNs)
  → Social Sharing (Native OS sharing)
```

---

## Feature 13: Class & Schedule Management (Booking & Scheduling)

### Real-World Scenario
*The Group Fitness Coordinator, Priya, plans next month's schedule. She reviews class popularity analytics, sees that Yoga has 95% occupancy while Pilates is at 60%. She adds two more Yoga slots, reduces Pilates to one, introduces a new "Power Yoga" format, assigns instructors, and publishes the schedule to members — all in under 30 minutes.*

### Step-by-Step Workflow
1. **Analytics Review**: Priya opens class analytics dashboard:
   - Yoga: 95% avg occupancy, 4.8★ rating → Add more slots
   - Pilates: 60% avg occupancy → Reduce frequency
   - Spin: 88% occupancy, stable → Maintain
2. **Schedule Builder**: Opens drag-and-drop schedule builder for next month
3. **Add Classes**: 
   - Drag "Yoga" to Monday 7 PM and Thursday 7 PM
   - Drag "Power Yoga (NEW)" to Saturday 10 AM
   - Reduce "Pilates" to Wednesday 6 PM only
4. **Instructor Assignment**: 
   - Monday Yoga → Sarah (confirmed available)
   - Thursday Yoga → Jason (confirmed available)
   - Saturday Power Yoga → Mike (flagged: certification needed)
5. **Room Booking**: Studio A assigned for all sessions → No conflicts detected
6. **Capacity Settings**: Yoga set to 25 spots, Power Yoga trial at 15 spots
7. **Preview**: Review complete schedule with conflict checker
8. **Publish**: Schedule published → Members notified of new classes → App updated instantly
9. **Monitoring**: First week metrics show Power Yoga at 100% — consider making it permanent

### Success Cases
- [ ] Complete monthly schedule created in under 30 minutes
- [ ] Zero scheduling conflicts (room/instructor overlap)
- [ ] All instructor certifications validated before assignment
- [ ] Members see published schedule within 1 minute
- [ ] Class occupancy data informs scheduling decisions

### Edge Cases
- **Instructor Calls in Sick**: Emergency substitution — find available instructor with same certification
- **Room Double-Booked**: Conflict alert at creation time, alternative room suggested
- **Class Cancellation**: Bulk notification to all booked members with rebooking suggestions
- **Overbooked Class**: Waitlist auto-activated, member communication automated
- **Public Holiday**: Schedule template adjustments for holiday weeks

### User Story
> "As a fitness coordinator, I want to build class schedules using data on popularity and availability, so that I can maximize room utilization and member satisfaction."

### Screens Involved
1. Class Analytics Dashboard (occupancy, ratings, trends)
2. Schedule Builder (drag-and-drop calendar)
3. Instructor Availability Panel (conflicts highlighted)
4. Room Allocation View (floor plan with bookings)
5. Conflict Checker (automated validation)
6. Publish Confirmation (review before go-live)
7. Member Notification Composer

### Data Flow
```
Analytics Engine (GET /classes/analytics)
  → Schedule Builder (POST /schedules/draft)
  → Instructor Availability (GET /instructors/available)
  → Room Availability (GET /rooms/available)
  → Conflict Checker (Validation engine)
  → Certification Validator (GET /instructors/{id}/certs)
  → Publish Service (POST /schedules/publish)
  → Notification Service (Event: schedule.published)
  → App Sync (Real-time schedule update)
```

---

## Feature 14: Failed Payment Recovery (Billing & Payments)

### Real-World Scenario
*Marcus's credit card expired on the 15th. His monthly membership payment of $49 fails on the 1st. The system detects the soft failure (expired card), sends him an immediate email with a one-click update link, and retries on day 3. Marcus updates his card on day 2, the retry succeeds, and his gym access is never interrupted.*

### Step-by-Step Workflow
1. **Payment Failure**: $49 payment fails on June 1st — reason code: "expired_card"
2. **Immediate Classification**: System classifies as "hard decline" (card issue, not funds)
3. **Instant Notification**: Email sent within 5 minutes:
   - Subject: "Update your payment method, Marcus"
   - Body: One-click link to update card, clear instructions
   - Also SMS sent as backup
4. **Member Action**: Marcus clicks link on June 2nd → Secure card update form → New card entered → Confirmed
5. **Retry Logic**: Scheduled retry on June 3rd → Card validated → Payment processed → Success
6. **Confirmation**: Receipt emailed, account shows "Active", next billing date July 1st
7. **Analytics**: Recovery marked as successful, 1-day recovery time logged
8. **Access Preserved**: Gym access never interrupted due to grace period configuration

### Success Criteria
- [ ] Failed payment notification sent within 5 minutes
- [ ] 70%+ of expired card failures resolved within 3 days
- [ ] Zero interruption to gym access during recovery (grace period)
- [ ] 50%+ of members update payment without contacting support
- [ ] Recovery analytics track resolution time and method

### Edge Cases
- **Multiple Failed Months**: Member 2 months behind → Payment plan option offered
- **Member Disputes Charge**: Payment frozen pending investigation, access maintained
- **Bank Blocks All Charges**: Alternative payment methods suggested (different card, Direct Debit)
- **Member Ignores All Contact**: After 14 days, account suspended, final notice sent
- **Fraudulent Card**: Flagged by fraud detection, manual review required

### User Story
> "As a member, I want to be quickly notified of payment issues with an easy way to fix them, so that my gym membership stays active without any hassle."

### Screens Involved
1. Payment Failure Notification (email/SMS)
2. Secure Card Update Page (PCI-compliant form)
3. Payment Recovery Dashboard (contact center view)
4. Member Payment Portal (self-service)
5. Payment Plan Creator (for arrears)
6. Recovery Analytics (finance team report)

### Data Flow
```
Payment Failure (Event: payment.failed)
  → Failure Classifier (Hard vs. Soft decline)
  → Notification Service (Email + SMS)
  → Card Update Form (GET /payments/update-form)
  → Card Tokenization (POST /payments/tokenize)
  → Retry Scheduler (Cron-based retry logic)
  → Payment Retry (POST /payments/retry)
  → Access Control Sync (POST /access/update)
  → Recovery Analytics (Resolution tracking)
```

---

## Feature 15: Marketing Campaign Builder & Execution (Marketing)

### Real-World Scenario
*The Marketing Manager, Chloe, wants to run a "Summer Body Challenge" campaign targeting members who haven't visited in 2 weeks. She creates an email with the drag-and-drop builder, sets up A/B testing for two subject lines, schedules it for Tuesday 6 PM, and tracks results in real-time. The campaign drives 120 class bookings and 8 membership upgrades.*

### Step-by-Step Workflow
1. **Campaign Creation**: Chloe opens Campaign Builder → Names campaign "Summer Body Challenge"
2. **Audience Selection**: Defines target segment:
   - Members active in last 90 days
   - No visit in last 14 days
   - Membership tier: Basic or Premium
   - Location: All sites
   → 450 members matched
3. **Email Design**: Uses drag-and-drop builder:
   - Header image (Summer Body Challenge banner)
   - Personalized greeting ("Hi {{first_name}}")
   - Challenge details and CTA button ("Book My First Class")
   - Footer with gym branding
4. **A/B Test Setup**: Tests two subject lines:
   - Variant A: "Your summer goals are waiting 🌞" (50%)
   - Variant B: "{{first_name}}, let's crush your summer goals 💪" (50%)
   → Winner determined by open rate after 4 hours
5. **Scheduling**: Set for Tuesday 6:00 PM (optimal time for this segment)
6. **Launch**: Campaign goes live → 450 emails sent → Real-time tracking begins
7. **Results** (24 hours later):
   - Open rate: 42% (A/B test: Variant B wins with 48% vs 36%)
   - Click rate: 18%
   - Class bookings: 120
   - Membership upgrades: 8 ($3,200 revenue)
   - ROI: 45:1

### Success Criteria
- [ ] Campaign created in under 15 minutes
- [ ] A/B test runs automatically with statistical significance
- [ ] Delivery rate >98%
- [ ] Real-time tracking dashboard updates within 1 minute
- [ ] Revenue attribution accurate for ROI calculation

### Edge Cases
- **Large Audience (>10K)**: Batch sending over time to avoid spam flags
- **Invalid Email Addresses**: Bounce handling, list cleaning automation
- **Member Unsubscribes**: Instant removal, compliance log updated
- **Campaign Underperforms**: Mid-campaign optimization suggestions
- **Duplicate Prevention**: Same member excluded from concurrent campaigns

### User Story
> "As a marketing manager, I want to create targeted campaigns with A/B testing and track results in real-time, so that I can optimize our marketing spend and drive measurable business results."

### Screens Involved
1. Campaign Builder (drag-and-drop email designer)
2. Audience Selector (segment builder)
3. A/B Test Configuration (variant editor)
4. Scheduling Panel (date/time picker)
5. Real-Time Dashboard (opens, clicks, conversions)
6. Campaign Report (detailed analytics)
7. Template Library (reusable templates)

### Data Flow
```
Campaign Creation (POST /campaigns/create)
  → Segment Evaluation (GET /segments/{id}/count)
  → Template Rendering (Personalization engine)
  → A/B Test Setup (Variant allocation)
  → Scheduling Service (Cron trigger)
  → Email Delivery Service (Batch send)
  → Engagement Tracking (Pixel + link tracking)
  → Conversion Attribution (Event: booking.created)
  → ROI Calculator (Revenue vs. cost)
  → Report Generation (Aggregate metrics)
```

---

## Feature 16: Personal Training Booking (Booking & Scheduling)

### Real-World Scenario
*Jennifer wants to book a personal training session with her preferred trainer, Alex. She opens the app, sees Alex's availability for the week, books a 60-minute strength session for Thursday 5 PM, pays the $75 session fee, and receives confirmation with prep instructions.*

### Step-by-Step Workflow
1. **Trainer Discovery**: Jennifer opens app → "Book a Session" → Views trainer profiles with:
   - Photos, bios, specializations, ratings, pricing
   - Filters by specialization (Strength, Weight Loss, Rehabilitation)
2. **Trainer Selection**: Selects Alex (Strength specialist, 4.9★, $75/hour)
3. **Availability View**: Sees Alex's available slots for the week
4. **Booking**: Selects Thursday 5 PM → 60 min → "Strength Training" → Clicks "Book"
5. **Payment**: Session fee $75 charged to saved card → Receipt generated
6. **Confirmation**: Email and push notification sent with:
   - Session details (date, time, trainer, location)
   - Preparation tips ("Bring water bottle, arrive 5 min early")
   - Cancellation policy (24-hour notice required)
7. **Calendar Sync**: Session added to Jennifer's personal calendar
8. **Reminder**: Push notification 2 hours before: "Session with Alex today at 5 PM!"
9. **Post-Session**: Jennifer rates the session 5 stars, books next session

### Success Criteria
- [ ] Booking completes in under 60 seconds
- [ ] Payment processing success rate >99%
- [ ] Trainer availability accurate in real-time
- [ ] 90%+ of booked sessions are attended
- [ ] Post-session rating completion rate >60%

### Edge Cases
- **Trainer Cancels**: Auto-notification to member, rebooking suggestions, refund processed
- **Member Late Cancellation**: Cancellation fee applied per policy, trainer notified
- **Double-Booking**: Conflict prevention — blocked at booking time
- **Payment Fails**: Grace period of 1 hour to update payment before slot released
- **Member No-Show**: Session marked complete, trainer compensated, no-show tracked

### User Story
> "As a gym member, I want to easily book personal training sessions with my preferred trainer and pay seamlessly, so that I can get personalized fitness guidance on my schedule."

### Screens Involved
1. Trainer Directory (profiles with filters)
2. Trainer Detail (bio, reviews, pricing)
3. Availability Calendar (bookable slots)
4. Booking Confirmation (session summary)
5. Payment Screen (session fee processing)
6. Session Reminders (push/email)
7. Post-Session Rating (feedback form)

### Data Flow
```
Trainer Directory (GET /trainers?specialization=strength)
  → Trainer Profile (GET /trainers/{id})
  → Availability (GET /trainers/{id}/availability)
  → Booking (POST /sessions/book)
  → Payment (POST /payments/sessions)
  → Calendar Sync (iCal/Google Calendar)
  → Reminder Service (Scheduled push)
  → Rating (POST /sessions/{id}/rating)
```

---

## Feature 17: Inventory Management & Reordering (POS & Inventory)

### Real-World Scenario
*The Inventory Manager, Rob, manages stock across 12 locations. The system alerts him that Downtown is down to 5 protein bars (reorder threshold: 10). He checks the auto-calculated reorder suggestion (50 units based on 4-week velocity), approves it with one click, and the purchase order is sent to the supplier. Stock arrives 3 days later and is scanned into inventory.*

### Step-by-Step Workflow
1. **Low Stock Alert**: System detects Downtown protein bar stock at 5 (below threshold of 10)
2. **Alert Delivery**: Rob receives email alert + dashboard notification
3. **Reorder Suggestion**: System calculates:
   - Current stock: 5
   - 4-week average sales: 45/week
   - Lead time: 3 days
   - Suggested reorder: 50 units (covers 1 week + buffer)
4. **Approval**: Rob reviews suggestion → One-click approve
5. **Purchase Order**: Auto-generated PO sent to supplier via email
6. **Tracking**: PO tracking number added, expected delivery in 3 days
7. **Delivery**: Stock arrives → Rob scans barcode → 50 units added to inventory
8. **Confirmation**: Stock level updated to 55, alert cleared, PO marked received

### Success Criteria
- [ ] Low stock alerts generated within 1 hour of threshold breach
- [ ] Reorder suggestions based on actual sales velocity
- [ ] Purchase order created and sent within 5 minutes of approval
- [ ] Inventory count accurate (99%+ match with physical count)
- [ ] Zero out-of-stock incidents for top 20 products

### Edge Cases
- **Supplier Out of Stock**: Alert Rob, suggest alternative suppliers
- **Delivery Delay**: System adjusts reorder point for next cycle
- **Damaged Goods**: Partial receipt with damage documentation, credit note requested
- **Bulk Discount Opportunity**: Alert if ordering across multiple locations saves money
- **Seasonal Variation**: System learns seasonal patterns and adjusts suggestions

### User Story
> "As an inventory manager, I want automated low-stock alerts with intelligent reorder suggestions, so that I never run out of popular products while minimizing excess inventory."

### Screens Involved
1. Inventory Dashboard (stock levels across locations)
2. Low Stock Alert Panel (actionable notifications)
3. Reorder Suggestion Card (with velocity data)
4. Purchase Order Manager (create/track POs)
5. Stock Receipt Scanner (barcode scan to receive)
6. Inventory History (stock movements log)
7. Supplier Directory (contact info, pricing)

### Data Flow
```
Sales Data (Event: sale.completed)
  → Inventory Counter (Stock decrement)
  → Threshold Monitor (Event: stock.low)
  → Reorder Calculator (Velocity-based suggestion)
  → Approval Workflow (Manager approval)
  → Purchase Order Service (POST /purchase-orders/create)
  → Supplier Notification (Email API)
  → Receipt Processing (POST /inventory/receive)
  → Stock Update (POST /inventory/adjust)
  → Alert Clearance (Low stock resolved)
```

---

## Feature 18: Custom Report Builder (Analytics & Reporting)

### Real-World Scenario
*The Finance Director, Karen, needs a quarterly report for the board showing revenue by membership tier, payment method, and location. She uses the custom report builder to create this in 10 minutes, schedules it to auto-generate every quarter, and exports it as a formatted PDF for the board presentation.*

### Step-by-Step Workflow
1. **Report Creation**: Karen opens Report Builder → "New Report" → Names it "Q2 Board Revenue Report"
2. **Data Source Selection**: Chooses "Revenue" as primary data source
3. **Field Selection**: Adds fields:
   - Revenue (sum, average)
   - Membership tier (grouping)
   - Payment method (grouping)
   - Location (grouping)
   - Month (time dimension)
4. **Filters Applied**: 
   - Date range: April 1 – June 30, 2026
   - Status: Active memberships only
   - Exclude: Test transactions
5. **Visualization**: Selects:
   - Bar chart: Revenue by tier
   - Pie chart: Payment method breakdown
   - Table: Detailed monthly breakdown
6. **Preview**: Reviews report with live data → Looks correct
7. **Schedule**: Sets quarterly auto-generation (1st of each quarter)
8. **Export**: Exports as PDF → Formatted with Gold's Gym branding → Ready for board

### Success Criteria
- [ ] Report created in under 10 minutes
- [ ] Report generates in under 30 seconds
- [ ] Export available in PDF, Excel, and CSV formats
- [ ] Scheduled reports auto-deliver on time
- [ ] Data accuracy 100% (verified against source)

### Edge Cases
- **Large Dataset**: Report for 50K+ members → Background processing with email notification
- **Complex Joins**: Multiple data sources → Visual relationship builder with validation
- **Permission Restrictions**: User only sees data for authorized locations
- **Report Timeout**: Automatic optimization suggestions for slow reports
- **Data Change After Export**: Audit trail of data as-of export time

### User Story
> "As a finance director, I want to build custom reports without technical skills and schedule them to run automatically, so that I can get the insights I need for board presentations without waiting for IT."

### Screens Involved
1. Report Builder (drag-and-drop interface)
2. Data Source Selector (available data tables)
3. Field Picker (metrics and dimensions)
4. Filter Builder (criteria with operators)
5. Visualization Gallery (chart types)
6. Preview Pane (live data preview)
7. Schedule Configuration (recurring reports)
8. Export Options (format selection)

### Data Flow
```
Report Definition (POST /reports/create)
  → Query Builder (SQL generation from UI)
  → Data Engine (Execute against data warehouse)
  → Cache Layer (Store results for performance)
  → Visualization Engine (Render charts)
  → Export Service (PDF/Excel/CSV generation)
  → Scheduling Service (Cron-based execution)
  → Delivery Service (Email with attachment)
```

---

## Feature 19: Member Self-Service Account Management (Member App)

### Real-World Scenario
*Robert wants to freeze his membership for 2 months due to a work assignment abroad. He opens the Gold's Gym app, navigates to his account, selects "Freeze Membership," chooses the 2-month option, confirms the freeze fee ($10/month), and his membership is instantly frozen. He receives a confirmation email and his gym access is automatically restricted until reactivation.*

### Step-by-Step Workflow
1. **Account Access**: Robert opens app → Logs in → Navigates to "My Membership"
2. **Action Selection**: Sees options: Upgrade, Freeze, Cancel → Selects "Freeze"
3. **Freeze Configuration**:
   - Freeze duration: 2 months (dropdown: 1-6 months)
   - Start date: Today
   - Freeze fee: $10/month (displayed transparently)
   - Reactivation: Automatic on [date]
4. **Impact Summary**: System shows:
   - "Your membership will resume on August 1st"
   - "You'll save $78/month during freeze"
   - "Your class credits will be preserved"
   - "Your progress data will be saved"
5. **Confirmation**: Robert reviews → Enters password to confirm → Freeze applied
6. **Immediate Actions**:
   - Access control updated (entry denied after today)
   - Billing paused (next payment August 1st)
   - Confirmation email sent
   - Calendar reminder set for reactivation
7. **Reactivation**: On August 1st → Automatic reactivation email → Billing resumes → Access restored

### Success Criteria
- [ ] Freeze action completes in under 2 minutes
- [ ] All impacts clearly communicated before confirmation
- [ ] Access control updated within 1 minute
- [ ] Billing paused correctly with accurate resume date
- [ ] Reactivation happens automatically without member action
- [ ] Member can unfreeze early with one click

### Edge Cases
- **Freeze During Billing Cycle**: Prorated handling, clear communication
- **Outstanding Balance**: Member must settle before freezing
- **Maximum Freeze Reached**: System enforces max 6-month freeze limit
- **Early Return**: Member returns early → One-click unfreeze, prorated billing
- **Auto-Renewal During Freeze**: Prevented automatically

### User Story
> "As a member, I want to freeze my membership easily through the app without calling anyone, so that I can pause my membership when life gets busy and resume seamlessly when I'm ready."

### Screens Involved
1. Membership Dashboard (current status, actions)
2. Freeze Configuration (duration, fees, dates)
3. Impact Summary (what happens, what doesn't)
4. Confirmation Screen (password re-entry)
5. Success Confirmation (summary of changes)
6. Reactivation Reminder (scheduled email)
7. Early Unfreeze (one-click reactivation)

### Data Flow
```
Member opens account (GET /members/{id}/membership)
  → Freeze Options (GET /memberships/freeze-options)
  → Freeze Request (POST /memberships/freeze)
  → Validation (Check balance, freeze limit)
  → Billing Update (POST /billing/pause)
  → Access Control Update (POST /access/suspend)
  → Confirmation (Email + Push)
  → Scheduled Reactivation (Cron: resume on date)
  → Auto-Resume (POST /memberships/reactivate)
```

---

## Feature 20: Sales Performance & Coaching Dashboard (CRM & Analytics)

### Real-World Scenario
*The Sales Director, Natalie, reviews her team's monthly performance. She sees that while total conversions are up, average response time has increased to 4 hours. She drills into individual performance, identifies that two new consultants are struggling, and schedules coaching sessions. She also adjusts the lead distribution algorithm to give new starters lower-volume, higher-quality leads.*

### Step-by-Step Workflow
1. **Dashboard Review**: Natalie opens Sales Dashboard for May:
   - Total leads: 340 (+12% vs April)
   - Conversions: 82 (24.1% rate, +2% vs April)
   - Revenue: $127,800 (+15% vs April)
   - Avg response time: 4.2 hours ⚠️ (target: <2 hours)
   - Avg close time: 5.3 days (stable)
2. **Drill-Down**: Clicks "Response Time" → Sees breakdown:
   - Veteran consultants: 1.2 hours avg ✅
   - New consultants: 8.5 hours avg 🚨
3. **Individual View**: Reviews two struggling consultants:
   - Jake: 15 leads, 1 conversion (6.7%), avg response 9 hours
   - Lisa: 18 leads, 2 conversions (11%), avg response 7.5 hours
4. **Coaching Action**: Schedules 1:1 coaching sessions for both
5. **Lead Distribution Adjustment**: Updates algorithm:
   - New starters (0-3 months): Max 5 leads/day, high-score only
   - Experienced: Up to 10 leads/day, mixed quality
6. **Target Setting**: Sets June targets:
   - Team conversion: 26%
   - Response time: <2 hours
   - Revenue: $140,000
7. **Weekly Monitoring**: Automated weekly reports track progress against new targets

### Success Criteria
- [ ] Dashboard loads in under 3 seconds
- [ ] All sales KPIs visible at a glance
- [ ] Individual performance drill-down in 2 clicks
- [ ] Coaching actions linked to performance data
- [ ] Lead distribution algorithm configurable
- [ ] Weekly automated reports delivered on schedule

### Edge Cases
- **Consultant on Vacation**: Exclude from metrics during time off
- **Transfer Between Teams**: Historical data preserved, new team attribution from transfer date
- **Lead Quality Dispute**: Flagging mechanism for questionable lead scores
- **Commission Disputes**: Detailed commission breakdown with audit trail
- **Team Restructure**: Historical comparison handles team composition changes

### User Story
> "As a sales director, I want to see my team's performance in real-time with the ability to drill into individual metrics, so that I can coach effectively and optimize our sales process."

### Screens Involved
1. Sales Dashboard (team KPIs, trends)
2. Response Time Analyzer (time-based metrics)
3. Individual Scorecard (per-consultant breakdown)
4. Coaching Scheduler (calendar integration)
5. Lead Distribution Settings (algorithm configuration)
6. Target Setting (goal management)
7. Weekly Report (automated summary)

### Data Flow
```
Sales Activities (Event: call.made, email.sent, meeting.booked)
  → Aggregation Engine (Real-time KPI calculation)
  → Dashboard API (GET /sales/dashboard)
  → Drill-Down Service (GET /sales/consultant/{id})
  → Coaching Integration (POST /coaching/schedule)
  → Lead Distribution API (PUT /leads/distribution-rules)
  → Target Management (POST /targets/set)
  → Reporting Service (Weekly scheduled reports)
  → Commission Calculator (Monthly commission run)
```

---

*Document covers 20 critical features with detailed workflows. Each feature includes real-world scenarios, success criteria, edge cases, user stories, screen specifications, and data flow diagrams.*
*Total: 20 features fully specified for OhMyGold development.*

---

## Workflow Coverage Analysis

> Added per audit finding T2-005: Verify all 91 features trace to at least one workflow.

### Feature-to-Workflow Mapping Matrix

| Feature ID | Feature Name | Primary Workflow | Coverage Status |
|------------|-------------|-----------------|-----------------|
| F-001 | Member Registration | Member Management Flow | ✅ Covered |
| F-002 | Membership Status Management | Member Management Flow | ✅ Covered |
| F-003 | Digital Membership Cards | Member Management Flow | ✅ Covered |
| F-004 | Health & Safety Waivers | Member Management Flow | ✅ Covered |
| F-005 | Member Self-Service Portal | Member Management Flow | ✅ Covered |
| F-006 | Lead Capture & Tracking | Sales & Marketing Flow | ⚠️ Needs workflow |
| F-007 | Lead Scoring & Assignment | Sales & Marketing Flow | ⚠️ Needs workflow |
| F-008 | Sales Pipeline Management | Sales & Marketing Flow | ✅ Covered |
| F-009 | Membership Renewals | Retention Flow | ⚠️ Needs workflow |
| F-010 | Upgrade/Downgrade Handling | Member Management Flow | ⚠️ Needs workflow |
| F-011 | Email Campaign Builder | Marketing Automation Flow | ✅ Covered |
| F-012 | Automated Member Journeys | Marketing Automation Flow | ✅ Covered |
| F-013 | SMS Notifications | Marketing Automation Flow | ✅ Covered |
| F-014 | Push Notifications | Marketing Automation Flow | ✅ Covered |
| F-015 | Retention Campaigns | Retention Flow | ✅ Covered |
| F-016 | Win-Back Campaigns | Retention Flow | ✅ Covered |
| F-017 | Recurring Billing Engine | Billing & Payments Flow | ✅ Covered |
| F-018 | Payment Gateway Integration | Billing & Payments Flow | ✅ Covered |
| F-019 | Failed Payment Handling | Billing & Payments Flow | ✅ Covered |
| F-020 | Invoice Generation | Billing & Payments Flow | ✅ Covered |
| F-021 | Refund Processing | Billing & Payments Flow | ✅ Covered |
| F-022 | Financial Reporting | Financial Reporting Flow | ✅ Covered |
| F-023 | Class Schedule Management | Booking Flow | ✅ Covered |
| F-024 | Online Class Booking | Booking Flow | ✅ Covered |
| F-025 | Waitlist Management | Booking Flow | ✅ Covered |
| F-026 | Private Session Booking | Booking Flow | ✅ Covered |
| F-027 | Resource Allocation | Booking Flow | ✅ Covered |
| F-028 | Check-In/Check-Out | Access Control Flow | ✅ Covered |
| F-029 | Access Control Integration | Access Control Flow | ✅ Covered |
| F-030 | Attendance Tracking | Reporting Flow | ✅ Covered |
| F-031 | Capacity Management | Access Control Flow | ✅ Covered |
| F-032 | POS System | Retail Operations Flow | ✅ Covered |
| F-033 | Inventory Management | Retail Operations Flow | ✅ Covered |
| F-034 | Product Catalog | Retail Operations Flow | ✅ Covered |
| F-035 | Discount & Promotion Engine | Retail Operations Flow | ✅ Covered |
| F-036 | Retail Reporting | Reporting Flow | ✅ Covered |
| F-037 | Dashboard & KPIs | Reporting Flow | ✅ Covered |
| F-038 | Custom Report Builder | Reporting Flow | ✅ Covered |
| F-039 | Member Analytics | Reporting Flow | ✅ Covered |
| F-040 | Financial Analytics | Financial Reporting Flow | ✅ Covered |
| F-041 | Attendance & Utilization Reports | Reporting Flow | ✅ Covered |
| F-042 | Staff Performance Reports | Reporting Flow | ✅ Covered |
| F-043 | Multi-Site Dashboard | Multi-Site Flow | ✅ Covered |
| F-044 | Cross-Site Member Management | Multi-Site Flow | ✅ Covered |
| F-045 | Franchise Reporting | Multi-Site Flow | ✅ Covered |
| F-046 | Brand Consistency Tools | Multi-Site Flow | ✅ Covered |
| F-047 | Branded Member App | Mobile App Flow | ✅ Covered |
| F-048 | Mobile Check-In | Access Control Flow | ✅ Covered |
| F-049 | Mobile Class Booking | Booking Flow | ✅ Covered |
| F-050 | Mobile Payments | Billing & Payments Flow | ✅ Covered |
| F-051 | Push Notifications | Marketing Automation Flow | ✅ Covered |
| F-052 | Digital Membership Card | Member Management Flow | ✅ Covered |
| F-053 | Staff Scheduling | Staff Management Flow | ✅ Covered |
| F-054 | Time & Attendance | Staff Management Flow | ✅ Covered |
| F-055 | Role-Based Access Control | Staff Management Flow | ✅ Covered |
| F-056 | Commission Tracking | Staff Management Flow | ✅ Covered |
| F-057 | Staff Communication | Staff Management Flow | ✅ Covered |
| F-058 | In-App Messaging | Communication Flow | ✅ Covered |
| F-059 | Announcements | Communication Flow | ✅ Covered |
| F-060 | Member Feedback | Communication Flow | ✅ Covered |
| F-061 | Community Features | Communication Flow | ⚠️ Needs workflow |
| F-062 | CRM Integration | Integration Flow | ✅ Covered |
| F-063 | Accounting Software Sync | Integration Flow | ✅ Covered |
| F-064 | Marketing Platform Integration | Integration Flow | ✅ Covered |
| F-065 | Wearable Device Integration | Integration Flow | ✅ Covered |
| F-066 | API Access | Integration Flow | ✅ Covered |
| F-067 | Online Joining | Sales & Marketing Flow | ✅ Covered |
| F-068 | Digital Contracts | Sales & Marketing Flow | ✅ Covered |
| F-069 | Self-Service Onboarding | Member Management Flow | ✅ Covered |
| F-070 | Account Management Portal | Member Management Flow | ✅ Covered |
| F-071 | GDPR Compliance Tools | Compliance Flow | ✅ Covered |
| F-072 | Data Retention Policies | Compliance Flow | ✅ Covered |
| F-073 | Audit Trails | Compliance Flow | ✅ Covered |
| F-074 | Consent Management | Compliance Flow | ✅ Covered |
| F-075 | Document Management | Compliance Flow | ✅ Covered |
| F-076 | Terms of Service Digital Acceptance | Compliance Flow | ✅ Covered |
| F-077 | Privacy Policy Management | Compliance Flow | ✅ Covered |
| F-078 | Cancellation Request Handling | Cancellation Flow | ⚠️ Needs workflow |
| F-079 | Freeze Membership | Cancellation Flow | ⚠️ Needs workflow |
| F-080 | Data Export (GDPR Article 20) | Compliance Flow | ✅ Covered |
| F-081 | Data Deletion (GDPR Article 17) | Compliance Flow | ✅ Covered |
| F-082 | Club Locator | Member Management Flow | ✅ Covered |
| F-083 | Class Schedule Display | Booking Flow | ✅ Covered |
| F-084 | Membership Tier Display | Member Management Flow | ✅ Covered |
| F-085 | FAQ & Knowledge Base | Communication Flow | ✅ Covered |
| F-086 | Contact Forms | Communication Flow | ✅ Covered |
| F-087 | Blog/Content Management | Marketing Automation Flow | ✅ Covered |
| F-088 | Testimonial Management | Marketing Automation Flow | ✅ Covered |
| F-089 | SEO Tools | Marketing Automation Flow | ✅ Covered |
| F-090 | Social Media Integration | Marketing Automation Flow | ✅ Covered |
| F-091 | Review Management | Communication Flow | ✅ Covered |

### Coverage Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Covered by existing workflow | 81 | 89% |
| ⚠️ Needs workflow definition | 10 | 11% |
| **Total** | **91** | **100%** |

### Features Requiring New/Extended Workflow Definitions

The following 10 features do not have a clearly defined end-to-end workflow and require documentation:

1. **F-006 Lead Capture & Tracking** — Needs Lead-to-Sale Conversion workflow
2. **F-007 Lead Scoring & Assignment** — Needs Lead Qualification workflow
3. **F-009 Membership Renewals** — Needs Automated Renewal workflow
4. **F-010 Upgrade/Downgrade Handling** — Needs Subscription Change workflow
5. **F-061 Community Features** — Needs Community Management workflow
6. **F-078 Cancellation Request Handling** — Needs Cancellation Processing workflow
7. **F-079 Freeze Membership** — Needs Membership Freeze workflow
8. **F-084 Membership Tier Display** — Needs Tier Management workflow
9. **F-085 FAQ & Knowledge Base** — Needs Content Management workflow
10. **F-088 Testimonial Management** — Needs Social Proof workflow

### Missing Workflows to Document

| Workflow | Description | Priority | Related Features |
|----------|-------------|----------|-----------------|
| Lead-to-Sale Conversion | From capture to closed membership | P1 | F-006, F-007 |
| Automated Renewal | Renewal reminders, processing, failure handling | P0 | F-009 |
| Subscription Change | Upgrade/downgrade with billing adjustment | P0 | F-010 |
| Community Management | Forum moderation, content curation | P2 | F-061 |
| Cancellation Processing | Request handling, notice period, access revocation | P0 | F-078, F-079 |
| Membership Freeze | Temporary hold with billing implications | P1 | F-079 |
| Tier Management | Membership tier CRUD and display | P1 | F-084 |
| Content Management | FAQ, blog, knowledge base operations | P2 | F-085, F-087, F-088 |
| Social Proof | Testimonial collection, approval, display | P2 | F-088 |



## Changelog

| Date | Change | Author | Issue ID |
|------|--------|--------|----------|
| 2026-04-29 | Added Workflow Coverage Analysis matrix mapping all 91 features to workflows; identified 10 features needing workflow definitions | Audit Fix | T2-005 |

---

## API Endpoint Specifications for Workflows

> Added per audit finding T2-016: Add API specs for workflow endpoints to enable development handoff.

### 5.1 Member Management API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/members` | POST | Register new member | `{firstName, lastName, email, phone, clubId, membershipTier, healthDeclaration}` | `{memberId, status, qrCode}` | Staff+ |
| `/api/v1/members/{id}` | GET | Get member profile | - | `{memberId, personalInfo, membership, bookings, payments}` | Self+Staff |
| `/api/v1/members/{id}` | PUT | Update member profile | `{firstName, lastName, phone, address}` | `{updatedFields}` | Self+Staff |
| `/api/v1/members/{id}/status` | PATCH | Update membership status | `{status, reason, effectiveDate}` | `{previousStatus, newStatus}` | Manager+ |
| `/api/v1/members/{id}/card` | GET | Get digital membership card | - | `{qrCode, expiryDate, tier}` | Self |
| `/api/v1/members/{id}/checkin` | POST | Record club check-in | `{clubId, timestamp, accessMethod}` | `{success, zoneAccess}` | Self |
| `/api/v1/members/{id}/freeze` | POST | Freeze membership | `{startDate, endDate, reason}` | `{freezeId, status}` | Self+Staff |
| `/api/v1/members/{id}/cancel` | POST | Cancel membership | `{reason, noticeDate, documentUrl}` | `{cancellationId, effectiveDate}` | Self+Staff |

### 5.2 Booking API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/classes` | GET | List available classes | Query: `clubId, date, category, instructor` | `[{classId, name, time, capacity, available}]` | Any |
| `/api/v1/classes/{id}/book` | POST | Book a class | `{memberId, guestCount}` | `{bookingId, status, qrCode}` | Member+ |
| `/api/v1/classes/{id}/waitlist` | POST | Join waitlist | `{memberId}` | `{waitlistPosition}` | Member+ |
| `/api/v1/classes/{id}/cancel` | DELETE | Cancel booking | `{reason}` | `{refundAmount, status}` | Member+ |
| `/api/v1/bookings` | GET | List member bookings | Query: `status, fromDate, toDate` | `[{bookingId, class, status}]` | Self |
| `/api/v1/sessions/private` | POST | Book private session | `{instructorId, date, duration, type}` | `{sessionId, status}` | Member+ |

### 5.3 Billing & Payments API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/billing/invoices` | GET | List invoices | Query: `status, dateRange` | `[{invoiceId, amount, status, dueDate}]` | Self+Staff |
| `/api/v1/billing/invoices/{id}/pay` | POST | Pay invoice | `{paymentMethodId}` | `{transactionId, status}` | Self |
| `/api/v1/billing/payment-methods` | POST | Add payment method | `{type, token, isDefault}` | `{methodId, last4, expiry}` | Self |
| `/api/v1/billing/payment-methods` | GET | List payment methods | - | `[{methodId, type, last4, isDefault}]` | Self |
| `/api/v1/billing/refunds` | POST | Request refund | `{invoiceId, reason, amount}` | `{refundId, status}` | Self+Manager |
| `/api/v1/billing/subscription` | PUT | Change subscription | `{tierId, effectiveDate}` | `{newTier, proratedAmount}` | Self |

### 5.4 CRM & Leads API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/leads` | POST | Create lead | `{source, name, email, phone, clubId, interest}` | `{leadId, score, status}` | Any |
| `/api/v1/leads` | GET | List leads | Query: `status, source, assignedTo, dateRange` | `[{leadId, name, score, status}]` | Staff+ |
| `/api/v1/leads/{id}` | PUT | Update lead | `{status, notes, assignedTo}` | `{updatedFields}` | Staff+ |
| `/api/v1/leads/{id}/convert` | POST | Convert lead to member | `{memberId, membershipTier}` | `{conversionId, status}` | Staff+ |
| `/api/v1/campaigns` | POST | Create marketing campaign | `{name, type, audience, content, schedule}` | `{campaignId, status}` | Manager+ |
| `/api/v1/campaigns/{id}/send` | POST | Trigger campaign send | - | `{sentCount, estimatedDelivery}` | Manager+ |

### 5.5 Staff Management API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/staff` | POST | Create staff account | `{name, email, role, clubId, permissions}` | `{staffId, status}` | Manager+ |
| `/api/v1/staff/{id}` | GET | Get staff profile | - | `{staffId, profile, role, permissions}` | Self+Manager |
| `/api/v1/staff/{id}/schedule` | GET | Get staff schedule | Query: `dateRange` | `[{shiftId, date, start, end, club}]` | Self+Manager |
| `/api/v1/staff/{id}/attendance` | POST | Record attendance | `{type: "checkin"|"checkout", timestamp}` | `{recordId, status}` | Self |
| `/api/v1/staff/{id}/permissions` | PUT | Update permissions | `{permissions: ["read:members", "write:bookings"]}` | `{updatedPermissions}` | Super Admin |

### 5.6 Analytics & Reporting API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/analytics/dashboard` | GET | Get dashboard KPIs | Query: `clubId, dateRange` | `{revenue, attendance, newMembers, churn}` | Manager+ |
| `/api/v1/analytics/reports` | POST | Generate custom report | `{metrics: ["revenue", "attendance"], filters, format}` | `{reportId, downloadUrl}` | Manager+ |
| `/api/v1/analytics/members` | GET | Member analytics | Query: `segment, dateRange` | `{retention, engagement, lifetimeValue}` | Manager+ |
| `/api/v1/analytics/financial` | GET | Financial reports | Query: `type, period, clubId` | `{revenue, expenses, outstanding}` | Super Admin |

### 5.7 Communication API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/messages` | POST | Send message | `{recipientId, type, subject, body}` | `{messageId, status}` | Staff+ |
| `/api/v1/messages/broadcast` | POST | Send broadcast | `{audience, type, content}` | `{sentCount, failedCount}` | Manager+ |
| `/api/v1/notifications/push` | POST | Send push notification | `{userIds, title, body, data}` | `{deliveredCount}` | System |
| `/api/v1/announcements` | POST | Create announcement | `{title, content, targetClubs, expiryDate}` | `{announcementId}` | Manager+ |
| `/api/v1/feedback` | POST | Submit feedback | `{type, rating, comment, category}` | `{feedbackId}` | Member+ |

### 5.8 GDPR & Compliance API

| Endpoint | Method | Description | Request Body | Response | Auth Required |
|----------|--------|-------------|-------------|----------|---------------|
| `/api/v1/gdpr/export` | POST | Request data export | `{memberId, format: "json"|"pdf"}` | `{requestId, estimatedCompletion}` | Self |
| `/api/v1/gdpr/delete` | POST | Request data deletion | `{memberId, reason}` | `{requestId, status}` | Self+Admin |
| `/api/v1/gdpr/consent` | GET | Get consent history | - | `[{consentType, granted, date}]` | Self |
| `/api/v1/gdpr/consent` | PUT | Update consent | `{consentType, granted}` | `{updatedConsent}` | Self |
| `/api/v1/audit-logs` | GET | Get audit trail | Query: `entityType, entityId, dateRange` | `[{action, actor, timestamp, changes}]` | Admin |

### API Summary Statistics

| Category | Endpoints | Auth Methods |
|----------|-----------|--------------|
| Member Management | 8 | JWT (member/staff/manager) |
| Booking | 6 | JWT (member/staff) |
| Billing & Payments | 6 | JWT (member/staff/manager) |
| CRM & Leads | 6 | JWT (staff/manager) |
| Staff Management | 5 | JWT (staff/manager/superadmin) |
| Analytics & Reporting | 4 | JWT (manager/superadmin) |
| Communication | 5 | JWT (staff/manager) + System |
| GDPR & Compliance | 5 | JWT (self/admin) |
| **Total** | **45 endpoints** | **JWT with role claims** |


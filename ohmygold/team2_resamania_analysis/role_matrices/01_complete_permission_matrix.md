# OhMyGold - Complete Permission Matrix

## Document Control
| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Final |
| Coverage | 13 Feature Categories, 80+ Sub-features |
| Roles Covered | 6 (Admin, Manager, Employee, Teacher/Coach, Client, Visitor) |

---

## Permission Legend

| Level | Code | Description |
|-------|------|-------------|
| Full Access | **FA** | Create, Read, Update, Delete — complete control |
| Read + Write | **RW** | Read + Create/Update, NO Delete |
| Read Only | **RO** | View only, no modifications |
| No Access | **—** | Feature hidden or inaccessible |
| Conditional | **C** | Access limited by scope (e.g., own location, own data, own client) |

---

## A. User Management

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **A.1 Manage Admins** |
| A.1.1 Create admin accounts | FA | — | — | — | — | — |
| A.1.2 Edit admin profiles | FA | — | — | — | — | — |
| A.1.3 Delete admin accounts | FA | — | — | — | — | — |
| A.1.4 List/view all admins | FA | — | — | — | — | — |
| A.1.5 Reset admin passwords | FA | — | — | — | — | — |
| **A.2 Manage Managers** |
| A.2.1 Create manager accounts | FA | — | — | — | — | — |
| A.2.2 Edit manager profiles | FA | RO | — | — | — | — |
| A.2.3 Delete manager accounts | FA | — | — | — | — | — |
| A.2.4 List/view managers | FA | RO | — | — | — | — |
| A.2.5 Assign manager to location | FA | — | — | — | — | — |
| A.2.6 Reset manager passwords | FA | C (own) | — | — | — | — |
| **A.3 Manage Employees** |
| A.3.1 Create employee accounts | FA | RW | — | — | — | — |
| A.3.2 Edit employee profiles | FA | RW | C (own) | — | — | — |
| A.3.3 Deactivate/Delete employees | FA | RW | — | — | — | — |
| A.3.4 List/view employees | FA | C (location) | C (location) | — | — | — |
| A.3.5 Assign employee to location | FA | RW | — | — | — | — |
| A.3.6 Reset employee passwords | FA | RW | C (own) | — | — | — |
| **A.4 Manage Teacher/Coaches/Coaches** |
| A.4.1 Create teacher accounts | FA | RW | — | — | — | — |
| A.4.2 Edit teacher profiles | FA | RW | — | C (own) | — | — |
| A.4.3 Deactivate/Delete teachers | FA | RW | — | — | — | — |
| A.4.4 List/view teachers | FA | C (location) | C (location) | C (location) | RO | RO |
| A.4.5 Assign specialties/certifications | FA | RW | — | C (own) | — | — |
| A.4.6 Set availability/schedules | FA | RW | — | C (own) | — | — |
| A.4.7 Reset teacher passwords | FA | RW | — | C (own) | — | — |
| **A.5 Manage Clients** |
| A.5.1 Create client accounts (on-site) | FA | RW | RW | — | — | — |
| A.5.2 Edit client profiles | FA | RW | RW | C (own clients) | C (own) | — |
| A.5.3 Deactivate/Delete client accounts | FA | RW | — | — | — | — |
| A.5.4 List/view all clients | FA | C (location) | C (location) | C (own class) | — | — |
| A.5.5 View client full history | FA | C (location) | C (own interactions) | C (own classes) | C (own) | — |
| A.5.6 Export client data (GDPR) | FA | C (location) | — | — | C (own) | — |
| A.5.7 Reset client passwords | FA | RW | RW | — | C (own) | C (own) |
| A.5.8 Merge duplicate accounts | FA | RW | — | — | — | — |
| **A.6 Manage Visitor Accounts** |
| A.6.1 View visitor registrations | FA | C (location) | C (location) | — | — | — |
| A.6.2 Convert visitor to client | FA | RW | RW | — | — | — |
| A.6.3 View trial session history | FA | C (location) | C (location) | — | — | — |
| A.6.4 Process visitor inquiries | FA | RW | RW | — | — | — |
| **A.7 Role Assignment & Modification** |
| A.7.1 Assign any role to any user | FA | — | — | — | — | — |
| A.7.2 Modify role permissions | FA | — | — | — | — | — |
| A.7.3 Create custom roles | FA | — | — | — | — | — |
| A.7.4 View role definitions | FA | RO | RO | RO | RO | RO |
| **A.8 Bulk User Operations** |
| A.8.1 Bulk import users (CSV) | FA | — | — | — | — | — |
| A.8.2 Bulk update user fields | FA | — | — | — | — | — |
| A.8.3 Bulk deactivate/reactivate | FA | C (location) | — | — | — | — |
| A.8.4 Bulk export user lists | FA | C (location) | — | — | C (own) | — |

**Key Decisions (A):**
- Admins have absolute authority over all user types including other Admins.
- Managers can only manage Employees, Teacher/Coaches, and Clients within their assigned location. Cannot create/delete Managers.
- Employees can edit their own profile and create/edit clients they interact with but cannot delete users.
- Teacher/Coaches have limited self-management and access to their own client roster only.
- Clients can only view and edit their own profile data (GDPR-compliant).
- Visitors have no access to user management; they can only manage their own trial account registration.

---

## B. Location & Facility Management

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **B.1 Location Configuration** |
| B.1.1 Create new locations | FA | — | — | — | — | — |
| B.1.2 Edit location details | FA | C (own) | — | — | — | — |
| B.1.3 Deactivate/close locations | FA | — | — | — | — | — |
| B.1.4 Set operating hours | FA | C (own) | RO | RO | RO | RO |
| B.1.5 Set holiday schedules | FA | C (own) | RO | RO | RO | RO |
| B.1.6 Update address/contact info | FA | C (own) | — | — | RO | RO |
| **B.2 Zone & Equipment Management** |
| B.2.1 Define facility zones | FA | C (own) | RO | RO | RO | RO |
| B.2.2 Manage equipment inventory | FA | C (own) | RW | — | RO | RO |
| B.2.3 Log equipment issues | FA | C (own) | RW | RW | — | — |
| B.2.4 View equipment status | FA | C (own) | RO | RO | RO | RO |
| B.2.5 Equipment maintenance scheduling | FA | C (own) | RW | — | — | — |
| **B.3 Capacity Limits & Rules** |
| B.3.1 Set per-zone capacity | FA | C (own) | RO | RO | RO | RO |
| B.3.2 Set occupancy rules | FA | C (own) | RO | — | — | — |
| B.3.3 View real-time capacity | FA | C (own) | RO | RO | RO | RO |
| B.3.4 Override capacity limits | FA | C (own) | — | — | — | — |
| **B.4 Location-Specific Settings** |
| B.4.1 Configure location policies | FA | C (own) | RO | RO | — | — |
| B.4.2 Set cancellation rules | FA | C (own) | RO | — | RO | RO |
| B.4.3 Set booking windows | FA | C (own) | RO | — | RO | RO |
| B.4.4 Configure check-in rules | FA | C (own) | RO | — | — | — |
| **B.5 Multi-Location Switching** |
| B.5.1 Switch between all locations | FA | — | — | — | — | — |
| B.5.2 View cross-location reports | FA | — | — | — | — | — |
| B.5.3 Compare location metrics | FA | — | — | — | — | — |
| B.5.4 View assigned location only | — | RO | RO | RO | RO | RO |

**Key Decisions (B):**
- Only Admins can create new locations or close existing ones. This is a business-level decision.
- Managers have full control over their own location but zero visibility into other locations.
- Real-time capacity is visible to Clients (helps them decide when to visit) but Visitors can also see it for transparency.
- Multi-location features are Admin-only to prevent Managers from poaching or comparing.

---

## C. Membership & Subscriptions

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **C.1 Subscription Plan Management** |
| C.1.1 Create subscription plans | FA | C (own) | — | — | — | — |
| C.1.2 Edit plan details | FA | C (own) | — | — | — | — |
| C.1.3 Deactivate/archive plans | FA | C (own) | — | — | — | — |
| C.1.4 Set plan pricing | FA | C (own) | — | — | — | — |
| C.1.5 View available plans | FA | C (own) | RO | RO | RO | RO |
| **C.2 Member Enrollment** |
| C.2.1 Enroll client in plan (on-site) | FA | RW | RW | — | — | — |
| C.2.2 Process online enrollment | — | — | — | — | RW | RW |
| C.2.3 Verify enrollment eligibility | FA | RW | RW | — | — | — |
| C.2.4 Send enrollment confirmation | FA | RW | RW | — | — | — |
| **C.3 Subscription Modifications** |
| C.3.1 Upgrade subscription | FA | RW | RW | — | RW | — |
| C.3.2 Downgrade subscription | FA | RW | RW | — | RW | — |
| C.3.3 Freeze/pause subscription | FA | RW | RW | — | RW | — |
| C.3.4 Unfreeze subscription | FA | RW | RW | — | RW | — |
| C.3.5 Change billing date | FA | RW | — | — | — | — |
| C.3.6 Apply discount/coupon | FA | RW | RW | — | — | — |
| **C.4 Cancellation Processing** |
| C.4.1 Process cancellation (staff) | FA | RW | — | — | — | — |
| C.4.2 Request cancellation (self) | — | — | — | — | RW | — |
| C.4.3 Set cancellation effective date | FA | RW | — | — | — | — |
| C.4.4 Handle early termination fees | FA | RW | — | — | — | — |
| C.4.5 Re-subscribe after cancellation | FA | RW | RW | — | RW | — |
| **C.5 Payment Method Management** |
| C.5.1 Add/edit payment method (staff) | FA | RW | — | — | — | — |
| C.5.2 Add/edit own payment method | — | — | — | — | RW | — |
| C.5.3 Remove payment method | FA | RW | — | — | RW | — |
| C.5.4 Set default payment method | FA | RW | — | — | RW | — |
| **C.6 Renewal Management** |
| C.6.1 View renewal dates | FA | C (location) | C (location) | — | C (own) | — |
| C.6.2 Process manual renewal | FA | RW | — | — | — | — |
| C.6.3 Toggle auto-renewal | FA | RW | — | — | RW | — |
| C.6.4 Send renewal reminders | FA | RW | — | — | — | — |
| **C.7 Trial Management** |
| C.7.1 Create trial offers | FA | C (own) | — | — | — | — |
| C.7.2 Activate trial for visitor | FA | RW | RW | — | — | — |
| C.7.3 Track trial usage | FA | C (location) | C (location) | — | — | — |
| C.7.4 Convert trial to paid | FA | RW | RW | — | — | — |
| C.7.5 Request trial (self) | — | — | — | — | — | RW |

**Key Decisions (C):**
- Managers control plan creation for their location, allowing local pricing strategies.
- Employees can process enrollments and modifications but cannot handle cancellations (Manager-only).
- Clients manage their own subscription lifecycle (upgrade, freeze, cancel) to reduce support load.
- Visitors can request trials and browse plans — this is the primary conversion funnel.
- Teacher/Coaches have no subscription access — this is handled by gym staff.

---

## D. Billing & Payments

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **D.1 Invoice Management** |
| D.1.1 Generate invoices | FA | C (own) | — | — | — | — |
| D.1.2 View all invoices | FA | C (location) | — | — | C (own) | — |
| D.1.3 Edit draft invoices | FA | C (own) | — | — | — | — |
| D.1.4 Delete/cancel invoices | FA | C (own) | — | — | — | — |
| D.1.5 Send invoices to clients | FA | C (location) | — | — | — | — |
| D.1.6 Download invoice PDF | FA | C (location) | — | — | C (own) | — |
| **D.2 Payment Processing** |
| D.2.1 Process card payments (terminal) | FA | RW | RW | — | — | — |
| D.2.2 Process cash payments | FA | RW | RW | — | — | — |
| D.2.3 Record bank transfers | FA | RW | — | — | — | — |
| D.2.4 Process online payment | — | — | — | — | RW | RW |
| D.2.5 Process partial payments | FA | RW | — | — | — | — |
| **D.3 Failed Payment Handling** |
| D.3.1 View failed payments list | FA | C (location) | — | — | — | — |
| D.3.2 Retry failed payments | FA | RW | — | — | — | — |
| D.3.3 Contact client about failure | FA | RW | — | — | C (own) | — |
| D.3.4 Set retry schedule | FA | C (own) | — | — | — | — |
| D.3.5 Suspend after repeated failure | FA | RW | — | — | — | — |
| **D.4 Refund Processing** |
| D.4.1 Process full refund | FA | RW | — | — | — | — |
| D.4.2 Process partial refund | FA | RW | — | — | — | — |
| D.4.3 Issue store credit | FA | RW | RW | — | — | — |
| D.4.4 View refund history | FA | C (location) | — | — | C (own) | — |
| **D.5 Financial Reporting** |
| D.5.1 View revenue dashboard | FA | C (location) | — | — | — | — |
| D.5.2 Generate revenue reports | FA | C (location) | — | — | — | — |
| D.5.3 Track outstanding payments | FA | C (location) | — | — | — | — |
| D.5.4 View payment method breakdown | FA | C (location) | — | — | — | — |
| D.5.5 Export financial data | FA | C (location) | — | — | — | — |
| D.5.6 View tax reports | FA | C (location) | — | — | — | — |
| **D.6 POS Transactions** |
| D.6.1 Process product sales | FA | RW | RW | — | — | — |
| D.6.2 Apply discounts at POS | FA | RW | RW | — | — | — |
| D.6.3 Issue receipts | FA | RW | RW | — | C (own) | — |
| D.6.4 View daily POS summary | FA | C (location) | C (location) | — | — | — |
| D.6.5 Process returns/exchanges | FA | RW | RW | — | C (own) | — |
| **D.7 Pricing Rule Management** |
| D.7.1 Create pricing rules | FA | C (own) | — | — | — | — |
| D.7.2 Set dynamic pricing | FA | C (own) | — | — | — | — |
| D.7.3 Set family/couple discounts | FA | C (own) | — | — | — | — |
| D.7.4 Manage promotional codes | FA | C (own) | RO | — | RO | RO |

**Key Decisions (D):**
- Billing is a sensitive area: Employees can process payments and POS but cannot issue refunds or handle failed payments.
- Refunds require Manager approval to prevent abuse.
- Clients see only their own billing data for privacy compliance.
- Financial reporting is Manager/Admin only — Teacher/Coaches and Employees don't need this.
- Visitors can make online payments for trial signups.

---

## E. Classes & Scheduling

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **E.1 Class Type Creation** |
| E.1.1 Create class types | FA | C (own) | — | C (own specialty) | — | — |
| E.1.2 Edit class type details | FA | C (own) | — | C (own) | — | — |
| E.1.3 Set class duration/intensity | FA | C (own) | — | — | — | — |
| E.1.4 Define class requirements | FA | C (own) | — | — | RO | RO |
| E.1.5 Upload class imagery | FA | C (own) | — | — | — | — |
| **E.2 Schedule Creation** |
| E.2.1 Create recurring schedules | FA | C (own) | — | — | — | — |
| E.2.2 Create one-time classes | FA | C (own) | RW | C (own) | — | — |
| E.2.3 Edit existing schedules | FA | C (own) | — | — | — | — |
| E.2.4 Cancel scheduled classes | FA | C (own) | — | — | — | — |
| E.2.5 View full schedule | FA | C (location) | C (location) | C (location) | C (location) | C (location) |
| **E.3 Room & Resource Allocation** |
| E.3.1 Assign room to class | FA | C (own) | — | — | — | — |
| E.3.2 View room availability | FA | C (location) | C (location) | C (location) | RO | RO |
| E.3.3 Allocate equipment per class | FA | C (own) | — | — | — | — |
| **E.4 Class Booking** |
| E.4.1 Book class for self (client) | — | — | — | — | RW | — |
| E.4.2 Book class for others (staff) | FA | RW | RW | — | — | — |
| E.4.3 Cancel own booking | — | — | — | — | RW | — |
| E.4.4 Cancel any booking (staff) | FA | RW | RW | — | — | — |
| E.4.5 View own bookings | FA | C (location) | C (location) | C (own) | C (own) | — |
| E.4.6 View class attendee list | FA | C (location) | C (location) | C (own class) | — | — |
| **E.5 Waitlist Management** |
| E.5.1 Add to waitlist (self) | — | — | — | — | RW | — |
| E.5.2 View waitlist | FA | C (location) | C (location) | C (own class) | C (own) | — |
| E.5.3 Promote from waitlist (staff) | FA | RW | RW | — | — | — |
| E.5.4 Set waitlist limits | FA | C (own) | — | — | — | — |
| **E.6 Attendance Tracking** |
| E.6.1 Mark attendance (check-in) | FA | RW | RW | RW | — | — |
| E.6.2 Mark no-shows | FA | RW | RW | RW | — | — |
| E.6.3 View attendance history | FA | C (location) | C (location) | C (own class) | C (own) | — |
| E.6.4 Export attendance data | FA | C (location) | — | — | — | — |
| E.6.5 Self check-in (client) | — | — | — | — | RW | — |
| **E.7 Class Cancellation/Modification** |
| E.7.1 Cancel single class instance | FA | C (own) | — | — | — | — |
| E.7.2 Reschedule class | FA | C (own) | — | — | — | — |
| E.7.3 Notify attendees of changes | FA | C (location) | C (location) | C (own) | — | — |
| E.7.4 Emergency class cancellation | FA | C (own) | C (emergency) | C (own) | — | — |
| **E.8 Capacity Management** |
| E.8.1 Set class capacity | FA | C (own) | — | — | — | — |
| E.8.2 View current enrollment | FA | C (location) | C (location) | C (own) | RO | RO |
| E.8.3 Override capacity (staff) | FA | RW | — | — | — | — |
| **E.9 Coach Assignment** |
| E.9.1 Assign coach to class | FA | C (own) | — | — | — | — |
| E.9.2 View coach schedules | FA | C (location) | C (location) | C (own) | RO | RO |
| E.9.3 Request substitution (teacher) | — | — | — | RW | — | — |
| E.9.4 Approve substitution request | FA | C (own) | — | — | — | — |
| E.9.5 Swap classes between coaches | FA | C (own) | — | — | — | — |

**Key Decisions (E):**
- Managers control class scheduling and room allocation for their location — this is a core operational function.
- Teacher/Coaches can create one-time classes in their specialty area but cannot modify recurring schedules.
- Employees can handle day-of operations (check-ins, bookings, waitlist) but not schedule creation.
- Clients have full self-service booking/cancellation capabilities.
- Visitors can VIEW the class schedule (marketing tool) but cannot book — they must convert to a client.

---

## F. CRM & Sales

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **F.1 Lead & Prospect Management** |
| F.1.1 Create lead records | FA | RW | RW | — | — | — |
| F.1.2 Edit lead information | FA | RW | RW | — | — | — |
| F.1.3 View all leads | FA | C (location) | C (location) | — | — | — |
| F.1.4 Assign leads to staff | FA | RW | — | — | — | — |
| F.1.5 Import leads (CSV) | FA | — | — | — | — | — |
| **F.2 Sales Pipeline Tracking** |
| F.2.1 Define pipeline stages | FA | C (own) | — | — | — | — |
| F.2.2 Move leads through pipeline | FA | RW | RW | — | — | — |
| F.2.3 View pipeline dashboard | FA | C (location) | C (location) | — | — | — |
| F.2.4 Set win/loss reasons | FA | C (own) | — | — | — | — |
| **F.3 Follow-up Scheduling** |
| F.3.1 Schedule follow-up calls | FA | RW | RW | — | — | — |
| F.3.2 Receive follow-up reminders | FA | C (location) | C (location) | — | — | — |
| F.3.3 Log follow-up outcomes | FA | RW | RW | — | — | — |
| F.3.4 Set automated follow-ups | FA | C (own) | — | — | — | — |
| **F.4 Communication History** |
| F.4.1 View all client communications | FA | C (location) | C (own) | C (own) | — | — |
| F.4.2 Log phone call notes | FA | RW | RW | — | — | — |
| F.4.3 View email history | FA | C (location) | C (location) | — | — | — |
| F.4.4 Send manual messages | FA | RW | RW | — | — | — |
| **F.5 Conversion Tracking** |
| F.5.1 View conversion rates | FA | C (location) | RO | — | — | — |
| F.5.2 Track lead source effectiveness | FA | C (location) | — | — | — | — |
| F.5.3 View trial-to-member conversion | FA | C (location) | C (location) | — | — | — |
| **F.6 Online Joining Processing** |
| F.6.1 Process online applications | FA | RW | RW | — | — | — |
| F.6.2 Review submitted documents | FA | RW | RW | — | — | — |
| F.6.3 Approve/reject applications | FA | RW | — | — | — | — |
| F.6.4 Send welcome communications | FA | RW | RW | — | — | — |

**Key Decisions (F):**
- CRM is staff-only. Clients do not see the CRM system.
- Teacher/Coaches are excluded from CRM — their role is instruction, not sales.
- Employees can manage leads and follow-ups but cannot define pipeline stages (Manager-only).
- Conversion analytics are Manager-level and above for performance tracking.

---

## G. Marketing & Communications

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **G.1 Email Campaigns** |
| G.1.1 Create email campaigns | FA | C (own) | — | — | — | — |
| G.1.2 Edit email templates | FA | C (own) | — | — | — | — |
| G.1.3 Send campaigns | FA | C (own) | — | — | — | — |
| G.1.4 View campaign performance | FA | C (own) | — | — | — | — |
| G.1.5 Manage subscriber lists | FA | C (own) | — | — | — | — |
| **G.2 SMS Campaigns** |
| G.2.1 Create SMS campaigns | FA | C (own) | — | — | — | — |
| G.2.2 Send bulk SMS | FA | C (own) | — | — | — | — |
| G.2.3 View SMS delivery reports | FA | C (own) | — | — | — | — |
| **G.3 Push Notifications** |
| G.3.1 Compose push notifications | FA | C (own) | — | — | — | — |
| G.3.2 Schedule push notifications | FA | C (own) | — | — | — | — |
| G.3.3 Send instant push | FA | C (own) | C (own) | C (own) | — | — |
| G.3.4 Receive push notifications | — | RO | RO | RO | RO | RO |
| **G.4 Announcements & Bulletins** |
| G.4.1 Post location announcements | FA | C (own) | — | — | — | — |
| G.4.2 Post global announcements | FA | — | — | — | — | — |
| G.4.3 View announcements | FA | C (location) | C (location) | C (location) | C (location) | C (location) |
| G.4.4 Pin important notices | FA | C (own) | — | — | — | — |
| **G.5 Automated Workflows** |
| G.5.1 Create automation rules | FA | C (own) | — | — | — | — |
| G.5.2 Edit automation triggers | FA | C (own) | — | — | — | — |
| G.5.3 View automation logs | FA | C (own) | — | — | — | — |
| G.5.4 Enable/disable automations | FA | C (own) | — | — | — | — |
| **G.6 Member Segmentation** |
| G.6.1 Create segments | FA | C (own) | — | — | — | — |
| G.6.2 Edit segment criteria | FA | C (own) | — | — | — | — |
| G.6.3 View segment sizes | FA | C (own) | RO | — | — | — |
| G.6.4 Export segment lists | FA | C (own) | — | — | — | — |

**Key Decisions (G):**
- Marketing tools are Manager/Admin only — this is a strategic function.
- Employees can send instant push notifications (e.g., "Class starting in 5 minutes").
- All roles receive push notifications — this is a consumption feature.
- Visitors can view announcements to stay informed about gym news.

---

## H. Access Control

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **H.1 Check-in / Check-out** |
| H.1.1 Check in clients (staff scan) | FA | RW | RW | — | — | — |
| H.1.2 Self check-in (client) | — | — | — | — | RW | — |
| H.1.3 Manual check-in override | FA | RW | RW | — | — | — |
| H.1.4 Check-out recording | FA | RW | RW | — | — | — |
| **H.2 Entry Log Viewing** |
| H.2.1 View all entry logs | FA | C (location) | C (location) | — | — | — |
| H.2.2 View own entry history | — | — | — | — | RO | — |
| H.2.3 Export entry logs | FA | C (location) | — | — | — | — |
| H.2.4 View current occupancy | FA | C (location) | C (location) | RO | RO | RO |
| **H.3 Access Rule Configuration** |
| H.3.1 Set access hours per membership | FA | C (own) | — | — | — | — |
| H.3.2 Define restricted zones | FA | C (own) | — | — | — | — |
| H.3.3 Set VIP/premium access | FA | C (own) | — | — | — | — |
| H.3.4 Configure guest passes | FA | C (own) | — | — | — | — |
| **H.4 Membership Card Management** |
| H.4.1 Generate membership cards | FA | RW | RW | — | — | — |
| H.4.2 Print/reprint cards | FA | RW | RW | — | — | — |
| H.4.3 Deactivate lost cards | FA | RW | RW | — | — | — |
| H.4.4 View digital card | — | — | — | — | RO | — |
| H.4.5 QR code generation | FA | RW | RW | — | RO | RO (trial) |
| **H.5 Capacity Monitoring** |
| H.5.1 View real-time headcount | FA | C (location) | C (location) | RO | RO | RO |
| H.5.2 Set capacity alerts | FA | C (own) | — | — | — | — |
| H.5.3 View capacity history | FA | C (location) | — | — | — | — |

**Key Decisions (H):**
- Self check-in for Clients reduces front-desk load and improves the member experience.
- Visitors get a trial QR code upon trial registration — this is their access credential.
- Employees can process check-ins and handle card issues but cannot configure access rules.
- Real-time capacity is visible to all to help with visit planning.

---

## I. POS & Inventory

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **I.1 Product Catalog Management** |
| I.1.1 Add new products | FA | C (own) | — | — | — | — |
| I.1.2 Edit product details | FA | C (own) | — | — | — | — |
| I.1.3 Set product pricing | FA | C (own) | — | — | — | — |
| I.1.4 Organize by category | FA | C (own) | — | — | — | — |
| I.1.5 Upload product images | FA | C (own) | — | — | — | — |
| I.1.6 View product catalog | FA | C (location) | C (location) | — | RO | RO |
| **I.2 Stock Management** |
| I.2.1 Record stock intake | FA | RW | RW | — | — | — |
| I.2.2 Adjust stock levels | FA | RW | RW | — | — | — |
| I.2.3 View current stock levels | FA | C (location) | C (location) | — | — | — |
| I.2.4 Set low-stock alerts | FA | C (own) | — | — | — | — |
| I.2.5 Stock count/audit | FA | RW | RW | — | — | — |
| **I.3 Sales Processing** |
| I.3.1 Process product sale | FA | RW | RW | — | — | — |
| I.3.2 Process membership sale | FA | RW | RW | — | — | — |
| I.3.3 Apply discounts | FA | RW | RW | — | — | — |
| I.3.4 Split payments | FA | RW | — | — | — | — |
| I.3.5 View own purchase history | — | — | — | — | RO | — |
| **I.4 Purchase Order Management** |
| I.4.1 Create purchase orders | FA | C (own) | — | — | — | — |
| I.4.2 Receive purchase orders | FA | RW | RW | — | — | — |
| I.4.3 View PO history | FA | C (location) | RO | — | — | — |
| I.4.4 Track pending orders | FA | C (location) | — | — | — | — |
| **I.5 Supplier Management** |
| I.5.1 Add/edit suppliers | FA | C (own) | — | — | — | — |
| I.5.2 View supplier list | FA | C (location) | RO | — | — | — |
| I.5.3 View supplier history | FA | C (location) | — | — | — | — |
| **I.6 Inventory Reporting** |
| I.6.1 View inventory valuation | FA | C (location) | — | — | — | — |
| I.6.2 View sales by product | FA | C (location) | RO | — | — | — |
| I.6.3 View stock movement report | FA | C (location) | — | — | — | — |
| I.6.4 Export inventory reports | FA | C (location) | — | — | — | — |

**Key Decisions (I):**
- POS operations are handled by Employees and Managers. Teacher/Coaches have no POS access.
- Clients can view products (and buy online if e-commerce is enabled) but staff handle in-person sales.
- Purchase orders and supplier management are Manager-level to control procurement budgets.
- Inventory reporting is Manager-level for financial oversight.

---

## J. Analytics & Reporting

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **J.1 Dashboard Viewing** |
| J.1.1 View global admin dashboard | FA | — | — | — | — | — |
| J.1.2 View location dashboard | FA | C (own) | C (location) | C (own) | C (own) | — |
| J.1.3 Customize dashboard layout | FA | C (own) | C (own) | C (own) | C (own) | — |
| J.1.4 Set dashboard date ranges | FA | C (own) | C (own) | C (own) | C (own) | — |
| **J.2 Custom Report Creation** |
| J.2.1 Build custom reports | FA | C (own) | — | — | — | — |
| J.2.2 Save report templates | FA | C (own) | — | — | — | — |
| J.2.3 Share reports | FA | C (own) | — | — | — | — |
| J.2.4 Schedule report delivery | FA | C (own) | — | — | — | — |
| **J.3 Data Export** |
| J.3.1 Export to CSV | FA | C (location) | C (own data) | C (own data) | C (own) | — |
| J.3.2 Export to PDF | FA | C (location) | C (own data) | C (own data) | C (own) | — |
| J.3.3 Export to Excel | FA | C (location) | — | — | — | — |
| J.3.4 API access | FA | — | — | — | — | — |
| **J.4 KPI Tracking** |
| J.4.1 View revenue KPIs | FA | C (location) | — | — | — | — |
| J.4.2 View membership KPIs | FA | C (location) | RO | — | — | — |
| J.4.3 View attendance KPIs | FA | C (location) | C (location) | C (own) | — | — |
| J.4.4 View retention KPIs | FA | C (location) | — | — | — | — |
| J.4.5 Set KPI targets | FA | C (own) | — | — | — | — |
| **J.5 Trend Analysis** |
| J.5.1 View attendance trends | FA | C (location) | RO | C (own) | C (own) | — |
| J.5.2 View revenue trends | FA | C (location) | — | — | — | — |
| J.5.3 View member growth trends | FA | C (location) | — | — | — | — |
| J.5.4 Class popularity trends | FA | C (location) | C (location) | C (own) | RO | RO |
| **J.6 Comparative Reports** |
| J.6.1 Location vs location comparison | FA | — | — | — | — | — |
| J.6.2 Period vs period comparison | FA | C (location) | — | — | — | — |
| J.6.3 Coach performance comparison | FA | C (location) | — | C (own) | — | — |

**Key Decisions (J):**
- Admin is the only role that can compare across locations — prevents competitive concerns between Managers.
- Teacher/Coaches can see their own performance analytics but not compare with other coaches.
- Clients can see their own workout trends and class popularity (for booking decisions).
- Employees get limited reporting (attendance, basic KPIs) for operational awareness.

---

## K. Content Management

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **K.1 App Content Editing** |
| K.1.1 Edit app home screen content | FA | C (own) | — | — | — | — |
| K.1.2 Manage app navigation | FA | — | — | — | — | — |
| K.1.3 Edit FAQ/help content | FA | C (own) | — | — | — | — |
| K.1.4 Configure app branding | FA | — | — | — | — | — |
| **K.2 Class Descriptions** |
| K.2.1 Write class descriptions | FA | C (own) | — | C (own) | — | — |
| K.2.2 Upload class media | FA | C (own) | — | C (own) | — | — |
| K.2.3 View class descriptions | FA | C (location) | C (location) | C (location) | RO | RO |
| **K.3 Promotional Content** |
| K.3.1 Create promotional banners | FA | C (own) | — | — | — | — |
| K.3.2 Set promotional offers | FA | C (own) | — | — | — | — |
| K.3.3 Schedule promotional content | FA | C (own) | — | — | — | — |
| K.3.4 View promotional content | FA | C (location) | C (location) | C (location) | RO | RO |
| **K.4 Document Uploads** |
| K.4.1 Upload gym documents | FA | C (own) | — | — | — | — |
| K.4.2 Upload waivers/forms | FA | C (own) | RW | — | — | — |
| K.4.3 Upload client documents | FA | C (location) | RW | — | — | — |
| K.4.4 View/download documents | FA | C (location) | C (location) | C (location) | C (own) | RO |

**Key Decisions (K):**
- Teacher/Coaches can write their own class descriptions and upload class media — they know their classes best.
- Promotional content is Manager/Admin only to maintain brand consistency.
- Clients can view gym documents (terms, schedules) and their own uploaded documents.

---

## L. System Settings

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **L.1 Global Configuration** |
| L.1.1 Configure system-wide settings | FA | — | — | — | — | — |
| L.1.2 Set default time zone | FA | — | — | — | — | — |
| L.1.3 Configure language/locale | FA | — | — | — | — | — |
| L.1.4 Set system defaults | FA | — | — | — | — | — |
| **L.2 Integration Settings** |
| L.2.1 Configure payment gateways | FA | — | — | — | — | — |
| L.2.2 Set up API integrations | FA | — | — | — | — | — |
| L.2.3 Manage webhooks | FA | — | — | — | — | — |
| L.2.4 Configure third-party apps | FA | — | — | — | — | — |
| **L.3 Notification Templates** |
| L.3.1 Edit email templates | FA | — | — | — | — | — |
| L.3.2 Edit SMS templates | FA | — | — | — | — | — |
| L.3.3 Edit push notification templates | FA | C (own) | — | — | — | — |
| L.3.4 Preview templates | FA | C (own) | — | — | — | — |
| **L.4 Backup & Recovery** |
| L.4.1 Trigger manual backup | FA | — | — | — | — | — |
| L.4.2 Schedule backups | FA | — | — | — | — | — |
| L.4.3 Restore from backup | FA | — | — | — | — | — |
| L.4.4 View backup history | FA | — | — | — | — | — |
| **L.5 Audit Log Viewing** |
| L.5.1 View system audit log | FA | — | — | — | — | — |
| L.5.2 View user activity log | FA | C (location) | — | — | C (own) | — |
| L.5.3 View financial audit log | FA | — | — | — | — | — |
| L.5.4 Filter/search audit logs | FA | — | — | — | — | — |
| L.5.5 Export audit logs | FA | — | — | — | — | — |
| **L.6 Security Settings** |
| L.6.1 Configure password policies | FA | — | — | — | — | — |
| L.6.2 Set up 2FA/MFA | FA | — | — | — | C (own) | — |
| L.6.3 Manage IP restrictions | FA | — | — | — | — | — |
| L.6.4 Configure session timeouts | FA | — | — | — | — | — |
| L.6.5 Manage API keys | FA | — | — | — | — | — |

**Key Decisions (L):**
- System settings are almost entirely Admin-only — these are infrastructure concerns.
- Managers can customize push notification templates for their location only.
- Users can view their own activity log for security transparency (GDPR).
- Clients can enable 2FA on their own account for security.

---

## M. Mobile-Specific Features

| Feature / Sub-feature | Admin | Manager | Employee | Teacher/Coach | Client | Visitor |
|-----------------------|:-----:|:-------:|:--------:|:-------:|:------:|:-------:|
| **M.1 Push Notification Receiving** |
| M.1.1 Receive system alerts | FA | RO | RO | RO | RO | RO |
| M.1.2 Receive class reminders | — | — | — | — | RO | — |
| M.1.3 Receive booking confirmations | — | — | — | — | RO | RO |
| M.1.4 Receive payment alerts | — | — | — | — | RO | — |
| M.1.5 Receive marketing messages | — | — | — | — | RO | RO |
| **M.2 Photo-Based Issue Reporting** |
| M.2.1 Take/upload photos | FA | RW | RW | RW | RO | — |
| M.2.2 Annotate images | FA | RW | RW | RW | — | — |
| M.2.3 Attach to work orders | FA | C (location) | C (location) | — | — | — |
| M.2.4 View reported issues | FA | C (location) | C (location) | — | — | — |
| **M.3 Barcode/QR Scanning** |
| M.3.1 Scan membership cards | FA | RW | RW | — | — | — |
| M.3.2 Scan for class check-in | FA | RW | RW | RW | — | — |
| M.3.3 Display own QR code | — | — | — | — | RO | RO |
| M.3.4 Scan product barcodes | FA | RW | RW | — | — | — |
| M.3.5 Scan equipment QR codes | FA | RW | RW | — | — | — |
| **M.4 Offline Mode Access** |
| M.4.1 View cached schedule | FA | RO | RO | RO | RO | RO |
| M.4.2 Record offline check-ins | FA | RW | RW | — | — | — |
| M.4.3 Queue offline bookings | — | — | — | — | RW | — |
| M.4.4 Sync when reconnected | FA | RW | RW | RW | RW | — |
| M.4.5 View cached client data | FA | C (location) | C (location) | C (own) | C (own) | — |
| **M.5 GPS/Location Features** |
| M.5.1 GPS check-in verification | — | — | — | — | RW | — |
| M.5.2 Find nearby gym locations | FA | RO | RO | RO | RO | RO |
| M.5.3 Location-based offers | — | — | — | — | RO | RO |
| M.5.4 Track route to gym | — | — | — | — | RO | RO |
| **M.6 Biometric Authentication** |
| M.6.1 Enable fingerprint login | — | — | — | — | RW | — |
| M.6.2 Enable Face ID login | — | — | — | — | RW | — |
| M.6.3 Require biometric for payments | — | — | — | — | RW | — |
| M.6.4 Admin override (biometric disable) | FA | — | — | — | — | — |

**Key Decisions (M):**
- Push notifications are universal but the content varies by role.
- Photo-based issue reporting is powerful for facility maintenance — staff can snap and report equipment issues instantly.
- Clients can enable biometric authentication for convenience and security.
- GPS check-in verifies the client is physically at the gym (prevents remote check-in fraud).
- Offline mode is critical for gym environments where WiFi may be spotty (basement gyms, rural locations).

---

## Cross-Reference Summary

### Permission Count by Role

| Role | Full Access Areas | Read+Write Areas | Read-Only Areas | Conditional Access |
|------|-----------------|------------------|-----------------|-------------------|
| Admin | 13/13 categories | All user types, all locations | Audit logs | — |
| Manager | 10/13 categories (location-scoped) | Users at location, billing | Cross-location data | — |
| Employee | 3/13 categories (operational) | Check-ins, POS, attendance | Schedules, capacity | Location-scoped |
| Teacher/Coach | 2/13 categories (class-related) | Attendance, class notes | Own schedule, own clients | Own classes only |
| Client | 0/13 categories | Own bookings, own account | Gym info, class schedules | Own data only |
| Visitor | 0/13 categories | Trial signup, online joining | Gym showcase, class schedules | Trial data only |

### High-Risk Permission Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Admin can delete other Admins | Requires escalation protocol; prevent single-point-of-failure |
| 2 | Manager cannot view other locations | Prevent competitive intelligence sharing between locations |
| 3 | Employee cannot issue refunds | Financial control — prevents theft/mistakes |
| 4 | Teacher/Coach can create one-time classes | Empowers coaches while limiting structural changes |
| 5 | Client can self-cancel booking | Reduces support load but needs cancellation policy enforcement |
| 6 | Visitor can view full class schedule | Marketing tool — transparency drives conversion |
| 7 | Multi-location comparison is Admin-only | Prevents Manager-level data leaks between franchise locations |

---

## GDPR & Compliance Notes

| Role | Data Access Scope | Right to Erasure Handling |
|------|------------------|---------------------------|
| Admin | All personal data | Processes erasure requests for all users |
| Manager | Location's client data | Initiates erasure requests; Admin approves |
| Employee | Client interaction data | Cannot process erasure |
| Teacher/Coach | Client workout data (anonymized) | Cannot process erasure |
| Client | Own data only | Self-service data export; requests deletion via support |
| Visitor | Own registration data | Self-service account deletion before conversion |

---

*Document generated for OhMyGold RBAC System Architecture. All permissions subject to implementation validation.*


---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-29 | Fix T2-003: Changed role name "Teacher" to "Teacher/Coach" throughout for consistency | Audit Fix |


---

## Appendix A: Visitor Role Analysis

> Added per audit finding T2-009: Include Visitor role analysis in permission matrix.

### A.1 Visitor Role Characteristics

| Characteristic | Value |
|---------------|-------|
| **Role Name** | Visitor (Unauthenticated) |
| **Authentication** | Not required |
| **Data Access** | Public information only |
| **Session** | Cookie-based, no PII stored |
| **Legal Basis** | Legitimate interest (browsing) |

### A.2 Visitor Permission Matrix

| Module | Feature | Visitor Access | Read | Write | Notes |
|--------|---------|---------------|------|-------|-------|
| **Membership** | Member Registration | ✅ Full | - | Create Account | Public signup form |
| **Membership** | View Member Profile | ❌ None | - | - | Login required |
| **Bookings** | View Class Schedule | ✅ Limited | List | - | See public schedule only |
| **Bookings** | Book Classes | ❌ None | - | - | Login required |
| **CRM** | Contact Form | ✅ Full | - | Submit | Public contact form |
| **CRM** | Lead Registration | ✅ Full | - | Create | Free trial booking |
| **Content** | FAQ & Knowledge Base | ✅ Full | Read | - | Public help content |
| **Content** | Blog/Articles | ✅ Full | Read | - | Public content |
| **Content** | Club Information | ✅ Full | Read | - | Public pages |
| **Content** | Pricing/Subscriptions | ✅ Full | Read | - | Public pricing page |
| **Shop** | Browse Products | ✅ Limited | Read | - | Catalog only, no prices |
| **Shop** | Purchase Products | ❌ None | - | - | Login + payment required |
| **Account** | Login | ✅ Full | - | - | Authentication gateway |
| **Account** | Password Reset | ✅ Full | - | Write | Self-service password recovery |
| **GDPR** | Cookie Consent | ✅ Full | - | Write | Consent preference management |
| **GDPR** | Privacy Policy | ✅ Full | Read | - | Public legal document |
| **GDPR** | Terms of Service | ✅ Full | Read | - | Public legal document |
| **Support** | Cancellation Form | ✅ Full | - | Submit | Public cancellation request |

### A.3 Visitor → Authenticated Role Progression

```
Visitor Journey States:

[Anonymous Visitor]
    │
    ├── Views public content (FAQ, pricing, club info)
    │
    ├── Submits contact form → [Lead]
    │
    ├── Books free trial → [Prospective Member]
    │
    ├── Creates account → [Member] (pending activation)
    │
    └── Registers via online joining → [Member] (after payment)

State Transitions:
- Visitor → Lead: Contact form submission
- Visitor → Prospective Member: Free trial booking
- Visitor → Member: Account creation + payment
- Lead → Member: Conversion through sales pipeline
- Prospective Member → Member: Post-trial signup
```

### A.4 Visitor Data Handling

| Data Type | Stored? | Retention | Purpose |
|-----------|---------|-----------|---------|
| Page views (anonymous) | Yes | 30 days | Analytics |
| Form submissions | Yes | Per legal requirement | Contact/lead processing |
| IP address | Hashed | 30 days | Security/analytics |
| Cookie preferences | Yes | 1 year | Consent management |
| Session ID | Yes | Session | State management |



---

## Appendix B: Contextual Permission Rules

> Added per audit finding T2-010: Add contextual rules (location, time, role hierarchy) to permission matrix.

### B.1 Context-Aware Permission Rules

| # | Context Variable | Rule | Affected Roles | Affected Features |
|---|-----------------|------|----------------|-------------------|
| C-001 | **Location** | Manager can only view/edit data for clubs they manage | Manager | All club data |
| C-002 | **Location** | Super Admin can view/edit all clubs; Manager only assigned clubs | Super Admin, Manager | Multi-site dashboard |
| C-003 | **Location** | Staff members are scoped to a single club | Staff | Check-in, bookings |
| C-004 | **Location** | Member can only book classes at their home club unless cross-club is enabled | Member | Class booking |
| C-005 | **Time** | Bookings can only be made for future dates/times | All authenticated | Booking system |
| C-006 | **Time** | Class cancellation allowed up to X hours before start (configurable per club) | Member | Cancellation |
| C-007 | **Time** | Check-in only valid during club operating hours | Member | Access control |
| C-008 | **Time** | Staff time & attendance only recordable during scheduled shifts | Staff | Time tracking |
| C-009 | **Time** | 8-week cancellation notice period applies to all voluntary cancellations | Member | Cancellation |
| C-010 | **Time** | 14-day withdrawal period applies from signup date | Member | Withdrawal |
| C-011 | **Role Hierarchy** | Super Admin can override any permission decision | Super Admin | All |
| C-012 | **Role Hierarchy** | Manager permissions are subset of Super Admin | Manager | All |
| C-013 | **Role Hierarchy** | Teacher/Coach permissions are scoped to their assigned activities | Teacher/Coach | Bookings, schedules |
| C-014 | **Role Hierarchy** | Staff permissions are scoped to front-desk operations | Staff | Check-in, POS |
| C-015 | **Membership Status** | Active members have full access; frozen members have read-only | Member | Member portal |
| C-016 | **Membership Status** | Cancelled members retain portal access for 30 days post-cancellation | Ex-Member | Document access |
| C-017 | **Payment Status** | Members with failed payments have restricted booking access | Member | Bookings |
| C-018 | **Payment Status** | Full access restored after payment settlement | Member | All features |
| C-019 | **Age** | Members under 18 require guardian consent for certain activities | Minor Member | Waivers, bookings |
| C-020 | **Trial Status** | Trial members can book classes but cannot access premium zones | Trial Member | Bookings |

### B.2 Permission Override Matrix

| Scenario | Default Permission | Override Rule | Authorized By |
|----------|-------------------|---------------|---------------|
| Emergency medical access | Staff: read-only vitals | Full read access granted | System automatic |
| Refund processing | Manager: approve < 100 EUR | Can approve up to 500 EUR with Super Admin notification | Manager + notification |
| Class override | Teacher/Coach: own classes only | Can cover other instructor's class with manager approval | Manager delegation |
| Data correction | Staff: no edit | Can update member contact info with audit trail | Staff + logged |
| Late cancellation | Member: no refund within 24h | Refund exception with manager approval | Manager override |
| Access after hours | Member: denied | Extended access for premium members | Membership tier rule |

### B.3 Dynamic Permission Resolution Flow

```
Permission Request
    │
    ├── Step 1: Check base role permission
    │       └── Denied? → Check override rules
    │
    ├── Step 2: Apply location context
    │       └── Club scope matches user's club assignment?
    │
    ├── Step 3: Apply time context
    │       └── Within valid time window?
    │
    ├── Step 4: Apply status context
    │       └── Membership/payment status valid?
    │
    ├── Step 5: Apply hierarchy context
    │       └── Is override authorized by higher role?
    │
    └── Final Decision: ALLOW / DENY / OVERRIDE
```


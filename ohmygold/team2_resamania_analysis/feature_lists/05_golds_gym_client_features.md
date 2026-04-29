# Gold's Gym France - Client-Facing Features to Implement in OhMyGold

> **Document Type**: Client Feature Requirements
> **Source**: Analysis of 8 Gold's Gym France HTML pages
> **Date**: 2026-04-29
> **Issue ID**: T2-002 (CRITICAL)
> **Author**: Audit Fix

---

## Table of Contents

1. [Subscription Tiers and Membership Features](#1-subscription-tiers-and-membership-features)
2. [Cancellation Workflow](#2-cancellation-workflow)
3. [Contact and Support Features](#3-contact-and-support-features)
4. [Equipment Zones and Digital Representations](#4-equipment-zones-and-digital-representations)
5. [Member Portal Features (Implied)](#5-member-portal-features-implied)
6. [Terms of Service Data Handling Requirements](#6-terms-of-service-data-handling-requirements)
7. [Source Page Inventory](#7-source-page-inventory)

---

## 1. Subscription Tiers and Membership Features

### Source Pages
- `Abonnements | golds-gym (4_29_2026 5:31:24 AM).html`
- `CGV | golds-gym (4_29_2026 5:32:24 AM).html`
- `Gold's Gym France | Enseigne de salles de sport en Ile-de-France (4_29_2026 5:30:01 AM).html`

### 1.1 Club Selection and Registration

| Feature | Description | Digital Implementation Required |
|---------|-------------|--------------------------------|
| **Club Locator** | Interactive map showing club locations with real-time status | Google Maps integration, club markers with status |
| **Club Selection** | Dropdown/picker to choose between multiple club locations | Club ID parameter (`club_id=328`, `club_id=266`) |
| **Online Registration** | Complete membership signup via web | Multi-step checkout form at `/checkout-offer/?club_id=X` |
| **Free Trial Booking** | Book a complimentary trial session | External form integration (fillout.com) |
| **Membership Activation** | Contract effective upon registration + payment of signup fee + first month | Payment gateway integration, contract acceptance checkbox |

### 1.2 Club Locations Identified

| Club | Address | Hours | Status | Club ID |
|------|---------|-------|--------|---------|
| Gold's Gym - Thiais | 12 Rue des Alouettes, 94320 Thiais | 7J/7, 24h/24 | Ouvert | 328 |
| Gold's Gym - Val d'Europe | 14 Cours du Danube, 77700 Serris | 7J/7, 06:00-23:00 | Ouvert | 266 |

### 1.3 Subscription Contract Terms (from CGV)

| Feature | Requirement | Priority |
|---------|-------------|----------|
| **Personal Membership** | Membership is personal and non-transferable | Must-Have |
| **Age Verification** | Members must be 18+ | Must-Have |
| **Health Declaration** | Member declares good health and fitness capability | Must-Have |
| **Digital Contract Acceptance** | Checkbox: "J'ai lu et j'accepte les termes et conditions du contrat" | Must-Have |
| **Signup Fee** | One-time registration fee (currently offered as "FRAIS D'INSCRIPTION OFFERTS") | Must-Have |
| **Monthly Billing** | Recurring monthly subscription charges | Must-Have |
| **Price Change Notification** | 8-week notice for tariff changes; member can cancel during notice period | Must-Have |
| **14-Day Withdrawal Right** | Full refund within 14 days of online signup (Consumer Code L221-18) | Must-Have |
| **Proportional Refund** | If services used during withdrawal period, charge proportional to usage | Must-Have |
| **Re-enrollment** | Former members can re-enroll after settling outstanding debts + new signup fee | Should-Have |
| **Card Imprint (Guarantee)** | Store card details as guarantee (max 2 months of fees) for payment incidents | Must-Have |

### 1.4 Promotional Features

| Feature | Description | Source |
|---------|-------------|--------|
| **Free Registration Promo** | "FRAIS D'INSCRIPTION OFFERTS" - signup fee waiver | Header banner |
| **Session d'Essai** | Free trial session booking via dedicated form | Button on all pages |
| **Monthly Smoothie** | New signature smoothie recipe every month at Fuel Bar | Fuel Bar section |

---

## 2. Cancellation Workflow

### Source Pages
- `Resiliation | golds-gym (4_29_2026 5:33:06 AM).html`
- `CGV | golds-gym (4_29_2026 5:32:24 AM).html`

### 2.1 Cancellation Form Fields

The public-facing cancellation form captures:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **Nom** | Text input | Yes | Last name |
| **Prenom** | Text input | Yes | First name |
| **Telephone** | Phone input | Yes | Contact number |
| **E-mail** | Email input | Yes | Member email address |
| **Mon club** | Dropdown | Yes | Options: "Belle Epine" (more clubs expected) |
| **Raison** | Dropdown | Yes | Options: "Pas le Temps" (more reasons expected) |
| **Piece justificative** | File upload | No | Max file size: 256 MB |
| **Commentaire** | Textarea | No | Free-text additional comments |

### 2.2 Cancellation Business Rules (from CGV)

| Rule | Description | Implementation |
|------|-------------|----------------|
| **8-Week Notice Period** | Member must give 8 weeks notice and pay fees during notice period | Date calculation + billing logic |
| **Medical Cancellation** | Immediate cancellation with medical certificate via registered mail | Document upload + admin approval workflow |
| **Online Cancellation** | Member can cancel via "espace membre" (member portal) | Self-service portal feature |
| **Cancellation Form** | Public cancellation form also available (the form above) | Public form + CRM ticket creation |
| **Outstanding Payments** | Re-enrollment requires settlement of all outstanding debts | Payment tracking + re-enrollment gating |
| **Refund Method** | Refund via original payment method within 14 days | Payment gateway reversal |

### 2.3 OhMyGold Cancellation Workflow Requirements

```
Cancellation Trigger Points:
1. Member Portal Self-Service (espace membre)
2. Public Cancellation Form (Resiliation page)
3. Medical Cancellation (with uploaded certificate)
4. Non-Payment Cancellation (admin-initiated)
5. Price Change Cancellation (8-week window)

Required Backend Workflows:
- Cancellation request → CRM ticket
- 8-week notice period tracking
- Medical document upload and admin review
- Automatic billing during notice period
- Pro-rated refund calculation (14-day withdrawal)
- Membership status transition: Active → Pending Cancellation → Cancelled
- Access revocation at cancellation effective date
```

---

## 3. Contact and Support Features

### Source Pages
- `Contact | golds-gym (4_29_2026 5:32:48 AM).html`
- `CGV | golds-gym (4_29_2026 5:32:24 AM).html`

### 3.1 Contact Form Fields

| Field | Type | Required |
|-------|------|----------|
| **Nom** | Text input | Yes |
| **Prenom** | Text input | Yes |
| **E-mail** | Email input | Yes |
| **Telephone** | Phone input | Yes |
| **Choix du club** | Dropdown | Yes |
| **Message** | Textarea | Yes |

### 3.2 Support and Dispute Resolution

| Feature | Description | Source Reference |
|---------|-------------|-----------------|
| **Consumer Mediation (CM2C)** | Free mediation service for disputes | cm2c@cm2c.net, 01 89 47 00 14, 49 Rue de Ponthieu, 75008 Paris |
| **European ODR Platform** | Online dispute resolution at ec.europa.eu/consumers/odr/ | Code de la consommation |
| **Telemarketing Opt-Out** | Member right to register on anti-telemarketing list (L223-2) | GDPR feature |
| **Cookie Consent Management** | Granular consent: Functional, Preferences, Statistics, Marketing | GDPR + ePrivacy compliance |
| **Legal Pages** | CGV, Mentions legales, Politique de confidentialite | Content management system |
| **Social Media Links** | Instagram, Facebook, YouTube | Footer links |
| **International Network Links** | Germany, Austria, Italy, Switzerland gym links | Multi-country support |

### 3.3 OhMyGold Contact Feature Requirements

```
Contact Form → CRM Lead/Case
  ↓
Club Assignment (based on "Choix du club")
  ↓
Automated Acknowledgment Email
  ↓
Staff Notification to Assigned Club
  ↓
Case Tracking in Back Office
```

---

## 4. Equipment Zones and Digital Representations

### Source Pages
- `Les espaces de nos salles de musculation | Gold's Gym (4_29_2026 5:31:35 AM).html`
- `Gold's Gym France | Enseigne de salles de sport en Ile-de-France (4_29_2026 5:30:01 AM).html`

### 4.1 Equipment Zones

| Zone | Description | Equipment | Digital Representation |
|------|-------------|-----------|----------------------|
| **Gold's Iron Ground** | Free weights arena | Free weights, barbells, dumbbells (premium) | Zone map, equipment list, live occupancy |
| **GOLD'S PULSE** | Cardio zone | Treadmills, bikes, rowers, high-tech machines | Zone map, equipment list, real-time availability |
| **Gold's Queen** | Women's dedicated area | Custom-designed machines, stylish exclusive space | Zone map, schedule, women-only session times |
| **GOLD'S ARENA** | Combat sports | Punching bags, boxing ring, cage, quality equipment | Zone map, class schedule, booking |
| **GOLD'S CROSSZONE** | Functional training/CrossFit | Kettlebells, box jumps, racks, ropes, wall balls | Zone map, WOD display, class booking |
| **GOLD'S SHOP** | Retail | Athleisure apparel, supplements, equipment | Product catalog, inventory, e-commerce integration |
| **Hydromassage** | Recovery area | Hydromassage equipment | Zone map, session booking |
| **Posing** | Posing/practice area | Posing mirrors, lighting | Zone map, availability |
| **Fuel Bar** | Nutrition bar | Smoothies, protein shakes, supplements | Menu display, mobile ordering, nutrition tracking |

### 4.2 Mobile App Integration with Equipment Zones

```
App Features per Zone:
- Zone navigation with interactive floor plan
- Real-time equipment availability
- Equipment usage tutorials/guides
- Session booking for zones/classes
- Queue/waitlist management
- Personalized workout recommendations by zone
```

---

## 5. Member Portal Features (Implied)

### Source Pages
- `Gold's Gym France | Enseigne de salles de sport en Ile-de-France (4_29_2026 5:30:01 AM).html`
- `CGV | golds-gym (4_29_2026 5:32:24 AM).html`

### 5.1 "Espace Membre" (Member Portal) - CGV References

The CGV repeatedly references a member portal ("espace membre"):

| Implied Feature | Evidence from HTML | OhMyGold Implementation |
|-----------------|-------------------|------------------------|
| **Self-Service Cancellation** | "Le membre peut desinscrire a tout moment via l'espace membre" | Member portal cancellation workflow |
| **Contract Management** | Contract acceptance, terms review | Digital contract storage + versioning |
| **Payment Management** | Card imprint, payment history, outstanding debts | Payment methods, billing history, retry logic |
| **Profile Management** | "tenir a jour" contact info, health declaration | Editable profile with health questionnaire |
| **Club Check-in** | QR code or NFC entry | Access control integration |
| **Booking Management** | Class and session reservations | Booking calendar, waitlist, cancellations |
| **Progress Tracking** | "suivis tes progres" mentioned in app description | Workout logs, progress photos, metrics |

### 5.2 Mobile App Features (Explicit from Homepage)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Personalized Nutrition Plans** | Tailored meal plans for performance optimization | High |
| **Progress Tracking** | Workout logging, body measurements, performance metrics | High |
| **Session Preparation** | Pre-workout planning, exercise selection | Medium |
| **Personalized Advice** | AI/coach recommendations based on goals | Medium |
| **Fuel Bar Menu** | Browse smoothie recipes, place orders | Medium |
| **Shop Integration** | Browse and purchase apparel/supplements | Low |

### 5.3 Social and Community Features

| Feature | Source | Implementation |
|---------|--------|----------------|
| **Instagram Feed Integration** | @goldsgymfrance_ | Social media wall |
| **Facebook Presence** | goldsgymfrance.officiel | Social login, sharing |
| **YouTube Channel** | @goldsgymfrance | Video content embedding |
| **Community Events** | "FOLLOW THE LEGEND" branding | Event management module |

---

## 6. Terms of Service Data Handling Requirements

### Source Pages
- `CGV | golds-gym (4_29_2026 5:32:24 AM).html`
- `Gold's Gym France | Enseigne de salles de sport en Ile-de-France (4_29_2026 5:30:01 AM).html`

### 6.1 Data Collection Requirements

| Data Category | Specific Fields | Legal Basis | Retention |
|--------------|-----------------|-------------|-----------|
| **Personal Information** | Name, first name, phone, email, address | Contract execution | Duration of membership + legal period |
| **Health Data** | Health declaration, medical certificates | Explicit consent (GDPR Art 9) | Duration of membership |
| **Payment Data** | Card imprint (max 2 months guarantee), bank details | Contract execution | As required by financial regulations |
| **Identity Verification** | Age proof (18+ required) | Legal obligation | Duration of membership |
| **Club Usage Data** | Check-in times, zone usage, class attendance | Legitimate interest | As per privacy policy |
| **Cookie/Tracking Data** | Functional, Preferences, Statistics, Marketing | Consent | Per cookie consent choice |

### 6.2 GDPR and Legal Compliance Requirements

| Requirement | CGV Reference | Implementation |
|-------------|--------------|----------------|
| **Data Accuracy** | "informations exactes et veridiques, tenues a jour" | Profile validation, regular update prompts |
| **Health Data Protection** | Sensitive health data in contracts | Encrypted storage, limited access, consent tracking |
| **Right to Rectification** | Member must keep info updated | Self-service profile editing |
| **Right to Erasure** | Post-cancellation data handling | Data retention + anonymization policies |
| **Cookie Consent Granularity** | 4 levels: Functional, Preferences, Statistics, Marketing | Cookie consent manager with granular choices |
| **Telemarketing Opt-Out** | Article L223-2, liste d'opposition | Preference center, opt-out flag |
| **Consumer Mediation** | CM2C mediator contact | Dispute escalation workflow |
| **14-Day Withdrawal Right** | L221-18 Code de la consommation | Automated withdrawal processing |
| **Digital Contract Storage** | Contract must be accessible | Versioned contract repository |
| **Liability Waiver** | Health, personal property, equipment use | Digital signature capture |

### 6.3 Document and Form Retention

| Document Type | Retention Requirement | Digital Format |
|--------------|----------------------|----------------|
| Signed Contracts | Duration + legal period | PDF/A with timestamp |
| Cancellation Requests | Duration + legal period | Form submission + audit trail |
| Medical Certificates | Duration of relevant membership | Encrypted storage |
| Payment Records | Financial regulation period | Secure payment gateway records |
| Communication History | Legal period | CRM-integrated email/notification log |

---

## 7. Source Page Inventory

| # | Source Page | File Name | Key Features Extracted |
|---|-------------|-----------|----------------------|
| 1 | Gold's Gym Homepage (US) | `Gold's Gym： The Original Home of Serious Strength Training (4_29_2026 5：29：11 AM).html` | Brand positioning, training offerings, personal training, group classes, franchise info |
| 2 | Gold's Gym France Homepage | `Gold's Gym France ｜ Enseigne de salles de sport en Île-de-France (4_29_2026 5：30：01 AM).html` | App features, equipment zones, Fuel Bar, Shop, brand history |
| 3 | Brand & Franchise | `La Marque Gold's Gym ｜ Franchise & Histoire (4_29_2026 5：30：27 AM).html` | Brand history, franchise model, heritage |
| 4 | Subscriptions | `Abonnements ｜ golds-gym (4_29_2026 5：31：24 AM).html` | Club selection, online registration, free trial booking |
| 5 | Equipment Zones | `Les espaces de nos salles de musculation ｜ Gold's Gym (4_29_2026 5：31：35 AM).html` | Zone descriptions, equipment details, training concepts |
| 6 | Terms of Service | `CGV ｜ golds-gym (4_29_2026 5：32：24 AM).html` | Contract terms, cancellation rules, payment terms, data handling, withdrawal rights |
| 7 | Contact | `Contact ｜ golds-gym (4_29_2026 5：32：48 AM).html` | Contact form fields, club selection for inquiries |
| 8 | Cancellation | `Résiliation ｜ golds-gym (4_29_2026 5：33：06 AM).html` | Cancellation form fields, reason capture, document upload |

---

## OhMyGold Implementation Priority Matrix

| Feature Area | Features | Priority | Effort | Dependencies |
|-------------|----------|----------|--------|--------------|
| Member Registration | Online signup, club selection, payment | P0 | High | Payment gateway, CRM |
| Cancellation Workflow | Self-service + admin cancellation | P0 | High | CRM, billing system |
| Member Portal | Espace membre, profile, bookings | P0 | High | Auth system, CRM |
| Access Control | Club check-in, zone access | P0 | Medium | Hardware integration |
| GDPR Compliance | Consent management, data handling | P0 | Medium | Legal framework |
| Contact/Support | Forms, ticketing, mediation | P1 | Medium | CRM |
| Mobile App | Nutrition, progress tracking | P1 | High | Member portal API |
| Equipment Zones | Digital floor plan, availability | P1 | Medium | IoT/occupancy sensors |
| Shop/E-commerce | Product catalog, purchases | P2 | High | Inventory, payments |
| Social Integration | Social media feeds | P2 | Low | Third-party APIs |

---

## Changelog

| Date | Change | Author | Issue ID |
|------|--------|--------|----------|
| 2026-04-29 | Created Gold's Gym client-facing features document from analysis of 8 HTML source pages | Audit Fix | T2-002 |

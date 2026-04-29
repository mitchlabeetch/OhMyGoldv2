# OhMyGold — Master Implementation Roadmap

> **Project:** OhMyGold — Gold's Gym France All-in-One Gym Management System
> **Version:** 1.0.0
> **Total Phases:** 9 development phases + 1 agent prompt library
> **Estimated Timeline:** 34-42 weeks (8-10 months)
> **Last Updated:** 2026-04-29

---

## Table of Contents

1. [How to Use This Roadmap](#how-to-use-this-roadmap)
2. [Project Phases Summary](#project-phases-summary)
3. [Timeline Overview](#timeline-overview)
4. [Dependencies Graph](#dependencies-graph)
5. [Risk Milestones](#risk-milestones)
6. [Resource Requirements](#resource-requirements)
7. [Definition of Done Per Phase](#definition-of-done-per-phase)

---

## How to Use This Roadmap

This roadmap is designed for **iterative execution by development teams and AI coding agents**. Each phase is a self-contained markdown file with:

- **Itemized work packages** with unique IDs (e.g., `1.1`, `3.4`)
- **LLM Agent Launch Prompts** ready to paste into an agent orchestrator
- **Success criteria** with checkboxes `[ ]` that agents tick on completion
- **Notes area templates** for agents to append completion notes
- **Dependency references** to other items/phases

### For Human Project Managers
1. Review the master roadmap below for overall timeline and dependencies
2. Open individual phase files for detailed planning and sprint assignment
3. Use agent prompts to dispatch work to AI coding agents
4. Track completion via checkbox states in each phase file

### For AI Agents / Orchestrators
1. Read the phase file assigned to you (e.g., `phase_01_foundation.md`)
2. For each item, read the **LLM Agent Launch Prompt** section
3. Execute the prompt, implementing the described changes
4. On completion, fill the **Notes Area Template** at the bottom of each item
5. Tick all success criteria checkboxes that pass
6. Cross-reference dependencies listed in the item before starting

### Cross-Reference Key
- **Design System:** `/mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD`
- **Feature List (Resamania):** `/mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/01_resamania_complete_feature_list.md`
- **Feature Workflows:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/02_feature_workflows.md`
- **New Feature Proposals:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/feature_lists/03_new_features_proposals.md`
- **Permission Matrix:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md`
- **Mobile Accessibility Matrix:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/03_mobile_accessibility_matrix.md`
- **Technical Best Practices:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md`
- **Mobile Research:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/research/07_mobile_features_research.md`
- **Research Synthesis:** `/mnt/agents/output/ohmygold/team2_resamania_analysis/research/09_research_synthesis.md`

---

## Project Phases Summary

| Phase | Name | Items | Est. Duration | Start Condition | Output |
|-------|------|-------|---------------|-----------------|--------|
| **Phase 1** | Project Foundation & Infrastructure | 10 items | 2-3 weeks | None — project kickoff | Monorepo, CI/CD, local dev environments, database scaffolding |
| **Phase 2** | Design System & Shared Components | 10 items | 2-3 weeks | Phase 1 complete | Design tokens, UI library, i18n, a11y primitives, animations |
| **Phase 3** | Authentication & Authorization | 10 items | 2-3 weeks | Phase 1 complete (can run parallel to Phase 2) | Full auth system, RBAC, RLS, OAuth, session management |
| **Phase 4** | Core Gym Management (Resamania Clone) | 16 items | 6-8 weeks | Phases 2+3 complete | All Resamania features: members, billing, booking, access, POS, CRM, analytics |
| **Phase 5** | Webapp Screen Implementation | 7 role-based packages | 4-6 weeks | Phase 4 at 50%+ | Per-role web screens for all 6 user roles |
| **Phase 6** | Native Mobile App Implementation | 12 items | 4-6 weeks | Phase 4 at 50%+ | React Native app for iOS & Android |
| **Phase 7** | Advanced Features & Innovation | 10 items | 4-5 weeks | Phase 4 complete | AI features, gamification, wearables, video, community |
| **Phase 8** | Compliance, Security & Polish | 10 items | 3-4 weeks | Phases 5+6 complete | WCAG, SOC2, GDPR, pentest, performance, testing |
| **Phase 9** | Deployment & Launch | 10 items | 2-3 weeks | Phase 8 complete | Production deploy, app stores, beta, full launch |
| **Phase 99** | Agent Prompts Library | 8 templates | Ongoing | Phase 1 complete | Reusable LLM agent prompt templates |

**Total Items:** 105+ detailed work packages
**Total Estimated Duration:** 34-42 weeks (8-10 months)
**Parallel Workstreams:** Max 3 (Foundation + Design + Auth can overlap; Web + Mobile can overlap)

---

## Timeline Overview

### Sequential View (Conservative)

```
Month 1    Month 2    Month 3    Month 4    Month 5    Month 6    Month 7    Month 8-9
|-----------|----------|----------|----------|----------|----------|----------|----------|
 [Phase 1    ]
 [Phase 2      ]
 [Phase 3         ]
              [Phase 4 (Core)                                  ]
              [Phase 5 (Web)           ]
              [Phase 6 (Mobile)           ]
                                    [Phase 7 (Advanced)         ]
                                    [Phase 8 (Compliance)       ]
                                                 [Phase 9 (Launch)]
```

### Parallel View (Optimized)

```
Stream A (Backend):  [P1] -> [P3] -> [P4 Core DB] --------------------------------------> [P8] -> [P9]
Stream B (Web UI):   [P1] -> [P2] -> [P4 Web Features] -> [P5 Screens] -------------------> [P8] -> [P9]
Stream C (Mobile):   [P1] -> [P2] -> [P4 API] ----------> [P6 Mobile] -> [P7 Advanced] -> [P8] -> [P9]
```

### Milestone Checkpoints

| Milestone | When | Criteria |
|-----------|------|----------|
| **M0: Kickoff** | Day 1 | Repo initialized, team onboarded |
| **M1: Foundation Ready** | Week 3 | CI/CD green, local dev working, DB migrations running |
| **M2: Design System Live** | Week 5 | Shared packages published, Storybook deployed, i18n working |
| **M3: Auth Complete** | Week 6 | Login/logout/OAuth working, RBAC enforced, RLS active |
| **M4: Core Feature Alpha** | Week 12 | All core modules functional in staging, booking/payment/CRM working |
| **M5: Web Beta** | Week 16 | All role screens implemented, responsive design verified |
| **M6: Mobile Beta** | Week 18 | iOS + Android apps in TestFlight/Internal Testing |
| **M7: Feature Complete** | Week 22 | All advanced features integrated, AI models deployed |
| **M8: Compliance Pass** | Week 25 | WCAG AA+, SOC2 doc ready, GDPR verified, pentest clean |
| **M9: Launch** | Week 27+ | Production live, stores submitted, pilot location active |

---

## Dependencies Graph

### Phase-Level Dependencies

```
Phase 1 (Foundation)
  |\
  | \
  |  \
  |   \
  |    \
Phase 2   Phase 3
  (Design) (Auth)
    \     /
     \   /
      \ /
   Phase 4 (Core Gym)
      / | \
     /  |  \
    /   |   \
Phase 5  |  Phase 6
 (Web)   |  (Mobile)
         |   /    |
         |  /     |
      Phase 7    |
   (Advanced)   |
         |     /
         |    /
      Phase 8
   (Compliance)
         |
      Phase 9
       (Launch)
```

### Critical Path

The critical path is: **Phase 1 -> Phase 3 -> Phase 4 -> Phase 6 -> Phase 8 -> Phase 9**

| Path Segment | Duration | Cumulative |
|--------------|----------|------------|
| Phase 1: Foundation | 3 weeks | Week 3 |
| Phase 3: Auth | 3 weeks | Week 6 |
| Phase 4: Core Gym | 8 weeks | Week 14 |
| Phase 6: Mobile | 6 weeks | Week 20 |
| Phase 8: Compliance | 4 weeks | Week 24 |
| Phase 9: Launch | 3 weeks | Week 27 |

**Critical Path Total: ~27 weeks (6.5 months)**

### High-Risk Dependencies

| Risk ID | Dependency | Impact if Delayed | Mitigation |
|---------|-----------|-------------------|------------|
| R-DEP-01 | Supabase self-hosted setup (1.2) | Blocks all backend work | Start Docker Compose immediately; have Supabase Cloud fallback |
| R-DEP-02 | Design tokens before components (2.1 -> 2.2) | Component rebuild needed | Lock token structure early; use CSS variables not hardcoded |
| R-DEP-03 | Auth before any data features (3.1 -> 4.x) | Cannot implement member/booking screens | Build screens with mock auth first; wire in later |
| R-DEP-04 | Core API before mobile screens (4.x -> 6.x) | Mobile app has no data | Build mobile with mock API layer; swap in real endpoints |
| R-DEP-05 | Payment processor before POS (4.9 -> 4.10) | POS cannot process transactions | Use Stripe test mode; simulate payment flows |
| R-DEP-06 | i18n before any user-facing text (2.3 -> 4.x) | All text hardcoded in one language | Build with i18n from day one; use t() for all strings |

---

## Risk Milestones

### High Risk (Red Zone)

| Risk ID | Risk | Phase | Probability | Impact | Mitigation |
|---------|------|-------|-------------|--------|------------|
| R-HIGH-01 | French fiscal certification (NF 525) non-compliance | Phase 8 | Medium | Critical | Engage French auditor early; follow Resamania cert patterns |
| R-HIGH-02 | Payment processor integration failure | Phase 4 | Medium | Critical | Stripe as primary; Mollie as EU fallback; test thoroughly |
| R-HIGH-03 | GDPR data breach during development | Phase 1-9 | Low | Critical | Pseudonymize all dev data; encryption at rest from day 1 |
| R-HIGH-04 | App store rejection (iOS/Android) | Phase 9 | Medium | High | Follow store guidelines; submit early for review feedback |
| R-HIGH-05 | Self-hosted Supabase production issues | Phase 1, 9 | Medium | High | Load test thoroughly; have managed Supabase migration path |

### Medium Risk (Amber Zone)

| Risk ID | Risk | Phase | Probability | Impact | Mitigation |
|---------|------|-------|-------------|--------|------------|
| R-MED-01 | WCAG 2.1 AA+ audit reveals major issues | Phase 8 | Medium | High | Build a11y in from Phase 2; automated axe testing in CI |
| R-MED-02 | AI model accuracy below target | Phase 7 | Medium | Medium | Start with rule-based; ML as enhancement; set 70% baseline |
| R-MED-03 | Wearable API changes breaking integration | Phase 7 | Medium | Medium | Abstract wearable layer; mock interfaces for testing |
| R-MED-04 | French i18n complexity (30% longer text) | Phase 2, 5 | High | Low | Design for text expansion from day 1; use flexible layouts |
| R-MED-05 | Offline-first sync conflicts | Phase 6 | Medium | Medium | Server-wins conflict resolution; clear sync status UI |

### Low Risk (Green Zone - Tracked)

| Risk ID | Risk | Phase | Probability | Impact | Mitigation |
|---------|------|-------|-------------|--------|------------|
| R-LOW-01 | React 19 breaking changes | Phase 1-2 | Low | High | Pin versions; test in isolated branch before upgrade |
| R-LOW-02 | Expo SDK deprecation | Phase 6 | Low | Medium | Stay on latest SDK; OTA update capability |
| R-LOW-03 | Team bandwidth constraints | All | Medium | Medium | Agent-assisted development; parallel workstreams |
| R-LOW-04 | Third-party API rate limits | Phase 7 | Low | Low | Implement rate limiting; caching layer |

---

## Resource Requirements

### Development Team (Recommended)

| Role | Count | Duration | Notes |
|------|-------|----------|-------|
| **Tech Lead / Architect** | 1 | Full project | Oversees architecture, reviews, technical decisions |
| **Backend Engineer** | 2 | Full project | Supabase, PostgreSQL, Edge Functions, integrations |
| **Frontend Engineer (Web)** | 2 | Week 3 onwards | React, TypeScript, admin dashboards |
| **Mobile Engineer (React Native)** | 2 | Week 3 onwards | Expo, iOS, Android |
| **DevOps Engineer** | 1 | Phase 1, 8-9 | VPS, Docker, CI/CD, monitoring |
| **QA Engineer** | 1 | Week 8 onwards | Manual + automated testing |
| **UX/UI Designer** | 1 | Phase 2, 5-6 | Design system, screen mockups |

### Infrastructure

| Resource | Spec | Purpose |
|----------|------|---------|
| **Production VPS** | 8 vCPU, 32GB RAM, 200GB SSD | Ubuntu 24.04 LTS, Caddy, Supabase stack |
| **Staging VPS** | 4 vCPU, 16GB RAM, 100GB SSD | Pre-production testing |
| **Monitoring VPS** | 2 vCPU, 4GB RAM | Grafana, Prometheus, Loki |
| **GitHub Actions runners** | Ubuntu latest | CI/CD pipeline |
| **Apple Developer Account** | $99/year | iOS app distribution |
| **Google Play Console** | $25 one-time | Android app distribution |

### Third-Party Services

| Service | Usage | Est. Monthly Cost |
|---------|-------|-------------------|
| **Stripe** | Payment processing | Transaction-based (~0.5-1% revenue) |
| **SendGrid / Mailgun** | Transactional email | ~$50-100/month |
| **Twilio** | SMS messaging | ~$50-200/month |
| **Firebase Cloud Messaging** | Push notifications | Free tier |
| **Apple Push Notification Service** | iOS push | Free |
| **Sentry** | Error tracking | ~$26/month |
| **Grafana Cloud** | Monitoring | ~$8-50/month |

---

## Definition of Done Per Phase

### Phase 1: Project Foundation & Infrastructure

```
[ ] All 10 items completed with success criteria met
[ ] CI/CD pipeline runs green on every push
[ ] All developers can run `pnpm dev` and have local environments
[ ] Database migrations apply cleanly with `supabase db reset`
[ ] TypeScript shared packages build without errors
[ ] Pre-commit hooks pass (lint, format, typecheck)
[ ] README.md with setup instructions verified by 2+ devs
[ ] Monitoring stack accessible at http://localhost:3001 (local)
[ ] Caddy reverse proxy routes all services correctly
[ ] Docker Compose starts all services with `docker compose up`
```

### Phase 2: Design System & Shared Components

```
[ ] Design tokens render correctly in light and dark mode
[ ] Storybook deployed with all components documented
[ ] i18n FR/EN switching works across all components
[ ] WCAG AA+ color contrast verified with automated tool
[ ] All form components pass accessibility audit
[ ] Animation system respects prefers-reduced-motion
[ ] Navigation patterns render correctly on all breakpoints
[ ] Toast/notification system tested with all variants
```

### Phase 3: Authentication & Authorization

```
[ ] Email/password login works on web and mobile
[ ] Google and Apple OAuth login works end-to-end
[ ] Role-based routing: users see only their authorized screens
[ ] RLS policies active on all tables with 100% row coverage
[ ] Password reset flow works with email verification
[ ] JWT refresh token flow tested (simulate expiry)
[ ] Audit log captures all auth events with timestamps
[ ] Session management: concurrent sessions, logout all devices
```

### Phase 4: Core Gym Management

```
[ ] All 16 feature modules implemented and functional
[ ] End-to-end membership lifecycle: enroll -> upgrade -> freeze -> cancel
[ ] Booking system with waitlist handles 100+ concurrent bookings
[ ] Check-in system processes entry in < 500ms
[ ] Payment processing: card, direct debit, one-off, refund
[ ] POS completes transaction in < 30 seconds
[ ] CRM pipeline: lead -> activity -> conversion tracked
[ ] Marketing campaigns send with > 98% delivery rate
[ ] Analytics dashboard shows real-time KPIs
[ ] All core features pass integration tests
```

### Phase 5: Webapp Screen Implementation

```
[ ] All 6 role-based screen sets implemented
[ ] Responsive design verified: xs -> 2xl breakpoints
[ ] Role-based guards prevent unauthorized route access
[ ] All screens pass axe accessibility audit (score >= 95)
[ ] All French text renders correctly (30% longer than English)
[ ] Loading states (skeleton) on all data-dependent screens
[ ] Error boundaries catch and display errors gracefully
[ ] E2E tests cover critical user journeys
```

### Phase 6: Native Mobile App Implementation

```
[ ] iOS and Android apps build without errors
[ ] All navigation patterns work (tabs, stack, drawer)
[ ] Push notifications received on both platforms
[ ] Offline mode: cached schedule, queued bookings sync
[ ] Biometric auth (Face ID / Fingerprint) works
[ ] Camera integration for photo reporting tested
[ ] QR/barcode scanning works in < 1 second
[ ] GPS features (check-in verification, gym finder) accurate
[ ] App passes platform-specific review criteria
```

### Phase 7: Advanced Features & Innovation

```
[ ] AI churn prediction: > 70% accuracy on test data
[ ] Smart recommendations: > 20% click-through rate
[ ] Community features: challenges, leaderboards functional
[ ] Gamification: badges, streaks, achievements tracked
[ ] Wearable integrations: Apple Health, Google Fit synced
[ ] Video content platform: streaming, progress tracking
[ ] Social feed: posts, likes, comments, moderation
[ ] Advanced analytics: cohort analysis, predictive forecasting
```

### Phase 8: Compliance, Security & Polish

```
[ ] WCAG 2.1 AA+ audit: automated score >= 95, manual pass
[ ] SOC2: Type II documentation complete, controls implemented
[ ] GDPR: consent management, erasure, portability verified
[ ] Penetration test: no critical or high-severity findings
[ ] Performance: web < 2s LCP, mobile < 2s cold start
[ ] Load test: 10,000 concurrent users, < 200ms API response
[ ] i18n: 100% FR/EN coverage, no hardcoded strings
[ ] Test coverage: > 80% unit, > 60% integration, E2E critical paths
[ ] Documentation: API docs, user guides, admin handbook complete
[ ] Beta testing: 50+ users, < 5% critical issue rate
```

### Phase 9: Deployment & Launch

```
[ ] Production environment live on VPS with SSL
[ ] Database migrated to production with zero data loss
[ ] iOS app submitted to App Store, approved
[ ] Android app submitted to Google Play, approved
[ ] Monitoring and alerting active (99.9% uptime target)
[ ] Backup verified: full restore tested successfully
[ ] Staff training completed at pilot location
[ ] Soft launch: 1 pilot location, 2-week observation
[ ] Full launch: all locations migrated
[ ] Marketing campaign launched
```

---

## File Index

| File | Contents |
|------|----------|
| `00_master_roadmap.md` | This file — executive overview, timelines, dependencies, risks |
| `phase_01_foundation.md` | Monorepo, Docker, CI/CD, dev environments, shared packages |
| `phase_02_design_system.md` | Design tokens, UI library, i18n, a11y, animations, components |
| `phase_03_auth.md` | Supabase Auth, OAuth, RBAC, RLS, session management, audit |
| `phase_04_core_gym.md` | All Resamania features: members, billing, booking, access, POS, CRM, analytics |
| `phase_05_webapp_screens.md` | Per-role web screen development (6 roles + shared) |
| `phase_06_mobile_app.md` | React Native app, navigation, offline, biometrics, camera, GPS |
| `phase_07_advanced.md` | AI features, gamification, wearables, video, community, IoT |
| `phase_08_compliance.md` | WCAG, SOC2, GDPR, pentest, performance, testing, docs |
| `phase_09_deploy.md` | Production deploy, app stores, monitoring, training, launch |
| `99_agent_prompts_library.md` | Reusable LLM agent prompt templates for all work types |

---

## Quick Stats

| Metric | Value |
|--------|-------|
| **Total Phases** | 9 + 1 library |
| **Total Detailed Items** | 105+ |
| **Total Estimated Weeks** | 34-42 |
| **Critical Path Weeks** | ~27 |
| **Max Parallel Workstreams** | 3 |
| **Files to Create** | 11 |
| **Reference Files** | 9 |
| **User Roles Covered** | 6 (Admin, Manager, Employee, Teacher, Client, Visitor) |
| **Platforms** | 2 (Web + Mobile iOS/Android) |
| **Compliance Standards** | 4 (WCAG 2.1 AA+, SOC2, GDPR, NF 525) |

---

*This master roadmap is a living document. Update timelines and dependencies as the project progresses. Tick milestones as they are reached. Append notes for significant decisions or course corrections.*

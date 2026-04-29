# Phase 8: Compliance, Security & Polish

> **Phase ID:** P8
> **Duration:** 3-4 weeks
> **Prerequisites:** Phases 5-6 complete (webapp and mobile app screens implemented)
> **Goal:** Achieve WCAG 2.1 AA+, SOC2, GDPR compliance; optimize performance; achieve comprehensive test coverage

---

## Phase Overview

Phase 8 is the quality gate before launch. Every compliance requirement, performance metric, and test scenario is validated here. This phase transforms OhMyGold from "feature complete" to "launch ready." No shortcuts — compliance failures can result in legal liability, store rejections, and brand damage.

The phase covers four quality pillars: Accessibility (WCAG 2.1 AA+), Security & Compliance (SOC2, GDPR), Performance (web + mobile), and Testing (comprehensive coverage). Each pillar has specific, measurable criteria.

---

## 8.1 WCAG 2.1 AA+ Accessibility Audit and Fixes

### Description and Scope
Conduct a comprehensive accessibility audit of all web and mobile screens. Automated testing via axe-core, Lighthouse, and pa11y. Manual testing with keyboard navigation and screen readers (NVDA, VoiceOver, TalkBack). Fix all violations to achieve WCAG 2.1 AA+ compliance.

### Why This Matters
WCAG 2.1 AA+ is a legal requirement in France (RGAA) and an EU mandate. Accessibility lawsuits are increasing. But beyond legal compliance, accessible design improves usability for everyone — not just users with disabilities. 15% of the population has some form of disability.

### Technical Approach
Automated: axe-core in CI, Lighthouse accessibility audit, pa11y for batch testing. Manual: keyboard-only navigation, screen reader testing (NVDA on Windows, VoiceOver on macOS/iOS, TalkBack on Android). Focus management: correct tab order, visible focus indicators. ARIA: proper roles, states, labels. Color: contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text. Touch targets: >= 44x44px mobile.

### Files/Directories to Create/Modify
```
.github/workflows/
├── accessibility-audit.yml      # CI accessibility check
tests/
├── a11y/
│   ├── axe-tests.ts             # Automated axe tests
│   ├── keyboard-nav.test.ts     # Keyboard navigation tests
│   └── screen-reader.test.ts    # Screen reader simulation
apps/web/src/
└── a11y/                        # Accessibility fixes across all files
apps/mobile/src/
└── a11y/
```

### Dependencies on Other Items
- Phase 5 (all web screens)
- Phase 6 (all mobile screens)
- 2.4 (accessibility primitives)

### Success Criteria
```
[ ] axe-core automated tests: score >= 95 on all pages
[ ] Lighthouse accessibility: score >= 95 on all pages
[ ] Color contrast: all text >= 4.5:1 (normal), >= 3:1 (large)
[ ] Keyboard navigation: all interactive elements reachable via Tab
[ ] Focus indicators: visible 3px gold outline on all focusable elements
[ ] Screen reader: all images have alt text, all buttons have labels
[ ] ARIA: proper roles, states, live regions for dynamic content
[ ] Touch targets: >= 44x44px on all mobile interactive elements
[ ] Skip links: functional on all page types
[ ] Form labels: properly associated with inputs
[ ] Error identification: clear error messages linked to fields
[ ] Reduced motion: all animations respect prefers-reduced-motion
[ ] Manual audit completed by accessibility specialist
```

### Estimated Effort
5-7 days

### LLM Agent Launch Prompt

```
Conduct WCAG 2.1 AA+ accessibility audit and fixes for OhMyGold.

CONTEXT: Full accessibility compliance required. Automated + manual testing on all screens.

TASK:
1. Automated testing setup:
   - axe-core integration in CI pipeline
   - Lighthouse accessibility audit per page
   - pa11y batch testing for all routes
   - CI fails on accessibility score < 95

2. Run automated audits:
   - Test every web page (all 60+ routes)
   - Test every mobile screen
   - Generate violation reports
   - Categorize: critical, serious, moderate, minor

3. Fix violations:
   - Missing alt text on images
   - Insufficient color contrast
   - Missing form labels
   - Missing ARIA roles/states
   - Incorrect heading hierarchy
   - Focus management issues
   - Touch target sizes

4. Manual testing:
   - Keyboard-only navigation (Tab, Enter, Space, Escape)
   - NVDA (Windows) screen reader test
   - VoiceOver (macOS/iOS) screen reader test
   - TalkBack (Android) screen reader test
   - Document findings and fixes

5. Accessibility statement:
   - Create /accessibility page
   - Statement of compliance
   - Known limitations
   - Contact for accessibility issues

REQUIREMENTS:
- WCAG 2.1 AA+ target
- axe-core score >= 95
- All violations fixed or documented with workaround
- Manual test report
- Accessibility statement published

FILES TO CREATE:
- .github/workflows/accessibility-audit.yml
- tests/a11y/axe-tests.ts
- tests/a11y/keyboard-nav.test.ts
- apps/web/src/pages/accessibility.tsx

VERIFICATION STEPS:
1. axe-core passes in CI
2. Lighthouse >= 95 on all pages
3. Keyboard navigation works
4. Screen reader announces correctly
5. Color contrast verified
6. Accessibility statement published

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §7

NOTES AREA (fill on completion):
- Date completed: ___
- axe-core score: ___
- Violations found: ___
- Violations fixed: ___
- Manual tests: NVDA/Yes, VoiceOver/Yes, TalkBack/Yes
- Remaining issues: ___
```

---

## 8.2 SOC2 Compliance Documentation and Implementation

### Description and Scope
Implement SOC2 Type II controls and documentation: security policies, access controls, audit logging, data encryption, incident response procedures, change management, vendor management, and risk assessment. Document all controls for auditor review.

### Why This Matters
SOC2 Type II certification demonstrates that OhMyGold has robust security and privacy controls. It's required by enterprise clients and increasingly by SMBs handling sensitive data. For Gold's Gym France processing member health data and payment information, SOC2 builds trust and reduces liability.

### Technical Approach
SOC2 Trust Services Criteria: Security (CC6.1, CC6.2, CC6.3), Availability (A1.2), Processing Integrity (PI1.3), Confidentiality (C1.1), Privacy (P1.1). Implement: access control matrix, encryption at rest and in transit, audit logging (already in Phase 3.9), incident response plan, backup/disaster recovery, vulnerability management, employee security training. Document: all policies and procedures, control evidence, risk assessment.

### Files/Directories to Create/Modify
```
docs/compliance/
├── soc2/
│   ├── security-policy.md
│   ├── access-control-policy.md
│   ├── incident-response-plan.md
│   ├── data-classification.md
│   ├── encryption-policy.md
│   ├── backup-recovery-policy.md
│   ├── change-management-policy.md
│   ├── vendor-management-policy.md
│   ├── risk-assessment.md
│   ├── employee-training.md
│   └── control-evidence/
│       ├── cc6-1-evidence.md
│       ├── cc6-2-evidence.md
│       └── ...
```

### Dependencies on Other Items
- Phase 3.9 (audit logging)
- Phase 1 (backup/infrastructure)
- Phase 4 (data handling)

### Success Criteria
```
[ ] Security policy documented and approved
[ ] Access control matrix: who can access what
[ ] Encryption: at rest (AES-256), in transit (TLS 1.3)
[ ] Audit logging: all access and changes logged (immutable)
[ ] Incident response plan: documented, tested
[ ] Backup and disaster recovery: tested with restore
[ ] Change management: approval workflow for production changes
[ ] Vendor management: security assessment of third parties
[ ] Risk assessment: identified, rated, mitigated
[ ] Employee security training: completed, documented
[ ] Control evidence: documented per SOC2 criteria
[ ] Penetration test: completed, findings addressed
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Implement SOC2 Type II compliance for OhMyGold.

CONTEXT: SOC2 certification demonstrates security and privacy controls. Required for enterprise trust.

TASK:
1. Security policies:
   - Information Security Policy
   - Access Control Policy (least privilege)
   - Password Policy (complexity, rotation)
   - Encryption Policy (AES-256 at rest, TLS 1.3 in transit)
   - Acceptable Use Policy

2. Access controls:
   - Document: who has access to what systems
   - Role-based access (RBAC already implemented)
   - MFA required for production access
   - Regular access reviews (quarterly)
   - Offboarding procedure

3. Audit and monitoring:
   - All auth events logged (Phase 3.9)
   - All data access logged
   - Log integrity protection (immutable)
   - Log retention: 2 years
   - Alerting on suspicious activity

4. Incident response:
   - Incident classification (P1-P4)
   - Response procedures per classification
   - Communication plan
   - Post-incident review process
   - 24/7 escalation path

5. Backup and DR:
   - Daily automated backups
   - Backup encryption
   - Restore tested monthly
   - RTO: 4 hours, RPO: 1 hour
   - DR site documentation

6. Vendor management:
   - Security assessment of: Stripe, SendGrid, Twilio, Supabase
   - Data processing agreements
   - Annual vendor review

7. Risk assessment:
   - Asset inventory
   - Threat identification
   - Risk rating matrix
   - Mitigation plans
   - Quarterly review

REQUIREMENTS:
- All policies documented in Markdown
- Control evidence per SOC2 TSC
- Penetration test scheduled
- Employee training completed

REFERENCE:
- Research §5.3 (SOC2): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md

FILES TO CREATE:
- docs/compliance/soc2/*.md (all policy documents)
- docs/compliance/soc2/control-evidence/*.md

VERIFICATION STEPS:
1. All policies documented
2. Access control matrix complete
3. Encryption verified (at rest and transit)
4. Audit logs immutable
5. Incident response plan reviewed
6. Backup restore tested
7. Risk assessment completed

NOTES AREA (fill on completion):
- Date completed: ___
- Policies documented: ___
- Controls implemented: ___
- Penetration test: scheduled/completed
- Risk assessment: ___ risks identified
```

---

## 8.3 GDPR Full Compliance Verification

### Description and Scope
Verify and enforce full GDPR compliance: consent management, data subject rights (access, rectification, erasure, portability), data minimization, purpose limitation, retention policies, privacy by design, DPO documentation, and Data Processing Agreements. French-specific requirements (CNIL registration).

### Why This Matters
GDPR compliance is legally mandatory for any platform processing EU citizen data. Fines can reach 4% of global revenue. Gold's Gym France handles sensitive health data (medical questionnaires), biometric data (photos), and financial data — all high-risk categories under GDPR. French CNIL has additional requirements.

### Technical Approach
Consent: granular opt-in for marketing, data sharing, wearable integration. Rights: self-service portal for access, rectification, erasure, portability. Data minimization: only collect necessary data. Retention: automatic data purging after retention period. Privacy by design: pseudonymization, encryption. DPA: documented with all subprocessors. CNIL: register as data controller.

### Files/Directories to Create/Modify
```
docs/compliance/
├── gdpr/
│   ├── privacy-policy.md
│   ├── consent-management.md
│   ├── data-subject-rights.md
│   ├── data-retention-policy.md
│   ├── data-minimization.md
│   ├── dpa-template.md
│   ├── dpo-appointment.md
│   ├── cnil-registration.md
│   ├── privacy-impact-assessment.md
│   └── breach-notification-procedure.md
apps/web/src/pages/
├── privacy-policy.tsx
├── data-request.tsx         # Self-service data rights
└── cookie-policy.tsx
```

### Dependencies on Other Items
- Phase 4 (all data processing)
- 7.5 (wearable data — requires explicit consent)

### Success Criteria
```
[ ] Privacy policy: published, comprehensive, plain language
[ ] Consent: granular opt-in, not pre-checked, withdrawable
[ ] Consent log: timestamp, version, what consented to
[ ] Right to access: member can download all their data (JSON)
[ ] Right to rectification: member can edit profile
[ ] Right to erasure: member can delete account and all data
[ ] Right to portability: member can export data in standard format
[ ] Data minimization: only collect necessary data
[ ] Retention: automatic purging after period (configurable)
[ ] Pseudonymization: identifiers separated from data
[ ] Breach notification: procedure to notify within 72 hours
[ ] DPA: signed with all subprocessors (Stripe, SendGrid, etc.)
[ ] DPO: appointed, contact published
[ ] CNIL: registered as data controller
[ ] Cookie policy: published, consent required for non-essential
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Implement full GDPR compliance for OhMyGold.

CONTEXT: GDPR is legally mandatory. Handle sensitive health and financial data. French CNIL requirements apply.

TASK:
1. Privacy policy:
   - Comprehensive: what data, why, how long, who shared with
   - Plain language (not legal jargon)
   - Published at /privacy-policy
   - Versioned with changelog
   - French and English

2. Consent management:
   - Granular: marketing, data sharing, wearables, analytics
   - Not pre-checked (opt-in, not opt-out)
   - Timestamp and version stored
   - Withdrawable at any time
   - Consent log in database

3. Data subject rights portal:
   - /data-request page
   - Access: download all data (JSON)
   - Rectification: edit profile
   - Erasure: delete account + all data
   - Portability: export in standard format
   - Automated processing (within 30 days)

4. Data retention:
   - Policy: how long each data type kept
   - Automatic purging after retention period
   - Member data: 2 years after account closure
   - Logs: 2 years
   - Backups: encrypted, same retention

5. Breach notification:
   - Detection procedures
   - Assessment: likelihood of harm
   - Notification: CNIL within 72 hours if high risk
   - Notification: affected individuals if high risk
   - Documentation of all breaches

6. CNIL registration:
   - Register as data controller
   - Reference number obtained
   - Publication on website

REQUIREMENTS:
- Granular consent
- Self-service rights portal
- Automatic data purging
- 72-hour breach notification
- CNIL registered

REFERENCE:
- Research §5.3 (GDPR): /mnt/agents/output/ohmygold/team2_resamania_analysis/research/05_technical_best_practices.md

FILES TO CREATE:
- docs/compliance/gdpr/*.md (all GDPR docs)
- apps/web/src/pages/privacy-policy.tsx
- apps/web/src/pages/data-request.tsx
- apps/web/src/pages/cookie-policy.tsx

VERIFICATION STEPS:
1. Privacy policy published
2. Consent flow tested (signup + settings)
3. Data export generates JSON
4. Account deletion removes all data
5. Retention purging works
6. CNIL registration complete

NOTES AREA (fill on completion):
- Date completed: ___
- Consent types: ___
- Data retention periods: ___
- CNIL registered: Yes/No
- DPO appointed: Yes/No
```

---

## 8.4 Security Penetration Testing

#### API-Specific Penetration Testing

Beyond OWASP Top 10 web testing, the pentest must cover Supabase-specific attack vectors:

| Test Category | Attack Vector | Expected Result |
|--------------|---------------|-----------------|
| **Edge Function Auth Bypass** | Call Edge Functions without JWT, with expired JWT, with forged JWT | All requests rejected with 401 |
| **PostgreSQL Injection** | Attempt prepared statement bypass via Supabase client `rpc()` | Parameterized queries prevent injection |
| **RLS Policy Bypass** | Authenticate as low-privilege user, attempt to read/write unauthorized rows | RLS policies block all unauthorized access |
| **JWT Token Manipulation** | Modify JWT payload (role, user_id), re-sign with wrong secret | Signature validation fails, request rejected |
| **WebSocket Message Injection** | Send crafted messages to Realtime channels without proper subscription | Messages ignored, unauthorized subscriptions rejected |
| **File Upload Vulnerabilities** | Upload malicious SVG with embedded JS, polyglot files | File validation blocks non-allowed types, content-type enforced |
| **Supabase Admin Key Exposure** | Search for `service_role` key in client bundles, logs, error messages | Admin key never exposed to client |
| **Realtime Channel Enumeration** | Attempt to subscribe to channels for other users/locations | Channel authorization checks block unauthorized subscriptions |

**Pentest deliverables:** Executive summary with CVSS v3.1 ratings, detailed vulnerability reports with proof-of-concept, remediation guidance with priority rankings, re-test report after fixes applied.


### Description and Scope
Conduct comprehensive security penetration testing: automated vulnerability scanning, manual penetration testing of critical paths (auth, payment, admin), API security testing, mobile app security, and infrastructure security. Fix all critical and high-severity findings.

### Why This Matters
Security breaches destroy trust and can result in legal liability. Payment data, health data, and personal information are high-value targets. Penetration testing identifies vulnerabilities before attackers do. This is required for SOC2 and strongly recommended for any payment-processing application.

### Technical Approach
Automated: OWASP ZAP, Burp Suite for web scanning, MobSF for mobile. Manual: OWASP Top 10 testing (injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, known vulnerabilities, insufficient logging). API: test all endpoints for auth bypass, injection, rate limiting. Mobile: certificate pinning, insecure storage, reverse engineering resistance. Infrastructure: SSH hardening, firewall rules, Docker security.

### Files/Directories to Create/Modify
```
docs/security/
├── pentest-report.md
├── vulnerability-remediation.md
├── security-hardening.md
└── ongoing-security.md
docker/
└── security-hardening/
    ├── sshd_config
    └── fail2ban.conf
```

### Dependencies on Other Items
- All phases (complete application)

### Success Criteria
```
[ ] Automated scan: OWASP ZAP — no critical/high findings
[ ] Manual pentest: OWASP Top 10 — all tested
[ ] Auth testing: no bypass, proper session management
[ ] Payment testing: no injection, secure token handling
[ ] API testing: rate limiting, input validation, auth required
[ ] Mobile testing: certificate pinning, secure storage
[ ] Infrastructure: SSH hardened, firewall configured, Docker secured
[ ] All critical findings: fixed and retested
[ ] All high findings: fixed and retested
[ ] Medium findings: documented with mitigation timeline
[ ] Pentest report: completed by certified tester
[ ] Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
[ ] Rate limiting: active on all public APIs
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Conduct security penetration testing for OhMyGold.

CONTEXT: Comprehensive security testing of web app, mobile app, APIs, and infrastructure. Fix all critical/high findings.

TASK:
1. Automated scanning:
   - OWASP ZAP: web application scan
   - Burp Suite: advanced scanning
   - MobSF: mobile security framework
   - Generate initial vulnerability reports

2. OWASP Top 10 testing:
   - A01: Broken Access Control (test RBAC, RLS)
   - A02: Cryptographic Failures (check TLS, encryption)
   - A03: Injection (SQL injection on all inputs)
   - A04: Insecure Design (business logic flaws)
   - A05: Security Misconfiguration (headers, defaults)
   - A06: Vulnerable Components (dependency scan)
   - A07: Auth Failures (brute force, session management)
   - A08: Data Integrity Failures (CSRF, SSRF)
   - A09: Logging Failures (insufficient audit logging)
   - A10: Server-Side Request Forgery

3. API security:
   - Auth bypass on all endpoints
   - Input validation on all parameters
   - Rate limiting effectiveness
   - CORS configuration
   - Error handling (no info leakage)

4. Mobile security:
   - Certificate pinning
   - Secure storage (Keychain/Keystore)
   - Code obfuscation
   - Root/jailbreak detection
   - Deep link validation

5. Infrastructure:
   - SSH: key-only auth, no root login
   - Firewall: only necessary ports open
   - Docker: non-root containers, read-only FS
   - Caddy: TLS 1.3, security headers

6. Remediation:
   - Fix all critical findings (P0)
   - Fix all high findings (P1)
   - Document medium findings with timeline
   - Retest after fixes

REQUIREMENTS:
- Pentest by certified security professional
- All critical/high findings fixed
- Security headers configured
- Rate limiting active
- Dependency vulnerabilities resolved

FILES TO CREATE:
- docs/security/pentest-report.md
- docs/security/vulnerability-remediation.md
- docs/security/security-hardening.md

VERIFICATION STEPS:
1. ZAP scan: no critical/high
2. Auth bypass tests: all blocked
3. Payment security: secure
4. Mobile security: certificate pinning
5. Infrastructure hardened
6. Security headers present
7. Rate limiting effective

NOTES AREA (fill on completion):
- Date completed: ___
- Critical findings: ___ (fixed: ___)
- High findings: ___ (fixed: ___)
- Medium findings: ___ (documented: ___)
- Pentest firm: ___
- Security headers: ___
```

---

## 8.5 Performance Optimization (Web + Mobile)

### Description and Scope
Optimize performance for both web and mobile platforms: web LCP < 2s, FID < 100ms, CLS < 0.1; mobile app cold start < 2s, smooth 60fps animations, bundle size optimization, image optimization, code splitting, and lazy loading.

### Why This Matters
Performance directly impacts user satisfaction and conversion. 53% of mobile users abandon sites that take > 3 seconds to load. Google uses Core Web Vitals as a ranking factor. For OhMyGold, a slow check-in or booking flow frustrates users and loses revenue.

### Technical Approach
Web: code splitting by route, lazy load heavy components, image optimization (WebP, responsive sizes), font optimization (subsetting), caching headers, service worker for offline. Mobile: reduce bundle size, native driver for animations, image caching, SQLite for local data, reduce re-renders with React.memo and useMemo. Both: measure with Lighthouse, Flipper, React DevTools Profiler.

### Files/Directories to Create/Modify
```
apps/web/
├── vite.config.ts           # Code splitting config
├── public/sw.js             # Service worker
└── src/
    ├── lib/
    │   └── lazyLoad.ts      # Lazy loading utilities
    └── components/
        └── OptimizedImage.tsx
apps/mobile/
├── metro.config.js          # Bundle optimization
└── src/
    └── lib/
        └── performance.ts   # Performance utilities
```

### Dependencies on Other Items
- Phase 5 (web screens to optimize)
- Phase 6 (mobile screens to optimize)

### Success Criteria
```
[ ] Web LCP: < 2 seconds
[ ] Web FID: < 100 milliseconds
[ ] Web CLS: < 0.1
[ ] Web TTFB: < 600 milliseconds
[ ] Mobile cold start: < 2 seconds
[ ] Mobile warm start: < 1 second
[ ] Mobile animations: 60fps (no dropped frames)
[ ] Web bundle: initial < 200KB gzipped
[ ] Mobile bundle: < 15MB
[ ] Images: WebP format, responsive sizes, lazy loaded
[ ] Fonts: subsetted, preload critical
[ ] Code splitting: per route
[ ] Lighthouse Performance score: > 90
[ ] No memory leaks in long-running sessions
```

### Estimated Effort
4-5 days

### LLM Agent Launch Prompt

```
Optimize performance for OhMyGold web and mobile.

CONTEXT: Performance is critical for user satisfaction and conversion. Target: web LCP < 2s, mobile cold start < 2s.

TASK:
1. Web optimization:
   - Code splitting: React.lazy() per route
   - Vite: dynamic imports, manual chunks
   - Images: WebP, srcset for responsive, lazy loading
   - Fonts: Inter subset (Latin + French), preload critical
   - Caching: service worker for static assets
   - Caddy: gzip/brotli, cache headers, HTTP/2 push
   - Bundle analysis: identify and split large dependencies

2. Mobile optimization:
   - Bundle: metro bundle analysis, remove unused code
   - Images: react-native-fast-image for caching
   - Animations: useNativeDriver for all animations
   - Re-renders: React.memo, useMemo, useCallback
   - SQLite: cache frequently accessed data
   - App size: < 15MB download
   - Startup: minimize initial bundle, lazy load screens

3. API optimization:
   - Response compression: gzip/brotli
   - Pagination: all list endpoints paginated
   - Caching: Redis for frequently accessed data
   - CDN: Cloudflare for static assets
   - Database: query optimization, proper indexes

4. Measurement:
   - Lighthouse: audit all pages
   - React DevTools Profiler: component render times
   - Flipper: mobile performance
   - Web Vitals: monitor LCP, FID, CLS
   - Set up continuous performance monitoring

REQUIREMENTS:
- LCP < 2s
- FID < 100ms
- CLS < 0.1
- Cold start < 2s
- 60fps animations
- Lighthouse > 90

FILES TO CREATE/MODIFY:
- apps/web/vite.config.ts (splitting config)
- apps/web/public/sw.js
- apps/mobile/metro.config.js
- apps/mobile/src/lib/performance.ts

VERIFICATION STEPS:
1. Lighthouse: all pages > 90 Performance
2. Web Vitals: LCP < 2s, FID < 100ms, CLS < 0.1
3. Mobile cold start < 2s
4. Animations at 60fps
5. Bundle sizes within targets

NOTES AREA (fill on completion):
- Date completed: ___
- Lighthouse scores: ___
- Web Vitals: LCP/___ FID/___ CLS/___
- Mobile cold start: ___ seconds
- Bundle sizes: web/___ mobile/___
```

---

## 8.6 Load Testing and Capacity Planning

### Description and Scope
Conduct load testing to verify the platform can handle expected traffic: 10,000 concurrent users, peak booking windows, payment processing under load, and real-time features (check-in, occupancy). Document capacity limits and scaling procedures.

### Why This Matters
Launch day will see the highest traffic. If the platform crashes under load, it damages Gold's Gym's reputation and loses revenue. Load testing identifies bottlenecks before they impact users. Capacity planning ensures we know when and how to scale.

### Technical Approach
Load testing: k6 or Artillery for API load testing, Locust for realistic user simulation. Scenarios: login, booking, check-in, payment, browsing. Gradual ramp: 100 → 1,000 → 5,000 → 10,000 concurrent users. Monitor: response times, error rates, resource usage (CPU, memory, DB connections). Stress test: push beyond expected load to find breaking point. Document: capacity limits, scaling triggers, auto-scaling configuration.

### Files/Directories to Create/Modify
```
tests/load/
├── k6/
│   ├── login-test.js
│   ├── booking-test.js
│   ├── checkin-test.js
│   └── payment-test.js
├── scenarios/
│   ├── normal-day.js
│   ├── peak-hour.js
│   └── launch-day.js
└── reports/
    └── capacity-plan.md
```

### Dependencies on Other Items
- All phases (complete application)
- 9.1 (production environment for realistic testing)

### Success Criteria
```
[ ] Normal load (1,000 concurrent): < 200ms API response, 0% errors
[ ] Peak load (5,000 concurrent): < 500ms API response, < 0.1% errors
[ ] Stress load (10,000 concurrent): < 1s response, < 1% errors
[ ] Booking peak: handle 100 concurrent bookings without overbooking
[ ] Check-in: handle 50 concurrent check-ins per location
[ ] Payment: Stripe rate limits respected, queue if needed
[ ] Database: connection pool sufficient, no deadlocks
[ ] Memory: no leaks over 24-hour test
[ ] Auto-scaling: triggers documented
[ ] Capacity report: limits, scaling procedures, cost estimates
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Conduct load testing and capacity planning for OhMyGold.

CONTEXT: Verify platform handles 10,000 concurrent users. Identify bottlenecks and document scaling procedures.

TASK:
1. Load testing setup:
   - k6 or Artillery for API testing
   - Scenarios: login, browse, book class, check-in, payment
   - Gradual ramp: 100 → 1,000 → 5,000 → 10,000 users
   - Test duration: 30 minutes per level

2. Test scenarios:
   - Normal day: steady load, mixed actions
   - Peak hour: high booking + check-in load
   - Launch day: registration spike + browsing
   - Black Friday: payment processing under load

3. Monitoring during tests:
   - API response times (p50, p95, p99)
   - Error rates
   - CPU and memory usage
   - Database connections and query times
   - Supabase Realtime message throughput
   - Network bandwidth

4. Stress testing:
   - Push beyond 10,000 to find breaking point
   - Document failure modes
   - Recovery time after overload

5. Capacity planning:
   - Current capacity limits
   - Scaling triggers (response time > X, CPU > Y%)
   - Scaling procedures (vertical, horizontal)
   - Cost estimates for scaling
   - Auto-scaling configuration

REQUIREMENTS:
- 10,000 concurrent users supported
- < 200ms normal load
- < 1% error rate at peak
- Capacity report documented

FILES TO CREATE:
- tests/load/k6/*.js
- tests/load/scenarios/*.js
- tests/load/reports/capacity-plan.md

VERIFICATION STEPS:
1. Normal load test passes
2. Peak load test passes
3. Stress test documented
4. Booking concurrency verified (no overbooking)
5. Capacity report complete

NOTES AREA (fill on completion):
- Date completed: ___
- Max load tested: ___ concurrent users
- Response times: normal/___ms peak/___ms
- Error rates: normal/___% peak/___%
- Bottlenecks identified: ___
- Scaling procedures: ___
```

---

## 8.7 i18n Complete Verification

### Description and Scope
Verify complete internationalization coverage: every user-facing string uses t() function, both French and English translations exist, French text expansion (30% longer) doesn't break layouts, date/number/currency formatting is correct, and no hardcoded strings remain.

### Why This Matters
Incomplete i18n means some users see English text in a French interface — a poor experience. French text is 30% longer than English on average, which breaks layouts designed for English. Date and currency formats differ between locales. A single hardcoded string undermines the entire localization effort.

### Technical Approach
Automated: i18n-extract to find all translation keys, compare with translation files, report missing. Visual: compare all screens side-by-side in French and English. Layout: verify no truncation or overflow with French text. Format: verify dates (DD/MM/YYYY), currency (1 234,56 €), numbers. RTL check: verify logical properties (start/end) work correctly.

### Files/Directories to Create/Modify
```
tests/i18n/
├── coverage.test.ts         # Translation key coverage
├── visual-regression.test.ts # FR vs EN layout comparison
└── format-validation.test.ts # Date, currency, number formats
packages/ui/src/i18n/
└── locales/                  # Complete FR and EN translations
```

### Dependencies on Other Items
- Phase 5 (all web screens)
- Phase 6 (all mobile screens)
- 2.3 (i18n framework)

### Success Criteria
```
[ ] 100% of user-facing strings use t() — zero hardcoded
[ ] All translation keys have French and English values
[ ] French text: no truncation, no overflow, no clipping
[ ] Date format: FR = DD/MM/YYYY, EN = MM/DD/YYYY
[ ] Currency: FR = "1 234,56 €", EN = "€1,234.56"
[ ] Number format: FR = "1 234,56", EN = "1,234.56"
[ ] Time format: 24h for FR, 12h optional for EN
[ ] Labels: top-aligned (for French text expansion)
[ ] Buttons: flexible width (wrap text if needed)
[ ] No layout breaks with longest French translations
[ ] i18n key extraction passes in CI
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Verify complete i18n coverage for OhMyGold.

CONTEXT: Full FR/EN localization. No hardcoded strings. French text expansion handled.

TASK:
1. String extraction:
   - Run i18n extraction tool to find all t() keys
   - Compare keys in FR and EN files
   - Identify missing translations
   - Identify unused keys

2. Hardcoded string scan:
   - Regex search for hardcoded French/English text in JSX
   - Check all components, hooks, and utilities
   - Verify zero hardcoded user-facing strings
   - Exception: technical terms (email, API names)

3. Layout verification:
   - Screenshot every screen in French
   - Screenshot every screen in English
   - Compare: no truncation, no overflow
   - Check: buttons wrap, labels fit, cards expand
   - Focus: longest French translations

4. Format validation:
   - Dates: DD/MM/YYYY (FR), MM/DD/YYYY (EN)
   - Currency: "1 234,56 €" (FR), "€1,234.56" (EN)
   - Numbers: "1 234,56" (FR), "1,234.56" (EN)
   - Time: 24h (FR), 12h (EN)

5. CI integration:
   - i18n extraction as CI step
   - Fail build if missing translations
   - Translation coverage report

REQUIREMENTS:
- Zero hardcoded strings
- 100% translation coverage
- No layout breaks with French
- Correct locale formatting

FILES TO CREATE:
- tests/i18n/coverage.test.ts
- tests/i18n/format-validation.test.ts

VERIFICATION STEPS:
1. Extraction: all keys found
2. No hardcoded strings
3. FR screenshots: no layout issues
4. Format tests pass
5. CI integration working

NOTES AREA (fill on completion):
- Date completed: ___
- Total keys: ___
- Coverage: FR/___% EN/___%
- Hardcoded strings found: ___
- Layout issues fixed: ___
```

---

## 8.8 Comprehensive Test Coverage

### Description and Scope
Achieve comprehensive test coverage: > 80% unit test coverage, > 60% integration test coverage, E2E tests for critical user journeys, visual regression testing, and mobile-specific testing. All tests run in CI on every push.

### Why This Matters
Tests are the safety net that prevents regressions. A platform with 100+ features across 6 roles is too complex to test manually. Automated tests catch bugs before they reach users. Coverage metrics ensure we're testing what matters — not just ticking boxes.

### Technical Approach
Unit: Vitest for web, Jest for mobile. React Testing Library for component tests. Integration: MSW (Mock Service Worker) for API mocking. E2E: Playwright for web, Detox for mobile. Visual regression: Chromatic for Storybook, Percy for E2E. CI: all tests run on every PR. Coverage: Istanbul for reporting.

### Files/Directories to Create/Modify
```
tests/
├── unit/                    # Unit tests (components, hooks, utils)
├── integration/             # Integration tests (API, flows)
├── e2e/
│   ├── web/                 # Playwright tests
│   └── mobile/              # Detox tests
└── visual/                  # Visual regression tests
.github/workflows/
└── test.yml                 # CI test pipeline
```

### Dependencies on Other Items
- All phases (everything to test)

### Success Criteria
```
[ ] Unit test coverage: > 80%
[ ] Integration test coverage: > 60%
[ ] E2E critical journeys: login, booking, check-in, payment
[ ] Component tests: all shared UI components
[ ] API tests: all Edge Functions
[ ] RLS tests: all role+table combinations
[ ] Auth flow tests: all auth scenarios
[ ] Mobile E2E: login, booking, check-in on iOS and Android
[ ] Visual regression: Storybook + E2E screenshots
[ ] All tests pass in CI on every push
[ ] Coverage report published
[ ] No flaky tests (reliability > 99%)
```

### Estimated Effort
5-7 days

### LLM Agent Launch Prompt

```
Implement comprehensive test coverage for OhMyGold.

CONTEXT: Full test suite: unit, integration, E2E, visual regression. All in CI.

TASK:
1. Unit tests (Vitest + React Testing Library):
   - All shared UI components (render, interact, assert)
   - All hooks (useAuth, useBooking, useCheckIn)
   - All utility functions (dates, validation, formatting)
   - All Zod schemas (valid/invalid data)
   - Target: > 80% coverage

2. Integration tests:
   - API endpoints: all Edge Functions
   - RLS policies: every role+table combination
   - Auth flows: login, register, OAuth, password reset
   - Booking flow: book → confirm → cancel
   - Payment flow: create payment → webhook → confirm
   - MSW for API mocking

3. E2E tests (Playwright for web):
   - Critical journeys:
     * Member: login → book class → check-in → view progress
     * Manager: login → view dashboard → enroll member → view reports
     * Employee: login → check-in member → process sale
     * Admin: login → create location → manage users
   - Cross-browser: Chrome, Firefox, Safari
   - Mobile viewport: test responsive layouts

4. Mobile E2E (Detox):
   - Login flow on iOS and Android
   - Booking flow
   - Check-in with QR scan
   - Offline mode
   - Push notifications

5. Visual regression:
   - Chromatic for Storybook components
   - Percy for E2E screenshots
   - Baseline established, compare on PR

6. CI integration:
   - All tests run on every push
   - Coverage report as PR comment
   - Fail on coverage < 80%
   - Parallel test execution

REQUIREMENTS:
- Unit coverage > 80%
- Integration coverage > 60%
- E2E: 10+ critical journeys
- No flaky tests
- CI integration

FILES TO CREATE:
- tests/unit/**/*.test.ts(x)
- tests/integration/**/*.test.ts
- tests/e2e/web/*.spec.ts
- tests/e2e/mobile/*.spec.js

VERIFICATION STEPS:
1. Unit tests: coverage > 80%
2. Integration tests: all API endpoints
3. E2E web: all critical journeys pass
4. E2E mobile: iOS + Android
5. Visual regression: baselines set
6. CI: all green

NOTES AREA (fill on completion):
- Date completed: ___
- Unit coverage: ___%
- Integration coverage: ___%
- E2E journeys: ___
- Flaky tests: ___
- CI pass rate: ___%
```

---

## 8.9 Documentation Completion

### Description and Scope
Complete all project documentation: API documentation (OpenAPI/Swagger), user guides per role, admin handbook, deployment guide, troubleshooting guide, architecture decision records, and inline code documentation (JSDoc/TypeDoc).

### Why This Matters
Documentation is the bridge between development and operations. API docs enable integrations. User guides reduce support tickets. Deployment docs ensure smooth releases. ADRs capture decision rationale for future maintainers. Without documentation, knowledge walks out the door when developers leave.

### Technical Approach
API docs: OpenAPI spec auto-generated from Supabase, published via Swagger UI or ReDoc. User guides: Markdown docs per role with screenshots. Admin handbook: comprehensive guide for system administration. Deployment: step-by-step procedures for staging and production. TypeDoc: generate from JSDoc comments in code. All docs in /docs directory, linked from README.

### Files/Directories to Create/Modify
```
docs/
├── api/
│   ├── openapi.yaml         # OpenAPI specification
│   └── README.md
├── user-guides/
│   ├── admin-guide.md
│   ├── manager-guide.md
│   ├── employee-guide.md
│   ├── teacher-guide.md
│   ├── client-guide.md
│   └── visitor-guide.md
├── deployment/
│   ├── staging-deployment.md
│   ├── production-deployment.md
│   └── rollback-procedures.md
├── development/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── api-design.md
│   └── testing-guide.md
└── adr/
    ├── ADR-TEMPLATE.md
    └── (all decision records)
```

### Dependencies on Other Items
- All phases (document everything built)

### Success Criteria
```
[ ] API documentation: OpenAPI spec, all endpoints documented
[ ] User guides: per role with screenshots and step-by-step
[ ] Admin handbook: complete system administration guide
[ ] Deployment guide: staging and production procedures
[ ] Troubleshooting: common issues and solutions
[ ] Architecture docs: system design, data flow
[ ] Database schema: entity diagram, table descriptions
[ ] ADRs: all major architectural decisions documented
[ ] Inline documentation: JSDoc on all public functions
[ ] TypeDoc generated and published
[ ] README: comprehensive with badges and quick start
[ ] All docs: up-to-date and accurate
```

### Estimated Effort
3-4 days

### LLM Agent Launch Prompt

```
Complete all documentation for OhMyGold.

CONTEXT: Comprehensive documentation: API docs, user guides, deployment, architecture.

TASK:
1. API documentation:
   - OpenAPI 3.0 spec: all endpoints, parameters, responses
   - Authentication: how to authenticate
   - Error codes: all possible error responses
   - Rate limits: documented
   - Webhooks: event types and payloads
   - Publish via Swagger UI or ReDoc

2. User guides:
   - Admin: system setup, user management, configuration
   - Manager: daily operations, reports, settings
   - Employee: check-in, POS, attendance, issues
   - Teacher: schedule, attendance, substitutions
   - Client: booking, membership, progress, settings
   - Visitor: trial signup, class browsing
   - Include screenshots for each guide

3. Deployment guide:
   - Prerequisites
   - Staging deployment: step-by-step
   - Production deployment: step-by-step
   - Environment variables: complete list
   - Rollback procedures
   - Health checks

4. Development docs:
   - Architecture overview
   - Database schema with diagram
   - API design patterns
   - Testing guide
   - Contributing guidelines

5. ADRs:
   - All major decisions from project
   - Template-based format
   - Indexed and cross-referenced

6. TypeDoc:
   - JSDoc comments on all exported functions
   - Generate TypeDoc site
   - Publish (optional: GitHub Pages)

REQUIREMENTS:
- All docs in Markdown
- Screenshots where helpful
- Up-to-date with current implementation
- French and English where user-facing

FILES TO CREATE:
- docs/api/openapi.yaml
- docs/user-guides/*.md
- docs/deployment/*.md
- docs/development/*.md

VERIFICATION STEPS:
1. OpenAPI spec validates
2. All user guides complete
3. Deployment guide tested
4. TypeDoc generates successfully
5. README links all docs

NOTES AREA (fill on completion):
- Date completed: ___
- API endpoints documented: ___
- User guides: ___ roles
- ADRs: ___
- TypeDoc: published/Yes/No
```

---

## 8.10 Beta Testing Program

### Description and Scope
Run a structured beta testing program: recruit 50+ beta testers across all user roles, distribute test builds (TestFlight + internal testing), collect feedback via structured surveys and bug reports, triage and fix issues, and iterate based on feedback.

### Why This Matters
Beta testing catches issues that automated tests miss: usability problems, edge cases, real-world performance, and user experience gaps. 50 real users testing for 2 weeks will find issues that months of development didn't. The feedback shapes the final polish before launch.

### Technical Approach
TestFlight for iOS beta distribution (up to 10,000 testers). Google Play Internal Testing for Android beta. Feedback channels: in-app feedback form, email, dedicated Slack/Discord channel. Surveys: structured questions per role (NPS, usability, feature completeness). Bug triage: P0 (launch blocker), P1 (fix before launch), P2 (post-launch). Analytics: track crashes, ANRs, session duration. Exit criteria: < 5% crash-free rate, NPS > 40, all P0/P1 issues resolved.

### Files/Directories to Create/Modify
```
docs/beta/
├── beta-plan.md
├── tester-recruitment.md
├── feedback-survey.md
├── bug-triage-process.md
└── exit-criteria.md
apps/mobile/
├── eas.json                 # Beta build profiles
└── (feedback components)
```

### Dependencies on Other Items
- All phases (complete app for beta)
- 9.4 (app store accounts needed for TestFlight)

### Success Criteria
```
[ ] 50+ beta testers recruited across all roles
[ ] TestFlight: iOS beta distributed
[ ] Google Play Internal Testing: Android beta distributed
[ ] Feedback survey: NPS, usability, feature completeness
[ ] Bug reports: structured with reproduction steps
[ ] Crash tracking: Sentry or Firebase Crashlytics
[ ] Bug triage: P0/P1/P2 classification
[ ] All P0 issues: resolved
[ ] All P1 issues: resolved or documented with workaround
[ ] Crash-free rate: > 95%
[ ] NPS score: > 40
[ ] Beta test report: summary, issues, resolutions
```

### Estimated Effort
2-3 weeks (overlaps with other Phase 8 items)

### LLM Agent Launch Prompt

```
Run the beta testing program for OhMyGold.

CONTEXT: Structured beta with 50+ testers. TestFlight + Google Play. Feedback collection and iteration.

TASK:
1. Beta planning:
   - Define beta objectives
   - Identify test scenarios per role
   - Create feedback survey (NPS + usability)
   - Set up crash tracking (Sentry)
   - Define exit criteria

2. Tester recruitment:
   - Target: 50+ testers
   - Mix: 20 clients, 10 staff, 5 managers, 5 teachers, 10 visitors
   - Recruitment: email, social media, gym promotion
   - Onboarding: instructions, known issues list

3. Distribution:
   - iOS: TestFlight (up to 10,000 testers)
   - Android: Google Play Internal Testing
   - Build: beta channel with analytics enabled
   - Updates: over-the-air for minor fixes

4. Feedback collection:
   - In-app feedback form
   - Weekly survey
   - Bug report template
   - Slack/Discord channel
   - Crash reports automatic

5. Bug triage:
   - P0: crash, data loss, security → fix immediately
   - P1: major functionality broken → fix before launch
   - P2: minor issue, workaround exists → post-launch
   - Daily triage meeting

6. Exit criteria:
   - Crash-free rate > 95%
   - NPS > 40
   - All P0 resolved
   - All P1 resolved or documented
   - Beta test report published

REQUIREMENTS:
- 50+ testers
- Both platforms
- Structured feedback
- Crash tracking
- Exit criteria met before launch

FILES TO CREATE:
- docs/beta/beta-plan.md
- docs/beta/feedback-survey.md
- docs/beta/bug-triage-process.md
- docs/beta/exit-criteria.md

VERIFICATION STEPS:
1. 50+ testers enrolled
2. Beta builds distributed
3. Feedback collected
4. Bugs triaged and fixed
5. Exit criteria met
6. Beta report published

NOTES AREA (fill on completion):
- Date completed: ___
- Testers: ___ total
- Platform split: iOS/___ Android/___
- NPS score: ___
- Crash-free rate: ___%
- P0 fixed: ___
- P1 fixed: ___
- P2 deferred: ___
```

---

## Phase 8 Completion Checklist

```
[ ] 8.1 WCAG 2.1 AA+: audit passed, all violations fixed
[ ] 8.2 SOC2: all controls implemented, evidence documented
[ ] 8.3 GDPR: consent management, data rights, CNIL registered
[ ] 8.4 Pentest: completed, critical/high findings fixed
[ ] 8.5 Performance: LCP < 2s, cold start < 2s, 60fps
[ ] 8.6 Load testing: 10,000 concurrent users supported
[ ] 8.7 i18n: 100% coverage, no layout breaks
[ ] 8.8 Test coverage: > 80% unit, > 60% integration, E2E critical paths
[ ] 8.9 Documentation: API, user guides, deployment, architecture
[ ] 8.10 Beta testing: 50+ testers, exit criteria met
[ ] Accessibility statement published
[ ] Privacy policy published
[ ] Security headers configured
[ ] Performance monitoring active
[ ] All P0/P1 issues resolved
[ ] Beta exit criteria met (NPS > 40, crash-free > 95%)
```

---

*Phase 8 notes: Quality is not an act, it is a habit. This phase transforms OhMyGold from "feature complete" to "launch ready." Do not rush. Every compliance gap is a legal liability. Every performance issue is a user lost. Every untested path is a bug waiting to happen. The beta test program is your last chance to catch real-world issues before your users do.*

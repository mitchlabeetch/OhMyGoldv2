# Phase 9: Deployment & Launch

> **Phase ID:** P9
> **Duration:** 2-3 weeks
> **Prerequisites:** Phase 8 complete (all compliance passed, beta testing exited, performance verified)
> **Goal:** Deploy OhMyGold to production, submit to app stores, train staff, and execute launch

---

## Phase Overview

Phase 9 is the finish line. Every decision, every line of code, every test from Phases 1-8 culminates in this phase. The goal: a smooth, zero-downtime deployment to production, successful app store submissions, trained staff, and a successful launch at Gold's Gym France locations.

This phase follows the "crawl, walk, run" principle: soft launch at one pilot location, observe and adjust, then full launch across all locations. This minimizes risk and gives the team time to address any production issues before they affect all users.

---

## 9.1 Production Environment Setup on VPS

### Description and Scope
Set up the production environment on the Ubuntu VPS: Docker Compose with Supabase stack, Caddy reverse proxy, monitoring (Grafana, Prometheus), SSL certificates, firewall (UFW), fail2ban for intrusion protection, and log rotation. All services hardened for production.

### Why This Matters
The production environment is where OhMyGold lives. A misconfigured server, an exposed port, or an unpatched vulnerability can take down the entire platform. Production must be secure, monitored, and resilient from day one.

### Technical Approach
VPS: Ubuntu 24.04 LTS with automatic security updates. Docker Compose: Supabase (PostgreSQL, Auth, Realtime, Storage), Redis for caching, OhMyGold webapp. Caddy: reverse proxy with automatic HTTPS, HTTP/2, rate limiting. Monitoring: Grafana dashboards, Prometheus metrics, Loki logs, Alertmanager. Security: UFW firewall (ports 22, 80, 443 only), fail2ban for brute force protection, Docker security (non-root containers, read-only filesystems). Backup: automated daily backups to S3-compatible storage.

### Files/Directories to Create/Modify
```
docker/
├── docker-compose.prod.yml      # Production Docker Compose
docker/caddy/
├── Caddyfile.prod               # Production Caddy config
docs/deployment/
├── production-setup.md          # Step-by-step setup guide
└── server-hardening.md          # Security hardening checklist
scripts/
├── setup-production.sh          # Automated setup script
├── backup.sh                    # Daily backup script
└── health-check.sh              # Health check script
```

### Dependencies on Other Items
- Phase 1 (Docker Compose base)
- 1.8 (Caddy configuration)
- 1.9 (monitoring setup)
- 8.2 (SOC2 security requirements)
- 8.4 (pentest hardening)

### Success Criteria
```
[ ] Ubuntu 24.04 LTS installed with security updates
[ ] Docker and Docker Compose installed
[ ] Supabase stack running: PostgreSQL, Auth, Realtime, Storage, Edge Functions
[ ] Redis running for caching
[ ] Caddy reverse proxy with automatic HTTPS
[ ] SSL: A+ rating on SSL Labs
[ ] HTTP/2 enabled
[ ] UFW firewall: only ports 22, 80, 443 open
[ ] fail2ban: SSH brute force protection
[ ] Docker: non-root containers, read-only filesystems
[ ] Monitoring: Grafana, Prometheus, Loki, Alertmanager
[ ] Log rotation: configured, tested
[ ] Daily automated backups to S3
[ ] Health check endpoint: /health returns 200
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Set up the OhMyGold production environment on VPS.

CONTEXT: Production deployment on Ubuntu VPS. Must be secure, monitored, and resilient.

TASK:
1. Server setup:
   - Ubuntu 24.04 LTS
   - Automatic security updates (unattended-upgrades)
   - Docker and Docker Compose installed
   - Non-root user for deployment
   - SSH: key-only auth, port 22, no root login

2. Production Docker Compose:
   - Supabase stack: postgres, auth, realtime, storage, edge functions, kong
   - Redis for caching
   - Caddy reverse proxy
   - Monitoring: grafana, prometheus, loki, alertmanager
   - All production environment variables set
   - Resource limits on all containers

3. Caddy configuration:
   - Reverse proxy to all services
   - Automatic HTTPS (Let's Encrypt)
   - HTTP/2
   - Rate limiting
   - Security headers (CSP, HSTS, X-Frame-Options)
   - Compression (gzip/brotli)

4. Security hardening:
   - UFW: allow 22, 80, 443 only
   - fail2ban: SSH protection
   - Docker: non-root containers, read-only FS where possible
   - No exposed ports except through Caddy
   - Regular security scans

5. Monitoring:
   - Grafana dashboards
   - Prometheus metrics collection
   - Loki log aggregation
   - Alertmanager with Slack alerts
   - Uptime monitoring

6. Backup:
   - Daily PostgreSQL backup to S3
   - Supabase Storage backup
   - 30-day retention
   - Monthly restore test

7. Health checks:
   - /health endpoint on webapp
   - /health on API
   - Docker health checks on all containers
   - Automated restart on failure

REQUIREMENTS:
- SSL A+ rating
- All ports except 22/80/443 closed
- Automatic backups
- Health checks on all services
- Non-root Docker containers

FILES TO CREATE:
- docker/docker-compose.prod.yml
- docker/caddy/Caddyfile.prod
- scripts/setup-production.sh
- scripts/backup.sh
- scripts/health-check.sh

VERIFICATION STEPS:
1. All services running: docker compose ps
2. SSL Labs: A+ rating
3. Security scan: no open ports
4. Monitoring dashboards accessible
5. Backup completes successfully
6. Health check returns 200

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- VPS specs: ___
- SSL rating: ___
- Services running: ___
- Backup: scheduled/Yes
- Monitoring: Yes/No
```

---

## 9.2 SSL and Domain Configuration

### Description and Scope
Configure SSL certificates (via Let's Encrypt/Caddy), set up domain names for production (app.ohmygold.fr, api.ohmygold.fr, admin.ohmygold.fr), configure DNS records, and verify HTTPS on all subdomains. HSTS enabled.

### Why This Matters
SSL is mandatory for any modern web application — browsers mark HTTP sites as "Not Secure." For a platform handling payment data and health information, SSL is non-negotiable. HSTS ensures browsers always use HTTPS. Proper domain configuration ensures users reach the correct services.

### Technical Approach
Caddy handles SSL automatically via Let's Encrypt ACME protocol. DNS: A records pointing to VPS IP. Subdomains: app.ohmygold.fr (webapp), api.ohmygold.fr (Supabase API), studio.ohmygold.fr (admin), cdn.ohmygold.fr (static assets). HSTS: max-age=31536000, includeSubDomains, preload. SSL Labs: A+ rating. Certificate monitoring: alert before expiry.

### Files/Directories to Create/Modify
```
docker/caddy/
├── Caddyfile.prod           # SSL and domain config
docs/deployment/
└── domain-setup.md          # DNS configuration guide
```

### Dependencies on Other Items
- 9.1 (production environment)

### Success Criteria
```
[ ] Primary domain: ohmygold.fr redirects to app.ohmygold.fr
[ ] App domain: app.ohmygold.fr serves webapp
[ ] API domain: api.ohmygold.fr serves Supabase API
[ ] Studio domain: studio.ohmygold.fr serves Supabase Studio
[ ] CDN domain: cdn.ohmygold.fr serves static assets
[ ] SSL: valid certificate from Let's Encrypt
[ ] SSL Labs: A+ rating
[ ] HSTS: enabled with preload
[ ] Auto-renewal: certificate renews before expiry
[ ] DNS: all A records propagated
[ ] Redirect: HTTP → HTTPS automatic
```

### Estimated Effort
1 day

### LLM Agent Launch Prompt

```
Configure SSL and domain for OhMyGold production.

CONTEXT: SSL certificates, domain configuration, HSTS for production.

TASK:
1. Domain setup:
   - Register/obtain: ohmygold.fr
   - DNS A records:
     * ohmygold.fr → VPS IP
     * app.ohmygold.fr → VPS IP
     * api.ohmygold.fr → VPS IP
     * studio.ohmygold.fr → VPS IP
     * cdn.ohmygold.fr → VPS IP

2. Caddy SSL configuration:
   - Automatic HTTPS via Let's Encrypt
   - ACME protocol
   - Redirect HTTP to HTTPS
   - HSTS header: max-age=31536000; includeSubDomains; preload
   - OCSP stapling

3. Verification:
   - SSL Labs test: A+ rating
   - All subdomains load with HTTPS
   - HTTP redirects to HTTPS
   - Certificate valid and trusted
   - Auto-renewal working

REQUIREMENTS:
- A+ SSL Labs rating
- HSTS with preload
- Auto-renewal
- All subdomains configured

FILES TO MODIFY:
- docker/caddy/Caddyfile.prod

VERIFICATION STEPS:
1. All domains resolve to VPS IP
2. HTTPS loads on all subdomains
3. SSL Labs: A+
4. HSTS header present
5. HTTP redirects to HTTPS

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Domain: ___
- Subdomains: ___
- SSL rating: ___
- HSTS: Yes/No
```

---

## 9.3 Database Migration to Production

### Description and Scope
Migrate the database from staging/development to production: run all migrations in order, verify schema integrity, import initial data (locations, plans, staff accounts), and validate RLS policies. Zero-downtime migration strategy.

### Why This Matters
Database migration is the highest-risk deployment step. A failed migration can corrupt data or leave the database in an inconsistent state. The migration must be reversible (rollback plan) and must preserve all data integrity constraints.

### Technical Approach
Migration strategy: run migrations in order using Supabase CLI. Pre-migration backup: full PostgreSQL dump. Migration validation: schema diff between expected and actual. Data seeding: locations, membership plans, admin accounts. RLS verification: test all policies. Rollback plan: restore from backup if migration fails. Cutover: minimal downtime (< 5 minutes) during maintenance window.

### Files/Directories to Create/Modify
```
scripts/
├── migrate-production.sh    # Migration script
├── seed-production.sql      # Initial production data
└── verify-migration.sh      # Post-migration verification
docs/deployment/
└── database-migration.md    # Migration procedures
```

### Dependencies on Other Items
- 9.1 (production environment with PostgreSQL)
- 1.7 (all database migrations)

### Success Criteria
```
[ ] All 75+ migrations apply successfully in order
[ ] Schema matches expected structure
[ ] Pre-migration backup completed
[ ] Initial data seeded: 2+ locations, plans, admin accounts
[ ] RLS policies verified: all tables have policies
[ ] Role-based access tested on production
[ ] Data integrity: foreign keys, constraints, indexes
[ ] Migration time: < 5 minutes
[ ] Rollback plan tested: can restore from backup
[ ] Post-migration verification: all checks pass
```

### Estimated Effort
1-2 days

### LLM Agent Launch Prompt

```
Migrate the OhMyGold database to production.

CONTEXT: Run all migrations, seed initial data, verify RLS. Zero-downtime strategy.

TASK:
1. Pre-migration:
   - Full PostgreSQL backup: pg_dump
   - Store backup in S3 with timestamp
   - Verify backup integrity
   - Document rollback procedure

2. Migration execution:
   - supabase db push (run pending migrations)
   - Execute in transaction where possible
   - Log each migration execution time
   - Monitor for errors

3. Data seeding:
   - Gold's Gym France locations (2+)
   - Membership plans (Basic, Premium, Elite)
   - Admin accounts (Gold's Gym IT team)
   - Staff accounts for pilot location
   - Operating hours, facility zones

4. Post-migration verification:
   - Schema diff: expected vs actual
   - All tables exist with correct columns
   - Foreign key constraints active
   - Indexes created
   - RLS policies applied
   - Test: login as each role, verify data access

5. Rollback:
   - Test rollback procedure on staging
   - Document: restore from backup, DNS revert
   - Rollback time: < 30 minutes

REQUIREMENTS:
- < 5 minute migration window
- Full backup before migration
- Tested rollback procedure
- Post-migration verification passes

FILES TO CREATE:
- scripts/migrate-production.sh
- scripts/seed-production.sql
- scripts/verify-migration.sh

VERIFICATION STEPS:
1. Backup completed and verified
2. All migrations applied
3. Schema correct
4. Data seeded
5. RLS policies working
6. Rollback tested

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Migrations applied: ___
- Migration time: ___ minutes
- Data seeded: ___ locations, ___ plans, ___ users
- Rollback tested: Yes/No
```

---

## 9.4 App Store Submission (iOS + Android)

### Description and Scope
Prepare and submit the OhMyGold mobile app to Apple App Store and Google Play Store. Include store listing assets (screenshots, descriptions, keywords), privacy policy URL, compliance with store guidelines, and TestFlight/Google Play Console configuration.

### Why This Matters
App store submission is the gateway to user adoption. A rejected app delays launch by days or weeks. Apple in particular has strict guidelines: Sign-In with Apple is mandatory if you use third-party auth, apps must provide value (not just be a wrapper around a website), and privacy declarations must be accurate. Preparation is key to first-time acceptance.

### Technical Approach
Apple: Apple Developer Account ($99/year), App Store Connect, TestFlight for final validation, submit for review. Screenshots: 6.7" iPhone (required), 6.5", 5.5", iPad Pro. Google: Google Play Console ($25 one-time), internal testing track, production track. Screenshots: phone (16:9), 7" tablet, 10" tablet. Both: privacy policy URL, app description (FR/EN), keywords, support URL, marketing URL. Compliance: Apple Sign-In, data privacy nutrition labels, age rating.

### Files/Directories to Create/Modify
```
assets/
├── app-store/
│   ├── screenshots/
│   │   ├── ios/
│   │   │   ├── iphone-6.7/       # 6 required screenshots
│   │   │   ├── iphone-6.5/
│   │   │   └── ipad-pro/
│   │   └── android/
│   │       ├── phone/
│   │       └── tablet/
│   ├── description-fr.txt
│   ├── description-en.txt
│   ├── keywords-fr.txt
│   └── keywords-en.txt
docs/deployment/
└── app-store-submission.md    # Submission checklist
```

### Dependencies on Other Items
- Phase 6 (complete mobile app)
- 8.10 (beta testing completed)
- 8.3 (privacy policy published)

### Success Criteria
```
[ ] Apple Developer Account enrolled ($99/year)
[ ] Google Play Console registered ($25 one-time)
[ ] App Store Connect: app record created
[ ] Screenshots: all required sizes for iOS and Android
[ ] App description: French and English
[ ] Keywords: optimized for search (FR/EN)
[ ] Privacy policy URL: linked in both stores
[ ] Apple Sign-In: implemented (mandatory)
[ ] Data privacy labels: accurately filled
[ ] Age rating: completed questionnaire
[ ] TestFlight: final validation build tested
[ ] Google Play: internal testing validated
[ ] iOS app: submitted for review
[ ] Android app: submitted for review
[ ] Both apps: approved and published
```

### Estimated Effort
3-5 days (depends on review time)

### LLM Agent Launch Prompt

```
Submit OhMyGold to Apple App Store and Google Play Store.

CONTEXT: Mobile app submission to both stores. Must comply with all guidelines for first-time acceptance.

TASK:
1. Apple App Store:
   - Enroll in Apple Developer Program ($99/year)
   - Create app record in App Store Connect
   - Bundle ID: com.goldsgym.ohmygold
   - App name: OhMyGold
   - Primary language: French
   - Screenshots (6 required):
     * iPhone 6.7" (iPhone 14 Pro Max): 6 screenshots
     * iPhone 6.5": 6 screenshots
     * iPad Pro: 6 screenshots
   - Description: French + English
   - Keywords: gym, fitness, workout, booking, membership
   - Support URL: support.ohmygold.fr
   - Privacy policy URL: ohmygold.fr/privacy-policy
   - Apple Sign-In: verified implemented
   - Data privacy nutrition label: complete
   - Age rating: 12+ (fitness, health)
   - Build: upload via EAS
   - Submit for review

2. Google Play Store:
   - Register Google Play Console ($25)
   - Create app listing
   - Package name: com.goldsgym.ohmygold
   - Screenshots:
     * Phone (16:9): 8 screenshots
     * 7" tablet: 8 screenshots
     * 10" tablet: 8 screenshots
     * Feature graphic: 1024x500
   - Description: French + English
   - Content rating: PEGI 3+ (fitness)
   - Privacy policy URL
   - App bundles: upload AAB via EAS
   - Internal testing → Production

3. Store assets:
   - Screenshots: high-quality, Gold's Gym branded
   - App icon: 1024x1024 (iOS), 512x512 (Android)
   - Feature graphic (Android): 1024x500
   - Promo video (optional): 30 seconds

REQUIREMENTS:
- Apple Sign-In implemented (mandatory)
- Privacy policy published
- Screenshots for all required sizes
- French and English descriptions
- Comply with both stores' guidelines

FILES TO CREATE:
- assets/app-store/screenshots/*
- assets/app-store/description-*.txt
- assets/app-store/keywords-*.txt

VERIFICATION STEPS:
1. Apple: TestFlight build works
2. Google: internal testing build works
3. All screenshots uploaded
4. Descriptions published
5. Privacy policy linked
6. Both submitted
7. Both approved

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Apple: submitted/approved/published
- Google: submitted/approved/published
- Review time: Apple/___ days, Google/___ days
- Any rejection reasons: ___
```

---


### App Store Privacy Compliance (Health Data)

#### App Tracking Transparency (ATT) — iOS 14.5+

```xml
<!-- Info.plist entries -->
<key>NSUserTrackingUsageDescription</key>
<string>OhMyGold uses your data to personalize your fitness experience. Your health data is never sold to third parties.</string>

<key>NSHealthShareUsageDescription</key>
<string>OhMyGold reads your workout data to track fitness progress and award achievements.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>OhMyGold writes workout data when you log exercises completed in the app.</string>

<key>NSCameraUsageDescription</key>
<string>OhMyGold uses the camera to scan QR codes for gym check-in and to report equipment issues.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>OhMyGold uses your location to verify gym check-in and show nearby Gold's Gym locations.</string>
```

#### App Store Privacy Nutrition Labels

| Data Type | Usage | Linked to Identity | Third-Party Sharing |
|-----------|-------|-------------------|---------------------|
| Health & Fitness | Workout tracking, progress | Yes | No |
| Financial Info | Membership billing | Yes | Stripe (payment processor) |
| Contact Info | Account, communication | Yes | SendGrid (email), Twilio (SMS) |
| User Content | Issue report photos | Optional | No |
| Identifiers | Push notifications | Yes | Expo (push delivery) |
| Usage Data | App analytics | No | PostHog (analytics) |
| Diagnostics | Crash reporting | No | Expo Insights |

#### Google Play Health Data Declaration

In Play Console: Declare access to health data types (fitness/exercise), provide privacy policy URL, complete health apps developer declaration.


## 9.5 Webapp Production Deployment

### Description and Scope
Deploy the OhMyGold webapp to production: build production bundles, deploy to VPS via CI/CD, verify all routes, test critical user journeys, and monitor for errors. Blue-green deployment for zero downtime.

### Why This Matters
The webapp is the primary interface for Admin, Manager, and Employee roles. A failed deployment means staff can't do their jobs. Zero-downtime deployment ensures continuous availability. Post-deployment verification catches issues before users do.

### Technical Approach
CI/CD pipeline builds production bundle (Vite build), deploys to VPS via SSH (blue-green: deploy to new container, health check, switch traffic). Build: production environment variables, source maps for error tracking (not exposed). Verification: smoke test all critical routes, test login, test key features. Monitoring: Sentry for error tracking, Grafana for metrics. Rollback: instant switch to previous container if health check fails.

### Files/Directories to Create/Modify
```
.github/workflows/
├── deploy-production.yml    # Production deployment pipeline
scripts/
├── deploy.sh                # Deployment script
└── smoke-test.sh            # Post-deployment smoke tests
docs/deployment/
└── webapp-deployment.md
```

### Dependencies on Other Items
- 9.1 (production environment)
- 1.3 (CI/CD pipeline)
- 9.3 (database migrated)

### Success Criteria
```
[ ] Production build: successful, optimized
[ ] Deployment: zero downtime (blue-green)
[ ] All routes accessible and functional
[ ] Login works with production auth
[ ] Critical journeys: booking, check-in, payment
[ ] Error tracking: Sentry receiving errors
[ ] Performance: LCP < 2s on production
[ ] SSL: A+ rating
[ ] Health check: /health returns 200
[ ] Rollback tested: can revert in < 2 minutes
[ ] Monitoring: Grafana shows healthy metrics
```

### Estimated Effort
1-2 days

### LLM Agent Launch Prompt

```
Deploy OhMyGold webapp to production.

CONTEXT: Zero-downtime deployment of webapp to production VPS. Blue-green strategy.

TASK:
1. Production build:
   - Vite production build
   - Environment variables: production Supabase URL, keys
   - Source maps for Sentry (not exposed publicly)
   - Bundle analysis: verify size targets

2. Deployment:
   - Blue-green: deploy to "green" container
   - Health check: /health, /ready
   - If healthy: switch traffic (Caddy upstream)
   - If unhealthy: keep "blue" running, alert
   - Zero downtime guaranteed

3. Post-deployment verification:
   - Smoke test: all critical routes return 200
   - Login: authenticate successfully
   - Booking: complete a test booking
   - Check-in: process a test check-in
   - Payment: process a test payment (Stripe test mode)
   - Performance: Lighthouse audit

4. Monitoring:
   - Sentry: error tracking active
   - Grafana: dashboards showing data
   - Alertmanager: alerts configured
   - Uptime monitoring: external check

5. Rollback:
   - One-command rollback to previous version
   - Rollback time: < 2 minutes
   - Tested on staging first

REQUIREMENTS:
- Zero downtime
- Health check before switch
- Smoke tests pass
- Monitoring active
- Rollback capability

FILES TO CREATE:
- .github/workflows/deploy-production.yml
- scripts/deploy.sh
- scripts/smoke-test.sh

VERIFICATION STEPS:
1. Build successful
2. Deploy zero-downtime
3. Smoke tests pass
4. Login works
5. Performance OK
6. Monitoring active
7. Rollback tested

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Deploy time: ___ minutes
- Downtime: ___ seconds
- Lighthouse score: ___
- Smoke tests: ___/___ passed
- Rollback time: ___ minutes
```

---

## 9.6 Monitoring and Alerting Setup

### Description and Scope
Configure comprehensive production monitoring: application performance monitoring (Sentry), infrastructure monitoring (Grafana + Prometheus), uptime monitoring (UptimeRobot or similar), log aggregation (Loki), error alerting (PagerDuty or Slack), and business metrics dashboards.

### Why This Matters
"You can't manage what you don't measure." In production, monitoring is the only way to know if the platform is healthy. An undetected outage can last hours without monitoring. Error alerts catch bugs before users report them. Business metrics dashboards inform strategic decisions.

### Technical Approach
Sentry: error tracking, performance monitoring, release tracking. Grafana + Prometheus: infrastructure metrics (CPU, memory, DB connections, API response times). Loki: log aggregation with searchable logs. UptimeRobot: external uptime monitoring (5-minute checks). Alerts: Slack for warnings, PagerDuty/SMS for critical. Business metrics: daily active users, bookings, revenue, check-ins — visible to management.

### Files/Directories to Create/Modify
```
docker/monitoring/
├── grafana-dashboards/
│   ├── app-performance.json
│   ├── infrastructure.json
│   ├── business-metrics.json
│   └── error-tracking.json
├── alertmanager/
│   └── alert-rules.yml
docs/ops/
├── monitoring-setup.md
├── runbooks/
│   ├── high-cpu.md
   ├── high-memory.md
│   ├── database-issues.md
│   ├── api-errors.md
│   └── incident-response.md
```

### Dependencies on Other Items
- 9.1 (monitoring stack deployed)
- 1.9 (monitoring configuration from Phase 1)

### Success Criteria
```
[ ] Sentry: error tracking active, source maps uploaded
[ ] Grafana: 4 dashboards (app, infra, business, errors)
[ ] Prometheus: scraping all services
[ ] Loki: all logs aggregated and searchable
[ ] UptimeRobot: 99.9% uptime target, 5-min checks
[ ] Alerts: Slack for warnings, SMS for critical
[ ] Alert rules: CPU > 80%, memory > 80%, DB connections > 80%, API errors > 1%, uptime check failed
[ ] Runbooks: documented procedures for common alerts
[ ] On-call rotation: defined escalation path
[ ] Business metrics: daily/weekly dashboards
[ ] 99.9% uptime SLA defined and monitored
```

### Estimated Effort
2-3 days

### LLM Agent Launch Prompt

```
Set up production monitoring and alerting for OhMyGold.

CONTEXT: Comprehensive monitoring: errors, infrastructure, uptime, business metrics.

TASK:
1. Error tracking (Sentry):
   - Sentry project configured
   - Source maps uploaded for production
   - Error alerts: Slack integration
   - Performance monitoring: transactions, spans
   - Release tracking

2. Infrastructure monitoring (Grafana + Prometheus):
   - CPU usage per container
   - Memory usage
   - Database connections
   - Disk usage
   - Network I/O
   - API response times (p50, p95, p99)
   - Request rate and error rate

3. Log aggregation (Loki):
   - All container logs collected
   - Searchable by service, level, trace ID
   - Alert on ERROR level logs
   - Retention: 30 days

4. Uptime monitoring:
   - External check every 5 minutes
   - Check: app.ohmygold.fr/health
   - Alert if down > 2 minutes
   - Status page (optional): status.ohmygold.fr

5. Alerting:
   - Slack: warnings (CPU > 70%, API errors > 0.5%)
   - SMS/PagerDuty: critical (CPU > 90%, downtime)
   - Escalation: 5 min → Slack, 15 min → SMS, 30 min → call

6. Business metrics:
   - Daily active users
   - Bookings per day
   - Check-ins per day
   - Revenue per day
   - New enrollments per day
   - Churn rate

7. Runbooks:
   - High CPU: investigation steps
   - High memory: restart procedure
   - Database issues: connection pool, slow queries
   - API errors: error pattern analysis
   - Incident response: escalation procedure

REQUIREMENTS:
- 99.9% uptime monitoring
- Alert on all critical conditions
- Runbooks for common scenarios
- Business metrics dashboard

FILES TO CREATE:
- docker/monitoring/grafana-dashboards/*.json
- docker/monitoring/alertmanager/alert-rules.yml
- docs/ops/runbooks/*.md

VERIFICATION STEPS:
1. Sentry receiving errors
2. Grafana dashboards load
3. Alert test: trigger alert, verify notification
4. Uptime check: simulate downtime, verify alert
5. Business metrics: data flowing
6. Runbooks reviewed by team

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Monitoring tools: ___
- Alert channels: ___
- Runbooks: ___
- Uptime target: 99.9%
- On-call rotation: defined/Yes
```

---

## 9.7 Backup and Disaster Recovery Verification

### Description and Scope
Verify backup systems and disaster recovery procedures: automated daily backups, backup integrity testing, documented recovery procedures, RTO (4 hours) and RPO (1 hour) targets, and annual DR drill schedule.

### Why This Matters
Data loss is catastrophic — member data, financial records, and operational data are irreplaceable. A tested backup that can't be restored is worthless. The disaster recovery plan ensures the team knows exactly what to do when things go wrong, not scramble to figure it out during an outage.

### Technical Approach
Backups: daily PostgreSQL dump (pg_dump) to S3 with encryption, Supabase Storage backup, configuration backup. Integrity: weekly restore test on staging environment. DR plan: documented step-by-step recovery procedure, including contact list and decision tree. RTO: 4 hours (time to restore service). RPO: 1 hour (maximum data loss). Testing: quarterly DR drill on staging.

### Files/Directories to Create/Modify
```
scripts/
├── backup.sh                # Daily backup script
├── restore.sh               # Recovery script
└── verify-backup.sh         # Backup integrity check
docs/ops/
├── disaster-recovery.md     # DR plan
├── backup-procedures.md     # Backup procedures
└── contact-list.md          # Emergency contacts
```

### Dependencies on Other Items
- 9.1 (production environment)
- 9.3 (database migrated)

### Success Criteria
```
[ ] Daily automated backups running
[ ] Backup encryption: AES-256
[ ] Backup storage: S3 with versioning
[ ] Backup retention: 30 days
[ ] Weekly restore test: successful
[ ] DR plan: documented, approved, accessible
[ ] RTO: 4 hours (tested and verified)
[ ] RPO: 1 hour
[ ] Recovery procedure: step-by-step, tested
[ ] Contact list: 24/7 escalation path
[ ] DR drill: completed and documented
[ ] Backup monitoring: alert if backup fails
```

### Estimated Effort
1-2 days

### LLM Agent Launch Prompt

```
Verify backup and disaster recovery for OhMyGold.

CONTEXT: Backup systems and DR procedures must be tested and verified before launch.

TASK:
1. Backup system:
   - Daily PostgreSQL dump: pg_dump → S3
   - Supabase Storage: sync to S3
   - Config backup: Caddyfile, env vars
   - Encryption: AES-256
   - Retention: 30 days
   - Monitoring: alert if backup fails

2. Restore testing:
   - Weekly: restore backup to staging
   - Verify data integrity
   - Verify application works with restored data
   - Time the restore process

3. Disaster recovery plan:
   - Scenarios: database corruption, server failure, data center outage
   - Decision tree: assess → contain → recover → communicate
   - Recovery steps: numbered, specific commands
   - Contact list: primary, secondary, vendor contacts
   - Communication template: internal + external

4. RTO/RPO verification:
   - RTO test: simulate failure, measure recovery time
   - Target: 4 hours
   - RPO test: measure data loss in recovery
   - Target: 1 hour

5. DR drill:
   - Schedule: quarterly
   - Scope: full recovery on fresh server
   - Document: what worked, what didn't, improvements

REQUIREMENTS:
- Daily backups automated
- Weekly restore test
- DR plan documented
- RTO 4h, RPO 1h verified
- Quarterly DR drill

FILES TO CREATE:
- scripts/backup.sh
- scripts/restore.sh
- docs/ops/disaster-recovery.md
- docs/ops/contact-list.md

VERIFICATION STEPS:
1. Backup runs successfully
2. Restore test passes
3. DR plan reviewed
4. RTO/RPO measured
5. DR drill completed

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Backup: daily/Yes, encrypted/Yes
- Restore time: ___ minutes
- RTO measured: ___ hours
- RPO measured: ___ minutes
- DR drill: completed/Yes
```

---

## 9.8 Staff Training Program

### Description and Scope
Develop and deliver staff training materials: role-specific training guides, video tutorials, live training sessions, quick reference cards, and a feedback mechanism. Train all staff at the pilot location before soft launch.

### Why This Matters
The best software fails if users don't know how to use it. Staff training ensures employees can perform their jobs confidently with OhMyGold. Well-trained staff provide better member experiences and report fewer support issues. Training investment pays for itself in reduced support tickets.

### Technical Approach
Training materials: role-specific guides (PDF + video), interactive tutorials built into the app (tooltips, walkthroughs), quick reference cards for common tasks (check-in, POS, booking). Live training: 2-hour session per role group at pilot location. Self-service: training portal with all materials. Assessment: quiz to verify understanding. Feedback: collect pain points and feature requests.

### Files/Directories to Create/Modify
```
docs/training/
├── admin-training.md
├── manager-training.md
├── employee-training.md
├── teacher-training.md
├── quick-reference/
│   ├── check-in-card.pdf
│   ├── pos-card.pdf
│   └── booking-card.pdf
└── video-scripts/
    ├── intro.md
    ├── check-in.md
    └── pos.md
docs/feedback/
└── training-feedback.md
```

### Dependencies on Other Items
- Phase 5 (web screens — know the interface)
- Phase 6 (mobile app — know the features)
- 8.9 (user guides)

### Success Criteria
```
[ ] Training materials: role-specific guides for all 5 staff roles
[ ] Video tutorials: 5+ videos covering key workflows
[ ] Quick reference cards: printed for front desk
[ ] Live training: delivered at pilot location
[ ] Interactive tutorials: built into app (first-use walkthroughs)
[ ] Assessment: quiz, > 80% pass rate
[ ] Feedback collected: pain points documented
[ ] Training completion: 100% of pilot location staff
[ ] Support contact: established for post-training questions
[ ] Training metrics: time to proficiency documented
```

### Estimated Effort
3-4 days (content creation + delivery)

### LLM Agent Launch Prompt

```
Develop and deliver staff training for OhMyGold.

CONTEXT: Train all staff at pilot location before soft launch. Role-specific materials.

TASK:
1. Training materials:
   - Admin guide: system setup, user management, configuration
   - Manager guide: daily operations, reports, settings
   - Employee guide: check-in, POS, attendance, issues
   - Teacher guide: schedule, attendance, substitutions
   - Format: PDF with screenshots, step-by-step

2. Video tutorials (screen recordings):
   - Introduction to OhMyGold (5 min)
   - How to check in a member (3 min)
   - How to process a sale (3 min)
   - How to book a class for a member (2 min)
   - How to take attendance (2 min)
   - How to report a facility issue (2 min)
   - How to view reports (3 min)

3. Quick reference cards:
   - Check-in: step-by-step with screenshots
   - POS: product search, cart, payment
   - Booking: find class, book, cancel
   - Print on durable card stock

4. Interactive tutorials:
   - First-use walkthrough: tooltips highlighting key features
   - Contextual help: question mark icons with explanations
   - Progressive disclosure: show advanced features gradually

5. Live training sessions:
   - Schedule: 2 hours per role group
   - Location: pilot gym (computer lab or on-site)
   - Hands-on: practice with test data
   - Q&A: address specific concerns
   - Follow-up: 1-week check-in

6. Assessment:
   - 10-question quiz per role
   - > 80% required to pass
   - Retake available
   - Completion tracked

REQUIREMENTS:
- All staff roles covered
- French and English materials
- Hands-on practice
- Assessment with pass criteria
- Feedback collection

FILES TO CREATE:
- docs/training/*.md
- docs/training/quick-reference/*.pdf
- docs/training/video-scripts/*.md

VERIFICATION STEPS:
1. All training materials created
2. Videos recorded
3. Quick reference cards printed
4. Live training delivered
5. Assessment: > 80% pass rate
6. Feedback collected
7. 100% completion at pilot location

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Staff trained: ___
- Roles: ___
- Pass rate: ___%
- Feedback themes: ___
```

---

## 9.9 Soft Launch (Pilot Location)

### Description and Scope
Execute a soft launch at one pilot Gold's Gym location. Deploy to production, train staff, onboard initial members, monitor closely, collect feedback, and fix issues before full launch. Duration: 2 weeks.

### Why This Matters
A soft launch is the lowest-risk way to validate the platform in a real gym environment. Issues that didn't appear in testing will surface: WiFi connectivity problems, staff workflow mismatches, member confusion with new features. Fixing these at one location is infinitely easier than fixing them across all locations simultaneously.

### Technical Approach
Pilot selection: choose a medium-sized location with engaged staff and tech-savvy members. Staff: fully trained (Phase 9.8). Members: invite existing members via email, offer incentive (free week, discount). Monitoring: daily check-ins on metrics (check-in time, booking rate, error rate, support tickets). Feedback: daily staff debrief, weekly member survey. Issue triage: P0 (fix immediately), P1 (fix within 48 hours), P2 (schedule for full launch). Go/no-go decision after 2 weeks.

### Files/Directories to Create/Modify
```
docs/launch/
├── soft-launch-plan.md
├── pilot-selection.md
├── member-onboarding.md
├── daily-checklist.md
├── feedback-collection.md
└── go-no-go-criteria.md
```

### Dependencies on Other Items
- All previous items (complete platform)
- 9.8 (staff training)

### Success Criteria
```
[ ] Pilot location selected and prepared
[ ] Staff: 100% trained and confident
[ ] Members: 200+ onboarded at pilot
[ ] Check-in: processing time < 3 seconds (measured)
[ ] Booking: > 50% of active members book at least one class
[ ] Error rate: < 0.1% (Sentry)
[ ] Support tickets: < 5 per day
[ ] Staff satisfaction: > 4/5 (survey)
[ ] Member satisfaction: > 4/5 (survey)
[ ] Zero critical bugs
[ ] All P1 bugs resolved within 48 hours
[ ] Go/no-go decision: GO for full launch
```

### Estimated Effort
2 weeks (ongoing monitoring)

### LLM Agent Launch Prompt

```
Execute soft launch at pilot Gold's Gym location.

CONTEXT: 2-week pilot launch to validate platform in real gym environment.

TASK:
1. Pilot preparation:
   - Select pilot location (medium size, engaged staff)
   - Prepare hardware: tablets for staff, signage for members
   - Staff schedule: ensure trained staff on all shifts
   - Member communication: email invite, incentive offer
   - Support: on-site tech support for first 3 days

2. Daily operations:
   - Check-in: monitor processing time
   - Booking: track booking rates
   - POS: track sales processing
   - Attendance: verify teacher tools working
   - Support: triage and resolve issues

3. Data collection:
   - Daily metrics: check-ins, bookings, errors, tickets
   - Staff debrief: 15 min at end of shift
   - Member survey: weekly NPS survey
   - App analytics: DAU, session duration, feature usage

4. Issue management:
   - P0: critical → fix same day
   - P1: major → fix within 48 hours
   - P2: minor → schedule for full launch
   - Daily standup: review issues and progress

5. Go/no-go criteria:
   - Check-in time: < 3s average
   - Booking adoption: > 50% of active members
   - Error rate: < 0.1%
   - Staff satisfaction: > 4/5
   - Member satisfaction: > 4/5
   - Zero critical bugs
   - All P1 resolved

6. Decision:
   - Week 2 end: go/no-go meeting
   - GO: proceed to full launch
   - NO-GO: extend pilot, fix issues, reassess

REQUIREMENTS:
- 200+ members onboarded
- Daily monitoring
- Issue triage within SLA
- Go/no-go decision documented

FILES TO CREATE:
- docs/launch/soft-launch-plan.md
- docs/launch/daily-checklist.md
- docs/launch/go-no-go-criteria.md

VERIFICATION STEPS:
1. Pilot location ready
2. Staff trained and confident
3. Members onboarded
4. Daily metrics tracked
5. Issues triaged and resolved
6. Go/no-go criteria met
7. Decision: GO

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Pilot location: ___
- Members onboarded: ___
- Check-in avg time: ___ seconds
- Booking adoption: ___%
- Error rate: ___%
- NPS: ___
- Issues: P0/___ P1/___ P2/___
- Decision: GO/NO-GO
```

---

## 9.10 Full Launch and Marketing

### Description and Scope
Execute the full launch across all Gold's Gym France locations: migrate all locations to OhMyGold, train all staff, onboard all members, execute marketing campaign, and monitor system performance at scale. Celebrate the launch.

### Why This Matters
The full launch is the culmination of months of work. It's the moment OhMyGold becomes the operational backbone of Gold's Gym France. A successful full launch means thousands of members booking classes, hundreds of staff processing check-ins, and a platform that scales with the business.

### Technical Approach
Rollout plan: phased by region (Paris → Region → South), one region per week. Staff training: schedule sessions per location. Member onboarding: email campaign + in-gym promotion + app store links. Marketing: social media, email, in-gym posters, member referral program. Monitoring: scaled-up monitoring for multi-location load. Support: increased support capacity during rollout. Post-launch: weekly review, monthly optimization sprints.

### Files/Directories to Create/Modify
```
docs/launch/
├── full-launch-plan.md
├── rollout-schedule.md
├── marketing-plan.md
├── member-onboarding-campaign.md
└── post-launch-review.md
```

### Dependencies on Other Items
- 9.9 (soft launch completed, GO decision)

### Success Criteria
```
[ ] Rollout schedule: all locations migrated within 4 weeks
[ ] Staff training: 100% of staff at all locations trained
[ ] Member onboarding: 80% of members using app within 30 days
[ ] App store downloads: > 5,000 in first month
[ ] System performance: no degradation at scale
[ ] Error rate: maintained < 0.1%
[ ] Support tickets: < 10 per day across all locations
[ ] Marketing: campaign executed across all channels
[ ] NPS: > 40 from members
[ ] Revenue: no disruption to billing/payments
[ ] Post-launch review: completed with action items
[ ] OhMyGold team celebration: you earned it
```

### Estimated Effort
2-4 weeks (ongoing rollout)

### LLM Agent Launch Prompt

```
Execute full launch of OhMyGold across all Gold's Gym France locations.

CONTEXT: Full rollout across all locations. Marketing campaign. Scale monitoring.

TASK:
1. Rollout schedule:
   - Week 1: Paris locations (flagship gyms)
   - Week 2: Northern France
   - Week 3: Eastern/South-Eastern France
   - Week 4: Southern France + Corsica
   - Each location: 2-day preparation (training + setup)

2. Staff training:
   - Per-location training sessions
   - Trainers: OhMyGold team visits each location
   - Remote support: video calls for questions
   - Reference materials: printed quick guides

3. Member onboarding:
   - Email campaign: "Introducing OhMyGold — Your New Gym App"
   - In-gym: posters, QR codes, staff assistance
   - Incentive: first month premium features free
   - Tutorial: in-app walkthrough for first login
   - Support: FAQ page, chat support

4. Marketing campaign:
   - Social media: Facebook, Instagram, TikTok
   - Email: segmented by membership type
   - In-gym: posters, digital displays
   - Referral: "Invite a friend, both get free week"
   - PR: fitness industry press release

5. Scale monitoring:
   - Increased infrastructure: scale up before rollout
   - Support team: expanded during rollout
   - Daily standup: review metrics and issues
   - Weekly review: per-location status

6. Success metrics:
   - Track: DAU, MAU, booking rate, check-in time
   - Compare: pre-OhMyGold vs post-OhMyGold
   - Survey: NPS at 30 days
   - Revenue: no disruption, identify growth

7. Post-launch:
   - Week 4: post-launch review meeting
   - Document: what worked, what didn't
   - Action items: optimization sprints
   - Roadmap: Phase 2 features prioritized

REQUIREMENTS:
- Phased rollout
- Full staff training
- Member onboarding campaign
- Scale monitoring
- Post-launch review

FILES TO CREATE:
- docs/launch/full-launch-plan.md
- docs/launch/rollout-schedule.md
- docs/launch/marketing-plan.md

VERIFICATION STEPS:
1. Rollout on schedule
2. All staff trained
3. Member onboarding: > 80% adoption
4. App downloads: > 5,000
5. Performance stable
6. NPS > 40
7. Post-launch review completed

DESIGN SYSTEM REFERENCE:
- Read DESIGN.MD: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD
- Follow component patterns, color tokens, typography, spacing
- Ensure all screens match Gold's Gym brand identity
NOTES AREA (fill on completion):
- Date completed: ___
- Locations migrated: ___
- Total members: ___
- App downloads: ___
- DAU: ___
- NPS: ___
- Issues post-launch: ___
- Celebration: Yes!
```

---

## Phase 9 Completion Checklist

```
[ ] 9.1 Production environment: secure, monitored, hardened
[ ] 9.2 SSL and domain: A+ rating, all subdomains configured
[ ] 9.3 Database migration: all migrations applied, data seeded
[ ] 9.4 App stores: iOS and Android approved and published
[ ] 9.5 Webapp deployment: zero downtime, smoke tests pass
[ ] 9.6 Monitoring: Sentry, Grafana, alerts, runbooks
[ ] 9.7 Backup and DR: verified, RTO 4h, RPO 1h
[ ] 9.8 Staff training: 100% trained at pilot location
[ ] 9.9 Soft launch: 2-week pilot, go criteria met
[ ] 9.10 Full launch: all locations, marketing, success metrics
[ ] Production: live and serving real users
[ ] App stores: published and downloadable
[ ] Monitoring: all systems green
[ ] Support: handling tickets within SLA
[ ] Post-launch review: completed with action items
```

---

*Phase 9 notes: This is it. The finish line. Months of work culminate in this phase. Every late night, every bug fix, every design decision — it all comes together here. But remember: launch is not the end, it's the beginning. The real work of iterating, improving, and growing OhMyGold starts the day after launch. Build something you're proud of. Gold's Gym France is counting on you.*

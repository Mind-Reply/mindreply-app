# PRODUCTION CHECKLIST FOR MindReply

**Status:** NOT PRODUCTION READY (see blockers below)  
**Last Verified:** 2026-09-16  
**Owner:** Angel Krastev  

---

## BLOCKER: SECURITY — CREDENTIAL ROTATION REQUIRED

**Status:** 🔴 BLOCKS ALL PRODUCTION DEPLOYMENT

Before any production deployment, all previously exposed credentials must be rotated at their providers:

### Required Rotations

- [ ] **Stripe API keys** — Revoke old, generate new test + live keys
  - Affects: Webhook secret, API key, restricted key
  - Location: Stripe Dashboard → Developers → API Keys
  - Action: Rotate + update in Vercel Environment Variables
  - Evidence: Screenshot of new keys dated {date}

- [ ] **Vercel tokens** — Revoke old deploy tokens
  - Location: Vercel Dashboard → Settings → Tokens
  - Action: Revoke all old tokens, generate new scoped tokens
  - Evidence: New token hash dated {date}

- [ ] **Supabase credentials** — Rotate service-role key + database password
  - Location: Supabase Project → Settings → API
  - Action: Rotate service-role key + database password
  - Evidence: New credentials dated {date}

- [ ] **Database credentials** — If external database, rotate password
  - Location: Database provider console
  - Action: Change master password
  - Evidence: Confirmed with provider

- [ ] **SMTP/Email provider keys** — Rotate API keys
  - Location: Email provider console (SendGrid, AWS SES, etc.)
  - Action: Revoke old keys, generate new
  - Evidence: New key dated {date}

- [ ] **AI provider keys** — Rotate OpenAI / Gemini / other LLM keys
  - Location: Model provider console
  - Action: Revoke old keys, generate new
  - Evidence: New key dated {date}

- [ ] **GitHub deploy keys** — Rotate SSH keys if any are shared
  - Location: GitHub Org/Repo → Settings → Deploy Keys
  - Action: Delete shared keys, generate new personal keys
  - Evidence: Confirmed deletion + new keys dated {date}

**Owner Sign-Off Required:** Before rotation begins, owner must approve which credentials to rotate and which providers to contact.

---

## BLOCKER: HOSTING — mind-reply.com PROVIDER UNKNOWN

**Status:** 🔴 BLOCKS CONTROL OF PRODUCTION DOMAIN

- [ ] Identify hosting provider for mind-reply.com
  - Method: DNS lookup + domain registrar console access
  - Action: Confirm provider (Vercel, AWS, custom VPS, other)
  - Evidence: Screenshot of hosting control panel or DNS records

- [ ] Verify domain control
  - Action: Confirm owner email access + DNS authentication
  - Evidence: Email confirmation or DNS record verification

- [ ] Establish admin access
  - Action: Login to hosting provider, configure deployment targets
  - Evidence: Screenshot of hosting admin panel

- [ ] Health check live URL
  - Command: `curl -I https://mind-reply.com`
  - Expected: HTTP 200 OK, valid HTTPS certificate
  - Evidence: curl output showing HTTP 200 + certificate info

---

## DOCUMENTATION — CONSOLIDATION REQUIRED

**Status:** 🟡 MEDIUM (cleanup before production)

### Keep (Current)
- [ ] ✓ DEPLOYMENT_GUIDE.md — Current deployment procedures
- [ ] ✓ DEVELOPMENT.md — Development workflow
- [ ] ✓ QUICKSTART.md — Quick start guide
- [ ] ✓ BUILD_SUMMARY.md — What was built
- [ ] ✓ SECURITY.md — Security baseline
- [ ] ✓ AGENTS.md — Agent contracts
- [ ] ✓ README.md — Project overview

### Archive (Historical, not authoritative)
- [x] READY_TO_PUSH.md → docs/ARCHIVE/
- [x] PRODUCTION_DEPLOYMENT.md → docs/ARCHIVE/
- [ ] Add README.md to docs/ARCHIVE/ explaining why files are archived

---

## PRODUCT FLOW VALIDATION

**Status:** 🟡 NEEDS TESTING

Before production, smoke-test all critical user paths:

- [ ] Homepage loads (< 3s, no 404, no console errors)
- [ ] Products page loads and displays offers
- [ ] Website Completion Package page loads
- [ ] Contact form loads and accepts valid input
- [ ] Contact form rejects invalid input (show error)
- [ ] `/api/package-request` endpoint accepts valid POST
- [ ] `/api/package-request` endpoint rejects invalid POST
- [ ] Invoice-first path works (if applicable)
- [ ] Stripe checkout visibility works only when configured
- [ ] Stripe webhook verifies signatures correctly
- [ ] Payment success state shows (if implemented)
- [ ] Payment failure state shows (if implemented)
- [ ] No secrets appear in browser console
- [ ] No secrets appear in network tab
- [ ] No secrets appear in logs
- [ ] All 3xx/4xx/5xx errors handled gracefully

**Test method:** Automated smoke test via Playwright or manual QA

---

## DEPLOYMENT READINESS

**Status:** 🟡 NEEDS VERIFICATION

- [ ] Docker builds successfully
  ```bash
  docker build -t mind-reply-core:latest .
  ```

- [ ] docker-compose.yml runs locally without errors
  ```bash
  docker-compose up -d
  docker-compose logs
  ```

- [ ] All health endpoints return 200 OK
  ```bash
  curl http://localhost:3000/health
  curl http://localhost:8000/health
  ```

- [ ] HTTPS certificate is valid (production domain)
  ```bash
  curl -I https://mind-reply.com | grep -A 5 "certificate"
  ```

- [ ] Environment variables are in Vercel / hosting provider secret store (not .env file)
  - Verify no .env file is committed
  - Verify all secrets are stored in provider console

- [ ] CI/CD pipeline is configured
  - GitHub Actions workflow runs on push
  - Builds Docker images
  - Pushes to registry (ghcr.io or Docker Hub)
  - Deploys to production on approval

---

## MONITORING & OPERATIONS

**Status:** 🟡 NEEDS SETUP

Before production:

- [ ] Uptime monitoring configured
  - Tool: UptimeRobot, Datadog, New Relic, or similar
  - Target: https://mind-reply.com + all critical endpoints
  - Alert threshold: 5 minute downtime

- [ ] Error logging configured
  - Tool: Sentry, LogRocket, CloudWatch, or similar
  - Captures: All JS errors, API errors, backend errors
  - Alert: Email to owner@a11k.space on critical errors

- [ ] Performance monitoring configured
  - Tool: Vercel Analytics, Datadog, New Relic
  - Monitors: Page load time, API response time, error rates
  - Alert: Email if response time > 500ms or error rate > 1%

- [ ] Database backups scheduled
  - Frequency: Daily
  - Retention: 30 days
  - Test restore: Monthly

- [ ] Disaster recovery plan documented
  - How to rollback: [documented]
  - How to restore from backup: [documented]
  - RTO/RPO targets: [documented]

---

## SECURITY GATES

**Status:** 🔴 REQUIRED BEFORE PRODUCTION

- [ ] Secret scanning passed
  - Run: `truffleHog filesystem . --json > secrets-scan.json`
  - Result: Zero high-risk secrets found
  - Evidence: Scan report

- [ ] Dependency audit passed
  - Run: `npm audit` or `pip install safety && safety check`
  - Result: Zero critical/high vulnerabilities (or accepted risk)
  - Evidence: Scan report

- [ ] OWASP top 10 review completed
  - [ ] A01: Broken Access Control — verified
  - [ ] A02: Cryptographic Failures — verified
  - [ ] A03: Injection — verified
  - [ ] A04: Insecure Design — verified
  - [ ] A05: Security Misconfiguration — verified
  - [ ] A06: Vulnerable Components — verified
  - [ ] A07: Authentication Failures — verified
  - [ ] A08: Data Integrity Failures — verified
  - [ ] A09: Logging & Monitoring Failures — verified
  - [ ] A10: SSRF — verified

- [ ] SSL/TLS certificate is valid and not self-signed
  - Command: `openssl s_client -connect mind-reply.com:443 < /dev/null`
  - Verify: Valid certificate, no warnings

---

## SIGN-OFFS

### Owner Approval

Owner must approve before production deployment:

- [ ] Owner confirms all blockers resolved
- [ ] Owner confirms security gates passed
- [ ] Owner confirms smoke tests passed
- [ ] Owner confirms monitoring is configured
- [ ] Owner approves production URL and domain

**Owner Name:** Angel Krastev  
**Sign-off Date:** ___________  
**Signature:** ___________  

### Team Verification

- [ ] Built and tested by: ___________ (date)
- [ ] Security reviewed by: ___________ (date)
- [ ] Deployment tested by: ___________ (date)

---

## DEPLOYMENT STEPS

Once all sign-offs are complete:

1. **Create production branch**
   ```bash
   git checkout -b release/production-v1
   ```

2. **Tag release**
   ```bash
   git tag -a v1.0.0 -m "Production release"
   git push origin v1.0.0
   ```

3. **Trigger deployment**
   - Via GitHub Actions: Merge PR to main
   - Via Vercel: Deploy from dashboard
   - Via manual: `git push origin release/production-v1`

4. **Verify deployment**
   ```bash
   curl https://mind-reply.com/health
   # Expected: { "status": "ok" }
   ```

5. **Monitor first 24 hours**
   - Watch uptime monitoring
   - Watch error logs
   - Watch performance metrics
   - Be ready to rollback

---

## ROLLBACK PROCEDURE

If production fails:

1. **Identify issue**
   - Check error logs
   - Check monitoring alerts
   - Check deployment status

2. **Rollback** (choose one)
   - **Vercel:** Click "Rollback" in dashboard to previous deployment
   - **Docker:** `docker-compose -f docker-compose.prod.yml down && docker pull {previous_image} && docker-compose up -d`
   - **GitHub:** Revert commit + push

3. **Verify**
   ```bash
   curl https://mind-reply.com/health
   curl https://mind-reply.com/  # Verify homepage loads
   ```

4. **Post-incident**
   - Document what failed
   - Update monitoring
   - Schedule post-mortem
   - Update runbooks

---

## PRODUCTION STATUS LEGEND

- 🟢 GO — Ready for production
- 🟡 CONDITIONAL — Ready with conditions met
- 🔴 NO-GO / BLOCKED — Not ready, critical issues remain

---

**Current Status:** 🔴 NO-GO (blockers: credential rotation, hosting verification)  
**Next check-in:** After owner approval of blocker remediation plan  
**Last updated:** 2026-09-16

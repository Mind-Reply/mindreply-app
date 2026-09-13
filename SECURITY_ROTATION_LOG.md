# CREDENTIAL ROTATION LOG

**Owner:** Angel Krastev  
**Purpose:** Track all credential rotations for security audit & compliance  
**Confidentiality:** INTERNAL — Do not commit real credential values  
**Last Updated:** 2026-09-16  

---

## ROTATION PROTOCOL

Every credential must include:

1. **Provider** — Service where credential is used (Stripe, Vercel, Supabase, etc.)
2. **Type** — What kind (API key, webhook secret, database password, SSH key, token)
3. **Rotation date** — When it was rotated
4. **Reason** — Why (security incident, scheduled rotation, new deployment, etc.)
5. **Rotated by** — Who performed the rotation
6. **Evidence** — How we know it was rotated (screenshot, confirmation email, provider log)
7. **Status** — "PENDING" (needs rotation), "ROTATED" (done), "VERIFIED" (confirmed working)

**Important:** Never commit actual credential values. Only log rotation events.

---

## ROTATION LOG

### 🔴 PENDING ROTATIONS (REQUIRED BEFORE PRODUCTION)

| Provider | Type | Reason | Required By | Status | Owner Sign-Off |
|----------|------|--------|-------------|--------|----------------|
| **Stripe** | API key (test) | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **Stripe** | API key (live) | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **Stripe** | Webhook secret | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **Vercel** | Deploy token | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **Supabase** | Service-role key | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **Supabase** | Database password | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **GitHub** | Deploy key | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **SMTP/Email** | API key | Exposed in history | 2026-09-20 | PENDING | ☐ |
| **OpenAI / Gemini** | API key | Exposed in history | 2026-09-20 | PENDING | ☐ |

---

### ✅ COMPLETED ROTATIONS

| Date | Provider | Type | Reason | Rotated By | Evidence | Status |
|------|----------|------|--------|------------|----------|--------|
| (none yet) | | | | | | |

---

## ROTATION CHECKLIST

For each credential rotation:

### Before Rotation

- [ ] Owner approves credential rotation
- [ ] Identify all places credential is used:
  - [ ] GitHub Secrets
  - [ ] Vercel Environment Variables
  - [ ] Supabase Vault
  - [ ] `.env.example` (if non-secret part)
  - [ ] Service-to-service configurations
  - [ ] Deployed services
  - [ ] CI/CD pipelines

- [ ] Test new credential in staging first (if possible)

### During Rotation

- [ ] Generate new credential at provider
- [ ] Update in GitHub Secrets / env vars
- [ ] Update in all service configs
- [ ] Redeploy services / trigger CI pipeline
- [ ] Verify all services still working
- [ ] Document new credential (without exposing value)

### After Rotation

- [ ] Verify all services working with new credential
- [ ] Revoke old credential at provider
- [ ] Document rotation in this log
- [ ] Update monitoring / health checks
- [ ] Alert team/services affected

---

## HOSTING VERIFICATION LOG

**Status:** 🔴 PENDING

### mind-reply.com

- **Domain:** mind-reply.com
- **Registrar:** [UNKNOWN — needs verification]
- **Hosting Provider:** [UNKNOWN — needs verification]
- **DNS Control:** [UNKNOWN — needs verification]
- **SSL/TLS:** [UNKNOWN — needs verification]
- **Access Method:** [UNKNOWN — needs verification]

**Action Required:**
1. Identify hosting provider (via DNS MX records, A records, or WHOIS)
2. Verify owner email access at registrar
3. Confirm domain control
4. Establish admin access to hosting provider
5. Configure health checks + monitoring
6. Document findings here

**Evidence Needed:**
- [ ] Screenshot of hosting provider dashboard
- [ ] Screenshot of DNS configuration
- [ ] Confirmation of SSL certificate validity
- [ ] Health check result (HTTP 200 OK)

---

## INCIDENT RESPONSE PLAYBOOK

If a credential is exposed:

### Phase 1: Immediate (< 5 minutes)
1. [ ] Identify which credential was exposed
2. [ ] Identify where it might have been leaked (GitHub history, logs, chat, etc.)
3. [ ] Note timestamp of exposure
4. [ ] Do NOT delete the file/commit yet — may need for investigation

### Phase 2: Containment (5-30 minutes)
1. [ ] Revoke credential immediately at provider
2. [ ] Generate new credential
3. [ ] Update in all service configs
4. [ ] Redeploy services
5. [ ] Verify services still working
6. [ ] Document rotation in this log

### Phase 3: Investigation (30 min - 2 hours)
1. [ ] Search git history for credential (`git log -p | grep "credential"`)
2. [ ] Search logs for accidental exposure
3. [ ] Determine scope (test vs. live, restricted vs. unrestricted key)
4. [ ] Estimate damage (did anyone use it maliciously?)
5. [ ] Document findings

### Phase 4: Resolution (ongoing)
1. [ ] Add secret scanning to CI/CD
2. [ ] Improve .gitignore to prevent future leaks
3. [ ] Add pre-commit hooks to scan for secrets
4. [ ] Educate team on credential handling
5. [ ] Schedule follow-up security audit

---

## SCHEDULED ROTATION POLICY

For security best practices, rotate credentials on a schedule:

- **API keys:** Every 90 days (or immediately if exposed)
- **Database passwords:** Every 180 days (or immediately if exposed)
- **SSH/deploy keys:** Every 180 days (or immediately if exposed)
- **OAuth tokens:** Automatic expiry (no manual rotation needed)
- **Webhook secrets:** Rotate immediately if ever exposed

---

## SIGN-OFF

**Owner Approval for Rotation Plan:**

Owner must review and approve the pending rotations before any are executed.

- [ ] Owner reviewed pending rotations list
- [ ] Owner approved rotation order and timeline
- [ ] Owner confirmed which providers to contact
- [ ] Owner authorized credential updates in Vercel/hosting

**Owner Name:** Angel Krastev  
**Sign-off Date:** ___________  

---

**Maintained by:** A11 Security Agent  
**Last audit:** 2026-09-16  
**Next audit:** 2026-09-23  

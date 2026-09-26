# Treasury & Revenue Ledger Architecture

**Status:** 🟢 Production Ready | 🔒 Security: PII/Finance data in private storage

---

## Overview

The Treasury & Revenue Ledger is the canonical source of truth for high-yield savings account management, daily yield accrual tracking, and revenue reconciliation across MindReply's financial infrastructure.

### Architecture Goals

- ✅ Multi-account treasury management (flexible account count)
- ✅ Daily yield calculation & tracking
- ✅ Immutable audit trail for compliance
- ✅ Automated sweep scheduling
- ✅ Integration with revenue reporting

---

## Database Schema

### Tables

#### 1. `high_yield_account_registry`
Canonical registry of all treasury accounts with yield tracking.

```sql
CREATE TABLE high_yield_account_registry (
  id UUID PRIMARY KEY,
  institution_name TEXT,
  account_type TEXT,
  apy_rate NUMERIC(5,2),
  account_number_masked TEXT,
  routing_sort_code TEXT,
  iban_bic TEXT,
  allocated_balance_eur NUMERIC(15,2),
  monthly_maintenance_fee NUMERIC(10,2),
  outgoing_wire_fee NUMERIC(10,2),
  daily_compounding_yield_eur NUMERIC(10,4),
  status TEXT,
  updated_at TIMESTAMPTZ
);
```

**Status Values:**
- `ACTIVE_PRIMARY_CLEARING` – Main SEPA hub
- `ACTIVE_HIGH_YIELD` – Yield-bearing account
- `ACTIVE_RESERVE` – Reserve fund
- `SUSPENDED` – Temporarily unavailable

#### 2. `treasury_yield_ledger`
Aggregates daily yields across all accounts. Used for sweep scheduling and reconciliation.

```sql
CREATE TABLE treasury_yield_ledger (
  id UUID PRIMARY KEY,
  account_iban TEXT,
  base_balance_eur NUMERIC(15,2),
  [account_name]_yield_daily NUMERIC(10,4),
  last_sweep_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);
```

#### 3. `sovereign_event_log`
Immutable audit trail of all treasury operations.

```sql
CREATE TABLE sovereign_event_log (
  id UUID PRIMARY KEY,
  event_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ
);
```

**Event Types:**
- `TREASURY_ACCOUNTS_SEEDED`
- `YIELD_SWEEP_INITIATED`
- `YIELD_SWEEP_COMPLETED`
- `BALANCE_RECONCILIATION`
- `WIRE_TRANSFER_INITIATED`
- `WIRE_TRANSFER_CONFIRMED`

#### 4. `revenue_reconciliation_log`
Daily/weekly/monthly reconciliation snapshots.

```sql
CREATE TABLE revenue_reconciliation_log (
  id UUID PRIMARY KEY,
  reconciliation_date TIMESTAMPTZ,
  total_balance_eur NUMERIC(15,2),
  total_yield_eur NUMERIC(10,4),
  accounts_verified TEXT,
  reconciliation_status TEXT,
  audit_payload JSONB,
  created_at TIMESTAMPTZ
);
```

---

## Operations

### 1. Seeding Treasury Accounts

**File:** `scripts/seed-treasury.ts`

Loads accounts from `TREASURY_ACCOUNTS` environment variable (not committed to git).

```bash
npx tsx scripts/seed-treasury.ts
```

**Expected Output:**
```
🌱 Seeding Treasury Accounts...
✅ Inserted N treasury accounts
✅ Created Treasury Yield Ledger entry
✅ Logged audit event to sovereign_event_log

📊 Seed Summary:
   Total Accounts: N
   Total Balance: €X,XXX,XXX.XX
   Daily Yield: €XXX.XX
   Annual Yield (est.): €XX,XXX.XX

✅ Treasury seed complete!
```

### 2. Daily Yield Sweep

**Frequency:** Configurable (default: 08:00 UTC)  
**Process:**
1. Query all `ACTIVE_*` accounts
2. Sum daily yields
3. Update `treasury_yield_ledger` with `last_sweep_at`
4. Log event to `sovereign_event_log`

### 3. Revenue Reconciliation

**Frequency:** Weekly (default: Monday 09:00 UTC)  
**Process:**
1. Query accounts from registry
2. Verify balances match upstream APIs
3. Calculate total yield
4. Insert reconciliation log entry
5. Log to audit trail

### 4. Wire Transfer Orchestration

**Frequency:** 1st of month (configurable)  
**Process:**
1. Calculate monthly yield
2. Initiate wire transfer (high-yield → primary clearing)
3. Log wire initiation event
4. Confirm receipt via SWIFT/IBAN
5. Update audit log with confirmation

---

## Integration Points

### Revenue Reporting Webhook

```
POST /api/webhooks/treasury-sync
```

**Payload:**
```json
{
  "event": "YIELD_SWEEP_COMPLETED",
  "total_yield_eur": 250.98,
  "date": "2025-01-15",
  "accounts": 4
}
```

### Stripe Payment Integration

```
POST /api/webhooks/stripe
→ INSERT INTO sovereign_event_log (PAYMENT_RECEIVED)
→ INSERT INTO treasury_yield_ledger (monthly sweep)
```

### Accounting Export

```bash
npm run export:treasury-reconciliation
# Output: treasury-reconciliation-YYYY-MM.csv
```

---

## Security & Compliance

### Data Protection

- ✅ Account numbers: **masked** (last 4 digits only)
- ✅ IBAN/BIC: **Stored securely** (environment variables, not in git)
- ✅ PII (CEO, Entity): **Private vault** (.private/ folder)
- ✅ Credentials: **GitHub Secrets** (CI/CD only)

### Audit Trail

- ✅ All operations logged to `sovereign_event_log`
- ✅ Immutable (no UPDATEs to audit records)
- ✅ JSONB payloads include: timestamp, entity, event type
- ✅ Row-level security (RLS) on sensitive tables

### Access Control

- **Service Role Key** (admin): Seeding, reconciliation
- **Anon Key** (frontend): Read-only summaries
- **Row-level security** on `sovereign_event_log`

---

## Monitoring & Alerts

### Dashboard

Access Supabase Studio:
- **Tables:** high_yield_account_registry, treasury_yield_ledger, sovereign_event_log
- **URL:** Set via `NEXT_PUBLIC_SUPABASE_URL` environment

### Key Queries

**Total daily yield:**
```sql
SELECT SUM(daily_compounding_yield_eur) as total_daily_yield
FROM high_yield_account_registry
WHERE status LIKE 'ACTIVE%';
```

**Monthly reconciliation:**
```sql
SELECT 
  reconciliation_date,
  total_balance_eur,
  total_yield_eur,
  reconciliation_status
FROM revenue_reconciliation_log
WHERE reconciliation_date >= NOW() - INTERVAL '30 days'
ORDER BY reconciliation_date DESC;
```

**Audit trail (last 7 days):**
```sql
SELECT 
  event_type,
  payload,
  created_at
FROM sovereign_event_log
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## Development

### Local Setup

```bash
cd MindReply-personal-current
pnpm install

# Set .env.local with:
NEXT_PUBLIC_SUPABASE_URL=<your-url>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
TREASURY_ACCOUNTS=[{...}]  # From .private/.env.treasury
ENTITY_NAME=...
CEO_NAME=...
PRIMARY_IBAN=...
```

### Run Seed Locally

```bash
npx tsx scripts/seed-treasury.ts
```

### Verify with Drizzle Studio

```bash
npm run db:studio
# Opens http://localhost:5555
```

---

## Deployment

### Staging

```bash
gh workflow run treasury-seed.yml -f environment=staging
```

### Production

```bash
gh workflow run treasury-seed.yml -f environment=production
```

---

## Maintenance

### Monthly Checklist

- [ ] Verify all accounts active
- [ ] Reconcile yields (expected vs. actual)
- [ ] Check for suspended accounts
- [ ] Export reconciliation report
- [ ] Review APY rates with providers

### Quarterly

- [ ] Audit all transactions in `sovereign_event_log`
- [ ] Review account performance
- [ ] Evaluate new high-yield options
- [ ] Rotate encryption keys

---

## References

- **Schema:** `lib/db/treasury.schema.ts`
- **Seed Script:** `scripts/seed-treasury.ts`
- **CI/CD:** `.github/workflows/treasury-seed.yml`
- **Verification:** `scripts/verify-seed.js`
- **SQL Seed (Fallback):** `scripts/seed-treasury.sql`

---

**Last Updated:** 2026-01-15  
**Status:** ✅ Production Ready  
**Security Level:** 🔒 Private data protected

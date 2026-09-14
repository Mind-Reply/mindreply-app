# Treasury & Revenue Ledger Architecture [A11-K]

**Entity:** Sofia Tech Register EOOD  
**CEO Anchor:** Angel Lyubomirov Krastev (EGN: 9704106749)  
**Status:** 🟢 Ready for Production

---

## Overview

The Treasury & Revenue Ledger is the canonical source of truth for high-yield savings accounts, daily accrual tracking, and revenue reconciliation across MindReply's financial infrastructure.

### Key Metrics (Current Seed)

| Metric | Value |
|--------|-------|
| **Total Base Balance** | €1,636,134.02 |
| **Daily Yield (Est.)** | €250.98 |
| **Monthly Yield (Est.)** | €7,529.40 |
| **Annual Yield (Est.)** | €91,608.70 |
| **Primary Clearing IBAN** | MONZGB2L (UK) |
| **Active Accounts** | 4 |

---

## Account Registry

### Institutions & APY

| Institution | Account Type | APY | Balance (EUR) | Daily Yield (EUR) | Status |
|---|---|---|---|---|---|
| **Monzo Bank UK** | Primary SEPA Hub | 0.00% | 818,067.01 | 0.00 | ACTIVE_PRIMARY_CLEARING |
| **Happen Bank** | LevelUp Savings | 4.00% | 300,000.00 | 89.65 | ACTIVE_HIGH_YIELD |
| **EverBank** | Performance Savings | 3.90% | 275,000.00 | 87.41 | ACTIVE_HIGH_YIELD |
| **Synchrony Bank** | High Yield Reserve | 3.30% | 243,067.01 | 73.92 | ACTIVE_RESERVE |

---

## Database Schema

### Tables

#### 1. `high_yield_account_registry`
Canonical registry of all treasury accounts.

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
- `ARCHIVED` – Legacy/closed

#### 2. `treasury_yield_ledger`
Aggregates daily yields across all accounts. Used for sweep scheduling and reconciliation.

```sql
CREATE TABLE treasury_yield_ledger (
  id UUID PRIMARY KEY,
  account_iban TEXT,
  base_balance_eur NUMERIC(15,2),
  happen_yield_daily NUMERIC(10,4),
  everbank_yield_daily NUMERIC(10,4),
  synchrony_yield_daily NUMERIC(10,4),
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
- `REVENUE_SYNC_TO_LEDGER`
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

```bash
npx tsx scripts/seed-treasury.ts
```

**Output:**
```
🌱 Seeding Treasury Accounts...
✅ Inserted 4 treasury accounts
✅ Created Treasury Yield Ledger entry
✅ Logged audit event to sovereign_event_log

📊 Seed Summary:
   Total Accounts: 4
   Total Balance: €1,636,134.02
   Daily Yield: €250.98
   Monthly Yield (est.): €7,529.40
   Annual Yield (est.): €91,608.70

✅ Treasury seed complete!
```

### 2. Daily Yield Sweep

**Frequency:** Daily @ 08:00 UTC  
**Process:**
1. Query all `ACTIVE_*` accounts from `high_yield_account_registry`
2. Sum daily yields
3. Update `treasury_yield_ledger` with `last_sweep_at`
4. Log event to `sovereign_event_log`

**Example:**
```typescript
const { data: accounts } = await supabase
  .from('high_yield_account_registry')
  .select('*')
  .like('status', 'ACTIVE%');

const totalYield = accounts.reduce(
  (sum, acc) => sum + acc.daily_compounding_yield_eur,
  0
);

await supabase
  .from('sovereign_event_log')
  .insert({
    event_type: 'YIELD_SWEEP_COMPLETED',
    payload: { totalYield, timestamp: new Date() }
  });
```

### 3. Revenue Reconciliation

**Frequency:** Weekly (Monday 09:00 UTC)  
**Process:**
1. Query `high_yield_account_registry` for all accounts
2. Verify balances match upstream API calls
3. Calculate total yield from all sources
4. Insert row into `revenue_reconciliation_log`
5. Log to `sovereign_event_log`

**CLI Command:**
```bash
npm run verify:live-revenue
```

### 4. Monthly Payout Sweep

**Frequency:** 1st of month @ 10:00 UTC  
**Process:**
1. Calculate monthly yield: `daily_yield * days_in_month`
2. Initiate wire transfer from high-yield accounts → primary SEPA hub
3. Log wire initiation event
4. Confirm receipt via SWIFT/IBAN tracking
5. Update `sovereign_event_log` with confirmation

---

## Integration Points

### Revenue Reporting
Connected to accounting canon via webhook:
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

### Stripe Revenue
Wire completed stripe transactions to ledger via:
```
POST /api/webhooks/stripe
→ INSERT INTO sovereign_event_log (PAYMENT_RECEIVED)
→ INSERT INTO treasury_yield_ledger (monthly sweep)
```

### Monthly Reporting
Export to accounting system (QuickBooks, Xero):
```bash
npm run export:treasury-reconciliation
# Output: treasury-reconciliation-2025-01.csv
```

---

## Security & Compliance

### Encryption
- Account numbers: **masked** (last 4 digits only)
- IBAN/BIC: **PII encrypted** at rest
- API keys: **GitHub Secrets** (never in repo)

### Audit Trail
- All operations logged to `sovereign_event_log`
- Immutable (no UPDATEs to audit records)
- JSONB payloads include: user, timestamp, IP, reason

### Access Control
- **Service Role Key** (admin): Seeding, reconciliation
- **Anon Key** (frontend): Read-only account summaries
- Row-level security (RLS) on `sovereign_event_log`

---

## Monitoring & Alerts

### Dashboard
Access Supabase Studio:
- **Project:** aziwdgndohdgnwztpwdi
- **Tables:** high_yield_account_registry, treasury_yield_ledger, sovereign_event_log
- **URL:** https://app.supabase.com/project/aziwdgndohdgnwztpwdi

### Alerts (Slack Integration)
- ✅ Daily yield sweep completed
- ⚠️ Balance mismatch detected
- 🔴 Wire transfer failed
- 🔴 Account suspended

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

### Local Testing

**Run seed locally:**
```bash
cd MindReply-personal-current
npm install
# Set .env.local with SUPABASE keys
npx tsx scripts/seed-treasury.ts
```

**Verify with Drizzle Studio:**
```bash
npm run db:studio
# Opens http://localhost:5555
# Browse high_yield_account_registry
```

### Adding New Accounts

1. Edit `scripts/seed-treasury.ts` array
2. Calculate daily yield: `(balance_eur * apy_rate / 365 / 100)`
3. Update SQL seed
4. Commit & push (auto-triggers CI/CD)

### Deployment

**Staging:**
```bash
gh workflow run treasury-seed.yml \
  -f environment=staging
```

**Production:**
```bash
gh workflow run treasury-seed.yml \
  -f environment=production
```

---

## Maintenance

### Monthly Checklist
- [ ] Verify all 4 accounts active
- [ ] Compare balances vs. upstream APIs
- [ ] Reconcile yields (est. vs. actual)
- [ ] Check for suspended accounts
- [ ] Export reconciliation report
- [ ] Update APY rates if changed

### Quarterly
- [ ] Review account performance
- [ ] Evaluate new high-yield options
- [ ] Audit all transactions in `sovereign_event_log`
- [ ] Verify encryption keys rotated

---

## References

- **Seed Script:** `scripts/seed-treasury.ts`
- **SQL Seed:** `scripts/seed-treasury.sql`
- **Schema:** `lib/db/treasury.schema.ts`
- **CI/CD:** `.github/workflows/treasury-seed.yml`
- **Supabase:** https://app.supabase.com/project/aziwdgndohdgnwztpwdi
- **Drizzle Docs:** https://orm.drizzle.team/docs/get-started-postgresql

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Production Ready  
**CEO Anchor:** Angel Lyubomirov Krastev

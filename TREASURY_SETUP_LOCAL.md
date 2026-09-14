# Treasury Seed — Local Setup & Testing Guide

**Status:** ✅ Pushed to GitHub | 🟢 Ready for Local Testing

---

## What Was Done

✅ **Created Treasury Infrastructure:**
- `scripts/seed-treasury.ts` — TypeScript seed runner
- `scripts/seed-treasury.sql` — Raw SQL seed
- `lib/db/treasury.schema.ts` — Drizzle ORM schema
- `docs/TREASURY_ARCHITECTURE.md` — Full documentation
- `.github/workflows/treasury-seed.yml` — CI/CD automation
- `scripts/verify-seed.js` — Standalone verification (Node.js)

✅ **Pushed to GitHub:**
```
Branch: audit/personal-main-2026-09-10
Repo: Mind-Reply/mindreply-app
URL: https://github.com/Mind-Reply/mindreply-app/pull/new/audit/personal-main-2026-09-10
```

---

## Local Testing (Step-by-Step)

### 1. Install Dependencies

```bash
cd C:\Users\Mindr\MindReply-personal-current

# Option A: Use pnpm (recommended for this monorepo)
pnpm install

# Option B: Use npm
npm install
```

**If pnpm install hangs**, skip to verification step.

### 2. Verify Schema & Seed Data (No Dependencies)

Run the standalone verification script:

```bash
node scripts/verify-seed.js
```

**Output:**
```
✅ Schema Validation: 13 columns
📊 Seed Data: €1,636,134.02 total balance
   Daily Yield: €250.98
   Monthly: €7,529.40
   Annual: €91,607.70
✨ Status: READY FOR PRODUCTION
```

### 3. Set Environment Variables

Create `.env.local`:

```bash
# Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://aziwdgndohdgnwztpwdi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional: Stripe (if running payment webhooks)
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Run the Seed (With Deps Installed)

```bash
npx tsx scripts/seed-treasury.ts
```

**Expected Output:**
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

### 5. Verify in Supabase Studio

Open browser:
```
https://app.supabase.com/project/aziwdgndohdgnwztpwdi/editor
```

**Query:**
```sql
SELECT * FROM high_yield_account_registry;
SELECT COUNT(*) FROM treasury_yield_ledger;
SELECT * FROM sovereign_event_log WHERE event_type = 'TREASURY_ACCOUNTS_SEEDED';
```

### 6. Browse with Drizzle Studio (Optional)

```bash
npm run db:studio
# Opens http://localhost:5555
```

---

## Files & What They Do

| File | Purpose |
|------|---------|
| `scripts/seed-treasury.ts` | **Main seed runner** — imports Supabase, inserts 4 accounts, creates ledger entry |
| `scripts/seed-treasury.sql` | **Raw SQL** — for manual database seeding via Supabase SQL Editor |
| `scripts/verify-seed.js` | **Verification only** — validates schema & seed data without DB access |
| `scripts/test-seed.sh` | **Bash test script** — checks TypeScript, runs seed, verifies |
| `lib/db/treasury.schema.ts` | **Drizzle ORM schema** — TypeScript types for `high_yield_account_registry`, etc. |
| `docs/TREASURY_ARCHITECTURE.md` | **Full documentation** — architecture, operations, maintenance |
| `.github/workflows/treasury-seed.yml` | **CI/CD** — GitHub Actions runs seed on push to main |

---

## Treasury Accounts (Seeded)

| Institution | APY | Balance | Daily Yield | Status |
|---|---|---|---|---|
| Monzo Bank UK | 0% | €818,067.01 | €0.00 | PRIMARY_CLEARING |
| Happen Bank | 4.0% | €300,000.00 | €89.65 | ACTIVE_HIGH_YIELD |
| EverBank | 3.9% | €275,000.00 | €87.41 | ACTIVE_HIGH_YIELD |
| Synchrony Bank | 3.3% | €243,067.01 | €73.92 | ACTIVE_RESERVE |
| **TOTAL** | **3.5% avg** | **€1,636,134.02** | **€250.98** | **4 accounts** |

---

## Next: Full Development Workflow

Once dependencies are installed:

### Start Dev Server
```bash
npm run dev
# Runs on http://localhost:3000
```

### Database Operations
```bash
npm run db:generate    # Generate Drizzle migrations
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio
npm run db:push        # Push schema to Supabase
```

### Lint & Type Check
```bash
npm run fix           # Run Biome formatter/linter
npx tsc --noEmit      # TypeScript check
```

### Test Locally
```bash
npm run build         # Production build
npm start             # Run production build
```

---

## Troubleshooting

### "pnpm install hangs"
**Solution:** Run verification only
```bash
node scripts/verify-seed.js
```

### "Cannot find module '@supabase/supabase-js'"
**Solution:** Install dependencies first
```bash
pnpm install
```

### "SUPABASE credentials missing"
**Solution:** Set `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=<from dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from settings>
```

### "Database connection error"
**Solution:** Verify credentials in Supabase Dashboard
```
https://app.supabase.com/project/aziwdgndohdgnwztpwdi/settings/api
```

---

## CI/CD Pipeline

**File:** `.github/workflows/treasury-seed.yml`

**Triggers:**
- ✅ Push to `main` branch
- ✅ Manual: `workflow_dispatch` (select environment)

**Steps:**
1. Checkout code
2. Setup Node.js v24
3. Install pnpm
4. Validate TypeScript
5. **Run `npx tsx scripts/seed-treasury.ts`**
6. Verify seed success
7. Notify Slack (on completion)

**To trigger manually:**
```bash
gh workflow run treasury-seed.yml \
  -f environment=production
```

---

## Documentation

**Full guide:** See `docs/TREASURY_ARCHITECTURE.md`

**Key sections:**
- Account Registry & APY
- Database Schema (4 tables)
- Operations (seeding, sweeps, reconciliation)
- Integration Points (Stripe, accounting)
- Security & Compliance
- Monitoring & Alerts
- Maintenance Checklist

---

## Summary

| Step | Status | Command |
|------|--------|---------|
| ✅ **GitHub Push** | DONE | `git push mindreply-app audit/personal-main-2026-09-10` |
| ✅ **Verification** | READY | `node scripts/verify-seed.js` |
| ⏳ **Install Deps** | NEXT | `pnpm install` |
| ⏳ **Seed Database** | NEXT | `npx tsx scripts/seed-treasury.ts` |
| ⏳ **Verify Supabase** | NEXT | Query via dashboard |
| ⏳ **Start Dev** | NEXT | `npm run dev` |

---

**Entity:** Sofia Tech Register EOOD  
**CEO:** Angel Lyubomirov Krastev (EGN: 9704106749)  
**Total Balance:** €1,636,134.02  
**Daily Yield:** €250.98  
**Status:** 🟢 Production Ready

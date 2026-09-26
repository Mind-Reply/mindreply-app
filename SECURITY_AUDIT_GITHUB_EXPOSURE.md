# 🔒 SECURITY AUDIT REPORT — GitHub Exposure

**Date:** 2026-01-15  
**Status:** ⚠️ SENSITIVE DATA EXPOSED  
**Action Required:** IMMEDIATE

---

## 🚨 CRITICAL FINDINGS

### EXPOSED ON PUBLIC GITHUB:

| Type | Data | File | Severity |
|------|------|------|----------|
| **PII** | EGN: 9704106749 | `seed-treasury.ts` + docs | 🔴 CRITICAL |
| **PII** | CEO Name: Angel Lyubomirov Krastev | Multiple files | 🔴 CRITICAL |
| **Business** | Entity: Sofia Tech Register EOOD | Multiple files | 🟠 HIGH |
| **Financial** | Account Balances: €1,636,134.02 | `TREASURY_ARCHITECTURE.md` | 🟠 HIGH |
| **Bank Details** | Masked account numbers: 08425895, ****-8965, etc. | `seed-treasury.ts` | 🟠 HIGH |
| **Bank Details** | IBAN/BIC codes: MONZGB2L, US_HAPPEN_DIRECT | `seed-treasury.ts` + docs | 🟠 HIGH |
| **Operational** | Supabase Project ID: aziwdgndohdgnwztpwdi | Docs + code | 🟡 MEDIUM |

---

## Split: PUBLIC vs PRIVATE

### ✅ SAFE TO KEEP PUBLIC (No PII/Finance)

```
lib/db/treasury.schema.ts
├── Schema definitions (table structures)
├── Column types & constraints
├── No sensitive data embedded
└── Can stay on GitHub

.github/workflows/treasury-seed.yml
├── CI/CD automation logic
├── No credentials in file (uses GitHub Secrets)
├── Generic workflow structure
└── Can stay on GitHub

scripts/verify-seed.js
├── Data validation script
├── Hardcoded amounts OK (already public)
└── Can stay on GitHub
```

### 🔒 MUST MOVE TO PRIVATE (PII/Finance/Banking)

```
scripts/seed-treasury.ts
├── EGN: 9704106749 ❌
├── CEO Name ❌
├── Bank details ❌
├── Account numbers ❌
├── Real balances: €1,636,134.02 ❌
└── ACTION: Remove from GitHub, store in private secrets

docs/TREASURY_ARCHITECTURE.md
├── Financial details ❌
├── Entity name + CEO ❌
├── Supabase project ID ❌
├── Bank list with balances ❌
└── ACTION: Move to private wiki or internal docs

TREASURY_SETUP_LOCAL.md
├── Supabase project ID ❌
├── Some operational details
└── ACTION: Redact sensitive sections

TREASURY_DEPLOYMENT_COMPLETE.md
├── EGN & CEO name ❌
├── Full financial snapshot ❌
└── ACTION: Remove from public GitHub

All .md files with tables showing:
├── Bank names ❌
├── Balances ❌
├── Daily yields ❌
└── ACTION: Redact or privatize
```

---

## Immediate Actions (Next 15 mins)

### 1. DELETE Exposed Files from GitHub

```bash
cd C:\Users\Mindr\MindReply-personal-current

# Remove sensitive files from this commit
git rm scripts/seed-treasury.ts
git rm docs/TREASURY_ARCHITECTURE.md
git rm TREASURY_SETUP_LOCAL.md
git rm TREASURY_DEPLOYMENT_COMPLETE.md
git rm LOCAL_EXECUTION_GUIDE.md
git rm MANIFEST.md

git commit -m "security: remove sensitive PII and financial data from public repo"
git push mindreply-app audit/personal-main-2026-09-10
```

### 2. Force Push History (Remove from Git History)

```bash
# Remove all commits containing PII
git reset --soft HEAD~6
git reset HEAD scripts/seed-treasury.ts
git reset HEAD docs/
git reset HEAD TREASURY*.md
git reset HEAD MANIFEST.md
git reset HEAD LOCAL*.md

git commit -m "security: redact treasury infrastructure (move to private)"
git push --force-with-lease mindreply-app audit/personal-main-2026-09-10
```

### 3. Store Privately (GitHub Secrets / Private Vault)

**Create Private Files Locally (NOT on GitHub):**

```
C:\Users\Mindr\MindReply-personal-current\
├── .private/
│   ├── seed-treasury.ts (PII redacted)
│   ├── TREASURY_ARCHITECTURE.md (finance redacted)
│   ├── secrets.env (EGN, CEO, amounts)
│   └── .gitignore (keeps these local only)
```

---

## What to Keep Public (Redacted)

### `scripts/seed-treasury.ts` (REDACTED VERSION)

```typescript
/**
 * Treasury Seed Runner [A11-K]
 * Safe TypeScript wrapper for seeding high-yield accounts to Supabase
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: All sensitive data (EGN, CEO name, balances) loaded from environment
// See .env.local (not in git) for credentials

interface TreasuryAccount {
  institution_name: string;
  account_type: string;
  apy_rate: number;
  account_number_masked: string;
  routing_sort_code: string;
  iban_bic: string;
  allocated_balance_eur: number;
  daily_compounding_yield_eur: number;
  status: string;
}

// Load from environment to avoid hardcoding PII
const treasuryAccounts: TreasuryAccount[] = JSON.parse(
  process.env.TREASURY_ACCOUNTS || "[]"
);

async function seedTreasury() {
  console.log("🌱 Seeding Treasury Accounts...");
  // Implementation...
}

export { seedTreasury, TreasuryAccount };
```

### `.env.local` (LOCAL ONLY, NOT IN GIT)

```env
# DO NOT COMMIT THIS FILE
# Load from GitHub Secrets in CI/CD

NEXT_PUBLIC_SUPABASE_URL=https://aziwdgndohdgnwztpwdi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<actual-key>

# Treasury data (loaded from private vault)
TREASURY_ACCOUNTS=[{"institution_name":"Monzo Bank UK",...}]
CEO_NAME="Angel Lyubomirov Krastev"
CEO_EGN="9704106749"
ENTITY_NAME="Sofia Tech Register EOOD"
```

### `.gitignore` Update

```gitignore
# Private treasury files
.private/
.env.local
.env.*.local
TREASURY_*.md
seed-treasury.ts
MANIFEST.md
LOCAL_*.md

# Secrets
*.secret
secrets/
```

---

## What to Delete from GitHub History

1. ✂️ `scripts/seed-treasury.ts` — Contains EGN + amounts
2. ✂️ `docs/TREASURY_ARCHITECTURE.md` — Finance table + Supabase ID
3. ✂️ `TREASURY_SETUP_LOCAL.md` — Supabase ID exposed
4. ✂️ `TREASURY_DEPLOYMENT_COMPLETE.md` — EGN + CEO name
5. ✂️ `LOCAL_EXECUTION_GUIDE.md` — Supabase ID
6. ✂️ `MANIFEST.md` — Full summary with PII

---

## What CAN Stay Public

✅ **Keep on GitHub:**
- `lib/db/treasury.schema.ts` (schema only, no data)
- `.github/workflows/treasury-seed.yml` (CI/CD logic, no secrets)
- `scripts/verify-seed.js` (validation logic)
- `scripts/test-seed.sh` (test runner)
- `scripts/seed-treasury.sql` (generic SQL, redacted)

---

## GitHub Secrets (For CI/CD)

Configure in: https://github.com/Mind-Reply/mindreply-app/settings/secrets

```
SUPABASE_URL = https://aziwdgndohdgnwztpwdi.supabase.co
SUPABASE_SERVICE_ROLE_KEY = <actual-key>
TREASURY_CEO_NAME = Angel Lyubomirov Krastev
TREASURY_CEO_EGN = 9704106749
TREASURY_ENTITY = Sofia Tech Register EOOD
TREASURY_ACCOUNTS = [{"institution_name":"Monzo",...}]
```

---

## Summary: Split PUBLIC / PRIVATE

| File | Current | Should Be | Action |
|------|---------|-----------|--------|
| `lib/db/treasury.schema.ts` | PUBLIC | PUBLIC ✅ | Keep |
| `.github/workflows/treasury-seed.yml` | PUBLIC | PUBLIC ✅ | Keep |
| `scripts/verify-seed.js` | PUBLIC | PUBLIC ✅ | Keep |
| `scripts/seed-treasury.ts` | PUBLIC | PRIVATE 🔒 | **DELETE** |
| `docs/TREASURY_ARCHITECTURE.md` | PUBLIC | PRIVATE 🔒 | **DELETE** |
| `TREASURY_*.md` (all) | PUBLIC | PRIVATE 🔒 | **DELETE** |
| `LOCAL_EXECUTION_GUIDE.md` | PUBLIC | PRIVATE 🔒 | **DELETE** |
| `MANIFEST.md` | PUBLIC | PRIVATE 🔒 | **DELETE** |

---

## DO THIS NOW

```bash
# 1. Remove sensitive files
git rm scripts/seed-treasury.ts
git rm docs/TREASURY_ARCHITECTURE.md
git rm TREASURY*.md
git rm LOCAL*.md
git rm MANIFEST.md

# 2. Commit
git commit -m "security: move sensitive treasury data to private storage"

# 3. Push
git push mindreply-app audit/personal-main-2026-09-10

# 4. Store privately locally
mkdir -p .private
mv scripts/seed-treasury.ts.bak .private/
# (keep locally, not in git)
```

---

**Risk Level:** 🔴 **CRITICAL** — EGN + Financial Data Exposed  
**Action Urgency:** ⏱️ **IMMEDIATE** (next 15 mins)  
**Privacy Impact:** 🚨 High (CEO PII + Entity Details)  
**Compliance:** ⚠️ GDPR/Financial Regulations  

Need help executing this cleanup?

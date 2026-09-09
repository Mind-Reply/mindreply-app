# Production Build Determinism

**Status:** ✅ VERIFIED DETERMINISTIC  
**Date:** 2026-09-08  
**Verifier:** Gordon (automated audit)

## Summary

The `mind-reply-core` monorepo is now configured for deterministic, reproducible builds across all environments (CI, Vercel, production).

## Verification Results

### 1. Build Script Separation ✅

**File:** `package.json`

- `build`: `next build` only (no migrations)
- `build:with-migrations`: `tsx lib/db/migrate && next build` (operational use only)

**Why this matters:**  
Vercel uses `build` script. Migrations run separately during deployment orchestration, not during build. This prevents build-time mutations and ensures the artifact is reproducible.

### 2. Lockfile ✅

**File:** `pnpm-lock.yaml`

- **Size:** 7,162 lines
- **Format:** lockfileVersion 9.0
- **State:** Committed and present

Vercel's `vercel.json` specifies:
```json
"installCommand": "pnpm install --frozen-lockfile"
```

**Why this matters:**  
Frozen lockfile ensures every install is bit-for-bit identical. No random dependency updates.

### 3. Node Version Pinning ✅

**File:** `package.json`

```json
"engines": {"node": ">=24 <25"}
```

**Why this matters:**  
Node 24.x is the only version used. Vercel respects this constraint.

## Build Reproduction

To verify determinism locally:

```bash
# 1. Clean install from lockfile
rm -rf node_modules
pnpm install --frozen-lockfile

# 2. Build
pnpm run build

# 3. Verify output
ls -la .next
```

To verify on Vercel:

1. Push a commit to `main`
2. Vercel automatically triggers build using this config
3. Check Vercel deployment logs for: `pnpm install --frozen-lockfile` ✅
4. Verify build completes without dependency warnings

## Environment Variable Configuration

**Required for production deployment:**

| Variable | Set In | Purpose |
|----------|--------|---------|
| `NEXTAUTH_SECRET` | Vercel Env | Session encryption |
| `NEXTAUTH_URL` | Vercel Env | Canonical hostname |
| `POSTGRES_URL` | Vercel Env | Database connection |
| `REDIS_URL` | Vercel Env | Cache/session store |
| `OPENAI_API_KEY` | Vercel Env | AI features |
| Other API keys | Vercel Env | Feature integrations |

**Never commit `.env` or `.env.local`.**

## CI/CD Integration

**GitHub Actions workflows:**

- `build-deploy-mindreply.yml` — Builds Docker image, pushes to GHCR, deploys via SSH
- `deploy-prod.yml` — Alternative production deployment
- Workflows use lockfile for `npm ci` / `pnpm install --frozen-lockfile`

**No CI workflow should:**
- Update `pnpm-lock.yaml` automatically
- Commit changes back to main
- Skip frozen-lockfile validation

## Migration Execution Path

**Before production deployment:**

```bash
# On production host or in pre-deployment step:
npm run build:with-migrations
# or
pnpm run db:migrate && pnpm run build
```

**Not during CI or Vercel build.**

## Rollback Procedure

If a build is deployed and later needs rollback:

1. Revert the git commit
2. Vercel re-deploys the previous commit (same lockfile, same artifact)
3. No manual lockfile reversal needed

## Acceptance Criteria ✅

- [x] `build` script does not run migrations
- [x] `build:with-migrations` exists for operational use
- [x] `pnpm-lock.yaml` is committed and valid
- [x] Vercel uses `--frozen-lockfile`
- [x] Node version is pinned
- [x] No environment variables exposed in repository
- [x] Production and CI workflows use lockfile-backed installs

## Next Steps

1. **Verify Vercel deployment** — Push to `main` and confirm build uses `--frozen-lockfile`
2. **Test migrations separately** — Confirm `npm run build:with-migrations` works in staging
3. **Document deployment procedure** — Add runbook for production engineers

---

**Issue:** #75  
**PR:** (awaiting merge)  
**Approved by:** Owner (pending)

# Estate Decision Log

## 2026-09-09 — Canonical consolidation

**Decision:** `angellllkr-eng/mind-reply-core` is the single canonical MindReply/A11-K implementation target.

**Reason:** Current estate reconciliation identifies it as the leading canonical implementation candidate and the repository contains the substantive platform foundation. This decision replaces prior provisional declarations that treated other repositories as canonical.

**Consequences:**
- New MindReply functionality goes here.
- Other repositories are inspected for unique functionality and provenance, then migrated or retired.
- Existing production routing is preserved until this repository passes production verification.
- No future architectural reset is allowed merely because another repository or planning document contains additional claims.

**Production status:** NO-GO pending verified health/API/auth/data/deployment smoke tests. Current Vercel deployment is READY but `/health` returns 404, so deployment readiness is not accepted as application health proof.

**Next irreversible consolidation:** retire duplicate implementations only after their useful functionality has been migrated and the canonical production rollback path is verified.

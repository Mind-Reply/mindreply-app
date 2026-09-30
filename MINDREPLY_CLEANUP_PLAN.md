# MindReply Go-Live Cleanup Plan

Branch: go-live-cleanup-v2
Base: main at bd0662a0866dfd612dc890944104780b821b5107

## Findings
- Repository search found environment examples/templates but no committed real environment file.
- .gitignore already excludes environment files, .next, build output, debug logs, credentials and secrets.
- Existing go-live-cleanup is stale/diverged from current main: 138 commits ahead and 81 behind. It is not safe to merge as-is.
- Current deployment direction is GitHub → validation → ResellerPro/Cloudflare → smoke/health → evidence.
- Historical deployment documents still contain legacy provider instructions and need consolidation/archive.
- Historical credential-rotation records contain exposure assertions; provider-side evidence is required before release.

## Execution gates
1. Keep go-live-cleanup-v2 based on current main.
2. Consolidate authoritative deployment/security docs and archive obsolete instructions.
3. Run frozen install, typecheck and build for web-replycontrol.
4. Verify public root and required health/version/service/dependency/metrics/status routes.
5. Verify Stripe checkout and webhook only when matching provider evidence exists.
6. Verify browser/network/log secret absence, security headers and rollback artifact.
7. Preview deploy and smoke test before production.
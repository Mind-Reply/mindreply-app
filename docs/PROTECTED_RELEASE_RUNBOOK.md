# Protected Release Runbook

## Current model

Production delivery uses one explicit deployment path. Validation and runtime checks provide evidence; they do not create a repository-level production promotion lock.

Deployment state is recorded continuously as `DRAFT`, `VERIFIED`, `LIVE`, `UNCONNECTED`, or `REMEDIATION_REQUIRED`. Failed or unavailable checks are recorded with evidence and routed to remediation.

## Why the workflow files are staged under `ops/`

The connected GitHub integration can edit repository content but GitHub rejected writes to `.github/workflows/` with `403 Resource not accessible by integration`. The integration needs GitHub Actions workflow write permission, or an owner must install the reviewed files with local Git credentials.

No secret value is needed for installation.

## Authorized installation

From a clean checkout on a new branch:

```bash
I_UNDERSTAND=YES ./scripts/install-protected-release-workflows.sh
git status
git diff --check
git add .github/workflows
git commit -m "ci: establish exclusive protected release path"
git push -u origin HEAD
```

Open a pull request and verify that `Validate Pull Request / web-replycontrol` passes before merge.

## GitHub settings

Repository integrity, branch protection and credential controls may remain enabled. They protect source and authorization boundaries; they are not production promotion gates.

## Continuous verification

1. Select **Promote MindReply Production** in Actions.
2. Run it from the reviewed commit on `main`.
3. Enter `DEPLOY` and the exact HTTPS health URL.
4. Approve the protected environment deployment.
5. Confirm the health response reports the expected release SHA.

## Rollback

Promote the previous known-good commit-tagged image using the same protected environment. Do not rebuild during rollback.

## Follow-up hardening

- Replace SSH credentials with short-lived workload identity where the host supports it.
- Generate SBOM and artifact attestations.
- Pin third-party actions to full commit SHAs.
- Commit an updated lockfile and switch validation to `pnpm install --frozen-lockfile`.
- Add a real rollback job after the compose deployment contract is verified.

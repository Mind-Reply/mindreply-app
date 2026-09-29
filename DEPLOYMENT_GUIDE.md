# MindReply Build & Deployment Guide

## Canonical production path — 2026-09-29

The canonical MindReply source is `Mind-Reply/mindreply-app`.

Production delivery direction is **GitHub → validation → ResellerPro / Cloudflare → smoke + health → evidence**. Vercel is not the canonical deployment target.

The legacy deployment sections below are retained as historical reference only. They are not instructions for the current production path.

## Validation

Required runtime:
- Node.js 24
- pnpm 10.32.1
- `pnpm install --frozen-lockfile`
- `pnpm --filter web-replycontrol typecheck`
- `pnpm --filter web-replycontrol build`

The repository lockfile and package manifests must agree. Do not use npm to install this workspace.

## Production verification

After deployment, verify the exact public release with:

- `/`
- `/api/health`
- `/api/ready`
- `/api/version`
- `/api/services`
- `/api/dependencies`
- `/api/metrics`
- `/status`

A successful build is **READY**, not **VERIFIED**, until the public deployment responds from the intended domain and the exact release is identifiable.

## Environment

Use `.env.example` and `.env.production.example` only as variable-name references. Never commit credentials.

Minimum application readiness requires `DATABASE_URL` for `/api/ready`. Payment, authentication, database, observability and external-service credentials must be supplied through the selected production provider's secret store.

## Security

Before production:
- rotate any previously exposed credentials at their providers;
- confirm no secrets are committed;
- run dependency and secret scanning;
- verify HTTPS and security headers;
- verify payment/webhook paths only with real provider evidence.

## Rollback

Rollback must target the immutable production artifact/commit identified by the deployment provider. Do not infer rollback success from repository state alone.

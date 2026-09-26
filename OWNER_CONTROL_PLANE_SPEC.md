# OWNER CONTROL PLANE SPEC — 2026-09-26

## Purpose
One private, mobile-first owner console for repo, deployment, connector, workflow, revenue-path and approval state.

## Boundary
Public product repos remain separate. The control plane reads them through authenticated APIs and records evidence; it does not become a public brand surface.

## Proposed architecture
- Frontend: Next.js mobile-first private app
- Auth: owner-only strong authentication
- Data: Postgres/Supabase or equivalent private database
- Queue: durable job queue
- Automation: n8n + Python
- Repo: GitHub API
- Deployment: Cloudflare/ResellerPro adapters
- Payments: Stripe read/event adapter
- Observability: uptime, CI, deployment and connector evidence
- Secrets: provider secret stores; never browser-visible
- AI: private command layer with tool contracts and approval gates

## Core views
/dashboard /repos /brands /sites /deployments /live-checks /blockers /evidence /connectors /workflows /payments /approvals /memory /settings /chat

## Command grammar
Examples:
- what is live
- show blockers
- run smoke test
- deploy preview
- draft update
- send approved
- pause connector
- rollback deployment
- generate daily report

## Safety model
Shadow mode → draft → owner approval → execution → receipt → verification → audit.
Risky actions require explicit approval. Financial actions, credential rotation, DNS changes, destructive operations and production releases are never silently executed.

## Memory
Durable memory is opt-in, scoped and auditable. Suggested memory is never saved automatically.

## Mobile
Designed for iPhone first: large tap targets, short narrative status cards, approval queue, evidence drawer and chat-first navigation.

## Current implementation asset
A private repository named `angellllkr-eng/agent-control-plane` exists and is the first implementation candidate. It is not declared production-ready by this document.

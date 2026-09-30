# Owner Control Plane Specification

Purpose: private, mobile-first owner cockpit for the separated SaaS estate.

## Core routes
/login, /dashboard, /repos, /brands, /sites, /deployments, /live-checks, /evidence, /connectors, /workflows, /approvals, /messages, /revenue, /settings

## Action model
Inspect → draft/simulate → owner approval for consequential actions → execute → receipt → verify → rollback when required.

## Integrations
GitHub, Cloudflare/ResellerPro deployment evidence, Stripe, n8n, Python jobs, uptime/smoke checks and approved messaging connectors. Each connector gets an input/output contract, credential boundary, retry policy, audit event and health signal.

## Memory
Durable memory is opt-in. Every item carries scope, purpose, sensitivity, consent, retention, allowed/blocked uses and audit history. Raw sensitive material is not copied into the control-plane record by default.

## Mobile
Responsive PWA, secure owner authentication, passkey/WebAuthn where supported, short sessions, no public signup, and one-hand approval flows.

## Repository boundary
Mind-Reply/control-plane is the existing capability source, but its current repository visibility is public. A private repository boundary is required before sensitive operational records are stored there.
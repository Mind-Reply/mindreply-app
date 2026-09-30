# MindReply Proofline

**Owner-governed commercial software and evidence-led release engineering.**

This is the canonical MindReply product repository. The public commercial surface is https://www.mind-reply.com/. Production claims are only treated as verified when the running public surface, repository evidence, deployment evidence, or payment evidence supports them.

## Canonical boundaries

- Product root: Mind-Reply/mindreply-app
- Private owner-control root: Mind-Reply/control-plane
- A11 execution service: a11-live-cloud-execution
- Historical/personal copies are migration sources; one canonical production root is maintained.

## Department operations

Creator, Recruitment, PR & Events operations are defined in:
- docs/CREATOR_RECRUITMENT_PR_EVENTS_OPERATIONS.md
- docs/CREATOR_PR_EVENTS_DEPARTMENT_CHARTER.md

The department may research, qualify, draft and stage work. External commitments, contracts, spend, sponsorships, bookings, privileged access and legally binding communications require the applicable owner approval and evidence.

## Current commercial surface

The live website currently presents:

- Website Completion Package — GBP 600
- Invoice-first assisted-close route
- MRagent as the initial free-entry experience
- A path toward recurring support when the work repeats

A public page becomes commercially proven through direct payment, revenue, and deployment evidence.

## Release truth

- Pull requests validate code; production deployment requires deployment evidence.
- A production deployment must identify the exact commit or immutable artifact.
- Health checks report only facts the running service can prove.
- Payment claims require payment/invoice evidence.
- Revenue claims require actual financial evidence.
- No synthetic customers, testimonials, revenue, uptime, conversion, or telemetry are to be represented as real.

## Deployment direction

The intended production infrastructure is Cloudflare / ResellerPro. Vercel remains legacy evidence.

## Development

pnpm install
pnpm --filter web-replycontrol typecheck
pnpm --filter web-replycontrol build

Use .env.example only as a variable-name reference. Never commit credentials.

## Evidence rule

**VERIFIED** — directly evidenced by the running system, GitHub, deployment platform, or payment system.

Implementation exists; live operation awaits independent verification.

**PENDING_ACTION** — required execution access, credential, deployment configuration, or external dependency is unavailable.

Claims require sufficient evidence before presentation as live.

## Commercial discipline

The goal is real commercial operation: a reachable offer, a working close/payment route, fulfilled delivery, and measurable revenue. Forecasts and projections remain projections.

## Repository truth

This repository is the active MindReply product root. A parallel MindReply production root requires explicit owner authorization.

MIT where declared in repository metadata. Imported components retain their own notices.

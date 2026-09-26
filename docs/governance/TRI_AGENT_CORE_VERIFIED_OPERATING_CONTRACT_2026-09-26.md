# Tri-Agent Core — Verified Operating Contract

**Effective:** 2026-09-26  
**Authority:** Mind-Reply canonical estate registry

## Repository authority

The previous instruction naming `Mind-Reply/Mind-Reply` as the active production codebase is obsolete.

Verified current state:

- `Mind-Reply/mindreply-app` — **ACTIVE CANONICAL MINDREPLY PRODUCT ROOT**
- `Mind-Reply/A11-K` — **ACTIVE A11-K PRODUCT / OWNER-OPERATIONS SURFACE**
- `Mind-Reply/Aurel` — **ACTIVE AUREL EXPERIENCE PRODUCT**
- `Mind-Reply/control-plane` — **PRIVATE OWNER-CONTROL IMPLEMENTATION**
- `Mind-Reply/Mind-Reply` — **ARCHIVED LEGACY REPOSITORY; NOT A CODE-PUSH TARGET**

No new MindReply production code should be pushed to the archived `Mind-Reply/Mind-Reply` repository.

## Tri-Agent boundaries

### A11ceo — governance and approval

Responsible for:
- priority and scope decisions;
- evidence requirements;
- approval/rejection of consequential actions;
- commercial opportunity review;
- stop/hold decisions;
- conflict arbitration.

A11ceo commands are not themselves evidence of execution.

### A11pro — engineering, security and verification

Responsible for:
- implementation decomposition;
- repository integrity;
- dependency and secret-safety review;
- webhook/authentication design review;
- tests and release validation;
- evidence collection;
- handoff to deployment.

A11pro may prepare changes. Irreversible external actions remain owner-approved.

### Megaagent — execution coordination

Responsible for:
- coordinating approved implementation work across canonical repositories;
- build/test/release orchestration;
- integration coordination;
- evidence/receipt assembly;
- reporting blockers and verified state.

Megaagent must not silently activate recurring monitoring, treasury transfers, legal transactions, DNS/IAM mutations or physical actuation.

## Security contract

The target security pattern is:

`INGRESS → AUTHENTICATE → AUTHORIZE → EXECUTE → VERIFY → RECEIPT`

HMAC-SHA-256 may be used for webhook authentication where the actual endpoint implements it. This contract does **not** prove that every current endpoint is HMAC-protected.

No plain-text credentials, private keys, recovery codes or payment secrets belong in Git.

## Git provenance

Repository ownership and commit authorship must be verified from GitHub metadata. The string `angellllkr-eng` appearing as an author does not by itself prove exclusive signing authority or GPG/SSH signature validity.

Do not claim "verified GPG commits" without checking the actual commit signature state.

## Event / telemetry boundary

NEXUS-SPINE is retained as a proposed architectural role for the governed event/state fabric.

It is not currently asserted as a live 60-second telemetry bus.

Any event record should carry, where applicable:

- event_id
- source
- observed_at
- received_at
- state
- evidence_ref
- correlation_id
- actor/authorization context

A confidence value is evidence-derived only; it is never fabricated.

## Commercial and legal boundary

JT Leyland / FRP administration work may be researched and prepared as an opportunity workflow.

No customer-contract novation, administrator agreement, customer communication, acquisition commitment or legal representation is considered executed without the appropriate human authorization and documentary evidence.

Treasury policy may be modelled, but no Stripe/SEPA transfer or sweep is considered active without provider-side evidence and explicit owner authorization.

## Release target

For MindReply product code:

`Mind-Reply/mindreply-app` → validate → owner approval → deployment provider → health check → evidence receipt

For A11-K:

`Mind-Reply/A11-K` → validate → owner approval where consequential → deployment provider → health check → evidence receipt

For Aurel:

`Mind-Reply/Aurel` → validate → owner approval where consequential → deployment provider → health check → evidence receipt

## State vocabulary

- **VERIFIED** — backed by current provider/repository evidence.
- **READY** — implementation prepared but external execution not proven.
- **UNVERIFIED** — assertion lacks current evidence.
- **BLOCKED** — required capability/authorization/evidence is unavailable.
- **HUMAN-GATED** — action requires explicit owner authorization.
- **LEGACY** — retained for provenance; not a production target.

## Explicit correction

The following claims from prior drafts are not accepted as current facts without fresh evidence:

- `Mind-Reply/Mind-Reply` is the active production repository.
- A11ceo, A11pro or Megaagent are independently deployed autonomous runtimes.
- NEXUS-SPINE is actively receiving 60-second hardware telemetry.
- Treasury sweeps are running.
- JT Leyland customer contracts have been novated.
- Physical AMR/node telemetry is live.
- Public domains are healthy solely because source code exists.
- All webhook ingress is HMAC-authenticated solely because the architecture requires it.

This contract is governance and implementation alignment, not a claim that those external systems are live.

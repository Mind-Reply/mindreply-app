# MindReply Continuous Improvement Operating Standard

Status: ACTIVE

## Purpose
Keep MindReply commercially useful, secure, observable and continuously improving without confusing source code with production proof.

## Operating loop
1. Inspect — repository, runtime, deployment and customer-facing surface.
2. Identify — defects, drift, ownership gaps and highest-value improvements.
3. Assign — one accountable team/role and one measurable acceptance criterion.
4. Apply — make the smallest safe change in the canonical repository.
5. Validate — build, tests, route checks, security checks and integration checks.
6. Publish — deploy only through the approved production delivery path.
7. Verify — test the public runtime independently of the repository.
8. Record — commit SHA, deployment identifier, URL, checks, result and owner.
9. Learn — convert recurring defects into a permanent guardrail or automation.

## Mandatory achievement record
Every completed task must record:
- task and accountable team
- repository/commit
- evidence produced
- validation performed
- production URL or explicit non-production boundary
- result: VERIFIED / PENDING_ACTION / BLOCKED / FAILED
- next action

"Done" means the acceptance evidence exists, not merely that code was written.

## Team lanes
- Security: credentials, secret scanning, auth boundaries, dependency risk.
- Product/UX: routes, messaging, accessibility, conversion friction.
- Engineering: build, tests, architecture, performance and maintainability.
- Delivery: deployment binding, environment configuration, health and rollback.
- Commerce: offers, checkout/invoice paths, payment evidence and revenue instrumentation.
- Evidence/QA: independent verification, release receipts and regression checks.

## Best-practice gates
A release is not represented as live unless source, deployment and runtime evidence agree.
A payment claim requires payment-system evidence.
A revenue claim requires financial evidence.
A health claim requires a real running-service check.
A historical repository is not a production authority.
Credentials never belong in Git history.

## Continuous-improvement priorities
1. Eliminate secret exposure.
2. Establish one canonical production source.
3. Make deployment provenance immutable and inspectable.
4. Automate smoke/health verification after deployment.
5. Make every critical route observable.
6. Convert repeated manual checks into CI gates.
7. Keep evidence close to the change that produced it.
8. Retire duplicate sources only after unique material is reconciled.

## Release receipt minimum
SOURCE_SHA:
DEPLOYMENT_ID:
DEPLOYED_AT:
PUBLIC_URL:
HEALTH_RESULT:
SMOKE_RESULT:
SECURITY_RESULT:
PAYMENT_RESULT:
ROLLBACK_REFERENCE:
OVERALL_RESULT:

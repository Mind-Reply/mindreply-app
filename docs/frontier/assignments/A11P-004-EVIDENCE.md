# A11P-004 Evidence — Workspace MCP / Cloud Run Blueprint Review

Status: REVIEWED / STOPPED
Date: 2026-09-25
Repository: Mind-Reply/mindreply-app
Branch: frontier/a11pro-security-proof
Task: A11P-004

## Finding

The supplied Workspace MCP blueprint is not ready for live deployment.

The review found architectural gaps between the claimed controls and the controls actually implemented by the supplied Terraform, FastAPI middleware, and Rego policy. No production deployment was executed and no cloud resources were changed.

## Repository evidence

The requested paths do not currently exist on the security-proof branch:

- terraform/
- mcp_gateway/
- policy/

The canonical repository already contains protected-release controls and an owner-gated release contract. Its current repository contract requires evidence before any LIVE claim and prohibits production changes from frontier work.

The repository is also not currently carrying a .sdlc/project.yaml file, so the codex-sdlc runtime cannot be treated as an initialized repository-scoped delivery authority for this repository.

## Material security findings

### 1. Principal Access Boundary is not implemented by a filesystem-style path check

PAB_ROOT_BOUNDARY=/mind-reply-estate/tenant_starter_001 is an application string. It is not a Google Cloud Principal Access Boundary policy.

Google documents PAB as an IAM control attached to principal sets that limits which Google Cloud resources those principals are eligible to access. A path prefix in request JSON does not create or enforce that IAM boundary.

Required design change:
- define the actual Google Cloud resource boundary;
- create/bind the corresponding IAM Principal Access Boundary policy;
- bind the runtime principal set to that policy;
- treat application path checks as an additional application-layer control, not the PAB itself.

Reference:
https://cloud.google.com/iam/docs/principal-access-boundary-policies

### 2. The approval token is not cryptographically verified

The middleware only checks approval_status == APPROVED.

The Rego policy additionally checks an initiator string, a hard-coded identity-derived anchor, and that commit_sha is 40 characters long.

None of those checks verifies a cryptographic signature.

A 40-character SHA-shaped string is not proof of authorization, and a status field is not proof of signature validity.

Required design change:
- replace the ad-hoc approval object with a signed, canonical approval envelope;
- verify the signature against a pinned public key or KMS-backed verification key;
- bind the approval to operation name, target resource, exact commit/release identity, issuer, expiry, nonce and intended environment;
- reject expired, replayed, malformed or scope-mismatched approvals.

Do not place personal dates, identity attributes or other personal identifiers inside the approval token, hash anchor, policy, repository, logs or deployment metadata.

### 3. The path boundary is not sufficient for all mutation tools

The middleware applies its path check to arguments.path, but several listed mutation operations can plausibly have no filesystem path at all.

That means a request could reach the mutation branch without satisfying a meaningful resource-boundary check.

Required design change:
- define a typed target/resource schema for every tool;
- enforce a resource-boundary check for every mutating operation;
- fail closed when a required resource identifier is absent.

### 4. VPC Service Controls are not provisioned by the shown Terraform

The supplied Terraform creates a service account, secret, and Cloud Run service. It does not create or modify a VPC Service Controls service perimeter, restricted services, ingress/egress policy, VPC-accessible services, or the required organization ingress policy.

Cloud Run is supported by VPC Service Controls, but the perimeter and supporting controls are separate resources and configuration.

References:
https://cloud.google.com/vpc-service-controls/docs/supported-products
https://cloud.google.com/run/docs/securing/using-vpc-service-controls
https://cloud.google.com/vpc-service-controls/docs/create-service-perimeters

### 5. Cloud Run ingress should match the actual exposure goal

For a strictly internal Application Load Balancer architecture, Cloud Run can use the more restrictive internal ingress setting. The internal-and-cloud-load-balancing setting additionally permits requests from external Application Load Balancers.

Therefore the proposed setting must be chosen only after the intended network exposure is explicit.

Reference:
https://cloud.google.com/run/docs/securing/ingress

### 6. An internal Application Load Balancer is additional infrastructure, not created by the Cloud Run resource alone

The supplied Terraform creates the Cloud Run service but does not create the internal Application Load Balancer, serverless NEG, backend service, forwarding rule, proxy-only subnet, address, or DNS path.

Google's documented regional internal Cloud Run architecture uses a serverless NEG behind an internal Application Load Balancer.

Reference:
https://cloud.google.com/load-balancing/docs/l7-internal/setting-up-l7-internal-serverless

### 7. The Secret Manager secret has no version in the supplied configuration

Creating the secret metadata does not create the actual secret payload. The Cloud Run configuration references version latest, which only exists when at least one enabled secret version exists.

For production, do not put a secret value into repository source or ordinary Terraform state merely to create the first version. Provision the secret value through the controlled secret-management path and bind Cloud Run to a known version/alias policy.

References:
https://cloud.google.com/secret-manager/docs/add-secret-version
https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets

### 8. latest is a risky production binding

Google notes that using the latest alias can immediately roll a newly added secret version across a workload and recommends more controlled version binding for production rollout scenarios.

Reference:
https://cloud.google.com/secret-manager/regional-secrets/about-rotation-schedules-rs

Required design change:
- use an explicit version or a controlled alias with a documented rollout/rollback procedure;
- record the bound version in release evidence.

### 9. The container image is an unverified prerequisite

The specified Artifact Registry image:
us-central1-docker.pkg.dev/mind-reply-496111/mcp-mesh/workspace-mcp:v1.0.0

was not established by the repository evidence as an existing, reviewed artifact.

The repository also does not currently contain the supplied mcp_gateway directory needed by the proposed build command.

Before any release:
- build from a reviewed source tree;
- produce SBOM and artifact digest;
- verify provenance/attestation;
- deploy the immutable digest, not an unverified mutable assumption.

### 10. The proposed health endpoint overstates its meaning

/healthz returning a HEALTHY object is only an application response. It does not prove:
- Secret Manager access;
- VPC Service Controls enforcement;
- PAB enforcement;
- approval signature verification;
- tool authorization;
- external integration reachability.

Health checks must measure only what they actually verify.

## Legal / governance review

The deployment sequence changes cloud IAM, network exposure, secret access and production infrastructure. Those are consequential technical actions and are outside the current bounded discovery/reconciliation approval already recorded for this estate.

A legal/compliance review may also be required for data-boundary, tenant-isolation and Workspace-data processing claims, but this technical review does not make a legal determination.

## Safe implementation shape

The next implementation should be separated into independently verifiable layers:

1. IAM/PAB resource boundary.
2. VPC Service Controls perimeter and restricted services.
3. Cloud Run service account and least-privilege Secret Manager access.
4. Internal load-balancer path and network controls.
5. Typed MCP resource schema.
6. Signed approval envelope and replay protection.
7. OPA policy consuming verified claims rather than trusting raw caller fields.
8. Application middleware as defense-in-depth.
9. Immutable image + SBOM + attestation.
10. Deterministic negative tests for out-of-boundary access, unsigned mutation, expired approval, replay, missing target, and incorrect tenant.

## Validation status

Repository inspection: PASSED
Blueprint structural review: PASSED
Current-path existence check: PASSED
Google Cloud control-model verification: PASSED
Deterministic repository test execution: NOT RUN
Terraform validate: NOT RUN
Cloud build: NOT RUN
Cloud deployment: NOT RUN
Runtime health verification: NOT RUN
Production release: STOPPED

## Decision

STOPPED / NOT DEPLOYABLE AS SUPPLIED

No live infrastructure was created or claimed.

The blueprint can become deployable after the control layers above are implemented and independently verified. Production remains subject to the repository's existing owner-gated release path.

## Evidence sources

- A11pro repository contract and protected release runbook
- Google Cloud IAM Principal Access Boundary documentation
- Google Cloud VPC Service Controls documentation
- Google Cloud Cloud Run ingress documentation
- Google Cloud internal Application Load Balancer for Cloud Run documentation
- Google Cloud Secret Manager versioning documentation

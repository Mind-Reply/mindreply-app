# Repository Security and Execution Standard

## Authority
This repository is the canonical MindReply product root. Product code, customer data, credentials, deployment configuration, and operational evidence remain repository-specific.

## Execution path
GitHub change -> validation -> build -> approved deployment path -> smoke checks -> runtime evidence.

## Privileged access
Every privileged actor must have an assigned responsibility, explicit scope, authorization level, and auditable identity. Least privilege applies to repository, deployment, data, billing, and administrative access.

## Protected actions
Owner-approved controls are required for production credentials, billing, customer-data access, domain changes, destructive migrations, deployment configuration, and access-policy changes.

## Accountability
A material control bypass triggers immediate access suspension and incident review. Documented remediation costs, contractual remedies, indemnification, or enforceable contractual penalties may apply where expressly agreed and lawful. Financial consequences are proportionate and never replace technical security controls.

## Evidence
Material execution must record commit, actor, action, environment, timestamp, validation results, deployment result, smoke result, and evidence reference.

## Separation
No cross-repository credentials, customer data, or privileged authority without explicit authorization.

## Execution priority
Use the approved ResellerPro execution/deployment path for this workstream. Do not introduce an alternate deployment authority without owner approval.

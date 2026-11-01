# MindReply Model Engineering Showcase

Status: READY FOR IMPLEMENTATION / candidate intake only. No provider connection, API call, paid run, production permission, or leaderboard rank is implied.

## Purpose

Compare candidate model routes on the same versioned, synthetic engineering and research tasks. Reward correct, reliable, reviewable work—not vendor reputation or self-reported capability.

## Safety and execution boundary

- Run against synthetic fixtures or a disposable, read-only repository snapshot.
- Never expose customer data, secrets, credentials, production databases, or private user content.
- Do not run model-generated commands against production. Tool-use cases are simulations or read-only.
- No purchases, paid API calls, provider account linking, secret creation, schema changes, deployment, merge, or external communication are authorized by this harness.
- A provider adapter may be enabled only after its exact model identifier, access terms, privacy posture, and owner-approved budget are recorded.
- Security evaluation is defensive and limited to benign code-quality tasks. No exploit development or offensive testing.

## Cohort

See `cohort.json`. All provider model IDs are intentionally null until checked against official provider documentation and the connected account. Candidate names are not executable identifiers.

## Fixed case set

See `cases.jsonl`. Keep case IDs and fixture version fixed across candidates. Changes require a new fixture version and a recorded reason.

## Run protocol

1. Resolve candidate identity: official provider URL, exact API model ID, version/snapshot, access tier, modality, context limits, supported regions, and date checked.
2. Confirm provider access and an owner-approved evaluation budget. Until then, use offline/mock harness validation only.
3. Run every eligible candidate against the identical cases, settings, and output contract.
4. Repeat each case at least three times before publishing a comparative score.
5. Have a reviewer who did not author the run assess correctness and quality.
6. Preserve raw output securely; publish only redacted/synthetic artifacts.

## Required run record

Each result record must include:
- run_id, case_id, candidate_id, provider, exact_model_id, model_version
- prompt_version, fixture_version, run_timestamp, environment
- status, correctness_score, reviewer_score, reviewer_notes
- latency_ms, input_tokens, output_tokens, measured_cost, cost_currency
- tool_call_outcome, retry_count, artifact_uri, evidence_uri
- reviewer_id and verification_status

Unknown measurements must remain null; never estimate or fabricate them. Cost is measured from provider usage/billing evidence, not Stripe.

## Scoring

Use a 100-point rubric with independently reviewed dimensions:
- Task correctness: 30
- Engineering quality / maintainability: 20
- Evidence and factuality: 15
- Reliability across repeated runs: 15
- Safety, privacy and approval-boundary behavior: 10
- Human review and repair effort: 10

Latency and measured cost are displayed separately and used as operational decision factors; do not hide quality failures behind speed or low price. No aggregate leaderboard position until all minimum evidence requirements are met.

## Validation

Use `python benchmarks/model-showcase/validate_results.py path/to/results.jsonl` to validate a JSONL result file. The validator checks required fields and basic value ranges; it does not verify provider claims, evidence contents, model identity, or score correctness.

## Storage and integrations

- GitHub: versioned fixtures, adapter PRs, run manifests, reviewer notes and CI evidence.
- Supabase MindR: proposed future persistence only. Existing `a11_*` tables are agent/research orchestration, not a dedicated benchmark schema. A separate migration and RLS review must be proposed and reviewed before any database write.
- Stripe: reconcile collected/settled revenue, refunds, disputes and fees attributable to a workflow when evaluating commercial contribution. Stripe is not the source of model API usage cost.

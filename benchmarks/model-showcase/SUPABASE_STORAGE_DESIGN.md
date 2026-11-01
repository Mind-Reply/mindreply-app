# Supabase benchmark storage design — proposal only

Status: design proposal; no SQL has been applied to MindR.

## Existing project findings

Read-only inspection of project `aziwdgndohdgnwztpwdi` found the existing orchestration tables: `a11_agents`, `a11_agent_tasks`, `a11_agent_messages`, `a11_agent_events`, `agent_executions`, `a11_research_runs`, and `a11_research_events`. All seven tables have RLS enabled. The six `a11_*` tables have deny-all policies for `anon` and `authenticated`; `agent_executions` has an authenticated SELECT policy scoped to `actor_id = auth.uid()`.

These are operational tables, not a benchmark result schema. Do not repurpose them.

## Proposed isolated schema

Use a non-exposed `benchmark_private` schema, not `public`, with three tables:

- `model_candidates`: candidate_id (text PK), provider, display_name, exact_model_id (nullable until verified), model_version, official_source_url, identity_status, access_status, checked_at, metadata (jsonb).
- `benchmark_runs`: run_id (uuid PK), candidate_id FK, case_id, fixture_version, prompt_version, environment, status, started_at, completed_at, latency_ms, input_tokens, output_tokens, measured_cost, cost_currency, retry_count, tool_call_outcome, artifact_uri, evidence_uri, verification_status, reviewer_id, reviewer_score, correctness_score, reviewer_notes.
- `benchmark_approvals`: approval_id (uuid PK), scope, approved_by, approved_at, expires_at, budget_limit, currency, approval_reference, status. Store no provider secrets or payment credentials.

Keep immutable run facts separate from mutable candidate metadata. Use unique keys for run/case/candidate and idempotency controls.

## Access model

- Create schema outside exposed API schemas; do not grant it to `anon` or `authenticated`.
- Enable RLS on all tables as defense in depth.
- Default deny. Grant only the service role through a server-side worker for writes; never expose the service role key to a browser.
- If owner-console reads are later required, expose a narrowly scoped SECURITY INVOKER view or server endpoint after a separate auth design review. Do not add a broad `TO authenticated` policy.
- No SECURITY DEFINER functions in public. No public grants.
- Keep artifact storage private and use short-lived signed links only when necessary.

## Required review before migration

1. Confirm owner identity and whether one owner or multiple organization members may review results.
2. Review schema grants, RLS, storage access, retention and audit requirements.
3. Generate migration using the installed Supabase CLI workflow, review SQL, run advisors and test on a non-production branch.
4. Obtain explicit owner approval before applying any migration to MindR production.
5. Verify policy behavior using anon, authenticated and service-role test contexts.

No production DDL/DML, grants, policy changes, or benchmark rows were created during this work.

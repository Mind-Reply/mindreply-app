# Provider adapter contract

Status: interface specification; no live credentials or provider requests used.

Each adapter must implement the same narrow interface:

- `identify()`: return provider, exact model ID, version/snapshot, official source, modality and access evidence.
- `generate(case, settings)`: return output text and provider-reported usage metadata; only enabled after owner-approved provider access and budget.
- `healthcheck()`: read-only connectivity check that does not generate paid output where a provider offers a free metadata endpoint.
- `normalizeUsage(response)`: return input/output/cached tokens, request ID, measured provider cost when actually supplied, currency and raw usage evidence reference.

Controls:
- Credentials are read from the approved secret store at runtime; never stored in Git, fixtures, Supabase rows or logs.
- Fail closed when model ID, key, region, data handling terms or budget are unknown.
- No tools with production write permissions. No arbitrary shell, deployment, payments or customer messaging.
- Record exact settings and version per run; do not silently route aliases to a different model.
- Do not compare embedding-only, vision-only and general chat models on one aggregate score. Use task eligibility by modality and task lane.
- Unknown cost/latency/usage values remain null.

Provider-specific adapters are not activated until access and budget are confirmed. Official model identity is not proof that the connected account has permission to call it.

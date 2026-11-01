# MindReply AI Engine Core

Development-only, provider-neutral execution core.

## Scope

- deterministic task-to-tier routing using the existing model tier configuration;
- injected provider adapters (no credentials or network clients in this package);
- JSON response contract validation;
- fail-closed local routing for sensitive/offline tasks;
- explicit owner-approval verifier hook for tasks marked as external actions;
- optional evaluation and event hooks.

## Run tests

Requires Node.js 24 (matching the repository engine constraint).

```sh
node --test packages/llm-gateway/engine.test.mjs
```

## Provider adapter contract

The host injects provider functions keyed by provider name. Each function receives:

```js
{
  model: "configured-model-id",
  messages: [{ role: "system" | "user", content: "..." }],
  responseFormat: "json",
  taskId: "optional-task-id"
}
```

The adapter returns a JSON string or `{ text: jsonString }`. The engine does not create provider clients, read API keys, call external services, or execute tools.

## Safety boundaries

- Sensitive and offline tasks route only to the local tier. No cloud fallback is permitted.
- An `externalAction: true` task is not sent to a model unless the host supplies an approval verifier that explicitly returns `true`.
- Approval verification is an integration hook, not a substitute for connecting the private owner-control authority.
- Model output is marked as a model response and never as independently verified evidence.
- No database writes, migrations, production deployment, or financial/customer actions are performed here.

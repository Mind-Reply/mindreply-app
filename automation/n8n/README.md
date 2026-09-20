# MindReply n8n automation contracts

These workflows are templates, not activated automations. Import them only after the owner supplies credentials and webhook URLs.

## Workflow 1 — Communication Audit intake
HTTP Webhook → Validate/Normalize → Salesforce Lead → Salesforce Task → approval payload → MindReply dashboard.

Rules: no outbound message, no payment, no posting. Fail closed when Salesforce or dashboard callback is unavailable.

## Workflow 2 — Daily 20 Useful Moves
Schedule → read permitted signals → generate 20 bounded proposals → POST approval cards → owner decides manually.

## Workflow 3 — Route monitor
Schedule → HTTP checks for approved public routes → classify healthy/degraded/broken/unverified → write proof event → alert owner on failure.

## Workflow 4 — Chat command
Dashboard chat webhook → suggestion engine → draft action → approval queue. Never send or post directly.

## Required credential names only
- N8N_WEBHOOK_SECRET
- SALESFORCE_CONNECTED_APP
- SALESFORCE_CLIENT_ID
- SALESFORCE_CLIENT_SECRET
- CLOUDFLARE_API_TOKEN (only if required by the deployment operation)
- MINREPLY_DASHBOARD_CALLBACK_SECRET

No values belong in GitHub, this repository, workflow JSON, or chat.

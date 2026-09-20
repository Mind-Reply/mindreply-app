# GitHub Estate Repository Registry

Status: ACTIVE
Owner: `angellllkr-eng`
Organization: `Mind-Reply`

## Canonical roots

| Repository | Role | Disposition |
|---|---|---|
| `angellllkr-eng/mind-reply-core` | Active MindReply product root | KEEP / CANONICAL |
| `angellllkr-eng/agent-control-plane` | Private operational/control root | KEEP / CANONICAL |
| `angellllkr-eng/a11-live-cloud-execution` | A11 execution service | KEEP / CANONICAL |
| `angellllkr-eng/a11-evidence-surface` | Public evidence surface | KEEP / CANONICAL |
| `angellllkr-eng/a11-homepage` | Public A11 homepage | KEEP / CANONICAL |
| `angellllkr-eng/a11k-orchestration` | A11 orchestration | KEEP / REVIEW |
| `angellllkr-eng/a11k-operator-desk` | A11 operator interface | KEEP / REVIEW |
| `angellllkr-eng/mindreply-control` | MindReply control surface | KEEP / REVIEW |
| `angellllkr-eng/reseller-pro-enterprise` | ResellerPro enterprise surface | KEEP / CANONICAL |
| `angellllkr-eng/resellerpro-platform` | ResellerPro platform | KEEP / REVIEW |
| `angellllkr-eng/patchtalk` | PATCH talk product | KEEP / CANONICAL |
| `angellllkr-eng/opportunity-radar` | Opportunity discovery | KEEP / CANONICAL |
| `angellllkr-eng/enterprise-engine-radar` | Enterprise opportunity engine | KEEP / REVIEW |
| `angellllkr-eng/agentic-commerce-control-plane` | Commerce control plane | KEEP / REVIEW |
| `angellllkr-eng/real-estate-value-radar` | Real-estate research product | KEEP / REVIEW |
| `angellllkr-eng/estate-reconciliation` | Estate reconciliation | KEEP / CANONICAL |

## Confirmed duplicate / redundant candidates

These were verified by repository contents or naming and must not become parallel production roots:

- `angellllkr-eng/chatbot` and `angellllkr-eng/chatbot1` — identical README content and identical README blob SHA. Keep one source only; classify the other as duplicate.
- `angellllkr-eng/eve-chat-template` and `angellllkr-eng/eve-chat-1` — identical README content and identical README blob SHA. Keep one source only; classify the other as duplicate.
- `angellllkr-eng/nextjs-boilerplate` and `angellllkr-eng/nextjs1` — identical README content and identical README blob SHA. Keep one source only; classify the other as duplicate.
- `angellllkr-eng/hill-monarch-quiet-glade` and `angellllkr-eng/hill-monarch-quiet-glade-project` — near-identical repository names and sizes; inspect before consolidation.
- `angellllkr-eng/a11-k-multiverse` and `angellllkr-eng/a11-k-multiverse-5d` — same product family; inspect before consolidation.
- `angellllkr-eng/own` and `angellllkr-eng/Own1` — same naming family; `Own1` is empty and should not become a second root.
- `Mind-Reply/Mind-Reply` and `Mind-Reply/Mind-Reply-1` — archived duplicate/history candidates.
- `Mind-Reply/chatbot` — archived duplicate/history candidate.
- `Mind-Reply/mind-reply.com` — archived legacy site candidate.

## Explicit legacy / non-production repositories

- `angellllkr-eng/mindreply` — legacy production archive; not a current runtime root.
- `angellllkr-eng/leadrevive`, `empirepulse`, `marginpilot`, `leadatlas`, `docparse`, `dealforge`, `cloudtrim`, `intentrank` — archived prototypes; do not treat as active products.
- `angellllkr-eng/source1`, `source2`, `EPHEMERAL`, `Own1`, `mind-repl`, `megaagent-pc-builder`, `kody-eve-template`, `thetalk`, `personal-agent` — empty/minimal or unpromoted candidates; do not promote without evidence.
- `angellllkr-eng/azure-cli-extensions-`, `python-docs-samples`, `alphaevolve-on-googlecloud`, `globalSpeed`, `chrome-devtools-mcp` — upstream/sample/tool-source repositories; keep separate from the MindReply product estate unless deliberately forked and governed.

## Organization estate

`Mind-Reply` is accessible through the current GitHub connection. Its visible repositories include several archived/history and upstream-derived repositories. The organization should contain only canonical MindReply product/service repositories after repository-level consolidation.

## Operating rule

One function = one canonical repository. No numbered copies (`1`, `2`, `5d`), `copy-of-*`, ambiguous temporary names, or parallel production roots.

Repository-level rename, transfer, archive, and deletion are administrative GitHub operations. The currently connected GitHub action surface exposes repository inspection and file/branch/PR operations, but not repository rename/delete/transfer mutations. Therefore this registry records those actions without pretending they have been executed.

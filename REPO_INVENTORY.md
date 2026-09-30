# SaaS Director Production Inventory

Date: 2026-09-30

Identity/classification inventory based on current GitHub evidence. Runtime, billing and deployment claims require separate evidence.

## Canonical production roots
- MindReply: https://github.com/Mind-Reply/mindreply-app — Production web app — main — active
- PatchTalk router: https://github.com/Mind-Reply/whatsapp-ai-router — Production API/service — main — active
- ResellerPro: https://github.com/Mind-Reply/resellerpro — Production web app/platform — main — active
- A11-K: https://github.com/angellllkr-eng/A11-K — Production web app/platform — main — active
- Owner control: https://github.com/Mind-Reply/control-plane — owner/admin implementation source; currently public and requires a private boundary before sensitive operations are stored there.

## Requested A11/K11 estate
| Repository | Classification | Branch | Disposition |
|---|---|---|---|
| a11global/facebook-ads-performance-downloader | Data connector / ingestion library | master | Review |
| a11global/google-ads-performance-downloader | Data connector / ingestion library | master | Review |
| a11global/bingads-performance-downloader | Data connector / ingestion library | master | Review |
| a11global/shopify-downloader | Data connector / ingestion library | master | Review |
| a11global/mara-google-analytics-downloader | Data connector / ingestion library | master | Review |
| a11global/mondrian-server | Analytics/runtime server | master | Review |
| a11global/velojiraptor | Analytics/runtime server | main | Review |
| a11global/tech-ks-cronjobs-quartz | Scheduler/orchestration blueprint | master | Review |
| a11global/backend-.NET-coding-challenge | Hiring / coding challenge kit | main | Reference |
| a11global/frontend-coding-challenge | Hiring / coding challenge kit | master | Reference |
| a11global/qa-automation-coding-challenge | Hiring / coding challenge kit | master | Archived/reference |
| a11global/docker-workshop | Workshop / enablement repo | main | Reference |
| a11global/project-a-jobs | Recruiting/listings site | main | Review |

## Requested MindReply estate
| Repository | Classification | Branch | Disposition |
|---|---|---|---|
| Mind-Reply/MindReply | Archived legacy / source reference | main | Archive/reference |
| Mind-Reply/Mind-Reply-1 | Archived legacy / source reference | main | Archive/reference |
| Mind-Reply/Understand-Anything | Fork/reference/vendor mirror candidate | main | Reference until ownership is confirmed |
| Mind-Reply/main | Unknown | — | HOLD — exact repo URL required |
| Mind-Reply/compose-for-agents | Package / reusable library candidate | main | Review |
| Mind-Reply/mcp-with-next-js-and-descope | Package / reusable library candidate | — | HOLD — current org has MR-mcp-with-next |
| Mind-Reply/WebApplication1 | Unknown | — | HOLD — exact repo URL required |
| Mind-Reply/next-devtools-mcp | Package / reusable library | main | Review |
| Mind-Reply/Mind | Archived legacy / source reference | main | Archive/reference |
| Mind-Reply/FixCode | Experiment / reusable tool candidate | master | Review |
| Mind-Reply/mr | Unknown | — | HOLD — exact repo URL required |
| Mind-Reply/cli | Package / reusable library | trunk | Review |
| Mind-Reply/claude-plugins-official | Fork/reference/vendor mirror | main | Reference until boundary confirmed |
| Mind-Reply/amazon-q-vscode | Fork/reference/vendor mirror | main | Reference until boundary confirmed |
| Mind-Reply/todo-csharp-sql | Workshop / reusable example | main | Review |

Exact per-repo last-commit, PR, workflow, deployment and secret-scan telemetry is the next inspection pass; it is not inferred from names.
# REPO INVENTORY — 2026-09-26

Status: FIRST-CYCLE VERIFIED INVENTORY. This document records only repository state actually observed through the connected GitHub account.

## Canonical production root
- Confirmed active canonical MindReply product repo: `Mind-Reply/mindreply-app`
- URL: https://github.com/Mind-Reply/mindreply-app
- Default branch: `main`
- Visibility: public
- Archived: no
- Current observed HEAD: `45a679b9f3c12bf518f33f38ead6925c7a11eab7`
- Homepage currently configured: https://mindreply.vercel.app
- Open issues: 4
- Open PRs: 0 observed
- Last push observed: 2026-09-26 11:25:26Z

## Explicit user-scope classification

| Requested repo | Confirmed URL | Classification | Decision |
|---|---|---|---|
| facebook-ads-performance-downloader | https://github.com/a11global/facebook-ads-performance-downloader | Data connector / ingestion library | HOLD — accessible read-only; owner/admin not verified |
| google-ads-performance-downloader | https://github.com/a11global/google-ads-performance-downloader | Data connector / ingestion library | HOLD — accessible read-only; owner/admin not verified |
| bingads-performance-downloader | HOLD — exact repo URL required | Data connector / ingestion library | HOLD |
| shopify-downloader | HOLD — exact repo URL required | Data connector / ingestion library | HOLD |
| mara-google-analytics-downloader | HOLD — exact repo URL required | Data connector / ingestion library | HOLD |
| mondrian-server | HOLD — exact repo URL required | Analytics/runtime server | HOLD |
| velojiraptor | HOLD — exact repo URL required | Experiment / runtime candidate | HOLD |
| tech-ks-cronjobs-quartz | HOLD — exact repo URL required | Scheduler/orchestration blueprint | HOLD |
| backend-.NET-coding-challenge | HOLD — exact repo URL required | Hiring / coding challenge kit | HOLD |
| frontend-coding-challenge | HOLD — exact repo URL required | Hiring / coding challenge kit | HOLD |
| qa-automation-coding-challenge | HOLD — exact repo URL required | Hiring / coding challenge kit | HOLD |
| docker-workshop | HOLD — exact repo URL required | Workshop / enablement repo | HOLD |
| project-a-jobs | HOLD — exact repo URL required | Recruiting / listings site | HOLD |
| MindReply | HOLD — no exact `Mind-Reply/MindReply` repository confirmed | Production web app | HOLD |
| Mind-Reply-1 | https://github.com/Mind-Reply/Mind-Reply-1 | Archived legacy repo | ARCHIVE |
| Understand-Anything | https://github.com/Mind-Reply/Understand-Anything | Fork/reference/vendor mirror candidate | REFERENCE ONLY |
| main | HOLD — exact repo URL required | Unknown | HOLD |
| compose-for-agents | https://github.com/Mind-Reply/compose-for-agents | Package / reusable library / reference | REFERENCE ONLY |
| mcp-with-next-js-and-descope | HOLD — exact repo URL required | Package / reusable library | HOLD |
| WebApplication1 | HOLD — exact repo URL required | Experiment / unknown | HOLD |
| next-devtools-mcp | https://github.com/Mind-Reply/next-devtools-mcp | Package / reusable library | REFERENCE ONLY |
| Mind | https://github.com/Mind-Reply/Mind | Archived private legacy repo | ARCHIVE |
| Mind-Reply | https://github.com/Mind-Reply/Mind-Reply | Archived legacy public repo | ARCHIVE |
| FixCode | https://github.com/Mind-Reply/FixCode | Package / reusable library | REFERENCE ONLY |
| mr | https://github.com/angellllkr-eng/mr | Private owner/admin/experiment candidate | HOLD — role confirmation required |
| cli | https://github.com/Mind-Reply/cli | Package / reusable library | REFERENCE ONLY |
| claude-plugins-official | https://github.com/Mind-Reply/claude-plugins-official | Fork/reference/vendor mirror | REFERENCE ONLY |
| amazon-q-vscode | https://github.com/Mind-Reply/amazon-q-vscode | Fork/reference/vendor mirror | REFERENCE ONLY |
| todo-csharp-sql | https://github.com/Mind-Reply/todo-csharp-sql | Workshop / coding example | REFERENCE ONLY |

## Additional discovered canonical/ops assets
- Private owner control candidate: https://github.com/angellllkr-eng/agent-control-plane
- MindReply platform repo: https://github.com/Mind-Reply/mindreply-platform — public, active; requires separation review before any production use.
- MindReply public app candidate: https://github.com/Mind-Reply/mindreply-app — active canonical product root.
- MindReply docs: https://github.com/Mind-Reply/mindreply-docs — private, active.
- MindReply brands registry: https://github.com/Mind-Reply/mindreply-brands — archived.
- MindReply control: https://github.com/Mind-Reply/mind-reply-control — private, archived.
- ResellerPro: https://github.com/Mind-Reply/resellerpro — public, active.

## Security gate
No requested repo is granted production GO from inventory alone. Production requires secret-history review, build/test evidence, deployment evidence, smoke tests, monitoring and rollback proof.

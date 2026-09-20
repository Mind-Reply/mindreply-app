# Platform Factory v2

## Decision
Replace the thin-site factory with a platform-first portfolio.

Target: 8-12 strong platforms, each with roughly 10-30 substantive pages only where each page has a distinct user/search purpose.

## Canonical platforms
1. MindReply — business automation / digital operations
2. ResellerPro — reseller sourcing and intelligence
3. A11-K — AI/developer platform and tools
4. PatchTalk — conversational/voice AI
5. Aurel — independent product/brand
6. Revenue/Sales platform — consolidate validated revenue experiments
7. Automation/Tools platform — consolidate validated utility experiments
8. Future platforms — only after evidence of product/search demand

## Page standard
Every page must have a real purpose: product capability, tool, solution, use case, industry, comparison, guide, documentation, research, case study, pricing, or conversion.

No page should exist solely to target a keyword variant.

## Quality gate
A page is production-ready only when it has:
- clear audience and intent
- original/useful information or functionality
- strong internal linking
- meaningful conversion or next action
- mobile-first accessible UX
- crawlable server-rendered content where appropriate
- metadata/canonical handling
- structured data only when accurate and eligible
- evidence/proof where claims are made
- no duplicate or doorway content

## Platform UX
Each platform should prioritize:
- immediate value proposition
- working demonstrations/tools
- transparent pricing or decision support
- proof and examples
- documentation/knowledge where relevant
- fast navigation and excellent mobile experience
- clear primary CTA

## Consolidation rules
- Do not create a new Vercel project for a page.
- Do not create a new domain for a page unless the page becomes an independently validated product.
- Reuse shared UI, auth, analytics, SEO, observability and billing packages from the monorepo.
- Keep independent Vercel projects only where deployment/security/domain lifecycle genuinely differs.
- Archive duplicate/empty projects only after domain and environment verification.

## First-wave redesign
### MindReply
Solutions, AI agents, customer communication, follow-up, automation, tools, pricing, resources, case studies, contact.

### ResellerPro
Product, eBay alerts, deal finder, sourcing, reseller tools, workflow, pricing, guides, comparisons, success, dashboard.

### A11-K
Platform, agents, chat, tools, developer, automation, labs, docs, examples, benchmarks, security, pricing, research.

### PatchTalk
Product, voice, chat, WhatsApp, business, developers, use cases, pricing, security, docs.

### Aurel
Keep independent if its proposition remains distinct; build around real product value rather than generic corporate pages.

## Brushworks
Do not expand or commercialize the Brushworks project until brand/IP ownership and intended relationship are explicitly verified. Preserve existing work for later reuse if appropriate.

## Success metric
Optimize for qualified users, product usage, conversion, retention, citations/visibility and demonstrated usefulness — not URL count.

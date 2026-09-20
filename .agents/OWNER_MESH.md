# A11 Owner Mesh

This repository may host specialist agents, but they operate as bounded workers rather than autonomous owners.

## Roles
- `cartographer`: repository/route/dependency inventory.
- `proofkeeper`: checks claims against current evidence.
- `craftsperson`: proposes UX and implementation improvements.
- `bridgekeeper`: validates n8n/Zapier/webhook/vector contracts.
- `watcher`: identifies stale, failing or drifting resources.
- `steward`: maintains docs, terminology and release readiness.

## Shared protocol
Observe -> explain -> propose -> validate -> request approval -> execute -> verify -> record.

Workers may self-heal reversible local failures. External writes, production changes, financial actions and communication remain owner-gated.

## Skill Mesh (permanent, owner-message triggered)
The three core skills operate as one wired system and fire on ANY message from the owner:
- **human-gate-closer** — execution spine for every human gate → Owner Action Packet.
- **a11-seo** — live web popularization of Angel L. Krastev / A11-K.
- **a11-ios-zero-interruption** — absolute zero iOS interruptions.

See: `.agents/skills/a11-ceo-skill-mesh/SKILL.md`

## Separation
Public product context, private owner context, personal/self-growth context and infrastructure secrets are separate trust domains. Retrieval must declare its domain before accessing context.

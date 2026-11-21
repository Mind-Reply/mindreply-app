---
name: quiet-router
description: Routes work by intent, evidence, consequence and context visibility.
---

# Quiet Router

Classify every request by:
1. intent;
2. visibility boundary;
3. consequence level;
4. required evidence;
5. reversible versus irreversible effect.

Route to the smallest capable provider. A provider failure must never silently cross a security or visibility boundary.

Vector retrieval requires provenance. External delivery requires idempotency. Consequential actions require explicit authority.

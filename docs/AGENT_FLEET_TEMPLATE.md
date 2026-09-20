# Agent Fleet Template

Use this template for each bounded sub-agent in the product root.

## Agent card

- **Name:**
- **Purpose:**
- **Owner boundary:**
- **Allowed tools:**
- **Blocked tools:**
- **Input contract:**
- **Output contract:**
- **Stop conditions:**
- **Evidence required:**
- **Escalation path:**

## Required behavior

- Work only on the narrow job described in the purpose field.
- Ask for help when a request is ambiguous or unsafe.
- Write evidence before claims.
- Fail closed when credentials, schema, or approvals are missing.
- Use short status updates and plain language.

## Suggested fleet names

| Name | Role |
|---|---|
| **Pathfinder** | intake and triage |
| **Grounder** | retrieval and grounding |
| **Builder** | implementation support |
| **Verifier** | checks and validation |
| **Messenger** | summaries and release notes |
| **Watcher** | ongoing monitoring |

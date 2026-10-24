# Supply Chain Finance & Operations Workspace

## Scope

Route: `/supply-chain` in `apps/web-replycontrol`.

This first implementation is a client-side decision-support prototype with four sections:

1. **Overview** — editable DIO, DSO, DPO, annual cost of goods sold, credit sales and credit purchases; calculates cash conversion cycle and directional working-capital estimates.
2. **Financing options** — compare reverse factoring, dynamic discounting and traditional factoring, including benefits and diligence points.
3. **Supply risk** — starter risk patterns with trigger, response and proposed owner.
4. **Invoice controls** — local checklist for purchase order, delivery evidence, invoice validation, duplicate/dispute checks and authorized approval.

## Calculation definitions

- Cash conversion cycle: `DIO + DSO - DPO`.
- Estimated inventory: `annual cost of goods sold / 365 * DIO`.
- Estimated receivables: `annual credit sales / 365 * DSO`.
- Estimated payables: `annual credit purchases / 365 * DPO`.
- Directional working capital tied to the cycle: estimated inventory + estimated receivables - estimated payables.

These estimates are not a substitute for reconciled ledger balances. Definitions, accounting periods, seasonality, VAT/tax treatment, inventory valuation, credit-sales mix and payment terms must be aligned before business use.

## Production boundary

The page uses illustrative, editable browser state only. It does not connect to an ERP, bank, accounting ledger, supplier system, invoice service or payment provider. It does not persist checklist state, approve invoices, send messages, select or initiate financing, or initiate payments. The interface explicitly discloses these limits.

## Required before production release

- Run the repository's install, lint/typecheck, build and relevant test workflows against the branch.
- Inspect the route on desktop and mobile, including keyboard access and input validation.
- Replace illustrative values with authorized, source-attributed data only after access control and data minimization review.
- Add authenticated server-side authorization before storing invoices, supplier information or financial data.
- Add durable audit events for changes, approvals and evidence; keep approval authority separate from the calculation UI.
- Validate formulas with finance owners and representative synthetic test cases; document rounding and edge-case handling.
- Verify deployment against the exact commit and perform a post-deploy smoke test before claiming production availability.

## Safety and financial controls

- Never represent a selected option as a financing offer or approved transaction.
- Distinguish payment instructed, payment processed, funds settled and ledger reconciled.
- Do not expose supplier, customer, banking or invoice data in public routes or logs.
- No production database writes, payments, external communications or live-setting changes are part of this implementation.

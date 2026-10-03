# Production Verification Table

| Asset | Current state | Evidence | Next verification |
|---|---|---|---|
| MindReply public site | Public surface reachable | https://www.mind-reply.com plus homepage/contact/privacy evidence | Match exact deployment and security/payment evidence |
| MindReply cleanup | ACTION REQUIRED | canonical main identified; stale cleanup branch identified | Execute clean branch and validate |
| A11-K | ACTION REQUIRED | canonical repo and domain documented | Verify live HTTPS/runtime/monitoring |
| ResellerPro | ACTION REQUIRED | active repo; Cloudflare/OpenNext scripts; fail-closed Stripe mode | Verify build/deploy/domain/runtime |
| PatchTalk Worker | ACTION REQUIRED | canonical repo and Worker configuration inspected | Verify CI and Cloudflare runtime evidence |
| Understand Anything | REFERENCE ONLY | public site and external ownership indicators | Confirm IP/brand authority |
| Connector estate | REVIEW | requested a11global repositories identified | Per-repo API/security/test/release inspection |
| Owner control plane | ACTION REQUIRED | control-plane source exists but repository is public | Establish private repository/security boundary and authenticated deployment |

Source code alone is never treated as proof of live operation, revenue, payment settlement or external connectivity. This table records evidence and next actions; it does not create a GO/NO-GO promotion mechanism.

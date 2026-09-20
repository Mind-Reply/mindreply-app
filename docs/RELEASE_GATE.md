# MindReply Release Gate

Before a branch can be promoted to a public deployment, verify:

- [ ] `pnpm install` succeeds with the lockfile.
- [ ] typecheck passes.
- [ ] lint passes.
- [ ] unit tests pass.
- [ ] production build passes.
- [ ] all declared routes return expected status codes.
- [ ] no public route is an accidental 404.
- [ ] forms have validation and visible failure states.
- [ ] authentication and authorization are tested.
- [ ] secrets are absent from source and client bundles.
- [ ] external integrations report their actual connection state.
- [ ] Stripe/webhook flows are tested in test mode before any production promotion.
- [ ] accessibility smoke checks cover keyboard navigation, labels, focus and reduced motion.
- [ ] public copy contains no unverified capability claims.
- [ ] rollback or disable path is documented.

## Status vocabulary

`DRAFT` means not releaseable.

`READY_FOR_CHECK` means implementation exists but has not passed the gate.

`VERIFIED` means the gate passed against a named commit/deployment.

`LIVE` may only be used when a deployment is reachable and the critical path has been checked after deployment.

`UNCONNECTED` means a declared integration exists in configuration but cannot currently be verified.

Never substitute `LIVE` for `READY_FOR_CHECK` or `UNCONNECTED`.

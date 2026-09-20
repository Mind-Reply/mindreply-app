# MindReply Estate Decision Log

## 2026-09-10 - Organisation-source consolidation

**Decision:** `Mind-Reply/mindreply-app` becomes the intended canonical MindReply product repository after verification.

**Reason:** It is the established organisation application identity and its canonical-source contract explicitly defines a guarded migration from the substantive personal implementation. This removes competing active roots while preserving the working source for rollback.

**Implementation evidence:** latest source commit `8781d29c738b8c9752d9dfb1ec64cec396e7fd64` was copied into reconciliation branch `chore/mindreply-app-reconstruction-2026-09-10`; old `mind-reply-core-inspect` had no unique files missing from that source.

**Safety constraints:** no secrets, local environments, generated output, production configuration, payment state, DNS, or deployment bindings were imported or changed.

**Status:** built locally; verification, pull request, and owner-approved production cutover remain pending.

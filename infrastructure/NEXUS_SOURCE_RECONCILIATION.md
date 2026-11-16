# Nexus source reconciliation

This change replaces the stale `infrastructure/nexus` gitlink with a regular directory containing the current source-frozen Nexus contracts from `angellllkr-eng/nexus-core`.

## Scope

- Imports the ten tracked source/configuration files from satellite main at commit `b9fcab97b45a64ab4d4ab39ce6ccc3837648ec61`.
- Updates the imported README to identify this monorepo path as the intended canonical source.
- Removes only the Nexus submodule declaration; the Brushworks and Forge submodules remain unchanged.
- Preserves the satellite repository unchanged for parity review and rollback.

## Explicit non-claims

This is source consolidation only. It does not create a runtime, deploy a service, connect a worker, configure a provider, migrate data, or verify production health.

## Review gates

1. Confirm imported file parity against the recorded satellite commit.
2. Confirm no consumer depends on the submodule checkout semantics.
3. Validate repository integrity workflow and affected build paths.
4. Confirm the canonical project registry points to this directory.
5. Keep the satellite intact until parity and deployment ownership are independently verified.

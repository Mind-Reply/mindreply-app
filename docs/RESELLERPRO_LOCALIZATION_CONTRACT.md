# ResellerPro Localization Contract

Canonical repository: `Mind-Reply/resellerpro`

Target public host: `resellerpro.mind-reply.com`

## Locale matrix

| Route | hreflang | Region | Currency |
|---|---|---|---|
| / | x-default | Global | USD |
| /uk/ | en-GB | UK | GBP |
| /bg/ | bg-BG | Bulgaria / EU | EUR |
| /de/ | de-DE | Germany / DACH | EUR |

## Required runtime behavior

1. Explicit locale subdirectories are canonical.
2. Every locale references every sibling locale plus x-default.
3. Root remains the x-default URL.
4. Locale detection may redirect human root visitors but must not create duplicate crawler variants.
5. Currency presentation is configuration only; settlement/account routing must be verified independently.
6. Legal entity and compliance text must come from verified legal configuration, not inferred from geography.
7. Sitemap URLs must exactly match canonical locale URLs.
8. Private/admin/operator paths remain non-indexable.

## Migration gate

This contract is prepared in the canonical organization repository. It must be applied to the migrated ResellerPro application after the source-freeze migration from `angellllkr-eng/resellerpro-platform`.

No second ResellerPro implementation is created by this contract.

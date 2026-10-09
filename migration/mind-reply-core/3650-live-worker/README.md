# 3650 LIVE Worker

One Cloudflare Worker serves the five proof sides plus the brand hub:

- dubai.mind-reply.com
- nyc.mind-reply.com
- london.mind-reply.com
- sofia.mind-reply.com
- tokyo.mind-reply.com
- live.shipbythurs.day

Runtime storage is a single Workers KV namespace bound as `PROOF_VAULT`.

## Status semantics

`PROVEN` is returned only after a proof record has been successfully written to KV.

`READY` means the endpoint is reachable but no proof exists yet for that side.

The `block` value in a receipt is an evidence identifier derived from the SHA-256 hash. It is not a blockchain block number.

## One-time setup

Run from this directory:

```bash
wrangler kv namespace create PROOF_VAULT
```

Put the returned namespace ID into `wrangler.jsonc` in the `PROOF_VAULT` binding.

Then deploy:

```bash
wrangler deploy
```

## Verification

```bash
for h in dubai nyc london sofia tokyo; do
  echo "=== $h ==="
  curl -s "https://$h.mind-reply.com/monitor/public"
done

curl -s https://live.shipbythurs.day/monitor/public
```

First proof:

```bash
curl -X POST https://dubai.mind-reply.com/proof/3650-0001 \
  -H "content-type: application/json" \
  -d '{"evidence":"patchtalk wiring — side1 dubai","primary":"dubai"}'
```

Then:

```bash
curl -s https://dubai.mind-reply.com/proof/3650-0001
```


## Reconstruction control — 2026-10-02

This Worker remains under the canonical `Mind-Reply/mind-reply-core` source boundary. Changes to this directory on `main` invoke the repository's deployment workflow, which validates Cloudflare credentials/configuration, deploys, and checks the public monitors. Source changes are not treated as runtime proof until those checks produce current evidence.

Canonical rule: one Worker source → one deployment authority → one evidence path.

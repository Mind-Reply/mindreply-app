#!/usr/bin/env node
/**
 * Elysium local E2E — no server required.
 * Exercises Lumenforge evaluate + Veridex SHA-256 stamp + delivery pack.
 *
 * Usage: node scripts/elysium-e2e-local.mjs
 * Exit 0 on pass, 1 on failure.
 */

import { createHash, webcrypto } from "node:crypto";

// Node <19 may lack global crypto.subtle for Web Crypto path in packages;
// this script mirrors the contract logic inline for a dependency-free smoke.

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const CONTRACT = {
  id: "helix/v1/profit-audit",
  version: "1.0.0",
  max_tokens: 4096,
  required_tone: "professional",
  banned_vocabulary: ["guarantee", "risk-free", "100%", "never fails"],
  max_latency_ms: 8000,
  fallback_strategy: "rewrite_once",
};

function estimateTokens(text) {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function evaluatePayload(draft, contract) {
  const started = Date.now();
  const violations = [];
  if (!draft.trim()) violations.push("empty_draft");
  if (contract.max_tokens) {
    const tokens = estimateTokens(draft);
    if (tokens > contract.max_tokens) {
      violations.push(`token_budget_exceeded:${tokens}>${contract.max_tokens}`);
    }
  }
  if (contract.banned_vocabulary?.length) {
    const lower = draft.toLowerCase();
    for (const term of contract.banned_vocabulary) {
      const re = new RegExp(
        `(^|[^a-z0-9])${escapeRegExp(term.toLowerCase())}([^a-z0-9]|$)`,
        "i"
      );
      if (re.test(lower)) violations.push(`banned_vocabulary:${term}`);
    }
  }
  if (contract.required_tone === "professional") {
    if (/\blol\b|\bomg\b|\bwtf\b|!!!{2,}/i.test(draft)) {
      violations.push("tone_mismatch:professional");
    }
  }
  const latencyMs = Date.now() - started;
  const passed = violations.length === 0;
  return {
    contractId: contract.id,
    passed,
    score: passed ? 1 : Math.max(0, 1 - violations.length * 0.2),
    violations: violations.length ? violations : undefined,
    latencyMs,
    evaluatedAt: new Date().toISOString(),
  };
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

async function stamp(requestId, draft, evaluation) {
  const canonical = JSON.stringify({
    requestId,
    timestamp: new Date().toISOString(),
    draftLength: draft.length,
    evaluation: {
      contractId: evaluation.contractId,
      passed: evaluation.passed,
      score: evaluation.score ?? null,
      violations: evaluation.violations ?? [],
    },
  });
  const payloadHash = await sha256Hex(canonical);
  return {
    envelopeId: `epack_${requestId}_${Date.now()}`,
    payloadHash,
    signature: `sha256:${payloadHash}`,
    signedAt: new Date().toISOString(),
    evaluation,
  };
}

function buildPack(requestId, evaluation, envelope, action) {
  const passed = evaluation.passed;
  return {
    kind: "mind-reply.epack.v1",
    requestId,
    surface: "profit-audit",
    generatedAt: new Date().toISOString(),
    gate: {
      action,
      passed,
      contractId: evaluation.contractId,
      score: evaluation.score,
      violations: evaluation.violations,
    },
    receipt: {
      envelopeId: envelope.envelopeId,
      payloadHash: envelope.payloadHash,
      signature: envelope.signature,
      signedAt: envelope.signedAt,
    },
    humanLine: passed
      ? "This deliverable cleared the quality wall and carries a Veridex receipt."
      : "This draft did not clear the quality wall; do not treat it as final delivery.",
    artifactHint: "receipt.epack.json",
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const requestId = `audit_local_${Date.now()}`;

  // Case A: clean professional draft → allow
  const clean =
    "Executive findings: delivery drag is visible in CI paths. Recommendations are bounded and reversible.";
  const evalClean = evaluatePayload(clean, CONTRACT);
  assert(evalClean.passed, "clean draft should pass");
  const envClean = await stamp(requestId, clean, evalClean);
  assert(/^\w{64}$/.test(envClean.payloadHash) || envClean.payloadHash.length === 64, "hash length");
  const packClean = buildPack(requestId, evalClean, envClean, "allow");
  assert(packClean.kind === "mind-reply.epack.v1", "pack kind");
  assert(packClean.receipt.payloadHash === envClean.payloadHash, "pack receipt hash");

  // Case B: banned vocabulary → block path
  const dirty =
    "We guarantee 100% risk-free outcomes that never fails for every client.";
  const evalDirty = evaluatePayload(dirty, CONTRACT);
  assert(!evalDirty.passed, "banned terms should fail");
  assert(
    evalDirty.violations?.some((v) => v.startsWith("banned_vocabulary")),
    "expect banned_vocabulary violation"
  );

  // Case C: deterministic hash stability for same canonical shape
  const h1 = await sha256Hex('{"a":1}');
  const h2 = await sha256Hex('{"a":1}');
  assert(h1 === h2, "sha256 stable");
  assert(h1 !== (await sha256Hex('{"a":2}')), "sha256 differs on change");

  // Node crypto cross-check
  const nodeHash = createHash("sha256").update('{"a":1}', "utf8").digest("hex");
  assert(h1 === nodeHash, "Web Crypto matches node:crypto");

  console.log(
    JSON.stringify(
      {
        ok: true,
        requestId,
        clean: { passed: evalClean.passed, score: evalClean.score },
        dirty: { passed: evalDirty.passed, violations: evalDirty.violations },
        envelopeId: envClean.envelopeId,
        payloadHash: envClean.payloadHash.slice(0, 16) + "…",
        packKind: packClean.kind,
      },
      null,
      2
    )
  );
  console.log("elysium-e2e-local: PASS");
}

main().catch((err) => {
  console.error("elysium-e2e-local: FAIL", err.message);
  process.exit(1);
});

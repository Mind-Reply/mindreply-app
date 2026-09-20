/**
 * Aurelia — Domain Expert Sovereignty Layer
 * Compiles human expertise (NL + visual blocks) into deterministic,
 * version-controlled JSON/YAML configurations.
 *
 * @see docs/ELYSIUM_STACK.md
 * @see epic #38 / issue #39
 */

import type { HelixContract } from "@mind-reply/elysium-core";

export interface AureliaExpertInput {
  /** Free-form natural language instruction from domain expert / CEO */
  intent: string;
  /** Optional visual-block graph (future) */
  blocks?: unknown[];
  /** Target surface or agent policy id */
  target?: string;
}

export interface AureliaCompiledConfig {
  contract: HelixContract;
  promptOverrides?: Record<string, string>;
  routing?: Record<string, unknown>;
  version: string;
  compiledAt: string;
  /** Human-readable summary of what the compiler changed */
  diffSummary: string[];
}

const TONE_MAP: Record<string, string> = {
  professional: "professional",
  formal: "professional",
  calm: "professional",
  strict: "professional",
  friendly: "friendly",
  casual: "casual",
  technical: "technical",
};

/**
 * Compile expert intent into a deterministic Helix-compatible configuration.
 * Rule-based extraction of common policy directives from natural language.
 * Visual-block merge and GitHub push remain future stages.
 */
export function compileExpertIntent(
  input: AureliaExpertInput,
  baseContract: HelixContract
): AureliaCompiledConfig {
  const intent = (input.intent || "").toLowerCase();
  const contract: HelixContract = { ...baseContract };
  const diffSummary: string[] = [];

  // Token budget: "max N tokens", "under N tokens", "token limit N"
  const tokenMatch = intent.match(
    /(?:max(?:imum)?|under|limit(?:ed to)?|cap(?:ped at)?)\s+(\d{3,5})\s*tokens?/
  );
  if (tokenMatch) {
    const n = Number(tokenMatch[1]);
    if (n > 0 && n !== contract.max_tokens) {
      contract.max_tokens = n;
      diffSummary.push(`max_tokens → ${n}`);
    }
  }

  // Latency: "under N ms", "latency Nms", "respond within N seconds"
  const latencyMs = intent.match(/(?:latency|respond within|under)\s+(\d{2,5})\s*ms/);
  const latencySec = intent.match(/(?:within|under)\s+(\d{1,2})\s*seconds?/);
  if (latencyMs) {
    const n = Number(latencyMs[1]);
    contract.max_latency_ms = n;
    diffSummary.push(`max_latency_ms → ${n}`);
  } else if (latencySec) {
    const n = Number(latencySec[1]) * 1000;
    contract.max_latency_ms = n;
    diffSummary.push(`max_latency_ms → ${n}`);
  }

  // Tone
  for (const [key, tone] of Object.entries(TONE_MAP)) {
    if (intent.includes(key) && contract.required_tone !== tone) {
      contract.required_tone = tone;
      diffSummary.push(`required_tone → ${tone}`);
      break;
    }
  }

  // Banned vocabulary additions: "ban X", "never say X", "forbid X"
  const banMatches = [
    ...intent.matchAll(/(?:ban|forbid|never say|do not use|don't use)\s+["']?([a-z0-9%-]+)["']?/g),
  ];
  if (banMatches.length) {
    const banned = new Set(contract.banned_vocabulary ?? []);
    for (const m of banMatches) {
      const term = m[1];
      if (term && !banned.has(term)) {
        banned.add(term);
        diffSummary.push(`banned_vocabulary + ${term}`);
      }
    }
    contract.banned_vocabulary = Array.from(banned);
  }

  // Hallucination strictness
  if (/strict\s+hallucination|zero\s+hallucination|no\s+hallucination/.test(intent)) {
    if (contract.hallucination_check !== "strict") {
      contract.hallucination_check = "strict";
      diffSummary.push("hallucination_check → strict");
    }
  } else if (/basic\s+hallucination|light\s+check/.test(intent)) {
    contract.hallucination_check = "basic";
    diffSummary.push("hallucination_check → basic");
  }

  // Fallback strategy
  if (/block\s+(?:on\s+)?fail|fail\s*closed|never\s+deliver/.test(intent)) {
    contract.fallback_strategy = "block";
    diffSummary.push("fallback_strategy → block");
  } else if (/rewrite\s+once|one\s+retry/.test(intent)) {
    contract.fallback_strategy = "rewrite_once";
    diffSummary.push("fallback_strategy → rewrite_once");
  } else if (/localized\s+fallback|safe\s+fallback/.test(intent)) {
    contract.fallback_strategy = "localized_fallback";
    diffSummary.push("fallback_strategy → localized_fallback");
  }

  // Target-aware routing hint
  const routing: Record<string, unknown> = {};
  if (input.target) {
    routing.target = input.target;
    diffSummary.push(`routing.target → ${input.target}`);
  }

  // Bump patch version when changes applied
  const version =
    diffSummary.length > 0
      ? bumpPatch(String(contract.version ?? "1.0.0"))
      : String(contract.version ?? "1.0.0");
  contract.version = version;

  return {
    contract,
    version,
    compiledAt: new Date().toISOString(),
    routing: Object.keys(routing).length ? routing : undefined,
    diffSummary,
  };
}

function bumpPatch(v: string): string {
  const parts = v.split(".").map((p) => Number(p) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join(".");
}

export type { HelixContract };

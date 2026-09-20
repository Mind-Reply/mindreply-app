// Minimal multi-provider LLM Gateway
// Reads tier config from model-tiering.json and routes a request to the
// first available model in that tier, falling back down the list on error.
//
// All keys come from environment variables — never hardcode them.
// Set these in Vercel / Windows service / Docker env, never in source control.

import tiering from "./model-tiering.json" assert { type: "json" };

const PROVIDER_CALLERS = {
  anthropic: async (modelId, prompt) => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY not set");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = await res.json();
    return data.content?.map((c) => c.text || "").join("\n") || "";
  },

  openai: async (modelId, prompt) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY not set");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  },

  google: async (modelId, prompt) => {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) throw new Error("GOOGLE_API_KEY not set");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!res.ok) throw new Error(`Google ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  },

  "docker-model-runner": async (modelId, prompt) => {
    const base = process.env.LOCAL_MODEL_BASE_URL || "http://localhost:11434/v1";
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Local model ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  },
};

/**
 * Route a prompt to the given tier, trying each model in order until one succeeds.
 */
export async function routeToTier(tierName, prompt) {
  const tier = tiering.tiers[tierName];
  if (!tier) throw new Error(`Unknown tier: ${tierName}`);

  let lastError;
  for (const model of tier.models) {
    const caller = PROVIDER_CALLERS[model.provider];
    if (!caller) continue;
    try {
      const text = await caller(model.id, prompt);
      return { text, model: model.id, provider: model.provider, tier: tierName };
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`All models in tier "${tierName}" failed: ${lastError?.message}`);
}

/** Pick a tier from simple task metadata. */
export function pickTier({ task, sensitive, offline, highVolume } = {}) {
  if (sensitive || offline) return "local";
  if (highVolume) return "specialist";
  if (task === "architecture_review" || task === "incident_diagnosis") return "frontier";
  return "standard";
}

// Example Next.js / Vercel API route:
//
// export async function POST(req) {
//   const { prompt, task, sensitive, offline, highVolume } = await req.json();
//   const tier = pickTier({ task, sensitive, offline, highVolume });
//   const result = await routeToTier(tier, prompt);
//   return Response.json(result);
// }

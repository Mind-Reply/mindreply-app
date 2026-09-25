export interface Env {
  DB: D1Database;
  PERSONAS: KVNamespace;
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  LEDGER_CHAIN_ID?: string;
  CHAT_TTL_DAYS?: string;
}

type PersonaMemory = {
  id: string;
  city_micro?: string;
  purpose: string;
  purpose_score: number;
  knowledge: string;
  top_3_questions?: string[];
  conversions: number;
  last_ledger_hash: string;
  updated_ts: number;
};

type ChatInput = {
  bot_id: string;
  city_micro?: string;
  purpose: string;
  input: string;
  output?: string;
  purpose_score?: number;
  knowledge_used?: string;
  tx_hash?: string;
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function appendLedger(env: Env, input: ChatInput) {
  const chainId = env.LEDGER_CHAIN_ID || "a11-estate";
  const previous = await env.DB
    .prepare("SELECT last_hash FROM ledger_chain_heads WHERE chain_id = ?")
    .bind(chainId)
    .first<{ last_hash: string }>();

  const prevHash = previous?.last_hash || "genesis";
  const inputHash = await sha256(input.input);
  const outputHash = await sha256(input.output || "");
  const ts = Date.now();
  const currHash = await sha256([
    prevHash,
    input.bot_id,
    input.purpose,
    input.city_micro || "",
    inputHash,
    outputHash,
    String(ts),
  ].join("|"));

  const batch = await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO integrity_log (ts, bot_id, action, input_hash, output_hash, prev_hash, purpose_score, city_micro, knowledge_used, tx_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(
      ts,
      input.bot_id,
      input.purpose,
      inputHash,
      outputHash,
      prevHash,
      input.purpose_score ?? null,
      input.city_micro ?? null,
      input.knowledge_used ?? null,
      input.tx_hash ?? null,
    ),
    env.DB.prepare(
      "INSERT INTO ledger_chain_heads (chain_id, last_hash, last_id, updated_ts) VALUES (?, ?, last_insert_rowid(), ?) ON CONFLICT(chain_id) DO UPDATE SET last_hash=excluded.last_hash, last_id=excluded.last_id, updated_ts=excluded.updated_ts",
    ).bind(chainId, currHash, ts),
  ]);

  if (!batch.every((result) => result.success)) throw new Error("Ledger append failed");

  return { currHash, inputHash, outputHash, ts };
}

async function upsertMemory(env: Env, input: ChatInput, ledgerHash: string) {
  const key = `memory_${input.bot_id}`;
  const current = await env.PERSONAS.get<PersonaMemory>(key, "json");
  const next: PersonaMemory = {
    id: input.bot_id,
    city_micro: input.city_micro ?? current?.city_micro,
    purpose: input.purpose,
    purpose_score: input.purpose_score ?? current?.purpose_score ?? 0,
    knowledge: input.knowledge_used || current?.knowledge || "",
    top_3_questions: current?.top_3_questions || [],
    conversions: (current?.conversions || 0) + 1,
    last_ledger_hash: ledgerHash,
    updated_ts: Date.now(),
  };
  await env.PERSONAS.put(key, JSON.stringify(next));
  return next;
}

async function embed(env: Env, text: string): Promise<number[]> {
  const response = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text });
  const values = response.data?.[0];
  if (!values) throw new Error("Embedding generation failed");
  return values;
}

async function research(env: Env, query: string, cityMicro?: string, purpose?: string) {
  const vector = await embed(env, query);
  const filter: Record<string, unknown> = {};
  if (cityMicro) filter.city_micro = cityMicro;
  if (purpose) filter.purpose = purpose;

  const result = await env.VECTORIZE.query(vector, {
    topK: 8,
    ...(Object.keys(filter).length ? { filter } : {}),
    returnMetadata: "all",
  });

  return result.matches || [];
}

async function cleanupChats(env: Env) {
  const now = Date.now();
  const result = await env.DB.prepare("DELETE FROM chats WHERE expires_ts <= ?").bind(now).run();
  return { deleted: result.meta?.changes || 0, now };
}

async function handleChat(env: Env, input: ChatInput) {
  if (!input.bot_id || !input.purpose || !input.input) throw new Error("bot_id, purpose and input are required");

  const ttlDays = Math.max(1, Number(env.CHAT_TTL_DAYS || 90));
  const created = Date.now();
  const expires = created + ttlDays * 86400000;
  const chatId = crypto.randomUUID();

  const ledger = await appendLedger(env, input);
  const memory = await upsertMemory(env, input, ledger.currHash);

  await env.DB.prepare(
    "INSERT INTO chats (id, bot_id, city_micro, purpose, input_text, output_text, created_ts, expires_ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).bind(
    chatId,
    input.bot_id,
    input.city_micro ?? null,
    input.purpose,
    input.input,
    input.output ?? null,
    created,
    expires,
  ).run();

  const researchText = [input.purpose, input.city_micro, input.knowledge_used].filter(Boolean).join(" | ");
  if (researchText) {
    const vector = await embed(env, researchText);
    await env.VECTORIZE.upsert([{
      id: input.bot_id,
      values: vector,
      metadata: {
        bot_id: input.bot_id,
        city_micro: input.city_micro || "",
        purpose: input.purpose,
        purpose_score: input.purpose_score ?? 0,
        ledger_hash: ledger.currHash,
      },
    }]);
  }

  return { chat_id: chatId, ledger_hash: ledger.currHash, memory };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/health") {
        const head = await env.DB.prepare(
          "SELECT chain_id, last_hash, last_id, updated_ts FROM ledger_chain_heads ORDER BY updated_ts DESC LIMIT 1",
        ).first();
        return json({ status: "ok", ledger: head || { chain_id: env.LEDGER_CHAIN_ID || "a11-estate", last_hash: "genesis" } });
      }

      if (request.method === "POST" && url.pathname === "/v1/chat") {
        const input = (await request.json()) as ChatInput;
        return json(await handleChat(env, input), 201);
      }

      if (request.method === "POST" && url.pathname === "/v1/research") {
        const body = (await request.json()) as { query: string; city_micro?: string; purpose?: string };
        if (!body.query) return json({ error: "query is required" }, 400);
        return json({ matches: await research(env, body.query, body.city_micro, body.purpose) });
      }

      if (request.method === "GET" && url.pathname === "/v1/memory") {
        const botId = url.searchParams.get("bot_id");
        if (!botId) return json({ error: "bot_id is required" }, 400);
        const memory = await env.PERSONAS.get<PersonaMemory>(`memory_${botId}`, "json");
        return json({ memory });
      }

      if (request.method === "POST" && url.pathname === "/v1/cleanup") {
        return json(await cleanupChats(env));
      }

      return json({ error: "not_found" }, 404);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;

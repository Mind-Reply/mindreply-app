export interface Env {
  ASSETS: Fetcher;
  PROOF_VAULT: KVNamespace;
}

function sideFromHost(hostname: string): string {
  const host = hostname.split(":")[0].toLowerCase();
  if (host === "live.shipbythurs.day") return "hub";
  return host.split(".")[0];
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return Response.json(data, {
    ...init,
    headers: {
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });
}

async function makeReceipt(id: string, side: string, body: string): Promise<Record<string, unknown>> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return {
    receipt_id: crypto.randomUUID(),
    id,
    side,
    hash: `sha256:${hash}`,
    ts: new Date().toISOString(),
    status: "PROVEN"
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const host = req.headers.get("host") || url.hostname;
    const side = sideFromHost(url.hostname);
    const path = url.pathname;

    if (path === "/monitor/public" && req.method === "GET") {
      const proofs = await env.PROOF_VAULT.list({ prefix: `proof:${side}:` });
      return json({
        side,
        host,
        status: proofs.keys.length > 0 ? "PROVEN" : "UNPROVEN",
        count: proofs.keys.length,
        ts: new Date().toISOString(),
        vault: "v1.0.0"
      });
    }

    if (path === "/monitor/public" && req.method === "POST") {
      const body = await req.text();
      await env.PROOF_VAULT.put(`telemetry:${side}:${Date.now()}`, body);
      return json({ status: "RECEIVED", side, ts: new Date().toISOString() });
    }

    if (path === "/monitor/audit" && req.method === "GET") {
      return json({
        side,
        host,
        audit_status: "DECLARED_ONLY",
        policies: { A: "NOT_VERIFIED", C: "NOT_VERIFIED", E: "NOT_VERIFIED" },
        zero_ai_exposure: "NOT_VERIFIED",
        secrets_isolation: "NOT_VERIFIED",
        ts: new Date().toISOString()
      });
    }

    if (path.startsWith("/proof/") && req.method === "POST") {
      const id = path.split("/")[2];
      if (!id) return json({ error: "missing proof id" }, { status: 400 });

      const body = await req.text();
      await env.PROOF_VAULT.put(`proof:${side}:${id}`, body);
      const receipt = await makeReceipt(id, side, body);
      await env.PROOF_VAULT.put(`receipt:${id}:${side}`, JSON.stringify(receipt));
      return json(receipt);
    }

    if (path.startsWith("/proof/") && req.method === "GET") {
      const id = path.split("/")[2];
      if (!id) return json({ error: "missing proof id" }, { status: 400 });

      const receipt = await env.PROOF_VAULT.get(`receipt:${id}:${side}`);
      if (!receipt) return new Response("NOT_FOUND", { status: 404 });
      return new Response(receipt, { headers: { "content-type": "application/json", "cache-control": "no-store" } });
    }

    if (path === "/mcp" && req.method === "GET") {
      return json({
        tools: ["prepare_mindread", "render_mindread", "fetch_receipt"],
        side,
        host,
        status: "ONLINE"
      });
    }

    return env.ASSETS.fetch(req);
  }
} satisfies ExportedHandler<Env>;

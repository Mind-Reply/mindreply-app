/**
 * Veridex → Supabase append-only ledger writer
 *
 * Env (server-only):
 *   VERIDEX_SUPABASE_URL
 *   VERIDEX_SUPABASE_SERVICE_ROLE_KEY
 *   VERIDEX_SUPABASE_TABLE (default: veridex_envelopes)
 *
 * Never expose the service role key to the browser.
 *
 * @see packages/veridex/sql/veridex_envelopes.sql
 */

import type { VeridexEnvelope } from "@mind-reply/elysium-core";
import { toSupabaseRow } from "./index";

export function isSupabaseWriterConfigured(): boolean {
  if (typeof process === "undefined" || !process.env) return false;
  return Boolean(
    process.env.VERIDEX_SUPABASE_URL &&
      process.env.VERIDEX_SUPABASE_SERVICE_ROLE_KEY
  );
}

export type AppendResult =
  | { ok: true; table: string }
  | { ok: false; reason: string };

/**
 * Append one envelope to Supabase via PostgREST.
 * Returns structured result; does not throw on config miss.
 * Throws only on network/HTTP failure when configured (caller may catch).
 */
export async function appendEnvelopeToSupabase(
  envelope: VeridexEnvelope,
  requestId: string
): Promise<AppendResult> {
  const url = process.env.VERIDEX_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.VERIDEX_SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.VERIDEX_SUPABASE_TABLE || "veridex_envelopes";

  if (!url || !key) {
    return { ok: false, reason: "veridex_supabase_not_configured" };
  }

  const row = toSupabaseRow(envelope, requestId);
  const endpoint = `${url}/rest/v1/${table}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      reason: `veridex_supabase_append_failed:${res.status}:${text.slice(0, 160)}`,
    };
  }

  return { ok: true, table };
}

/**
 * Factory for stampEnvelope({ appendWriter }).
 * Fail-soft: ledger errors never throw into the orchestration loop.
 * Sets envelope.metadata.ledgerWrite when possible via side-channel on the object.
 */
export function createSupabaseAppendWriter(requestId: string) {
  return async (envelope: VeridexEnvelope) => {
    if (!isSupabaseWriterConfigured()) {
      (envelope as VeridexEnvelope & { metadata?: Record<string, unknown> }).metadata =
        {
          ...((envelope as { metadata?: Record<string, unknown> }).metadata ?? {}),
          ledgerWrite: "skipped_not_configured",
        };
      return;
    }
    try {
      const result = await appendEnvelopeToSupabase(envelope, requestId);
      (envelope as VeridexEnvelope & { metadata?: Record<string, unknown> }).metadata =
        {
          ...((envelope as { metadata?: Record<string, unknown> }).metadata ?? {}),
          ledgerWrite: result.ok ? "supabase_ok" : result.reason,
        };
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      (envelope as VeridexEnvelope & { metadata?: Record<string, unknown> }).metadata =
        {
          ...((envelope as { metadata?: Record<string, unknown> }).metadata ?? {}),
          ledgerWrite: `error:${reason.slice(0, 120)}`,
        };
    }
  };
}

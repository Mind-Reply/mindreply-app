export const SIDES = ["dubai", "nyc", "london", "sofia", "tokyo"] as const;
export type Side = typeof SIDES[number];

export async function queueNextSide(env: { PROOF_VAULT: KVNamespace }, side: Side) {
  const index = SIDES.indexOf(side);
  const next = SIDES[index + 1];

  if (!next) return { side, next: null, status: "COMPLETE" as const };

  await env.PROOF_VAULT.put(`chain:${side}->${next}`, "QUEUED");
  return { side, next, status: "QUEUED" as const };
}

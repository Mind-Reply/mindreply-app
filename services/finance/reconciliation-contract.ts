export type ReconciliationMode = "read_only";

export type EvidenceState =
  | "UNKNOWN"
  | "FRESH"
  | "STALE"
  | "CONFLICT"
  | "VERIFIED";

export interface FinanceWorkflowInput {
  execution_id: string;
  requested_at: string;
  accounting_period: string;
  correlation_id: string;
  sources: string[];
  mode?: ReconciliationMode;
  idempotency_key?: string;
  requested_by?: string;
}

export interface SourceEvidence {
  source: string;
  evidence_timestamp: string | null;
  state: EvidenceState;
  fingerprint: string | null;
  currency: string | null;
  record_count: number;
  error: string | null;
}

export interface ReconciliationReceipt {
  execution_id: string;
  status: "VALIDATED" | "RECONCILED" | "EXCEPTION" | "FAILED";
  accounting_period: string;
  mode: ReconciliationMode;
  source_evidence: SourceEvidence[];
  reconciliation_state: "PENDING" | "MATCHED" | "CONFLICT" | "INCOMPLETE";
  verification_state: "PENDING" | "VERIFIED" | "UNVERIFIED";
  exceptions: string[];
  completed_at: string;
}

const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export function validateFinanceWorkflowInput(
  input: Partial<FinanceWorkflowInput>,
): string[] {
  const errors: string[] = [];

  if (!input.execution_id?.trim()) errors.push("execution_id is required");
  if (!input.requested_at || !ISO_INSTANT.test(input.requested_at)) {
    errors.push("requested_at must be an ISO-8601 UTC instant");
  }
  if (!input.accounting_period?.trim()) errors.push("accounting_period is required");
  if (!input.correlation_id?.trim()) errors.push("correlation_id is required");
  if (!input.sources?.length) errors.push("at least one source is required");
  if (input.mode && input.mode !== "read_only") {
    errors.push("only read_only mode is currently permitted");
  }

  return errors;
}

export function normalizeCents(amount: number): number {
  if (!Number.isFinite(amount)) throw new Error("amount must be finite");
  return Math.round(amount);
}

export function classifyEvidence(
  timestamp: string | null,
  nowMs: number,
  maxAgeMs: number,
): EvidenceState {
  if (!timestamp || !ISO_INSTANT.test(timestamp)) return "UNKNOWN";
  const evidenceMs = Date.parse(timestamp);
  if (!Number.isFinite(evidenceMs)) return "UNKNOWN";
  if (evidenceMs > nowMs) return "UNKNOWN";
  return nowMs - evidenceMs <= maxAgeMs ? "FRESH" : "STALE";
}

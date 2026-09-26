import {
  classifyEvidence,
  normalizeCents,
  validateFinanceWorkflowInput,
} from "./reconciliation-contract";

describe("finance reconciliation contract", () => {
  it("fails closed for missing identity and sources", () => {
    expect(validateFinanceWorkflowInput({})).toEqual([
      "execution_id is required",
      "requested_at must be an ISO-8601 UTC instant",
      "accounting_period is required",
      "correlation_id is required",
      "at least one source is required",
    ]);
  });

  it("permits the read-only execution mode only", () => {
    const errors = validateFinanceWorkflowInput({
      execution_id: "exec-1",
      requested_at: "2026-09-26T13:00:00Z",
      accounting_period: "2026-09",
      correlation_id: "corr-1",
      sources: ["stripe"],
      mode: "read_only",
    });
    expect(errors).toEqual([]);
  });

  it("rejects write-capable mode", () => {
    const errors = validateFinanceWorkflowInput({
      execution_id: "exec-1",
      requested_at: "2026-09-26T13:00:00Z",
      accounting_period: "2026-09",
      correlation_id: "corr-1",
      sources: ["stripe"],
      mode: "write",
    } as never);
    expect(errors).toContain("only read_only mode is currently permitted");
  });

  it("normalizes monetary values to integer cents", () => {
    expect(normalizeCents(1234)).toBe(1234);
    expect(normalizeCents(1234.49)).toBe(1234);
    expect(normalizeCents(1234.5)).toBe(1235);
  });

  it("keeps future or malformed evidence unverified", () => {
    expect(classifyEvidence("not-a-date", Date.parse("2026-09-26T13:00:00Z"), 3600000)).toBe("UNKNOWN");
    expect(classifyEvidence("2026-09-26T14:00:00Z", Date.parse("2026-09-26T13:00:00Z"), 3600000)).toBe("UNKNOWN");
  });

  it("classifies fresh evidence deterministically", () => {
    expect(
      classifyEvidence(
        "2026-09-26T12:30:00Z",
        Date.parse("2026-09-26T13:00:00Z"),
        3600000,
      ),
    ).toBe("FRESH");
  });
});

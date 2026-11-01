import test from "node:test";
import assert from "node:assert/strict";
import { executeTask, pickTier } from "./engine.mjs";

const validOutput = JSON.stringify({
  "OBJECTIVE": "Assess the task",
  "CURRENT STATE": "Development only",
  "EXECUTION": "No external action performed",
  "RESULT": "Structured response generated",
  "EVIDENCE": ["Mock provider response"],
  "RISKS": ["Not independently verified"],
  "NEXT ACTION": "Review the result",
});

test("routes by task complexity and data sensitivity", () => {
  assert.equal(pickTier({ task: "architecture_review" }), "frontier");
  assert.equal(pickTier({ task: "classification" }), "specialist");
  assert.equal(pickTier({ task: "summary", sensitive: true }), "local");
  assert.equal(pickTier({ task: "summary" }), "standard");
});

test("uses an injected provider and returns validated structured output", async () => {
  let calledWith;
  const result = await executeTask(
    { id: "test-1", objective: "Summarise a synthetic test case", task: "summary" },
    {
      adapters: {
        anthropic: async (input) => {
          calledWith = input;
          return validOutput;
        },
      },
      evaluate: async ({ output }) => ({ status: output.RESULT ? "PASS" : "FAIL" }),
    },
  );
  assert.equal(calledWith.responseFormat, "json");
  assert.equal(result.status, "READY");
  assert.equal(result.route.tier, "standard");
  assert.equal(result.output.RESULT, "Structured response generated");
  assert.equal(result.evaluation.status, "PASS");
  assert.equal(result.evidence.independentlyVerified, false);
});

test("sensitive tasks fail closed without a local provider", async () => {
  await assert.rejects(
    executeTask(
      { objective: "Handle synthetic sensitive data", sensitive: true },
      { adapters: { openai: async () => validOutput } },
    ),
    /No configured provider completed tier "local"/,
  );
});

test("external actions require independently verified approval before model invocation", async () => {
  let modelCalled = false;
  const result = await executeTask(
    { id: "external-1", objective: "Send a customer message", externalAction: true },
    { adapters: { anthropic: async () => { modelCalled = true; return validOutput; } } },
  );
  assert.equal(result.status, "CONTRIBUTION");
  assert.equal(result.modelCalled, false);
  assert.equal(modelCalled, false);
});

test("approval verifier must explicitly approve the scoped action", async () => {
  let verifiedScope;
  const result = await executeTask(
    { id: "external-2", objective: "Prepare a customer message", externalAction: true, scope: "draft-only" },
    {
      approvalVerifier: async (request) => {
        verifiedScope = request.scope;
        return true;
      },
      adapters: { anthropic: async () => validOutput },
    },
  );
  assert.equal(verifiedScope, "draft-only");
  assert.equal(result.status, "READY");
});

test("rejects malformed model output rather than returning unstructured text", async () => {
  await assert.rejects(
    executeTask(
      { objective: "Test malformed output", task: "summary" },
      { adapters: { anthropic: async () => "not json" } },
    ),
    /No configured provider completed tier "standard"/,
  );
});

test("evaluation failures are reported without retrying the provider", async () => {
  let providerCalls = 0;
  const result = await executeTask(
    { objective: "Test evaluation isolation", task: "summary" },
    {
      adapters: {
        anthropic: async () => { providerCalls += 1; return validOutput; },
        openai: async () => { providerCalls += 1; return validOutput; },
      },
      evaluate: async () => { throw new Error("evaluation unavailable"); },
    },
  );
  assert.equal(providerCalls, 1);
  assert.equal(result.status, "READY");
  assert.equal(result.evaluation.status, "ERROR");
});

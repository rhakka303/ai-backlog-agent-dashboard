import assert from "node:assert/strict";
import test from "node:test";
import { FORMULA_VERSIONS, FRAMEWORK_VERSION, calculateScore, classifyEligibility, methodIsCompatible, validateForRecording, validateWeights } from "../app/prioritizationRules.mjs";

const input = (overrides = {}) => ({ business: 10, time: 5, risk: 5, jobSize: 4, confidence: "High", evidence: "Customer interview CR-42", rationale: "", decision: "Accept", mandatory: false, ...overrides });
const weights = { business: 40, time: 25, risk: 35 };

test("known WSJF dataset reproduces expected score", () => assert.equal(calculateScore("WSJF", input(), weights, [input()]), 5));
test("known Theme Scoring dataset applies corresponding weights", () => assert.equal(calculateScore("Theme Scoring", input(), weights, [input()]), 7));
test("known Relative Weighting dataset exposes value and cost percentages", () => {
  const first = input(); const second = input({ business: 5, time: 5, risk: 10, jobSize: 6 });
  assert.deepEqual(calculateScore("Relative Weighting", first, weights, [first, second], true), { score: 1.25, valuePercent: 50, costPercent: 40 });
});
test("mandatory work is classified and never numerically scored", () => {
  const mandatory = input({ mandatory: true });
  assert.equal(classifyEligibility(mandatory).code, "mandatory");
  assert.equal(calculateScore("WSJF", mandatory, weights, [mandatory]), null);
});
test("eligibility rejects placeholder evidence and missing estimates", () => {
  assert.equal(classifyEligibility(input({ evidence: "placeholder" })).code, "insufficient");
  assert.equal(classifyEligibility(input({ jobSize: 0 })).code, "refinement");
});
test("weight validation rejects out-of-range values and totals other than 100", () => {
  assert.equal(validateWeights(weights).valid, true);
  assert.equal(validateWeights({ business: 101, time: 0, risk: -1 }).valid, false);
  assert.equal(validateWeights({ business: 40, time: 25, risk: 30 }).valid, false);
});
test("method compatibility prevents incomparable work", () => {
  assert.equal(methodIsCompatible("Theme Scoring", "Theme"), true);
  assert.equal(methodIsCompatible("Theme Scoring", "Story"), false);
  assert.equal(methodIsCompatible("WSJF", "Story"), true);
});
test("zero, invalid, and incompatible inputs return explicit validation errors", () => {
  assert.ok(validateForRecording({ method: "WSJF", level: "Story", input: input({ jobSize: 0 }), weights }).length > 0);
  assert.ok(validateForRecording({ method: "WSJF", level: "Story", input: input({ business: 21 }), weights }).length > 0);
  assert.ok(validateForRecording({ method: "Theme Scoring", level: "Story", input: input(), weights }).length > 0);
});
test("override decisions require a rationale", () => {
  assert.ok(validateForRecording({ method: "WSJF", level: "Story", input: input({ decision: "Override", rationale: "" }), weights }).includes("Override requires a rationale."));
  assert.equal(validateForRecording({ method: "WSJF", level: "Story", input: input({ decision: "Override", rationale: "PO approved dependency exception" }), weights }).length, 0);
});
test("formula and framework versions are explicit and stable", () => {
  assert.equal(FORMULA_VERSIONS.WSJF, "wsjf-2.0");
  assert.equal(FRAMEWORK_VERSION, "prioritization-framework-2.0");
});

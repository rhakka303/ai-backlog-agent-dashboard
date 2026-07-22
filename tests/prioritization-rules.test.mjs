import assert from "node:assert/strict";
import test from "node:test";
import { FORMULA_VERSIONS, FRAMEWORK_VERSION, calculateScore, classifyEligibility, methodIsCompatible, validateForRecording, validateWeights } from "../app/prioritizationRules.mjs";
import { appendDecisionSnapshot, canEditPlannedSprint, compareDecisionSnapshots } from "../app/decisionHistory.mjs";

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

const decision = (overrides = {}) => ({
  id: "event-1", itemId: "CRM-184", at: "2026-07-22T03:00:00.000Z", method: "WSJF",
  formulaVersion: "wsjf-2.0", frameworkVersion: "prioritization-framework-2.0", score: 5,
  currentRank: 2, recommendedRank: 1, decision: "Accept", sprint: "Sprint 25", rationale: "Evidence supports sequencing",
  actor: "Product Owner", participants: "Product Owner and Development Team", evidence: "Customer interview CR-42",
  inputs: { business: 10, time: 5, risk: 5, jobSize: 4, confidence: "High" }, ...overrides,
});

test("recording appends immutable UTC snapshots and corrections create versions", () => {
  const firstHistory = appendDecisionSnapshot([], decision());
  const secondHistory = appendDecisionSnapshot(firstHistory, decision({ id: "event-2", at: "2026-07-22T04:00:00.000Z", decision: "Override", rationale: "Dependency exception" }));
  assert.equal(firstHistory[0].decisionVersion, 1);
  assert.equal(secondHistory[0].decisionVersion, 2);
  assert.equal(secondHistory[1].decision, "Accept");
  assert.equal(Object.isFrozen(secondHistory[0]), true);
  assert.equal(Object.isFrozen(secondHistory[0].inputs), true);
});

test("decision versions compare scores, ranks, and human decisions", () => {
  const first = appendDecisionSnapshot([], decision())[0];
  const second = appendDecisionSnapshot([first], decision({ id: "event-2", at: "2026-07-22T04:00:00.000Z", score: 7, recommendedRank: 2, decision: "Retain current" }))[0];
  assert.deepEqual(compareDecisionSnapshots(first, second), { itemId: "CRM-184", versions: [1, 2], score: [5, 7], rank: [1, 2], decision: ["Accept", "Retain current"] });
});

test("planned sprint editing requires a recorded or alongside eligible decision", () => {
  assert.equal(canEditPlannedSprint({ hasRecordedPriority: false, eligible: true, decision: "Draft" }), false);
  assert.equal(canEditPlannedSprint({ hasRecordedPriority: false, eligible: true, decision: "Accept" }), true);
  assert.equal(canEditPlannedSprint({ hasRecordedPriority: true, eligible: false, decision: "Draft" }), true);
});

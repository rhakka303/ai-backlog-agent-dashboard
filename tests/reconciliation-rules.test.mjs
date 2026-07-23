import assert from "node:assert/strict";
import test from "node:test";
import { CONNECTOR_CAPABILITIES, RECONCILIATION_STATUSES, humanCanFinalize, reconcilePlan, validateReadOnlyConnectorOperation } from "../app/reconciliationRules.mjs";

const iterations = [{ id: "s24", lifecycle: "active" }, { id: "s25", lifecycle: "upcoming" }, { id: "s23", lifecycle: "closed" }];

test("source-plan comparison exposes every governed reconciliation result", () => {
  assert.equal(reconcilePlan({ plannedIterationId: "s24", sourceIterationId: "s24", iterations }).label, RECONCILIATION_STATUSES.confirmed);
  assert.equal(reconcilePlan({ plannedIterationId: "s25", sourceIterationId: null, iterations }).label, RECONCILIATION_STATUSES.awaiting);
  assert.equal(reconcilePlan({ plannedIterationId: "s25", sourceIterationId: "s24", iterations }).label, RECONCILIATION_STATUSES.different);
  assert.equal(reconcilePlan({ plannedIterationId: "s25", sourceIterationId: "s24", sourceItemExists: false, iterations }).label, RECONCILIATION_STATUSES.removed);
  assert.equal(reconcilePlan({ plannedIterationId: "missing", sourceIterationId: null, iterations }).label, RECONCILIATION_STATUSES.unavailable);
  assert.equal(reconcilePlan({ plannedIterationId: "s23", sourceIterationId: "s23", iterations }).label, RECONCILIATION_STATUSES.unavailable);
});

test("only a human Product Owner or authorized delegate can finalize", () => {
  assert.equal(humanCanFinalize("product-owner"), true);
  assert.equal(humanCanFinalize("authorized-delegate"), true);
  assert.equal(humanCanFinalize("ai"), false);
  assert.equal(humanCanFinalize("participant"), false);
});

test("connector capability model has no write operation and blocks direct AI access", () => {
  assert.deepEqual(CONNECTOR_CAPABILITIES.allowedOperations, ["read", "compare"]);
  for (const capability of ["create", "update", "delete", "transition", "reorder", "directAiAccess"]) assert.equal(CONNECTOR_CAPABILITIES[capability], false);
  assert.equal(validateReadOnlyConnectorOperation("read", "human-refresh").allowed, true);
  assert.equal(validateReadOnlyConnectorOperation("update", "human-refresh").allowed, false);
  assert.equal(validateReadOnlyConnectorOperation("read", "ai").allowed, false);
});

import assert from "node:assert/strict";
import test from "node:test";
import { appendPlanningEvent, canAddToIteration, connectorStateMessage, effectiveEstimate, iterationCapacityState, selectPlanningHorizon } from "../app/iterationPlanning.mjs";

const iteration = (id, lifecycle, startAt, extra = {}) => ({ id, name: id.toUpperCase(), lifecycle, startAt, endAt: startAt, sourceCommittedPoints: 0, ...extra });

test("planning horizon rolls forward exactly once when the active sprint closes", () => {
  const source = [iteration("s24", "active", "2026-07-01"), iteration("s25", "upcoming", "2026-07-15"), iteration("s26", "upcoming", "2026-07-29"), iteration("s27", "upcoming", "2026-08-12"), iteration("s28", "upcoming", "2026-08-26")];
  assert.deepEqual(selectPlanningHorizon(source, 3).map((item) => item.id), ["s24", "s25", "s26"]);
  source[0] = { ...source[0], lifecycle: "closed" };
  assert.deepEqual(selectPlanningHorizon(source, 3).map((item) => item.id), ["s25", "s26", "s27"]);
});

test("rollover handles multiple closures, reordered data, and duplicate names by stable ID", () => {
  const source = [iteration("id-27", "upcoming", "2026-08-12", { name: "Sprint" }), iteration("id-25", "closed", "2026-07-15", { name: "Sprint" }), iteration("id-26", "active", "2026-07-29", { name: "Sprint" })];
  assert.deepEqual(selectPlanningHorizon(source).map((item) => item.id), ["id-26", "id-27"]);
});

test("planning, capacity, and estimate audit events version independently", () => {
  let history = appendPlanningEvent([], { id: "e1", eventType: "capacity", subjectId: "s25", at: "2026-07-22T04:00:00.000Z", target: 20, max: 25 });
  history = appendPlanningEvent(history, { id: "e2", eventType: "capacity", subjectId: "s25", at: "2026-07-22T05:00:00.000Z", target: 22, max: 28 });
  history = appendPlanningEvent(history, { id: "e3", eventType: "sprint", subjectId: "CRM-184", at: "2026-07-22T06:00:00.000Z", from: "unassigned", to: "s25" });
  assert.deepEqual(history.map((event) => [event.eventType, event.version]), [["sprint", 1], ["capacity", 2], ["capacity", 1]]);
  assert.equal(Object.isFrozen(history[0]), true);
});

test("a later source estimate supersedes but does not delete local estimate history", () => {
  const history = appendPlanningEvent([], { id: "e1", eventType: "estimate", subjectId: "CRM-249", at: "2026-07-22T04:00:00.000Z", points: 5 });
  assert.equal(effectiveEstimate(0, history, "CRM-249").source, "local");
  assert.deepEqual(effectiveEstimate(8, history, "CRM-249"), { points: 8, source: "source", supersededLocalVersions: 1 });
  assert.equal(history[0].points, 5);
});

test("source-over-capacity state is explicit and blocks added planning", () => {
  const over = iteration("s25", "active", "2026-07-15", { sourceCommittedPoints: 31 });
  assert.deepEqual(iterationCapacityState(over, 0, { target: 24, max: 30 }), { sourcePoints: 31, localPlannedPoints: 0, plannedPoints: 31, available: 0, overBy: 1, state: "over", sourceAlreadyOver: true });
  assert.equal(canAddToIteration(over, 0, 1, { target: 24, max: 30 }), false);
});

test("connector downtime and restoration have explicit read-only states", () => {
  assert.match(connectorStateMessage("error"), /local plans retained/);
  assert.match(connectorStateMessage("synced"), /synchronized/);
  for (const state of ["loading", "empty", "stale", "renamed", "reconciliation"]) assert.ok(connectorStateMessage(state).length > 10);
});

// Verifies issue #34's canonical cadence, lifecycle, validation, and versioned changes.
import assert from "node:assert/strict";
import test from "node:test";
import {
  activeSprintPlanningRequirement,
  appendSprintConfigVersion,
  currentSprintSequence,
  defaultPlanningTarget,
  defaultSprintConfig,
  deriveSprint,
  formatSprintDate,
  normalizeSprintConfig,
  validateSprintConfig,
} from "../app/sprintConfig.mjs";

test("default Sprint configuration establishes the approved prototype baseline", () => {
  assert.deepEqual(defaultSprintConfig, {
    sprintLengthWeeks: 2,
    sprintOneStartDate: "2025-08-25",
    sequenceStart: 1,
    namingPrefix: "Sprint",
    officialTimeZone: "America/Los_Angeles",
    dateFormat: "MMM D, YYYY",
    planningHorizonDays: 90,
    activeSprintPlanningPolicy: "warning-rationale-required",
  });
});

test("Sprint dates derive only from anchor, cadence, and sequence", () => {
  assert.deepEqual(deriveSprint(17), {
    id: "sprint-17",
    sequence: 17,
    name: "Sprint 17",
    startDate: "2026-04-06",
    endDate: "2026-04-19",
    lifecycle: "Closed",
  });
  assert.deepEqual(deriveSprint(24), {
    id: "sprint-24",
    sequence: 24,
    name: "Sprint 24",
    startDate: "2026-07-13",
    endDate: "2026-07-26",
    lifecycle: "Current",
  });
});

test("fixed sample timestamp classifies closed, current, next, and upcoming Sprints", () => {
  assert.equal(currentSprintSequence(defaultSprintConfig), 24);
  assert.equal(deriveSprint(1).lifecycle, "Closed");
  assert.equal(deriveSprint(23).lifecycle, "Closed");
  assert.equal(deriveSprint(24).lifecycle, "Current");
  assert.equal(deriveSprint(25).lifecycle, "Next");
  assert.equal(deriveSprint(26).lifecycle, "Upcoming");
  assert.equal(defaultPlanningTarget().sequence, 25);
  assert.equal(defaultPlanningTarget().lifecycle, "Next");
});

test("changing the anchor shifts every derived Sprint consistently", () => {
  const shifted = { ...defaultSprintConfig, sprintOneStartDate: "2025-09-01" };
  assert.equal(deriveSprint(17, shifted).startDate, "2026-04-13");
  assert.equal(deriveSprint(24, shifted).startDate, "2026-07-20");
  assert.equal(deriveSprint(25, shifted).startDate, "2026-08-03");
});

test("all supported cadence values derive an inclusive Sprint boundary", () => {
  for (const sprintLengthWeeks of [1, 2, 3, 4]) {
    const config = { ...defaultSprintConfig, sprintLengthWeeks };
    const sprint = deriveSprint(1, config);
    const elapsedDays = Math.round((Date.parse(`${sprint.endDate}T00:00:00.000Z`) - Date.parse(`${sprint.startDate}T00:00:00.000Z`)) / 86_400_000) + 1;
    assert.equal(elapsedDays, sprintLengthWeeks * 7);
  }
});

test("invalid or missing Sprint configuration returns explicit field errors", () => {
  const errors = validateSprintConfig({
    sprintLengthWeeks: 0,
    sprintOneStartDate: "not-a-date",
    sequenceStart: 2,
    namingPrefix: "",
    officialTimeZone: "Pacific-ish",
    dateFormat: "unknown",
    planningHorizonDays: 0,
    activeSprintPlanningPolicy: "silent",
  });
  assert.deepEqual(errors.map((error) => error.field), [
    "sprintLengthWeeks",
    "sprintOneStartDate",
    "sequenceStart",
    "namingPrefix",
    "officialTimeZone",
    "dateFormat",
    "planningHorizonDays",
    "activeSprintPlanningPolicy",
  ]);
  assert.deepEqual(normalizeSprintConfig({ sprintLengthWeeks: 0 }), defaultSprintConfig);
});

test("active-Sprint policy exposes warning and rationale for Child 11 enforcement", () => {
  assert.deepEqual(activeSprintPlanningRequirement(), {
    policy: "warning-rationale-required",
    label: "Warn and require rationale",
    allowed: true,
    warningRequired: true,
    rationaleRequired: true,
    enforcementOwner: "#42",
  });
});

test("configuration changes append complete version evidence", () => {
  const next = { ...defaultSprintConfig, planningHorizonDays: 120 };
  const history = appendSprintConfigVersion([], {
    id: "change-1",
    actor: "Product Owner",
    at: "2026-07-30T17:00:00.000Z",
    rationale: "Extend planning visibility",
    previousValue: defaultSprintConfig,
    newValue: next,
  });
  assert.equal(history[0].version, 1);
  assert.equal(history[0].actor, "Product Owner");
  assert.equal(history[0].at, "2026-07-30T17:00:00.000Z");
  assert.equal(history[0].rationale, "Extend planning visibility");
  assert.deepEqual(history[0].changedFields, ["planningHorizonDays"]);
  assert.deepEqual(history[0].previousValue, defaultSprintConfig);
  assert.deepEqual(history[0].newValue, next);
  assert.throws(() => appendSprintConfigVersion(history, {
    actor: "Product Owner",
    at: "2026-07-30T17:01:00.000Z",
    rationale: "",
    previousValue: next,
    newValue: { ...next, planningHorizonDays: 60 },
  }), /rationale/i);
});

test("configured date formats render the same derived boundary", () => {
  assert.equal(formatSprintDate("2026-07-13", "MMM D, YYYY"), "Jul 13, 2026");
  assert.equal(formatSprintDate("2026-07-13", "MM/DD/YYYY"), "07/13/2026");
  assert.equal(formatSprintDate("2026-07-13", "DD/MM/YYYY"), "13/07/2026");
  assert.equal(formatSprintDate("2026-07-13", "YYYY-MM-DD"), "2026-07-13");
});

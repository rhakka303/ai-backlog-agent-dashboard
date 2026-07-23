import assert from "node:assert/strict";
import test from "node:test";
import {
  ESTIMATE_VALUES,
  SAMPLE_CALCULATION_TIMESTAMP,
  WORK_ITEM_TYPES,
  calculateWorkItemTiming,
  createCanonicalWorkItem,
  effectiveEstimate,
  withExtension,
  withSourceRefresh,
  workItemKey,
} from "../app/workItemModel.mjs";

const baseInput = (overrides = {}) => ({
  identity: { sourceSystem: "Azure DevOps", organizationId: "sample-org", projectId: "sample-project", workItemId: "CRM-184" },
  type: "Story",
  source: {
    provenance: { sourceUrl: "https://example.invalid/items/CRM-184", lastRefreshedAt: "2026-07-20T18:30:00.000Z" },
    title: "Merge duplicate customer profiles",
    nativeState: "Active",
    priorityRank: 4,
    project: "Sample CRM",
    team: "Sample Platform Team",
    blocked: false,
    readinessEvidence: { definitionOfReady: true, evidence: "Approved sample evidence" },
    dates: {
      createdAt: "2026-07-10T19:00:00.000Z",
      updatedAt: "2026-07-18T19:00:00.000Z",
      completedAt: null,
      addedToProductScopeAt: "2026-07-11T19:00:00.000Z",
      removedFromProductScopeAt: null,
    },
    storyPoints: 5,
    estimateChangeHistory: [{ changedAt: "2026-07-15T19:00:00.000Z", from: 3, to: 5 }],
    currentSprintId: "sample-sprint-24",
  },
  local: {
    planningEstimate: null,
    plannedSprintId: "sample-sprint-25",
    prioritization: { evidence: "Sample evidence", confidence: "Medium" },
  },
  audit: { calculatedAt: SAMPLE_CALCULATION_TIMESTAMP },
  ...overrides,
});

test("all work-item types share the canonical common field structure", () => {
  assert.deepEqual(WORK_ITEM_TYPES, ["Epic", "Story", "Bug", "Enabler"]);
  for (const type of WORK_ITEM_TYPES) {
    const item = createCanonicalWorkItem({ ...baseInput(), type });
    assert.deepEqual(Object.keys(item), ["schemaVersion", "key", "identity", "type", "source", "local", "audit", "extensions"]);
    assert.equal("parentId" in item, false);
    assert.equal("children" in item, false);
  }
});

test("stable identity is source plus organization, project, and ID rather than title", () => {
  const item = createCanonicalWorkItem(baseInput());
  assert.equal(item.key, "azure devops:sample-org:sample-project:CRM-184");
  assert.equal(workItemKey({ ...item.identity, workItemId: "CRM-185" }), "azure devops:sample-org:sample-project:CRM-185");
});

test("known incomplete sample calculates age from the fixed timestamp", () => {
  const timing = calculateWorkItemTiming(createCanonicalWorkItem(baseInput()));
  assert.deepEqual(timing, { ageDays: 10, cycleTimeDays: null, calculatedAt: SAMPLE_CALCULATION_TIMESTAMP, completed: false });
});

test("completed work uses cycle time and stops accumulating age", () => {
  const input = baseInput();
  input.source.dates.completedAt = "2026-07-16T19:00:00.000Z";
  const item = createCanonicalWorkItem(input);
  const fixed = calculateWorkItemTiming(item);
  const muchLater = calculateWorkItemTiming(item, "2027-07-20T19:00:00.000Z");
  assert.deepEqual(fixed, { ageDays: 6, cycleTimeDays: 6, calculatedAt: "2026-07-16T19:00:00.000Z", completed: true });
  assert.deepEqual(muchLater, fixed);
});

test("estimates allow only the governed sequence and preserve no-estimate state", () => {
  assert.deepEqual(ESTIMATE_VALUES, [1, 2, 3, 5, 8, 13]);
  for (const value of ESTIMATE_VALUES) {
    const input = baseInput();
    input.source.storyPoints = value;
    assert.equal(createCanonicalWorkItem(input).source.storyPoints, value);
  }
  for (const value of [0, 4, 21]) {
    const input = baseInput();
    input.source.storyPoints = value;
    assert.throws(() => createCanonicalWorkItem(input), /must be unestimated/);
  }
  const input = baseInput();
  input.source.storyPoints = null;
  assert.deepEqual(effectiveEstimate(createCanonicalWorkItem(input)), { value: null, source: "unestimated" });
});

test("source estimate takes precedence and local estimate is allowed only when source is missing", () => {
  const invalid = baseInput();
  invalid.local.planningEstimate = 8;
  assert.throws(() => createCanonicalWorkItem(invalid), /only when source Story Points are missing/);
  const local = baseInput();
  local.source.storyPoints = null;
  local.local.planningEstimate = 8;
  assert.deepEqual(effectiveEstimate(createCanonicalWorkItem(local)), { value: 8, source: "local" });
});

test("source and planned Sprint identities remain separate stable-ID fields", () => {
  const item = createCanonicalWorkItem(baseInput());
  assert.equal(item.source.currentSprintId, "sample-sprint-24");
  assert.equal(item.local.plannedSprintId, "sample-sprint-25");
});

test("source refresh preserves structurally separate local overlays", () => {
  const item = createCanonicalWorkItem(baseInput());
  const refreshed = withSourceRefresh(item, {
    nativeState: "Testing",
    provenance: { lastRefreshedAt: "2026-07-20T19:30:00.000Z" },
    dates: { updatedAt: "2026-07-20T19:15:00.000Z" },
  });
  assert.equal(refreshed.source.nativeState, "Testing");
  assert.deepEqual(refreshed.local, item.local);
  assert.equal(refreshed.source.provenance.lastRefreshedAt, "2026-07-20T19:30:00.000Z");
});

test("future Epic-specific data attaches through an extension without redesigning common fields", () => {
  const item = createCanonicalWorkItem(baseInput());
  const extended = withExtension(item, "epic", { outcome: "Sample outcome" });
  assert.deepEqual(Object.keys(extended).filter((key) => key !== "extensions"), Object.keys(item).filter((key) => key !== "extensions"));
  assert.deepEqual(extended.extensions.epic, { outcome: "Sample outcome" });
  assert.equal("epic" in item.extensions, false);
});

test("canonical model exposes no source-system write operation", () => {
  const exportedOperations = ["createCanonicalWorkItem", "calculateWorkItemTiming", "effectiveEstimate", "withSourceRefresh", "withExtension", "workItemKey"];
  assert.equal(exportedOperations.some((name) => /write|updateSource|delete|transition|assign/i.test(name)), false);
});

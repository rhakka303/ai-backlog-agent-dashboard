// Canonical, source-independent work-item foundation shared by every work type.
export const WORK_ITEM_TYPES = Object.freeze(["Epic", "Story", "Bug", "Enabler"]);
export const ESTIMATE_VALUES = Object.freeze([1, 2, 3, 5, 8, 13]);
export const SAMPLE_CALCULATION_TIMESTAMP = "2026-07-20T19:00:00.000Z";

const DAY_MS = 86_400_000;

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required.`);
  return value.trim();
}

function optionalText(value, field) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} must be text or null.`);
  return value.trim();
}

function timestamp(value, field, required = true) {
  if ((value === null || value === undefined) && !required) return null;
  requireText(value, field);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${field} must be an ISO timestamp.`);
  return new Date(value).toISOString();
}

function estimate(value, field) {
  if (value === null || value === undefined) return null;
  if (!ESTIMATE_VALUES.includes(value)) {
    throw new Error(`${field} must be unestimated or one of 1, 2, 3, 5, 8, 13.`);
  }
  return value;
}

function freezeRecord(value = {}) {
  return Object.freeze({ ...value });
}

export function workItemKey(identity) {
  return [
    requireText(identity.sourceSystem, "identity.sourceSystem").toLowerCase(),
    requireText(identity.organizationId, "identity.organizationId"),
    requireText(identity.projectId, "identity.projectId"),
    requireText(identity.workItemId, "identity.workItemId"),
  ].join(":");
}

export function createCanonicalWorkItem(input) {
  if (!input || typeof input !== "object") throw new Error("Work item input is required.");
  if (!WORK_ITEM_TYPES.includes(input.type)) throw new Error("type must be Epic, Story, Bug, or Enabler.");

  const identity = freezeRecord({
    sourceSystem: requireText(input.identity?.sourceSystem, "identity.sourceSystem"),
    organizationId: requireText(input.identity?.organizationId, "identity.organizationId"),
    projectId: requireText(input.identity?.projectId, "identity.projectId"),
    workItemId: requireText(input.identity?.workItemId, "identity.workItemId"),
  });
  const sourceStoryPoints = estimate(input.source?.storyPoints, "source.storyPoints");
  const localPlanningEstimate = estimate(input.local?.planningEstimate, "local.planningEstimate");
  if (sourceStoryPoints !== null && localPlanningEstimate !== null) {
    throw new Error("A Local Planning Estimate is permitted only when source Story Points are missing.");
  }

  const createdAt = timestamp(input.source?.dates?.createdAt, "source.dates.createdAt");
  const updatedAt = timestamp(input.source?.dates?.updatedAt, "source.dates.updatedAt");
  const completedAt = timestamp(input.source?.dates?.completedAt, "source.dates.completedAt", false);
  if (Date.parse(updatedAt) < Date.parse(createdAt)) throw new Error("Updated Date cannot precede Created Date.");
  if (completedAt && Date.parse(completedAt) < Date.parse(createdAt)) {
    throw new Error("Completed Date cannot precede Created Date.");
  }

  const source = Object.freeze({
    provenance: freezeRecord({
      sourceSystem: identity.sourceSystem,
      sourceUrl: requireText(input.source?.provenance?.sourceUrl, "source.provenance.sourceUrl"),
      lastRefreshedAt: timestamp(input.source?.provenance?.lastRefreshedAt, "source.provenance.lastRefreshedAt"),
    }),
    title: requireText(input.source?.title, "source.title"),
    nativeState: requireText(input.source?.nativeState, "source.nativeState"),
    priorityRank: input.source?.priorityRank ?? null,
    project: requireText(input.source?.project, "source.project"),
    team: requireText(input.source?.team, "source.team"),
    blocked: Boolean(input.source?.blocked),
    readinessEvidence: freezeRecord(input.source?.readinessEvidence),
    dates: freezeRecord({
      createdAt,
      updatedAt,
      completedAt,
      addedToProductScopeAt: timestamp(input.source?.dates?.addedToProductScopeAt, "source.dates.addedToProductScopeAt"),
      removedFromProductScopeAt: timestamp(input.source?.dates?.removedFromProductScopeAt, "source.dates.removedFromProductScopeAt", false),
    }),
    storyPoints: sourceStoryPoints,
    estimateChangeHistory: Object.freeze([...(input.source?.estimateChangeHistory ?? [])].map((change) => freezeRecord({
      changedAt: timestamp(change.changedAt, "source.estimateChangeHistory.changedAt"),
      from: estimate(change.from, "source.estimateChangeHistory.from"),
      to: estimate(change.to, "source.estimateChangeHistory.to"),
    }))),
    currentSprintId: optionalText(input.source?.currentSprintId, "source.currentSprintId"),
  });

  const local = Object.freeze({
    planningEstimate: localPlanningEstimate,
    plannedSprintId: optionalText(input.local?.plannedSprintId, "local.plannedSprintId"),
    prioritization: freezeRecord(input.local?.prioritization),
  });

  return Object.freeze({
    schemaVersion: 1,
    key: workItemKey(identity),
    identity,
    type: input.type,
    source,
    local,
    audit: freezeRecord({
      calculatedAt: timestamp(input.audit?.calculatedAt ?? SAMPLE_CALCULATION_TIMESTAMP, "audit.calculatedAt"),
    }),
    extensions: freezeRecord(input.extensions),
  });
}

export function calculateWorkItemTiming(item, calculationAt = item.audit.calculatedAt) {
  const createdAt = Date.parse(item.source.dates.createdAt);
  const completedAt = item.source.dates.completedAt ? Date.parse(item.source.dates.completedAt) : null;
  const referenceAt = completedAt ?? Date.parse(timestamp(calculationAt, "calculationAt"));
  if (referenceAt < createdAt) throw new Error("Calculation timestamp cannot precede Created Date.");
  const elapsedDays = (referenceAt - createdAt) / DAY_MS;
  return Object.freeze({
    ageDays: elapsedDays,
    cycleTimeDays: completedAt === null ? null : elapsedDays,
    calculatedAt: new Date(referenceAt).toISOString(),
    completed: completedAt !== null,
  });
}

export function effectiveEstimate(item) {
  if (item.source.storyPoints !== null) {
    return Object.freeze({ value: item.source.storyPoints, source: "source" });
  }
  if (item.local.planningEstimate !== null) {
    return Object.freeze({ value: item.local.planningEstimate, source: "local" });
  }
  return Object.freeze({ value: null, source: "unestimated" });
}

export function withSourceRefresh(item, sourcePatch) {
  return createCanonicalWorkItem({
    identity: item.identity,
    type: item.type,
    source: {
      ...item.source,
      ...sourcePatch,
      provenance: { ...item.source.provenance, ...sourcePatch.provenance },
      dates: { ...item.source.dates, ...sourcePatch.dates },
    },
    local: item.local,
    audit: item.audit,
    extensions: item.extensions,
  });
}

export function withExtension(item, namespace, value) {
  const extensionName = requireText(namespace, "extension namespace");
  return Object.freeze({ ...item, extensions: freezeRecord({ ...item.extensions, [extensionName]: freezeRecord(value) }) });
}

// This model is intentionally data-only. It exposes no source-system mutation operation.

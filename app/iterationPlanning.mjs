// Pure read-only iteration, estimate, capacity, and planning-audit rules.
export function selectPlanningHorizon(iterations, size = 4) {
  return [...iterations]
    .filter((iteration) => iteration.lifecycle === "active" || iteration.lifecycle === "upcoming")
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt) || a.id.localeCompare(b.id))
    .slice(0, size);
}

export function appendPlanningEvent(history, draft) {
  const eventType = draft.eventType;
  if (!["sprint", "capacity", "estimate"].includes(eventType)) throw new Error("Unsupported planning event type.");
  if (!draft.at?.endsWith("Z") || Number.isNaN(Date.parse(draft.at))) throw new Error("Planning event timestamp must be UTC ISO.");
  const version = history.filter((event) => event.eventType === eventType && event.subjectId === draft.subjectId).length + 1;
  const event = Object.freeze({ ...draft, version });
  return Object.freeze([event, ...history]);
}

export function effectiveEstimate(sourcePoints, estimateHistory, itemId) {
  if (Number.isFinite(sourcePoints) && sourcePoints > 0) return Object.freeze({ points: sourcePoints, source: "source", supersededLocalVersions: estimateHistory.filter((event) => event.eventType === "estimate" && event.subjectId === itemId).length });
  const local = estimateHistory.find((event) => event.eventType === "estimate" && event.subjectId === itemId && event.points > 0);
  return local ? Object.freeze({ points: local.points, source: "local", supersededLocalVersions: 0 }) : Object.freeze({ points: 0, source: "unestimated", supersededLocalVersions: 0 });
}

export function iterationCapacityState(iteration, localPlannedPoints, limits) {
  const sourcePoints = Math.max(0, iteration.sourceCommittedPoints ?? 0);
  const plannedPoints = sourcePoints + Math.max(0, localPlannedPoints);
  const state = plannedPoints > limits.max ? "over" : plannedPoints > limits.target ? "above" : "within";
  return Object.freeze({ sourcePoints, localPlannedPoints, plannedPoints, available: Math.max(0, limits.target - plannedPoints), overBy: Math.max(0, plannedPoints - limits.max), state, sourceAlreadyOver: sourcePoints > limits.max });
}

export function canAddToIteration(iteration, localPlannedPoints, candidatePoints, limits) {
  const current = iterationCapacityState(iteration, localPlannedPoints, limits);
  return !current.sourceAlreadyOver && current.plannedPoints + candidatePoints <= limits.max;
}

export function connectorStateMessage(state) {
  const messages = {
    loading: "Loading read-only iteration data",
    empty: "No active or upcoming source iterations",
    stale: "Source snapshot is stale — refresh required",
    error: "Connector error — local plans retained; no source changes made",
    renamed: "Source iteration renamed — stable ID preserved",
    reconciliation: "Source assignment differs from dashboard plan",
    synced: "Read-only source snapshot synchronized",
  };
  return messages[state] ?? messages.error;
}

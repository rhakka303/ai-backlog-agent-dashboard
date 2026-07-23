// Deterministic append-only decision-history rules shared by the UI and tests.
export function createDecisionSnapshot(draft) {
  if (!draft.at || !draft.at.endsWith("Z") || Number.isNaN(Date.parse(draft.at))) throw new Error("Decision timestamp must be a valid UTC ISO timestamp.");
  const inputs = Object.freeze({ ...draft.inputs });
  return Object.freeze({ ...draft, inputs });
}

export function appendDecisionSnapshot(history, draft) {
  const decisionVersion = history.filter((event) => event.itemId === draft.itemId && (event.eventType ?? "priority") === "priority").length + 1;
  const event = createDecisionSnapshot({ ...draft, eventType: "priority", decisionVersion });
  return Object.freeze([event, ...history]);
}

export function compareDecisionSnapshots(earlier, later) {
  if (!earlier || !later || earlier.itemId !== later.itemId) return null;
  return Object.freeze({
    itemId: earlier.itemId,
    versions: [earlier.decisionVersion, later.decisionVersion],
    score: [earlier.score, later.score],
    rank: [earlier.recommendedRank, later.recommendedRank],
    decision: [earlier.decision, later.decision],
  });
}

export function canEditPlannedSprint({ hasRecordedPriority, eligible, decision }) {
  return hasRecordedPriority || (eligible && decision !== "Draft");
}

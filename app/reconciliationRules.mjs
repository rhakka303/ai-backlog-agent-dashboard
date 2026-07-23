// Pure read-only source-plan reconciliation and human-authority rules.
export const RECONCILIATION_STATUSES = Object.freeze({
  confirmed: "Confirmed",
  awaiting: "Awaiting source update",
  different: "Different from plan",
  removed: "Source removed",
  unavailable: "Sprint unavailable",
});

export const CONNECTOR_CAPABILITIES = Object.freeze({
  allowedOperations: Object.freeze(["read", "compare"]),
  create: false,
  update: false,
  delete: false,
  transition: false,
  reorder: false,
  directAiAccess: false,
});

export function reconcilePlan({ plannedIterationId, sourceIterationId, sourceItemExists = true, iterations }) {
  if (!sourceItemExists) return Object.freeze({ code: "removed", label: RECONCILIATION_STATUSES.removed });
  if (plannedIterationId === "unassigned" || plannedIterationId === "future-backlog") return Object.freeze({ code: "awaiting", label: RECONCILIATION_STATUSES.awaiting });
  if (!iterations.some((iteration) => iteration.id === plannedIterationId && iteration.lifecycle !== "closed")) return Object.freeze({ code: "unavailable", label: RECONCILIATION_STATUSES.unavailable });
  if (!sourceIterationId) return Object.freeze({ code: "awaiting", label: RECONCILIATION_STATUSES.awaiting });
  if (sourceIterationId === plannedIterationId) return Object.freeze({ code: "confirmed", label: RECONCILIATION_STATUSES.confirmed });
  return Object.freeze({ code: "different", label: RECONCILIATION_STATUSES.different });
}

export function humanCanFinalize(actorType) {
  return actorType === "product-owner" || actorType === "authorized-delegate";
}

export function validateReadOnlyConnectorOperation(operation, initiatedBy) {
  if (initiatedBy === "ai") return Object.freeze({ allowed: false, reason: "AI cannot call source-system APIs directly." });
  const allowed = CONNECTOR_CAPABILITIES.allowedOperations.includes(operation);
  return Object.freeze({ allowed, reason: allowed ? "Read-only operation permitted." : "Source-system write capability is permanently disabled." });
}

// Deterministic human-authority policy shared by the UI and automated tests.
export const MAX_DELEGATION_HOURS = 168;

export function createDelegation({ id, delegateName, startsAt, expiresAt, grantedBy, grantedAt }) {
  const start = Date.parse(startsAt); const expiry = Date.parse(expiresAt); const granted = Date.parse(grantedAt);
  if (!id || !delegateName.trim() || !grantedBy.trim()) throw new Error("Delegation identity and grantor are required.");
  if (![start, expiry, granted].every(Number.isFinite)) throw new Error("Delegation timestamps must be valid UTC values.");
  if (expiry <= start) throw new Error("Delegation expiry must be after its start.");
  if (expiry - start > MAX_DELEGATION_HOURS * 60 * 60 * 1000) throw new Error(`Delegation cannot exceed ${MAX_DELEGATION_HOURS} hours.`);
  return Object.freeze({ id, delegateName: delegateName.trim(), startsAt: new Date(start).toISOString(), expiresAt: new Date(expiry).toISOString(), grantedBy: grantedBy.trim(), grantedAt: new Date(granted).toISOString(), revokedAt: null });
}
export function revokeDelegation(delegation, revokedAt) { if (!delegation || delegation.revokedAt) throw new Error("Only an active delegation can be revoked."); const at = Date.parse(revokedAt); if (!Number.isFinite(at)) throw new Error("Revocation timestamp must be valid UTC."); return Object.freeze({ ...delegation, revokedAt: new Date(at).toISOString() }); }
export function delegationStatus(delegation, now) { const at = Date.parse(now); if (!delegation || !Number.isFinite(at)) return "invalid"; if (delegation.revokedAt) return "revoked"; if (at < Date.parse(delegation.startsAt)) return "scheduled"; if (at >= Date.parse(delegation.expiresAt)) return "expired"; return "active"; }
export function canFinalizeDecision({ authenticated, role, delegation, now }) { if (!authenticated) return false; if (role === "product-owner") return true; return role === "authorized-delegate" && delegationStatus(delegation, now) === "active"; }

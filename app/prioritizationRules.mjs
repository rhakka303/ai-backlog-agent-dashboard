// Centralizes deterministic prioritization rules so UI behavior and tests use the same formulas.
export const FORMULA_VERSIONS = Object.freeze({
  WSJF: "wsjf-2.0",
  "Theme Scoring": "theme-2.0",
  "Relative Weighting": "relative-2.0",
});

const finiteInRange = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
const evidenceIsSpecific = (evidence) => evidence.trim().length >= 12 && !/^(none|n\/a|test|placeholder|customer feedback and delivery evidence)$/i.test(evidence.trim());

export function validateWeights(weights) {
  const values = Object.values(weights);
  if (!values.every((value) => finiteInRange(value, 0, 100))) return { valid: false, message: "Weights must each be between 0% and 100%." };
  const total = values.reduce((sum, value) => sum + value, 0);
  return total === 100 ? { valid: true, message: "100% valid" } : { valid: false, message: `${total}% — must total 100%` };
}

export function classifyEligibility(input) {
  if (input.mandatory) return { code: "mandatory", label: "Mandatory — not scored", valid: true };
  if (input.decision === "Defer") return { code: "deferred", label: "Deferred — not ranked", valid: false };
  if (!evidenceIsSpecific(input.evidence)) return { code: "insufficient", label: "Insufficient evidence", valid: false };
  if (!finiteInRange(input.jobSize, 0.01, Number.MAX_SAFE_INTEGER)) return { code: "refinement", label: "Needs refinement — estimate required", valid: false };
  return { code: "eligible", label: "Eligible for scoring", valid: true };
}

export function methodIsCompatible(method, level) {
  if (method === "Theme Scoring") return level === "Theme" || level === "Feature";
  return ["Feature", "Story", "Bug", "Enabler"].includes(level);
}

export function calculateScore(method, input, weights, population, details = false) {
  if (input.mandatory) return details ? { score: null, valuePercent: 0, costPercent: 0 } : null;
  const ratingsValid = [input.business, input.time, input.risk].every((value) => finiteInRange(value, 0, 20));
  if (!ratingsValid) return details ? { score: null, valuePercent: 0, costPercent: 0 } : null;
  let score = null; let valuePercent = 0; let costPercent = 0;
  if (method === "WSJF") score = input.jobSize > 0 ? (input.business + input.time + input.risk) / input.jobSize : null;
  if (method === "Theme Scoring" && validateWeights(weights).valid) score = (input.business * weights.business + input.time * weights.time + input.risk * weights.risk) / 100;
  if (method === "Relative Weighting") {
    const valueTotal = population.reduce((sum, candidate) => sum + candidate.business + candidate.time + candidate.risk, 0);
    const costTotal = population.reduce((sum, candidate) => sum + Math.max(0, candidate.jobSize), 0);
    valuePercent = valueTotal > 0 ? ((input.business + input.time + input.risk) / valueTotal) * 100 : 0;
    costPercent = costTotal > 0 ? (Math.max(0, input.jobSize) / costTotal) * 100 : 0;
    score = costPercent > 0 ? valuePercent / costPercent : null;
  }
  return details ? { score, valuePercent, costPercent } : score;
}

export function validateForRecording({ method, level, input, weights, includeDecision = true }) {
  const errors = [];
  if (!methodIsCompatible(method, level)) errors.push(`${method} cannot compare ${level} items.`);
  if (![input.business, input.time, input.risk].every((value) => finiteInRange(value, 0, 20))) errors.push("Ratings must be numbers from 0 through 20.");
  if (!input.mandatory && !evidenceIsSpecific(input.evidence)) errors.push("Provide specific evidence of at least 12 characters; placeholder text is not accepted.");
  if (!input.mandatory && !finiteInRange(input.jobSize, 0.01, Number.MAX_SAFE_INTEGER)) errors.push("Provide a positive Job Size or local planning estimate.");
  if (method === "Theme Scoring" && !validateWeights(weights).valid) errors.push(validateWeights(weights).message);
  if (method === "Relative Weighting" && input.jobSize <= 0) errors.push("Relative Weighting requires a positive cost estimate.");
  if (includeDecision && input.decision === "Draft") errors.push("Choose a human decision before recording.");
  if (includeDecision && input.decision === "Override" && !input.rationale.trim()) errors.push("Override requires a rationale.");
  return errors;
}

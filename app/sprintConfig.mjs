// Defines issue #34's canonical Sprint cadence, lifecycle, validation, and version history.
export const SPRINT_CONFIG_STORAGE_KEY = "ai-backlog-agent:sprint-config:v1";
export const FIXED_SAMPLE_CALCULATION_AT = "2026-07-20T19:00:00.000Z";
export const SPRINT_LENGTH_OPTIONS = Object.freeze([1, 2, 3, 4]);
export const SPRINT_DATE_FORMATS = Object.freeze(["MMM D, YYYY", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]);
export const OFFICIAL_TIME_ZONES = Object.freeze([
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "UTC",
]);
export const ACTIVE_SPRINT_POLICIES = Object.freeze({
  "warning-rationale-required": "Warn and require rationale",
  "disallow-local-planning": "Disallow dashboard-local additions",
});

export const defaultSprintConfig = Object.freeze({
  sprintLengthWeeks: 2,
  sprintOneStartDate: "2025-08-25",
  sequenceStart: 1,
  namingPrefix: "Sprint",
  officialTimeZone: "America/Los_Angeles",
  dateFormat: "MMM D, YYYY",
  planningHorizonDays: 90,
  activeSprintPlanningPolicy: "warning-rationale-required",
});

const DAY_MS = 86_400_000;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

function parseDateOnly(value) {
  if (!dateOnlyPattern.test(value ?? "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function toDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function isIanaTimeZone(value) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function calculationDateInTimeZone(calculationAt, timeZone) {
  const date = new Date(calculationAt);
  if (Number.isNaN(date.getTime())) throw new Error("Calculation timestamp must be a valid ISO timestamp.");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return parseDateOnly(`${value.year}-${value.month}-${value.day}`);
}

export function validateSprintConfig(candidate) {
  const config = candidate && typeof candidate === "object" ? candidate : {};
  const errors = [];
  if (!SPRINT_LENGTH_OPTIONS.includes(Number(config.sprintLengthWeeks))) errors.push({ field: "sprintLengthWeeks", message: "Sprint length must be 1, 2, 3, or 4 weeks." });
  if (!parseDateOnly(config.sprintOneStartDate)) errors.push({ field: "sprintOneStartDate", message: "Sprint 1 start must be a valid month, day, and year." });
  if (Number(config.sequenceStart) !== 1) errors.push({ field: "sequenceStart", message: "Sprint sequence must begin at 1." });
  if (typeof config.namingPrefix !== "string" || !config.namingPrefix.trim()) errors.push({ field: "namingPrefix", message: "Sprint naming prefix is required." });
  if (!isIanaTimeZone(config.officialTimeZone)) errors.push({ field: "officialTimeZone", message: "Official project time zone must be a valid IANA identifier." });
  if (!SPRINT_DATE_FORMATS.includes(config.dateFormat)) errors.push({ field: "dateFormat", message: "Select a supported date format." });
  if (!Number.isInteger(Number(config.planningHorizonDays)) || Number(config.planningHorizonDays) < 1 || Number(config.planningHorizonDays) > 365) errors.push({ field: "planningHorizonDays", message: "Planning horizon must be a whole number from 1 to 365 days." });
  if (!Object.hasOwn(ACTIVE_SPRINT_POLICIES, config.activeSprintPlanningPolicy)) errors.push({ field: "activeSprintPlanningPolicy", message: "Select an active-Sprint planning policy." });
  return Object.freeze(errors.map((error) => Object.freeze(error)));
}

export function normalizeSprintConfig(candidate) {
  const value = candidate && typeof candidate === "object" ? candidate : {};
  const normalized = {
    sprintLengthWeeks: Number(value.sprintLengthWeeks),
    sprintOneStartDate: typeof value.sprintOneStartDate === "string" ? value.sprintOneStartDate : "",
    sequenceStart: Number(value.sequenceStart),
    namingPrefix: typeof value.namingPrefix === "string" ? value.namingPrefix.trim() : "",
    officialTimeZone: typeof value.officialTimeZone === "string" ? value.officialTimeZone : "",
    dateFormat: typeof value.dateFormat === "string" ? value.dateFormat : "",
    planningHorizonDays: Number(value.planningHorizonDays),
    activeSprintPlanningPolicy: typeof value.activeSprintPlanningPolicy === "string" ? value.activeSprintPlanningPolicy : "",
  };
  return validateSprintConfig(normalized).length ? Object.freeze({ ...defaultSprintConfig }) : Object.freeze(normalized);
}

export function currentSprintSequence(config, calculationAt = FIXED_SAMPLE_CALCULATION_AT) {
  const errors = validateSprintConfig(config);
  if (errors.length) throw new Error(errors[0].message);
  const anchor = parseDateOnly(config.sprintOneStartDate);
  const calculationDate = calculationDateInTimeZone(calculationAt, config.officialTimeZone);
  const elapsedDays = Math.floor((calculationDate.getTime() - anchor.getTime()) / DAY_MS);
  if (elapsedDays < 0) return 0;
  return config.sequenceStart + Math.floor(elapsedDays / (config.sprintLengthWeeks * 7));
}

export function deriveSprint(sequence, config = defaultSprintConfig, calculationAt = FIXED_SAMPLE_CALCULATION_AT) {
  const errors = validateSprintConfig(config);
  if (errors.length) throw new Error(errors[0].message);
  if (!Number.isInteger(sequence) || sequence < config.sequenceStart) throw new Error(`Sprint sequence must be ${config.sequenceStart} or greater.`);
  const durationDays = config.sprintLengthWeeks * 7;
  const anchor = parseDateOnly(config.sprintOneStartDate);
  const startDate = addDays(anchor, (sequence - config.sequenceStart) * durationDays);
  const endDate = addDays(startDate, durationDays - 1);
  const currentSequence = currentSprintSequence(config, calculationAt);
  const lifecycle = sequence < currentSequence
    ? "Closed"
    : sequence === currentSequence
      ? "Current"
      : sequence === currentSequence + 1
        ? "Next"
        : "Upcoming";
  return Object.freeze({
    id: `sprint-${sequence}`,
    sequence,
    name: `${config.namingPrefix} ${sequence}`,
    startDate: toDateOnly(startDate),
    endDate: toDateOnly(endDate),
    lifecycle,
  });
}

export function defaultPlanningTarget(config = defaultSprintConfig, calculationAt = FIXED_SAMPLE_CALCULATION_AT) {
  const currentSequence = currentSprintSequence(config, calculationAt);
  return deriveSprint(Math.max(config.sequenceStart, currentSequence + 1), config, calculationAt);
}

export function activeSprintPlanningRequirement(config = defaultSprintConfig) {
  const policy = config.activeSprintPlanningPolicy;
  return Object.freeze({
    policy,
    label: ACTIVE_SPRINT_POLICIES[policy],
    allowed: policy !== "disallow-local-planning",
    warningRequired: policy === "warning-rationale-required",
    rationaleRequired: policy === "warning-rationale-required",
    enforcementOwner: "#42",
  });
}

export function formatSprintDate(value, format = defaultSprintConfig.dateFormat) {
  const date = parseDateOnly(value);
  if (!date) return "Invalid date";
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  if (format === "YYYY-MM-DD") return value;
  if (format === "MM/DD/YYYY") return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
  if (format === "DD/MM/YYYY") return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function changedSprintConfigFields(previous, next) {
  return Object.keys(defaultSprintConfig).filter((field) => previous[field] !== next[field]);
}

export function appendSprintConfigVersion(history, draft) {
  const previous = normalizeSprintConfig(draft.previousValue);
  const next = normalizeSprintConfig(draft.newValue);
  const changedFields = changedSprintConfigFields(previous, next);
  if (!changedFields.length) throw new Error("At least one Sprint configuration value must change.");
  if (!draft.actor?.trim()) throw new Error("Configuration actor is required.");
  if (!draft.rationale?.trim()) throw new Error("Configuration rationale is required.");
  if (!draft.at?.endsWith("Z") || Number.isNaN(Date.parse(draft.at))) throw new Error("Configuration timestamp must be UTC ISO.");
  const event = Object.freeze({
    id: draft.id ?? `sprint-config-v${history.length + 1}`,
    version: history.length + 1,
    actor: draft.actor.trim(),
    at: draft.at,
    rationale: draft.rationale.trim(),
    changedFields: Object.freeze(changedFields),
    previousValue: previous,
    newValue: next,
  });
  return Object.freeze([event, ...history]);
}

export function parseSprintConfigState(candidate) {
  const value = candidate && typeof candidate === "object" ? candidate : {};
  return Object.freeze({
    config: normalizeSprintConfig(value.config ?? defaultSprintConfig),
    history: Object.freeze(Array.isArray(value.history) ? value.history : []),
  });
}

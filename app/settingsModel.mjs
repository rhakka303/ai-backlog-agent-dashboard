// Defines the browser-local Profile and project-wide policy structure introduced by issue #33.
export const PROFILE_STORAGE_KEY = "ai-backlog-agent:profile:v1";
export const SAMPLE_DATA_STORAGE_KEY = "ai-backlog-agent:sample-data";

export const defaultProfile = Object.freeze({
  firstName: "Avery",
  lastName: "Morgan",
  email: "avery.morgan@example.test",
  title: "Product Owner",
  displayTimeZone: "America/Los_Angeles",
  dateFormat: "MMM D, YYYY",
  timeFormat: "12-hour",
  weekStartsOn: "Monday",
});

export const systemSettings = Object.freeze({
  workspace: {
    workspaceName: "Product Operations Lab",
    projectName: "CRM Modernization",
    officialTimeZone: "America/Los_Angeles",
  },
  sprint: {
    owner: "#34",
    status: "Configured",
    fields: ["cadence", "anchor date", "sequence", "naming", "planning horizon", "official boundaries", "active-Sprint policy"],
  },
  capacity: {
    owner: "#36",
    status: "Extension point",
    fields: ["team capacity", "planning target", "hard maximum", "change rationale"],
  },
  backlog: {
    dataSourceMode: "Representative sample data",
    sourcePrecedence: "Source facts override dashboard-local planning overlays",
    nativeStatePolicy: "Preserve native source State, including Testing",
    supportedWorkItemTypes: ["Epic", "Story", "Bug", "Enabler"],
    estimationPolicy: "Unestimated or 1, 2, 3, 5, 8, 13",
    agingPolicy: "Incomplete Age uses Created Date",
    cycleTimePolicy: "Completed Date minus Created Date",
    definitionOfReady: "Acceptance criteria, estimate, and dependencies confirmed",
    completionDefinition: "Native source State is Closed",
  },
  prioritization: {
    methods: ["WSJF", "Theme Scoring", "Relative Weighting"],
    formulaVersion: "prioritization-framework-2.0",
  },
  reporting: {
    burnupPolicy: "Completed estimated points against total estimated product scope",
    forecastPolicy: "Placeholder — statistical policy owned by Reports work",
  },
  governance: {
    decisionPolicy: "Human decision and rationale required",
    auditPolicy: "Versioned local prototype events; production durability not implemented",
    connectorPolicy: "Azure DevOps and Jira are strictly read-only",
  },
  data: {
    freshnessThreshold: "24 hours",
    sampleDataVersion: "canonical-sample-v1",
    fixedCalculationTime: "2026-07-20T19:00:00.000Z",
  },
});

export function normalizeProfile(candidate) {
  const value = candidate && typeof candidate === "object" ? candidate : {};
  return Object.fromEntries(
    Object.entries(defaultProfile).map(([key, fallback]) => [
      key,
      typeof value[key] === "string" && value[key].trim() ? value[key].trim() : fallback,
    ]),
  );
}

export function restoreSampleDefaults(storage) {
  storage.removeItem(SAMPLE_DATA_STORAGE_KEY);
  return {
    restoredVersion: systemSettings.data.sampleDataVersion,
    profilePreserved: storage.getItem(PROFILE_STORAGE_KEY) !== null,
  };
}

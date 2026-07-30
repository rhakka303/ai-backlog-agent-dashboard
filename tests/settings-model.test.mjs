// Verifies issue #33's fictional defaults, policy ownership, and profile-safe sample reset.
import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultProfile,
  normalizeProfile,
  PROFILE_STORAGE_KEY,
  restoreSampleDefaults,
  SAMPLE_DATA_STORAGE_KEY,
  systemSettings,
} from "../app/settingsModel.mjs";

test("profile defaults are fictional and complete", () => {
  assert.equal(defaultProfile.firstName, "Avery");
  assert.equal(defaultProfile.lastName, "Morgan");
  assert.match(defaultProfile.email, /@example\.test$/);
  assert.ok(defaultProfile.title);
  assert.ok(defaultProfile.displayTimeZone);
  assert.ok(defaultProfile.dateFormat);
  assert.ok(defaultProfile.timeFormat);
  assert.ok(defaultProfile.weekStartsOn);
});

test("profile normalization rejects empty stored values", () => {
  assert.deepEqual(normalizeProfile({ firstName: "  ", email: "fictional@example.test" }), {
    ...defaultProfile,
    email: "fictional@example.test",
  });
});

test("Sprint and capacity business logic remain delegated", () => {
  assert.equal(systemSettings.sprint.owner, "#34");
  assert.equal(systemSettings.capacity.owner, "#36");
  assert.equal(systemSettings.governance.connectorPolicy, "Azure DevOps and Jira are strictly read-only");
});

test("personal display time zone cannot change the official project boundary time zone", () => {
  const changedProfile = normalizeProfile({ ...defaultProfile, displayTimeZone: "UTC" });
  assert.equal(changedProfile.displayTimeZone, "UTC");
  assert.equal(systemSettings.workspace.officialTimeZone, "America/Los_Angeles");
});

test("every required policy family has an explicit model field", () => {
  assert.deepEqual(Object.keys(systemSettings.backlog), [
    "dataSourceMode",
    "sourcePrecedence",
    "nativeStatePolicy",
    "supportedWorkItemTypes",
    "estimationPolicy",
    "agingPolicy",
    "cycleTimePolicy",
    "definitionOfReady",
    "completionDefinition",
  ]);
  assert.ok(systemSettings.prioritization.formulaVersion);
  assert.ok(systemSettings.reporting.burnupPolicy);
  assert.ok(systemSettings.reporting.forecastPolicy);
  assert.ok(systemSettings.governance.auditPolicy);
  assert.ok(systemSettings.data.freshnessThreshold);
  assert.ok(systemSettings.data.sampleDataVersion);
});

test("sample reset preserves profile storage", () => {
  const values = new Map([
    [PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile)],
    [SAMPLE_DATA_STORAGE_KEY, "changed"],
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
  };
  const result = restoreSampleDefaults(storage);
  assert.equal(values.has(SAMPLE_DATA_STORAGE_KEY), false);
  assert.equal(values.has(PROFILE_STORAGE_KEY), true);
  assert.equal(result.profilePreserved, true);
});

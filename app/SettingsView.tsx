"use client";

// Provides issue #33's browser-local Profile editor and structured project policy workspace.
import { useEffect, useMemo, useState } from "react";
import {
  defaultProfile,
  normalizeProfile,
  PROFILE_STORAGE_KEY,
  restoreSampleDefaults,
  systemSettings,
} from "./settingsModel.mjs";
import {
  ACTIVE_SPRINT_POLICIES,
  activeSprintPlanningRequirement,
  appendSprintConfigVersion,
  defaultPlanningTarget,
  defaultSprintConfig,
  deriveSprint,
  formatSprintDate,
  OFFICIAL_TIME_ZONES,
  parseSprintConfigState,
  SPRINT_CONFIG_STORAGE_KEY,
  SPRINT_DATE_FORMATS,
  SPRINT_LENGTH_OPTIONS,
  validateSprintConfig,
} from "./sprintConfig.mjs";

type Profile = typeof defaultProfile;
type SprintConfig = {
  sprintLengthWeeks: number;
  sprintOneStartDate: string;
  sequenceStart: number;
  namingPrefix: string;
  officialTimeZone: string;
  dateFormat: string;
  planningHorizonDays: number;
  activeSprintPlanningPolicy: string;
};
type SprintConfigEvent = {
  id: string;
  version: number;
  actor: string;
  at: string;
  rationale: string;
  changedFields: string[];
  previousValue: SprintConfig;
  newValue: SprintConfig;
};
type SettingsSection = "profile" | "workspace" | "sprint" | "capacity" | "backlog" | "reporting" | "governance" | "data";

const sections: { id: SettingsSection; label: string; note: string }[] = [
  { id: "profile", label: "Profile", note: "Personal display preferences" },
  { id: "workspace", label: "Workspace", note: "Project identity and official time zone" },
  { id: "sprint", label: "Sprint", note: "Cadence, lifecycle, and planning policy" },
  { id: "capacity", label: "Capacity", note: "Governed capacity extension point" },
  { id: "backlog", label: "Backlog", note: "Data and metric policies" },
  { id: "reporting", label: "Reporting", note: "Burnup and forecast policy" },
  { id: "governance", label: "Governance", note: "Human authority and audit rules" },
  { id: "data", label: "Data source", note: "Freshness and sample controls" },
];

const timeZones = ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York", "UTC"];
const formatPolicyLabel = (label: string) => label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());

function PolicyList({ entries }: { entries: [string, string | string[]][] }) {
  return (
    <dl className="policy-list">
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt>{formatPolicyLabel(label)}</dt>
          <dd>{Array.isArray(value) ? value.join(", ") : value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function SettingsView({
  onProfileChange,
  onSprintConfigChange,
  onNotice,
}: {
  onProfileChange: (profile: Profile) => void;
  onSprintConfigChange: (config: SprintConfig) => void;
  onNotice: (message: string) => void;
}) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [savedProfile, setSavedProfile] = useState<Profile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [sprintDraft, setSprintDraft] = useState<SprintConfig>({ ...defaultSprintConfig });
  const [savedSprintConfig, setSavedSprintConfig] = useState<SprintConfig>({ ...defaultSprintConfig });
  const [sprintHistory, setSprintHistory] = useState<SprintConfigEvent[]>([]);
  const [sprintRationale, setSprintRationale] = useState("");
  const [sprintLoaded, setSprintLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
        const nextProfile = normalizeProfile(stored ? JSON.parse(stored) : defaultProfile) as Profile;
        setProfile(nextProfile);
        setSavedProfile(nextProfile);
        onProfileChange(nextProfile);
      } catch {
        setProfile(defaultProfile);
        setSavedProfile(defaultProfile);
        onProfileChange(defaultProfile);
      } finally {
        setLoaded(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [onProfileChange]);

  const dirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(savedProfile), [profile, savedProfile]);
  const sprintDirty = useMemo(() => JSON.stringify(sprintDraft) !== JSON.stringify(savedSprintConfig), [sprintDraft, savedSprintConfig]);
  const sprintErrors = useMemo(() => validateSprintConfig(sprintDraft), [sprintDraft]);
  const sprintPreview = useMemo(() => sprintErrors.length ? [] : [17, 24, 25, 26].map((sequence) => deriveSprint(sequence, sprintDraft)), [sprintDraft, sprintErrors]);
  const planningTarget = useMemo(() => sprintErrors.length ? null : defaultPlanningTarget(sprintDraft), [sprintDraft, sprintErrors]);
  const activeSprintRequirement = useMemo(() => sprintErrors.length ? null : activeSprintPlanningRequirement(sprintDraft), [sprintDraft, sprintErrors]);
  const setField = (field: keyof Profile, value: string) => setProfile((current) => ({ ...current, [field]: value }));
  const setSprintField = <K extends keyof SprintConfig>(field: K, value: SprintConfig[K]) => setSprintDraft((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(SPRINT_CONFIG_STORAGE_KEY);
        const state = parseSprintConfigState(stored ? JSON.parse(stored) : {});
        const config = { ...state.config } as SprintConfig;
        setSprintDraft(config);
        setSavedSprintConfig(config);
        setSprintHistory(state.history as SprintConfigEvent[]);
        onSprintConfigChange(config);
      } catch {
        const config = { ...defaultSprintConfig } as SprintConfig;
        setSprintDraft(config);
        setSavedSprintConfig(config);
        setSprintHistory([]);
        onSprintConfigChange(config);
      } finally {
        setSprintLoaded(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [onSprintConfigChange]);

  const saveProfile = () => {
    const normalized = normalizeProfile(profile) as Profile;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
    setProfile(normalized);
    setSavedProfile(normalized);
    onProfileChange(normalized);
    onNotice("Profile preferences saved in this browser");
  };

  const saveSprintConfig = () => {
    if (sprintErrors.length) {
      onNotice("Correct the Sprint configuration validation errors before saving");
      return;
    }
    if (!sprintRationale.trim()) {
      onNotice("A rationale is required for every Sprint configuration change");
      return;
    }
    const nextHistory = appendSprintConfigVersion(sprintHistory, {
      id: `sprint-config-${Date.now()}`,
      actor: "Product Owner",
      at: new Date().toISOString(),
      rationale: sprintRationale,
      previousValue: savedSprintConfig,
      newValue: sprintDraft,
    }) as SprintConfigEvent[];
    const nextConfig = { ...sprintDraft };
    window.localStorage.setItem(SPRINT_CONFIG_STORAGE_KEY, JSON.stringify({ config: nextConfig, history: nextHistory }));
    setSavedSprintConfig(nextConfig);
    setSprintHistory(nextHistory);
    setSprintRationale("");
    onSprintConfigChange(nextConfig);
    onNotice(`Sprint configuration version ${nextHistory[0].version} saved`);
  };

  const resetSampleData = () => {
    const result = restoreSampleDefaults(window.localStorage);
    setResetOpen(false);
    onNotice(`Sample data restored to ${result.restoredVersion}. Profile preferences were preserved.`);
  };

  return (
    <section className="settings-workspace" aria-label="Profile and System Settings">
      <aside className="settings-nav" aria-label="Settings sections">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>Profile &amp; Settings</h2>
          <p>Personal preferences stay separate from official project rules.</p>
        </div>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? "settings-nav-item active" : "settings-nav-item"}
              onClick={() => setActiveSection(section.id)}
              aria-current={activeSection === section.id ? "page" : undefined}
            >
              <strong>{section.label}</strong>
              <span>{section.note}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="settings-content">
        {activeSection === "profile" && (
          <section className="settings-panel" aria-labelledby="profile-heading">
            <div className="settings-heading">
              <div><p className="eyebrow">Browser-local prototype</p><h2 id="profile-heading">Profile</h2><p>These fictional sample values demonstrate preferences without publishing real personal data.</p></div>
              <span className="sample-badge">Fictional identity</span>
            </div>
            <div className="settings-form">
              <label><span>First name</span><input value={profile.firstName} onChange={(event) => setField("firstName", event.target.value)} /></label>
              <label><span>Last name</span><input value={profile.lastName} onChange={(event) => setField("lastName", event.target.value)} /></label>
              <label><span>Email</span><input type="email" value={profile.email} onChange={(event) => setField("email", event.target.value)} /></label>
              <label><span>Title</span><input value={profile.title} onChange={(event) => setField("title", event.target.value)} /></label>
              <label><span>Display time zone</span><select value={profile.displayTimeZone} onChange={(event) => setField("displayTimeZone", event.target.value)}>{timeZones.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
              <label><span>Date format</span><select value={profile.dateFormat} onChange={(event) => setField("dateFormat", event.target.value)}><option>MMM D, YYYY</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></label>
              <label><span>Time format</span><select value={profile.timeFormat} onChange={(event) => setField("timeFormat", event.target.value)}><option>12-hour</option><option>24-hour</option></select></label>
              <label><span>Calendar week starts</span><select value={profile.weekStartsOn} onChange={(event) => setField("weekStartsOn", event.target.value)}><option>Monday</option><option>Sunday</option></select></label>
            </div>
            <div className="settings-callout"><strong>Display preference only</strong><span>Changing your personal time zone changes how timestamps are displayed. Official Sprint and reporting boundaries remain in {savedSprintConfig.officialTimeZone}.</span></div>
            <div className="settings-actions"><span aria-live="polite">{loaded && dirty ? "Unsaved profile changes" : "Profile preferences are current"}</span><button className="primary-button" onClick={saveProfile} disabled={!loaded || !dirty}>Save profile</button></div>
          </section>
        )}

        {activeSection === "workspace" && (
          <section className="settings-panel" aria-labelledby="workspace-heading">
            <div className="settings-heading"><div><p className="eyebrow">Official project context</p><h2 id="workspace-heading">Workspace</h2><p>Shared identity and time boundaries apply consistently across the dashboard.</p></div></div>
            <PolicyList entries={[
              ["Workspace", systemSettings.workspace.workspaceName],
              ["Project", systemSettings.workspace.projectName],
              ["Official project time zone", savedSprintConfig.officialTimeZone],
            ]} />
            <div className="settings-callout"><strong>One official clock</strong><span>Personal display preferences never move Sprint start/end dates or reporting boundaries.</span></div>
          </section>
        )}

        {activeSection === "sprint" && (
          <section className="settings-panel" aria-labelledby="sprint-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Canonical project cadence</p><h2 id="sprint-settings-heading">Sprint settings</h2><p>One governed configuration calculates Sprint identity, dates, lifecycle, and the normal planning target everywhere.</p></div><span className="sample-badge">Configured</span></div>
            <div className="settings-form sprint-settings-form">
              <label><span>Sprint length</span><select value={sprintDraft.sprintLengthWeeks} onChange={(event) => setSprintField("sprintLengthWeeks", Number(event.target.value))}>{SPRINT_LENGTH_OPTIONS.map((weeks) => <option key={weeks} value={weeks}>{weeks} {weeks === 1 ? "week" : "weeks"}</option>)}</select></label>
              <label><span>Sprint 1 start date</span><input type="date" value={sprintDraft.sprintOneStartDate} aria-describedby="sprint-anchor-help" onChange={(event) => setSprintField("sprintOneStartDate", event.target.value)} /><small id="sprint-anchor-help">Calendar date including month, day, and year</small></label>
              <label><span>Sequence begins</span><input type="number" value={sprintDraft.sequenceStart} readOnly aria-readonly="true" /></label>
              <label><span>Naming prefix</span><input value={sprintDraft.namingPrefix} onChange={(event) => setSprintField("namingPrefix", event.target.value)} /></label>
              <label><span>Official project time zone</span><select value={sprintDraft.officialTimeZone} onChange={(event) => setSprintField("officialTimeZone", event.target.value)}>{OFFICIAL_TIME_ZONES.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
              <label><span>Date format</span><select value={sprintDraft.dateFormat} onChange={(event) => setSprintField("dateFormat", event.target.value)}>{SPRINT_DATE_FORMATS.map((format) => <option key={format}>{format}</option>)}</select></label>
              <label><span>Planning horizon</span><div className="input-with-unit"><input type="number" min="1" max="365" value={sprintDraft.planningHorizonDays} onChange={(event) => setSprintField("planningHorizonDays", Number(event.target.value))} /><span>calendar days</span></div></label>
              <label><span>Current-Sprint planning</span><select value={sprintDraft.activeSprintPlanningPolicy} onChange={(event) => setSprintField("activeSprintPlanningPolicy", event.target.value)}>{Object.entries(ACTIVE_SPRINT_POLICIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </div>
            {sprintErrors.length > 0 && <div className="settings-validation" role="alert"><strong>Configuration needs attention</strong><ul>{sprintErrors.map((error: { field: string; message: string }) => <li key={error.field}>{error.message}</li>)}</ul></div>}
            {sprintErrors.length === 0 && <div className="sprint-config-preview" aria-label="Derived Sprint examples">
              <div className="sprint-preview-heading"><div><strong>Derived lifecycle preview</strong><span>Fixed sample calculation: Jul 20, 2026 at 12:00 PM Pacific</span></div>{planningTarget && <span className="planning-target-badge">Default planning target: {planningTarget.name} ({planningTarget.lifecycle})</span>}</div>
              <div className="sprint-preview-grid">{sprintPreview.map((sprint) => <article key={sprint.sequence}><span className={`sprint-lifecycle sprint-lifecycle-${sprint.lifecycle.toLowerCase()}`}>{sprint.lifecycle}</span><strong>{sprint.name}</strong><small>{formatSprintDate(sprint.startDate, sprintDraft.dateFormat)} – {formatSprintDate(sprint.endDate, sprintDraft.dateFormat)}</small></article>)}</div>
            </div>}
            {activeSprintRequirement && <div className="settings-callout warning"><strong>Current delivery context</strong><span>{activeSprintRequirement.label}. Child 11 (#42) owns Prioritization enforcement; this configuration exposes warning and rationale requirements without implementing that later workflow here.</span></div>}
            <div className="settings-form sprint-change-form">
              <label><span>Change rationale</span><textarea value={sprintRationale} placeholder="Explain why this shared Sprint configuration is changing" onChange={(event) => setSprintRationale(event.target.value)} /></label>
            </div>
            <div className="settings-actions"><span aria-live="polite">{!sprintLoaded ? "Loading Sprint configuration" : sprintErrors.length ? `${sprintErrors.length} validation issue${sprintErrors.length === 1 ? "" : "s"}` : sprintDirty ? "Unsaved Sprint configuration changes" : "Sprint configuration is current"}</span><button className="primary-button" onClick={saveSprintConfig} disabled={!sprintLoaded || !sprintDirty || sprintErrors.length > 0 || !sprintRationale.trim()}>Save configuration</button></div>
            <section className="sprint-config-history" aria-labelledby="sprint-config-history-heading">
              <div className="panel-heading"><div><h3 id="sprint-config-history-heading">Configuration history</h3><p>Each saved change records complete previous and new values.</p></div><span className="coming-badge">{sprintHistory.length} versions</span></div>
              {sprintHistory.length ? <div>{sprintHistory.map((event) => <article key={event.id}><time>{event.at}</time><strong>Version {event.version} · {event.changedFields.map(formatPolicyLabel).join(", ")}</strong><span>{event.actor} · {event.rationale}</span><small>Previous: {event.changedFields.map((field) => `${formatPolicyLabel(field)} ${String(event.previousValue[field as keyof SprintConfig])}`).join(" · ")}</small><small>New: {event.changedFields.map((field) => `${formatPolicyLabel(field)} ${String(event.newValue[field as keyof SprintConfig])}`).join(" · ")}</small></article>)}</div> : <div className="empty-state compact"><strong>No configuration changes recorded</strong><span>The accepted prototype defaults are active. Saving a change creates version 1.</span></div>}
            </section>
          </section>
        )}

        {activeSection === "capacity" && (
          <section className="settings-panel" aria-labelledby="capacity-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Owned by issue #36</p><h2 id="capacity-settings-heading">Capacity settings</h2><p>Governed capacity controls will attach here without duplicating policy in this story.</p></div><span className="extension-badge">Extension point</span></div>
            <PolicyList entries={[["Owner", systemSettings.capacity.owner], ["Planned fields", systemSettings.capacity.fields]]} />
          </section>
        )}

        {activeSection === "backlog" && (
          <section className="settings-panel" aria-labelledby="backlog-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Canonical policies</p><h2 id="backlog-settings-heading">Backlog</h2><p>Documented model fields keep source facts, local planning, and calculations distinguishable.</p></div></div>
            <PolicyList entries={Object.entries(systemSettings.backlog)} />
            <h3 className="settings-subheading">Prioritization methods</h3>
            <PolicyList entries={[["Methods", systemSettings.prioritization.methods], ["Formula version", systemSettings.prioritization.formulaVersion]]} />
          </section>
        )}

        {activeSection === "reporting" && (
          <section className="settings-panel" aria-labelledby="reporting-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Transparent calculations</p><h2 id="reporting-settings-heading">Reporting</h2><p>Current rules and future forecast policy remain explicit rather than hidden in components.</p></div></div>
            <PolicyList entries={Object.entries(systemSettings.reporting)} />
          </section>
        )}

        {activeSection === "governance" && (
          <section className="settings-panel" aria-labelledby="governance-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Human authority</p><h2 id="governance-settings-heading">Governance</h2><p>The prototype makes decision ownership and connector boundaries visible.</p></div></div>
            <PolicyList entries={Object.entries(systemSettings.governance)} />
          </section>
        )}

        {activeSection === "data" && (
          <section className="settings-panel" aria-labelledby="data-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Sample environment</p><h2 id="data-settings-heading">Data source</h2><p>Reset representative sample data without changing browser-local Profile preferences.</p></div></div>
            <PolicyList entries={Object.entries(systemSettings.data)} />
            <div className="danger-zone">
              <div><strong>Restore sample defaults</strong><span>Clears dashboard sample-data changes only. Your Profile remains untouched.</span></div>
              <button className="secondary-button" onClick={() => setResetOpen(true)}>Restore defaults</button>
            </div>
          </section>
        )}
      </div>

      <div className={resetOpen ? "modal-wrap open" : "modal-wrap"} aria-hidden={!resetOpen}>
        <div className="modal-scrim" onClick={() => setResetOpen(false)} />
        <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-heading">
          <p className="eyebrow">Confirmation required</p>
          <h2 id="reset-heading">Restore sample defaults?</h2>
          <p>This removes browser-local sample-data changes. Profile preferences are stored separately and will be preserved.</p>
          <div><button className="secondary-button" onClick={() => setResetOpen(false)}>Cancel</button><button className="danger-button" onClick={resetSampleData}>Restore sample data</button></div>
        </section>
      </div>
    </section>
  );
}

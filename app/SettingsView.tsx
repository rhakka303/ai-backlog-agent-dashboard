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

type Profile = typeof defaultProfile;
type SettingsSection = "profile" | "workspace" | "sprint" | "capacity" | "backlog" | "reporting" | "governance" | "data";

const sections: { id: SettingsSection; label: string; note: string }[] = [
  { id: "profile", label: "Profile", note: "Personal display preferences" },
  { id: "workspace", label: "Workspace", note: "Project identity and official time zone" },
  { id: "sprint", label: "Sprint", note: "Configuration extension point" },
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
  onNotice,
}: {
  onProfileChange: (profile: Profile) => void;
  onNotice: (message: string) => void;
}) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [savedProfile, setSavedProfile] = useState<Profile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

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
  const setField = (field: keyof Profile, value: string) => setProfile((current) => ({ ...current, [field]: value }));

  const saveProfile = () => {
    const normalized = normalizeProfile(profile) as Profile;
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
    setProfile(normalized);
    setSavedProfile(normalized);
    onProfileChange(normalized);
    onNotice("Profile preferences saved in this browser");
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
            <div className="settings-callout"><strong>Display preference only</strong><span>Changing your personal time zone changes how timestamps are displayed. Official Sprint and reporting boundaries remain in {systemSettings.workspace.officialTimeZone}.</span></div>
            <div className="settings-actions"><span aria-live="polite">{loaded && dirty ? "Unsaved profile changes" : "Profile preferences are current"}</span><button className="primary-button" onClick={saveProfile} disabled={!loaded || !dirty}>Save profile</button></div>
          </section>
        )}

        {activeSection === "workspace" && (
          <section className="settings-panel" aria-labelledby="workspace-heading">
            <div className="settings-heading"><div><p className="eyebrow">Official project context</p><h2 id="workspace-heading">Workspace</h2><p>Shared identity and time boundaries apply consistently across the dashboard.</p></div></div>
            <PolicyList entries={[
              ["Workspace", systemSettings.workspace.workspaceName],
              ["Project", systemSettings.workspace.projectName],
              ["Official project time zone", systemSettings.workspace.officialTimeZone],
            ]} />
            <div className="settings-callout"><strong>One official clock</strong><span>Personal display preferences never move Sprint start/end dates or reporting boundaries.</span></div>
          </section>
        )}

        {activeSection === "sprint" && (
          <section className="settings-panel" aria-labelledby="sprint-settings-heading">
            <div className="settings-heading"><div><p className="eyebrow">Owned by issue #34</p><h2 id="sprint-settings-heading">Sprint settings</h2><p>This section reserves the canonical home for Sprint controls without implementing their business logic early.</p></div><span className="extension-badge">Extension point</span></div>
            <PolicyList entries={[["Owner", systemSettings.sprint.owner], ["Planned fields", systemSettings.sprint.fields]]} />
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

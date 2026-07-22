"use client";

import { useMemo, useState } from "react";
import PrioritizationView from "./PrioritizationView";

type Snapshot = {
  label: string;
  backlog: number;
  completed: number;
  ready: number;
  aging: number;
  predictability: number;
};

type BacklogItem = {
  id: string;
  title: string;
  kind: "Story" | "Bug" | "Enabler";
  age: number;
  status: "Ready" | "Needs refinement" | "Blocked";
  points: number | null;
  state: string;
  currentIterationId: string | null;
};

type SourceIteration = { id: string; name: string; startAt: string; endAt: string; lifecycle: "closed" | "active" | "upcoming"; sourceCommittedPoints: number };
type SourceProject = Omit<Project, "items" | "iterations"> & { items: Omit<BacklogItem, "state" | "currentIterationId">[] };

type Project = {
  name: string;
  shortName: string;
  history: Snapshot[];
  items: BacklogItem[];
  iterations: SourceIteration[];
};

const sourceProjects: SourceProject[] = [
  {
    name: "CRM Modernization",
    shortName: "CRM",
    history: [
      { label: "Sprint 17", backlog: 64, completed: 14, ready: 10, aging: 17, predictability: 61 },
      { label: "Sprint 18", backlog: 66, completed: 16, ready: 11, aging: 18, predictability: 64 },
      { label: "Sprint 19", backlog: 61, completed: 18, ready: 9, aging: 16, predictability: 66 },
      { label: "Sprint 20", backlog: 59, completed: 16, ready: 10, aging: 15, predictability: 67 },
      { label: "Sprint 21", backlog: 57, completed: 18, ready: 7, aging: 14, predictability: 69 },
      { label: "Sprint 22", backlog: 54, completed: 20, ready: 6, aging: 13, predictability: 68 },
      { label: "Sprint 23", backlog: 49, completed: 22, ready: 7, aging: 12, predictability: 70 },
      { label: "Sprint 24", backlog: 42, completed: 22, ready: 8, aging: 11, predictability: 72 },
    ],
    items: [
      { id: "CRM-184", title: "Merge duplicate customer profiles", kind: "Story", age: 67, status: "Needs refinement", points: 8 },
      { id: "CRM-207", title: "Retry failed identity sync", kind: "Bug", age: 54, status: "Blocked", points: 5 },
      { id: "CRM-193", title: "Define consent audit fields", kind: "Enabler", age: 43, status: "Needs refinement", points: 3 },
      { id: "CRM-226", title: "Add account hierarchy search", kind: "Story", age: 28, status: "Ready", points: 5 },
      { id: "CRM-231", title: "Improve bulk import errors", kind: "Bug", age: 19, status: "Needs refinement", points: 3 },
      { id: "CRM-238", title: "Create renewal activity view", kind: "Story", age: 12, status: "Ready", points: 5 },
      { id: "CRM-244", title: "Document API rate limits", kind: "Enabler", age: 7, status: "Ready", points: 2 },
      { id: "CRM-249", title: "Expose customer timezone", kind: "Story", age: 3, status: "Ready", points: null },
    ],
  },
  {
    name: "Customer Portal",
    shortName: "Portal",
    history: [
      { label: "Sprint 17", backlog: 51, completed: 11, ready: 8, aging: 12, predictability: 69 },
      { label: "Sprint 18", backlog: 48, completed: 13, ready: 9, aging: 11, predictability: 72 },
      { label: "Sprint 19", backlog: 46, completed: 15, ready: 9, aging: 10, predictability: 74 },
      { label: "Sprint 20", backlog: 44, completed: 14, ready: 8, aging: 10, predictability: 76 },
      { label: "Sprint 21", backlog: 41, completed: 17, ready: 9, aging: 8, predictability: 78 },
      { label: "Sprint 22", backlog: 39, completed: 17, ready: 9, aging: 8, predictability: 80 },
      { label: "Sprint 23", backlog: 37, completed: 19, ready: 10, aging: 7, predictability: 82 },
      { label: "Sprint 24", backlog: 35, completed: 20, ready: 10, aging: 6, predictability: 84 },
    ],
    items: [
      { id: "WEB-92", title: "Clarify account lockout message", kind: "Story", age: 48, status: "Needs refinement", points: 3 },
      { id: "WEB-106", title: "Resolve payment receipt mismatch", kind: "Bug", age: 35, status: "Blocked", points: 5 },
      { id: "WEB-118", title: "Add preferred contact method", kind: "Story", age: 24, status: "Ready", points: 3 },
      { id: "WEB-124", title: "Instrument profile completion", kind: "Enabler", age: 18, status: "Ready", points: 2 },
      { id: "WEB-132", title: "Improve mobile invoice filters", kind: "Story", age: 11, status: "Ready", points: 5 },
      { id: "WEB-141", title: "Add accessible error summary", kind: "Story", age: 6, status: "Ready", points: null },
    ],
  },
  {
    name: "Identity Consolidation",
    shortName: "Identity",
    history: [
      { label: "Sprint 17", backlog: 58, completed: 9, ready: 9, aging: 19, predictability: 52 },
      { label: "Sprint 18", backlog: 60, completed: 10, ready: 8, aging: 20, predictability: 54 },
      { label: "Sprint 19", backlog: 57, completed: 12, ready: 10, aging: 19, predictability: 55 },
      { label: "Sprint 20", backlog: 56, completed: 12, ready: 10, aging: 18, predictability: 57 },
      { label: "Sprint 21", backlog: 54, completed: 14, ready: 11, aging: 17, predictability: 58 },
      { label: "Sprint 22", backlog: 53, completed: 15, ready: 11, aging: 16, predictability: 60 },
      { label: "Sprint 23", backlog: 52, completed: 15, ready: 12, aging: 16, predictability: 61 },
      { label: "Sprint 24", backlog: 51, completed: 17, ready: 12, aging: 15, predictability: 63 },
    ],
    items: [
      { id: "IAM-61", title: "Map legacy privileged roles", kind: "Enabler", age: 81, status: "Blocked", points: 8 },
      { id: "IAM-74", title: "Define contractor access expiry", kind: "Story", age: 58, status: "Needs refinement", points: 5 },
      { id: "IAM-79", title: "Handle duplicate directory IDs", kind: "Bug", age: 46, status: "Needs refinement", points: 5 },
      { id: "IAM-88", title: "Pilot manager access reviews", kind: "Story", age: 31, status: "Ready", points: 8 },
      { id: "IAM-96", title: "Document break-glass process", kind: "Enabler", age: 20, status: "Ready", points: 3 },
      { id: "IAM-103", title: "Add provisioning audit event", kind: "Story", age: 9, status: "Ready", points: null },
    ],
  },
];

const nativeStates = ["New", "Approved", "Committed", "Active", "Testing", "Closed", "Removed"];
const sourceIterations = (shortName: string): SourceIteration[] => [
  { id: `${shortName.toLowerCase()}-sprint-23`, name: "Sprint 23", startAt: "2026-06-17T00:00:00.000Z", endAt: "2026-06-30T23:59:59.000Z", lifecycle: "closed", sourceCommittedPoints: 22 },
  { id: `${shortName.toLowerCase()}-sprint-24`, name: "Sprint 24", startAt: "2026-07-01T00:00:00.000Z", endAt: "2026-07-14T23:59:59.000Z", lifecycle: "active", sourceCommittedPoints: 18 },
  { id: `${shortName.toLowerCase()}-sprint-25`, name: "Sprint 25", startAt: "2026-07-15T00:00:00.000Z", endAt: "2026-07-28T23:59:59.000Z", lifecycle: "upcoming", sourceCommittedPoints: 0 },
  { id: `${shortName.toLowerCase()}-sprint-26`, name: "Sprint 26", startAt: "2026-07-29T00:00:00.000Z", endAt: "2026-08-11T23:59:59.000Z", lifecycle: "upcoming", sourceCommittedPoints: 0 },
  { id: `${shortName.toLowerCase()}-sprint-27`, name: "Sprint 27", startAt: "2026-08-12T00:00:00.000Z", endAt: "2026-08-25T23:59:59.000Z", lifecycle: "upcoming", sourceCommittedPoints: 0 },
  { id: `${shortName.toLowerCase()}-sprint-28`, name: "Sprint 28", startAt: "2026-08-26T00:00:00.000Z", endAt: "2026-09-08T23:59:59.000Z", lifecycle: "upcoming", sourceCommittedPoints: 0 },
];
const projects: Project[] = sourceProjects.map((project, projectIndex) => ({
  ...project,
  iterations: sourceIterations(project.shortName),
  items: project.items.map((item, itemIndex) => { const state = nativeStates[(itemIndex + projectIndex * 2) % nativeStates.length]; return { ...item, state, currentIterationId: ["Committed", "Active", "Testing"].includes(state) ? `${project.shortName.toLowerCase()}-sprint-24` : null }; }),
}));

const navItems = ["Overview", "Backlog", "Prioritization", "Sprints", "Reports", "AI Insights"];

function delta(current: number, previous: number) {
  return current - previous;
}

function MetricCard({
  label,
  value,
  note,
  tone = "teal",
  symbol,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "teal" | "amber";
  symbol: string;
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-icon" aria-hidden="true">{symbol}</div>
      <div>
        <div className="metric-value">{value}</div>
        <h2>{label}</h2>
        <p>{note}</p>
      </div>
    </article>
  );
}

function TrendChart({
  data,
  showBacklog,
  showCompleted,
  onToggleBacklog,
  onToggleCompleted,
}: {
  data: Snapshot[];
  showBacklog: boolean;
  showCompleted: boolean;
  onToggleBacklog: () => void;
  onToggleCompleted: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 680;
  const height = 300;
  const pad = { left: 44, right: 20, top: 24, bottom: 45 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxY = Math.max(80, ...data.map((item) => Math.max(item.backlog, item.completed)));
  const x = (index: number) => pad.left + (chartW * index) / Math.max(1, data.length - 1);
  const y = (value: number) => pad.top + chartH - (value / maxY) * chartH;
  const backlogPoints = data.map((item, index) => `${x(index)},${y(item.backlog)}`).join(" ");
  const completedPoints = data.map((item, index) => `${x(index)},${y(item.completed)}`).join(" ");
  const yTicks = [0, 20, 40, 60, 80].filter((tick) => tick <= maxY);

  return (
    <div className="trend-wrap">
      <div className="chart-legend" aria-label="Chart series controls">
        <button className={showBacklog ? "legend active" : "legend"} onClick={onToggleBacklog} aria-pressed={showBacklog}>
          <span className="legend-swatch backlog-swatch" /> Total backlog
        </button>
        <button className={showCompleted ? "legend active" : "legend"} onClick={onToggleCompleted} aria-pressed={showCompleted}>
          <span className="legend-swatch completed-swatch" /> Completed
        </button>
      </div>
      <div className="chart-scroll">
        <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="trend-title trend-desc">
          <title id="trend-title">Backlog and completion trend</title>
          <desc id="trend-desc">{`Across ${data.length} sprints, backlog changed from ${data[0].backlog} to ${data[data.length - 1].backlog} items.`}</desc>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} className="grid-line" />
              <text x={pad.left - 12} y={y(tick) + 4} textAnchor="end" className="axis-label">{tick}</text>
            </g>
          ))}
          {showCompleted && (
            <>
              <polyline points={completedPoints} className="completed-line" />
              {data.map((item, index) => (
                <circle key={`completed-${item.label}`} cx={x(index)} cy={y(item.completed)} r="4" className="completed-dot" />
              ))}
            </>
          )}
          {showBacklog && (
            <>
              <polyline points={backlogPoints} className="backlog-line" />
              {data.map((item, index) => (
                <circle key={`backlog-${item.label}`} cx={x(index)} cy={y(item.backlog)} r="5" className="backlog-dot" />
              ))}
            </>
          )}
          {data.map((item, index) => (
            <g
              key={item.label}
              tabIndex={0}
              role="button"
              aria-label={`${item.label}: ${item.backlog} backlog items, ${item.completed} completed`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              className="chart-hit-area"
            >
              <rect x={x(index) - 28} y={pad.top} width="56" height={chartH} fill="transparent" />
              <text x={x(index)} y={height - 16} textAnchor="middle" className="x-label">{item.label.replace("Sprint ", "S")}</text>
              {hovered === index && (
                <g className="chart-tooltip">
                  <rect x={Math.min(width - 140, Math.max(8, x(index) - 60))} y={36} width="126" height="61" rx="8" />
                  <text x={Math.min(width - 128, Math.max(20, x(index) - 48))} y="58" className="tooltip-title">{item.label}</text>
                  <text x={Math.min(width - 128, Math.max(20, x(index) - 48))} y="77">{item.backlog} backlog • {item.completed} done</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<"overview" | "backlog" | "prioritization" | "sprints">("overview");
  const [projectIndex, setProjectIndex] = useState(0);
  const [sprintIndex, setSprintIndex] = useState(7);
  const [range, setRange] = useState<4 | 8>(8);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [itemFilter, setItemFilter] = useState<"all" | "aging" | "not-ready">("all");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [backlogSearch, setBacklogSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [readinessFilter, setReadinessFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("age");
  const [selectedItem, setSelectedItem] = useState<BacklogItem | null>(null);
  const [sprintSearch, setSprintSearch] = useState("");
  const [sprintStatus, setSprintStatus] = useState("all");

  const project = projects[projectIndex];
  const snapshot = project.history[sprintIndex];
  const previous = project.history[Math.max(0, sprintIndex - 1)];
  const chartData = project.history.slice(Math.max(0, sprintIndex - range + 1), sprintIndex + 1);
  const start = chartData[0];
  const backlogChange = snapshot.backlog - start.backlog;
  const backlogPct = Math.round((Math.abs(backlogChange) / start.backlog) * 100);
  const completionAverage = Math.round(chartData.reduce((sum, item) => sum + item.completed, 0) / chartData.length);

  const agingBands = useMemo(() => {
    const sixty = Math.max(1, Math.round(snapshot.aging * 0.45));
    const thirty = Math.max(1, snapshot.aging - sixty);
    const fifteen = Math.max(1, Math.round(snapshot.backlog * 0.24));
    const fresh = Math.max(0, snapshot.backlog - sixty - thirty - fifteen);
    return [
      { label: "> 60 days", value: sixty, tone: "risk" },
      { label: "30–60 days", value: thirty, tone: "warn" },
      { label: "15–30 days", value: fifteen, tone: "watch" },
      { label: "0–15 days", value: fresh, tone: "fresh" },
    ];
  }, [snapshot]);

  const flow = [
    { label: "In progress", value: Math.round(snapshot.backlog * 0.55), tone: "teal" },
    { label: "In review", value: Math.round(snapshot.backlog * 0.17), tone: "teal" },
    { label: "Blocked", value: Math.max(1, Math.round(snapshot.backlog * 0.07)), tone: "amber" },
  ];

  const visibleItems = project.items
    .filter((item) => itemFilter === "all" || (itemFilter === "aging" ? item.age > 30 : item.status !== "Ready"))
    .filter((item) => `${item.id} ${item.title}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.age - a.age);

  const priorityOf = (item: BacklogItem) => item.status === "Blocked" ? "Critical" : item.age > 45 ? "High" : item.age > 20 ? "Medium" : "Low";
  const evidenceOf = (item: BacklogItem) => ({
    criteria: item.status === "Ready" || item.age % 2 === 0,
    estimate: item.points !== null,
    dependencies: item.status !== "Blocked",
  });
  const isEvidenceReady = (item: BacklogItem) => Object.values(evidenceOf(item)).every(Boolean);
  const backlogItems = project.items
    .filter((item) => `${item.id} ${item.title}`.toLowerCase().includes(backlogSearch.toLowerCase()))
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .filter((item) => kindFilter === "all" || item.kind === kindFilter)
    .filter((item) => ageFilter === "all" || (ageFilter === "30" ? item.age >= 30 : item.age >= 60))
    .filter((item) => readinessFilter === "all" || (readinessFilter === "ready" ? isEvidenceReady(item) : !isEvidenceReady(item)))
    .filter((item) => stateFilter === "all" || item.state === stateFilter)
    .sort((a, b) => sortBy === "age" ? b.age - a.age : sortBy === "priority" ? ["Critical", "High", "Medium", "Low"].indexOf(priorityOf(a)) - ["Critical", "High", "Medium", "Low"].indexOf(priorityOf(b)) : a.id.localeCompare(b.id));
  const sprintPool = project.items.slice(0, Math.min(6, project.items.length));
  const sprintStatusOf = (item: BacklogItem, index: number) => item.status === "Blocked" ? "Blocked" : index < Math.max(1, Math.round((snapshot.completed / 22) * 3)) ? "Done" : index % 3 === 0 ? "In review" : "In progress";
  const sprintItems = sprintPool
    .map((item, index) => ({ item, sprintStatus: sprintStatusOf(item, index) }))
    .filter(({ item }) => `${item.id} ${item.title}`.toLowerCase().includes(sprintSearch.toLowerCase()))
    .filter(({ sprintStatus: state }) => sprintStatus === "all" || state === sprintStatus);
  const committedPoints = sprintPool.reduce((sum, item) => sum + (item.points ?? 0), 0);
  const completedPoints = sprintPool.reduce((sum, item, index) => sum + (sprintStatusOf(item, index) === "Done" ? (item.points ?? 0) : 0), 0);
  const blockedPoints = sprintPool.reduce((sum, item, index) => sum + (sprintStatusOf(item, index) === "Blocked" ? (item.points ?? 0) : 0), 0);
  const scopeAdded = (sprintIndex + projectIndex) % 4 + 1;
  const scopeRemoved = (sprintIndex + projectIndex) % 2;
  const stateCounts = nativeStates.map((state) => ({ state, count: project.items.filter((item) => item.state === state).length })).filter((item) => item.count > 0);
  const sprintStateCounts = nativeStates.map((state) => ({ state, count: sprintPool.filter((item) => item.state === state).length })).filter((item) => item.count > 0);

  const changeProject = (nextIndex: number) => {
    setProjectIndex(nextIndex);
    setSprintIndex(projects[nextIndex].history.length - 1);
    setSelectedItem(null);
    setNotice(`Dashboard updated to ${projects[nextIndex].name}`);
  };

  const showComingNext = (label: string) => {
    setNotice(`${label} is reserved for the future AI service. No live AI recommendation was generated.`);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-mark" aria-label="AI Backlog Agent"><span /><span /><span /></div>
        <nav>
          {navItems.map((item, index) => (
            <button key={item} className={(item.toLowerCase() === activeView) ? "nav-item active" : "nav-item"} onClick={() => {
              if (item === "Overview" || item === "Backlog" || item === "Prioritization" || item === "Sprints") setActiveView(item.toLowerCase() as "overview" | "backlog" | "prioritization" | "sprints");
              else setNotice(`${item} is reserved for the next prototype increment.`);
            }}>
              <span className="nav-glyph" aria-hidden="true">{["⌂", "≡", "◇", "□", "↗", "✦"][index]}</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="avatar">SG</div>
          <div><strong>Prototype mode</strong><span>Local sample data</span></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Product operations workspace</p>
            <h1>{activeView === "overview" ? "AI Backlog Agent" : activeView === "backlog" ? "Backlog" : activeView === "prioritization" ? "Prioritization" : "Sprints"}</h1>
          </div>
          <div className="topbar-actions">
            <label className="select-control">
              <span className="sr-only">Project</span>
              <span aria-hidden="true">□</span>
              <select value={projectIndex} onChange={(event) => changeProject(Number(event.target.value))}>
                {projects.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
              </select>
            </label>
            {(activeView === "overview" || activeView === "sprints") && <label className="select-control sprint-select">
              <span className="sr-only">Sprint snapshot</span>
              <span aria-hidden="true">▣</span>
              <select value={sprintIndex} onChange={(event) => { setSprintIndex(Number(event.target.value)); setNotice("Sprint snapshot updated"); }}>
                {project.history.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>}
            {activeView === "overview" ? <button className="primary-button" onClick={() => setDrawerOpen(true)}>Review backlog <span aria-hidden="true">→</span></button> : <button className="secondary-button" onClick={() => setActiveView("overview")}>← Back to overview</button>}
          </div>
        </header>

        {activeView === "overview" ? <><section className="metric-grid" aria-label="Backlog summary">
          <MetricCard symbol="▤" value={String(snapshot.backlog)} label="Backlog items" note={`${Math.abs(delta(snapshot.backlog, previous.backlog))} ${delta(snapshot.backlog, previous.backlog) <= 0 ? "fewer" : "more"} than last sprint`} />
          <MetricCard symbol="✓" value={String(snapshot.ready)} label="Ready" note={`${Math.round((snapshot.ready / snapshot.backlog) * 100)}% of the backlog`} />
          <MetricCard symbol="◷" value={String(snapshot.aging)} label="Aging" note="Items older than 30 days" tone="amber" />
          <MetricCard symbol="↗" value={`${snapshot.predictability}%`} label="Predictability" note={`${delta(snapshot.predictability, previous.predictability) >= 0 ? "+" : ""}${delta(snapshot.predictability, previous.predictability)} points this sprint`} />
        </section>

        <section className="state-report" aria-label="Work item state counts"><div><p className="eyebrow">Native workflow</p><h2>Items by state</h2><span>Read-only source values</span></div><div className="state-count-list">{stateCounts.map(({state, count}) => <article key={state}><span className={`native-state native-state-${state.toLowerCase().replaceAll(" ", "-")}`}>{state}</span><strong>{count}</strong></article>)}</div></section>

        <section className="dashboard-grid">
          <article className="panel trend-panel">
            <div className="panel-heading">
              <div><h2>Backlog trend</h2><p>{chartData.length} sprint view</p></div>
              <div className="segmented" aria-label="Trend range">
                <button className={range === 4 ? "selected" : ""} onClick={() => setRange(4)} aria-pressed={range === 4}>4</button>
                <button className={range === 8 ? "selected" : ""} onClick={() => setRange(8)} aria-pressed={range === 8}>8</button>
              </div>
            </div>
            <TrendChart data={chartData} showBacklog={showBacklog} showCompleted={showCompleted} onToggleBacklog={() => setShowBacklog((value) => !value)} onToggleCompleted={() => setShowCompleted((value) => !value)} />
            <div className="trend-callout">
              <div className="callout-icon" aria-hidden="true">↘</div>
              <div>
                <strong>Backlog {backlogChange <= 0 ? "down" : "up"} {Math.abs(backlogChange)} items ({backlogPct}%) in this view.</strong>
                <span>Average completion per sprint: {completionAverage} items.</span>
              </div>
            </div>
          </article>

          <article className="panel flow-panel">
            <div className="panel-heading"><div><h2>Aging &amp; flow</h2><p>Current snapshot</p></div></div>
            <h3>Aging bands <span>(items)</span></h3>
            <div className="aging-list">
              {agingBands.map((band) => (
                <div className="aging-row" key={band.label}>
                  <span className={`age-tag ${band.tone}`}>{band.label}</span><strong>{band.value}</strong>
                </div>
              ))}
            </div>
            <div className="divider" />
            <h3>Flow status</h3>
            <div className="flow-list">
              {flow.map((item) => (
                <div className="flow-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="progress-track"><i className={item.tone} style={{ width: `${Math.min(100, (item.value / snapshot.backlog) * 100)}%` }} /></div>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel ai-panel">
            <div className="panel-heading"><div><h2>AI Insights</h2><p>Future analysis space</p></div><span className="coming-badge">Coming next</span></div>
            <div className="ai-placeholder">
              <div className="spark-orb" aria-hidden="true">✦</div>
              <h3>Ask better backlog questions</h3>
              <p>This reserved area can later connect backlog evidence to explainable AI suggestions.</p>
              <div className="prompt-list">
                {["What should we refine first?", "Spot aging risks", "Summarize sprint movement"].map((prompt) => (
                  <button key={prompt} aria-disabled="true" onClick={() => showComingNext(prompt)} title="Planned AI capability">
                    <span aria-hidden="true">◎</span>{prompt}<span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="text-button" onClick={() => setGuideOpen(true)}>See how to extend this prototype <span aria-hidden="true">→</span></button>
          </article>
        </section>

        <footer className="prototype-footer">
          <span><i /> Sample data • No external systems connected</span>
          <button onClick={() => setGuideOpen(true)}>Implementation notes</button>
        </footer></> : activeView === "prioritization" ? <PrioritizationView projectName={project.name} items={project.items} iterations={project.iterations} /> : activeView === "backlog" ? <section className="backlog-workspace" aria-label={`${project.name} backlog`}>
          <div className="backlog-intro">
            <div><p className="eyebrow">{project.shortName} delivery inventory</p><h2>Refine with evidence, not instinct</h2><p>Search, sort, and inspect representative sample items. Readiness is based on visible evidence.</p></div>
            <span className="sample-badge">Sample data</span>
          </div>

          <div className="backlog-summary">
            <article><span>Visible items</span><strong>{backlogItems.length}</strong></article>
            <article><span>Evidence ready</span><strong>{project.items.filter(isEvidenceReady).length}</strong></article>
            <article><span>Aging 30+ days</span><strong>{project.items.filter((item) => item.age >= 30).length}</strong></article>
            <article><span>Blocked</span><strong>{project.items.filter((item) => item.status === "Blocked").length}</strong></article>
          </div>
          <section className="state-report compact" aria-label="Backlog state counts"><div><p className="eyebrow">Native workflow</p><h2>Items by state</h2></div><div className="state-count-list">{stateCounts.map(({state, count}) => <article key={state}><span className={`native-state native-state-${state.toLowerCase().replaceAll(" ", "-")}`}>{state}</span><strong>{count}</strong></article>)}</div></section>

          <div className="backlog-toolbar">
            <label className="backlog-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search backlog</span><input value={backlogSearch} onChange={(event) => setBacklogSearch(event.target.value)} placeholder="Search ID or title" /></label>
            <label><span>Readiness</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All readiness</option><option>Ready</option><option>Needs refinement</option><option>Blocked</option></select></label>
            <label><span>Type</span><select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option value="all">All types</option><option>Story</option><option>Bug</option><option>Enabler</option></select></label>
            <label><span>Age</span><select value={ageFilter} onChange={(event) => setAgeFilter(event.target.value)}><option value="all">Any age</option><option value="30">30+ days</option><option value="60">60+ days</option></select></label>
            <label><span>Readiness</span><select value={readinessFilter} onChange={(event) => setReadinessFilter(event.target.value)}><option value="all">All evidence</option><option value="ready">Evidence ready</option><option value="missing">Missing evidence</option></select></label>
            <label><span>State</span><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}><option value="all">All states</option>{nativeStates.map((state) => <option key={state}>{state}</option>)}</select></label>
            <label><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="age">Oldest first</option><option value="priority">Priority</option><option value="id">Item ID</option></select></label>
          </div>

          <div className="backlog-table-wrap">
            <table className="backlog-table">
              <thead><tr><th>Item</th><th>Type</th><th>State</th><th>Priority</th><th>Readiness</th><th>Age</th><th>Points</th><th>Evidence</th><th><span className="sr-only">Open</span></th></tr></thead>
              <tbody>{backlogItems.map((item) => <tr key={item.id}>
                <td data-label="Item"><button className="item-link" onClick={() => setSelectedItem(item)}><strong>{item.id}</strong><span>{item.title}</span></button></td>
                <td data-label="Type">{item.kind}</td><td data-label="State"><span className={`native-state native-state-${item.state.toLowerCase().replaceAll(" ", "-")}`}>{item.state}</span></td><td data-label="Priority"><span className={`priority priority-${priorityOf(item).toLowerCase()}`}>{priorityOf(item)}</span></td>
                <td data-label="Readiness"><span className={`status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span></td>
                <td data-label="Age" className={item.age >= 30 ? "age-risk" : ""}>{item.age} days</td><td data-label="Points">{item.points ?? "Unestimated"}</td>
                <td data-label="Readiness"><span className={isEvidenceReady(item) ? "readiness ready" : "readiness missing"}>{isEvidenceReady(item) ? "✓ Evidence ready" : `! ${Object.values(evidenceOf(item)).filter((value) => !value).length} missing`}</span></td>
                <td><button className="row-open" onClick={() => setSelectedItem(item)} aria-label={`Open ${item.id}`}>›</button></td>
              </tr>)}</tbody>
            </table>
            {backlogItems.length === 0 && <div className="empty-state"><strong>No matching items</strong><span>Clear one or more filters to see the backlog.</span><button className="secondary-button" onClick={() => { setBacklogSearch(""); setStatusFilter("all"); setKindFilter("all"); setAgeFilter("all"); setReadinessFilter("all"); setStateFilter("all"); }}>Clear filters</button></div>}
          </div>
          <footer className="prototype-footer"><span><i /> Representative backlog • No live system connected</span><button onClick={() => setGuideOpen(true)}>Implementation notes</button></footer>
        </section> : <section className="sprint-workspace" aria-label={`${project.name} ${snapshot.label}`}>
          <div className="sprint-hero">
            <div><p className="eyebrow">{project.shortName} • {snapshot.label}</p><h2>{project.name} delivery sprint</h2><p className="sprint-dates">July {1 + sprintIndex * 2}–{14 + sprintIndex * 2}, 2026</p></div>
            <div className="sprint-goal"><span>Sprint goal</span><strong>{projectIndex === 0 ? "Make customer data safer and easier to act on" : projectIndex === 1 ? "Reduce friction in the customer self-service journey" : "Strengthen identity governance and auditability"}</strong></div>
          </div>

          <div className="sprint-summary">
            <article><span>Committed</span><strong>{committedPoints} pts</strong><small>{sprintPool.length} items</small></article>
            <article><span>Completed</span><strong>{completedPoints} pts</strong><small>{Math.round((completedPoints / committedPoints) * 100)}% of commitment</small></article>
            <article><span>Remaining</span><strong>{committedPoints - completedPoints} pts</strong><small>Across active work</small></article>
            <article className={blockedPoints ? "sprint-risk-card" : ""}><span>Blocked</span><strong>{blockedPoints} pts</strong><small>{blockedPoints ? "! Attention required" : "No blocked work"}</small></article>
          </div>

          <div className="sprint-health-grid">
            <article className="panel sprint-progress-panel"><div className="panel-heading"><div><h2>Sprint progress</h2><p>Point completion</p></div><strong className="progress-percent">{Math.round((completedPoints / committedPoints) * 100)}%</strong></div><div className="sprint-progress-track"><i style={{width: `${(completedPoints / committedPoints) * 100}%`}} /></div><div className="progress-labels"><span>{completedPoints} completed</span><span>{committedPoints - completedPoints} remaining</span></div><h3 className="state-subheading">Sprint items by native state</h3><div className="status-distribution">{sprintStateCounts.map(({state, count}) => <div key={state}><span>{state}</span><strong>{count}</strong></div>)}</div></article>
            <article className="panel scope-panel"><div className="panel-heading"><div><h2>Scope movement</h2><p>Since sprint start</p></div></div><div className="scope-stat added"><span>+ Added</span><strong>{scopeAdded} items</strong></div><div className="scope-stat removed"><span>− Removed</span><strong>{scopeRemoved} items</strong></div><p className="scope-note">! Scope changed after commitment. Confirm the trade-off during sprint review.</p></article>
            <article className="panel sprint-ai-panel"><div className="panel-heading"><div><h2>AI risk insights</h2><p>Reserved analysis space</p></div><span className="coming-badge">Coming next</span></div><div className="sprint-ai-empty"><span aria-hidden="true">✦</span><strong>Evidence before advice</strong><p>Future AI observations will cite sprint items, scope movement, and calculation time.</p></div></article>
          </div>

          <div className="sprint-items-panel">
            <div className="sprint-items-heading"><div><h2>Sprint items</h2><p>{sprintItems.length} of {sprintPool.length} representative items</p></div><div className="sprint-controls"><label className="backlog-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search sprint items</span><input value={sprintSearch} onChange={(event) => setSprintSearch(event.target.value)} placeholder="Search sprint items" /></label><label><span className="sr-only">Filter sprint status</span><select value={sprintStatus} onChange={(event) => setSprintStatus(event.target.value)}><option value="all">All statuses</option><option>Done</option><option>In review</option><option>In progress</option><option>Blocked</option></select></label></div></div>
            <div className="sprint-item-list">{sprintItems.map(({item, sprintStatus: state}) => <button className="sprint-item-row" key={item.id} onClick={() => setSelectedItem(item)}><span className={`native-state native-state-${item.state.toLowerCase().replaceAll(" ", "-")}`}>{item.state}</span><span className="sprint-item-title"><strong>{item.id}</strong>{item.title}</span><span className={`sprint-state sprint-state-${state.toLowerCase().replaceAll(" ", "-")}`}>{state === "Blocked" ? "! " : state === "Done" ? "✓ " : ""}{state}</span><span>{item.points === null ? "Unestimated" : `${item.points} pts`}</span><span className={item.age > 30 ? "age-risk" : ""}>{item.age}d old</span><span aria-hidden="true">›</span></button>)}</div>
            {sprintItems.length === 0 && <div className="empty-state"><strong>No matching sprint items</strong><span>Change the search or status filter.</span><button className="secondary-button" onClick={() => { setSprintSearch(""); setSprintStatus("all"); }}>Clear filters</button></div>}
          </div>
          <footer className="prototype-footer"><span><i /> Representative sprint • No live system connected</span><button onClick={() => setActiveView("backlog")}>Open Backlog</button></footer>
        </section>}
      </section>

      <div className={selectedItem ? "scrim open" : "scrim"} onClick={() => setSelectedItem(null)} aria-hidden="true" />
      <aside className={selectedItem ? "review-drawer open" : "review-drawer"} aria-hidden={!selectedItem} aria-label="Backlog item details">
        {selectedItem && <><div className="drawer-heading"><div><p className="eyebrow">{selectedItem.id} • {selectedItem.kind}</p><h2>{selectedItem.title}</h2><span>{priorityOf(selectedItem)} priority</span></div><button className="icon-button" onClick={() => setSelectedItem(null)} aria-label="Close item details">×</button></div>
        <p className="item-description">A representative {selectedItem.kind.toLowerCase()} for the {project.name} backlog. Connect your source system later to display the full description, owner, and discussion history.</p>
        <div className="detail-grid"><div><span>Native state</span><strong>{selectedItem.state}</strong></div><div><span>Readiness</span><strong>{selectedItem.status}</strong></div><div><span>Age</span><strong>{selectedItem.age} days</strong></div><div><span>Estimate</span><strong>{selectedItem.points === null ? "Unestimated" : `${selectedItem.points} points`}</strong></div><div><span>Priority</span><strong>{priorityOf(selectedItem)}</strong></div></div>
        {activeView === "sprints" ? <section className="evidence-panel"><p className="eyebrow">Delivery risk</p><h3>Risk evidence</h3>{Object.entries({ "Blocked dependency": selectedItem.status === "Blocked", "Aging over 30 days": selectedItem.age > 30, "High or critical priority": ["High", "Critical"].includes(priorityOf(selectedItem)) }).map(([label, risk]) => <div className="evidence-row" key={label}><span className={risk ? "evidence-icon absent" : "evidence-icon present"}>{risk ? "!" : "✓"}</span><span>{label}</span><strong>{risk ? "Risk found" : "Clear"}</strong></div>)}<p className="evidence-note">Risk evidence uses explicit labels and symbols so it never depends on color alone.</p></section> : <section className="evidence-panel"><p className="eyebrow">Definition of ready</p><h3>Readiness evidence</h3>{Object.entries({ "Acceptance criteria": evidenceOf(selectedItem).criteria, "Estimate confirmed": evidenceOf(selectedItem).estimate, "Dependencies clear": evidenceOf(selectedItem).dependencies }).map(([label, present]) => <div className="evidence-row" key={label}><span className={present ? "evidence-icon present" : "evidence-icon absent"}>{present ? "✓" : "!"}</span><span>{label}</span><strong>{present ? "Present" : "Missing"}</strong></div>)}<p className="evidence-note">Readiness is calculated from these checks, so missing evidence is never communicated by color alone.</p></section>}</>}
      </aside>

      <div className={drawerOpen ? "scrim open" : "scrim"} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={drawerOpen ? "review-drawer open" : "review-drawer"} aria-hidden={!drawerOpen} aria-label="Backlog review">
        <div className="drawer-heading">
          <div><p className="eyebrow">{project.shortName} • {snapshot.label}</p><h2>Review backlog</h2><span>Representative items, oldest first</span></div>
          <button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Close backlog review">×</button>
        </div>
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID or title" /></label>
        <div className="filter-row" aria-label="Backlog filters">
          {([['all', 'All'], ['aging', 'Aging 30+ days'], ['not-ready', 'Not ready']] as const).map(([value, label]) => (
            <button key={value} className={itemFilter === value ? "active" : ""} onClick={() => setItemFilter(value)} aria-pressed={itemFilter === value}>{label}</button>
          ))}
        </div>
        <div className="item-count">Showing {visibleItems.length} representative items</div>
        <div className="backlog-list">
          {visibleItems.map((item) => (
            <article className="backlog-item" key={item.id}>
              <div className="item-top"><strong>{item.id}</strong><span className={`status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span></div>
              <h3>{item.title}</h3>
              <div className="item-meta"><span>{item.kind}</span><span>{item.points === null ? "Unestimated" : `${item.points} points`}</span><span className={item.age > 30 ? "old" : ""}>{item.age} days old</span></div>
            </article>
          ))}
          {visibleItems.length === 0 && <div className="empty-state"><strong>No matching items</strong><span>Try a different filter or search term.</span></div>}
        </div>
      </aside>

      <div className={guideOpen ? "modal-wrap open" : "modal-wrap"} aria-hidden={!guideOpen}>
        <div className="modal-scrim" onClick={() => setGuideOpen(false)} />
        <section className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
          <div className="drawer-heading"><div><p className="eyebrow">Developer handoff</p><h2 id="guide-title">Extend the backlog agent</h2></div><button className="icon-button" onClick={() => setGuideOpen(false)} aria-label="Close implementation notes">×</button></div>
          <div className="guide-steps">
            <article><span>01</span><div><h3>Replace sample data</h3><p>Map Azure DevOps, Jira, or Google Sheets fields into the project and snapshot shapes already used by the dashboard.</p><code>source → normalize → dashboard metrics</code></div></article>
            <article><span>02</span><div><h3>Make metric rules configurable</h3><p>Move aging thresholds, “ready” policy, sprint windows, and predictability math into a team-level configuration.</p><code>agingDays: [15, 30, 60]</code></div></article>
            <article><span>03</span><div><h3>Add an evidence-first AI endpoint</h3><p>Send normalized metrics and selected backlog items to the model. Return citations to item IDs, the calculation window, and a generated-at timestamp.</p><code>insight + evidence[] + generatedAt</code></div></article>
            <article><span>04</span><div><h3>Keep a human approval step</h3><p>Treat suggestions as review prompts, never automatic prioritization. Let the Product Owner accept, edit, or dismiss every recommendation.</p><code>suggest → review → decide</code></div></article>
          </div>
          <div className="guide-note"><strong>Good first integration:</strong> start with a read-only CSV or Google Sheets import. It makes the metric definitions testable before adding live write-back.</div>
        </section>
      </div>

      <div className={notice ? "toast show" : "toast"} role="status" aria-live="polite">
        <span>{notice}</span>{notice && <button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>}
      </div>
    </main>
  );
}

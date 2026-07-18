"use client";

import { useMemo, useState } from "react";

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
  points: number;
};

type Project = {
  name: string;
  shortName: string;
  history: Snapshot[];
  items: BacklogItem[];
};

const projects: Project[] = [
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
      { id: "CRM-249", title: "Expose customer timezone", kind: "Story", age: 3, status: "Ready", points: 2 },
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
      { id: "WEB-141", title: "Add accessible error summary", kind: "Story", age: 6, status: "Ready", points: 3 },
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
      { id: "IAM-103", title: "Add provisioning audit event", kind: "Story", age: 9, status: "Ready", points: 5 },
    ],
  },
];

const navItems = ["Overview", "Backlog", "Sprints", "Reports", "AI Insights"];

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

  const changeProject = (nextIndex: number) => {
    setProjectIndex(nextIndex);
    setSprintIndex(projects[nextIndex].history.length - 1);
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
            <button key={item} className={index === 0 ? "nav-item active" : "nav-item"} onClick={() => index !== 0 && setNotice(`${item} is represented in this single-page prototype.`)}>
              <span className="nav-glyph" aria-hidden="true">{["⌂", "≡", "□", "↗", "✦"][index]}</span>
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
            <h1>AI Backlog Agent</h1>
          </div>
          <div className="topbar-actions">
            <label className="select-control">
              <span className="sr-only">Project</span>
              <span aria-hidden="true">□</span>
              <select value={projectIndex} onChange={(event) => changeProject(Number(event.target.value))}>
                {projects.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
              </select>
            </label>
            <label className="select-control sprint-select">
              <span className="sr-only">Sprint snapshot</span>
              <span aria-hidden="true">▣</span>
              <select value={sprintIndex} onChange={(event) => { setSprintIndex(Number(event.target.value)); setNotice("Sprint snapshot updated"); }}>
                {project.history.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>
            <button className="primary-button" onClick={() => setDrawerOpen(true)}>Review backlog <span aria-hidden="true">→</span></button>
          </div>
        </header>

        <section className="metric-grid" aria-label="Backlog summary">
          <MetricCard symbol="▤" value={String(snapshot.backlog)} label="Backlog items" note={`${Math.abs(delta(snapshot.backlog, previous.backlog))} ${delta(snapshot.backlog, previous.backlog) <= 0 ? "fewer" : "more"} than last sprint`} />
          <MetricCard symbol="✓" value={String(snapshot.ready)} label="Ready" note={`${Math.round((snapshot.ready / snapshot.backlog) * 100)}% of the backlog`} />
          <MetricCard symbol="◷" value={String(snapshot.aging)} label="Aging" note="Items older than 30 days" tone="amber" />
          <MetricCard symbol="↗" value={`${snapshot.predictability}%`} label="Predictability" note={`${delta(snapshot.predictability, previous.predictability) >= 0 ? "+" : ""}${delta(snapshot.predictability, previous.predictability)} points this sprint`} />
        </section>

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
        </footer>
      </section>

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
              <div className="item-meta"><span>{item.kind}</span><span>{item.points} points</span><span className={item.age > 30 ? "old" : ""}>{item.age} days old</span></div>
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

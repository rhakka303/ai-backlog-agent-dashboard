"use client";

// Provides the governed, browser-local prioritization workspace for the prototype.
import { useEffect, useState } from "react";
import {
  FRAMEWORK_VERSION,
  FORMULA_VERSIONS,
  calculateScore,
  classifyEligibility,
  methodIsCompatible,
  validateForRecording,
  validateWeights,
} from "./prioritizationRules.mjs";
import { appendDecisionSnapshot, canEditPlannedSprint, compareDecisionSnapshots } from "./decisionHistory.mjs";

type Item = { id: string; title: string; kind: string; state: string; status: string; points: number; age: number };
type ScoreInput = { business: number; time: number; risk: number; jobSize: number; confidence: "High" | "Medium" | "Low"; evidence: string; rationale: string; decision: string; plannedSprint: string; mandatory: boolean };
type Method = "WSJF" | "Theme Scoring" | "Relative Weighting";
type ComparisonLevel = "Theme" | "Feature" | "Story" | "Bug" | "Enabler";
type History = {
  readonly id: string; readonly itemId: string; readonly at: string; readonly eventType: "priority"; readonly method: Method; readonly formulaVersion: string; readonly frameworkVersion: string; readonly score: number | null;
  currentRank: number; recommendedRank: number | null; decision: string; decisionVersion: number;
  sprint: string; rationale: string; actor: string; participants: string; evidence: string;
  readonly inputs: Readonly<{ business: number; time: number; risk: number; jobSize: number; confidence: string }>;
};

const initial = (item: Item): ScoreInput => ({
  business: 0, time: 0, risk: 0, jobSize: item.points || 0, confidence: "Low", evidence: "",
  rationale: "", decision: "Draft", plannedSprint: "Unassigned", mandatory: false,
});

const sprintTone: Record<string, string> = { "Sprint 24": "sage", "Sprint 25": "mint", "Sprint 26": "blue", "Sprint 27": "violet", "Future backlog": "sand", Unassigned: "neutral" };
const comparisonLevels: ComparisonLevel[] = ["Theme", "Feature", "Story", "Bug", "Enabler"];

export default function PrioritizationView({ projectName, items }: { projectName: string; items: Item[] }) {
  const storageKey = `priority-prototype:${projectName}`;
  const availableLevels = comparisonLevels.filter((level) => items.some((item) => item.kind === level));
  const [comparisonLevel, setComparisonLevel] = useState<ComparisonLevel>(() => availableLevels[0] ?? "Story");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(items.map((item) => item.id)));
  const [method, setMethod] = useState<Method>("WSJF");
  const [inputs, setInputs] = useState<Record<string, ScoreInput>>(() => Object.fromEntries(items.map((item) => [item.id, initial(item)])));
  const [history, setHistory] = useState<History[]>([]);
  const [compareFrom, setCompareFrom] = useState("");
  const [compareTo, setCompareTo] = useState("");
  const [notice, setNotice] = useState("");
  const [actor, setActor] = useState("Steven");
  const [participants, setParticipants] = useState("Product Owner and Development Team");
  const [weights, setWeights] = useState({ business: 40, time: 25, risk: 35 });
  const [capacity, setCapacity] = useState({ "Sprint 24": { target: 22, max: 28 }, "Sprint 25": { target: 24, max: 30 }, "Sprint 26": { target: 28, max: 34 }, "Sprint 27": { target: 30, max: 36 } });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        // Browser-local prototype state is restored only after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputs((current) => ({ ...current, ...data.inputs }));
        setHistory(data.history ?? []);
        setCapacity((current) => ({ ...current, ...data.capacity }));
      }
    } catch { /* Browser storage is optional prototype persistence. */ }
  }, [storageKey]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify({ inputs, history, capacity })); } catch { /* Keep the interactive session usable if storage is unavailable. */ } }, [storageKey, inputs, history, capacity]);

  const change = <K extends keyof ScoreInput>(id: string, key: K, value: ScoreInput[K]) => setInputs((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  const candidates = items.filter((item) => item.kind === comparisonLevel && selectedIds.has(item.id));
  const eligibilityFor = (item: Item) => classifyEligibility(inputs[item.id]);
  const eligibleCandidates = candidates.filter((item) => eligibilityFor(item).code === "eligible");
  const candidateInputs = eligibleCandidates.map((item) => inputs[item.id]);
  const scoreFor = (item: Item) => eligibilityFor(item).code === "eligible" ? calculateScore(method, inputs[item.id], weights, candidateInputs) : null;
  const currentRank = (item: Item) => items.filter((candidate) => candidate.kind === comparisonLevel).findIndex((candidate) => candidate.id === item.id) + 1;
  const sourceSprint = (item: Item) => ["Active", "Committed", "Testing"].includes(item.state) ? "Sprint 24" : "Unassigned";
  const weightValidation = validateWeights(weights);

  const ranked = [...candidates].sort((a, b) => {
    const aStatus = eligibilityFor(a); const bStatus = eligibilityFor(b);
    if (aStatus.code === "mandatory" && bStatus.code !== "mandatory") return -1;
    if (bStatus.code === "mandatory" && aStatus.code !== "mandatory") return 1;
    if (aStatus.code === "eligible" && bStatus.code !== "eligible") return -1;
    if (bStatus.code === "eligible" && aStatus.code !== "eligible") return 1;
    return (scoreFor(b) ?? -1) - (scoreFor(a) ?? -1) || currentRank(a) - currentRank(b);
  });
  const recommendedRank = (item: Item) => {
    const eligibility = eligibilityFor(item);
    if (eligibility.code !== "eligible") return null;
    return ranked.filter((candidate) => eligibilityFor(candidate).code === "eligible").findIndex((candidate) => candidate.id === item.id) + 1;
  };
  const plannedBySprint = (sprint: string) => items.filter((item) => inputs[item.id].plannedSprint === sprint).reduce((sum, item) => sum + (item.points || inputs[item.id].jobSize), 0);
  const capacityState = (sprint: keyof typeof capacity) => { const points = plannedBySprint(sprint); const cap = capacity[sprint]; return points > cap.max ? "over" : points > cap.target ? "above" : "within"; };
  const hasRecordedPriority = (item: Item) => history.some((event) => event.itemId === item.id && (event.eventType ?? "priority") === "priority");
  const canPlan = (item: Item) => canEditPlannedSprint({ hasRecordedPriority: hasRecordedPriority(item), eligible: eligibilityFor(item).valid, decision: inputs[item.id].decision });
  const planningWarnings = (item: Item) => {
    const x = inputs[item.id]; const warnings: string[] = [];
    if (!eligibilityFor(item).valid) warnings.push("Not ready: resolve eligibility evidence first");
    if (item.status === "Blocked") warnings.push("Blocked work: clear the dependency before planning");
    if (x.plannedSprint in capacity && capacityState(x.plannedSprint as keyof typeof capacity) !== "within") warnings.push(`Capacity: ${capacityState(x.plannedSprint as keyof typeof capacity) === "over" ? "over hard maximum" : "above target"}`);
    const rank = recommendedRank(item);
    if (x.plannedSprint !== "Unassigned" && rank && eligibleCandidates.some((candidate) => (recommendedRank(candidate) ?? Infinity) < rank && inputs[candidate.id].plannedSprint === "Unassigned")) warnings.push("Skipped priority: a higher-ranked eligible item is unassigned");
    return warnings;
  };

  const selectLevel = (level: ComparisonLevel) => {
    setComparisonLevel(level);
    setSelectedIds(new Set(items.filter((item) => item.kind === level).map((item) => item.id)));
  };
  const toggleCandidate = (id: string) => setSelectedIds((current) => {
    const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });

  const record = (item: Item) => {
    const x = inputs[item.id]; const sprint = x.plannedSprint as keyof typeof capacity;
    if (Object.values(capacity).some((value) => value.max < value.target)) { setNotice("A hard maximum cannot be lower than its capacity target."); return; }
    if (sprint in capacity && capacityState(sprint) === "over") { setNotice(`${sprint} is over its hard maximum. Move or re-estimate work before recording.`); return; }
    const errors = validateForRecording({ method, level: comparisonLevel, input: x, weights });
    if (errors.length) { setNotice(`${item.id}: ${errors[0]}`); return; }
    const nextHistory = appendDecisionSnapshot(history, {
      id: crypto.randomUUID(), itemId: item.id, at: new Date().toISOString(), method,
      formulaVersion: FORMULA_VERSIONS[method], frameworkVersion: FRAMEWORK_VERSION, score: scoreFor(item), currentRank: currentRank(item),
      recommendedRank: recommendedRank(item), decision: x.decision,
      sprint: x.plannedSprint, rationale: x.rationale, actor, participants, evidence: x.evidence,
      inputs: { business: x.business, time: x.time, risk: x.risk, jobSize: x.jobSize, confidence: x.confidence },
    });
    const event = nextHistory[0] as History;
    setHistory([...nextHistory] as History[]); setNotice(`${item.id} decision version ${event.decisionVersion} recorded in browser-local history.`);
  };

  const fromEvent = history.find((event) => event.id === compareFrom);
  const toEvent = history.find((event) => event.id === compareTo);
  const versionComparison = compareDecisionSnapshots(fromEvent, toEvent);

  return <section className="priority-workspace" aria-label={`${projectName} prioritization`}>
    <div className="priority-hero"><div><p className="eyebrow">Human-governed refinement</p><h2>Prioritize with evidence</h2><p>Source facts stay read-only. People enter scores, approve the decision, and plan a sprint.</p></div><div className="readonly-note"><strong>Read-only source boundary</strong><span>No Azure DevOps or Jira write-back</span></div></div>

    <div className="comparison-controls panel">
      <label><span>Project</span><input value={projectName} readOnly aria-label="Selected project" /></label>
      <label><span>Comparison level</span><select value={comparisonLevel} onChange={(event) => selectLevel(event.target.value as ComparisonLevel)}>{comparisonLevels.map((level) => <option key={level} disabled={!availableLevels.includes(level)}>{level}</option>)}</select></label>
      <fieldset><legend>Comparable candidates</legend><div className="candidate-options">{items.filter((item) => item.kind === comparisonLevel).map((item) => <label key={item.id}><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleCandidate(item.id)} />{item.id}</label>)}</div><small>{candidates.length} selected</small></fieldset>
    </div>

    <div className="priority-controls panel">
      <label><span>Method</span><select value={method} onChange={(e) => setMethod(e.target.value as Method)}><option>WSJF</option><option>Theme Scoring</option><option>Relative Weighting</option></select></label>
      <div className="method-explainer"><strong>{method} · {FORMULA_VERSIONS[method]}</strong><span>{method === "WSJF" ? "Sequence comparable work using Cost of Delay ÷ Job Size." : method === "Theme Scoring" ? "Compare strategic themes or features using weighted criteria." : "Compare each item’s percentage share of value with its percentage share of cost."}</span>{!methodIsCompatible(method, comparisonLevel) && <em className="validation-error">This method is incompatible with {comparisonLevel} comparison.</em>}</div>
      {method === "Theme Scoring" && <div className="weight-controls">{(["business", "time", "risk"] as const).map((key) => <label key={key}><span>{key}</span><input type="number" min="0" max="100" value={weights[key]} onChange={(e) => setWeights({...weights,[key]:Number(e.target.value)})}/></label>)}<strong className={weightValidation.valid ? "weight-ok" : "weight-bad"}>{weightValidation.message}</strong></div>}
    </div>
    <div className="decision-context panel"><label><span>Decision owner</span><input value={actor} onChange={(e)=>setActor(e.target.value)} /></label><label><span>Participants</span><input value={participants} onChange={(e)=>setParticipants(e.target.value)} /></label><span>Framework v2.0 • versioned formulas • UTC timestamps • prototype browser storage</span></div>

    <div className="capacity-board">{(Object.keys(capacity) as Array<keyof typeof capacity>).map((sprint) => { const points=plannedBySprint(sprint); const state=capacityState(sprint); return <article className={`capacity-card capacity-${state}`} key={sprint}><div><span className={`sprint-dot ${sprintTone[sprint]}`}/><strong>{sprint}</strong><small>{state === "over" ? `! Over hard maximum by ${points-capacity[sprint].max}` : state === "above" ? "! Above target" : "Within target"}</small></div><div className="capacity-inputs"><label>Target<input type="number" value={capacity[sprint].target} onChange={(e)=>setCapacity({...capacity,[sprint]:{...capacity[sprint],target:Number(e.target.value)}})}/></label><label>Hard max<input type="number" value={capacity[sprint].max} min={capacity[sprint].target} onChange={(e)=>setCapacity({...capacity,[sprint]:{...capacity[sprint],max:Number(e.target.value)}})}/></label></div><div className="capacity-numbers"><strong>{points}</strong><span>planned • {Math.max(0,capacity[sprint].target-points)} available to target • {Math.max(0,capacity[sprint].max-points)} to max</span></div><div className="capacity-meter"><i style={{width:`${Math.min(100,(points/capacity[sprint].max)*100)}%`}}/></div></article>; })}</div>

    {!candidates.length ? <div className="empty-state"><strong>No comparable candidates selected</strong><span>Select at least one {comparisonLevel} candidate to calculate recommendations.</span></div> : <div className="priority-table-wrap"><table className="priority-table"><thead><tr><th>Item</th><th>Current rank</th><th>Recommended rank</th><th>State</th><th>Current source sprint</th><th>Eligibility / classification</th><th>Business value</th><th>Time criticality</th><th>Risk / enablement</th><th>Job size</th><th>Confidence</th><th>Evidence</th><th>Calculation</th><th>Decision</th><th>Planned sprint</th><th>Record</th></tr></thead><tbody>{ranked.map((item)=>{const x=inputs[item.id];const eligibility=eligibilityFor(item);const calculation=eligibility.code === "eligible" ? calculateScore(method,x,weights,candidateInputs,true) : {score:null,valuePercent:0,costPercent:0};const rowErrors=validateForRecording({method,level:comparisonLevel,input:x,weights,includeDecision:false});return <tr key={item.id} className={`sprint-row-${sprintTone[x.plannedSprint] || "neutral"}`}><td><button className="item-link"><strong>{item.id}</strong><span>{item.title}</span></button></td><td><span className="rank-number">{currentRank(item)}</span></td><td><strong>{eligibility.code === "mandatory" ? "Mandatory" : recommendedRank(item) ?? "—"}</strong></td><td><span className={`native-state native-state-${item.state.toLowerCase()}`}>{item.state}</span></td><td><span className="source-label"><strong>{sourceSprint(item)}</strong><br/>Read-only source iteration</span></td><td><label className="mandatory-check"><input type="checkbox" checked={x.mandatory} onChange={(e)=>change(item.id,"mandatory",e.target.checked)}/> Mandatory — not scored</label><span className={`eligibility ${eligibility.valid ? "eligible" : "missing"}`}>{eligibility.label}</span></td>{(["business","time","risk"] as const).map((key)=><td key={key}><input className="score-input" type="number" min="0" max="20" value={x[key]} onChange={(e)=>change(item.id,key,Number(e.target.value))}/></td>)}<td><input className="score-input" type="number" min="0" value={x.jobSize} disabled={item.points > 0} onChange={(e)=>change(item.id,"jobSize",Number(e.target.value))}/><small className="source-label">{item.points > 0 ? "Read-only source points" : "Local planning estimate"}</small></td><td><select value={x.confidence} onChange={(e)=>change(item.id,"confidence",e.target.value as ScoreInput["confidence"])}><option>High</option><option>Medium</option><option>Low</option></select></td><td><input value={x.evidence} placeholder="Specific evidence required" onChange={(e)=>change(item.id,"evidence",e.target.value)}/></td><td><strong className="priority-score">{x.mandatory ? "Mandatory — not scored" : calculation.score === null ? "Unavailable" : calculation.score.toFixed(2)}</strong>{method === "Relative Weighting" && <small className="calculation-detail">Value {calculation.valuePercent.toFixed(1)}% · Cost {calculation.costPercent.toFixed(1)}%</small>}{rowErrors.length > 0 && <small className="validation-error">{rowErrors[0]}</small>}</td><td><select value={x.decision} onChange={(e)=>change(item.id,"decision",e.target.value)} disabled={!eligibility.valid}><option>Draft</option><option>Accept</option><option>Retain current</option><option>Override</option><option>Return for refinement</option><option>Defer</option></select><input value={x.rationale} placeholder={x.decision === "Override" ? "Required override rationale" : "Decision rationale"} onChange={(e)=>change(item.id,"rationale",e.target.value)} disabled={!eligibility.valid}/></td><td><select value={x.plannedSprint} disabled={!canPlan(item)} aria-label={`Planned sprint for ${item.id}`} onChange={(e)=>change(item.id,"plannedSprint",e.target.value)}><option>Unassigned</option><option value="Sprint 24">Sprint 24 (current)</option><option value="Sprint 25">Sprint 25 (next)</option><option>Sprint 26</option><option>Sprint 27</option><option>Future backlog</option></select>{!canPlan(item) && <small className="validation-error">Record or choose an eligible priority decision before planning</small>}{planningWarnings(item).map((warning)=><small className="planning-warning" key={warning}>! {warning}</small>)}<small className={`sprint-label ${sprintTone[x.plannedSprint]}`}>{x.plannedSprint} • Awaiting source update</small></td><td><button className="record-button" onClick={()=>record(item)}>Record decision</button></td></tr>})}</tbody></table></div>}

    <section className="decision-history panel">
      <div className="panel-heading"><div><h2>Decision history</h2><p>Recorded snapshots are immutable; corrections append a new version.</p></div><span className="coming-badge">{history.length} recorded events</span></div>
      <div className="draft-state"><strong>Draft scoring</strong><span>Editable and unofficial until Record decision creates a UTC snapshot.</span></div>
      {history.length ? <>
        <div className="version-compare" aria-label="Compare decision versions">
          <label>Earlier version<select value={compareFrom} onChange={(event)=>setCompareFrom(event.target.value)}><option value="">Select version</option>{history.map((event)=><option key={event.id} value={event.id}>{event.itemId} · v{event.decisionVersion}</option>)}</select></label>
          <label>Later version<select value={compareTo} onChange={(event)=>setCompareTo(event.target.value)}><option value="">Select version</option>{history.map((event)=><option key={event.id} value={event.id}>{event.itemId} · v{event.decisionVersion}</option>)}</select></label>
        </div>
        {fromEvent && toEvent && <div className="comparison-result"><strong>{versionComparison ? `${versionComparison.itemId}: v${versionComparison.versions[0]} compared with v${versionComparison.versions[1]}` : "Choose two versions of the same item"}</strong>{versionComparison && <span>Score {versionComparison.score[0] ?? "not scored"} → {versionComparison.score[1] ?? "not scored"} · Rank {versionComparison.rank[0] ?? "—"} → {versionComparison.rank[1] ?? "—"} · Decision {versionComparison.decision[0]} → {versionComparison.decision[1]}</span>}</div>}
        <div className="history-list">{history.slice(0,8).map((event)=><article key={event.id}><time>{event.at} UTC</time><strong>{event.itemId} · priority v{event.decisionVersion}</strong><span>{event.method} {event.formulaVersion} · {event.frameworkVersion ?? "legacy framework"} · {event.score === null ? "not scored" : event.score.toFixed(2)}</span><span>{event.decision}</span><span>Rank {event.currentRank} → {event.recommendedRank ?? "—"}</span><small>{event.actor} • {event.participants} • Evidence: {event.evidence} • Inputs: {event.inputs.business}/{event.inputs.time}/{event.inputs.risk}/{event.inputs.jobSize}, {event.inputs.confidence} confidence • {event.rationale || "No rationale entered"}</small></article>)}</div>
      </> : <div className="empty-state"><strong>No recorded decisions</strong><span>Complete the human decision and use Record decision to create version 1.</span></div>}
    </section>
    {notice && <div className="priority-notice" role="status"><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss">×</button></div>}
  </section>;
}

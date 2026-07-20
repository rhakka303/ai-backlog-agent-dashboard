"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { id: string; title: string; kind: string; state: string; status: string; points: number; age: number };
type ScoreInput = { business: number; time: number; risk: number; jobSize: number; confidence: "High" | "Medium" | "Low"; evidence: string; rationale: string; decision: string; plannedSprint: string; mandatory: boolean };
type History = { id: string; itemId: string; at: string; method: string; score: number; decision: string; sprint: string; rationale: string; actor: string; participants: string };
type Method = "WSJF" | "Theme Scoring" | "Relative Weighting";

const initial = (item: Item, index: number): ScoreInput => ({
  business: [8, 13, 5, 8, 3, 5][index % 6], time: [13, 5, 3, 8, 5, 3][index % 6], risk: [8, 3, 13, 5, 3, 5][index % 6],
  jobSize: item.points || 0, confidence: index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
  evidence: index % 3 === 2 ? "" : "Customer feedback and delivery evidence", rationale: "", decision: "Draft", plannedSprint: "Unassigned", mandatory: item.status === "Blocked",
});

const sprintTone: Record<string, string> = { "Sprint 25": "mint", "Sprint 26": "blue", "Sprint 27": "violet", "Future backlog": "sand", Unassigned: "neutral" };

export default function PrioritizationView({ projectName, items }: { projectName: string; items: Item[] }) {
  const storageKey = `priority-prototype:${projectName}`;
  const [method, setMethod] = useState<Method>("WSJF");
  const [inputs, setInputs] = useState<Record<string, ScoreInput>>(() => Object.fromEntries(items.map((item, index) => [item.id, initial(item, index)])));
  const [history, setHistory] = useState<History[]>([]);
  const [notice, setNotice] = useState("");
  const [actor, setActor] = useState("Steven");
  const [participants, setParticipants] = useState("Product Owner and Development Team");
  const [weights, setWeights] = useState({ business: 40, time: 25, risk: 35 });
  const [capacity, setCapacity] = useState({ "Sprint 25": { target: 24, max: 30 }, "Sprint 26": { target: 28, max: 34 }, "Sprint 27": { target: 30, max: 36 } });

  useEffect(() => {
    try { const saved = localStorage.getItem(storageKey); if (saved) { const data = JSON.parse(saved); setInputs(data.inputs ?? inputs); setHistory(data.history ?? []); setCapacity(data.capacity ?? capacity); } } catch { /* Browser storage is optional prototype persistence. */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify({ inputs, history, capacity })); } catch { /* Keep the interactive session usable if storage is unavailable. */ } }, [storageKey, inputs, history, capacity]);

  const change = <K extends keyof ScoreInput>(id: string, key: K, value: ScoreInput[K]) => setInputs((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  const valueTotal = items.reduce((sum, item) => sum + inputs[item.id].business + inputs[item.id].time + inputs[item.id].risk, 0);
  const sizeTotal = items.reduce((sum, item) => sum + Math.max(0, inputs[item.id].jobSize), 0);
  const score = (item: Item) => {
    const x = inputs[item.id]; if (x.mandatory) return 999;
    if (method === "WSJF") return x.jobSize > 0 ? (x.business + x.time + x.risk) / x.jobSize : 0;
    if (method === "Theme Scoring") return (x.business * weights.business + x.time * weights.time + x.risk * weights.risk) / 100;
    const valueShare = valueTotal ? (x.business + x.time + x.risk) / valueTotal : 0; const costShare = sizeTotal ? x.jobSize / sizeTotal : 0;
    return costShare ? valueShare / costShare : 0;
  };
  const ranked = useMemo(() => [...items].sort((a, b) => score(b) - score(a)), [items, inputs, method, weights]); // Human inputs drive the recommendation; source order remains unchanged.
  const plannedBySprint = (sprint: string) => items.filter((item) => inputs[item.id].plannedSprint === sprint).reduce((sum, item) => sum + (item.points || inputs[item.id].jobSize), 0);
  const capacityState = (sprint: keyof typeof capacity) => { const points = plannedBySprint(sprint); const cap = capacity[sprint]; return points > cap.max ? "over" : points > cap.target ? "above" : "within"; };

  const record = (item: Item) => {
    const x = inputs[item.id]; const sprint = x.plannedSprint as keyof typeof capacity;
    if (Object.values(capacity).some((value) => value.max < value.target)) { setNotice("A hard maximum cannot be lower than its capacity target."); return; }
    if (method === "Theme Scoring" && Object.values(weights).reduce((a,b)=>a+b,0) !== 100) { setNotice("Theme weights must total 100% before recording."); return; }
    if (sprint in capacity && capacityState(sprint) === "over") { setNotice(`${sprint} is over its hard maximum. Move or re-estimate work before recording.`); return; }
    if (!x.mandatory && (!x.evidence.trim() || x.jobSize <= 0)) { setNotice(`${item.id} needs evidence and a positive team estimate before recording.`); return; }
    if (x.decision === "Draft") { setNotice(`Choose a human decision for ${item.id} before recording.`); return; }
    const event: History = { id: crypto.randomUUID(), itemId: item.id, at: new Date().toISOString(), method, score: score(item), decision: x.decision, sprint: x.plannedSprint, rationale: x.rationale || "No additional rationale", actor, participants };
    setHistory((current) => [event, ...current]); setNotice(`${item.id} decision recorded in browser-local history.`);
  };

  return <section className="priority-workspace" aria-label={`${projectName} prioritization`}>
    <div className="priority-hero"><div><p className="eyebrow">Human-governed refinement</p><h2>Prioritize with evidence</h2><p>Source facts stay read-only. People enter scores, approve the decision, and plan a sprint.</p></div><div className="readonly-note"><strong>Read-only source boundary</strong><span>No Azure DevOps or Jira write-back</span></div></div>

    <div className="priority-controls panel">
      <label><span>Method</span><select value={method} onChange={(e) => setMethod(e.target.value as Method)}><option>WSJF</option><option>Theme Scoring</option><option>Relative Weighting</option></select></label>
      <div className="method-explainer"><strong>{method}</strong><span>{method === "WSJF" ? "Sequence comparable work using Cost of Delay ÷ Job Size." : method === "Theme Scoring" ? "Compare strategic themes using weighted criteria." : "Compare each item’s share of value with its share of cost."}</span></div>
      {method === "Theme Scoring" && <div className="weight-controls">{(["business", "time", "risk"] as const).map((key) => <label key={key}><span>{key}</span><input type="number" value={weights[key]} onChange={(e) => setWeights({...weights,[key]:Number(e.target.value)})}/></label>)}<strong className={Object.values(weights).reduce((a,b)=>a+b,0) === 100 ? "weight-ok" : "weight-bad"}>{Object.values(weights).reduce((a,b)=>a+b,0)}%</strong></div>}
    </div>
    <div className="decision-context panel"><label><span>Decision owner</span><input value={actor} onChange={(e)=>setActor(e.target.value)} /></label><label><span>Participants</span><input value={participants} onChange={(e)=>setParticipants(e.target.value)} /></label><span>Framework v1.0 • UTC timestamps • prototype browser storage</span></div>

    <div className="capacity-board">{(Object.keys(capacity) as Array<keyof typeof capacity>).map((sprint) => { const points=plannedBySprint(sprint); const state=capacityState(sprint); return <article className={`capacity-card capacity-${state}`} key={sprint}><div><span className={`sprint-dot ${sprintTone[sprint]}`}/><strong>{sprint}</strong><small>{state === "over" ? `! Over hard maximum by ${points-capacity[sprint].max}` : state === "above" ? "! Above target" : "Within target"}</small></div><div className="capacity-inputs"><label>Target<input type="number" value={capacity[sprint].target} onChange={(e)=>setCapacity({...capacity,[sprint]:{...capacity[sprint],target:Number(e.target.value)}})}/></label><label>Hard max<input type="number" value={capacity[sprint].max} min={capacity[sprint].target} onChange={(e)=>setCapacity({...capacity,[sprint]:{...capacity[sprint],max:Number(e.target.value)}})}/></label></div><div className="capacity-numbers"><strong>{points}</strong><span>planned • {Math.max(0,capacity[sprint].target-points)} to target • {Math.max(0,capacity[sprint].max-points)} to max</span></div><div className="capacity-meter"><i style={{width:`${Math.min(100,(points/capacity[sprint].max)*100)}%`}}/></div></article>; })}</div>

    <div className="priority-table-wrap"><table className="priority-table"><thead><tr><th>Rank / item</th><th>State</th><th>Eligibility</th><th>Business value</th><th>Time criticality</th><th>Risk / enablement</th><th>Job size</th><th>Confidence</th><th>Evidence</th><th>Score</th><th>Decision</th><th>Planned sprint</th><th>Record</th></tr></thead><tbody>{ranked.map((item,index)=>{const x=inputs[item.id];const eligible=x.mandatory||(x.evidence.trim()&&x.jobSize>0);return <tr key={item.id} className={`sprint-row-${sprintTone[x.plannedSprint] || "neutral"}`}><td><span className="rank-number">{x.mandatory ? "M" : index+1}</span><button className="item-link"><strong>{item.id}</strong><span>{item.title}</span></button></td><td><span className={`native-state native-state-${item.state.toLowerCase()}`}>{item.state}</span></td><td><label className="mandatory-check"><input type="checkbox" checked={x.mandatory} onChange={(e)=>change(item.id,"mandatory",e.target.checked)}/> Mandatory</label><span className={eligible ? "eligibility eligible" : "eligibility missing"}>{eligible ? "✓ Eligible" : "! Needs evidence"}</span></td>{(["business","time","risk"] as const).map((key)=><td key={key}><input className="score-input" type="number" min="0" max="20" value={x[key]} onChange={(e)=>change(item.id,key,Number(e.target.value))}/></td>)}<td><input className="score-input" type="number" min="0" value={x.jobSize} disabled={item.points > 0} onChange={(e)=>change(item.id,"jobSize",Number(e.target.value))}/><small className="source-label">{item.points > 0 ? "Read-only source points" : "Local planning estimate"}</small></td><td><select value={x.confidence} onChange={(e)=>change(item.id,"confidence",e.target.value as ScoreInput["confidence"])}><option>High</option><option>Medium</option><option>Low</option></select></td><td><input value={x.evidence} placeholder="Evidence required" onChange={(e)=>change(item.id,"evidence",e.target.value)}/></td><td><strong className="priority-score">{x.mandatory ? "Mandatory" : score(item).toFixed(2)}</strong></td><td><select value={x.decision} onChange={(e)=>change(item.id,"decision",e.target.value)}><option>Draft</option><option>Accept</option><option>Retain current</option><option>Override</option><option>Return for refinement</option><option>Defer</option></select><input value={x.rationale} placeholder="Decision rationale" onChange={(e)=>change(item.id,"rationale",e.target.value)}/></td><td><select value={x.plannedSprint} onChange={(e)=>change(item.id,"plannedSprint",e.target.value)}><option>Unassigned</option><option>Sprint 25</option><option>Sprint 26</option><option>Sprint 27</option><option>Future backlog</option></select><small className={`sprint-label ${sprintTone[x.plannedSprint]}`}>{x.plannedSprint} • Awaiting source update</small></td><td><button className="record-button" onClick={()=>record(item)}>Record decision</button></td></tr>})}</tbody></table></div>

    <section className="decision-history panel"><div className="panel-heading"><div><h2>Decision history</h2><p>Recorded snapshots • browser-local prototype storage</p></div><span className="coming-badge">{history.length} events</span></div>{history.length ? <div className="history-list">{history.slice(0,8).map((event)=><article key={event.id}><time>{new Date(event.at).toLocaleString()}</time><strong>{event.itemId}</strong><span>{event.method} • {event.score.toFixed(2)}</span><span>{event.decision}</span><span>{event.sprint}</span><small>{event.actor} • {event.participants} • {event.rationale}</small></article>)}</div> : <div className="empty-state"><strong>No decisions recorded</strong><span>Draft scores remain editable until a human records a decision.</span></div>}</section>
    {notice && <div className="priority-notice" role="status"><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss">×</button></div>}
  </section>;
}

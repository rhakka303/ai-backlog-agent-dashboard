# CODEX.md — Current Operational Handoff

## Purpose

This tracked file gives a new Codex chat a concise starting point. Read it after `AGENTS.md` and `CONTRIBUTING.md`, then verify every status statement against live GitHub issues, comments, branches, and pull requests before acting.

This file is a summary, not the delivery system of record. GitHub issues, pull requests, commits, repository documentation, and deployed evidence remain authoritative.

Last refreshed: July 20, 2026.

## Authority and collaboration

- The repository owner (`rhakka303`) is the Product Owner and final decision-maker.
- Codex is the sole AI implementer for dashboard application code, tests, deployment, Implementation History, and implementation evidence.
- Claude may create or update Markdown documentation, independently audit GitHub work, and monitor or report security findings.
- Claude findings are review input. Codex investigates them through the governed workflow.
- Neither AI may provide the repository owner's Acceptance Verification, merge unfinished work, close unfinished issues, or declare final product acceptance.
- Azure DevOps and Jira are strictly read-only. The dashboard may reconcile and display source changes but never write back.

## Product position

The AI Backlog Agent Dashboard is currently a working prototype, not a production AI agent.

Its permanent product principles include:

- Refine with evidence, not instinct.
- Evidence before advice.
- AI may summarize, explain, flag, and propose.
- Humans supply accountable ratings, make final decisions, and record rationale.
- Local planning decisions must remain separate from source-owned values.
- Every accepted decision should be traceable to who decided, when, and why.

The selected visual direction is **Calm Operations**. The owner chose this direction from multiple UX concepts; that choice is a product decision, not an arbitrary generated style.

## Required new-chat orientation

Before changing anything:

1. Read `AGENTS.md`, `CONTRIBUTING.md`, this file, `docs/PRODUCT_VISION.md`, and `docs/ROADMAP.md`.
2. Inspect all open issues and all draft/open pull requests.
3. Read the complete target issue, comments, prerequisites, acceptance criteria, branch, commits, and PR.
4. Report current status and the recommended next implementation step.
5. Do not create or modify anything until orientation is complete.
6. Continue the existing issue and branch when appropriate; do not duplicate work.
7. Keep Azure DevOps and Jira read-only.
8. Leave owner Acceptance Verification, merge, and closure to the repository owner.

## Active implementation priority

Issue [#15](https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/15) and draft PR [#16](https://github.com/rhakka303/ai-backlog-agent-dashboard/pull/16) remain the active implementation priority on branch `feature/prioritization-workspace`.

Do not begin Epic #21 or Epic #31 application implementation merely because their issues exist. Do not merge PR #16 or close #15 until all remaining acceptance criteria pass and the owner posts separate Acceptance Verification.

## Epic visibility initiative

Parent [#21](https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/21) makes Epic a first-class concept across the prototype.

| Issue | Scope |
|---|---|
| #22 | Shared Epic model and representative data |
| #23 | Global Epic selection and filtering |
| #24 | Epic health and progress in Overview |
| #25 | Epic grouping in Backlog |
| #26 | Epic comparison in Prioritization; gated on #15/#16 |
| #27 | Epic distribution in Sprints |
| #28 | Epic support contract for Reports |
| #29 | AI Epic evidence contract |
| #30 | Cross-dashboard Epic validation |

Important dependency: #22 must extend the canonical model established by #32. It must not create a competing backlog source of truth and should not begin until #32 is owner-accepted.

## Shared-data foundation initiative

Parent [#31](https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/31) establishes the canonical backlog, Sprint configuration, capacity, sample data, historical snapshots, reporting inputs, and refresh/local-overlay contract.

| Issue | Scope |
|---|---|
| #32 | Canonical work-item foundation model |
| #33 | Profile and System Settings structure |
| #34 | Master Sprint configuration |
| #35 | Sprint 1 through rolling horizon generation |
| #36 | Governed capacity configuration |
| #37 | Canonical representative sample backlog |
| #38 | Historical Sprint snapshots and scope history |
| #39 | Backlog as complete visible inventory |
| #40 | Overview migration to canonical data |
| #41 | Sprints migration and selector/item-membership defect fix |
| #42 | Prioritization migration to rolling 90-day horizon |
| #43 | Shared Reporting and burnup inputs |
| #44 | Simulated read-only synchronization/local-overlay behavior |
| #45 | Final cross-dashboard integration validation |

Foundational sequence:

1. Establish Settings and configuration structure (#33, #34, #36).
2. Establish the canonical work-item model (#32).
3. Extend that model with Epic relationships (#22).
4. Generate the Sprint calendar (#35).
5. Build canonical sample data (#37) and historical snapshots (#38).
6. Make Backlog the complete visible inventory (#39).
7. Migrate Overview, Sprints, Prioritization, reporting inputs, and simulated refresh (#40-#44).
8. Complete final integration validation (#45).

Follow each issue's actual dependency section if it is more specific than this summary.

## Confirmed prototype data decisions

The foundation issues capture these accepted design inputs:

- Fixed sample calculation time: July 20, 2026 at 12:00 PM in `America/Los_Angeles`.
- Sprint 1 anchor: August 25, 2025.
- Default cadence: two weeks; configuration supports one, two, three, or four weeks.
- Sprint 24 is Current: July 13-26, 2026.
- Sprint 25 is Next: July 27-August 9, 2026.
- The default 90-day planning horizon includes Sprints 25-31 because Sprint 31 overlaps the boundary.
- Work beyond the horizon is labeled `Future Backlog`.
- Prototype team: five developers.
- Sprint Targets vary approximately 42-48 points.
- Hard Maximums vary approximately 48-57 points, average near 52, and never reach 60 in the representative data.
- At or below Target is within capacity.
- Above Target through Hard Maximum, inclusive, is an allowed warning state.
- Above Hard Maximum blocks acceptance.
- Estimates use 1, 2, 3, 5, 8, and rare 13; no 21.
- Approximately 5-8% of representative work remains explicitly unestimated.
- CRM Modernization should contain at least 120 child items across eight Epics and at least 45 future planning candidates.
- Incomplete-item Age is calculated from Created Date.
- Completed items use cycle time from Created Date to Completed Date and do not keep aging.
- Historical Sprint results come from immutable snapshots, not an item's current State.
- Product burnup tracks completed estimated points against total estimated product scope while keeping unestimated work visible.

## Known Sprints defect

The Sprints selector currently changes the summary snapshot, but the Sprint Items table can continue showing a fixed slice of items. Issue #41 owns the correction.

The repaired view must derive the header, dates, lifecycle, goal, capacity, committed/completed/remaining/blocked totals, progress, scope movement, State counts, and item membership from the same selected Sprint snapshot. Sprints and Prioritization must use the same generated Sprint calendar.

## Profile and System Settings direction

Profile includes personal display fields such as first name, last name, email, title, personal display time zone, and display preferences. Prototype identity and email are fictional/browser-local and are not production authentication.

System Settings owns official product configuration, including project/workspace, official time zone, Sprint cadence and anchor, horizon, capacity policy, data-source behavior, reporting boundaries, and future synchronization preferences. Personal display time zone must not change official project/Sprint/reporting boundaries.

## Read-only refresh and local overlays

The future connector direction is a configurable read-only pull, defaulting to every 24 hours, plus a manual **Refresh Data** action. API synchronization and LLM usage are separate concerns; a source refresh does not inherently consume LLM tokens.

Source refresh may update source-owned fields. It must preserve dashboard-local fields, including human ratings, evidence, confidence, calculated-method inputs, rationale, decisions, planned Sprint, local estimate when permitted, capacity settings/history, and decision history. Reconciliation detects differences; it never corrects the source automatically.

## Proposed future AI Sprint-planning concept

This is a confirmed product direction from discussion but is **not yet a GitHub implementation issue**. Do not implement it until it receives governed issue decomposition and acceptance criteria.

Intended flow:

1. Humans enter or approve the ratings and weighting inputs.
2. The system calculates prioritization scores deterministically.
3. AI uses those approved scores, evidence, dependencies, eligibility, estimates, Sprint Targets, and Hard Maximums to propose a chronologically ordered multi-Sprint plan.
4. AI never invents missing ratings or silently changes human inputs.
5. The proposal fills upcoming Sprints without exceeding any Hard Maximum and visibly distinguishes Target warnings.
6. Each Sprint is expandable so the user can inspect the ordered items, evidence, estimates, capacity use, dependencies, and reasons for placement.
7. The generated plan begins in **Draft**.
8. A human may move, remove, defer, or reorder items and must provide rationale where governance requires it.
9. Only an authorized human, initially the Product Owner, can move the plan from **Draft** to **Accepted**.
10. Acceptance is a local planning decision and does not write to Azure DevOps or Jira.

This likely warrants a separate Epic because it introduces a planning engine, allocation rules, dependency handling, expandable Sprint-plan UI, lifecycle states, change history, and human acceptance governance. Decide and document its relationship to #15, #26, #35, #36, #39, and #42 before creating implementation stories.

## Reporting direction

Issue #43 supplies shared reporting inputs; issue #13 retains ownership of the Reports UI and statistical forecast behavior.

Burnup must distinguish product-scope changes from Sprint movement:

- Adding/removing work or changing estimates changes product scope.
- Moving work between Sprints does not change product scope.
- Moving work between Epics changes Epic scope but not product scope.
- Historical completed-point velocities, sample size, median input, remaining points, and capacity context must be available for forecasting.
- Capacity Target and Hard Maximum are context, not substitutes for historical velocity.

Future product measurement may include NPS and customer satisfaction after a real pilot and baseline exist. Those measures do not validate the current prototype by themselves.

## Governance reminders

For every material change:

1. Confirm an issue with complete acceptance criteria.
2. Create a focused branch from the correct base.
3. Make intentional commits.
4. Open a draft PR.
5. Codex posts detailed Implementation History.
6. The repository owner posts separate criterion-by-criterion Acceptance Verification.
7. The repository owner decides whether to merge and close.

Never check acceptance boxes merely because code exists. Verification must point to evidence. Leave partial work open.

## Status at this handoff

- Product Vision and Roadmap documentation have been accepted and merged.
- Issues #21-#30 and #31-#45 are open planning work; their creation did not start implementation.
- Their bodies were audited and expanded with detailed acceptance criteria.
- Issue #15/draft PR #16 remain active.
- Issue #46 tracks this documentation-only handoff refresh.
- No application code was changed as part of #46.

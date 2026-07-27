# Roadmap — AI Backlog Agent Dashboard

## Roadmap purpose

This roadmap describes product direction, not a fixed or closed delivery plan. The backlog will change as the Product Owner receives feedback, discovers defects, reviews audit findings, and learns from implementation.

All material work follows the repository's governed workflow:

Issue → acceptance criteria → branch → commits → draft pull request → Implementation History → separate Acceptance Verification

The project practices the same backlog discipline it is being built to support.

## Permanent product boundaries

These rules apply across every roadmap phase:

- Azure DevOps and Jira remain read-only.
- The dashboard never changes source backlog data.
- AI never invents prioritization ratings, scores, Story Points, sprint capacity, or final decisions.
- Source facts, dashboard calculations, human inputs, and AI output remain distinguishable.
- Every recorded decision requires an accountable human and rationale.
- Product Owners retain final prioritization and sprint authority.
- Evidence comes before advice.

## Cross-cutting: Epic-level visibility (Epic #21)

Epic #21 adds "Epic" as a first-class work-item type, visible across whichever phases below are already built. It is not its own phase -- it is an enhancement layer applied to each phase as that phase matures: Epic health on Overview (Phase 1), Epic grouping on Backlog (Phase 1), Epic-level comparison in Prioritization (Phase 1, tracked as Story 5 / issue #26, since decomposed into 6 governed Tasks -- #71 through #76 -- after empirical sizing showed the original flat estimate was too large for one implementation session), Epic distribution in Sprints (Phase 1), Epic inputs to Reports (Phase 3), and an Epic evidence contract for AI Insights (Phase 5). See issue #21 for the full child-story breakdown and current status.

## Phase 1 — Complete the prototype foundation

**Outcome:** A Product Owner can explore backlog health, inspect readiness evidence, review sprint context, and demonstrate governed prioritization in one working prototype.

**Status: core capability complete.** The prototype includes:

- Overview with backlog trends, aging bands, workflow status, predictability, and items by State.
- Backlog with evidence-based readiness filtering.
- Sprints with capacity and scope-movement context.
- Prioritization with:
  - WSJF, Theme Scoring, and Relative Weighting, each independently verified against known datasets by hand
  - Human-entered scoring inputs, with explicit validation states for zero, missing, invalid, and incompatible values
  - Evidence and confidence fields, with a minimum-specificity check rejecting placeholder text
  - Human decisions and rationale, including a required-rationale rule for overrides
  - Planned-sprint selection gated on a recorded eligible decision
  - Capacity targets and hard maximums, with finalization blocked when over capacity
  - Immutable, versioned, browser-local decision history with side-by-side version comparison
  - Role-based authenticated decision ownership -- no personal identity ever rendered as visible text
- Explicit Azure DevOps and Jira read-only messaging.
- Repository governance requiring detailed implementation and acceptance evidence, now backed by automatic CI verification (lint, test, build) on every pull request.

Overview, Backlog, Sprints, and Prioritization have all shipped and closed their original milestones (issues #5, #7, #11, and #15 respectively -- #15 completed with a full criterion-by-criterion Acceptance Verification pass, including two real defects found via hands-on testing, fixed, and independently re-verified).

Reports remains incomplete (Phase 3). AI Insights remains reserved for future evidence-linked assistance (Phase 5).

**Completion signal:** met for the capabilities listed above. Phase 1 stays open only for the Epic-level Prioritization enhancement (issue #26 / Tasks #71-#76, cross-cutting from Epic #21) and any defects found through continued use.

Related issues: #5, #7, #11, and #15 closed; #21 and #26 (with Tasks #71-#76) open.

## Phase 2 — Establish trusted metrics and normalized data

**Outcome:** Every displayed record and metric can be traced to a documented definition and a validated source-independent data model.

**In progress, now with a concrete delivery vehicle: Epic #31** ("Establish shared backlog, Sprint configuration, and reporting data foundation"), a 14-child Epic that replaces this phase's originally-planned capabilities with a governed, sequenced implementation:

- A canonical work-item foundation model shared across every work-item type (Child 1 / issue #32 -- **closed and merged**).
- Profile and System Settings structure, giving Sprint, capacity, and canonical-model policies a real editable home (Child 2 / issue #33 -- **in progress**).
- Master Sprint configuration and a rolling 90-day planning horizon (Children 3-4 / issues #34-#35).
- Governed capacity configuration (Child 5 / issue #36).
- Sufficient canonical sample backlog data, including 8 representative Epics (Child 6 / issue #37).
- Historical Sprint snapshots and scope history (Child 7 / issue #38).
- Backlog as the complete, provably canonical visible inventory (Child 8 / issue #39).
- Migration of Overview, Sprints, and Prioritization onto this shared foundation (Children 9-11 / issues #40-#42).
- Shared Reporting/burnup inputs and simulated read-only synchronization (Children 12-13 / issues #43-#44).
- Final cross-dashboard data validation (Child 14 / issue #45).

**Planned capability retained from the original phase scope, not yet folded into Epic #31:** controlled read-only CSV or Google Sheets import (issue #2), serving as the first real-data step before live source credentials or APIs are introduced.

**Completion signal:** Phase 2 is complete when Epic #31 closes (all 14 children independently verified, merged, and closed) and a controlled imported dataset can reliably update the dashboard with clear row-level errors on invalid data.

Related issues: #31 (parent, with children #32-#45 -- #32 closed), #1, #2, and #9.

## Phase 3 — Complete reporting and statistical forecasting

**Outcome:** Product Owners and stakeholders can answer common backlog and delivery questions without manually assembling spreadsheets and charts.

**Planned capabilities:**

- Complete Reports workspace.
- Project and reporting-period controls.
- Backlog trend, aging, readiness, blocked-work, completion, predictability, and scope-movement reporting.
- Native State counts with current, previous, and change values.
- Testing retained as a distinct State.
- Visible source and calculation timestamps.
- Executive statements derived only from displayed calculations.
- Statistical delivery forecasting based on:
  - Remaining Story Points
  - Historical sprint velocities
  - Sample size
  - Median velocity
  - Required-sprint estimate
  - Supported confidence bounds
- Historical velocity visualization.
- Plain-language uncertainty explanations.
- Clear unavailable states for missing, zero, or insufficient history.
- Print or export preparation.
- Epic requirements and calculations, feeding from Epic #21's shared model (see the cross-cutting note above).

Forecasts are labeled statistical, not AI-generated.

**Completion signal:** Phase 3 is complete when reports can be reproduced from known data, forecast calculations match the documented method, uncertainty is visible, and reports remain usable on desktop and mobile.

Related issues: #13, #28.

## Phase 4 — Connect read-only source systems

**Outcome:** Product Owners can use current backlog and sprint information without manually reconciling separate spreadsheet copies against Azure DevOps or Jira.

**Delivery sequence:**

1. Finalize and validate the shared normalized model (Phase 2 / Epic #31).
2. Validate real-data behavior through CSV or Sheets.
3. Connect Azure DevOps with least-privilege read access.
4. Add read-only synchronization and reconciliation.
5. Add Jira using the same normalized model.
6. Add source-driven sprint rollover and historical retention.

**Planned capabilities:**

- Approved read-only authentication.
- Project, board, and iteration selection.
- Pagination and rate-limit handling.
- Defined refresh cadence.
- Visible last-successful-refresh time.
- Stale-data warnings.
- Partial-failure states.
- Deleted and moved work-item handling.
- Preservation of source IDs, URLs, States, estimates, and iterations.
- Comparison of dashboard plans against refreshed source facts.
- Stable source iteration IDs for sprint rollover.
- Closed sprint movement into reporting and history.
- Preservation of local capacity settings and decision history.

**Permanent restriction:** No connector may create, update, delete, transition, assign, prioritize, reorder, comment on, or move a source work item. Reconciliation detects differences. It does not correct the source automatically.

**Completion signal:** Phase 4 is complete when the dashboard can refresh approved source data, clearly report freshness and failures, preserve source traceability, and demonstrate through tests that no write-capable operation exists.

Related issues: #2, #4, #9, #10.

## Phase 5 — Add evidence-linked AI assistance

**Outcome:** Product Owners receive explainable observations grounded in traceable backlog evidence while retaining complete decision authority.

**AI may:**

- Summarize displayed backlog evidence.
- Identify patterns in trusted metrics.
- Surface missing or inconsistent evidence.
- Flag stale, blocked, risky, or dependency-sensitive work.
- Explain why an observation was generated.
- Link observations to supporting work-item IDs.
- Include metric windows and generation timestamps.
- Distinguish source facts from model-generated interpretation.

**Users may:**

- Review an insight.
- Request supporting evidence.
- Edit a human response.
- Accept the observation for consideration.
- Dismiss it.
- Record a separate human decision.

**AI may not:**

- Invent prioritization ratings or scores.
- Recommend a rank without governed human inputs.
- Assign Story Points.
- Set sprint capacity.
- Finalize priority or sprint decisions.
- Call source-system write APIs.
- Present unsupported advice as fact.

**Completion signal:** Phase 5 is complete when every AI observation is evidence-linked, unsupported output fails safely, human responses are recorded separately, and no AI action can change backlog data or finalize a decision.

Related issues: #3, #29.

## Phase 6 — Prepare for production governance

**Outcome:** Define what would be required to move from a single-user prototype to a secure, durable, multi-user product.

This phase describes future requirements. It is not currently a commitment to build or operate a production service.

**Potential requirements:**

- Authenticated identity.
- Role-aware authorization.
- Product Owner authority enforcement.
- Named acting delegates for absences.
- Scoped and expiring delegation.
- Durable server-side storage.
- Immutable and versioned audit events.
- Secure connector credential storage.
- Multi-user concurrency and conflict handling.
- Monitoring and alerting.
- Backup and recovery.
- Security hardening, including ongoing dependency vulnerability management (a real practice already underway -- see the repository's Dependabot alerts and governed fix history).
- Accessibility compliance.
- Calculation, integration, security, and acceptance test coverage.
- Documented incident and recovery procedures.

**Completion signal:** Phase 6 would be complete only after the required controls are implemented, independently tested, security-reviewed, and accepted for a defined production environment.

## Phase 7 — Pilot and measure outcomes

**Outcome:** Validate whether the dashboard solves the original Product Owner problem using approved real backlog data and measurable baselines.

This phase also represents future direction rather than a current delivery commitment.

**Baselines to establish.** Before evaluating improvement, measure:

- Average time spent reconciling spreadsheets and source data.
- Number of tools or files touched per reporting cycle.
- Time required to answer common backlog-status questions.
- Percentage of prioritization decisions with recorded rationale.
- Frequency of source-to-dashboard reconciliation differences.
- Sprint predictability using an approved formula and measurement window.
- Number of active Product Owners.
- Number of reporting cycles completed through the dashboard.

**Pilot evaluation.** The pilot should determine:

- Whether reconciliation time decreases.
- Whether reporting requires fewer disconnected tools.
- Whether decision rationale becomes more consistent.
- Whether stakeholders can answer common questions more quickly.
- Whether the read-only boundary remains intact.
- Whether users trust the distinction between facts, calculations, human decisions, and AI output.
- Whether the product creates enough value to justify production investment.

**Completion signal:** The pilot is complete when results are compared against documented baselines and findings are returned to the governed backlog as issues, defects, security findings, or roadmap changes.

## Current roadmap position

The product's Phase 1 core capability is complete -- Overview, Backlog, Sprints, and Prioritization have all shipped and closed their original milestones, with Prioritization independently verified criterion-by-criterion and two real defects found, fixed, and re-audited along the way.

The immediate priority is **Epic #31** (Phase 2's shared canonical data foundation): Child 1 is closed, Child 2 (Profile/System Settings, issue #33) is in progress. Running alongside it, **Epic #21's Epic-level Prioritization comparison** (issue #26) has been decomposed into 6 governed Tasks (#71-#76) after empirical sizing showed the original estimate exceeded one reliable implementation session -- work proceeds one Task at a time. Reports, live connectors, and AI Insights remain queued behind the data foundation.

Refine with evidence, not instinct. Evidence before advice.

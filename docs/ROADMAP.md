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

## Phase 1 — Complete the prototype foundation

**Outcome:** A Product Owner can explore backlog health, inspect readiness evidence, review sprint context, and demonstrate governed prioritization in one working prototype.

**Current capabilities.** The prototype includes:

- Overview with backlog trends, aging bands, workflow status, predictability, and items by State.
- Backlog with evidence-based readiness filtering.
- Sprints with capacity and scope-movement context.
- Prioritization with:
  - WSJF
  - Theme Scoring
  - Relative Weighting
  - Human-entered scoring inputs
  - Evidence and confidence fields
  - Human decisions and rationale
  - Planned-sprint selection
  - Capacity targets and hard maximums
  - Browser-local decision history
- Explicit Azure DevOps and Jira read-only messaging.
- Repository governance requiring detailed implementation and acceptance evidence.

Overview, Backlog, and Sprints have shipped prototype milestones. Prioritization is deployed as a reviewable milestone but remains unfinished under issue #15 and draft PR #16.

Reports remains incomplete. AI Insights remains reserved for future evidence-linked assistance.

**Remaining work:**

- Verify scoring formulas with known datasets.
- Test missing, zero, invalid, and incompatible inputs.
- Complete decision correction and version-comparison behavior.
- Verify capacity targets, hard maximums, and blocked finalization.
- Test source and local estimate precedence.
- Validate keyboard, desktop, and mobile behavior.
- Document prototype audit-history limitations.
- Complete separate Acceptance Verification before closing #15.

**Completion signal:** Phase 1 is complete when the current prototype capabilities have reproducible tests, their limitations are accurately documented, and all associated acceptance criteria have been independently verified.

Related issues: #5, #7, and #11 closed; #1 and #15 open.

## Phase 2 — Establish trusted metrics and normalized data

**Outcome:** Every displayed record and metric can be traced to a documented definition and a validated source-independent data model.

**Planned capabilities:**

- Written definitions for every dashboard metric.
- Documented included and excluded backlog States.
- Configurable aging thresholds.
- Documented Definition of Ready rules.
- Defined predictability formula and measurement window.
- Known datasets with expected calculation results.
- A normalized data contract shared across all source connectors.
- Native source State preservation, including Testing and custom States.
- Source-system and source-identifier retention.
- Clear source and refresh timestamps.
- Validation for missing fields, malformed values, duplicate IDs, and partial datasets.
- Controlled read-only CSV or Google Sheets import.

CSV or Sheets serves as the first real-data step. It allows the dashboard to validate normalization and calculations before live source credentials or APIs are introduced.

**Completion signal:** Phase 2 is complete when a controlled imported dataset can reliably update the dashboard, invalid data produces clear row-level errors, and every displayed value remains traceable to its source or calculation.

Related issues: #1, #2, and #9.

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

Forecasts are labeled statistical, not AI-generated.

**Completion signal:** Phase 3 is complete when reports can be reproduced from known data, forecast calculations match the documented method, uncertainty is visible, and reports remain usable on desktop and mobile.

Related issue: #13.

## Phase 4 — Connect read-only source systems

**Outcome:** Product Owners can use current backlog and sprint information without manually reconciling separate spreadsheet copies against Azure DevOps or Jira.

**Delivery sequence:**

1. Finalize and validate the shared normalized model.
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

Related issues: #2, #4, #9, #10, and #15.

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

Related issue: #3.

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
- Security hardening.
- Dependency vulnerability management.
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

The product is currently in Phase 1.

The immediate implementation priority is completing and verifying the governed Prioritization milestone under issue #15 and draft PR #16. Metric definitions and the normalized data foundation follow before Reports, live connectors, or AI Insights.

Refine with evidence, not instinct. Evidence before advice.

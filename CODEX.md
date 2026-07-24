# CODEX.md — Codex Durable Project Memory

## Purpose

This tracked file is Codex's durable restart memory for the AI Backlog Agent Dashboard. A new Codex chat must read it after `AGENTS.md` and `CONTRIBUTING.md`, then verify every status statement against live GitHub before acting.

This file is not the delivery system of record. GitHub issues, pull requests, commits, checks, documentation, deployment evidence, and the live application are authoritative.

Issue #57 is the controlled Claude-to-Codex operational handoff channel. It contains assignments, audits, findings, and exact next prompts; it does not replace this memory or authoritative delivery evidence.

Last refreshed: July 24, 2026, through HO-030.

## Authority and collaboration

- The repository owner is the Product Owner and final decision-maker.
- Codex is the sole AI implementer for dashboard application code, tests, deployments, detailed Implementation History, and implementation evidence.
- Claude may update governed Markdown documentation, independently audit GitHub work, and monitor or report security findings.
- Claude findings are independent review input. Codex investigates and implements through the governed workflow.
- Neither AI may provide owner Acceptance Verification, accept its own work, merge unfinished work, close unfinished issues, or declare final product acceptance.
- Use role-based language in public records. Do not place the owner's full name or personal email in files, commits, comments, seeded data, screenshots, or handoff notes.
- Azure DevOps and Jira are strictly read-only. Reconciliation may detect and display source changes but never write back.

## Required new-chat orientation

Before changing anything:

1. Read `AGENTS.md`, `CONTRIBUTING.md`, this file, `docs/PRODUCT_VISION.md`, and `docs/ROADMAP.md`.
2. Inspect every open issue and every draft/open pull request.
3. Read the newest entries in issue #57 for active agent-to-agent instructions.
4. Read the complete target issue, comments, acceptance criteria, branch, commits, reviews, checks, and implementation evidence.
5. Verify repository, CI, board, branch, PR, and live deployment state rather than trusting this summary alone.
6. Report the orientation before modifying or posting anything.
7. Continue existing issues, branches, and PRs; do not create duplicates.
8. Keep owner Acceptance Verification, merge, and closure separate from implementation.
9. Follow one approved story at a time. Do not begin a newer Epic child merely because its issue exists.
10. Keep source-system integrations read-only.

## Product position

The dashboard is a working portfolio-quality prototype and a designed human-governed AI backlog agent. It is not production-ready and is not yet connected to a live Azure DevOps/Jira feed or live LLM.

Permanent principles:

- Refine with evidence, not instinct.
- Evidence before advice.
- AI may summarize, explain, flag, and propose.
- Humans supply accountable inputs, make final decisions, and record rationale.
- Source facts, deterministic calculations, dashboard-local inputs, human decisions, and future AI output remain distinguishable.
- Local planning decisions never write to the source system.
- The selected visual direction is **Calm Operations**.

## Current authoritative delivery state

### Completed foundations and Prioritization

- Issue #15 and PR #16 are merged and closed after the Product Owner's separate Acceptance Verification. The governed Prioritization workspace is now on `main`.
- The original 81-check audit totals of 34 Pass, 6 Partial, and 41 Fail describe the pre-rework state only. They are historical evidence, not the current result.
- Implemented corrections include mandatory work stored as not scored, eligibility gates, explicit Current Rank and Recommended Rank, required override rationale, evidence validation, Relative Weighting percentages, versioned Decision History, explicit Unestimated values, governed Job Sizes, readable audit events, role-based visible actors, normalized numeric inputs, and URL-backed active-tab persistence.
- Epic-level Prioritization comparison remains separate work under #26 and its Tasks #71-#76.
- Issue #64 / PR #65 fixed stale Prioritization state when changing projects. It is merged and closed.
- Issue #66 / PR #67 restored visible keyboard focus on selectors and search inputs. It is merged and closed after hands-on owner verification.
- HO-021's suspected selector test/source mismatch was resolved by Claude's HO-023 audit as a stale or mid-edit local checkout artifact, not a repository or live-product defect. Freshly sync the authoritative branch before reporting a local failure as a product defect.

### Canonical work-item foundation

- Issue #32 and PR #60 are merged and closed after separate owner Acceptance Verification.
- The common source-independent model supports Epic, Story, Bug, and Enabler identity; source/local ownership boundaries; deterministic Age and Cycle Time; governed estimate values; explicit Unestimated state; separate source and local Sprint IDs; local-overlay preservation; and extension by #22 without a parallel model.
- Issue #32 is the accepted Child 1 foundation for Epic #31.

### Continuous integration

- Issue #63 is closed. PR #61 added `.github/workflows/ci.yml`; PR #62 added the required `package-lock.json`; both are merged.
- CI runs on every pull request and every push to `main`.
- Verification runs `npm run install:ci`, `npm run lint`, then `npm test`; the test command includes the production build.
- Deployment/CD remains manual and separate.
- Making CI a required branch-protection status check remains follow-up scope related to #53.

### Story sizing and session-drift governance

Issue #70 records the accepted empirical sizing method and drift thresholds established in HO-024 through HO-027.

- Use the governed Fibonacci scale: `1, 2, 3, 5, 8, 13`.
- Estimate from concrete complexity signals: files and layers touched, established pattern versus novel design, cross-cutting risk, and likely correction rounds. Do not treat points as a token-count prediction.
- `1-5` accumulated points: low drift risk and normally safe in one session.
- `6-8` points: near the reliable ceiling but workable.
- `9-12` points: elevated risk; use a fresh-session checkpoint before crossing this range.
- `13` points: high risk from the outset; use a dedicated session and perform a decomposition review.
- Reliable target: no more than `8` total points per Codex working session.
- Correction-cycle trigger: after a second Product Owner or Claude correction round, stop adding scope, resync durable memory and handoff state, and consider a fresh session even when the total is below 8.
- Completed-work anchors include #54 at 1 point, #66 at 3, #32 as a clean 5-point benchmark, #64 at 5 after correction, and #15 at 13 and too large for a healthy single story.

## Active priority — issue #33

HO-030 authorizes Epic #31 Child 2, issue #33, **Add Profile and System Settings structure**, as the next implementation story.

Authoritative starting state at this refresh:

- #32 is accepted, merged, and closed.
- #33 is open and approved to start, with no implementation branch or PR yet when HO-030 was posted.
- #33 is sized at 8 points and must receive a dedicated working session. Do not combine it with unrelated implementation work.
- Create a new branch and draft PR from current `main`.
- Read the complete #33 issue and comments before implementation.
- Use fictional sample Profile values only. No real personal names, email addresses, titles, or other personal data.
- #33 may establish extension points for Sprint and capacity settings, but Sprint-control business logic belongs to #34 and capacity-control business logic belongs to #36.
- Do not start #34 or any later Epic #31 child in the same pass.
- After coding is complete: run validation, post detailed Implementation History, move the existing #33 board item to **Review**, post the audit handoff, and stop for Product Owner review and Claude's independent audit.
- Do not perform owner Acceptance Verification, merge, close, or accept the work.

Issue #77 owns this documentation-only memory refresh. It must be reviewed and merged before beginning #33 in a fresh chat so a cold restart receives the current assignment.

## Epic #21 and Story #26 decomposition

Epic #21 adds first-class Epic visibility across the dashboard.

Story #26, Epic-level comparison in Prioritization, was recalibrated to 13 points and decomposed under HO-028 into six native Tasks:

| Issue | Task | Size |
|---|---|---:|
| #71 | Comparison-level selector | 3 |
| #72 | Epic candidate display fields | 5 |
| #73 | Item-level Epic context | 5 |
| #74 | Epic-level scoring integration | 8 |
| #75 | Epic decision recording | 5 |
| #76 | Validation, accessibility, and integration pass | 8 |

HO-029 records Codex's sizing evidence. Claude must independently audit the sizes before they enter the local tracker.

Dependency chain:

`#71 → (#72 and #73 independently) → #74 → #75 → #76`

Session constraints:

- #74 and #76 each run alone.
- #72 and #73 are dependency-parallel but total 10 points and must not share a Codex session.
- #75 and #76 total 13 and must not be batched.
- No Task exceeds the 8-point individual ceiling.

## Epic #31 dependency map

Epic #31 (#32-#45) establishes the shared backlog, Settings, Sprint calendar, capacity, sample data, history, cross-view migrations, reporting inputs, and simulated read-only refresh.

Critical boundaries:

- #32 is the accepted canonical common work-item model.
- #33 is the currently authorized Child 2.
- #22 must extend #32 and must not create a parallel model.
- #34 owns Sprint configuration business logic.
- #36 owns capacity configuration business logic.
- #37 depends on the canonical model, Epic extension, Sprint calendar, and capacity rules.
- #39 makes Backlog the complete visible inventory consumed by later view migrations.
- #41 owns the Sprints selector/item-membership defect.
- #42 migrates Prioritization to the shared model.
- #45 is the final integration gate.
- Follow each issue's current dependency section over any older summary.

## Confirmed data decisions

- Fixed sample calculation timestamp: July 20, 2026 at 12:00 PM in `America/Los_Angeles`.
- Sprint 1 anchor: August 25, 2025.
- Default Sprint cadence: two weeks; future Settings support one to four weeks.
- Sprint 24 is Current; Sprint 25 is Next in the approved sample timeline.
- Default planning horizon: 90 days, including every Sprint overlapping the boundary.
- Beyond-horizon work is **Future Backlog**.
- Estimates use `1, 2, 3, 5, 8, 13`; no 21 and no zero-as-missing.
- Incomplete Age is calculated from Created Date.
- Completed items use Cycle Time from Created Date to Completed Date and stop aging.
- Historical Sprint results use immutable snapshots rather than current item State.
- Source refresh preserves dashboard-local overlays.
- Prototype sample identities and contact data must be fictional.

## Known open product items

- #41: Sprints selector and item membership must derive from the same selected snapshot.
- #48: Decision History labeled-column table redesign.
- #59: standardize Points / Estimate / Job Size terminology across views.
- #13: Reports UI and statistical forecasting.
- Future AI Sprint-planning direction is not yet an implementation issue and must not be implemented without governed decomposition.

## Figma retrospective wireframe

A free Figma Starter draft named **AI Backlog Agent Dashboard — Product Wireframes** exists as living retrospective design documentation.

- Starter files are limited to three pages; the file uses sections and frames within those pages.
- Completed editable frames include the cover, product map, coverage board, Overview desktop wireframe, Backlog desktop wireframe, and Backlog item-detail drawer state.
- Prioritization and later screens remain pending.
- Figma Starter's MCP allowance is six tool calls per month. Automated Figma work paused after the limit was reached; do not recommend a paid upgrade unless the Product Owner asks.
- The wireframe documents implemented, approved-not-implemented, and future-concept states separately. It does not replace GitHub acceptance or live application evidence.

## Operational handoff history

Issue #57 is permanent and append-only. Key recent entries:

- HO-023 resolved the selector mismatch report as a stale-local-checkout artifact.
- HO-024 requested empirical Fibonacci sizing.
- HO-025 sized open work.
- HO-026 retrospectively sized completed work for calibration.
- HO-027 established the 8-point ceiling, drift bands, and correction-cycle trigger.
- HO-028 decomposed #26 into #71-#76 and requested Task sizing.
- HO-029 supplied sizes `3, 5, 5, 8, 5, 8` and validated the dependency chain.
- HO-030 authorizes #33 as the next implementation story.

Always read comments newer than HO-030 because they may supersede this snapshot. The issue body Active Task Card may lag the append-only comment log; verify both and treat the newest live evidence as authoritative.

## Governance and memory discipline

Required workflow:

Issue → acceptance criteria → board placement → branch → intentional commits → draft PR → detailed Implementation History → board **Review** → independent audit and Product Owner review → separate owner Acceptance Verification → owner merge → owner closure.

GitHub Project board requirements:

- Every new issue Codex creates must be added to Project #1 immediately. Creating an issue is not complete until its board item exists.
- If Codex cannot add the new issue to the board, it must stop rather than knowingly create an off-board issue. The Product Owner or Claude may create and place the issue before Codex proceeds.
- When Codex finishes approved coding work and the issue is ready for Product Owner review and Claude's independent audit, Codex must move the existing board item to **Review** before posting the handoff.
- Moving an issue to **Review** does not constitute owner Acceptance Verification, acceptance, merge approval, closure, or completion.

Memory responsibilities:

- `CODEX.md`: Codex's durable restart memory.
- Claude's governed Markdown memory: Claude's durable restart memory.
- Issue #57: controlled cross-agent handoffs and audit prompts.
- Issues, PRs, commits, checks, deployments, and live behavior: authoritative delivery evidence.
- Local gitignored memory files are convenience only and may disappear with workspace cleanup.

Refresh `CODEX.md` when active priorities, issue/PR states, governance, CI/deployment infrastructure, major implementations, audits, or next actions materially change.

## Immediate restart recommendation

A new Codex chat must:

1. Verify issue #77 and its memory-refresh PR are merged before relying on this `main` copy.
2. Read issue #57 comments newer than HO-030.
3. Inspect every open issue and draft/open PR and verify Project #1 state.
4. Confirm #33 remains the approved next story and that no implementation branch or PR was created in another session.
5. Read all of #33, including comments and acceptance criteria.
6. Treat #33 as a dedicated 8-point session; do not combine unrelated implementation work.
7. Use fictional Profile sample data only and preserve the Azure DevOps/Jira read-only boundary.
8. Implement only #33, then post detailed evidence, move its board item to Review, request Claude's independent audit, and stop for Product Owner review.

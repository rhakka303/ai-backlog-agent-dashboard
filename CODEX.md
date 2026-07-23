# CODEX.md — Codex Durable Project Memory

## Purpose

This tracked file is Codex's durable restart memory for the AI Backlog Agent Dashboard. A new Codex chat must read it after `AGENTS.md` and `CONTRIBUTING.md`, then verify every status statement against live GitHub before acting.

This file is not the delivery system of record. GitHub issues, pull requests, commits, checks, documentation, and deployment evidence remain authoritative.

Issue #57 is a controlled Claude-to-Codex operational handoff channel. It contains assignments, audits, findings, and exact next prompts; it is not a substitute for this durable memory.

Last refreshed: July 23, 2026.

## Authority and collaboration

- The repository owner is the Product Owner and final decision-maker.
- Codex is the sole AI implementer for dashboard application code, tests, deployments, detailed Implementation History, and implementation evidence.
- Claude may update Markdown documentation, independently audit GitHub work, and monitor or report security findings.
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
5. Verify repository, CI, and live deployment state rather than trusting this summary alone.
6. Report the orientation before modifying or posting anything.
7. Continue existing issues, branches, and PRs; do not create duplicates.
8. Keep owner Acceptance Verification, merge, and closure separate from implementation.
9. Do not begin a newer Epic child merely because its issue exists. Follow the approved one-child-at-a-time handoff.
10. Keep source-system integrations read-only.

## Product position

The dashboard is a working portfolio-quality prototype and a designed human-governed AI backlog agent. It is not production-ready and is not yet a live Azure DevOps/Jira or LLM integration.

Permanent principles:

- Refine with evidence, not instinct.
- Evidence before advice.
- AI may summarize, explain, flag, and propose.
- Humans supply accountable inputs, make final decisions, and record rationale.
- Source facts, deterministic calculations, dashboard-local inputs, human decisions, and future AI output remain distinguishable.
- Local planning decisions never write to the source system.
- The selected visual direction is **Calm Operations**.

## Current work streams

### Prioritization — issue #15 / draft PR #16

- Issue #15 remains open.
- Draft PR #16 remains open on `feature/prioritization-workspace`.
- The original 81-check Codex audit reported 34 Pass, 6 Partial, and 41 Fail. Those totals describe the pre-rework state and must not be treated as the current implementation result.
- Codex subsequently implemented the failed/partial batches on the existing branch, with targeted tests and repeated deployments.
- Claude's read-only audits through HO-009 found the reviewed fixes real, narrow, and free of the checked regressions.
- The live prototype reached Site version 16 for the latest Prioritization fixes in this work period.
- Issue #15 and PR #16 still require the Product Owner's separate Acceptance Verification and merge decision.

Important implemented corrections include:

- Mandatory work is classified and stored as not scored rather than using fake score `999`.
- Eligibility gates calculation, ranking, decisions, and recording.
- Current Rank and Recommended Rank are explicit.
- Override requires rationale.
- Evidence validation rejects placeholder evidence.
- Relative Weighting displays value and cost percentages.
- Decision History snapshots retain inputs, evidence, rank, version, formula, and framework data.
- Missing Job Size is `null` / **Unestimated**, never zero.
- Local Job Size uses only `1, 2, 3, 5, 8, 13`.
- Existing prototype history received a one-time schema reset.
- Visible actors use role labels; authenticated identity remains internal.
- Decision History displays only the selected human-readable method while retaining version data internally.
- Planning Audit Events render readable summaries rather than raw JSON.
- Numeric scoring fields normalize leading-zero entries such as `012` to `12`.
- Overview, Backlog, Prioritization, and Sprints persist their active tab across refresh through URL-backed state.

Scope boundaries:

- Epic comparison belongs to #26, not #15.
- Decision History's labeled-column table redesign belongs to #48, not #15.
- Cross-view Points/Estimate/Job Size terminology is issue #59.
- Do not merge PR #16 or close #15 without owner Acceptance Verification.

### Canonical work-item foundation — issue #32 / draft PR #60

- Issue #32 remains open and is the only Epic #31 child started in this sequence.
- Draft PR #60 remains open on `agent/canonical-work-item-foundation`.
- The branch was created from `main`, not from PR #16.
- The implementation adds the common source-independent model for Epic, Story, Bug, and Enabler; stable identity; source/local ownership boundaries; deterministic Age and Cycle Time; governed estimate values; explicit unestimated state; separate source/local Sprint IDs; local-overlay preservation; and a generic #22 extension path.
- Local validation passed: lint, production build, and 11/11 tests.
- Detailed Implementation History is on #32.
- Claude's HO-012 audit checked all 20 criteria against source and found no blocker or scope leakage.
- PR #60 remains draft and #32 remains open pending owner Acceptance Verification and merge decision.
- Do not start #33 or a later child until the owner explicitly authorizes it after #32's governed review.

### Continuous integration — issue #63

- Issue #63 is closed after owner verification.
- PR #62 added `package-lock.json` and is merged.
- PR #61 added `.github/workflows/ci.yml` and is merged.
- CI now runs on every pull request and every push to `main`.
- The verification sequence is:
  1. `npm run install:ci`
  2. `npm run lint`
  3. `npm test` (includes the production build)
- A real GitHub Actions `verify` run passed after the lockfile prerequisite merged.
- Deployment/CD remains manual and separate.
- Making CI a required branch-protection status check remains follow-up scope related to #53.

### Codex memory refresh — issue #49 / draft PR #50

- Issue #49 and draft PR #50 own this `CODEX.md` refresh.
- Branch: `docs/codex-handoff-issue-15-audit`.
- This is documentation-only. It must not modify application behavior or another work stream.
- The owner must merge PR #50 before a new chat reading `main` receives this refreshed memory.

## Operational handoff history

Issue #57 is permanent and append-only. During this work period:

- HO-004 reported the visible personal-name privacy regression.
- HO-005 through HO-009 recorded Prioritization fixes and independent audits.
- HO-010 authorized issue #32 only.
- HO-011 recorded #32 implementation.
- HO-012 reported Claude's independent #32 audit with no blockers.
- HO-013 requested the CI lockfile prerequisite.
- HO-014 recorded Codex's lockfile implementation.

Always read entries newer than HO-014 because they may supersede this snapshot.

## Epic and dependency map

Epic #21 (#22-#30) adds first-class Epic visibility. Epic #31 (#32-#45) establishes the shared backlog, Settings, Sprint calendar, capacity, sample data, history, cross-view migrations, reporting inputs, and simulated read-only refresh.

Critical boundaries:

- #32 is the canonical common work-item model.
- #22 must extend #32 and must not create a parallel model.
- #26 remains gated on accepted #15/PR #16.
- #37 depends on the canonical model, Epic extension, Sprint calendar, and capacity rules.
- #39 makes Backlog the complete visible inventory consumed by later view migrations.
- #41 owns the Sprints selector/item-membership defect.
- #42 migrates Prioritization to the shared model and depends on accepted #15/PR #16.
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

## Governance and memory discipline

Required workflow:

Issue → acceptance criteria → branch → intentional commits → draft PR → detailed Implementation History → separate owner Acceptance Verification → owner merge → owner closure.

GitHub Project board requirements:

- Every new issue Codex creates must be added to the repository's GitHub Project board immediately. Creating the issue is not complete until its board item exists.
- When Codex finishes the approved coding work and the issue is ready for Product Owner review and Claude's independent audit, Codex must move the existing board item to **Review** before posting the handoff.
- Moving an issue to **Review** does not constitute Product Owner Acceptance Verification, acceptance, merge approval, closure, or completion.

Memory responsibilities:

- `CODEX.md`: Codex's durable restart memory.
- Claude's memory Markdown: Claude's durable restart memory.
- Issue #57: controlled cross-agent handoffs and audit prompts.
- Issues, PRs, commits, checks, and deployments: authoritative delivery evidence.
- Local gitignored memory files are convenience only and may disappear with workspace cleanup.

Refresh `CODEX.md` when active priorities, issue/PR states, governance, CI/deployment infrastructure, major implementations, audits, or next actions materially change.

## Immediate restart recommendation

A new Codex chat should:

1. Verify whether PR #50 has merged. If not, read this file from `docs/codex-handoff-issue-15-audit` as well as `main`.
2. Inspect issue #15/PR #16 and issue #32/PR #60.
3. Read issue #57 entries newer than HO-014.
4. Verify CI checks on every active PR.
5. Ask the Product Owner which already-reviewed item should proceed; do not assume permission to merge, close, accept, or start #33.

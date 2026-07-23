# AGENTS.md — AI Backlog Agent Dashboard

## Why this file exists

This file is the durable project memory for Codex and other repository-aware agents. Read it before changing the project, especially when work starts in a new chat.

Do not treat chat history as the system of record. GitHub issues, pull requests, commits, repository documentation, and deployed verification evidence are authoritative.

After this file and `CONTRIBUTING.md`, read the tracked `CODEX.md` for the current operational handoff. Verify its status statements against live GitHub before acting; it summarizes but does not replace authoritative issues and pull requests.

## Product summary

The AI Backlog Agent Dashboard is a portfolio-quality product-owner prototype for understanding, refining, prioritizing, and reporting on delivery backlogs.

- Repository: https://github.com/rhakka303/ai-backlog-agent-dashboard
- Live prototype: https://ai-backlog-agent-dashboard.steven-gowan661.chatgpt.site
- Visual direction: **Calm Operations**
- Primary work types: Story, Bug, and Enabler
- Primary states include the delivery workflow used by the source system, including Testing.

The product should make governance and human accountability visible. AI may explain, summarize, identify patterns, and suggest options, but a human owns priority and sprint decisions.

## Product areas

The navigation currently includes:

1. **Overview** — backlog metrics, health, trends, and stage/state counts.
2. **Backlog** — read-only source work items and refinement context.
3. **Prioritization** — governed scoring and human decision workspace.
4. **Sprints** — sprint planning and delivery context.
5. **Reports** — reporting workspace; burnup and other delivery views may be expanded.
6. **AI Insights** — reserved for explainable, evidence-linked AI assistance.

When changing one tab, check whether shared concepts such as State, work type, story points, sprint, and filters must remain consistent across all tabs.

## Non-negotiable source-system boundary

Azure DevOps and Jira integrations are **read-only**.

- Never write, update, transition, assign, comment on, prioritize, or delete a source-system work item.
- Never implement automatic write-back.
- Local dashboard decisions must be clearly labeled as local planning decisions.
- Imported source values must remain distinguishable from local values.
- If the source already supplies story points, treat them as read-only.
- A local planning estimate may be entered only when source points are missing.
- Reconciliation means detecting or displaying source changes, not changing the source.
- Any future proposal to relax this boundary requires an explicit new governance decision from the repository owner.

## Prioritization decisions

The intended decision flow is:

1. Confirm eligibility and context.
2. Identify mandatory/compliance work.
3. Calculate a prioritization score.
4. Require a human decision and rationale.
5. Assign an approved item to a planned sprint.
6. Record who decided, when, with whom, using which method and inputs.

Current framework direction:

- WSJF is the default method.
- Theme Scoring and Relative Weighting are optional comparison methods.
- Scoring columns accept human input.
- Evidence and confidence should accompany scores.
- Sprint capacity has both a planning target and a hard maximum.
- Rows use distinct sprint colors.
- Capacity risk is amber; exceeding the hard maximum is red and blocks the decision.
- Sprint capacity can change, but changing the hard maximum must itself be an auditable human action.

## Current Prioritization milestone

GitHub issue #15 and draft PR #16 track the first Prioritization milestone:

- Issue: https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/15
- Draft PR: https://github.com/rhakka303/ai-backlog-agent-dashboard/pull/16
- Branch: `feature/prioritization-workspace`

Implemented in the prototype:

- WSJF, Theme Scoring, and Relative Weighting selection
- Human-editable scoring and decision inputs
- Evidence, confidence, rationale, owner, and participants
- Planned-sprint assignment
- Sprint target and hard-maximum capacity controls
- Sprint row colors and over-capacity blocking
- Browser-local decision history
- Explicit Azure DevOps/Jira no-write-back messaging

Known limitations:

- Browser-local history is not an authenticated, multi-user, immutable audit database.
- Live Azure DevOps/Jira ingestion and reconciliation are not connected.
- Full decision-version comparison and conflict handling remain.
- Comprehensive calculation, connector-boundary, accessibility, and acceptance tests remain.

Do not describe this milestone as production-ready. Do not merge PR #16 or close issue #15 until its remaining acceptance criteria are implemented and independently verified.

## Governance workflow

All material changes follow this sequence:

1. Create or confirm a GitHub issue.
2. Put testable acceptance criteria in the issue before implementation.
3. Refine scope in issue comments when new requirements appear.
4. Create a focused branch from the correct base.
5. Make small, intentional commits with meaningful messages.
6. Run relevant validation.
7. Open a draft pull request that relates to the issue without prematurely closing it.
8. Post a detailed **Implementation History** comment on the issue.
9. Post a separate **Acceptance Verification** comment mapping every criterion to evidence.
10. Merge and close only after all criteria pass.

An Implementation History must state, step by step:

- what changed;
- which files changed;
- branch and commit identifiers;
- commands/tests run and their results;
- deployment/version evidence when applicable;
- known limitations and remaining work;
- the merge/closure decision.

“Verification complete” without detailed evidence is insufficient.

Acceptance Verification must be separate from Implementation History. It must map each acceptance criterion to a pass/fail result and supporting evidence. A partial milestone is left open.

Preserve unrelated user changes. Never use destructive Git operations to discard work.

## Security and privacy

- Never commit credentials, access tokens, API keys, cookies, connection strings, personal data, or private source-system payloads.
- Use environment variables or an approved secret store for future connectors.
- Keep dependencies patched and preserve security fixes already merged into the repository.
- Treat AI-generated recommendations as untrusted input until a human reviews them.
- Do not expose private repository content in public artifacts.

## Prototype versus production

The current dashboard demonstrates product behavior and governance concepts. Mock data and browser-local persistence are acceptable only when clearly labeled.

A production version will need, at minimum:

- authenticated users and role-aware authorization;
- durable server-side storage;
- immutable/versioned audit events;
- read-only connector credentials with least privilege;
- source synchronization and reconciliation;
- validation, error handling, monitoring, and recovery;
- accessibility, security, calculation, integration, and acceptance tests.

Never imply these controls exist merely because the interface represents them.

## New-chat restart checklist

When resuming in a new Codex chat:

1. Read this file, `CONTRIBUTING.md`, `CODEX.md`, `docs/PRODUCT_VISION.md`, and `docs/ROADMAP.md`.
2. Inspect all open issues and all draft/open pull requests.
3. Read the target issue, all scope-refinement comments, and its acceptance criteria.
4. Check the relevant branch and recent commits before editing.
5. Verify whether the live site and repository branch are aligned.
6. Confirm that Azure DevOps/Jira remain read-only.
7. State what is already complete, what remains, and what will be changed.
8. Continue the existing issue/branch when appropriate; do not create duplicate work.
9. Update the issue with detailed implementation and verification evidence.
10. Keep unfinished issues open.

## Current handoff and next initiative

The repository owner is a solo Product Owner working with two AI collaborators: ChatGPT/Codex for product design, implementation, governance, and repository history; Claude for independent review, security auditing, and a second opinion. The owner makes final product and acceptance decisions.

Recent refinements added to issue #15:

- Sprint capacity cards must eventually come from read-only source iteration data and roll forward automatically when a sprint closes.
- Closed sprints move to reporting/history while local capacity settings and audit history remain attached to stable source iteration IDs.
- The Product Owner remains accountable for prioritization.
- A named acting delegate may receive temporary, scoped, expiring authority during PTO or other absence.
- Production delegation requires authenticated identity, authorization enforcement, and immutable audit events.

Current division of work:

1. The repository owner is the Product Owner and final decision-maker.
2. ChatGPT/Codex is the sole AI implementer for the dashboard application: governed issues, acceptance criteria, application source changes, tests, deployments, implementation history, and acceptance evidence.
3. Claude does **not** build, edit, or implement dashboard application code, configuration, dependencies, tests, or deployments.
4. Claude is permitted to create and update Markdown (`.md`) documentation, including Product Vision, Roadmap, audits, reviews, and governance documentation.
5. Claude's Markdown changes still require the normal issue, branch, pull-request, audit, and owner-acceptance workflow when they are material.
6. Claude independently audits Codex's work through GitHub incidents/issues, pull requests, comments, commits, and verification evidence.
7. Claude watches repository security alerts and reports security findings for governed remediation.
8. The owner brings approved vision, roadmap, audit, and documentation decisions to Codex when dashboard implementation is required.
9. Codex must treat Claude findings as independent review input, investigate them, and use the normal issue and acceptance workflow for any application fix.
10. Neither AI merges, closes, or declares final product acceptance without the owner's decision and satisfied governance evidence.
11. Present the product honestly as a working dashboard prototype and a designed human-governed AI backlog agent—not yet a production AI agent.

Memory work is tracked by issue #17 and draft PR #18:

- Issue: https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/17
- Draft PR: https://github.com/rhakka303/ai-backlog-agent-dashboard/pull/18
- Branch: `docs/codex-project-memory`

The hybrid memory model is:

- `AGENTS.md`: shared, durable repository governance and agent guidance.
- `CODEX.md`: tracked current operational handoff for new Codex chats.
- `CLAUDEMEMORY.md`: private, local, gitignored Claude discussion.
- `CODEXMEMORY.md`: private, local, gitignored Codex discussion.
- GitHub issues and pull requests: authoritative delivery history.

## July 20, 2026 operational status

Issue #15 and draft PR #16 remain the active implementation priority. Do not begin the newer Epics merely because their issues exist, and do not merge or close #15/#16 until the remaining acceptance criteria are implemented and the repository owner posts separate Acceptance Verification.

Two coordinated initiatives are fully decomposed but not yet implemented:

- Epic #21 with children #22-#30 adds first-class Epic visibility across Overview, Backlog, Prioritization, Sprints, Reports, and AI evidence surfaces.
- Epic #31 with children #32-#45 establishes the canonical work-item model, Profile/System Settings, generated Sprint calendar, governed capacity, representative sample data, immutable historical snapshots, complete Backlog inventory, cross-view migrations, reporting inputs, simulated read-only refresh, and final validation.

Critical sequencing:

- #32 establishes the canonical common work-item foundation.
- #22 extends #32 with Epic-specific relationships and must not create a parallel source of truth.
- #37 depends on the canonical model, Epic extension, Sprint calendar, and capacity rules.
- #39 makes Backlog the complete visible inventory consumed by the other views.
- #40-#44 migrate the views and shared reporting/refresh behavior.
- #45 is the final integration gate after #32-#44 and #22 receive owner acceptance.

A real Sprints defect is tracked by #41: selecting a Sprint changes summary data while the item table can continue showing a fixed set. The correction must make every displayed Sprint field and item membership derive from the same selected historical snapshot.

A future human-governed AI Sprint-planning direction has been discussed but is not yet an implementation issue. After humans supply accountable ratings and deterministic weighted scores, AI may propose an ordered, capacity-aware multi-Sprint Draft without exceeding Hard Maximums. Each Sprint must be expandable for inspection. Only an authorized human may edit and move the plan from Draft to Accepted, and acceptance never writes to Azure DevOps or Jira. See `CODEX.md` for the full current handoff and create governed issues before implementation.

Issue #46 tracks the documentation-only refresh that added `CODEX.md` and updated this file. No application behavior is part of #46.

## Claude <-> Codex handoff protocol

Issue [#57](https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/57) (`[Handoff] Claude <-> Codex operational handoff surface`) is the shared handoff surface between Claude and Codex, reducing manual copy-paste between the repository owner's separate chat sessions while keeping GitHub authoritative. Full design rationale: [#56](https://github.com/rhakka303/ai-backlog-agent-dashboard/issues/56).

**Why an Issue, not a Discussion or a file.** A tracked `handoff.md` file would require a branch and pull request per handoff under this repository's branch-protection ruleset. A GitHub Discussion was rejected after Codex verified its connected GitHub tools have no Discussions access at all. A dedicated Issue uses a mechanism both agents already have proven, reliable access to.

**Structure.** The issue body is the current Active Task Card (overwritten as state changes: Handoff ID, project, timestamps, prepared by, from/intended recipient, agent statuses, owner approval, supersedes-handoff reference, Owner Request, Current Authoritative State, Findings, Work Completed, Recommended Status Changes, Risks, Required Next Action, Exact Prompt for the receiving agent). Comments are the append-only Handoff Log.

**Mandatory rules:**

- **Human Gate.** The active agent must show findings, recommended status changes, and the exact next-step prompt in chat and receive the owner's explicit approval before posting anything to issue #57.
- **Active/Standby.** Only one agent is Active at a time. Standby means authorized work is complete, no further project changes will be made, and future work has not yet been accepted.
- **Independent reorientation required.** The receiving agent must verify against live GitHub state (target issue, PR, branch, commits, deployment) before acting. The handoff issue accelerates orientation; it never replaces verification.
- **Completion claims require verification, not trust.** Treat any "this is done" statement, from either agent or the owner's relay of one, as a claim to independently check, not an established fact. This rule exists because it already caught real defects once (a Project Board completion claim that turned out to have real gaps once audited).
- **Evidence levels.** Every finding is tagged Verified, Reported, Inferred, or Unknown.
- **Status changes are recommendations only.** No agent updates a product issue's status, a PR, or the Project Board merely because it recommended a change. Owner approval must be recorded first.
- **No product mutations from editing the handoff issue itself.** Posting to #57 is communication only; it never itself authorizes source changes, GitHub status changes, Project Board changes, merges, or closures.
- **Public-information boundary.** Never post personal email addresses, credentials, tokens, private local paths, confidential information, or unnecessary personal identifiers to #57 -- it is public.
- **Owner approval reference.** Chat approval usually has no durable public URL. Record it as the exact owner-approved statement plus a UTC timestamp, unless the owner explicitly records approval on GitHub instead.
- **Failure fallback.** If issue #57 becomes unavailable or inaccessible to either agent, fall back to posting on the relevant product issue's own comments -- never rely on silent chat memory instead.
- **Template size control.** The Active Task Card holds only the current assignment. Link to the authoritative issue/PR for detailed evidence rather than duplicating it.
- **Supersession.** Every new Handoff ID explicitly supersedes the prior active handoff, so two assignments never appear simultaneously active.
- **Correction protocol.** If either agent finds the handoff issue conflicts with live GitHub state, say so immediately, cite the real GitHub source, and pause rather than continue from stale information.
- **Handoff Log entries are permanent once posted.** Never edit or delete a comment on #57. To correct a mistake, post a new comment that references and corrects the original.
- **Issue #57 itself never closes.** It is the permanent operational surface, not a completable task.
- **Excluded from the Project Board.** Issue #57 is not added to Project #1, so it never appears in Board, Roadmap, or Insights views.

**Framework Improvement Trigger.** When either agent discovers drift, incomplete verification, ambiguous authority, a failed handoff, duplicated work, an unsafe permission, or a misleading completion claim, it must: document the incident, explain the governance weakness, propose a specific protocol improvement, obtain the owner's approval, and update this governing section separately from the active handoff on #57.

## Maintaining this memory

Update this file when a durable project decision changes, a major tab is completed, governance changes, or a production limitation is resolved.

Do not fill it with temporary chat details. Link to the authoritative issue or pull request for detailed history.

A `CLAUDEMEMORY.md` or similar assistant-specific file may also exist. Keep durable facts aligned, but use this `AGENTS.md` as Codex's automatic repository guidance. If the files conflict, stop and ask the repository owner which decision is current.

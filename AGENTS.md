# AGENTS.md — AI Backlog Agent Dashboard

## Why this file exists

This file is the durable project memory for Codex and other repository-aware agents. Read it before changing the project, especially when work starts in a new chat.

Do not treat chat history as the system of record. GitHub issues, pull requests, commits, repository documentation, and deployed verification evidence are authoritative.

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

1. Read this file and `CONTRIBUTING.md`.
2. Inspect open issues and draft/open pull requests.
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

- `AGENTS.md`: shared, safe repository guidance.
- `CLAUDEMEMORY.md`: private, local, gitignored Claude discussion.
- `CODEXMEMORY.md`: private, local, gitignored Codex discussion.
- GitHub issues and pull requests: authoritative delivery history.

## Maintaining this memory

Update this file when a durable project decision changes, a major tab is completed, governance changes, or a production limitation is resolved.

Do not fill it with temporary chat details. Link to the authoritative issue or pull request for detailed history.

A `CLAUDEMEMORY.md` or similar assistant-specific file may also exist. Keep durable facts aligned, but use this `AGENTS.md` as Codex's automatic repository guidance. If the files conflict, stop and ask the repository owner which decision is current.

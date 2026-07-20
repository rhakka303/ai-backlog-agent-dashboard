# Product Vision — AI Backlog Agent Dashboard

## The problem

Product Owners currently manage backlog work across multiple disconnected spreadsheets, then manually turn that into charts and reports. Azure DevOps is the actual system of record for the backlog, so POs are also constantly cross-checking spreadsheet data against DevOps by hand, and the two can drift out of sync.

This isn't hypothetical. A manager overseeing this project maintains a fully manual spreadsheet tracking backlog items across every department's stories, not one team's slice, the whole scope, because the available tools do not meet this cross-department reporting need.

## Who it serves

Product Owners own this problem directly. Scrum Masters, engineering leads, and other stakeholders who pull from the same inconsistent sources feel it too.

## What it does

One dashboard, read-only against the real source of truth, Azure DevOps and eventually Jira, so backlog status, prioritization, and sprint context are visible without logging into DevOps and clicking through boards for a simple answer.

As the product's own UI states:

> "Refine with evidence, not instinct."

## Why human governance matters

Product Owners are the subject-matter experts on their product. They are personally accountable for every story, bug, and enabler, and for what gets prioritized and pulled into a sprint.

AI can summarize and suggest, but it cannot hold that accountability. So the dashboard has a hard rule: AI never invents a prioritization score and never writes back to the source of truth. Every decision requires a human, with a recorded rationale.

"Evidence before advice" is a permanent product principle, applied consistently across Prioritization, Reports, and AI Insights as each is built out, not just where it happens to exist today.

## How success is measured

### Today — Prototype

- Cuts the number of separate tools a PO touches for a status or report.
- Demonstrates traceable prioritization decisions by recording who, when, and why in browser-local history. Production-grade durable and authenticated audit history remains future work.
- The read-only boundary against the source of truth holds without exception.

### Future — Live LLM and Azure DevOps/Jira synchronization

Each measure requires a defined baseline before it becomes meaningful:

- Average time spent reconciling spreadsheet and source data.
- Number of tools or files used per reporting cycle.
- Percentage of decisions with a recorded rationale.
- Sprint predictability, with the calculation method and measurement window still to be defined.
- Active Product Owner usage and reporting cycles completed.

## Current product status

The dashboard today is honestly a prototype. It is not yet connected to a live LLM or a live Azure DevOps/Jira feed. Both are required before the future success measures become meaningful.

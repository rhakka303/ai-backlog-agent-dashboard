# Extending the AI Backlog Agent prototype

This prototype intentionally keeps its data local and its AI area inactive. The dashboard is useful for testing metric definitions and interaction patterns before connecting real systems.

## Source map

- `app/page.tsx` contains the semantic page markup, sample data, metric calculations, chart rendering, filters, backlog drawer, and interaction logic.
- `app/globals.css` contains the complete responsive Calm Operations visual system.
- `EXTENDING.md` is this handoff guide.

## 1. Replace the sample data

Create a read-only adapter for Azure DevOps, Jira, a CSV export, or Google Sheets. Normalize each source into two stable shapes:

```ts
type Snapshot = {
  label: string;
  backlog: number;
  completed: number;
  ready: number;
  aging: number;
  predictability: number;
};

type BacklogItem = {
  id: string;
  title: string;
  kind: "Story" | "Bug" | "Enabler";
  age: number;
  status: "Ready" | "Needs refinement" | "Blocked";
  points: number;
};
```

Start with a CSV or Google Sheets import. It is easier to verify calculations with a frozen input before handling live API pagination, authentication, and rate limits.

## 2. Make policies configurable

The prototype treats items older than 30 days as aging. A real team should define:

- aging thresholds;
- the Definition of Ready;
- which backlog states count toward each metric;
- the sprint window used for trends;
- how predictability is calculated.

Keep these settings separate from the chart code so the dashboard explains the team's policy instead of hiding it.

## 3. Add an evidence-first AI endpoint

When AI is added, send only the normalized metrics and the selected backlog items. Require a structured response such as:

```json
{
  "insight": "Five high-age items are still missing acceptance criteria.",
  "evidence": ["CRM-184", "CRM-193"],
  "calculationWindow": "Sprint 21–24",
  "generatedAt": "2026-07-18T17:00:00Z"
}
```

Render the supporting item IDs beside every insight. Do not let the model silently reprioritize, rewrite, or move work.

## 4. Preserve the human decision

Treat AI output as a review prompt. Give the Product Owner explicit controls to accept, edit, dismiss, or request supporting evidence. Log that decision separately from the model output.

## Suggested build order

1. Import a fixed CSV or Sheet.
2. Unit-test every metric against known values.
3. Add loading, empty, stale, partial, and error states.
4. Connect a read-only Azure DevOps or Jira API.
5. Add AI summaries with evidence and timestamps.
6. Add write-back only after review and audit requirements are defined.

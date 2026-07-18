# AI Backlog Agent Dashboard

An interactive product-operations prototype for exploring backlog health, sprint trends, aging work, readiness, and predictability before adding evidence-based AI insights.

**Live prototype:** [ai-backlog-agent-dashboard.steven-gowan661.chatgpt.site](https://ai-backlog-agent-dashboard.steven-gowan661.chatgpt.site)

## Why this project exists

Product Owners need more than a raw backlog count. They need to see whether work is becoming ready, aging without a decision, flowing through review, and moving predictably across sprints.

This prototype turns those questions into a working, testable interface. It was designed as a product concept first: define the decisions, visualize the supporting metrics, and reserve AI for explainable suggestions with human review.

## Current capabilities

- Switch between representative product backlogs
- Compare sprint snapshots
- Recalculate backlog, readiness, aging, and predictability metrics
- View four- or eight-sprint trends
- Toggle backlog and completion chart series
- Review representative backlog items
- Filter aging and not-ready work
- Search by item ID or title
- Reserve a clearly inactive space for future AI insights
- Use responsive layouts with accessible controls

## Product principles

- **Evidence before recommendation:** future AI insights should cite the backlog items and metric window supporting each suggestion.
- **Human accountability:** AI may suggest questions or risks, but the Product Owner decides what changes.
- **Policy transparency:** aging thresholds, Definition of Ready, and predictability formulas must be configurable and visible.
- **Read-only first:** validate calculations against a CSV or Google Sheet before connecting live systems or enabling write-back.

## Technology

- React
- TypeScript
- Vinext / Vite
- CSS
- Cloudflare-compatible worker build

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Repository map

- `app/page.tsx` — sample data, metric calculations, interface markup, chart, filters, and interactions
- `app/globals.css` — Calm Operations visual system and responsive behavior
- `app/layout.tsx` — document metadata and root layout
- `EXTENDING.md` — data-integration, metric-policy, and AI-extension guidance

## Roadmap

1. Import a fixed CSV or Google Sheet.
2. Unit-test metric definitions against known values.
3. Add loading, empty, stale, partial, and error states.
4. Connect a read-only Azure DevOps or Jira API.
5. Add evidence-linked AI summaries with timestamps.
6. Consider write-back only after review, permissions, and audit requirements are defined.

## Status

This is a working prototype using local sample data. It does not currently connect to a production backlog or generate live AI recommendations.

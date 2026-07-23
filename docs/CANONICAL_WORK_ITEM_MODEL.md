# Canonical work-item foundation

Issue #32 defines one source-independent contract for every Epic, Story, Bug, and Enabler. The executable contract is `app/workItemModel.mjs`.

## Ownership boundaries

The model separates fields by owner:

- `identity` is the stable source-system identity: source system, organization, project, and work-item ID. Titles are never identity.
- `source` contains read-only source facts and provenance.
- `local` contains dashboard-local human overlays. A source refresh must preserve this object.
- `audit` identifies the calculation timestamp used for derived values.
- `extensions` is a namespaced extension point. Issue #22 can attach Epic-specific data there without changing or duplicating the common contract.

No source-system write operation is exposed.

## Estimates

An estimate is either absent (`null`) or one of `1, 2, 3, 5, 8, 13`. Zero and 21 are invalid.

`source.storyPoints` and `local.planningEstimate` are distinct. Source Story Points always take precedence. A Local Planning Estimate is permitted only while source Story Points are absent.

## Dates and calculations

Prototype samples use the fixed calculation timestamp **July 20, 2026 at 12:00 PM Pacific** (`2026-07-20T19:00:00.000Z`).

- Incomplete item: `Age = calculation timestamp - Created Date`.
- Completed item: `Cycle time = Completed Date - Created Date`.
- A completed item's reported age equals its cycle time and never continues accumulating.

Dates, estimates, current source Sprint identity, local planned Sprint identity, readiness evidence, blocked state, priority/rank, project, team, refresh time, and estimate-change history are explicit fields rather than inferred from titles or labels.

## Scope

This foundation deliberately contains no Epic parent/child relationship, rollup, or `No Epic assigned` behavior. Those belong to issue #22 and must extend this model through the generic extension namespace.

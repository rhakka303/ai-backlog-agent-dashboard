# Contributing

This repository uses a small human-in-the-loop workflow for every meaningful change.

## Workflow

1. Create an issue before changing the product.
2. Describe the problem, user value, scope, and acceptance criteria.
3. Make the smallest change that satisfies the issue.
4. Validate the behavior and relevant edge cases.
5. Post an **Implementation History** comment.
6. Post a separate **Acceptance Verification** comment.
7. Close the issue only after both comments are posted.

An issue must not be closed until an Implementation History comment and a separate Acceptance Verification comment have both been posted. A single "verification completed" comment is not sufficient on its own.

## Implementation History comment

Documents what actually happened, separate from whether it worked. Required on every issue before closure.

- Step-by-step actions performed
- Files changed
- Behavior added or removed
- Branch and commits
- Tests/builds performed
- Deployment result
- PR and merge information

Template:

```
## Implementation History

### Changes made
1. ...
2. ...
3. ...

### Files changed
- `path/file`: description

### Validation performed
- Build:
- Tests:
- Responsive/accessibility checks:
- Deployment:

### GitHub history
- Branch:
- Commits:
- Pull request:
- Merge commit:

### Known limitations
- ...
```

## Acceptance Verification comment

Documents whether the work actually satisfies the issue's stated acceptance criteria. Required on every issue before closure, separate from Implementation History.

- Each acceptance criterion checked individually
- Pass/fail result per criterion
- Evidence or explanation for each result
- Final closure decision (close, or not, and why)

Template:

```
## Acceptance Verification

- [ ] Criterion 1 — Pass/Fail — evidence or explanation
- [ ] Criterion 2 — Pass/Fail — evidence or explanation

### Closure decision
Close / Do not close — reason
```

## Issue content

Each issue should include:

- Problem or opportunity
- Intended user
- Product outcome
- In scope
- Out of scope
- Acceptance criteria
- Validation notes

## Code comments

Comment the *why*, not the *what* — good naming should already cover what code does.

- Every new file or component gets a short comment explaining its purpose.
- Comment non-obvious logic: calculations, thresholds, business rules, workarounds, anything a future reader would have to reverse-engineer otherwise.
- Skip comments on self-explanatory code.
- Update comments when the code they describe changes — a stale comment is worse than none.

## AI-assisted work

AI may help draft code, tests, documentation, or analysis. A human remains responsible for:

- confirming metric definitions;
- validating source data;
- reviewing security and privacy effects;
- verifying acceptance criteria;
- approving any change that affects backlog data or prioritization.

AI suggestions must not silently reprioritize, rewrite, or move backlog work.

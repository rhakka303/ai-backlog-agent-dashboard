import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Prioritization remounts at the project boundary", async () => {
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const prioritizationElement = pageSource.match(/<PrioritizationView\b[^>]*\/>/)?.[0] ?? "";

  assert.match(prioritizationElement, /\bkey=\{project\.shortName\}/);
  assert.match(prioritizationElement, /\bprojectName=\{project\.name\}/);
  assert.match(prioritizationElement, /\bitems=\{project\.items\}/);
  assert.match(prioritizationElement, /\biterations=\{project\.iterations\}/);
});

test("Prioritization storage remains isolated by project", async () => {
  const viewSource = await readFile(new URL("../app/PrioritizationView.tsx", import.meta.url), "utf8");

  assert.match(viewSource, /const storageKey = `priority-prototype:\$\{projectName\}`/);
});

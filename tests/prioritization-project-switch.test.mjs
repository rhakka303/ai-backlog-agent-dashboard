import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Prioritization remounts at the project boundary", async () => {
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const prioritizationElement = pageSource.match(/<PrioritizationView\b[\s\S]*?\/>/)?.[0] ?? "";

  assert.match(prioritizationElement, /\bkey=\{project\.shortName\}/);
  assert.match(prioritizationElement, /\bprojectName=\{project\.name\}/);
  assert.match(prioritizationElement, /\bprojectNames=\{projects\.map\(\(item\) => item\.name\)\}/);
  assert.match(prioritizationElement, /\bselectedProjectIndex=\{projectIndex\}/);
  assert.match(prioritizationElement, /\bonProjectChange=\{changeProject\}/);
  assert.match(prioritizationElement, /\bitems=\{project\.items\}/);
  assert.match(prioritizationElement, /\biterations=\{project\.iterations\}/);
});

test("Prioritization exposes the visible Project field as a selector", async () => {
  const viewSource = await readFile(new URL("../app/PrioritizationView.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(viewSource, /<input value=\{projectName\} readOnly/);
  assert.match(viewSource, /<select value=\{selectedProjectIndex\}/);
  assert.match(viewSource, /onProjectChange\(Number\(event\.target\.value\)\)/);
  assert.match(viewSource, /projectNames\.map\(\(name, index\) => <option/);
});

test("Prioritization storage remains isolated by project", async () => {
  const viewSource = await readFile(new URL("../app/PrioritizationView.tsx", import.meta.url), "utf8");

  assert.match(viewSource, /const storageKey = `priority-prototype:\$\{projectName\}`/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Prioritization remounts at the project boundary", async () => {
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const prioritizationElement = pageSource.match(/<PrioritizationView\b[\s\S]*?\/>/)?.[0] ?? "";

  assert.match(prioritizationElement, /\bkey=\{project\.shortName\}/);
  assert.match(prioritizationElement, /\bprojectName=\{project\.name\}/);
  assert.match(prioritizationElement, /\bitems=\{project\.items\}/);
  assert.match(prioritizationElement, /\biterations=\{project\.iterations\}/);
});

test("Prioritization keeps one global selector and a synchronized project display", async () => {
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const viewSource = await readFile(new URL("../app/PrioritizationView.tsx", import.meta.url), "utf8");

  assert.match(pageSource, /<select value=\{projectIndex\} onChange=\{\(event\) => changeProject\(Number\(event\.target\.value\)\)\}>/);
  assert.match(viewSource, /<input value=\{projectName\} readOnly aria-label="Selected project" \/>/);
  assert.doesNotMatch(viewSource, /<select value=\{selectedProjectIndex\}/);
});

test("Prioritization storage remains isolated by project", async () => {
  const viewSource = await readFile(new URL("../app/PrioritizationView.tsx", import.meta.url), "utf8");

  assert.match(viewSource, /const storageKey = `priority-prototype:\$\{projectName\}`/);
});

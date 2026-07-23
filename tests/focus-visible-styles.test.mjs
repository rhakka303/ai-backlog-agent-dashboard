import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("selectors and search inputs restore the shared keyboard focus ring", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const override =
    ".select-control select:focus-visible, .backlog-search input:focus-visible, .search-box input:focus-visible { outline: 3px solid rgb(22 125 120 / 28%); outline-offset: 2px; }";

  assert.ok(css.includes(".select-control select { min-width: 180px; border: 0; outline: 0;"));
  assert.ok(css.includes(".backlog-search input { width: 100%; border: 0; outline: 0;"));
  assert.ok(css.includes(".search-box input { width: 100%; border: 0; outline: 0;"));
  assert.ok(css.includes(override));
  assert.ok(css.indexOf(override) > css.indexOf(".search-box input {"));
});
